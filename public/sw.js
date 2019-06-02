
const DEBUG = false;

const {assets} = global.serviceWorkerOption;

const CACHE_NAME = 'Escapade';

const assetsToCache = [...assets, './'];

self.addEventListener('install', (event) => {
  // Perform install steps.
  if (DEBUG) {
    console.log('[SW] Install event');
  }

  // Add core website files to cache during serviceworker installation.
  event.waitUntil(
      global.caches
          .open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(assetsToCache);
          })
          .then(() => {
            if (DEBUG) {
              console.log('Cached assets: main', assetsToCache);
            }
          })
          .catch((error) => {
            console.error(error);
            throw error;
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
