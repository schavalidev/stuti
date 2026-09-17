/* ============================================================
   STUTI — archiving the makers' Drive folder
   ============================================================

   The app uploads three kinds of file into the makers' "Stuti App"
   folder, through netlify/functions/relay.mjs:

     journal-<device>-<time>-<why>.txt   every ten minutes of use
     follow-<device>-<time>-<hymn>.txt   after each Follow session
     follow-<device>-<time>-<hymn>.wav   the audio, on the phone only
     crash-<device>-<time>.txt           on an error

   The text is kilobytes and is the whole diagnostic trail. The audio is
   megabytes and is what fills the folder. So this script folders
   everything away by month and removes only the audio.

   Testers and makers also drop files in by hand — a screenshot of what
   went wrong, a note. Those are foldered by month as well, into a
   `manual` subfolder, and are never removed.

   WHY THIS IS A SCRIPT AND NOT PART OF THE RELAY
   The relay takes no credential: anything it can do, anyone who finds
   its URL can do. Giving it a delete path would put the trail one
   request away from destruction. This runs as you instead, on Google's
   side, on a timer — no endpoint, no credential on any machine.

   HOW TO INSTALL
     1. script.google.com → New project. Paste this file in.
     2. Put your folder's id in FOLDER_ID below — the tail of the
        folder's Drive URL. It is the same id as STUTI_DRIVE_FOLDER
        in the Netlify environment.
     3. Run `archiveNow` once. Google asks for Drive access; grant it.
        DRY_RUN is true, so this only writes a report to the log —
        read it and check it is doing what you expect.
     4. Set DRY_RUN = false, then run `installTrigger` once. It runs
        daily from then on. `removeTriggers` stops it.

   SAFETY
   - Nothing is ever deleted permanently. Files go to Drive's trash,
     which keeps them ~30 days, so a mistake is recoverable.
   - Only `.wav` can be trashed. The guard in `trashable_` refuses
     every other extension, so a text log cannot be removed by this
     script even if the settings below are changed.
   - APKs are moved, never trashed.
   - Hand-added files are moved, never trashed.
   ============================================================ */

/* ---- settings ---- */
var FOLDER_ID = "PUT_YOUR_FOLDER_ID_HERE";

var DRY_RUN = true;                 // true: report only, change nothing
var ARCHIVE_AFTER_DAYS = 30;        // older than this is foldered away by month
var TRASH_WAV_AFTER_DAYS = 30;      // audio older than this goes to Drive's trash
var KEEP_APKS = 2;                  // newest N APKs stay at the top level
var ARCHIVE_NAME = "archive";       // the subfolder everything moves into

/* ============================================================
   the run
   ============================================================ */
