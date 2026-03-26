/**
 * LeerZone Service Worker
 * Zorgt voor snelle laadtijden en offline functionaliteit
 */

const CACHE_NAME = 'leerzone-v6';
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './themes.js',
    './audio-engines.js',
    './styles.css',
    './manifest.json'
];

// Installatie - cache alle bestanden
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Activeer direct
    );
});

// Activatie - verwijder oude caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Neem controle over alle pagina's
    );
});

// Fetch - serveer van cache, fallback naar netwerk
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return de response van cache
                if (response) {
                    // Update cache in achtergrond (stale-while-revalidate)
                    fetch(event.request).then((fetchResponse) => {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, fetchResponse);
                        });
                    }).catch(() => {
                        // Netwerk fout, gebruik cache
                    });
                    return response;
                }

                // Niet in cache - haal van netwerk en cache het
                return fetch(event.request).then((fetchResponse) => {
                    // Check of het een valide response is
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse;
                    }

                    // Clone de response
                    const responseToCache = fetchResponse.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return fetchResponse;
                }).catch(() => {
                    // Netwerk fout en niet in cache
                    console.log('Service Worker: Fetch failed for:', event.request.url);
                });
            })
    );
});

