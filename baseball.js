var di = 0,
	gi = 0,
	isDude = true,
	teamName;

	teamName=l("currentTeam")||"Squids";

var teams=["Squids","Space Trash"];

function setCurDude(newIdx) {
	di = newIdx;

	l("di", newIdx);
	l("isDude", true);
	isDude = true;
	resetHiLiteList();
	hiLitePlayer(true, di, "curBatter");
	hiLitePlayer(false, gi, "nextBatter");
}

function setCurGal(newIdx) {
	gi = newIdx;
	l("gi", newIdx);
	isDude = false;
	l("isDude", false);
	resetHiLiteList();
	hiLitePlayer(false, gi, "curBatter");
	hiLitePlayer(true, di, "nextBatter");
}


function idx(e, someChildEl) { //get index of someChildEl in e
	return Array.prototype.indexOf.call(e.childNodes, someChildEl);
}
function get(elemId) { return document.getElementById(elemId); }

function html(elemId, newHtml) {
	//console.log(get(elemId));
	//if (get(elemId!=="")){
	if (newHtml !== undefined) {
		get(elemId).innerHTML = newHtml;
	} else {
		return get(elemId).innerHTML;
	}
	/*}else{
		alert(elemId + " is null");
	}*/
}
function hide(elemId) {
	get(elemId).setAttribute("class", "hide");
}

function show(elemId) { get(elemId).setAttribute("class", ""); }

function toggle(elemId) { if(get(elemId).classList.contains("hide")){
		show(elemId);
	}else{
		hide(elemId);
	}
}


function resetHiLiteList() {
	var dl = get("dudesList").childNodes;
	var gl = get("galsList").childNodes;
	for (i = 0; i < dl.length; i++) {
		dl[i].setAttribute("class", "");
	}

	for (i = 0; i < gl.length; i++) {
		gl[i].setAttribute("class", "");
	}
}
function hiLitePlayer(isDude, idx, hiLiteClass) {
	var dl = get("dudesList").childNodes;
	var gl = get("galsList").childNodes;


	if (isDude) {
		dl[idx].setAttribute("class", hiLiteClass);
		//gl[nextIdx].setAttribute("class", hiLiteClass);
	} else {
		gl[idx].setAttribute("class", hiLiteClass);
		//dl[nextIdx].setAttribute("class", hiLiteClass);
	}
}
//UPDAYEEEE
var teamFn = doT.template(html("teamTmpl"));

var curBatter = doT.template(html("battingTmpl2"));

var peopleList = doT.template(html("selectButtons"));
var playerListTmpl= doT.template(html("playersTmpl"));
var linkSongTmplFn=doT.template(html("linkSongTmpl"));

var players=[];
players=jsonStore("players")||[];
function addPlayer(playerName){
	playerName=playerName.trim();
	if (playerName!==""&&players.indexOf(playerName)===-1){
		players.push(playerName);
		jsonStore("players",players);
		//refresh the order setup lists
		peoplesList('dude');
		peoplesList('gal');
	}

}
function removePlayer(playerName) {
	playerName=playerName.trim();
	if (players.indexOf(playerName)!==-1){
		console.log("removing at ",players.indexOf(playerName));
		players.splice(players.indexOf(playerName), 1);
		jsonStore("players",players);
		//refresh the order setup lists
		peoplesList('dude');
		peoplesList('gal');
	}
}

function setPlayerSong(playerName,songName){
	music[playerName]=songName;
	//now i need to like save this to localstorage
	jsonStore("music",music);
}


function updatePlayer(dataSet,playerName,value){
	if (dataSet==="delaySong"){
		delaySong[playerName]=value;
		jsonStore("delaySong",delaySong);
	}else if(dataSet==="musicStartsAt"){
		musicStartsAt[playerName]=value;
		jsonStore("musicStartsAt",musicStartsAt	);
	}
	
}


var Team;

var music=jsonStore("music")||{};

//REMEMBER -- everything is hosted from virtual directory "/bs"

musicStartsAt=jsonStore("musicStartsAt")||{};
delaySong=jsonStore("delaySong")||{};

function exportConfig(){
//ok do we handle multiple teams?
var backupCurTeamName=teamName;
var result=[];

teams.forEach(t=>{
	teamName=t;
	if (jsonStore("players")){  //if we dont have players then there is nothing to backup
		result.push({
			team:t,
			players:jsonStore("players"),
			music:jsonStore("music"),
			musicStartsAt:jsonStore("musicStartsAt"),
			delaySong:jsonStore("delaySong"),
		});

	}

});
saveToClipboard(JSON.stringify(result));
teamName=backupCurTeamName;
}

