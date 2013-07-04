var ClickBox=function(type,x,y,count){
	var instance=this;
	var p=this.prototype;
	
	this.type=type;
	this.count=count;
	this.enabled=true;
	this.callback=null;
	this.clip=new Container();
	var box=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("static.png"),Assets.get("static.json"),this.type+".png"));
	this.clip.addChild(box);
	var countTxt=new Text(count,"bold 12px Verdana","#666");
	this.clip.addChild(countTxt);
	countTxt.x=66;
	countTxt.y=13;
	countTxt.textAlign="center";
	if(Config.boxProperties[this.type]){
		this.clip.regX=Config.boxProperties[this.type].regX ||0;
		this.clip.regY = Config.boxProperties[this.type].regY ||0;
	}
	this.clip.x=x;
	this.clip.y=y;
	
	this.dragBoxId=Config.boxProperties[this.type].dragBox;
	this.dragBox=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("static.png"),Assets.get("static.json"),Config.boxes[this.dragBoxId]+".png"));;

	this.reduceCount=function(){
		if(--count==0){
			this.disable();
		}
		countTxt.text=count;
	}
	this.disable=function(){
		this.enabled=false;
		this.clip.alpha=0.3;
		this.clip.onPress=null;
	}
	this.enable=function(){
		this.enabled=true;
		this.clip.alpha=1;
		this.clip.onPress=this.callback;
	}
	this.clip.onMouseOver=function(e){
		if(instance && instance.enabled){
			document.getElementById("canvas").style.cursor="pointer";
			this.shadow=new Shadow("#000",0,0,1);
		}
	}
	this.clip.onMouseOut=function(e){
		if(instance && instance.enabled){
			document.getElementById("canvas").style.cursor="default";
			this.shadow=null;
		}
	}
	
	this.addListener=function(callback){
		this.callback=callback;
		this.clip.onPress=function(e){
			instance.callback(instance,e);
		}
	}
	this.removeListener=function(){
		this.callback=null;
		this.clip.onPress=null;
	}
	this.dispose=function(){
		this.removeListener();
		this.dragBox=null;
		this.clip.removeAllChildren();
		this.clip.onMouseOver=this.clip.onMouseOut=this.clip.onPress=null;
		this.clip.parent.removeChild(this.clip);
		this.clip=null;
		instance=null;
		p=null;
	}
}
