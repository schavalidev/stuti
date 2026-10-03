/* ============================================================
   STUTI — the service worker's half of the bell
   Hand-authored; imported into the Workbox worker by vite.config.ts
   (workbox.importScripts), so it runs with no page open.

   A message arrives already worded: the device that laid the week wrote
   each bell with the same words the page and the phone use
   (stuti-notify.ts), and sealed it. All this does is show it, and on a
   tap open what it names. It reckons nothing, so it can never disagree
   with the page about what was due.

   The message is { t: title, b: body, u: "#reader/…" or "", g: tag,
   d: the minute it was due }.
   ============================================================ */
self.addEventListener("push", (event) => {
  let m = {};
  try { m = event.data ? event.data.json() : {}; } catch (e) { m = {}; }
  event.waitUntil(self.registration.showNotification(m.t || "Stuti", {
    body: m.b || "",
    tag: m.g || "stuti",
    icon: "icons/icon-192.png",
    timestamp: m.d || Date.now(),
    data: { u: typeof m.u === "string" && m.u.charAt(0) === "#" ? m.u : "" },
  }));
});

/* a tap opens what the bell named: into a Stuti window already open if
   there is one (the page moves itself, stuti-webpush.ts), else a new one */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const u = (event.notification.data && event.notification.data.u) || "";
  const scope = self.registration.scope;
  event.waitUntil((async () => {
    const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const w = open.find((c) => c.url.indexOf(scope) === 0);
    if (w) {
      try { await w.focus(); } catch (e) {}
      if (u) w.postMessage({ stuti: "open", u: u });
      return;
    }
    await self.clients.openWindow(scope + u);
  })());
});

/* The push service replaced the subscription. Take the new one now, so the
   browser holds something; the page lays its week against it at the next
   open, and the old endpoint's bells fall away as "gone". */
self.addEventListener("pushsubscriptionchange", (event) => {
  const o = event.oldSubscription && event.oldSubscription.options;
  if (!o || !o.applicationServerKey) return;
  event.waitUntil(self.registration.pushManager
    .subscribe({ userVisibleOnly: true, applicationServerKey: o.applicationServerKey })
    .catch(() => {}));
});
