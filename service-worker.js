/**
 * Krisishikkha - Auto-Version Service Worker
 * No manual version change needed!
 * Updated automatically based on timestamp
 */

// ✅ Automatic Version - কোনো manual change লাগবে না!
const CACHE_VERSION = `krisishikkha-${new Date().getTime()}`;
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Critical files to cache (এগুলো update করতে পারেন প্রয়োজন মতো)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/ntrca.html',
  '/exam-corner.html',
  '/privacy-policy.html',
  '/terms.html',
  '/offline.html'
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete all old krisishikkha caches
              return name.startsWith('krisishikkha-') && 
                     name !== CACHE_NAME && 
                     name !== DYNAMIC_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch Event - Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Network First Strategy (সবসময় latest content পাবেন)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone response before caching
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response && response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            return cachedResponse;
          }
          
          // If navigation request, return offline page
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Return error response
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

console.log('[SW] Service Worker loaded:', CACHE_VERSION);
