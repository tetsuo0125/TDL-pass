const CACHE = 'tdr-v1';
const ASSETS = ['./tdr_pass_checker.html', './manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});

/* ─ タイマー通知の受信 ─ */
self.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'SCHEDULE_NOTIFY') return;

  var d = e.data;
  /* d.delayMs 後に通知を出す */
  setTimeout(function() {
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: d.tag || 'tdr-timer',
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200]
    });
  }, d.delayMs);
});
