var Level=function(_stageRef,_level){
	var stageRef;
	var level;
	
	var instance=this;
	var p=this.prototype;
	
	stageRef=_stageRef;
	level=_level;
	
	var objectiveBox;
	var levelClip;
	var grassClip;
	this.levelBoxes;
	var levelData;
	var characters;
	var initLevelData;//to reset
	//var exitLabel;
	var exitFlag;
	this.onLevelWon;
	this.onLevelLost;
	var directionalLabel,buildLabel,specialLabel;
	this.clickBoxes;
	var dragBox;
	var countdown,countDownText;
	this.levelTime;
	this.escapedCharacters;
	
	this.mode="WAITING";
	
	var flyings;
	
	this.init=function(){
	
	        initLevelData=Config.levelData[Config.level-1].data.clone();
		LevelUtils.init(this);
		
		//exitLabel=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"exitLabel.png"));
		//stageRef.addChild(exitLabel);
		//exitLabel.x=(Config.CELL_WIDTH*Config.levelData[Config.level-1].exitLabel[0])>>0;
		//exitLabel.y=(Config.CELL_HEIGHT*Config.levelData[Config.level-1].exitLabel[1])>>0;
		var sp=new SpriteSheet(getSpriteData(Assets.get("flag.png"),Assets.get("flag.json")));
		exitFlag=new BitmapAnimation(sp);
		exitFlag.x=(Config.CELL_WIDTH*Config.levelData[Config.level-1].exitLabel[0])>>0;
		exitFlag.y=(Config.CELL_HEIGHT*Config.levelData[Config.level-1].exitLabel[1])>>0;
		stageRef.addChild(exitFlag);
		exitFlag.gotoAndPlay("all");
		
		levelClip=new Container();
		stageRef.addChild(levelClip);
		levelClip.y=Config.topEdge;
		levelClip.x=Config.leftEdge;
		
		grassClip=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"grass.png"));
		stageRef.addChild(grassClip);
		grassClip.y=370;
		
		//Draw level
		levelData=Config.levelData[Config.level-1];
		this.levelBoxes=[];
		for(var j=0;j<9;j++){
			for(var i=0;i<15;i++){
				if(levelData.data[j][i]!=0){
					var box=new Box(Config.boxes[levelData.data[j][i]],Config.CELL_WIDTH*i,Config.CELL_HEIGHT*j);
					levelClip.addChild(box.clip);
					box.row=i;
					box.col=j;
					this.levelBoxes.push(box);
					box.index=this.levelBoxes.length-1;
				}
			}
		}
		characters=[];
		for(var i=0;i<levelData.characters;i++){
			var character=new Character("normal",
				Math.ceil(levelData.start[0]*Config.CELL_WIDTH),
				Math.ceil(levelData.start[1]*Config.CELL_HEIGHT+Config.CELL_HEIGHT));
			
                        levelClip.addChild(character.clip);
			character.spawnDelay=i*3000;
			characters.push(character);
		}
		var king=new Character("king",
			Math.ceil(levelData.start[0]*Config.CELL_WIDTH),
			Math.ceil(levelData.start[1]*Config.CELL_HEIGHT+Config.CELL_HEIGHT));
		levelClip.addChild(king.clip);
		king.spawnDelay=i*3000;
		characters.push(king);
		
		//Add labels and click boxes
		this.clickBoxes=[];
		
		directionalLabel=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"directionalLabel.png"));
		levelClip.addChild(directionalLabel);
		directionalLabel.x=120;
		directionalLabel.y=430;
		
		var pos=0;
		var py=450;
		var directionalClickCount=Object.size(Config.levelData[Config.level-1].directional);
		for(var boxid in Config.levelData[Config.level-1].directional){
			var boxName=Config.boxes[boxid];
			var boxCount=Config.levelData[Config.level-1].directional[boxid];
			var px=Config.clickBoxPos.directional[directionalClickCount-1][pos];
			pos++;
			var cbox=new ClickBox(boxName,px,py,boxCount);
			cbox.clip.mouseEnabled=false;
			cbox.addListener(this.clickBoxDown);
			levelClip.addChild(cbox.clip);
			this.clickBoxes.push(cbox);
		}
		buildLabel=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"buildLabel.png"));
		levelClip.addChild(buildLabel);
		buildLabel.x=320;
		buildLabel.y=430;
		
		pos=0;
		var buildClickCount=Object.size(Config.levelData[Config.level-1].build);	
		for(var boxid in Config.levelData[Config.level-1].build){
			var boxName=Config.boxes[boxid];
			var boxCount=Config.levelData[Config.level-1].build[boxid];
			var px=Config.clickBoxPos.build[buildClickCount-1][pos];
			pos++;
			var cbox=new ClickBox(boxName,px,py,boxCount);
			cbox.clip.mouseEnabled=false;
			cbox.addListener(this.clickBoxDown);
			levelClip.addChild(cbox.clip);
			this.clickBoxes.push(cbox);
		}
		specialLabel=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"specialLabel.png"));
		levelClip.addChild(specialLabel);
		specialLabel.x=530;
		specialLabel.y=430;
		
		pos=0;
		var specialClickCount=Object.size(Config.levelData[Config.level-1].special);
		for(var boxid in Config.levelData[Config.level-1].special){
			var boxName=Config.boxes[boxid];
			var boxCount=Config.levelData[Config.level-1].special[boxid];
			var px=Config.clickBoxPos.special[specialClickCount-1][pos];
			pos++;
			var cbox=new ClickBox(boxName,px,py,boxCount);
			cbox.clip.mouseEnabled=false;
			cbox.addListener(this.clickBoxDown);
			levelClip.addChild(cbox.clip);
			this.clickBoxes.push(cbox);
		}
		countDownText=new Text("4",Game.getFontString(true,60),"#2D1600");
		stageRef.addChild(countDownText);
		countDownText.textAlign="center";
		countDownText.textBaseline="middle";
		countDownText.x=Config.middleX;
		countDownText.y=Config.middleY/3;
		countDownText.alpha=0;
		
		countdown=4000;
		this.escapedCharacters=0;
		this.levelTime=Config.levelData[Config.level-1].time;
		
		flyings=[];
		
		
		
		objectiveBox=new Container();
		var blocker=new Shape();
		blocker.graphics.beginFill(Graphics.getRGB(0,0,0,0.7));
		blocker.graphics.drawRect(0,0,800,600);
		var bg=new Bitmap(Assets.get("objectiveBox.png"));
		objectiveBox.addChild(blocker);
		objectiveBox.addChild(bg);
		stageRef.addChild(objectiveBox);
		bg.x=Config.canvasWidth/2-157;
		bg.y=Config.canvasHeight/2-166;
		
		
		var ltext=new Text(Config.level,Game.getFontString(true,18),"#2D1600");
		objectiveBox.addChild(ltext);
		ltext.x=Config.canvasWidth/2+30;
		ltext.y=153;
		
		var stext=new Text(Config.levelData[Config.level-1].characters,Game.getFontString(true,18),"#2D1600");
		objectiveBox.addChild(stext);
		stext.x=Config.canvasWidth/2+30;
		stext.y=179;
		
		var ttext=new Text(Config.levelData[Config.level-1].time,Game.getFontString(true,18),"#2D1600");
		objectiveBox.addChild(ttext);
		ttext.x=Config.canvasWidth/2+30;
		ttext.y=205;
		var pBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"playBtn.png"));
		objectiveBox.addChild(pBtn);
		pBtn.x=Config.canvasWidth/2-61;
		pBtn.y=420;
		pBtn.scaleX=pBtn.scaleY=0.7;
		pBtn.onMouseOver=buttonOver;
		pBtn.onMouseOut=buttonOut;
		pBtn.onPress=function(){
			instance.mode="EDIT";
			stageRef.removeChild(objectiveBox);
			for(var i=0;i<instance.clickBoxes.length;i++){
				var q=instance.clickBoxes[i];
				if(q instanceof ClickBox){
					q.clip.mouseEnabled=true;
				}
			}
			if(Tutorial.isAvailable()){
				Tutorial.init(stageRef);
			}
		}
		
		var avBoxes=[];
		for (var b in Config.levelData[Config.level-1].directional){
			avBoxes.push(Config.helpBoxes[b]);
		}
		for (var b in Config.levelData[Config.level-1].build){
			avBoxes.push(Config.helpBoxes[b]);
		}
		for (var b in Config.levelData[Config.level-1].special){
			avBoxes.push(Config.helpBoxes[b]);
		}
		var abix=Config.canvasWidth/2-120;
		var abiy=250;
		var abcount=0;
		var avBoxClips=[];
		for(var i=0;i<avBoxes.length;i++){
			var bn=avBoxes[i];
			var ab=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),bn+".png"));
			objectiveBox.addChild(ab);
			ab.x=abix+(abcount%2)*130;
			if(avBoxes.length==1){
				ab.x=abix+58;
			}
			ab.y=abiy+55*Math.floor(abcount/2);
			abcount++;
		}
	}
	
	this.clickBoxDown=function(target,e){
		
		if(instance.mode=="WAITING"){
			return;
		}
		if(target.enabled==false){
			return;
		}
		dragBox=target.dragBox;
		levelClip.addChild(dragBox);
		dragBox.x=target.clip.x-(target.clip.x%Config.CELL_WIDTH)+Config.CELL_WIDTH;
		dragBox.y=target.clip.y-(target.clip.y%Config.CELL_HEIGHT);
		
		stageRef.onMouseMove=function(ev){
			tox=ev.stageX*Config.canvasWidth/stageRef.canvas.width;
			toy=ev.stageY*Config.canvasHeight/stageRef.canvas.height;
			dragBox.x=tox-(tox%Config.CELL_WIDTH)+Config.CELL_WIDTH;
			dragBox.y=toy-(toy%Config.CELL_HEIGHT);
		}
		stageRef.onMouseUp=function(ev){
			stageRef.onMouseMove=null;
			stageRef.onMouseUp=null;
			
			//Create box if possible
			var cell={
				i:(dragBox.x/Config.CELL_WIDTH)>>0,
				j:(dragBox.y/Config.CELL_HEIGHT)>>0
			}
			if(cell.j<=7 && LevelUtils.getCellContent(cell)=="empty"){
				var b=new Box(Config.boxes[Config.boxProperties[target.type].dragBox],dragBox.x,dragBox.y,1);
				levelClip.addChild(b.clip);
				b.index=instance.levelBoxes.length;
				instance.levelBoxes.push(b);
				Config.levelData[Config.level-1].data[cell.j][cell.i]=target.dragBoxId;
				b.row=cell.i;
				b.col=cell.j;
				target.reduceCount();
				if(instance.mode=="EDIT"){
					if(!Game.isIOS()){
						Game.stopSound("main_music");
						Game.playMusic("game_music",-1);
					}
					instance.mode="COUNTDOWN";
					countDownText.alpha=0.3;
					if(Tutorial.isAvailable()){
						Tutorial.dispose();
					}
				}
			}else{
				
			}
			levelClip.removeChild(dragBox);
			dragBox=null;
		}
	}
	this.update=function(){
		if(this.mode=="COUNTDOWN"){
			countdown-=(1000/60);
			countDownText.text=(countdown/1000)>>0;
			if(countdown<=0){
				stageRef.removeChild(countDownText);
				countDownText=null;
				instance.mode="RUN";
				this.levelTime=Config.levelData[Config.level-1].time;
			}
		}
		if(this.mode=="RUN"){
			//Spawn birds/feathers if not a device
			
			if(!Game.isIOS() && !Game.isAndroid()){
				var f;
				if(Math.random()<0.005 && flyings.length<3){
					if(Math.random()<0.2){
						//bird
						f=new FlyingObject("bird",(Math.random()<0.5)?1:-1);
					}else{
						//feather
						f=new FlyingObject("feather",(Math.random()<0.5)?1:-1);
					}
					f.init();
					flyings.push(f);
					stageRef.addChild(f.clip);
				}
			}
			for(var i=flyings.length-1;i>=0;i--){
				flyings[i].update();
				if(flyings[i].disposable){
					stageRef.removeChild(flyings[i].clip);
					flyings[i].dispose();
					flyings.splice(i,1);
				}
			}
			
			this.levelTime-=(1/30)*Config.gameSpeed*0.95;
			for(var i=characters.length-1;i>=0;i--){
				characters[i].update();
				if(characters[i].reachedExit){
					this.escapedCharacters+=1;
					if(characters[i].type=="king"){
						this.onLevelWon();
						return;
					}
				}
				if(characters[i].disposable){
					levelClip.removeChild(characters[i].clip);
					characters[i].dispose();
					characters.splice(i,1);
				}
			}
			if(this.levelTime<=0 || characters.length<=0){
				this.onLevelLost();
			}
		}
	}
	this.characterAction=function(currentBox,action,direction){
		var effect,box;
		switch(action){
			case "ladderActionBox":
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x+Config.CELL_WIDTH;
				effect=new EffectBox("ladderEffect",direction,ex,currentBox.clip.y,function(){
					//Add ladder boxes
					var posx,posy;
					posx=effect.clip.x;
					posy=effect.clip.y;
					
					box=new Box("ladderBoxBottom",posx,posy,direction);
					var b2=new Box("ladderBoxTop",box.clip.x,box.clip.y-Config.CELL_HEIGHT,direction);
					//Set cells
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=4;
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=5;
					
					box.row=currentBox.row;
					box.col=currentBox.col;
					b2.row=currentBox.row;
					b2.col=currentBox.col-1;
					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					instance.levelBoxes.push(b2);
					b2.index=instance.levelBoxes.length-1;
					
					//Remove effect
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clips
					levelClip.addChild(box.clip);
					levelClip.addChild(b2.clip);
				});
			break;
			case "stepActionBox":
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x+Config.CELL_WIDTH;
				effect=new EffectBox("stepEffect",direction,ex,currentBox.clip.y,function(){
					box=new Box("stepBox",effect.clip.x,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=6;
					
					box.row=currentBox.row;
					box.col=currentBox.col;

					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clips
					levelClip.addChild(box.clip);
				});
			break;
			case "ropeActionBox":
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x+Config.CELL_WIDTH;
				effect=new EffectBox("ropeEffect",direction,ex,currentBox.clip.y,function(){
					box=new Box("ropeBox",effect.clip.x,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=7;
					
					box.row=currentBox.row;
					box.col=currentBox.col;
					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clips
					levelClip.addChild(box.clip);
				});
			break;
			case "halfBridgeActionBox":
				var ex=(direction==1)?currentBox.clip.x+Config.CELL_WIDTH:currentBox.clip.x;
				var ey=currentBox.clip.y+Config.CELL_HEIGHT;
				effect=new EffectBox("halfBridgeEffect",direction,ex,ey,function(){
					box=new Box("halfBridgeBox",effect.clip.x,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=0;
					Config.levelData[Config.level-1].data[currentBox.col+1][currentBox.row+direction]=8;
					
					box.row=currentBox.row+direction;
					box.col=currentBox.col+1;
					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clips
					levelClip.addChild(box.clip);
				});
			break;
			case "bridgeActionBox":
				var ex=(direction==1)?currentBox.clip.x+Config.CELL_WIDTH:currentBox.clip.x;
				var ey=currentBox.clip.y+Config.CELL_HEIGHT;
				effect=new EffectBox("bridgeEffect",direction,ex,ey,function(){
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=0;
					
					box=new Box("bridgeBoxLeft",effect.clip.x,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col+1][currentBox.row+direction]=9;
					
					var b2=new Box("bridgeBoxRight",effect.clip.x+direction*Config.CELL_WIDTH,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col+1][currentBox.row+direction*2]=10;
					
					box.row=currentBox.row+direction;
					box.col=currentBox.col+1;
					b2.row=currentBox.row+direction*2;
					b2.col=currentBox.col+1;
					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					instance.levelBoxes.push(b2);
					b2.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					
					levelClip.addChild(box.clip);
					levelClip.addChild(b2.clip);
				})
			break;
			case "axeActionBox":
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x+Config.CELL_WIDTH;
				effect=new EffectBox("axeEffect",direction,ex,currentBox.clip.y,function(){
					box=new Box("axeBox",ex,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=11;
					
					box.row=currentBox.row;
					box.col=currentBox.col;
					
					//BUGFIX: Re-calculate cell from row and col values:-
					//Row value is wrong when direction=-1 for this one.
					//This is called "the axe effect!!"
					box.cell={i:currentBox.row,j:currentBox.col};

					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clips
					levelClip.addChild(box.clip);
				});
			break;
			case "axeBox":
				var ex=(direction==1)?currentBox.clip.x+Config.CELL_WIDTH:currentBox.clip.x-Config.CELL_WIDTH;
				var spike=LevelUtils.getObject(LevelUtils.getNearCell(currentBox.cell,3,direction));
				this.removeBox(spike);
				effect=new EffectBox("spikeEffect",direction,ex,currentBox.clip.y,function(){
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=0;
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row+direction]=0;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
				});
			break;
			case "jumpActionBox":
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x+Config.CELL_WIDTH;
				effect=new EffectBox("springEffect",direction,ex,currentBox.clip.y,function(){
					box=new Box("jumpBox",effect.clip.x,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=12;
					
					box.row=currentBox.row;
					box.col=currentBox.col;
					
					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clips
					levelClip.addChild(box.clip);
				});
			break;
			case "bombActionBox":
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x+Config.CELL_WIDTH;
				effect=new EffectBox("bombEffect",direction,ex,currentBox.clip.y,function(){
					box=new Box("bombBox",effect.clip.x,effect.clip.y,direction);
					Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=13;
					
					box.row=currentBox.row;
					box.col=currentBox.col;
					
					box.cell={i:currentBox.row,j:currentBox.col};
					
					instance.levelBoxes.push(box);
					box.index=instance.levelBoxes.length-1;
					
					levelClip.removeChild(effect.clip);
					effect.dispose();
					//Add clip
					levelClip.addChild(box.clip);
				});
			break;
			case "bombBox":
				//Find nearby explodable cells
				var cells=[];
				selfCell=currentBox.cell;
				topBox=LevelUtils.getObject(LevelUtils.getNearCell(selfCell,1,direction));
				rightBox=LevelUtils.getObject(LevelUtils.getNearCell(selfCell,3,direction));
				bottomBox=LevelUtils.getObject(LevelUtils.getNearCell(selfCell,5,direction));
				leftBox=LevelUtils.getObject(LevelUtils.getNearCell(selfCell,7,direction));
				cells.push(selfCell);
				Config.levelData[Config.level-1].data[currentBox.col][currentBox.row]=0;
				if(topBox!="empty" && topBox.isBreakable){
					var e1=new EffectBox("explodeEffect",1,topBox.clip.x,topBox.clip.y,function(){
						levelClip.removeChild(e1.clip);
						e1.dispose();
					});
					levelClip.addChild(e1.clip);
					cells.push(topBox.cell);
					Config.levelData[Config.level-1].data[topBox.col][topBox.row]=0;
					this.removeBox(topBox);
				}
				if(rightBox!="empty" && rightBox.isBreakable){
					var e2=new EffectBox("explodeEffect",1,rightBox.clip.x,rightBox.clip.y,function(){
						levelClip.removeChild(e2.clip);
						e2.dispose();
					});
					levelClip.addChild(e2.clip);
					cells.push(rightBox.cell);
					Config.levelData[Config.level-1].data[rightBox.col][rightBox.row]=0;
					this.removeBox(rightBox);
				}
				if(bottomBox!="empty" && bottomBox.isBreakable){
					var e3=new EffectBox("explodeEffect",1,bottomBox.clip.x,bottomBox.clip.y,function(){
						levelClip.removeChild(e3.clip);
						e3.dispose();
					});
					levelClip.addChild(e3.clip);
					cells.push(bottomBox.cell);
					Config.levelData[Config.level-1].data[bottomBox.col][bottomBox.row]=0;
					this.removeBox(bottomBox);
				}
				if(leftBox!="empty" && leftBox.isBreakable){
					var e4=new EffectBox("explodeEffect",1,leftBox.clip.x,leftBox.clip.y,function(){
						levelClip.removeChild(e4.clip);
						e4.dispose();
					});
					levelClip.addChild(e4.clip);
					cells.push(leftBox.cell);
					Config.levelData[Config.level-1].data[leftBox.col][leftBox.row]=0;
					this.removeBox(leftBox);
				}
				var ex=(direction==1)?currentBox.clip.x:currentBox.clip.x-Config.CELL_WIDTH;
				effect=new EffectBox("explodeEffect",1,ex,currentBox.clip.y,function(){
					levelClip.removeChild(effect.clip);
					effect.dispose();
				});
			break;
		}
		levelClip.addChild(effect.clip);
		this.removeBox(currentBox);
	}
	
	this.removeBox=function(box){
		if(!(box instanceof Box)){
			box=LevelUtils.getObject(box);
		}
		levelClip.removeChild(box.clip);
		this.levelBoxes.splice(box.index,1);
		box.dispose();
		//Refresh levelBoxes
		for(var i=0;i<this.levelBoxes.length;i++){
			this.levelBoxes[i].index=i;
		}
	}
	
	
	this.exit=function(){
		//Reset back levelData
		Config.levelData[Config.level-1].data=initLevelData;
		Tutorial.dispose();
		this.onLevelWon=null;
		this.onLevelLost=null;
		LevelUtils.levelInstance=null;
		for(var i=0;i<flyings.length;i++){
			stageRef.removeChild(flyings[i].clip);
			flyings[i].dispose();
		}
		flyings=null;
		for(var i=0;i<this.clickBoxes.length;i++){
			this.clickBoxes[i].dispose();
		}
		for(var i=0;i<characters.length;i++){
			characters[i].dispose();
		}
		for(var i=0;i<this.levelBoxes.length;i++){
			this.levelBoxes[i].dispose();
		}
		levelClip.removeAllChildren();
		characters=null;
		this.levelBoxes=null;
		this.clickBoxes=null;
		levelData=null;
		directionalLabel=null;
		buildLabel=null;
		specialLabel=null;
		if(countDownText){
			stageRef.removeChild(countDownText);
		}
		if(objectiveBox){
			stageRef.removeChild(objectiveBox);
		}
		countDownText=null;
		//stageRef.removeChild(exitLabel);
		stageRef.removeChild(exitFlag);
		stageRef.removeChild(levelClip);
		stageRef.removeChild(grassClip);
		levelClip=null;
		//exitLabel=null;
		exitFlag=null;
		stageRef=null;
		instance=null;
		p=null;
	}
	
	function buttonOver(){
		this.shadow=new Shadow("#000",0,0,2);
		stageRef.canvas.style.cursor="pointer";
	}
	function buttonOut(e){
		this.shadow=null;
		stageRef.canvas.style.cursor="default";
	}
}
