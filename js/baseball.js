//globals
var di=0,
	gi=0,
	isDude=true,
	Team;  
//set the team name! 
document.getElementById("teamName").innerText=teamName+ " Ball";

//compile our templates	
var teamFn = doT.template(html("teamTmpl"));
var curBatter = doT.template(html("battingTmpl2"));
var peopleList=doT.template(html("selectButtons"));




function saveTeam(){
	storage("dudes",get("dudes").value);
	storage("gals",get("gals").value);
}

//tries to pick up where we left up when the page was closed
function loadTeam(teamId){
	if (storage("dudes")!=""){
		get("dudes").value=storage("dudes");
	}
	if (storage("gals")!=""){
	get("gals").value=storage("gals");
	}

	if (storage("isDude")!=""){
		if (storage("isDude")=="true"){
			isDude=true;
		}else{
			isDude=false;
		}

		if (storage("di")!=""){
				di=parseInt(storage("di"));
		}
		if (storage("gi")!=""){
			gi=parseInt(storage("gi"));
		}
	}
	
	Team=loadPlayers(teamId);
	html("main",teamFn(Team));
	//loadVoices();
	resetHiLiteList();
	if (isDude){
		hiLitePlayer(true,di,"curBatter");
		hiLitePlayer(false,gi,"nextBatter");
	}else{
		hiLitePlayer(true,di,"nextBatter");
		hiLitePlayer(false,gi,"curBatter");
	}
}
  

  //these are the click handlers for when you click on a player in your lineup
function setCurGal(newIdx){
	gi=newIdx;
	storage("gi",newIdx);
	isDude=false;
	storage("isDude",false);
	resetHiLiteList();
	hiLitePlayer(false,gi,"curBatter");
	hiLitePlayer(true,di,"nextBatter");
}
function setCurDude(newIdx){
	di=newIdx;
	storage("di",newIdx);
	storage("isDude",true);
	isDude=true;
	resetHiLiteList();
	hiLitePlayer(true,di,"curBatter");
	hiLitePlayer(false,gi,"nextBatter");
}


function resetHiLiteList(){
	var gl=get("galsList").childNodes;
	var dl=get("dudesList").childNodes;
	
	for(i=0; i < gl.length; i++)
	 {
	     gl[i].setAttribute("class", "");
	 }
	
	for(i=0; i < dl.length; i++)
	 {
	     dl[i].setAttribute("class", "");
	 }

	
}

function hiLitePlayer(isDude,idx,hiLiteClass){
	 var dl=get("dudesList").childNodes;
	 var gl=get("galsList").childNodes;
	if (isDude){
		dl[idx].setAttribute("class", hiLiteClass);
	}else{
		gl[idx].setAttribute("class", hiLiteClass);
	}
}

//get all the player names from our music config, and draw a button for each in the setup sections
function peoplesList(sex){
	var p={};
	p.sex=sex;
	p.people=Object.keys(music).sort();
	html(sex,peopleList(p));
}
peoplesList('dude');
peoplesList('gal');

//when the user clicks a person in the setup section it is added to the appropriate csv input via this
function addToList(sex,name){
	var curSexList=get(sex+'s');
	if (curSexList.value.replace(' ','')===''){
		curSexList.value=curSexList.value+name;
	}else{
		curSexList.value=curSexList.value+','+name;
	}
}

function loadVoices(){  //init speech synthesis and make the voice select dropdown
	var voices = window.speechSynthesis.getVoices();
	var voiceshtml="<select id='voice'>";
      for(var i = 0; i < voices.length; i++ ) {
      	voiceshtml+="<option value="+i+">"+voices[i].name+"</option>";
       // console.log("Voice " + i.toString() + ' ' + voices[i].name + ' ' + voices[i].uri);
      }
	voiceshtml+="</select>";
	html("voices",voiceshtml);
	console.log(voiceshtml);
}



var loadPlayers=function(teamId){
	
	//reset globals
	team={};

	var dudes=get("dudes").value.split(",");
	team.dudes=[];
	team.gals=[];

	for (d in dudes){
	team.dudes.push({name:dudes[d]});
	}

	var gals=get("gals").value.split(",");

	for (g in gals){
		team.gals.push({name:gals[g]
		});
		
	}
	curSong=team.dudes[0].song;
	team.name="Squids";
	team.isCoed=true;
	return team;
}



