const CACHE_NAME = "tic-tac-toe-cache-v1";
const urlsToCache = [
  '/Tictactoe/',                 
  '/Tictactoe/index.html',     
  '/Tictactoe/style.css',
  '/Tictactoe/script.js',
  '/Tictactoe/icons/manifest-icon-192.maskable.png',
  '/Tictactoe/icons/manifest-icon-512.maskable.png'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
