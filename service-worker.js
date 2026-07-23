/**
 * Krisishikkha - Service Worker
 * Version: 2.0.0
 * Updated: January 2024
 * Premium PWA Implementation
 */

const CACHE_VERSION = 'krisishikkha-v2.0.0';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/ntrca.html',
  '/exam-corner.html',
  '/privacy-policy.html',
  '/terms.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/SolaimanLipi.js',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('krisishikkha-') && 
                     name !== CACHE_NAME && 
                     name !== DYNAMIC_CACHE && 
                     name !== IMAGE_CACHE;
            })
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.url.endsWith('.pdf')) {
    event.respondWith(handlePDFRequest(request));
  } else {
    event.respondWith(handleRequest(request));
  }
});

// Handle regular requests
async function handleRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }
    
    throw error;
  }
}

// Handle image requests
async function handleImageRequest(request) {
  try {
    const cachedImage = await caches.match(request);
    if (cachedImage) {
      return cachedImage;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('[Service Worker] Image fetch failed:', error);
    // Return placeholder image
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle PDF requests
async function handlePDFRequest(request) {
  try {
    // Always fetch PDFs from network (don't cache sensitive content)
    return await fetch(request);
  } catch (error) {
    console.error('[Service Worker] PDF fetch failed:', error);
    return new Response('PDF not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

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

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Implement your form sync logic here
  console.log('[Service Worker] Syncing contact form...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Now',
        icon: '/assets/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Krisishikkha', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://krisishikkha.com')
    );
  }
});

console.log('[Service Worker] Script loaded successfully');
