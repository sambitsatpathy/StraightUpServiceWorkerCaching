//Your custom cache name. Change version number whenever you want to upgrade.
//Keep this in parallel to your index.html
var CACHE_NAME = '<YOUR_APP_NAME>-cache-v1';

this.addEventListener('install', function(event) {
  console.log("Installed");
  //Store everything into cache to make it available in offline mode.
  caches.open(CACHE_NAME)
  .then(function(cache) {
    return cache.addAll(['/']);
  });
});

this.addEventListener('activate', function(event) {
  console.log("Activated");
  //Delete previous caches while activating. Called on update.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/*
  Add to cache with every request. If exists in cache pick from there but still do a call to update the data for the next time.
  Similar to HTTP's stale-while-revalidate.
*/
this.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
});
