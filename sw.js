const cacheName = 'cina-games-v2'; // ورژن رو به v2 تغییر دادیم تا کش قبلی پاک بشه
const assets = [
  './',
  './index.html',
  './icon.png' // تغییر یافته از profile.jpg به آیکون جدید شما
];

// مرحله نصب سرویس ورکر و کش کردن فایل‌ها
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// فعال‌سازی و پاک کردن کش‌های قدیمی برای اعمال آپدیت جدید
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// لود کردن فایل‌ها از کش برای سرعت بیشتر (آفلاین)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