function archiveNow() {
  if (FOLDER_ID === "PUT_YOUR_FOLDER_ID_HERE") {
    throw new Error("Set FOLDER_ID to the Drive folder's id first.");
  }
  var root = DriveApp.getFolderById(FOLDER_ID);
  var archive = DRY_RUN ? null : childFolder_(root, ARCHIVE_NAME);
  var now = new Date().getTime();
  var tally = { archived: 0, manual: 0, trashed: 0, bytesTrashed: 0, apksMoved: 0, left: 0 };
  var lines = [];

  /* APKs are handled by count, not by age: the newest two stay put. */
  var apks = [];
  var it = root.getFiles();
  var files = [];
  while (it.hasNext()) files.push(it.next());

  files.forEach(function (f) {
    if (/^Stuti-v\d+\.apk$/i.test(f.getName())) apks.push(f);
  });
  apks.sort(function (a, b) { return b.getDateCreated().getTime() - a.getDateCreated().getTime(); });
  var apkKeep = {};
  apks.slice(0, KEEP_APKS).forEach(function (f) { apkKeep[f.getId()] = true; });

  files.forEach(function (f) {
    var name = f.getName();
    var created = f.getDateCreated();
    var ageDays = (now - created.getTime()) / 86400000;

    /* an APK beyond the newest few is moved aside, never trashed */
    if (/^Stuti-v\d+\.apk$/i.test(name)) {
      if (apkKeep[f.getId()]) { tally.left++; return; }
      lines.push("move apk   " + name);
      if (!DRY_RUN) move_(f, childFolder_(archive, "apk"));
      tally.apksMoved++;
      return;
    }

    /* A file a person put in the folder by hand — a tester's screenshot, a
       note left for the makers. It is foldered away by month like the rest,
       into a `manual` subfolder so it stays distinct from what the app sent.
       These are only ever moved: no manual file is trashed, whatever its
       extension, because nobody can tell from here whether it matters. */
    if (!/^(journal|follow|crash)-/.test(name)) {
      if (ageDays > ARCHIVE_AFTER_DAYS) {
        var manualBucket = monthOf_(created);
        lines.push("manual     " + name + "   -> " + ARCHIVE_NAME + "/" + manualBucket + "/manual");
        if (!DRY_RUN) move_(f, childFolder_(childFolder_(archive, manualBucket), "manual"));
        tally.manual++;
      } else {
        tally.left++;
      }
      return;
    }

    /* audio past its window goes to the trash; its text log stays */
    if (trashable_(name) && ageDays > TRASH_WAV_AFTER_DAYS) {
      var size = f.getSize();
      lines.push("trash wav  " + name + "   " + mb_(size) + "  (" + Math.floor(ageDays) + "d)");
      if (!DRY_RUN) f.setTrashed(true);
      tally.trashed++;
      tally.bytesTrashed += size;
      return;
    }

    if (ageDays > ARCHIVE_AFTER_DAYS) {
      var bucket = monthOf_(created);
      lines.push("archive    " + name + "   -> " + ARCHIVE_NAME + "/" + bucket);
      if (!DRY_RUN) move_(f, childFolder_(archive, bucket));
      tally.archived++;
      return;
    }

    tally.left++;
  });

  /* Audio that was foldered away on an earlier run still has to age out:
     a .wav archived at 30 days would otherwise never be swept, because the
     pass above only reads the top level. This matters whenever the trash
     window is longer than the archive window. */
  sweepArchive_(root, now, tally, lines);

  var head = (DRY_RUN ? "DRY RUN — nothing was changed" : "archive run") +
    "\nfolder: " + root.getName() +
    "\narchived: " + tally.archived +
    "  manual archived: " + tally.manual +
    "  wav trashed: " + tally.trashed + " (" + mb_(tally.bytesTrashed) + ")" +
    "  apks moved: " + tally.apksMoved +
    "  left in place: " + tally.left;

  Logger.log(head + "\n\n" + lines.sort().join("\n"));
  return head;
}

/* ============================================================
   helpers
   ============================================================ */

/* The one guard that matters: only audio may ever be removed. A text
   log is the diagnostic trail and this script must not be able to
   delete one, whatever the settings above say. */
function trashable_(name) {
  return /\.wav$/i.test(name);
}

/* Walk the month folders under archive/ and trash audio past its window.
   Text is never touched here either — `trashable_` is the only gate.

   This reads each month folder's own files and deliberately does NOT
   descend into its `manual` subfolder. That is what keeps a hand-added
   recording safe: a manual file is moved and then left alone forever.
   Do not make this recursive. */
function sweepArchive_(root, now, tally, lines) {
  var top = root.getFoldersByName(ARCHIVE_NAME);
  if (!top.hasNext()) return;
  var subs = top.next().getFolders();
  while (subs.hasNext()) {
    var sub = subs.next();
    var it = sub.getFiles();
    var batch = [];
    while (it.hasNext()) batch.push(it.next());
    batch.forEach(function (f) {
      var name = f.getName();
      if (!trashable_(name)) return;
      var ageDays = (now - f.getDateCreated().getTime()) / 86400000;
      if (ageDays <= TRASH_WAV_AFTER_DAYS) return;
      var size = f.getSize();
      lines.push("trash wav  " + ARCHIVE_NAME + "/" + sub.getName() + "/" + name +
                 "   " + mb_(size) + "  (" + Math.floor(ageDays) + "d)");
      if (!DRY_RUN) f.setTrashed(true);
      tally.trashed++;
      tally.bytesTrashed += size;
    });
  }
}

function monthOf_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM");
}

function mb_(bytes) {
  if (!bytes) return "0 MB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

/* find or make a subfolder, without making a second one of the same name */
function childFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function move_(file, dest) {
  file.moveTo(dest);
}

/* ============================================================
   the timer
   ============================================================ */
function installTrigger() {
  removeTriggers();
  ScriptApp.newTrigger("archiveNow").timeBased().everyDays(1).atHour(3).create();
  Logger.log("installed: archiveNow runs daily, around 03:00 in " + Session.getScriptTimeZone());
}

function removeTriggers() {
  var n = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "archiveNow") { ScriptApp.deleteTrigger(t); n++; }
  });
  Logger.log("removed " + n + " trigger(s)");
}
