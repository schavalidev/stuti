/* ============================================================
   STUTI — the service worker
   The use case is a pūjā room with bad wifi, so the app has to open
   and the texts have to be there. Everything the app owns is cached
   on install; the CDN scripts it borrows are cached the first time they are
   fetched, since they are pinned by version and hash and will never
   change under us. Babel is now one of those: the loader only asks
   for it when a JSX file has changed, so on a normal morning it is
   never fetched at all.

   Strategy: network first for everything the app owns, so an edit is never
   masked by a stale copy, with the cache standing in only when the network
   is unreachable. Cache first for the pinned CDN scripts alone.

   Scope: the worker registers at the origin root, which is where Stuti.html
   sits — but the origin is shared with every other page in this project.
   A worker that answers for all of them is a worker that can take all of
   them down with it, and its offline fallback was handing out Stuti.html
   for any same-origin URL it had never heard of. So the fetch handler now
   answers ONLY for the files listed below (and the pinned CDN scripts) and
   declines everything else, leaving the browser to fetch it normally.
   ============================================================ */
const VERSION = "stuti-v0.9.59";
const SHELL = [
  "Stuti.html",
  "Stuti - Tablet & Desktop.html",
  "stuti.css",
  "stuti-components.css",
  "stuti-palette.css",
  "stuti-wide.css",
  "stotra-index-data.js",
  "stuti-data.js",
  "stuti-names-vishnu.js",
  "stuti-hindi-names-vishnu.js",
  "stuti-hindi-names-lalita.js",
  "stuti-names-lalita.js",
  "stuti-names-ganesha.js",
  "stuti-hindi-names-lalita.js",
  "stuti-text-ganesha.js",
  "stuti-text-ganesha2.js",
  "stuti-text-ganesha3.js",
  "stuti-text-ganesha4.js","stuti-text-guru.js","stuti-text-guru2.js","stuti-text-subrahmanya.js","stuti-text-subrahmanya2.js","stuti-text-subrahmanya3.js","stuti-text-subrahmanya4.js","stuti-text-subrahmanya5.js","stuti-text-subrahmanya6.js","stuti-text-subrahmanya7.js","stuti-text-subrahmanya8.js","stuti-text-subrahmanya9.js","stuti-text-subrahmanya10.js",
  "stuti-text-shiva.js",
  "stuti-text-shiva2.js",
  "stuti-text-shiva3.js",
  "stuti-text-devi.js",
  "stuti-text-devi2.js",
  "stuti-text-devi3.js",
  "stuti-text-devi4.js",
  "stuti-text-vishnu.js",
  "stuti-text-vishnu2.js",
  "stuti-text-hanuman.js",
  "stuti-hindi-shiva.js",
  "stuti-hindi-core.js",
  "stuti-hindi-ganesha2.js",
  "stuti-hindi-subrahmanya.js",
  "stuti-texts.js",
  "stuti-library-data.js",
  "stuti-sankranti-data.js",
  "stuti-vrata-data.js",
  "stuti-nomu-data.js",
  "stuti-parayana-data.js",
  "stuti-masa-data.js",
  "stuti-build.js",
  "stuti-i18n.js",
  "stuti-hindi-ganesha.js",
  "stuti-hindi-sahasra.js",
  "stuti-store.js",
  "stuti-reckoning.js",
  "stuti-sankalpa-data.js",
  "stuti-watch.js",
  "stuti-prefs.js",
  "stuti-flyleaf.js",
  "stuti-prep.js",
  "stuti-dana.js",
  "stuti-limits.js",
  "stuti-auth.js",
  "stuti-account.jsx",
  "stuti-dana.jsx",
  "stuti-limits.jsx",
  "stuti-feedback.jsx",
  "stuti-sadhana.js",
  "stuti-ephemeris.js",
  "stuti-panchanga-engine.js",
  "stuti-desa.js",
  "stuti-muhurta.js",
  "stuti-sandhya.js",
  "stuti-cues.js",
  "stuti-push.js",
  "stuti-nudge.js",
  "stuti-translit.js",
  "stuti-lexicon.js",
  "stuti-audio.js",
  "stuti-boot.js",
  "tweaks-panel.jsx",
  "stuti-icons.jsx",
  "stuti-picker.jsx",
  "stuti-panchanga.jsx",
  "stuti-pada.jsx",
  "stuti-record.jsx",
  "stuti-await.jsx",
  "stuti-remind.jsx",
  "stuti-today.jsx",
  "stuti-onboard.jsx",
  "stuti-flow.jsx",
  "stuti-find.jsx",
  "stuti-reader.jsx",
  "stuti-prep.jsx",
  "stuti-flyleaf.jsx",
  "stuti-sky.jsx",
  "stuti-home.jsx",
  "stuti-japa.jsx",
  "stuti-plans.jsx",
  "stuti-vows.jsx",
  "stuti-share.jsx",
  "stuti-vrata.jsx",
  "stuti-nomu.jsx",
  "stuti-parayana.jsx",
  "stuti-masa.jsx",
  "stuti-library.jsx",
  "stuti-practice.jsx",
  "stuti-sandhya.jsx",
  "stuti-calendar.jsx",
  "stuti-settings.jsx",
  "stuti-main.jsx",
  "stuti-wide-main.jsx",
];

/* the shell as absolute URLs, so a request can be recognised by identity
   rather than by guessing at its path */
const OWNED = new Set(SHELL.map((u) => new URL(u, self.registration.scope).href));

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) =>
      /* one missing file must not sink the whole install */
      Promise.all(SHELL.map((u) => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("message", (e) => {
  /* a page that finds a worker stuck in `waiting` can tell it to take over */
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  /* The pinned CDN scripts are the ONLY thing safe to serve cache-first:
     they carry a version and an integrity hash, so the bytes behind that URL
     can never change. */
  const pinned = /unpkg\.com\/(react|react-dom|@babel)/.test(req.url);

  if (pinned) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }))
    );
    return;
  }

  /* Our own files change every time we edit one, and a cache-first worker
     keyed on a hand-bumped version string will happily serve a frozen
     snapshot forever — it did exactly that, hiding two edits. So: network
     first, refreshing the cache as it goes, and fall back to the cache only
     when the network cannot be reached. That is the pūjā-room case, and the
     only case that should ever be served from disk.

     The emblems are the one exception outside the manifest: they are images
     the reader sees on every screen and they never change, so they are
     cached on first sight. */
  const emblem = sameOrigin && /\/emblems\/[^/]+\.png$/.test(url.pathname);
  /* A navigation to the app's own directory ("/", not "/Stuti.html") is the
     app being opened, but a directory index has no path in the manifest — so
     an identity test alone would leave the bare root with no offline
     fallback, which is precisely the pūjā-room case. Recognise that ONE
     extra path and nothing more: the scope root itself. Anything else
     same-origin is another page in this project and is none of this
     worker's business. */
  const root = new URL(self.registration.scope).pathname;
  const isAppRoot = req.mode === "navigate" && (url.pathname === root || url.pathname === root + "index.html");
  const ours = OWNED.has(url.origin + url.pathname) || emblem || isAppRoot;
  if (sameOrigin && ours) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match(new URL("Stuti.html", self.registration.scope).href) : undefined)))
    );
    return;
  }

  /* Anything else — another page in this project, a reverse-geocode, an
     asset the app does not own — is none of this worker's business. Not
     calling respondWith hands it back to the browser untouched. */
});
