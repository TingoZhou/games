var Box=function(_type,x,y,direction){
	var instance=this;
	var p=this.prototype;
	this.direction=direction||1;
	this.index=-1;
	this.type=_type;
	this.fake=Config.boxProperties[this.type].fake || false;
	this.animated=Config.boxProperties[this.type].animated|| false;
	if(!this.fake){
		if(this.animated){
			var sp=new SpriteSheet(getSpriteData(Assets.get(this.type+".png"),Assets.get(this.type+".json")));
			SpriteSheetUtils.addFlippedFrames(sp,true,false,false);
			this.clip=new BitmapAnimation(sp);
			this.clip.offset=0;
			this.clip.gotoAndStop(0);
		}else{
			this.clip=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("static.png"),Assets.get("static.json"),this.type+".png"));
		}
	}else {
		var g=new Graphics();
		g.beginFill("#fff");
		g.rect(0,0,Config.CELL_WIDTH,Config.CELL_HEIGHT);
		g.endFill();
		this.clip=new Shape();
		//this.clip=new Shape(g);
	}
	this.regX = Config.boxProperties[this.type].regX ||0;
	this.regY = Config.boxProperties[this.type].regY ||0;
	this.clip.regX=this.regX;
	this.clip.regY=this.regY;
	this.clip.x=x;
	this.clip.y=y;
	if(this.direction==-1){
		this.clip.scaleX=-1;
	}
	
    this.boundingRectangle=new XNARectangle(this.clip.x,
    										this.clip.y,
    										50,50);
    
    this.isBreakable=Config.boxProperties[this.type].breakable || false;
    this.isBlock=Config.boxProperties[this.type].block || false;
    this.isActionBox=Config.boxProperties[this.type].action || false;
    this.isSpike=Config.boxProperties[this.type].spike || false;
    
    this.col=(x/Config.CELL_WIDTH)>>0;								
    this.row=(y/Config.CELL_HEIGHT)>>0;
    
    this.cell={i:this.col,j:this.row};
    
    this.animate=function(){
    	var dString=(this.direction==1)?"":"_h";
    	this.clip.onAnimationEnd=function(){
    		instance.clip.gotoAndStop(0);
    	}
    	this.clip.gotoAndPlay("all");
    }
    this.dispose=function(){
    	if(this.clip.parent){		
    		this.clip.parent.removeChild(this.clip);
    	}
    	this.cell=null;
    	this.clip=null;
    	this.boundingRectangle=null;
    	instance=null;
    	p=null;
    }
    
}
