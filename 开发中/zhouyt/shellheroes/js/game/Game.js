
(function (Game){
	var stage,canvas,currentState;
	
	var currentLevelTime;
	var escapedCharacters;
	var iosMusicStarted=false;
	
	Game.font = "Tienne";
	
	Game.getFontString=function(bold,size){
		var bs="";
		if(bold){
			bs="bold ";
		}
		if(Game.isIOS()){
			size+=2;
		}
		return bs+" "+size+"px "+Game.font;
	}
	
	//Import all external scripts here
	Game.initialize=function(_stage,_canvas){
		stage=_stage;
		//stage.snapToPixelEnabled=true;
		stage.enableMouseOver(10);
		canvas=_canvas;
		importScripts([
			"js/game/lib/assets.js",
			"js/game/lib/input.js",
			"js/game/lib/trig.js",
			"js/game/lib/audioSprite.js",
			"js/game/lib/ToggleButton.js",
			"js/game/Level.js",
			"js/game/objects/Box.js",
			"js/game/objects/ClickBox.js",
			"js/game/objects/EffectBox.js",
			"js/game/objects/Character.js",
			"js/game/objects/FlyingObject.js",
			"js/game/LevelUtils.js",
			"js/game/lib/XNARectangle.js",
			"js/game/objects/Arrow.js",
			"js/game/Tutorial.js"
		],"preloaderState");
	}
	
	
	/**
	 * All states must have two mandatory functions - init() and exit()
	 * Also must contain update() method if startLoop() is used
	 */
	//Preloader state..
	Game["preloaderState"]=function(){
		var bg,loadingBar,clickBtn,skipBtn,skipBtnText;
		
		var waitTime = 0;
		var maxWait = 2;
		var loadCompleted = false;
		var timeCompleted = false;
		
		this.init=function(){
			//Load all preloader assets here.. After this, this.display() is called back.
			var g=new Graphics();
			g.beginFill("#000000");
			g.rect(0,0,Config.middleX*2,Config.middleY*2);
			g.endFill();
			bg=new Shape(g);
			stage.addChild(bg); 
			Assets.loadAssets(["assets/images/oigPreloader.png","assets/images/oigPreloader.json"],this.display);
			
		}
		this.display=function(){
			//Add preloader objects to stage.
			var loadingBarSprite=new SpriteSheet(getSpriteData(Assets.get("oigPreloader.png"),Assets.get("oigPreloader.json")));
			loadingBar=new BitmapAnimation(loadingBarSprite);
			stage.addChild(loadingBar);
			loadingBar.x=Config.middleX-146;
			loadingBar.y=Config.middleY+100;
			loadingBar.gotoAndStop(1);
			//Load game assets here..
			Assets.loadAssets([
				"assets/images/sheet1.png",
				"assets/images/sheet1.json",
				"assets/images/muteBtn.png",
				"assets/images/muteBtn.json",
				"assets/images/menu.jpg",
				"assets/images/help.jpg",
				"assets/images/otherbg.jpg",
				"assets/images/gameBg.jpg",
				"assets/images/static.png",
				"assets/images/static.json",
				"assets/images/levelSelectionBox.png",
				"assets/images/levelSelectionBox.json",
				"assets/images/character.json",
				"assets/images/character.png",
				"assets/images/king.json",
				"assets/images/king.png",
				"assets/images/ladderEffect.png",
				"assets/images/ladderEffect.json",
				"assets/images/stepEffect.png",
				"assets/images/stepEffect.json",
				"assets/images/ropeEffect.json",
				"assets/images/ropeEffect.png",
				"assets/images/halfBridgeEffect.json",
				"assets/images/halfBridgeEffect.png",
				"assets/images/bridgeEffect.json",
				"assets/images/bridgeEffect.png",
				"assets/images/axeEffect.json",
				"assets/images/axeEffect.png",
				"assets/images/spikeEffect.json",
				"assets/images/spikeEffect.png",
				"assets/images/springEffect.json",
				"assets/images/springEffect.png",
				"assets/images/jumpBox.json",
				"assets/images/jumpBox.png",
				"assets/images/bombEffect.json",
				"assets/images/bombEffect.png",
				"assets/images/explodeEffect.json",
				"assets/images/explodeEffect.png",
				"assets/images/smoke.json",
				"assets/images/smoke.png",
				"assets/images/levelCompleteBox.png",
				"assets/images/levelFailedBox.png",
				"assets/images/gameOverBox.png",
				"assets/images/gameWonBox.png",
				"assets/images/feather.json",
				"assets/images/feather.png",
				"assets/images/bird.json",
				"assets/images/bird.png",
				"assets/images/flag.json",
				"assets/images/flag.png",
				"assets/images/objectiveBox.png",
				],
				function(){
					//If this is IOS, load sound as audiosprite
					if(Game.isIOS()){
						Game.font = "Baskerville";
						AudioSprite.init({
							"music":{start:3,end:20}
						},"assets/sounds/music.mp3");
						showClickBtn();
					}else{//Else load sounds separately
						Assets.loadAssets([
							{urls:["assets/sounds/main_music.mp3","assets/sounds/main_music.ogg"]},
							{urls:["assets/sounds/game_music.mp3","assets/sounds/game_music.ogg"]},
							{urls:["assets/sounds/click.mp3","assets/sounds/click.ogg"]}
						],function(){
                            //document.write("1111111111111111111111111");
                            Game.changeState("menuState");
                            waitTime = 60;
                            maxWait = 0;
                            timeCompleted = true;
							/*if(!timeCompleted){
								showSkipBtn();
							}else{
								Game.changeState("menuState");
							}*/
						})
					}
				});
			//Start this.update()
			Game.startLoop();
			
		}
		hideAdBox=function(){
			
		}
		showSkipBtn=function(){
			loadingBar.visible=false;
			skipBtn=new Container();
			var sbg=new Shape();
			sbg.graphics.beginFill("#222");
			sbg.graphics.drawRect(0,0,100,30);
			sbg.graphics.endFill();
			skipBtnText=new Text("SKIP(8)","bold 12px Arial","#fff");
			skipBtnText.textBaseline="middle";
			skipBtnText.textAlign="center";
			skipBtn.addChild(sbg);
			skipBtn.addChild(skipBtnText);
			skipBtnText.x=50;
			skipBtnText.y=15;
			stage.addChild(skipBtn);
			skipBtn.x = Config.middleX-50;
			skipBtn.y = 375;
			skipBtn.onMouseOver = buttonOver;
			skipBtn.onMouseOut = buttonOut;
			skipBtn.onPress=function(){
				Game.changeState("menuState");
			}
		}
		showClickBtn=function(){
			loadingBar.visible=false;
			clickBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"clickToStartBtn.png"));
			clickBtn.x=Config.middleX - 200;
			clickBtn.y=375;
			stage.addChild(clickBtn);
			clickBtn.onClick=function(){
				Game.changeState("menuState");
			}
		}
		this.update=function(){
			if(!timeCompleted){
				waitTime+=1;
				if(waitTime%60==0){
					maxWait-=1;
					if(maxWait<=0){
						timeCompleted = true;
						Game.changeState("menuState");
					}
				}
				if(skipBtn){
					skipBtnText.text="SKIP("+maxWait+")";
				}
			}
			//Update percentage..
			loadingBar.gotoAndStop((Assets.percentageLoaded()*19/100)>>0);
			stage.update();
		}
		this.exit=function(){
			hideAdBox();
			if(skipBtn){
				stage.removeChild(skipBtn);
			}
			//Remove all things used in this state
			stage.removeChild(loadingBar);
			stage.removeChild(bg);
			if(clickBtn) stage.removeChild(clickBtn);
		}
	}
	
	Game["menuState"]=function(){
		var bg,soundBtn;
		var playBtn,moreBtn,storyBtn;
		var csharksLogo,oigLogo;
		
		this.init=function(){
			
			if(!Game.isIOS()){
				Game.stopSound("game_music");
				if(Game.isPlayingMusic("main_music")==false){
					Game.playMusic('main_music',-1);
				}
			}else{
				AudioSprite.stop();//For IOS
				AudioSprite.play("music",-1);
			}
   			
			/**Menu art initialization**/
			bg=new Bitmap(Assets.get('menu.jpg'));
			stage.addChild(bg);
			soundBtn=new ToggleButton(getSpriteData(Assets.get("muteBtn.png"),Assets.get("muteBtn.json")),(Game.isMuted())?"muted":"unmuted");
			stage.addChild(soundBtn.clip);
			soundBtn.clip.x=Config.middleX*2 - 47;
			soundBtn.clip.y=5;
			
			playBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"playBtn.png"));
			stage.addChild(playBtn);
			playBtn.x=310;
			playBtn.y=200;
			
			storyBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"storyBtn.png"));
			stage.addChild(storyBtn);
			storyBtn.x=310;
			storyBtn.y=260;
                        Game.normalSp = new SpriteSheet(getSpriteData(Assets.get("character.png"),Assets.get("character.json")));
                        Game.kingSp = sp=new SpriteSheet(getSpriteData(Assets.get("king.png"),Assets.get("king.json")));
                        SpriteSheetUtils.addFlippedFrames(Game.normalSp, true, false, false);
                        SpriteSheetUtils.addFlippedFrames(Game.kingSp, true, false, false);
			
					
			moreBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"moreBtn.png"));
			//stage.addChild(moreBtn);
			moreBtn.x=310;
			moreBtn.y=320;
			
			oigLogo=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"oiglogo.png"));
			//stage.addChild(oigLogo);
			oigLogo.x=10;
			oigLogo.y=420;
			oigLogo.onClick=function(){
				window.open("http://www.onlineindiangames.com/");	
			}
			
			csharksLogo=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"csharkslogo.png"));
			//stage.addChild(csharksLogo);
			csharksLogo.x=510;
			csharksLogo.y=450;
			csharksLogo.onClick=function(){
				window.open("http://www.csharks.com/");	
			}
			storyBtn.onClick=function(){
				Game.changeState("helpState");
			}
			
			playBtn.onClick=function(){
				Game.changeState("levelSelectionState");
			}
			soundBtn.clip.onClick=function(){
				Game.toggleSounds();
				if(soundBtn.state=="unmuted"){
					soundBtn.changeState("muted");
				}else{
					soundBtn.changeState("unmuted");
				}
			}
			moreBtn.onClick=function(){
				window.open(Config.siteUrl);
			}
		
			storyBtn.onMouseOver=oigLogo.onMouseOver=csharksLogo.onMouseOver=playBtn.onMouseOver=moreBtn.onMouseOver=soundBtn.clip.onMouseOver=buttonOver;
			storyBtn.onMouseOut=oigLogo.onMouseOut=csharksLogo.onMouseOut=playBtn.onMouseOut=moreBtn.onMouseOut=soundBtn.clip.onMouseOut=buttonOut;
			
			Game.startLoop();
		}
		this.update=function(){
			stage.update();
		}
		this.exit=function(){
			stage.removeChild(bg);
			stage.removeChild(soundBtn.clip);
			soundBtn.dispose();
			stage.removeChild(playBtn);
			stage.removeChild(moreBtn);
			stage.removeChild(storyBtn);
			stage.removeChild(csharksLogo);
			stage.removeChild(oigLogo);
		}
	}
	
		
	Game["helpState"]=function(){
		var bg, backBtn;
		
		this.init=function(){
			bg=new Bitmap(Assets.get('help.jpg'));
			stage.addChild(bg);
			backBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"backBtn.png"));
			stage.addChild(backBtn);
			backBtn.x=325;
			backBtn.y=470;
			
			backBtn.onClick=function(){
				//If currentState is gameState, then this is a switchedState, so exit; otherwise goto menu
				if(Game.currentState=="gameState"){
					Game.exitSwitchedState();
				}else{
					Game.changeState("menuState");
				}
			}
			backBtn.onMouseOver=buttonOver;
			backBtn.onMouseOut=buttonOut;
			
			if(Game.currentState!="gameState"){
				//If current state is gameState, then don't start another loop..
				Game.startLoop();
			}
		}
		this.update=function(){
			stage.update();
		}
		this.exit=function(){
			stage.removeChild(bg);
			stage.removeChild(backBtn);
		}
	}
	
	Game["levelSelectionState"]=function(){
		var bg,title,backBtn;
		var selectionBoxes=[];
		this.init=function(){
			if(!Config.developer){
				Config.playedLevels=Game.loadData().playedLevels || 0;
			}
			
			bg=new Bitmap(Assets.get("otherbg.jpg"));
			stage.addChild(bg);
			title=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"levels.png"))
			stage.addChild(title);
			title.x=250;
			title.y=60;
			
			//Create selection boxes
			for(var i=0;i<Config.levelMax;i++){
				var s=new SpriteSheet(getSpriteData(Assets.get("levelSelectionBox.png"),Assets.get("levelSelectionBox.json")));
				var b=new BitmapAnimation(s);
				stage.addChild(b);
				b.x=(i%5)*60+257;
				b.y=110+((i/5)>>0)*50;
				b.gotoAndStop(25);
				if(Config.playedLevels>=i){
					b.gotoAndStop(i);
					b.onMouseOver=buttonOver;
					b.onMouseOut=buttonOut;
					b.onClick=function(){
						Config.level=this.currentFrame+1;
						Game.changeState("gameState");
					}
				}
				selectionBoxes.push(b);
			}
			
			backBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"backBtn.png"));
			stage.addChild(backBtn);
			backBtn.x=325;
			backBtn.y=400;
			
			backBtn.onClick=function(){
				Game.changeState("menuState");
			}
			backBtn.onMouseOver=buttonOver;
			backBtn.onMouseOut=buttonOut;
			
			Game.startLoop();
		}
		this.update=function(){
			stage.update();
		}
		this.exit=function(){
			for(var i=0;i<selectionBoxes.length;i++){
				stage.removeChild(selectionBoxes[i]);
			}
			selectionBoxes=null;
			stage.removeChild(bg);
			stage.removeChild(title);
			stage.removeChild(backBtn);
		}
	}
	
	Game["levelUpState"]=function(){
		
		var bg,levelUpBox;
		var levelText,scoreText,timeText,soldiersText;
		var menuBtn,nextBtn;
		var scoreDataShown=false;
		var timer=0;
		var oldScore=Config.score;
		var currInc;
		var doInc=false;
		
		this.init=function(){
			if(Config.level>Config.playedLevels){
				Config.playedLevels=Config.level;
			}
			currInc=oldScore;
			var balanceTime=currentLevelTime>>0;
			var calcScore=balanceTime*10 +  escapedCharacters*50;
			
			
			var oldData=Game.loadData();
			var levelScores=oldData.oldscores;
			
			
			if(levelScores==null){
				levelScores={};
			}
			if(!levelScores[Config.level]){
				levelScores[Config.level]=0;
			}
			
			if(levelScores[Config.level]<calcScore){
				Config.score+=calcScore-levelScores[Config.level];
				levelScores[Config.level]=calcScore;
				Game.setData("oldscores",levelScores);
				Game.setData("score",Config.score);
				Game.setData("playedLevels",Config.playedLevels);
				Game.saveData();
			}
			
			
			
			bg=new Bitmap(Assets.get("otherbg.jpg"));
			stage.addChild(bg);
			
			levelUpBox=new Bitmap(Assets.get("levelCompleteBox.png"));
			stage.addChild(levelUpBox);
			levelUpBox.x=250;
			levelUpBox.y=50;
			
			levelText=new Text(Config.level,Game.getFontString(true,14),"#2D1600");
			stage.addChild(levelText);
			levelText.x=450;
			levelText.y=176;
			
			scoreText=new Text(oldScore,Game.getFontString(true,48),"#2D1600");
			stage.addChild(scoreText);
			scoreText.x=410;
			scoreText.y=350;
			scoreText.textAlign="center";
			
			var estext=escapedCharacters?escapedCharacters+" x 50":"0 x 50";
			soldiersText=new Text(estext,Game.getFontString(true,14),"#2D1600");
			stage.addChild(soldiersText);
			soldiersText.x=450;
			soldiersText.y=216;
			soldiersText.visible=false;
			
			
			timeText=new Text(balanceTime+" x 10",Game.getFontString(true,14),"#2D1600");
			stage.addChild(timeText);
			timeText.x=450;
			timeText.y=264;
			timeText.visible=false;
			
			levelText.textBaseline=scoreText.textBaseline="bottom";
			levelText.textAlign="left";
			
			if(oldScore==Config.score){
				scoreDataShown=true;
				soldiersText.visible=true;
				timeText.visible=true;
				scoreText.text=Config.score;
			}
			
			
			menuBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"menuTextBtn.png"));
			menuBtn.x=225;
			menuBtn.y=400;
			stage.addChild(menuBtn);
			
			nextBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"nextTextBtn.png"));
			nextBtn.x=425;
			nextBtn.y=400;
			stage.addChild(nextBtn);
			
			menuBtn.onClick=function(){
				Game.changeState("menuState");
			}
			nextBtn.onClick=function(){
				if(scoreDataShown){
					if(Config.level>=Config.levelMax){
						Game.changeState("gameWinState");
					}else{
						Game.changeState("gameState");
					}	
				}else{
					scoreDataShown=true;
					soldiersText.visible=true;
					timeText.visible=true;
					scoreText.text=Config.score;
				}
			}
			menuBtn.onMouseOver=nextBtn.onMouseOver=buttonOver;
			menuBtn.onMouseOut=nextBtn.onMouseOut=buttonOut;
			
			Game.startLoop();
		}
		this.update=function(){
			if(!scoreDataShown){
				timer++;
				if(timer>60*1 && !soldiersText.visible){
					soldiersText.visible=true;
				}
				if(timer>60*2 && !timeText.visible){
					timeText.visible=true;
					doInc=true;
				}
				if(doInc && (currInc<Config.score)){
					currInc+=10;
					scoreText.text=currInc;
				}else{
					if(currInc==Config.score){
						scoreDataShown=true;
					}
					doInc=false;
				}
			}
			stage.update();
		}
		this.exit=function(){
			Config.level++;
			stage.removeChild(bg);
			stage.removeChild(menuBtn);
			stage.removeChild(nextBtn);
			stage.removeChild(levelUpBox);
			stage.removeChild(levelText);
			stage.removeChild(scoreText);
			stage.removeChild(timeText);
			stage.removeChild(soldiersText);
		}
	}
	Game["gameOverState"]=function(){
		var bg, gameOverBox;
		var scoreText,levelText;
		var menuBtn;
		
		this.init=function(){
			bg=new Bitmap(Assets.get("otherbg.jpg"));
			stage.addChild(bg);
			
			gameOverBox=new Bitmap(Assets.get("levelFailedBox.png"));
			stage.addChild(gameOverBox);
			gameOverBox.x=250;
			gameOverBox.y=50;
			
			levelText=new Text(Config.level,Game.getFontString(true,18),"#2D1600");
			stage.addChild(levelText);
			levelText.x=450;
			levelText.y=210;
			
			scoreText=new Text(String(Config.score),Game.getFontString(true,48),"#2D1600");
			stage.addChild(scoreText);
			scoreText.x=410;
			scoreText.y=350;
			scoreText.textAlign="center";
			
			levelText.textBaseline=scoreText.textBaseline="bottom";
			levelText.textAlign="left";
			
			
			menuBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"menuTextBtn.png"));
			menuBtn.x=325;
			menuBtn.y=400;
			stage.addChild(menuBtn);
			
			menuBtn.onClick=function(){
				Game.changeState("menuState");
			}
			
			menuBtn.onMouseOver=buttonOver;
			menuBtn.onMouseOut=buttonOut;
			Game.startLoop();
		}
		this.update=function(){
			stage.update();
		}
		this.exit=function(){
			stage.removeChild(bg);
			stage.removeChild(menuBtn);
			stage.removeChild(gameOverBox);
			stage.removeChild(levelText);
			stage.removeChild(scoreText);
		}
	}
	Game["gameWinState"]=function(){
		var bg, gameWinBox;
		var scoreText;
		var menuBtn;
		
		this.init=function(){
			bg=new Bitmap(Assets.get("otherbg.jpg"));
			stage.addChild(bg);
			
			gameWinBox=new Bitmap(Assets.get("gameWonBox.png"));
			stage.addChild(gameWinBox);
			gameWinBox.x=250;
			gameWinBox.y=50;
			
			scoreText=new Text(String(Config.score),Game.getFontString(true,45),"#2D1600");
			stage.addChild(scoreText);
			scoreText.x=410;
			scoreText.y=300;
			scoreText.textAlign="center";
			scoreText.textBaseline="bottom";
			
			menuBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"menuTextBtn.png"));
			menuBtn.x=325;
			menuBtn.y=400;
			stage.addChild(menuBtn);
			
			menuBtn.onClick=function(){
				Game.changeState("menuState");
			}
			
			menuBtn.onMouseOver=buttonOver;
			menuBtn.onMouseOut=buttonOut;
			Game.startLoop();
		}
		this.update=function(){
			stage.update();
		}
		this.exit=function(){
			stage.removeChild(bg);
			stage.removeChild(menuBtn);
			stage.removeChild(gameWinBox);
			stage.removeChild(scoreText);
		}
	}
	
	Game["gameState"]=function(){
		var currentLevel;
		var bg;
		var pauseBtn,topBar,restartBtn,menuBtn,soundBtn,helpBtn,ffwBtn;
		var timeHUD,scoreHUD,levelHUD;
		var smokeEffect;
		var gameSpeed=1;
		
		this.init=function(){
			Config.score=Game.loadData().score || 0;
			Config.gameSpeed=1;
			
			//Add bg
			bg=new Bitmap(Assets.get("gameBg.jpg"));
			stage.addChild(bg);
			currentLevel=new Level(stage,Config.level);
			currentLevel.onLevelWon=function(){
				currentLevelTime=currentLevel.levelTime>>0;
				escapedCharacters=currentLevel.escapedCharacters;
				Game.changeState("levelUpState");
			}
			currentLevel.onLevelLost=function(){
				Game.changeState("gameOverState");
			}
			currentLevel.init();
			//Add hud elements
			pauseBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"pauseBtn.png"));
			stage.addChild(pauseBtn);
			pauseBtn.x=7;
			pauseBtn.y=5;
			
			topBar=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"topBar.png"));
			stage.addChild(topBar);
			topBar.x=54;
			topBar.y=5;
			
			restartBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"resetBtn.png"));
			stage.addChild(restartBtn);
			restartBtn.x=457;
			restartBtn.y=5;
			
			menuBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"menuBtn.png"));
			stage.addChild(menuBtn);
			menuBtn.x=505;
			menuBtn.y=5;
			soundBtn=new ToggleButton(getSpriteData(Assets.get("muteBtn.png"),Assets.get("muteBtn.json")),(Game.isMuted())?"muted":"unmuted");
			stage.addChild(soundBtn.clip);
			soundBtn.clip.x=553;
			soundBtn.clip.y=5;
			
			helpBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"helpBtn.png"));
			stage.addChild(helpBtn);
			helpBtn.x=600;
			helpBtn.y=5;
			
			ffwBtn=new Bitmap(TexturePackerUtils.frameFromSprite(Assets.get("sheet1.png"),Assets.get("sheet1.json"),"ffwBtn.png"));
			stage.addChild(ffwBtn);
			ffwBtn.x=600;
			ffwBtn.y=44;
			pauseBtn.onClick=Game.togglePause;
			restartBtn.onClick=function(){
				Game.changeState("gameState");
			}
			menuBtn.onClick=function(){
				Game.changeState("menuState");
			}
			soundBtn.clip.onClick=function(){
				Game.toggleSounds();
				if(soundBtn.state=="unmuted"){
					soundBtn.changeState("muted");
				}else{
					soundBtn.changeState("unmuted");
				}
			}
			helpBtn.onClick=function(){
				//Switch state will not exit the current state, but pause it and runs the new state.
				Game.switchState("helpState");
			}
			pauseBtn.onMouseOver=restartBtn.onMouseOver=menuBtn.onMouseOver=soundBtn.clip.onMouseOver=helpBtn.onMouseOver=buttonOver;
			pauseBtn.onMouseOut=restartBtn.onMouseOut=menuBtn.onMouseOut=soundBtn.clip.onMouseOut=helpBtn.onMouseOut=buttonOut;
			
			
			if(Game.isIOS()||Game.isAndroid()){
				ffwBtn.onPress=function(){
					if(gameSpeed==1){
						this.shadow=new Shadow("#000",0,0,2);
						gameSpeed=5;
					}else{
						this.shadow=null;
						gameSpeed=1;
					}
					changeGameSpeed();
				}
			}else{
				ffwBtn.onMouseOver=function(){
					this.shadow=new Shadow("#000",0,0,2);
					canvas.style.cursor="pointer";
					gameSpeed=5;
					changeGameSpeed();
				}
				ffwBtn.onMouseOut=function(){
					this.shadow=null;
					canvas.style.cursor="default";
					gameSpeed=1;
					changeGameSpeed();
				}
			}
			//Create HUD
			levelHUD=new Text("",Game.getFontString(true,18),"#2D1600");
			levelHUD.textAlign="center";
			levelHUD.textBaseline="middle";
			levelHUD.x=155;
			scoreHUD=new Text("00000",Game.getFontString(true,18),"#2D1600");
			scoreHUD.textAlign="center";
			scoreHUD.textBaseline="middle";
			scoreHUD.x=290;
			timeHUD=new Text(zeroPad(Config.levelData[Config.level-1].time,3),Game.getFontString(true,18),"#2D1600");
			timeHUD.textAlign="center";
			timeHUD.textBaseline="middle";
			timeHUD.x=420;
			
			stage.addChild(levelHUD);
			stage.addChild(scoreHUD);
			stage.addChild(timeHUD);
			levelHUD.y=scoreHUD.y=timeHUD.y=22;
			
			levelHUD.text=Config.level;
			scoreHUD.text=zeroPad(Config.score,5);
			var sp=new SpriteSheet(getSpriteData(Assets.get("smoke.png"),Assets.get("smoke.json")));
			smokeEffect=new BitmapAnimation(sp);
			stage.addChild(smokeEffect);
			smokeEffect.x=0;
			smokeEffect.y=Config.middleY/2;
			smokeEffect.visible=false;
			if(Config.animateSmoke){
				smokeEffect.gotoAndPlay("all");
			}else{
				smokeEffect.gotoAndStop(1);
			}
			
			bg.mouseEnabled=false;
			timeHUD.mouseEnabled=false;
			scoreHUD.mouseEnabled=false;
			levelHUD.mouseEnabled=false;
			topBar.mouseEnabled=false;
			
			Game.startLoop();
		}
		function changeGameSpeed(){
			Config.gameSpeed=gameSpeed;
		}
		this.update=function(){
			//Update HUD
			timeHUD.text=zeroPad(currentLevel.levelTime>>0,3);
			currentLevel.update();
			stage.update();
			
		}
		this.exit=function(){
			if(!Game.isIOS()){
				Game.stopSound("game_music");
				Game.playMusic("main_music",-1);
			}
			stage.removeChild(smokeEffect);
			smokeEffect=null;
			stage.removeChild(bg);
			bg=null;
			stage.removeChild(scoreHUD);
			stage.removeChild(timeHUD);
			stage.removeChild(levelHUD);
			stage.removeChild(pauseBtn);
			stage.removeChild(topBar);
			stage.removeChild(restartBtn);
			stage.removeChild(menuBtn);
			stage.removeChild(soundBtn.clip);
			stage.removeChild(helpBtn);
			stage.removeChild(ffwBtn);
			scoreHUD=null;
			timeHUD=null;
			levelHUD=null;
			pauseBtn=null;
			topBar=null;
			restartBtn=null;
			menuBtn=null;
			soundBtn=null;
			helpBtn=null;
			ffwBtn=null;
			currentLevel.exit();
			currentLevel=null;
		}
	}
	
	//This state is called not only withing gameState, but from anytime, including window focus lose etc..
	Game["pausedState"]=function(){
		var bg;
		this.init=function(){
			//Show paused art only if the state is gameState
			if(Game.currentState=="gameState"){
				//Show paused art/text
				bg=new Shape();
				bg.graphics.beginFill("#000");
				bg.graphics.rect(0,0,Config.middleX*2,Config.middleY*2);
				bg.graphics.endFill();
				stage.addChild(bg);
				bg.alpha=0.6;
				bg.onClick=function(){
					Game.unpause();
				}
			}
		}
		this.exit=function(){
			stage.removeChild(bg);
		}
	}
	
	//Other states if any..
	//Game["upgradeState"]=function(..)..
	
	
	
	//Other global functions that this block will use
	function buttonOver(){
		this.shadow=new Shadow("#000",0,0,2);
		canvas.style.cursor="pointer";
	}
	function buttonOut(e){
		this.shadow=null;
		canvas.style.cursor="default";
	}
	
	window.Game=Game;
})(window.Game || {});

