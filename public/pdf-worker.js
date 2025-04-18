// PDF Service Worker
// This service worker helps with caching PDFs and handling CORS issues

const CACHE_NAME = "pdf-cache-v1"

// Files to cache
const urlsToCache = ["/", "/index.html"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Only handle PDF requests
  if (event.request.url.endsWith(".pdf") || event.request.url.includes("/api/pdf-proxy")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached response if found
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        // Make network request
        return fetch(fetchRequest, {
          // Add CORS headers
          mode: "cors",
          credentials: "same-origin",
          headers: {
            Accept: "application/pdf,*/*",
          },
        }).then((response) => {
          // Check if response is valid
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache the response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      }),
    )
  } else {
    // For non-PDF requests, use standard fetch
    event.respondWith(fetch(event.request))
  }
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_PDF_CACHE") {
    caches.open(CACHE_NAME).then((cache) => {
      cache.keys().then((requests) => {
        requests.forEach((request) => {
          if (request.url.endsWith(".pdf") || request.url.includes("/api/pdf-proxy")) {
            cache.delete(request)
          }
        })
      })
    })
  }
})
