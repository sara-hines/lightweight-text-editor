const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// CacheFirst: try to serve the requested resource from the cache first; if not available, fetch from network.
const pageCache = new CacheFirst({
    cacheName: 'page-cache',
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            // 30 day expiration
            maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
    ],
});

// Preloads the '/index.html' and '/' urls to ensure they are available offline immediately.
warmStrategyCache({
    urls: ['/index.html', '/'],
    strategy: pageCache,
});

registerRoute(
    ({ request }) => request.mode === 'navigate', pageCache);

// Route for caching assets
registerRoute(
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    // StaleWhileRevalidate: serve the cached response if available while updating the cache with a fresh response from the network
    new StaleWhileRevalidate({
        cacheName: 'asset-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            // Limit the entries in the cache to 60 and set a 30 day expiration 
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            })
        ],
    })
);
