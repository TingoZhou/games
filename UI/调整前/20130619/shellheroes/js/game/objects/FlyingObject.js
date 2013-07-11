var FlyingObject=function(type,direction){
	var instance=this;

	this.type=type;
	this.disposable=false;
	this.direction=direction;
	var counter=0;
	var counterInc=0.0001;
	
	var animation="all";
	if(this.direction==1){
		animation+="_h";
	}
	
	
	var ix,iy,amplitude,speed,speedRandomness;
	ix=Config.middleX*2+10;
	if(direction==1){
		ix=-10;
	}
	
	this.init=function(){
		if(type=="bird"){
			iy=(100+Math.random()*100)>>0;
			amplitude=30;
			speed=2;
			speedRandomness=1;
			counterInc=0.0005;
			var s=new SpriteSheet(getSpriteData(Assets.get("bird.png"),Assets.get("bird.json")));
			SpriteSheetUtils.addFlippedFrames(s,true,false,false);
			this.clip=new BitmapAnimation(s);
			this.clip.scaleX=this.clip.scaleY=Math.random()*0.5+0.5;
		}
		if(type=="feather"){
			iy=(Config.middleY+Math.random()*25)>>0;
			amplitude=30;
			speed=1*Math.random()*0.5;
			speedRandomness=0.999;//10% randomness
			var s=new SpriteSheet(getSpriteData(Assets.get("feather.png"),Assets.get("feather.json")));
			SpriteSheetUtils.addFlippedFrames(s,true,false,false);
			this.clip=new BitmapAnimation(s);
			this.clip.scaleX=this.clip.scaleY=Math.random()*0.9+0.1;
		}
		this.clip.offset=(Math.random()*5)>>0;
		this.clip.gotoAndPlay(animation);
		this.clip.x=ix;
		this.clip.y=iy;
		
		
		amplitude-=this.clip.scaleX*10;
	}
	
	this.update=function(){
		if(this.disposable){
			return;
		}
		if(this.clip.currentAnimation!=animation){
			this.clip.gotoAndPlay(animation);
		}
		this.clip.x+=speed*this.direction*Config.gameSpeed;
		this.clip.y=(iy+Math.sin(counter*180/Math.PI)*amplitude)>>0;
		
		counter+=counterInc*Config.gameSpeed;
		if(this.type=="feather"){
			this.clip.rotation+=speed*this.direction*Config.gameSpeed;
			speed-=0.008*Config.gameSpeed;
			speed=Math.max(speed,1);
		}
		if(Math.random()>speedRandomness){
			speed=1+Math.random()*speed+Math.random()*speed;
			speed=Math.min(speed,3);
		}
		if(this.direction==1 && this.clip.x>Config.middleX*2+10){
			this.disposable=true;
		}
		if(this.direction==-1 && this.clip.x<-10){
			this.disposable=true;
		}
	}
	
	this.dispose=function(){
		instance=null;
		this.clip=null;
	}
}
