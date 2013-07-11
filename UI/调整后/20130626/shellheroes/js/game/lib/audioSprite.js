(function(AudioSprite){
	var currentStartPos,currentEndPos;
	var sounds={};
	var audio;
	var trackTimer;
	var playCount=0;
	
	AudioSprite.init=function(_sounds,track){
		sounds=_sounds;
		audio=document.createElement('audio');
		audio.src="js/game/"+track;
		audio.autobuffer=true;
		audio.load();
		audio.muted=true;
		audio.addEventListener('play',forceStop,false);
		document.ontouchstart=AudioSprite.ready;
	}
	function forceStop(){
		audio.pause();
		audio.removeEventListener('play',forceStop);
	}
	AudioSprite.ready=function(){
		audio.play();
		document.ontouchstart=null;
	}

	AudioSprite.play=function(sound,loops){
		if(Game.isMuted()){
			return;
		}
		if(!sounds[sound]){
			return;
		}
		var currSound=sounds[sound];
		currentStartPos = currSound.start;
		currentEndPos = currSound.end;
		audio.muted=false;
		try{
			audio.currentTime=currentStartPos;
		}catch(e){}
		audio.play();
		clearInterval(trackTimer);
		trackTimer=setInterval(
			function(){
				if(audio.currentTime>=currentEndPos){
					if(playCount<loops || loops==-1){
						audio.currentTime=currentStartPos;
						audio.play();
						audio.muted=false;
						playCount++;
					}else{
						clearInterval(trackTimer);
						audio.pause();
						audio.muted=true;
					}
				}
			},10);
	}
	AudioSprite.stop=function(){
		clearInterval(trackTimer);
		if(!Game.isIOS()){
			return;
		}
		audio.pause();
		audio.muted=true;
	}
	AudioSprite.pause=function(){
		if(!Game.isIOS()){
			return;
		}
		audio.pause();
		audio.muted=true;
	}
	AudioSprite.resume=function(){
		if(Game.isMuted()){
			return;
		}
		if(!Game.isIOS()){
			return;
		}
		audio.play();
		audio.muted=true;
	}
	window.AudioSprite=AudioSprite;
})(window.AudioSprite || {});
