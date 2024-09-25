const CACHE_NAME = "tic-tac-toe-cache-v1";
const urlsToCache = [
  "/Tictactoe/",
  "/Tictactoe/index.html",
  "/Tictactoe/style.css",
  "/Tictactoe/script.js",
  "/Tictactoe/icons/manifest-icon-192.maskable.png",
  "/Tictactoe/icons/manifest-icon-512.maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Failed to cache:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Serve cached content if available, otherwise fetch from network
        return (
          response ||
          fetch(event.request).then(async (networkResponse) => {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        );
      })
      .catch((err) => {
        // Fallback: return offline page if fetch and cache both fail
        alert(err);
        return caches.match("/Tictactoe/index.html"); // Or a custom offline page
      })
  );
});
