const CACHE_NAME = "tic-tac-toe-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/Css/Tic_tac_toe.css",
  "/js/Tic_tac_toe.js",
  "/icons/manifest-icon-192.maskable.png",
  "/icons/manifest-icon-512.maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
