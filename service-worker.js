const CACHE_NAME = "studymate-ai-v1";

const APP_FILES = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/manifest.json",
    "/icon-192.png",
    "/icon-512.png"
];

/* =========================
   INSTALL EVENT
========================= */
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
    );
    self.skipWaiting();
});

/* =========================
   ACTIVATE EVENT
========================= */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

/* =========================
   FETCH EVENT
========================= */
self.addEventListener("fetch", event => {
    // 1. Bypass Service Worker for API POST requests (Notes, Quiz, Flashcards)
    if (event.request.method !== "GET") {
        return;
    }

    // 2. Network-First strategy with Cache Fallback for GET requests
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).catch(() => {
                    // Fallback to offline page for navigation requests
                    if (event.request.mode === "navigate") {
                        return caches.match("/");
                    }
                });
            })
    );
});