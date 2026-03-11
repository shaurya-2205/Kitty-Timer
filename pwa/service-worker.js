// 🎀 Hello Kitty Study Timer - Service Worker for Offline Support

const CACHE_NAME = 'kitty-timer-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/script.js',
    '/assets/images/kitty_study.png',
    '/assets/images/kitty_tea.png',
    '/assets/images/kitty_head.png',
    '/assets/icons/icon-512.png',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// Install - Cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Cache-first strategy (works offline!)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(networkResponse => {
                    // Cache new resources dynamically (like font files)
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                });
            })
            .catch(() => {
                // Fallback for navigation requests when offline
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
