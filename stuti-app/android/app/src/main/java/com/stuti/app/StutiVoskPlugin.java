package com.stuti.app;

import android.Manifest;
import android.util.Log;
import android.content.Context;
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
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;

/**
 * Follow's ears on Android: a streaming, on-device recognizer (Vosk) that
 * never closes the microphone between phrases — unlike the system
 * SpeechRecognizer, which ends a session at every pause and loses the
 * first syllables of the next one on restart.
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
public class StutiVoskPlugin extends Plugin implements RecognitionListener {

    private Model model;
    private String modelId;
    private SpeechService service;

    private File modelDir(String id) {
        return new File(new File(getContext().getFilesDir(), "vosk"), id);
    }

    private boolean modelReady(String id) {
        File d = modelDir(id);
        return d.isDirectory() && new File(d, "am").isDirectory() && new File(d, "conf").isDirectory();
    }

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
        try (ZipInputStream z = new ZipInputStream(new BufferedInputStream(new java.io.FileInputStream(zip)))) {
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
        new Thread(() -> {
            try {
                stopInternal();
                if (model == null || !id.equals(modelId)) {
                    if (model != null) model.close();
                    model = new Model(modelDir(id).getAbsolutePath());
                    modelId = id;
                }
                Recognizer rec = new Recognizer(model, 16000.0f);
                service = new SpeechService(rec, 16000.0f);
                boolean ok = service.startListening(this);
                Log.d("StutiVosk", "startListening=" + ok + " model=" + id);
                call.resolve();
            } catch (Exception e) {
                call.reject("start failed: " + e.getMessage());
            }
        }).start();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        stopInternal();
        call.resolve();
    }

    private void stopInternal() {
        if (service != null) { service.stop(); service.shutdown(); service = null; }
    }

    @Override
    protected void handleOnDestroy() { stopInternal(); if (model != null) { model.close(); model = null; } }

    /* ---- RecognitionListener: Vosk hands JSON; we pass on just the text ---- */
    private String field(String json, String key) {
        try { return new org.json.JSONObject(json).optString(key, ""); } catch (Exception e) { return ""; }
    }
    @Override public void onPartialResult(String hypothesis) {
        String t = field(hypothesis, "partial");
        Log.d("StutiVosk", "partial: " + hypothesis);
        if (t.isEmpty()) return;
        JSObject d = new JSObject(); d.put("text", t); notifyListeners("partial", d);
    }
    @Override public void onResult(String hypothesis) {
        String t = field(hypothesis, "text");
        Log.d("StutiVosk", "result: " + hypothesis);
        if (t.isEmpty()) return;
        JSObject d = new JSObject(); d.put("text", t); notifyListeners("result", d);
    }
    @Override public void onFinalResult(String hypothesis) { onResult(hypothesis); }
    @Override public void onError(Exception e) {
        Log.e("StutiVosk", "error", e);
        JSObject d = new JSObject(); d.put("message", String.valueOf(e.getMessage())); notifyListeners("error", d);
    }
    @Override public void onTimeout() { /* SpeechService without a timeout never calls this */ }
}