function importTeamData(){
	var backupCurTeamName=teamName;
//ok lets get the js from the textarea.
var idata=get("importTeamData").value;
console.log(idata);
var x=JSON.parse(idata);
var fields=["players","music","delaySong","musicStartsAt"];
x.forEach(t=>{
	console.log(t.team);
	teamName=t.team;
	fields.forEach(f=>{
		console.log(f);
		if (t[f]){  //if we have some data for our current field
			jsonStore(f,t[f]);  //save it
		}
	})
	
})

teamName=backupCurTeamName;
//loadTeam(teamName);
location.reload();
}


function saveToClipboard(text){
	navigator.clipboard.writeText(text).then(function() {
	/* clipboard successfully set */
	alert("copied to clipboard!");
	}, function() {
	/* clipboard write failed */
	alert("FAILED to copy to clipboard! adding textarea");
	var x = document.createElement("TEXTAREA");
	var t = document.createTextNode(text);
	x.appendChild(t);
	document.body.appendChild(x);
	});
}


function queryCache(){
    var url = [];
    caches.open('mysite-static-v5').then(function (cache){
        cache.keys().then(function(keys){
            return Promise.all(
                    keys.map(function(k){url.push(k.url); return k.url} )
                )
        }).then(function(u){ cacheList(url);})
    })
}
var availableSongs=[];

function cacheList(Items) {
	for (var i = 0; i < Items.length; i++) {
		if (['mp3', 'mp4', 'ogg'].indexOf(Items[i].split(".").pop()) > -1) {
	//		console.log(Items[i]);
			availableSongs.push(Items[i].split("/").pop());
		}
	}
	availableSongs=availableSongs.sort();
}
queryCache();
console.log(availableSongs);

function peoplesList(sex) {
	var p = {};
	p.sex = sex;
	p.people = players.sort();//Object.keys(music).sort();
	html(sex, peopleList(p));
}


function addToList(sex, name) {
	var curSexList = get(sex + 's');
	if (curSexList.value.replace(' ', '') === '') {
		curSexList.value = curSexList.value + name;
	} else {
		curSexList.value = curSexList.value + ',' + name;
	}
}


function loadVoices() {
	var voices = speechSynthesis.getVoices();
	var voiceshtml = "<select id='voice'>";
	for (var i = 0; i < voices.length; i++) {
		voiceshtml += "<option value=" + i + ">" + voices[i].name + "</option>";
		// console.log("Voice " + i.toString() + ' ' + voices[i].name + ' ' + voices[i].uri);
	}
	voiceshtml += "</select>";
	html("voices", voiceshtml);
}



function saveTeam() {
	l("dudes", get("dudes").value);
	l("gals", get("gals").value);
}


function loadTeam(teamId) {
	peoplesList('dude');
	peoplesList('gal');
	//first off we are looking for our list of dudes and gals to populate the active state 
	if (l("dudes") != "") {
		get("dudes").value = l("dudes");
	}
	if (l("gals") != "") {
		//alert(l("dudes"));
		get("gals").value = l("gals");
	}

	if (l("isDude") != "") {
		if (l("isDude") == "true") {
			isDude = true;
		} else {
			isDude = false;
		}

		if (l("di") != "") {

			di = parseInt(l("di"));

		}
		if (l("gi") != "") {
			gi = parseInt(l("gi"));
		}


	}

	Team = loadPlayers(teamId);
	var battingsonghtml = "";

	html("main", teamFn(Team));
	loadVoices();
	resetHiLiteList();
	if (isDude) {
		hiLitePlayer(true, di, "curBatter");
		hiLitePlayer(false, gi, "nextBatter");
	} else {
		hiLitePlayer(true, di, "nextBatter");
		hiLitePlayer(false, gi, "curBatter");
	}
}


var loadPlayers = function (teamId) {
	team = {};
	//reset globals

	var dudes = get("dudes").value.split(",");
	team.dudes = [];
	team.gals = [];

	for (d in dudes) {
		team.dudes.push({
			name: dudes[d]
		});
	}

	var gals = get("gals").value.split(",");

	for (g in gals) {

		team.gals.push({
			name: gals[g]
		});

	}

	curSong = team.dudes[0].song;
	team.name = "Squids";
	team.isCoed = true;
	return team;
}

