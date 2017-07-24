//some general utilities
function storage(key,item){
 if (item!=undefined){
 	localStorage.setItem(key+teamName,item);
 }else{
 	return localStorage.getItem(key+teamName);
 }
}

function idx(e,someChildEl){ //get index of someChildEl in e
	return Array.prototype.indexOf.call(e.childNodes, someChildEl);
}

function get(elemId){return document.getElementById(elemId);}

function html(elemId,newHtml)
{
	if (newHtml!==undefined){
		get(elemId).innerHTML=newHtml;
	}else{
		return get(elemId).innerHTML;
	}
}

function hide(elemId){
	get(elemId).setAttribute("class", "hide");
}

function show(elemId){get(elemId).setAttribute("class", "");}
