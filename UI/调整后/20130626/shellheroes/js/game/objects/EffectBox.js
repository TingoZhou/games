var EffectBox=function(_type,direction,x,y,callback){
	var instance=this;
	var p=this.prototype;
	
	this.type=_type;
	this.direction=direction;
	var sp=new SpriteSheet(getSpriteData(Assets.get(this.type+".png"),Assets.get(this.type+".json")));
	SpriteSheetUtils.addFlippedFrames(sp, true, false, false);
	this.clip=new BitmapAnimation(sp);
	
	this.clip.x=x;
	this.clip.y=y;
	
	if(Config.boxProperties[this.type]){
		this.regX = Config.boxProperties[this.type].regX ||0;
		this.regY = Config.boxProperties[this.type].regY ||0;
		this.clip.regX=this.regX*this.direction;
		this.clip.regY=this.regY;
	}
	
	if(this.direction==1){
		this.clip.gotoAndPlay("all");
	}else{
		this.clip.gotoAndPlay("all_h");		
	}
	this.clip.onAnimationEnd=callback;
	
	this.dispose=function(){
		instance=null;
		p=null;
		this.clip.onAnimationEnd=null
		this.clip=null;
		callback=null;
	}
}
