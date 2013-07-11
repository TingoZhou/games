var Character=function(_type,x,y){
	this.type = _type||"normal";
	
	var instance=this;
	var p=this.prototype;
	var localBounds;
	
	var WALK="walk";
	var JUMP="jump";
	var IDLE="idle";
	var WAIT="wait";
	var DIE="die";
	var FALL="fall"
	var ROPE="rope";
	var LADDER_UP="ladderUp";
	var LADDER_DOWN="ladderDown";
	var BIG_JUMP="bigJump";
	
	this.state=IDLE;
	this.direction=1;
	this.isAlive=true;
	this.disposable=false;
	this.spawnDelay=10;
	this.reachedExit=false;

	
	
	var currentCell,topCell,topFrontCell,frontCell,bottomFrontCell,bottomCell,bottomBackCell,backCell,topBackCell;
	var currentBox,frontBox,frontTopBox,frontBottomBox,backBottomBox;
	
	var fallingStartedY;
	var startedCell;
	var nextCell;
	var busy=false;
	var jumpInitPos=0;
	var jumpHeight=0;
	var jumpAscend,jumpReady,jumpAnticipation,jumpAnticipationAmt,bigJumpAscend,bigJumpAnticipation;
	var jumpDecay=1;
	var jumpGravity=0;
	var falling=false;
	var waitTimer=0;
	var waitDelay=500;
	var actionCheckBusy=false;
	var prevBox;
	var skipDirectionChange=false;
	var dieAfterRope=false;
	var enteredGameScene=false;//Check if this character has entered into the scene.
	var sp;
	if(this.type=="normal"){
		//sp=new SpriteSheet(getSpriteData(Assets.get("character.png"),Assets.get("character.json")));
	    sp = Game.normalSp;
        }else{
            sp = Game.kingSp;
		//sp=new SpriteSheet(getSpriteData(Assets.get("king.png"),Assets.get("king.json")));
	}
	//SpriteSheetUtils.addFlippedFrames(sp, true, false, false);
	this.clip=new BitmapAnimation(sp);
	//Change animation offset, every character animates async
	this.clip.offset=parseInt(Math.random()*5);
	this.clip.gotoAndPlay(this.state);
	this.clip.x=x;
	this.clip.y=y;
	var frameWidth = this.clip.spriteSheet.getFrame(0).rect.width;
	var frameHeight = this.clip.spriteSheet.getFrame(0).rect.height;
	w = parseInt(frameWidth*0.8);
    l = parseInt((frameWidth - w));
    h = parseInt(frameWidth);
    t = parseInt(frameHeight - h);
    localBounds = new XNARectangle(l, t, w, h);
   	this.getRect=function(){
    	return new XNARectangle(this.clip.x-this.clip.spriteSheet.getFrame(0).regX*0.45,
    										this.clip.y-this.clip.spriteSheet.getFrame(0).regY,
    										w*.6,h);
    }
    this.boundingRectangle=this.getRect();
    
   	
	this.update=function(){
		if(this.spawnDelay>0){
			this.spawnDelay-=17*Config.gameSpeed;
			return;
		}
		//....
		if(!this.isAlive){
			if(this.clip && (this.clip.currentFrame==51 || this.clip.currentFrame==123)){
				this.disposable=true;
			}
			return;
		}
		if(this.reachedExit){
			return;
		}
		if(enteredGameScene && this.clip.x<50){
			this.disposable=true;
			return;
		}
		if(!enteredGameScene && this.clip.x>50){
			enteredGameScene=true;
		}
		var prevY=this.clip.y;
		
		topCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),1);
		currentCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),0);
		frontCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),3,this.direction);
		frontTopCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),2,this.direction);
		bottomCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),5,this.direction);
		bottomFrontCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),4,this.direction);
		bottomBackCell=LevelUtils.getNearCell(LevelUtils.getCell(this.clip.x,this.clip.y-Config.CELL_HEIGHT),6,this.direction);
		
		currentBox=LevelUtils.getObject(currentCell);
		frontBox=LevelUtils.getObject(frontCell);
		bottomBox=LevelUtils.getObject(bottomCell);
		frontTopBox=LevelUtils.getObject(frontTopCell);
		frontBottomBox=LevelUtils.getObject(bottomFrontCell);
		backBottomBox=LevelUtils.getObject(bottomBackCell);
		
		if(LevelUtils.isExitCell(currentCell)){
			this.disposable=true;
			this.reachedExit=true;
		}
		
		if(!busy){
			this.decideAction();
		}
		this.doAction();
	
		//If this is the last frame of ropeLanding animation,
		//change state to IDLE
		//console.log(this.clip.currentFrame);
		if(this.clip.currentFrame==71 || this.clip.currentFrame==143){
			this.changeState(IDLE);
		}
	}
	this.decideAction=function(){
		//If no block under, then fall
		if(!this.standOnBlock()){
			this.changeState(FALL);
		}else{
			if(bottomBox!="empty" && bottomBox.isSpike){
				this.changeState(DIE);
				return;
			}
			if(!actionCheckBusy && currentBox.isActionBox){//If current box is an action box
				actionCheckBusy=true;
				prevBox=currentBox;
				if(LevelUtils.actionOK(currentBox, this.direction)){//If action can be done now..
					LevelUtils.callAction(currentCell,currentBox.type,this.direction);
					this.changeState(DIE);
					return;
				}
			}
			
			//CHECK FOR LADDER
			if(currentBox.type=="ladderBoxBottom"){
				this.changeState(LADDER_UP);
				return;
			}
			if(bottomBox.type=="ladderBoxTop"){
				this.changeState(LADDER_DOWN);
				return;
			}//LADDER
			
			//CHECK IF CAN JUMP
			if(!frontBox.isSpike && LevelUtils.isWalkable(frontTopBox) && !LevelUtils.isWalkable(frontBox) && LevelUtils.isWalkable(topCell)){
				this.changeState(JUMP);
				return;
			}//JUMP

			//CHECK FOR ROPE
			if(currentBox.type=="ropeBox"){
				this.changeState(ROPE);
				return;
			}
			
			
			
			if(LevelUtils.isWalkable(frontBox)){
				nextCell=frontCell;
				this.changeState(WALK);
			}else if(!skipDirectionChange){
				this.direction*=-1;
				actionCheckBusy=false;
			}
			skipDirectionChange=false;
		}
	}
	
	
	this.doAction=function(){
		var dString=(this.direction==1)?"":"_h";
		switch(this.state){
			case FALL:
				this.clip.gotoAndStop("idle"+dString);
				busy=true;
				this.fall();
				break;
			case WALK:
				if(!busy){
					busy=true;
				}
				this.move();
				break;
			case IDLE:
				if(this.clip.currentAnimation!="idle"+dString){
					this.clip.gotoAndStop("idle"+dString);
				}
				busy=false;
				this.idle();
				break;
			case WAIT:
				if(this.clip.currentAnimation!="idle"+dString){
					this.clip.gotoAndStop("idle"+dString);
					busy=true;
				}
				this.wait();
				break;
			case DIE:
				if(this.prevState!=this.state){
					this.clip.gotoAndPlay("die"+dString);
				}
				this.die();
				break;
			case JUMP:
				if(!busy){
					this.clip.gotoAndPlay("walk"+dString);
					jumpReady=true;
					nextCell=frontCell;
					busy=true;
					jumpInitPos=this.clip.y;
					jumpHeight=jumpInitPos - 1.7*Config.CELL_HEIGHT;
					jumpDecay=15;
				}
				this.jump();
				break;
			case LADDER_UP:
				if(!busy){
					busy=true;
					startedCell=currentCell;
					nextCell=LevelUtils.getNearCell(frontTopCell,1,this.direction);
				}
				this.ladderUp();
				break;
			case LADDER_DOWN:
				if(!busy){
					this.clip.gotoAndPlay("walk"+dString);
					busy=true;
					startedCell=bottomCell;
					nextCell=LevelUtils.getNearCell(bottomCell,4,this.direction);
				}
				this.ladderDown();
				break;
			case ROPE:
				if(!busy){
					busy=true;
					startedCell=currentCell;
					nextCell={i:startedCell.i+this.direction,j:startedCell.j+3};
					dieAfterRope=false;
					if(LevelUtils.isWalkable(LevelUtils.getNearCell(nextCell,5,this.direction))){
						dieAfterRope=true;
					}
				}
				this.rope();
				break;
			case BIG_JUMP:
				if(!busy){
					busy=true;
					bigJumpAnticipation=true;
					bottomBox.animate();
					startedCell=currentCell;
					nextCell={i:startedCell.i+this.direction,j:startedCell.j-2};
					jumpInitPos=this.clip.y;
					jumpHeight=jumpInitPos - 3.5*Config.CELL_HEIGHT;
					jumpDecay=10;
				}
				this.bigJump();
				break;
		}
	}
	
	this.rope=function(){
		var nextCellRect=LevelUtils.getCellRect(nextCell);
		var currentCellRect=LevelUtils.getCellRect(startedCell);
		if(this.direction==1){
			if(this.clip.y>=nextCellRect.y+Config.CELL_HEIGHT){
				this.clip.y=nextCellRect.y+Config.CELL_HEIGHT;
				if(this.clip.currentAnimation!="ropeLand"){
					this.clip.gotoAndPlay("ropeLand");
				}
			}
			else if(this.clip.x<currentCellRect.x+40){
				this.clip.x+=Config.gameSpeed;
				this.clip.y=currentCellRect.y+45;
				if(this.clip.currentAnimation!="walk"){
					this.clip.gotoAndPlay("walk");
				}
			}else if(this.clip.x<nextCellRect.x+10){
				this.clip.x+=Config.gameSpeed;
				this.clip.y-=Config.gameSpeed;
				if(this.clip.currentAnimation!="ropeJump"){
					this.clip.gotoAndPlay("ropeJump");
				}
			}else{
				this.clip.y+=3*Config.gameSpeed;
				if(this.clip.currentAnimation!="ropeSlide"){
					this.clip.gotoAndPlay("ropeSlide");
				}
			}
			
		}else{
			if(this.clip.y>=nextCellRect.y+Config.CELL_HEIGHT){
				this.clip.y=nextCellRect.y+Config.CELL_HEIGHT;
				if(this.clip.currentAnimation!="ropeLand_h"){
					this.clip.gotoAndPlay("ropeLand_h");
				}
			}
			else if(this.clip.x>currentCellRect.x+10){
				this.clip.x-=Config.gameSpeed;
				this.clip.y=currentCellRect.y+45;
				if(this.clip.currentAnimation!="walk_h"){
					this.clip.gotoAndPlay("walk_h");
				}
			}
			else if(this.clip.x>nextCellRect.x+40){
				this.clip.x-=Config.gameSpeed;
				this.clip.y-=Config.gameSpeed;
				if(this.clip.currentAnimation!="ropeJump_h"){
					this.clip.gotoAndPlay("ropeJump_h");
				}
			}
			else{
				this.clip.y+=3*Config.gameSpeed;
				if(this.clip.currentAnimation!="ropeSlide_h"){
					this.clip.gotoAndPlay("ropeSlide_h");
				}
			}
		}
	}
	this.ladderDown=function(){
		var nextCellRect=LevelUtils.getCellRect(nextCell);
		if(this.direction==-1){
			this.clip.x-=Config.gameSpeed;
			this.clip.y+=2*Config.gameSpeed;
			if(this.clip.y>nextCellRect.y+Config.CELL_HEIGHT){
				this.clip.y=nextCellRect.y+Config.CELL_HEIGHT;
				if(this.clip.x<nextCellRect.x){
					this.clip.x=nextCellRect.x;
					this.changeState(WALK);
				}
			}
		}else{
			this.clip.x+=Config.gameSpeed;
			this.clip.y+=2*Config.gameSpeed;
			if(this.clip.y>nextCellRect.y+Config.CELL_HEIGHT){
				this.clip.y=nextCellRect.y+Config.CELL_HEIGHT;
				if(this.clip.x>nextCellRect.x){
					this.clip.x=nextCellRect.x;
					this.changeState(WALK);
				}
			}
		}
	}
	this.ladderUp=function(){
		var nextCellRect=LevelUtils.getCellRect(nextCell);
		if(this.direction==1){
			this.clip.x+=0.8*Config.gameSpeed;
			if(this.clip.x>LevelUtils.getCellRect(startedCell).x){
				if(this.clip.currentAnimation!="ladderUp"){
					this.clip.gotoAndPlay("ladderUp");
				}
				this.clip.y-=2*Config.gameSpeed;
			}else{
				if(this.clip.currentAnimation!="walk"){
					this.clip.gotoAndPlay("walk");
				}
			}
			if(this.clip.y<nextCellRect.y+Config.CELL_HEIGHT){
				this.clip.y=nextCellRect.y+Config.CELL_HEIGHT;
				if(this.clip.x>nextCellRect.x){
					this.clip.x=nextCellRect.x;
					this.changeState(WALK);
				}
			}
		}else{
			this.clip.x-=Config.gameSpeed;
			if(this.clip.x<LevelUtils.getCellRect(startedCell).x+Config.CELL_WIDTH){
				if(this.clip.currentAnimation!="ladderUp_h"){
					this.clip.gotoAndPlay("ladderUp_h");
				}
				this.clip.y-=2*Config.gameSpeed;
			}else{
				if(this.clip.currentAnimation!="walk_h"){
					this.clip.gotoAndPlay("walk_h");
				}
			}
			if(this.clip.y<nextCellRect.y+Config.CELL_HEIGHT){
				this.clip.y=nextCellRect.y+Config.CELL_HEIGHT;
				if(this.clip.x<nextCellRect.x+Config.CELL_WIDTH){
					this.clip.x=nextCellRect.x+Config.CELL_WIDTH;
					this.changeState(WALK);
				}
			}
		}
	}
	this.standOnBlock=function(){
		if(this.clip.y>Config.groundLevel){
			this.clip.y=Config.groundLevel;
			return true;
		}
		if(bottomBox!="empty" && bottomBox.isBlock==true){
			this.clip.y=bottomBox.clip.y;
			return true;
		}
		return false;
	}
	this.idle=function(){
		if(prevBox!=currentBox){
			actionCheckBusy=false;
		}
	}
	this.wait=function(){
		waitTimer+=17*Config.gameSpeed;
		if(waitTimer>waitDelay){
			waitTimer=0;
			busy=false;
			this.changeState(IDLE);
		}
	}
	this.move=function(){
		var dString=(this.direction==1)?"":"_h";
		this.clip.x+=this.direction*Config.gameSpeed;
		if(!LevelUtils.isWalkable(topCell)){
			if(this.clip.currentAnimation!="crouch"+dString){
				this.clip.gotoAndPlay("crouch"+dString);
			}
		}else{
			if(this.clip.currentAnimation!="walk"+dString){
				this.clip.gotoAndPlay("walk"+dString);
			}
		}
		if(!this.standOnBlock()){
			this.changeState(IDLE);
		}
		if(LevelUtils.isSameCell(nextCell,currentCell)){
			this.changeState(IDLE);
		}
	}
	this.fall=function(){
		this.clip.x+=this.direction*Config.gameSpeed;
		this.clip.y+=6*Config.gameSpeed;
		if(!falling){
			falling=true;
			fallingStartedY=this.clip.y;
		}
		if(this.standOnBlock()){
			falling=false;
			if((this.clip.y-fallingStartedY)>(2.3*Config.CELL_HEIGHT)){
				this.changeState(DIE);
			}else{
				if(dieAfterRope){//Die at once
					this.changeState(DIE);
					return;
				}
				//Falling completed, check if bottomBox is the jumpBox
				if(bottomBox.type=="jumpBox"){
					busy=false;
					skipDirectionChange=true;//Skip direction changing for once
					this.changeState(BIG_JUMP);
				}else{
					this.changeState(IDLE);
				}
			}
		}
	}
	this.jump=function(){
		var dString=(this.direction==1)?"":"_h";
		var nextCellRect=LevelUtils.getCellRect(nextCell);
		if(jumpReady){
			this.clip.x+=this.direction*Config.gameSpeed;
			if(this.direction==1){
				if(this.clip.x>LevelUtils.getCellRect(currentCell).x+20){
					jumpReady=false;
					jumpAnticipation=true;
					jumpAnticipationAmt=10;
				}
			}else{
				if(this.clip.x<LevelUtils.getCellRect(currentCell).x+30){
					jumpReady=false;
					jumpAnticipation=true;
					jumpAnticipationAmt=10;
				}
			}
			return;
		}else if(jumpAnticipation==true){
			if(this.clip.currentAnimation!="jump"+dString){
				this.clip.gotoAndPlay("jump"+dString);
			}
			jumpAnticipationAmt-=Config.gameSpeed;
			if(jumpAnticipationAmt<=0){
				jumpAnticipation=false;
				jumpAscend=true;
			}
		}else if(jumpAscend){
			this.clip.x+=this.direction*1.8*Config.gameSpeed;
			this.clip.y-=jumpDecay*Config.gameSpeed;
			jumpDecay*=0.85/Config.gameSpeed;
			if(this.clip.y<jumpHeight){
				jumpAscend=false;
			}
			//If colliding with the nextBox, then align it not to overlap
			if(this.clip.y>LevelUtils.getCellRect(currentCell).y){
				if(this.direction==1){
					//this.clip.x=Math.min(this.clip.x,nextCellRect.x);
				}else{
					//this.clip.x=Math.max(this.clip.x,nextCellRect.x+Config.CELL_WIDTH);
				}
			}
		}else{
			this.clip.x+=this.direction*2*Config.gameSpeed;
			this.clip.y+=jumpGravity*Config.gameSpeed;
			jumpGravity+=0.8*Config.gameSpeed;
			jumpGravity=Math.min(jumpGravity,7);
			if(this.direction==1){
				if(this.clip.y>nextCellRect.y){
					this.clip.y=nextCellRect.y;
					var dropBox=LevelUtils.getObject(nextCell);
					if(dropBox.type=="jumpBox"){//Jumping completed, check if bottomBox is the jumpBox
						busy=false;
						skipDirectionChange=true;//Skip direction changing for once
						this.changeState(BIG_JUMP);
						return;
					}
					if(this.clip.x>nextCellRect.x+20){
						this.clip.x=nextCellRect.x+20;
						this.changeState(WAIT);
					}
				}
			}else{
				if(this.clip.y>nextCellRect.y){
					this.clip.y=nextCellRect.y;
					var dropBox=LevelUtils.getObject(nextCell);
					if(dropBox.type=="jumpBox"){//Jumping completed, check if bottomBox is the jumpBox
						busy=false;
						skipDirectionChange=true;//Skip direction changing for once
						this.changeState(BIG_JUMP);
						return;
					}
					if(this.clip.x<nextCellRect.x+35){
						this.clip.x=nextCellRect.x+35;
						this.changeState(WAIT);
					}
				}
			}
		}
	}
	
	this.bigJump=function(){
		var dString=(this.direction==1)?"":"_h";
		var nextCellRect=LevelUtils.getCellRect(nextCell);
		if(bigJumpAnticipation){
			this.clip.y+=Config.gameSpeed;
			if(this.clip.y>jumpInitPos+7){
				bigJumpAnticipation=false;
				bigJumpAscend=true;
				this.clip.gotoAndPlay("bigJump"+dString);
			}
		}else if(bigJumpAscend){
			this.clip.x+=0.7*this.direction*Config.gameSpeed;
			this.clip.y-=jumpDecay*Config.gameSpeed;
			jumpDecay*=0.95;
			if(this.clip.y<jumpHeight){
				bigJumpAscend=false;
			}
			//If colliding with the nextBox, then align it not to overlap
			if(this.clip.y>LevelUtils.getCellRect(currentCell).y){
				if(this.direction==1){
					this.clip.x=Math.min(this.clip.x,nextCellRect.x);
				}else{
					this.clip.x=Math.max(this.clip.x,nextCellRect.x+Config.CELL_WIDTH);
				}
			}
		}else{
			this.clip.x+=this.direction*Config.gameSpeed;
			this.clip.y+=3*Config.gameSpeed;
			if(this.direction==1){
				if(this.clip.y>nextCellRect.y){
					this.clip.y=nextCellRect.y;
					if(this.clip.x>nextCellRect.x+20){
						this.clip.x=nextCellRect.x+20;
						//Jumping completed, check if bottomBox is the jumpBox
						if(bottomBox.type=="jumpBox"){
							busy=false;
							skipDirectionChange=true;//Skip direction changing for once
							this.changeState(BIG_JUMP);
						}else{
							this.changeState(WAIT);
						}
					}
				}
			}else{
				if(this.clip.y>nextCellRect.y){
					this.clip.y=nextCellRect.y;
					if(this.clip.x<nextCellRect.x+35){
						this.clip.x=nextCellRect.x+35;
						//Jumping completed, check if bottomBox is the jumpBox
						if(bottomBox.type=="jumpBox"){
							busy=false;
							skipDirectionChange=true;//Skip direction changing for once
							this.changeState(BIG_JUMP);
						}else{
							this.changeState(WAIT);
						}
					}
				}
			}
		}
	}
	
	
	this.die=function(){
		this.isAlive=false;
	}
	
	
	this.changeState=function(state){
		if(this.state!=state){
			this.state=state;
		}
	}
	this.changeDirection=function(_direction){
		if(this.direction!=_direction){
			this.direction=_direction;
		}
	}
	
	
	
	
	this.dispose=function(){
		instance=null;
		p=null;
		localBounds=null;
		currentBox=null;
		prevBox=null;
		frontBox=null;
		frontTopBox=null;
		currentCell=null;
		frontCell=null;
		backCell=null;
		topBackCell=null;
		topFrontCell=null;
		bottomBackCell=null;
		bottomFrontCell=null;
		bottomCell=null;
		topCell=null;
		this.velocity=null;
		sp=null;
		this.boundindRectangle=null;
		this.clip=null;
	}
}