var curSong; //holds our currently playing howler object


//this is sort of the main part of this whole thing, which handles advancing to the next player and kicking off the batter announcement and music
function nextBatter(){
	var hasDelay=false;
	var curSongName;
	
	resetHiLiteList();

	if (curSong){
		curSong.stop();
	}
	
	var next3={};
	//if we have reached the end of either list, start over at the beginning
	if (di===Team.dudes.length){di=0;}
	if (gi===Team.gals.length){gi=0;}

	if (isDude){
		hiLitePlayer(true,di,"curBatter");
		hiLitePlayer(false,gi,"nextBatter");
		next3.up=Team.dudes[di].name;
		next3.onDeck=Team.gals[gi].name;
		next3.inHole=Team.dudes[di+1]!=undefined?Team.dudes[di+1].name:Team.dudes[0].name;
		curSong=new Howl({  urls:["battingmusic/"+music[Team.dudes[di].name]],buffer:true, volume: 0.7});
		curSongName=music[Team.dudes[di].name];
		hasDelay=delaySong[Team.dudes[di].name];
		di=di+1;
		isDude=false;	
	}else{
		hiLitePlayer(false,gi,"curBatter");
		hiLitePlayer(true,di,"nextBatter");
		next3.up=Team.gals[gi].name;
		curSong=new Howl({  urls:["battingmusic/"+music[Team.gals[gi].name]],buffer:true, volume: 0.7});
		hasDelay=delaySong[Team.gals[gi].name];
		curSongName=music[Team.gals[gi].name];
		next3.onDeck=Team.dudes[di].name;
		next3.inHole=Team.gals[gi+1]!=undefined?Team.gals[gi+1].name:Team.gals[0].name;
		gi=gi+1;
		isDude=true;
	}
	storage("isDude",isDude);
	storage("gi",gi);
	storage("di",di);
	
	html("curBattingTrack",curBatter(next3));

	voiceSay("now batting  "+next3.up + "    ,,"+next3.onDeck+" awn deck   " ,hasDelay,
		function() {
			curSong.play(function(){
			window.setTimeout(function(){
			  if (musicStartAt[next3.up]!==undefined){
				curSong.pos(musicStartAt[next3.up]);
			  }
			},50);
		  });

		html('nowPlaying',curSongName);
		}
	);

}

//have voice synthesis say something
function voiceSay(say,finishSpeakingBeforeStartCallback,callback,){
	var e = document.getElementById("voice");
	console.log(e.children.length);
	var strVoice;
	if (e.children.length){ //if the voices have already been laoded into the list...
		strVoice = e.options[e.selectedIndex].value;
	}else{
		strVoice = null;
		
	}
	
	var msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	msg.voice = voices[parseInt(strVoice)]; // Note: some voices don't support altering params
	msg.voiceURI = 'native';
	msg.volume = 1; // 0 to 1
	msg.rate = .6; // 0.1 to 10
	//msg.pitch = 2; //0 to 2
	msg.text = say ,
	msg.lang = 'en-US';

	if (callback){
		if (finishSpeakingBeforeStartCallback){
			msg.onend = function(){callback()};
		}else{
		callback()
		}
	}
	speechSynthesis.speak(msg);
}

//get our available voices and create a select box of these voices
function initVoices(){
var voices = window.speechSynthesis.getVoices();

var watch = setInterval(function() {  //we wrap this in an interval that runs until we get the voices, because getting the voices seems to not always work
			console.log("gettin voices");
               // Load all voices available
               var voices = speechSynthesis.getVoices();
			  // console.log(voices);
               if (voices.length !== 0) {
				   var voiceshtml="<select id='voice'>"; 
                   for(var i = 0; i < voices.length; i++ ) {
						voiceshtml+="<option value="+i+">"+voices[i].name+"</option>";
					}
					voiceshtml+="</select>";
					html("voices",voiceshtml);
					voiceSay("lets go " + teamName);
				  clearInterval(watch);
               }
            }, 10);
	

}
  
//play a victory song when the button is pushed.
function playWATC(){
	curSong.stop();
	curSong=new Howl({  urls:["battingmusic/QueenWeAreTheChampions.mp3"],buffer:true, volume: 0.7});
		curSong.play(function(){
    window.setTimeout(function(){

        curSong.pos(38);
        console.log( curSong.pos());

    },50);
  });
}