/***DO NOT MODIFY***/
(function(Game){
	//Global variables for Game class. DO NOT MODIFY
	var stage,canvas;
	var currentState = null;
	var tempSwitchState=null;
	var oldTime=0;
	var pausedState;
	var isSoundEnabled=true;
	Game.tickMultiplier=1;
	Game.currentState="";
	Game.gameData={};
	Game.isPaused=false;
	Game.playingSounds=[];
	
	window.onblur=function(){
		if(Game.currentState=="gameState")
		Game.pause(true);
	}
	window.onfocus=function(){
		//Game.isPaused is for manual pause, If already paused, do not unpause..
		if(!Game.isPaused) Game.unpause();
	}
	//private
	function mute(state){
		if(state){
			AudioSprite.pause();//For IOS
			soundManager.mute();
			soundManager.isMuted=true;
		}else{
			AudioSprite.resume();//For IOS
			soundManager.unmute();
			soundManager.isMuted=false;
		}
	}
	
	//public
	Game.pause=function(showScreen){
		if(showScreen==true && !pausedState){
			pausedState = new Game.pausedState();
			pausedState.init();
			mute(true);
			Game.isPaused=true;
		}
		stage.update();
		Ticker.setPaused(true);
	}
	Game.unpause=function(){
		if(pausedState){
			pausedState.exit();
			if(isSoundEnabled){
				Game.enableSounds();
			}
			Game.isPaused=false;
			oldTime=Ticker.getTime();
		}
		pausedState=null;
		Ticker.setPaused(false);
	}
	Game.togglePause=function(){
		if(Game.isPaused){
			Game.unpause();
		}else{
			Game.pause(true);
		}
	}
	
	Game.init=function(_canvas){
				
		/*document.ontouchmove=function(e){
			e.preventDefault();
		}*/
		//Ticker.setFPS(60);
		canvas=_canvas;
		stage=new Stage(canvas);
		Game.stage=stage;
		
		
		canvas.width=Config.canvasWidth;
		canvas.height=Config.canvasHeight;
		
		if(!Game.isDesktop){
			window.addEventListener('resize',resize,false);
			window.addEventListener('orientationchange', resize, false);
		}

		//Check for game saveable
		if(Game.isLocalStorageSupported()){
			//Check for saved data
			if(localStorage.getItem(Config.gameName)){
				Game.gameData=JSON.parse(localStorage.getItem(Config.gameName));
			}else{
				Game.gameData["oldData"]=true;
				localStorage.setItem(Config.gameName, JSON.stringify(Game.gameData));
			}
		}
		Game.initialize(stage,canvas);
		//Ticker.useRAF = true;
		// Best Framerate targeted (60 FPS)
		Ticker.setInterval(17);
		if(Touch.isSupported()){
			Touch.enable(stage);
		}
		stage.mouseEventsEnabled = true;
		if(!Game.isDesktop){
			resize();
		}else{
			if(document.getElementById('adBox').style.display!="block" && Game.gameStarted!=true){
				document.getElementById('adBox').style.display="block";
				Game.gameStarted=true;
			}
		}
	}
	
	function resize() { 
		var gameArea = document.getElementById('container');
		var widthToHeight = 650 / 550;
		
		var newWidth=Math.min(Config.canvasWidth,window.innerWidth);
		var newHeight=Math.min(Config.canvasHeight,window.innerHeight);
		
		var newWidthToHeight = newWidth / newHeight;
		
		if (newWidthToHeight > widthToHeight) {
			newWidth = newHeight * widthToHeight;
			gameArea.style.height = newHeight + 'px';
			gameArea.style.width = newWidth + 'px';
		} else {
			newHeight = newWidth / widthToHeight;
			gameArea.style.width = newWidth + 'px';
			gameArea.style.height = newHeight + 'px';
		}
		
		gameArea.style.marginTop = (-newHeight / 2) + 'px';
		gameArea.style.marginLeft = (-newWidth / 2) + 'px';
		
		var gameCanvas = document.getElementById('canvas');
		gameCanvas.width = newWidth;
		gameCanvas.height = newHeight;

		stage.scaleX=newWidth/Config.canvasWidth;
		stage.scaleY=newHeight/Config.canvasHeight;
		
		
		if(Game.gameStarted!=true){
			Game.gameStarted=true;
		}
		
	}
	Game.canvasToWorldX=function(canvasX){
		return (canvasX*Config.canvasWidth/stage.canvas.width)>>0;	
	}
	Game.canvasToWorldY=function(canvasY){
		return (canvasY*Config.canvasHeight/stage.canvas.width)>>0;	
	}

	
	
	Game.changeState=function(state){
		Game.stopLoop();
		if(currentState){
			currentState.exit();
		}
		currentState = new Game[state]();
		currentState.init();
		Game.currentState=state;
	}
	Game.switchState=function(state){
		tempSwitchState=new Game[state]();
		tempSwitchState.init();
	}
	Game.exitSwitchedState=function(){
		if(tempSwitchState!=null){
			tempSwitchState.exit();
			tempSwitchState=null;
		}
	}
	
	Game.startLoop=function(){
		oldTime=Ticker.getTime();
		Ticker.addListener({
			tick:function(){
					Game.tickMultiplier=(Ticker.getTime()-oldTime)*60/1000;
					//document.getElementById("delta").innerHTML="deltaTime: "+Game.tickMultiplier;
					oldTime=Ticker.getTime();
					//document.getElementById('fps').innerHTML=Math.floor(Ticker.getMeasuredFPS())+"/"+Math.floor(Ticker.getFPS());
					if(tempSwitchState==null){
						currentState.update();
					}else{
						tempSwitchState.update();
					}
				}
		});
		
	}
	Game.stopLoop=function(){
		Ticker.removeAllListeners();
	}
	Game.playMusic=function(name,loop,volume,offset){
		var count=0;
		function loopSound(sound){
			count++;
			sound.play({
				onplay:function(){
					if(Game.playingSounds.indexOf(name)==-1){
						Game.playingSounds.push(name);
					}
				},
				onstop:function(){
					Game.playingSounds.splice(Game.playingSounds.indexOf(name),1);
				},
				onfinish:function(){
					Game.playingSounds.splice(Game.playingSounds.indexOf(name),1);
					if(count<loop || loop==-1){
						loopSound(sound);
					}
				}
			})
		}
		loopSound(soundManager.getSoundById(name));
	}
	Game.playSound=function(name,interrupt,volume,delay){
		//SoundJS.play(name,interrupt,volume,0,delay);
	}
	Game.stopSound=function(name){
		soundManager.getSoundById(name) && soundManager.getSoundById(name).stop();
	}
	Game.isPlayingMusic=function(name){
		if(Game.playingSounds.indexOf(name)!=-1){
			return true;
		}
		return false;
	}
	Game.isIOS=function(){
		return navigator.userAgent.match(/(ipad|iphone|ipod)/i);
	}
	Game.isAndroid=function(){
		return navigator.userAgent.match(/android/i);
	}
	Game.isMuted=function(){
		return !isSoundEnabled;
	}
	Game.disableSounds=function(){
		isSoundEnabled=false;
		mute(!isSoundEnabled);
	}
	Game.enableSounds=function(){
		isSoundEnabled=true;
		mute(!isSoundEnabled);
	}
	Game.toggleSounds=function(){
		if(Game.isMuted()){
			Game.enableSounds();
		}else{
			Game.disableSounds();
		}
	}
	/**
 	 * Check if localstorage is supported in this browser.
 	 */
	Game.isLocalStorageSupported=function(){
		try {
			var supported = false;
			if (window['localStorage'] !== null){
				supported = true;
			}
			return supported;
		} catch(e) {
			return false;
		} 
	}
	/**
	 * Load saved game data
	 */
	Game.loadData=function(){
		return Game.gameData;
	}
	Game.setData=function(key,value){
		Game.gameData[key]=value;
	}
	Game.deleteData=function(key){
		delete Game.gameData[key];
	}
	Game.resetSaveData=function(){
		Game.gameData={};
		delete localStorage[Config.gameName];
	}
	Game.saveData=function(){
		if(Game.isLocalStorageSupported()){
			Game.gameData['oldData']=true;
			localStorage.setItem(Config.gameName, JSON.stringify(Game.gameData));
		}
	}
})(window.Game || {});
