/* eslint-disable no-invalid-this */
const CACHE_NAME = 'Esapade';
const {cacheUrls} = global.serviceWorkerOption;

self.addEventListener('install', (event) => {
  event.waitUntil(
      caches
          .open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(cacheUrls);
          })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches
          .match(event.request)
          .then((cachedResponse) => {
            if (!navigator.onLine && cachedResponse) {
              return cachedResponse;
            }

            return fetch(event.request);
          })
  );
});
