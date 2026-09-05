package com.stuti.app;

import android.Manifest;
import android.content.Intent;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.vosk.Model;
import org.vosk.Recognizer;

/**
 * Follow's ears on Android: a streaming, on-device recognizer (Vosk) that
 * never closes the microphone between phrases — unlike the system
 * SpeechRecognizer, which ends a session at every pause and loses the
 * first syllables of the next one on restart.
 *
 * The audio loop is our own (not Vosk's SpeechService): tenth-of-a-second
 * chunks for a quicker partial, an optional grammar so the recognizer
 * listens for the stotra's own words, and a copy of the session's audio
 * kept in the cache so the founder can share a real chant for tuning.
 *
 * Models are fetched on demand into filesDir/vosk/<id>/ (opt-in: nothing is
 * downloaded until the user asks for Follow and agrees). Events:
 *   partial  { text }        — the current phrase so far
 *   result   { text }        — a phrase the engine considers finished
 *   progress { id, pct }     — model download/unpack progress
 *   error    { message }
 */
@CapacitorPlugin(
    name = "StutiVosk",
    permissions = { @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }) }
)
public class StutiVoskPlugin extends Plugin {

    private static final String TAG = "StutiVosk";
    private static final int RATE = 16000;
    private static final int CHUNK = RATE / 10;          // samples per read: 100 ms

    private Model model;
    private String modelId;
    private Thread loop;
    private volatile boolean running;
    private final Handler main = new Handler(Looper.getMainLooper());

    private File modelDir(String id) {
        return new File(new File(getContext().getFilesDir(), "vosk"), id);
    }

    private boolean modelReady(String id) {
        File d = modelDir(id);
        return d.isDirectory() && new File(d, "am").isDirectory() && new File(d, "conf").isDirectory();
    }

    private File wavFile() { return new File(getContext().getCacheDir(), "follow-last.wav"); }
    private File logFile() { return new File(getContext().getCacheDir(), "follow-last.txt"); }

    @PluginMethod
    public void modelStatus(PluginCall call) {
        String id = call.getString("id", "");
        JSObject r = new JSObject();
        r.put("ready", modelReady(id));
        call.resolve(r);
    }

