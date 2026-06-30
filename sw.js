const CACHE_NAME = "cina-games-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./games.html",
  "./contact.html",
  "./about.html",
  "./manifest.json",
  "./icon.png"
];

// نصب
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// فعال‌سازی
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// گرفتن فایل‌ها (آفلاین کار کند)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
    })
  );
});
