var ToggleButton=function(spriteData,defaultState){
	var instance=this;
	
	this.state=defaultState;
	var sp=new SpriteSheet(spriteData)
	this.clip=new BitmapAnimation(sp);
	this.clip.gotoAndStop(defaultState);
	
	
	this.changeState=function(state){
		this.state=state;
		this.clip.gotoAndStop(state);
	}
	
	this.dispose=function(){
		instance=null;
		sp=null;
		this.clip=null;
	}
}
