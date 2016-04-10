var CACHE_NAME = 'ic4f';
// The files we want to cache
var urlsToCache = [
  '/',
  '/bower_components/angular/angular.js',
  '/scripts/mainController.js',
  '/build/react.js',
  '/build/react-dom.js',
  'index.js'
];

// Set the callback for the install step
self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('[ServiceWorker] Caching');
        return cache.addAll(urlsToCache.map(function (urlToCache) {
          return new Request(urlToCache, {mode: 'no-cors'});
        })).then(function () {
          console.log('All resources have been fetched and cached.');
        });
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function (response) {
            // Check if we received a valid response
            // Only cache requests in our origin
            if (!response || response.status !== 200 || response.type !== 'basic' || !event.request || event.request.method.toUpperCase() !== 'GET') {
              return response;
            }


            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

