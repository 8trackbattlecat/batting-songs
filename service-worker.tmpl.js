
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.

// A list of local resources we always want to be cached. d2
const PRECACHE_URLS = [
//'index.html',
'./', 
'doT.js',
'baseball.js?v=|||VERSIONSTAMP|||',
'icons/icon32.png',
'icons/icon64.png',
'icons/icon128.png',
'icons/icon256.png',
'icons/icon512.png',
'baseballwa.manifest',
'favicon.ico',
songsGoHere
];
//REMEMBER -- everything is hosted from virtual directory "/bs"
self.addEventListener('install', function (event) {
//	delete('mysite-static-v5')
//console.log("caches deleted");
  event.waitUntil(
    caches.open('mysite-static-v5').then(function (cache) {
        //   return 
        cache.addAll(PRECACHE_URLS);
           self.skipWaiting();
           return;
    }),
  );
});


/*
self.onfetch= function(event) {
    event.respondWith(
      caches.match(event.request, {
        ignoreVary: true
      })
    );

  
};
*/
self.addEventListener('fetch', event => {
	console.log(event.request.url);
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
	   if (event.request.headers.get('range')) {
      event.respondWith(returnRangeRequest(event.request, 'mysite-static-v5'));
		} else {
			event.respondWith(
			  caches.match(event.request).then(cachedResponse => {
				if (cachedResponse) {
				  return cachedResponse;
				}else{
                    return requestBackend(event);
                  }
			  })
			);
		}
  }
});
//===================================FUCK FUCK FUCK FUCK FUCK====================
//
//				LAST TIME I HAD TO RELOAD USING DEV TOOLS ON THE MAC TO GET IT TO UPDATE THE FUCKING SERVICE WORKER I HATE THIS SO MUCH
//
//===================================FUCK FUCK FUCK FUCK FUCK====================





function returnRangeRequest(request, cacheName) {
  return caches
    .open(cacheName)
    .then(function(cache) {
      return cache.match(request.url);
    })
    .then(function(res) {
      if (!res) {
        return fetch(request)
          .then(res => {
            const clonedRes = res.clone();
            return caches
              .open(cacheName)
              .then(cache => cache.put(request, clonedRes))
              .then(() => res);
          })
          .then(res => {
            return res.arrayBuffer();
          });
      }
      return res.arrayBuffer();
    })
    .then(function(arrayBuffer) {
    const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
      request.headers.get('range')
    );
    if (bytes) {
      const start = Number(bytes[1]);
      const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
      return new Response(arrayBuffer.slice(start, end + 1), {
        status: 206,
        statusText: 'Partial Content',
        headers: [
          ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
        ]
      });
    } else {
      return new Response(null, {
        status: 416,
        statusText: 'Range Not Satisfiable',
        headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
      });
    }
  });
}



function requestBackend(event){
    var url = event.request.clone();
    return fetch(url).then(function(res){
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }
  
        var response = res.clone();
  
     /*   caches.open(CACHE_VERSION).then(function(cache){
            cache.put(event.request, response);
        });*/
  
        return res;
    })
  }
  