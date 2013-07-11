var chge_loadedScriptCount=0;
var chge_totalScriptsToLoad=0;
var chge_scriptLoadCallback=null;
function importScripts(scripts,callback){
	chge_totalScriptsToLoad=scripts.length;
	chge_scriptLoadCallback=callback;
	for(var i=0; i<chge_totalScriptsToLoad; i++){
		loadScript(scripts[i],scriptLoaded);
	}
}
function scriptLoaded(){
	chge_loadedScriptCount++;
	if(chge_loadedScriptCount>=chge_totalScriptsToLoad){
		Game.changeState(chge_scriptLoadCallback);
	}
}
function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url+"?"+Math.random();

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}
/**
 * Get Spritesheet frame/animation data from json file
 * @param image
 * @param json
 */
function getSpriteData(image,json)
{
	json.images=[image];
	return json;
}

function trace(s){
	if(s instanceof Object){
		s=JSON.stringify(s);
	}
	var o=document.getElementById("debug").innerHTML;
	document.getElementById("debug").innerHTML=o+"<br/>"+s.toString();
}

function zeroPad(number,width){
	var s=String(number);
	while(s.length<width){
		s="0"+s;
	}
	return s;
}
Math.clamp = function(value, min, max) {
      value = value > max ? max : value;
      value = value < min ? min : value;
      return value;
};

Array.prototype.clone = function () {
	var a = new Array();
	for (var property in this) {
		a[property] = typeof (this[property]) == 'object' ? this[property].clone() : this[property];
	} 
	return a;
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
