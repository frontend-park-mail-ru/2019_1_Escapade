/* eslint no-restricted-globals: 1 */

const KEY = 'Escapade';
const {assets} = global.serviceWorkerOption;


self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(KEY)
          .then((cache) => cache.addAll(assets))
          .catch((err) => console.log({err})),
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