var sound;
var itsbegun = false;
var curSong;

function nextBatter() {
	var hasDelay = false;
	resetHiLiteList()

	var curSongName;

	if (curSong) {
		curSong.pause();
		curSong.currentTime = 0;
	}

	var next3 = {};
	if (di === Team.dudes.length) { di = 0; }
	if (gi === Team.gals.length) { gi = 0; }

	if (isDude) {

		hiLitePlayer(true, di, "curBatter");
		hiLitePlayer(false, gi, "nextBatter");
		next3.up = Team.dudes[di].name;
		next3.onDeck = Team.gals[gi].name;
		next3.inHole = Team.dudes[di + 1] != undefined ? Team.dudes[di + 1].name : Team.dudes[0].name;

		curSong = new Audio('songs/'+ music[Team.dudes[di].name]+("#t="+musicStartsAt[Team.dudes[di].name]||0)); //new Howl({ urls: ["battingmusic/" + music[Team.dudes[di].name]], buffer: true, volume: 0.7 });
		curSongName = music[Team.dudes[di].name];
		hasDelay = delaySong[Team.dudes[di].name];
		di = di + 1;

		isDude = false;

	} else {

		hiLitePlayer(false, gi, "curBatter");
		hiLitePlayer(true, di, "nextBatter");
		next3.up = Team.gals[gi].name;
	
		curSong = new Audio('songs/'+ music[Team.gals[gi].name]+("#t="+musicStartsAt[Team.gals[gi].name]||0)); //new Howl({ urls: ["battingmusic/" + music[Team.gals[gi].name]], buffer: true, volume: 0.7 });
		hasDelay = delaySong[Team.gals[gi].name];
		curSongName = music[Team.gals[gi].name];
		next3.onDeck = Team.dudes[di].name;
		next3.inHole = Team.gals[gi + 1] != undefined ? Team.gals[gi + 1].name : Team.gals[0].name;
		gi = gi + 1;

		isDude = true;

	}
	l("isDude", isDude);
	l("gi", gi);
	l("di", di);
	html("curBattingTrack", curBatter(next3));
	if (sound) {
		sound.pause();
	}

	voiceSay("now batting  " + next3.up + "    ,," + next3.onDeck + " awn deck   ", function (e) {
		if (musicStartsAt[next3.up] !== undefined) {
			curSong.currentTime = musicStartsAt[next3.up];	
		}
		curSong.play(
			
			function () {
			window.setTimeout(function () {
				if (musicStartsAt[next3.up] !== undefined) {

					curSong.currentTime(musicStartsAt[next3.up]);
					console.log(curSong.currentTime ());
				}
			}, 50);
		}
		);

		html('nowPlaying', curSongName.replace(/%20/g," "));

	}, hasDelay);


}


function voiceSay(say, callback, delay) {
	var e = document.getElementById("voice");
	var strVoice = e.options[e.selectedIndex].value;
	//console.log(strVoice);
	var msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	msg.voice = voices[parseInt(strVoice)]; // Note: some voices don't support altering params
	msg.voiceURI = 'native';
	msg.volume = 1; // 0 to 1
	msg.rate = .6; // 0.1 to 10
	//msg.pitch = 2; //0 to 2
	msg.text = say,
		msg.lang = 'en-US';

	if (callback) {
		if (delay) {
			msg.onend = function () { callback(e) };
		} else {
			callback(e)
		}
	}

	speechSynthesis.speak(msg);
}



function initVoices() {
	//var msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	var watch = setInterval(function () {
		console.log("gettin voices");
		// Load all voices available
		var voices = speechSynthesis.getVoices();
		if (voices.length !== 0) {
			for (var i = 0; i < voices.length; i++) {
				voiceshtml += "<option value=" + i + ">" + voices[i].name + "</option>";
			}
			clearInterval(watch);
			voiceSay("Softball Robo Coach");
		}
	}, 10);

	var voiceshtml = "<select id='voice'>";
	for (var i = 0; i < voices.length; i++) {
		voiceshtml += "<option value=" + i + ">" + voices[i].name + "</option>";
		// console.log("Voice " + i.toString() + ' ' + voices[i].name + ' ' + voices[i].uri);
	}
	voiceshtml += "</select>";
	html("voices", voiceshtml);

}


function playWATC() {
	curSong.pause();
	curSong = curSong = new Audio("songs/Queen - We Are The Champions.mp3#t=38");
	curSong.play(function () {
	});
}
