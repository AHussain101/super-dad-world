// ===== SUPER DAD WORLD - SERVICE WORKER =====
// Provides offline support and caching for the Father's Day experience

const CACHE_NAME = 'super-dad-world-v2.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/game.js',
    '/assets/js/mario-minigame.js',
    '/assets/js/init.js',
    '/assets/images/baby-years/DSC00794.JPG',
    '/assets/images/early-childhood/IMG_4081.JPG',
    '/assets/images/elementary-days/IMG_2753.JPG',
    '/assets/images/middle-school/IMG_0003.JPG',
    '/assets/images/early-teens/IMG_0214.jpeg',
    '/assets/images/mid-teens/IMG_0059.JPG',
    '/assets/images/late-teens/IMG_0063.JPG',
    '/assets/audio/coin.mp3',
    '/assets/audio/level-complete.mp3',
    '/assets/audio/hey-you-instrumental.mp3',
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('🍄 Service Worker: Caching files');
                return cache.addAll(urlsToCache.map(url => {
                    // Handle relative URLs properly
                    return new Request(url, { mode: 'cors' });
                })).catch(err => {
                    console.warn('🍄 Some files failed to cache:', err);
                    // Cache what we can
                    return Promise.allSettled(urlsToCache.map(url => cache.add(url)));
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🍄 Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response because it's a stream
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(() => {
                    // Network failed, return offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Handle background sync for saving progress
self.addEventListener('sync', event => {
    if (event.tag === 'save-progress') {
        event.waitUntil(saveProgressOffline());
    }
});

async function saveProgressOffline() {
    try {
        // This would sync progress data when online
        console.log('🍄 Service Worker: Syncing progress data');
        // Implementation would depend on backend setup
    } catch (error) {
        console.error('🍄 Service Worker: Failed to sync progress:', error);
    }
}

// Handle push notifications (if implemented)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/icon-192.png',
            badge: '/assets/images/badge-72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

console.log('🍄 Service Worker loaded successfully!'); 