(function(Tutorial){
	var notes=null;
	var stageRef=null;
	var texts,arrows;
	
	Tutorial.init=function(_stageRef){
		stageRef=_stageRef;
		notes=[];
		texts=[];
		arrows=[];
		var tObjects;
		tObjects=Config.tutorials[Config.level];
		for(var i=0;i<tObjects.length;i++){
			var tt=tObjects[i].text;
			if(Game.isIOS() && tObjects[i].textiOS){
				tt = tObjects[i].textiOS;
			}
			if(Game.isAndroid() && tObjects[i].textAnd){
				tt = tObjects[i].textAnd;
			}
			createText(tt,tObjects[i].x,tObjects[i].y);
			createArrow(tObjects[i].x,tObjects[i].y,tObjects[i].arrowX,tObjects[i].arrowY);
		}
	}
	
	function createText(text,x,y){
		var text=new Text(text,"bold 15px "+Game.font,"#2D1600");
		stageRef.addChild(text);
		text.x=x;
		text.y=y;
		text.textAlign="center";
		text.textBaseline ="middle";
		texts.push(text);
	}
	function createArrow(sx,sy,tx,ty){
		var arrow=new Arrow(sx,sy,tx,ty);
		stageRef.addChild(arrow.clip);
		arrows.push(arrow);
	}
	
	Tutorial.isAvailable=function(){
		if(Config.tutorials[Config.level]){
			return true;
		}else{
			return false;
		}
	}
	
	Tutorial.dispose=function(){
		if(texts)
		for(var i=0;i<texts.length;i++){
			stageRef.removeChild(texts[i]);
		}
		texts=null;
		if(arrows)
		for(var i=0;i<arrows.length;i++){
			stageRef.removeChild(arrows[i].clip);
			arrows[i].dispose();
		}
		arrows=null;
		notes=null;
		stageRef=null;
	}
	
	window.Tutorial=Tutorial;
})(window.Tutorial||{});
