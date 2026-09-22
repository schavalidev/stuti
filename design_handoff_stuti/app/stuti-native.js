/* ============================================================
   STUTI — what the phone has and a browser tab does not
   Carried into the design by stuti-app/tools/mirror-to-design.mjs; the
   source is stuti-app/tools/mirror/stuti-native.js. Edit it there.

   The Android app hears through Vosk, an on-device recogniser, keeps
   recitations as files in its own storage, and sends a Follow session to
   the makers. None of that exists in a browser tab, and the modules that
   were written for both (stuti-follow.jsx, stuti-recitations.js) ask
   before they use any of it. Here every such question is answered "not
   on this device", so the prototype takes the browser's path: its own
   speech recognition for the ears, MediaRecorder for the tape, IndexedDB
   for the shelf. Nothing here does anything.
   ============================================================ */
(function () {
  const no = () => Promise.reject(new Error("not on this device"));
  Object.assign(window, {
    VOSK_MODELS: {
      hi: { id: "vosk-model-small-hi-0.22", url: "https://alphacephei.com/vosk/models/vosk-model-small-hi-0.22.zip", mb: 45, label: "Hindi" },
      te: { id: "vosk-model-small-te-0.42", url: "https://alphacephei.com/vosk/models/vosk-model-small-te-0.42.zip", mb: 61, label: "Telugu" },
    },
    voskAvailable: () => false,
    voskLangFor: () => "hi",
    voskModelReady: () => Promise.resolve(false),
    voskDownload: no,
    voskVocab: () => Promise.resolve(""),
    voskLog: () => {},
    voskNote: () => {},
    voskKeepRecording: no,
    voskListRecordings: () => Promise.resolve([]),
    voskDeleteRecording: no,
    voskShareRecording: no,
    voskShareSession: () => Promise.resolve(),
    voskFileUrl: (path) => path,
    VoskRecognition: function VoskRecognition() { throw new Error("not on this device"); },
    /* the grammar is built from Vosk's own word list, so it has no job here */
    indexVocab: () => ({}),
    grammarFor: () => [],
    /* sessions go to the makers from the app only */
    relayFollowSession: () => Promise.resolve(),
  });
})();
