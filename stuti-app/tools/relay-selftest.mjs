#!/usr/bin/env node
// Checks the log relay's folder handling without touching Google:
//
//   node stuti-app/tools/relay-selftest.mjs
//
// The relay runs with the narrow drive.file scope, which reaches only files
// the app itself made, so it can no longer be pointed at a folder created by
// hand. It finds its own folder, or makes one. That is the part worth testing
// before a deploy: get it wrong and every log, every piece of feedback and
// every published APK goes nowhere, and the only symptom is silence.
import relay from "../netlify/functions/relay.mjs";

let failed = 0, calls = [];
const ok = (c, what) => { console.log((c ? "  ok   " : "  FAIL ") + what); if (!c) failed++; };
const head = (s) => console.log("\n" + s);

const realFetch = globalThis.fetch;
let DRIVE = [], lastMeta = null;                       // the folders the app has made, oldest first
globalThis.fetch = async (url, opt = {}) => {
  const u = String(url);
  calls.push((opt.method || "GET") + " " + u.split("?")[0]);
  const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
  if (u.startsWith("https://oauth2.googleapis.com/token")) return json({ access_token: "tok", expires_in: 3600 });
  if (u.startsWith("https://www.googleapis.com/drive/v3/files?q=")) return json({ files: DRIVE.slice(0, 1).map((id) => ({ id })) });
  if (u.startsWith("https://www.googleapis.com/drive/v3/files")) { const id = "made-" + (DRIVE.length + 1); DRIVE.push(id); return json({ id }); }
  if (u.includes("uploadType=resumable")) { lastMeta = JSON.parse(String(opt.body)); return new Response("", { status: 200, headers: { location: "https://upload/session" } }); }
  if (u.includes("uploadType=multipart")) {
    const parents = JSON.parse(String(opt.body).match(/\{"name".*?\}(?=\r)/)[0]).parents;
    return json({ id: "file-1", name: "x", parents });
  }
  return json({ error: "unexpected " + u }, 500);
};
const post = (body, origin = "https://stuti-app.netlify.app") =>
  relay(new Request("https://x/.netlify/functions/relay", { method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body) }));
const reset = () => { calls = []; };
const note = { name: "note-check.txt", text: "hello" };

process.env.STUTI_DRIVE_OAUTH = JSON.stringify({ client_id: "c", client_secret: "s", refresh_token: "r" });
delete process.env.STUTI_DRIVE_FOLDER;

head("1. No folder yet — the relay makes its own");
{
  DRIVE = []; reset();
  const r = await post(note); const j = await r.json();
  ok(r.status === 200, "the file is written (status " + r.status + ")");
  ok(DRIVE.length === 1, "exactly one folder was created (" + DRIVE.length + ")");
  ok(j.folder === "made-1", "the reply says which folder it used (" + j.folder + ")");
  ok(calls.some((c) => c.startsWith("GET https://www.googleapis.com/drive/v3/files")), "it looked before it made one");
}

head("2. The folder already exists — it is found, not made again");
{
  reset();
  const r = await post({ name: "crash-abc.txt", text: "boom" });
  ok(r.status === 200, "the file is written");
  ok(DRIVE.length === 1, "no second folder was created (" + DRIVE.length + ")");
  ok(!calls.some((c) => c.startsWith("POST https://www.googleapis.com/drive/v3/files")), "no folder was created on this call");
}

head("3. An id in the environment still wins, for the old whole-Drive setup");
{
  process.env.STUTI_DRIVE_FOLDER = "by-hand";
  DRIVE = []; reset();
  const r = await post(note); const j = await r.json();
  ok(j.folder === "by-hand", "the named folder is used (" + j.folder + ")");
  ok(DRIVE.length === 0, "nothing was created");
  ok(!calls.some((c) => c.startsWith("GET https://www.googleapis.com/drive/v3/files")), "and nothing was looked up");
  delete process.env.STUTI_DRIVE_FOLDER;
}

head("4. A resumable upload — an APK — goes to the same folder");
{
  reset();
  const r = await post({ name: "Stuti-v55.apk", mime: "application/vnd.android.package-archive", size: 41817418, resumable: true });
  const j = await r.json();
  ok(r.status === 200 && !!j.url, "a session url comes back");
  ok(lastMeta && lastMeta.parents[0] === "made-1", "it is filed in the relay's own folder (" + (lastMeta && lastMeta.parents[0]) + ")");
  ok(!calls.some((c) => c.startsWith("GET https://www.googleapis.com/drive/v3/files")), "the folder is remembered, not looked up again");
}

head("5. With no credential at all it says so, rather than failing silently");
{
  const keep = process.env.STUTI_DRIVE_OAUTH; delete process.env.STUTI_DRIVE_OAUTH;
  const r = await post(note);
  ok(r.status === 503, "503 relay not configured (got " + r.status + ")");
  process.env.STUTI_DRIVE_OAUTH = keep;
}

head("6. Only the shapes the relay accepts");
{
  const r = await post({ name: "secrets.txt", text: "x" });
  ok(r.status === 400, "an unknown name is refused (got " + r.status + ")");
  const r2 = await post({ name: "Stuti-v55.apk.sh", text: "x" });
  ok(r2.status === 400, "a near-miss on the build name is refused (got " + r2.status + ")");
}

globalThis.fetch = realFetch;
console.log("\n" + (failed ? failed + " FAILED" : "all checks passed") + "\n");
process.exit(failed ? 1 : 0);
