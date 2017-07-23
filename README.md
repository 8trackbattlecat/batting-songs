# batting-songs
### Preload your device with songs, update the batting order on the day of the game, announce each player in a robot voice and play their batting songs in the desired order, sock dingers.

Playing a walkup song for each player of your coed softball team gets difficult when you have a mismatched number of gals and dudes.
You could premake a super long playlist with songs repeated in interleaving order, you could hire a dj to take care of it, or you could use batting songs, and get your upcoming batters announced by a robot.

---
Batting-Songs uses:
* [Web Speech Speech Synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
* [howler.js](https://howlerjs.com/)
* [doT.js](http://olado.github.io/doT/index.html)
* [cache.manifest](https://developer.apple.com/library/content/documentation/iPhone/Conceptual/SafariJSDatabaseGuide/OfflineApplicationCache/OfflineApplicationCache.html)

I might have been a little drunk when I put this code together.

## Setup

Put music files in /battingmusic

Add your player names and their song file names to the music object in teamConfig.js.  You can also set a time to start their song in the musicStartsAt object, and set if you want the music to be delayed until the robot announcer finishes with the delaySong object.

To cache the songs on your device you will need to setup a local webserver and serve from there.  Using the cache.manifest can be a pain, and you want to be sure that the server is not sending cache headers with the .html files or .manifest file.  You may get in a  situation where the files are cached and will not update, in which case you need to clear your browser history/cache for whatever domain you are serving from.  It is probably easiest to remove weird characters and spaces from filenames.  You may also need to configure the server to serve .manifest files.

It is also helpful to be able to see the console output of the mobile browser when you are getting this setup.  As of writing iOS has a tendency to reject the cache manifest if you have too many songs, however you can frequently get around this by removing half the songs form the cache manifest, letting it cache successfully, and then adding the rest...

Once you have it cached successfully, add the webpage as a homescreen app and verify that it works in airplane mode.  Finally, grab a boombox and an audio cable and get out there and sock some dingers.
