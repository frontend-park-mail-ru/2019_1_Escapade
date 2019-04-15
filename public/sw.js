/* eslint no-restricted-globals: 1 */

// @flow weak
/* eslint-disable no-console */

const DEBUG = true;

// When the user navigates to your site,
// the browser tries to redownload the script file that defined the service
// worker in the background.
// If there is even a byte's difference in the service worker file compared
// to what it currently has, it considers it 'new'.
const {assets} = global.serviceWorkerOption;

const CACHE_NAME = 'Escapade';

const assetsToCache = [...assets, './'];

// assetsToCache = assetsToCache.map((path) => {
//   return new URL(path, global.location).toString();
// });

// When the service worker is first added to a computer.
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
