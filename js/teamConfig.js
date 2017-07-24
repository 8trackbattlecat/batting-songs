 var teamName="Squids";
 
 //key value pair {"player name", "mp3name.mp3}
var music={
	"BubbleKing": "MeekerBallGame.ogg",
	"Coolhand":"The_Entertainer_-_Scott_Joplin.ogg",
	"Reiner Sixty Niner":"Richard_Strauss_-_Also_Sprach_Zarathustra.ogg",
	"Danimal":"MeekerBallGame.ogg",
	"Beastor X":"The_Entertainer_-_Scott_Joplin.ogg",
	"Switchblade":"Wagner_Tristan_opening_(orchestral).ogg",
	"Jocelyn":"MeekerBallGame.ogg",
	"Diamond":"The_Entertainer_-_Scott_Joplin.ogg",
	"Rah":"Richard_Strauss_-_Also_Sprach_Zarathustra.ogg",
	"Dern":"MeekerBallGame.ogg",
	"Madeline":"The_Entertainer_-_Scott_Joplin.ogg",
	"Smalls":"Richard_Strauss_-_Also_Sprach_Zarathustra.ogg"

}

//second at which to start the song, 0 if not included
var musicStartAt={
"BubbleKing":16,
"Reiner Sixty Niner":19,
}

//should we announce the batter and on deck person before starting the song? 
var delaySong={
	"BubbleKing": true,
	"Smalls":false,
	
}