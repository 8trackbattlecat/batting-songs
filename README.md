# batting-songs
### Preload your device with songs, update the batting order on the day of the game, announce each player in a robot voice and play their batting songs in the desired order, sock dingers.

Playing a walkup song for each player of your coed softball team gets difficult when you have a mismatched number of gals and dudes.
You could premake a super long playlist with songs repeated in interleaving order, you could hire a dj to take care of it, or you could use batting songs, and get your upcoming batters announced by a robot.

---
Batting-Songs uses:
* [Web Speech Speech Synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
* [doT.js](http://olado.github.io/doT/index.html)
*  Service Worker - for offline caching..  also this means whenever you make a change (like add a new song and rebuild) you need to reload at least 2 times.


This was put together hastily for a beer league softball team.  It has evolved over the years a bit from appcache to service worker.  Still has the sort of weird pattern where there are a couple of hashmaps that use the player name to store data. If you want to edit the service worker or the index.html be sure to change the template versions: index.tmpl.html and service-worker.tmpl.js. the other files get overwritten by the build.


## Setup

1. Put music files in /songs
2. run node makeSw.js to build the service worker with the song list
3. Access the page from your device

Updates
* Service Worker
* As of 6/21/2022 there is an interface for adding players and configuring the start time of their song, and if we should wait for the announcer to finsh before the music starts.
* Once you have setup your team you can export it (go to "Show Setup > Export Setup".  To import somewhere else do "Show Setup > Config Players >Import >(paste into text box) >"Do Import"  

To cache the songs on your device you will need to setup a local webserver and serve from there. I use IIS, maybe will switch to node for this sometime soon.

Once you have it cached successfully, add the webpage as a homescreen app and verify that it works in airplane mode.  Finally, grab a boombox and an audio cable and get out there and sock some dingers.
