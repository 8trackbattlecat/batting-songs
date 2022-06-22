
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.

// A list of local resources we always want to be cached. d2
const PRECACHE_URLS = [
//'index.html',
'./', 
'doT.js',
'baseball.js?v=1655868662',
'icons/icon32.png',
'icons/icon64.png',
'icons/icon128.png',
'icons/icon256.png',
'icons/icon512.png',
'baseballwa.manifest',
'favicon.ico',
'songs/06 Bizarre Love Triangle.mp3',
'songs/a-ha - Take On Me (Official Video).mp3',
'songs/AbbaDancingQueen.mp3',
'songs/ARE YOU READY FOR SOME FOOTBALL.mp3',
'songs/Baltimora - Tarzan Boy.mp3',
'songs/Beyonce - Crazy In Love ft. JAY Z.mp3',
'songs/Billy Ocean - Get Outta My Dreams, Get Into My Car.mp3',
'songs/BillyOceanCaribbeanQueen.mp3',
'songs/Blue Swede - Hooked on a Feeling.mp3',
'songs/BrandyYoureAFineGirlLookingGlass.mp3',
'songs/CallMeMaybeSpanishVersion.mp3',
'songs/CeCe Peniston - Finally (Official Music Video).mp3',
'songs/Chuck E. Cheese For My Birthday.mp3',
'songs/Cocteau Twins - Pitch the Baby.mp3',
'songs/Deerhoof - Holy Night Fever (from Reveille).mp3',
'songs/George Michael - Careless Whisper.mp3',
'songs/Girl Youll Be a Woman Soon.mp3',
'songs/Guided By Voices - Hot Freaks.mp3',
'songs/hulk hogan theme real american hero.mp3',
'songs/Hum_IdLikeYourHairLong.mp3',
'songs/Hurricane Season.mp3',
'songs/Keith Sweats McDonalds Commercial.mp3',
'songs/Kellis feat Too Short - Chip-X - Bossy.mp3',
'songs/Korn - Blind (Official Video).mp3',
'songs/Liam Aidan - Lets Make It.mp3',
'songs/Lizzo - Good As Hell (Video).mp3',
'songs/Lonegun Breakwater ReleaseTheBeast.mp3',
'songs/Love Come Down- Evelyn Champagne King.mp3',
'songs/lump - presidents of the united states of america.mp3',
'songs/Mariah Carey - Fantasy.mp3',
'songs/Mariah Carey - Heartbreaker.mp3',
'songs/Marlins Will Soar - by Scott Stapp.mp3',
'songs/McDonaldss1000000Record1988Contest.mp3',
'songs/MissyElliott-WorkIt.mp3',
'songs/MoodyBluesNights.mp3',
'songs/NSYNCTearinUpMyHeart(Video).mp3',
'songs/Panama.mp3',
'songs/Rihanna - Birthday Cake.mp3',
'songs/Rufus and Chaka Khan - Tell Me Something Good.mp3',
'songs/Scatman John - Im A scatman.mp3',
'songs/Shes A Bad Mama Jama (Shes Built, Shes Stacked) - Carl Carlton (1981).mp3',
'songs/SimpsonsTheme.mp3',
'songs/Southern Culture On The Skids - Camel Walk.mp3',
'songs/SQUIDS - LOU - House of Pain - Jump Around.mp3',
'songs/SQUIDS - SMALLS - Birthday Cake.mp3',
'songs/The Flaming Lips - She Dont Use Jelly Official Music Video.mp3',
'songs/The Greatest Hit of Disturbed.mp3',
'songs/The Sound of Silence (Original Version from 1964).mp3',
'songs/TouhouTheDisappearingOfGensokyo.mp3',
'songs/Walter Murphy - A Fifth of Beethoven.mp3',
'songs/X-FILES_TECHNOREMIX_.mp3',
'songs/Yello - Oh Yeah (Official Video).mp3',
'songs/ZZ Top - Tush.mp3',

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
  