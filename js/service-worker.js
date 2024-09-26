const CACHE_NAME = "tic-tac-toe-cache-v1";
const urlsToCache = [
  "/Tictactoe/",
  "/Tictactoe/index.html",
  "/Tictactoe/style.css",
  "/Tictactoe/script.js",
  "/Tictactoe/icons/manifest-icon-192.maskable.png",
  "/Tictactoe/icons/manifest-icon-512.maskable.png",
  "/Tictactoe/screenshots/screenshot1-wide.png",
  "/Tictactoe/screenshots/screenshot2-narrow.png",
  "/Tictactoe/sounds/boardclick.mp3",
  "/Tictactoe/sounds/buttonClick.mp3",
  "/Tictactoe/sounds/gameMusic.mp3",
  "/Tictactoe/sounds/matchDraw.mp3",
  "/Tictactoe/sounds/matchFound.mp3",
  "/Tictactoe/sounds/matchLost.mp3",
  "/Tictactoe/sounds/matchWin.mp3",
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
  if (event.request.method !== "GET") {
    return;
  }

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
        console.error("Fetch failed; returning offline page instead.", err);
        return caches.match("/Tictactoe/index.html"); // Or a custom offline page
      })
  );
});