    @PluginMethod
    public void downloadModel(PluginCall call) {
        String id = call.getString("id", "");
        String url = call.getString("url", "");
        if (id.isEmpty() || url.isEmpty()) { call.reject("id and url required"); return; }
        if (modelReady(id)) { JSObject r = new JSObject(); r.put("ready", true); call.resolve(r); return; }
        new Thread(() -> {
            File target = modelDir(id);
            File tmp = new File(getContext().getCacheDir(), id + ".zip");
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                c.setConnectTimeout(20000);
                c.setReadTimeout(60000);
                c.connect();
                if (c.getResponseCode() != 200) throw new Exception("HTTP " + c.getResponseCode());
                long total = c.getContentLengthLong();
                try (InputStream in = new BufferedInputStream(c.getInputStream()); FileOutputStream out = new FileOutputStream(tmp)) {
                    byte[] buf = new byte[64 * 1024];
                    long done = 0; int n; int lastPct = -1;
                    while ((n = in.read(buf)) > 0) {
                        out.write(buf, 0, n);
                        done += n;
                        int pct = total > 0 ? (int) (done * 90 / total) : 0;   // 0–90 download, 90–100 unpack
                        if (pct != lastPct) { lastPct = pct; progress(id, pct); }
                    }
                }
                unzip(tmp, target);
                tmp.delete();
                progress(id, 100);
                if (!modelReady(id)) throw new Exception("archive did not contain a model");
                JSObject r = new JSObject(); r.put("ready", true);
                call.resolve(r);
            } catch (Exception e) {
                tmp.delete();
                deleteRecursive(target);
                call.reject("download failed: " + e.getMessage());
            }
        }).start();
    }

    /* the zip holds one top-level folder named after the model; its contents
       become <target>/ so the id decides the path, not the archive */
    private void unzip(File zip, File target) throws Exception {
        deleteRecursive(target);
        target.mkdirs();
        try (ZipInputStream z = new ZipInputStream(new BufferedInputStream(new FileInputStream(zip)))) {
            ZipEntry e;
            byte[] buf = new byte[64 * 1024];
            while ((e = z.getNextEntry()) != null) {
                String name = e.getName();
                int slash = name.indexOf('/');
                String rel = slash >= 0 ? name.substring(slash + 1) : name;
                if (rel.isEmpty()) continue;
                File f = new File(target, rel);
                if (!f.getCanonicalPath().startsWith(target.getCanonicalPath())) throw new Exception("bad zip entry");
                if (e.isDirectory()) { f.mkdirs(); continue; }
                f.getParentFile().mkdirs();
                try (FileOutputStream out = new FileOutputStream(f)) {
                    int n; while ((n = z.read(buf)) > 0) out.write(buf, 0, n);
                }
            }
        }
    }

    private void deleteRecursive(File f) {
        if (f == null || !f.exists()) return;
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteRecursive(k);
        f.delete();
    }

    private void progress(String id, int pct) {
        JSObject d = new JSObject(); d.put("id", id); d.put("pct", pct);
        notifyListeners("progress", d);
    }

    @PluginMethod
    public void deleteModel(PluginCall call) {
        String id = call.getString("id", "");
        stopInternal();
        if (id.equals(modelId)) { if (model != null) model.close(); model = null; modelId = null; }
        deleteRecursive(modelDir(id));
        call.resolve();
    }

    /* ---- the model's vocabulary, so the page can pick the words that sound
       like the stotra's and hand them back as a grammar ---- */
    @PluginMethod
    public void vocab(PluginCall call) {
        String id = call.getString("id", "");
        if (!modelReady(id)) { call.reject("model-missing"); return; }
        new Thread(() -> {
            try {
                File dir = modelDir(id);
                StringBuilder sb = new StringBuilder();
                File wordsTxt = new File(dir, "graph/words.txt");
                if (wordsTxt.isFile()) {
                    try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(wordsTxt), StandardCharsets.UTF_8))) {
                        String line;
                        while ((line = br.readLine()) != null) {
                            int sp = line.indexOf(' ');
                            sb.append(sp > 0 ? line.substring(0, sp) : line).append('\n');
                        }
                    }
                } else {
                    readFstSymbols(new File(dir, "graph/Gr.fst"), sb);
                }
                Log.d(TAG, "vocab " + id + ": " + sb.length() + " chars");
                JSObject r = new JSObject(); r.put("words", sb.toString());
                call.resolve(r);
            } catch (Throwable e) {
                Log.e(TAG, "vocab failed", e);
                call.reject("vocab failed: " + e);
            }
        }).start();
    }

    /* The small models keep their word list only inside Gr.fst, as an
       OpenFst SymbolTable: magic, name, available key, size, then
       (length-prefixed string, int64 key) per entry — all little-endian. */
    private void readFstSymbols(File fst, StringBuilder out) throws Exception {
        /* the table sits right after the FST header (a few dozen bytes in);
           the file is 30 MB, so map it rather than read it onto the heap */
        try (RandomAccessFile raf = new RandomAccessFile(fst, "r"); java.nio.channels.FileChannel ch = raf.getChannel()) {
            ByteBuffer b = ch.map(java.nio.channels.FileChannel.MapMode.READ_ONLY, 0, ch.size()).order(ByteOrder.LITTLE_ENDIAN);
            byte[] head = new byte[(int) Math.min(65536, ch.size())];
            b.get(head);
            byte[] magic = new byte[] { (byte) 0x74, (byte) 0xFB, (byte) 0xB2, (byte) 0x7E };   // 2125658996 LE
            int p = indexOf(head, magic, 0);
            if (p < 0) throw new Exception("no symbol table");
            b.position(p + 4);
            int nameLen = b.getInt(); b.position(b.position() + nameLen);
            b.getLong();                          // available key
            long size = b.getLong();
            for (long i = 0; i < size; i++) {
                int len = b.getInt();
                byte[] s = new byte[len]; b.get(s);
                b.getLong();                      // key
                out.append(new String(s, StandardCharsets.UTF_8)).append('\n');
            }
        }
    }

    private static int indexOf(byte[] hay, byte[] needle, int from) {
        outer:
        for (int i = from; i <= hay.length - needle.length; i++) {
            for (int j = 0; j < needle.length; j++) if (hay[i + j] != needle[j]) continue outer;
            return i;
        }
        return -1;
    }

    /* ---- listening ---- */
    @PluginMethod
    public void start(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            requestPermissionForAlias("microphone", call, "micGranted");
            return;
        }
        startInternal(call);
    }

    @PermissionCallback
    private void micGranted(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) startInternal(call);
        else call.reject("not-allowed");
    }

    private void startInternal(PluginCall call) {
        String id = call.getString("id", "");
        if (!modelReady(id)) { call.reject("model-missing"); return; }
        JSArray grammarArr = call.getArray("grammar", null);
        boolean capture = Boolean.TRUE.equals(call.getBoolean("capture", true));
        String grammar = null;
        if (grammarArr != null && grammarArr.length() > 0) grammar = grammarArr.toString();
        final String grammarJson = grammar;
        new Thread(() -> {
            try {
                stopInternal();
                if (model == null || !id.equals(modelId)) {
                    if (model != null) model.close();
                    model = new Model(modelDir(id).getAbsolutePath());
                    modelId = id;
                }
                Recognizer rec = grammarJson != null ? new Recognizer(model, (float) RATE, grammarJson) : new Recognizer(model, (float) RATE);
                int minBuf = AudioRecord.getMinBufferSize(RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
                /* a generous buffer (five seconds): the recognizer may stall
                   for a moment on a hard stretch, and no audio must be lost */
                AudioRecord audio = new AudioRecord(MediaRecorder.AudioSource.VOICE_RECOGNITION, RATE,
                    AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, Math.max(minBuf, RATE * 2 * 5));
                if (audio.getState() != AudioRecord.STATE_INITIALIZED) { rec.close(); call.reject("mic unavailable"); return; }
                running = true;
                loop = new Thread(() -> run(audio, rec, capture), "stuti-vosk");
                loop.start();
                Log.d(TAG, "listening model=" + id + " grammar=" + (grammarJson != null ? grammarArr.length() + " words" : "free") + " capture=" + capture);
                call.resolve();
            } catch (Exception e) {
                call.reject("start failed: " + e.getMessage());
            }
        }).start();
    }

    /* Two threads: one only reads the microphone (and keeps the copy), the
       other recognizes. Recognition can fall behind for a moment on a hard
       stretch; the queue holds the audio meanwhile, so nothing is lost and
       the ears catch up. The session log notes how far behind they got. */
    private void run(AudioRecord audio, Recognizer rec, boolean capture) {
        final LinkedBlockingQueue<short[]> q = new LinkedBlockingQueue<>();
        final Thread decoder = new Thread(() -> {
            int worst = 0;
            try {
                while (true) {
                    short[] chunk = q.take();
                    if (chunk.length == 0) break;            // the reader's end mark
                    int depth = q.size();
                    if (depth > worst) { worst = depth; if (worst >= 10) Log.w(TAG, "recognizer " + (worst / 10.0) + " s behind"); }
                    if (rec.acceptWaveForm(chunk, chunk.length)) emit("result", field(rec.getResult(), "text"));
                    else emit("partial", field(rec.getPartialResult(), "partial"));
                }
                emit("result", field(rec.getFinalResult(), "text"));
            } catch (InterruptedException ignored) {
            } catch (Exception e) {
                Log.e(TAG, "decoder", e);
            } finally {
                Log.d(TAG, "decoder done; worst lag " + (worst / 10.0) + " s");
                rec.close();
            }
        }, "stuti-vosk-decode");
        decoder.start();
        RandomAccessFile wav = null;
        long bytes = 0;
        short[] buf = new short[CHUNK];
        ByteBuffer bb = ByteBuffer.allocate(CHUNK * 2).order(ByteOrder.LITTLE_ENDIAN);
        try {
            if (capture) { wav = new RandomAccessFile(wavFile(), "rw"); wav.setLength(0); writeWavHeader(wav, 0); wav.seek(44); }
            audio.startRecording();
            long lastLevel = 0;
            while (running) {
                int n = audio.read(buf, 0, CHUNK);
                if (n <= 0) continue;
                /* how loud the mic is, a few times a second — the chip shows
                   it, so a silent microphone and a silent recogniser look
                   different to the reciter (and to whoever reads their log) */
                long now = System.currentTimeMillis();
                if (now - lastLevel >= 200) {
                    lastLevel = now;
                    double sum = 0; for (int i = 0; i < n; i++) sum += (double) buf[i] * buf[i];
                    double rms = Math.sqrt(sum / n) / 32768.0;
                    JSObject d = new JSObject(); d.put("level", Math.min(1.0, rms * 6)); notifyListeners("level", d);
                }
                if (wav != null) {
                    bb.clear(); for (int i = 0; i < n; i++) bb.putShort(buf[i]);
                    wav.write(bb.array(), 0, n * 2); bytes += n * 2;
                    /* keep the header honest while recording, so a file shared
                       mid-session still opens (the founder's first one did not) */
                    if ((bytes / (n * 2)) % 20 == 0) { long at = wav.getFilePointer(); writeWavHeader(wav, bytes); wav.seek(at); }
                }
                short[] chunk = new short[n];
                System.arraycopy(buf, 0, chunk, 0, n);
                q.add(chunk);
            }
        } catch (Exception e) {
            Log.e(TAG, "audio loop", e);
            JSObject d = new JSObject(); d.put("message", String.valueOf(e.getMessage()));
            notifyListeners("error", d);
        } finally {
            try { audio.stop(); } catch (Exception ignored) {}
            audio.release();
            q.add(new short[0]);                                   // end mark: let the decoder drain and close
            try { decoder.join(4000); } catch (InterruptedException ignored) {}
            if (wav != null) {
                try { writeWavHeader(wav, bytes); wav.close(); } catch (Exception ignored) {}
            }
        }
    }

    private void writeWavHeader(RandomAccessFile f, long dataBytes) throws Exception {
        ByteBuffer h = ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN);
        h.put("RIFF".getBytes(StandardCharsets.US_ASCII)).putInt((int) (36 + dataBytes)).put("WAVE".getBytes(StandardCharsets.US_ASCII));
        h.put("fmt ".getBytes(StandardCharsets.US_ASCII)).putInt(16).putShort((short) 1).putShort((short) 1)
            .putInt(RATE).putInt(RATE * 2).putShort((short) 2).putShort((short) 16);
        h.put("data".getBytes(StandardCharsets.US_ASCII)).putInt((int) dataBytes);
        f.seek(0); f.write(h.array());
    }

    private String field(String json, String key) {
        try { return new org.json.JSONObject(json).optString(key, ""); } catch (Exception e) { return ""; }
    }

    private String lastPartial = "";
    private void emit(String event, String text) {
        if (text == null || text.isEmpty()) return;
        if (event.equals("partial")) { if (text.equals(lastPartial)) return; lastPartial = text; } else lastPartial = "";
        Log.d(TAG, event + ": " + text);
        JSObject d = new JSObject(); d.put("text", text);
        notifyListeners(event, d);
    }

    /* the page's own notes into logcat — the only console a release build has */
    @PluginMethod
    public void log(PluginCall call) {
        Log.d(TAG, "page: " + call.getString("msg", ""));
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        stopInternal();
        call.resolve();
    }

    private void stopInternal() {
        running = false;
        Thread t = loop;
        loop = null;
        if (t != null) { try { t.join(1500); } catch (InterruptedException ignored) {} }
    }

    /* ---- hand the last session (audio + the page's log) to another app ---- */
    @PluginMethod
    public void shareSession(PluginCall call) {
        String log = call.getString("log", "");
        stopInternal();   // a session shared while still listening is closed first
        try {
            ArrayList<Uri> uris = new ArrayList<>();
            String auth = getContext().getPackageName() + ".fileprovider";
            if (!log.isEmpty()) {
                try (FileWriter w = new FileWriter(logFile())) { w.write(log); }
                uris.add(FileProvider.getUriForFile(getContext(), auth, logFile()));
            }
            if (wavFile().isFile() && wavFile().length() > 44) uris.add(FileProvider.getUriForFile(getContext(), auth, wavFile()));
            if (uris.isEmpty()) { call.reject("nothing recorded yet"); return; }
            Intent send = new Intent(Intent.ACTION_SEND_MULTIPLE);
            send.setType("*/*");
            send.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
            send.putExtra(Intent.EXTRA_SUBJECT, "Stuti Follow session");
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send, "Share Follow session");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(chooser);
            call.resolve();
        } catch (Exception e) {
            call.reject("share failed: " + e.getMessage());
        }
    }

    @Override
    protected void handleOnDestroy() { stopInternal(); if (model != null) { model.close(); model = null; } }
}
