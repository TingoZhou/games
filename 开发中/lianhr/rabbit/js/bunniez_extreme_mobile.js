window.onload=function(){
//game
var i,WIDTH=300,HEIGHT=455,GAME_RECTANGLE=new Rectangle(0,0,WIDTH,HEIGHT),
currentHour=new Date().getHours(),BG_URL=(0&&currentHour>=6&&currentHour<18?"img/ui/bgPlutySpring.png":"img/ui/bgPluty.png"),
LANE_BOTTOM_Y=[],LANE_Y=[],LANE_HEIGHT=75,OFFSET_Y,y,
GAME_LEVEL_INTERVAL=15000,
IMG,MENU_STATE,GAME_STATE,HIGH_SCORE_STATE,CREDITS_STATE,SCREEN_CREDITS_STATE,
FONT="Tahoma",LEVEL=[],currentLevel=0,MAX_LEVEL=7,
score,SCORE_TEXT,
YOU_WIN_SPRITE,GAME_OVER_SPRITE,
MUTE=0,AUDIO=document.getElementById("sounds"),MUTE_BUTTON,
TOP_10=localStorage.stopTheRabbitsHighScore?eval("("+localStorage.stopTheRabbitsHighScore+")"):[],

TEXT_BOX={y:0,height:50,draw:function(c){
	c.fillStyle="rgba(0,0,0,.5)";
	c.fillRect(0,this.y,WIDTH,this.height);
}},TEXT,TUTORIAL_TEXT,LEVEL_TEXT,
BORDER={draw:function(c){c.strokeStyle="#888888";
			c.strokeRect(0,0,WIDTH,HEIGHT);
		}},
GRAY_SCREEN={draw:function(c){
	c.fillStyle="rgba(0,0,0,.5)";
	c.fillRect(0,0,WIDTH,HEIGHT);
}},
CATEGORY;

if((IS_IPHONE||IS_IPOD)&&!window.navigator.standalone){
	HEIGHT=415;
}

y=HEIGHT-210;

for(i=0;i<3;i++){
	LANE_BOTTOM_Y.push(y);
	LANE_Y.push(y-LANE_HEIGHT);
	y+=LANE_HEIGHT;
}

OFFSET_Y=LANE_Y[0];

if(IS_ANDROID)
    CATEGORY="android";
else if(IS_IPAD)
    CATEGORY="ipad";
else if(IS_IPRODUCT)
    CATEGORY="iphone";
else
    CATEGORY="non-mobile";
	
	
if(IS_TOUCH){//iproducts and android
	//view and scale
	var head=document.getElementsByTagName("head")[0],node;
	node=document.createElement("meta");
	node.setAttribute("name","viewport");
		if(IS_IPAD)
		node.setAttribute("content", "user-scalable=no, width=320, initial-scale=2.0, maximum-scale=2.0");
		else
		node.setAttribute("content", "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0");
	head.appendChild(node);
	//want to be an offline app
	node=document.createElement("meta");
	node.setAttribute("name","apple-mobile-web-app-capable");
	node.setAttribute("content", "yes");
	head.appendChild(node);
	//hides status bar and navigation bar
	node=document.createElement("meta");
	node.setAttribute("name","apple-mobile-web-app-status-bar-style");
	node.setAttribute("content", "black");
	head.appendChild(node);
	//apple touch icon
	node=document.createElement("link");
	node.setAttribute("rel","apple-touch-icon");
	node.setAttribute("href", "img/bunnyPink_walk/bunnyPink_walk0000.png");
	head.appendChild(node);
	//apple-touch-startup-image
	node=document.createElement("link");
	node.setAttribute("rel","apple-touch-startup-image");
	node.setAttribute("href", "img/ui/title.png");
	head.appendChild(node);
	
	window.scrollTo(0,1);
}

function play(sound){
	if(!MUTE){
		try{
			AUDIO.src=sound;
			AUDIO.play();
		}catch(e){}
	}
}

function addTopScore(s){
	TOP_10.push(s);
	TOP_10.sort(function(a,b){
		return b-a;
	});
	if(TOP_10.length>10){
		TOP_10=TOP_10.slice(0,10);
	}
	localStorage.stopTheRabbitsHighScore="["+TOP_10.join(",")+"]";
}

function MuteButton(){
	this.superClass=Sprite;
	this.superClass(IMG["img/ui/btn_soundOn.png"]);
	
	this.x=5;
	this.y=34;
	
	this.toggle=function(){
		MUTE=!MUTE;
		if(MUTE){
			this.setImage(IMG["img/ui/btn_soundOff.png"]);
		}else{
			this.setImage(IMG["img/ui/btn_soundOn.png"]);
		}
	};
	
}



function FredTextSprite(text){
	this.superClass=TextSprite;
	this.superClass(text);
	this.font="bold 15px "+FONT;
	this.textAlign="left";
}

var TOUCH_TEXT=new FredTextSprite(IS_TOUCH?"touch to return to menu...":"click to return to menu..."),
TOUCH_TEXT1=new FredTextSprite(IS_TOUCH?"touch to continue...":"click to continue...");

TOUCH_TEXT.textAlign="center";
TOUCH_TEXT.font="bold 12px "+FONT;
TOUCH_TEXT.x=WIDTH/2;
TOUCH_TEXT.y=260;
TOUCH_TEXT.color="black";

TOUCH_TEXT1.textAlign="center";
TOUCH_TEXT1.font="bold 12px "+FONT;
TOUCH_TEXT1.x=WIDTH/2;
TOUCH_TEXT1.y=300;
TOUCH_TEXT1.color="black";


TEXT=new FredTextSprite("");
TEXT.x=WIDTH/2;
TEXT.y=80;
TEXT.font="bold 12px "+FONT;
TEXT.textAlign="center";

TEXT_BOX.y=70;
TEXT_BOX.height=40;

SCORE_TEXT=new FredTextSprite("");
SCORE_TEXT.x=WIDTH-10;
SCORE_TEXT.y=HEIGHT-53;
SCORE_TEXT.textAlign="right";

function setScore(s){
	score=s;
	SCORE_TEXT.text=""+s;
}

LEVEL_TEXT=new FredTextSprite("");
LEVEL_TEXT.x=WIDTH-10;
LEVEL_TEXT.y=HEIGHT-53;
LEVEL_TEXT.textAlign="right";

function TypeText(text){
	this.superClass=FredTextSprite;
	this.superClass("");
	
	
	var actualText=text,ctr=0,timer=new TimedTriggerPoller(50);
	timer.timedListener=this;
	
	this.setText=function(text){
		actualText=text;
		ctr=0;
	};

	this.trigger=function(){
		if(ctr===actualText.length-1){
			if(this.oncomplete){
				this.oncomplete();
			}
		}
		
		ctr=Math.min(actualText.length,ctr+1);
		this.text=actualText.substr(0,ctr);
		
	};
	
	
	this.update=function(t){
		timer.update(t);
	};
}

TUTORIAL_TEXT=new TypeText("");
TUTORIAL_TEXT.x=WIDTH/2;
TUTORIAL_TEXT.y=80;
TUTORIAL_TEXT.font="bold 12px "+FONT;
TUTORIAL_TEXT.textAlign="center";

function PopupText(text,x,y){
	this.superClass=FredTextSprite;
	this.superClass(text);
	this.a=1;
	this.color="rgba(255,215,0,"+this.a+")";
	this.x=x;
	this.y=y;
	this.textAlign="center";
	this.update=function(){
		this.a=Math.max(0,this.a-.03);
		this.color="rgba(255,215,0,"+this.a+")";
		this.y-=.5;
	};
	this.willDispose=function(){return this.a<=0;};
}

function LoadingState(game){
	var loadingText=new FredTextSprite("Loading"),
	noteText=[],
	timer=new TimedTriggerPoller(500),ctr,i;
	loadingText.x=WIDTH/2-40;
	loadingText.y=40;
	noteText.push(new FredTextSprite("No rabbits were hurt or killed"));
	noteText.push(new FredTextSprite("in this game."));
	noteText.push(new FredTextSprite("Everything is just special effects"));
	noteText.push(new FredTextSprite("and good acting."));
	for(i=0;i<noteText.length;i++){
		noteText[i].x=WIDTH/2;
		noteText[i].y=20*i+70;
		noteText[i].textAlign="center";
	}
	
	
	timer.timedListener=this;
	this.load=function(){
		game.addSprite(BORDER);
		game.addSprite(loadingText);
		timer.initTimer();
		ctr=0;
		loadingText.text="Loading";
		for(i=0;i<noteText.length;i++){
			game.addSprite(noteText[i]);
		}
	};
	this.update=function(t){
		timer.update(t);
	};
	this.unload=function(){
		game.removeAllSprites();
	};
	this.trigger=function(){
		ctr=(ctr+1)%4;
		var s="Loading",i=0;
		for(;i<ctr;i++){
			s+=".";
		}
		loadingText.text=s;
	};
}

function SplashScreenState(game){
	var splashScreenSprite=new Sprite(IMG["img/spilgames_splash_screen_for_HTML5.jpg"]),i=0,
	menuScreen=new Sprite(IMG["img/ui/title.png"]),
	da=.05;
	this.load=function(){
		splashScreenSprite.scaleX=.95;
		splashScreenSprite.alpha=0;
		game.addSprite(BORDER);
		game.addSprite(splashScreenSprite);
	};
	this.update=function(t){
		splashScreenSprite.alpha+=da;
		if(splashScreenSprite.alpha>=1){
			da=-da;
			game.addSprite(menuScreen);
			game.removeSprite(splashScreenSprite);
			game.addSprite(splashScreenSprite);
		}
		if(da<0&&splashScreenSprite.alpha<=0)
			game.setState(MENU_STATE);
	};
	this.unload=function(){
		game.removeAllSprites();
	};
}



function MenuState(game){
	var bg=new Sprite(IMG["img/ui/title.png"]),
	s=new Sprite(IMG["img/ui/btn_play.png"]),
	hs=new Sprite(IMG["img/ui/btn_highscore.png"]),
	c=new Sprite(IMG["img/ui/btn_credits.png"]);

	s.setCenterX(WIDTH/2);
	s.y=HEIGHT-s.getHeight()-10;
	
	hs.x=10;
	hs.y=HEIGHT-hs.getHeight()-10;
	//hs.setCenterX(WIDTH/2);
	//hs.y=s.y+s.getHeight()+5;
	c.x=WIDTH-c.getWidth()-10;
	// c.y=HEIGHT-c.getHeight()-10;
	c.y=HEIGHT-c.getHeight()+20;

	this.load=function(){
		game.addSprite(bg);
		game.addSprite(s);
		game.addSprite(hs);
		game.addSprite(c);
		game.addSprite(BORDER);
	};
	this.update=function(){
		if(game.isMouseNewlyDown()) {
			if (s.getRectangle().contains(game.getMouseX(), game.getMouseY()))
			{
				score=0;
				currentLevel=0;
				game.setState(LEVEL[0]);
			}else if(hs.getRectangle().contains(game.getMouseX(), game.getMouseY())){
				game.setState(HIGH_SCORE_STATE);
			}else if(c.getRectangle().contains(game.getMouseX(), game.getMouseY())){
				game.setState(SCREEN_CREDITS_STATE);
			}
		}
	};
	this.unload=function(){
		game.removeAllSprites();
	};
}


function HighScoreState(game){

	var bg=new Sprite(IMG["img/ui/menu_highScore.png"]);
	
	
	function renderTopScore(){
        var rankText,nameText,scoreText,
        offset=90,i=0;

        for(;i<TOP_10.length;i++){
            rankText=new FredTextSprite(""+(i+1));
            rankText.x=40;
            rankText.y=offset+15*i;
            rankText.textAlign="center";
			rankText.color="black";
            game.addSprite(rankText);

            scoreText=new FredTextSprite(""+TOP_10[i]);
            scoreText.x=WIDTH-50;
            scoreText.y=offset+15*i;
            scoreText.textAlign="right";
			scoreText.color="black";
            game.addSprite(scoreText);
        }
        game.addSprite(TOUCH_TEXT);
    }
	this.load=function(){
		game.addSprite(bg);
		renderTopScore();
	};
	this.update=function(t){
		if(game.isMouseNewlyDown()){
			game.setState(MENU_STATE);
		}
	};
	this.unload=function(){
		game.removeAllSprites();
	};
}

function ScreenCreditsState(game){
	var bg=new Sprite(IMG["img/ui/credits.png"]),exitButton=new Sprite(IMG["img/ui/btn_exit.png"]);

	exitButton.x=WIDTH-exitButton.getWidth()-2;
	exitButton.y=2;

	this.load=function(){
		game.addSprite(bg);
		game.addSprite(BORDER);
		game.addSprite(exitButton);
	};

	this.update=function(t){
		if(game.isMouseNewlyDown()){
			game.setState(MENU_STATE);
		}
	};
	this.unload=function(){
		game.removeAllSprites();
	};
}

function CreditsState(game){
	var ctr=0,bunny=new Sprite(HARE_EAT_IMG[0]),exitButton=new Sprite(IMG["img/ui/btn_exit.png"]),noteText=[],i;
	noteText.push(new FredTextSprite("Sabao Studios"));
	noteText.push(new FredTextSprite(""));
	noteText.push(new FredTextSprite("Designers"));
	noteText.push(new FredTextSprite("Teril Bilog"));
	noteText.push(new FredTextSprite("Solomon See"));
	noteText.push(new FredTextSprite("Steven Pua"));
	noteText.push(new FredTextSprite(""));
	noteText.push(new FredTextSprite(""));
	noteText.push(new FredTextSprite("No rabbits were hurt or killed"));
	noteText.push(new FredTextSprite("in this game."));
	noteText.push(new FredTextSprite("Everything is just special effects"));
	noteText.push(new FredTextSprite("and good acting."));
	noteText.push(new FredTextSprite(""));
	noteText.push(new FredTextSprite("Thank you for playing!!!"));
	noteText.push(new FredTextSprite(""));
	noteText.push(new FredTextSprite(IS_TOUCH?"touch to continue...":"click to continue..."));
	for(i=0;i<noteText.length;i++){
		noteText[i].x=WIDTH/2;
		noteText[i].y=20*i+20;
		noteText[i].textAlign="center";
	}
	bunny.alpha=.5;
	
	
	bunny.update=function(){
		ctr=(ctr+1)%HARE_EAT_IMG.length;
		bunny.setImage(HARE_EAT_IMG[ctr]);
	};
	
	
	exitButton.x=WIDTH-exitButton.getWidth()-2;
	exitButton.y=2;

	bunny.x=(WIDTH-bunny.getWidth())/2;
	bunny.y=(HEIGHT-bunny.getHeight())/2;

	this.load=function(){
		game.addSprite(bunny);
		game.addSprite(GRAY_SCREEN);
		game.addSprite(BORDER);
		game.addSprite(exitButton);
		
		for(i=0;i<noteText.length;i++){
			game.addSprite(noteText[i]);
		}
	};

	this.update=function(t){
		bunny.update();
		if(game.isMouseNewlyDown()){
			game.setState(HIGH_SCORE_STATE);
		}
	};
	this.unload=function(){
		game.removeAllSprites();
	};

}








var TWO_PI=Math.PI+Math.PI;

function drawCircle(c,x,y,r,color){
	c.fillStyle=color;
	c.beginPath();
	c.arc(x,y,r,0,TWO_PI,false);
	c.closePath();
	c.fill();
}

function Droop(x,y,width){
	
	var speed=Math.random()*2,height=0,radius=width/2,centerX=x+radius;
	
	this.update=function(t){
		height+=speed;
	};
	
	this.draw=function(c){
		c.fillStyle="red";
		c.fillRect(x,y,width,height);
		drawCircle(c,centerX,y+height,radius,"red");
	};
}

function Blood(x,y,r){
	var droops=[],alpha=1;
	
	
	var i=x-r+4,w;
	do{
		w=Math.random()*3+3;
		droops.push(new Droop(i,y+r*Math.sin(Math.acos((i-x)/r))-5,w));
		i+=w+Math.random()*8;
	}while(i<x+r-8);
	
	this.update=function(t){
		for(var i=0;i<droops.length;i++){
			droops[i].update(t);
		}
		alpha-=.02;
	};
	
	this.willDispose=function(){
		return alpha<=0;
	};
	
	function buffer(){
		bc.clearRect(0,0,WIDTH,HEIGHT);
		drawCircle(bc,x,y,r,"red");
			for(var i=0;i<droops.length;i++){
				droops[i].draw(bc);
				droops[i].y++;
			}
	}
	
	this.draw=function(c){
		c.save();
		c.globalAlpha=alpha;
		
		
		
		drawCircle(c,x,y,r,"red");
			for(var i=0;i<droops.length;i++)
				droops[i].draw(c);
		//buffer();
		//c.drawImageData(bc.getImageData(0,0,WIDTH,HEIGHT),0,0);
		
		c.restore();
	};
}

function Blood2(x,y){

	this.superClass=Sprite;
	this.superClass(IMG["img/ui/blood2.png"]);

	this.setCenterX(x);
	this.setCenterY(y);

	this.update=function(t){
		this.alpha-=.02;
		this.y+=1;
	};
	
	this.willDispose=function(){
		return this.alpha<=0;
	};
}

function MinimapUnit(sprite,target,minimap){
	var rect=minimap.getRectangle(),y=rect.y,height=rect.height,offsetX=sprite.getWidth()/2;

	sprite.y=y+(height-sprite.getHeight())/2;

	this.draw=function(c){
		sprite.x=minimap.getScrollX(target.logicalX);//-offsetX;
		sprite.draw(c);
	};
}

function Minimap(tgs){
	var scale=WIDTH/tgs.end,scaledWidth=scale*WIDTH,rect=new Rectangle(0,HEIGHT-30,WIDTH,30),img=IMG["img/ui/bar.png"];
	
	
	this.getRectangle=function(){
		return rect;
	};
	
	this.getScrollX=function(x){
		return scale*x;
	};
	
	this.getScreenX=function(x){
		return x/scale;
	};
	
	
	this.draw=function(c){
		c.drawImage(img,rect.x,rect.y);
		c.fillStyle="rgba(119,153,51,.3)";
		c.fillRect(scale*tgs.screenX,rect.y,scaledWidth,rect.height);
		c.strokeStyle="#779933";
		c.strokeRect(scale*tgs.screenX,rect.y,scaledWidth,rect.height);
	};
}

function Background(tgs){
	var bg=IMG[BG_URL],y=HEIGHT-bg.height-30;
	this.width=2000;
	this.draw=function(c){
		var c1=tgs.screenX%bg.width,cWidth=bg.width-c1,cWidth1=WIDTH-cWidth;
		
		c.drawImage(bg,c1,0,cWidth,bg.height,0,y,cWidth,bg.height);
		if(cWidth1>0){
			c.drawImage(bg,0,0,cWidth1,bg.height,cWidth,y,cWidth1,bg.height);
		}
	};
}

function Unit(img){

	this.superClass=Sprite;
	this.superClass(img);


	this.logicalX=0;
	this.setLane=function(i){
		this.lane=i;
		this.y=LANE_BOTTOM_Y[i]-this.getHeight();
	};
}

var HARE_WALK_URL="img/bunnyPink_walk/bunnyPink_walk000",HARE_WALK_IMG=[],
HARE_JUMP_URL="img/bunnyPink_eat/bunnyPink_jump/bunny_jump000",HARE_JUMP_IMG=[],
HARE_PICK_URL="img/bunnyPink_eat/bunnyPink _carrotGrab/bunny_pick000",HARE_PICK_IMG=[],
HARE_EAT_URL="img/bunnyPink_eat/bunnyPink_carrotLove/carrotlove000",HARE_EAT_IMG=[],
HARE_DIZZY_URL="img/bunnyPink_dizzy/bunnyPink_dizzy000",HARE_DIZZY_IMG=[],
HARE_DEAD_URL="img/bunny_kill/bunnyPink_kill00",HARE_DEAD_IMG=[];


var BLACK_HARE_WALK_URL="img/bunnyBlack_walk/bunnyBlack_walk000",BLACK_HARE_WALK_IMG=[],
/*HARE_JUMP_URL="img/bunnyPink_eat/bunnyPink_jump/bunny_jump000",HARE_JUMP_IMG=[],
HARE_PICK_URL="img/bunnyPink_eat/bunnyPink _carrotGrab/bunny_pick000",HARE_PICK_IMG=[],
HARE_EAT_URL="img/bunnyPink_eat/bunnyPink_carrotLove/carrotlove000",HARE_EAT_IMG=[],
HARE_DIZZY_URL="img/bunnyPink_dizzy/bunnyPink_dizzy000",HARE_DIZZY_IMG=[],*/
BLACK_HARE_DEAD_URL="img/blackBunny_kill/bunnyBlack_kill00",BLACK_HARE_DEAD_IMG=[];


function Hare(state,speed,x,lane,black){



	var pickCtr=0,ctr=0,offsetX,offsetY,width,height,game=state.game,walkImg,deadImg,
	thisHare=this,actionMap={
		"STAND":function(t){
		},
		"WALK":function(t){
			thisHare.setImage(walkImg[ctr=(ctr+1)%walkImg.length]);
			thisHare.logicalX+=thisHare.speed;
			if(thisHare.logicalX>=state.end&&!state.isGameOver){
				state.gameOver();
			}
		},
		"JUMP":function(t){
			thisHare.setImage(HARE_JUMP_IMG[ctr=(ctr+1)%HARE_JUMP_IMG.length]);
			jumpTimer.update(t);
		},
		"PICK":function(t){
			thisHare.setImage(HARE_PICK_IMG[pickCtr]);
			pickCtr++;
			if(pickCtr>=HARE_PICK_IMG.length){
				pickCtr=0;
				thisHare.action="EAT";
			}
		},
		"EAT":function(t){
			thisHare.setImage(HARE_EAT_IMG[ctr=(ctr+1)%HARE_EAT_IMG.length]);
			if(eatTimer.totalMillis>=4000)
			thisHare.alpha=1-((eatTimer.totalMillis-4000)/(eatTimer.delayMillis-4000));
			
			eatTimer.update(t);
		},
		"DIZZY":function(t){
			thisHare.setImage(HARE_DIZZY_IMG[ctr=(ctr+1)%HARE_DIZZY_IMG.length]);
			dizzyTimer.update(t);
		},
		"DEAD":function(t){
			if(ctr<deadImg.length){
				thisHare.setImage(deadImg[ctr++]);
			}
		}
	},
	jumpTimer=new TimedTriggerPoller(400),eatTimer=new TimedTriggerPoller(5000),dizzyTimer=new TimedTriggerPoller(2500),
	standTimer=new TimedTriggerPoller(10000);
	
	
	
	
	
	if(black){
		walkImg=BLACK_HARE_WALK_IMG;
		deadImg=BLACK_HARE_DEAD_IMG;
		this.isBlack=1;
		this.update=function(t){
			actionMap[this.action](t);
		};

	}else{
		walkImg=HARE_WALK_IMG;
		deadImg=HARE_DEAD_IMG;
		this.isBlack=0;
		this.update=function(t){

			actionMap[this.action](t);
			
			if(game.isMouseNewlyDown()&&
			this.getCollisionRectangle().contains(game.getMouseX(),game.getMouseY())){
				this.stun();
			}
			
		};
	}
	
	
	
	
	this.superClass=Unit;
	this.superClass(walkImg[0]);
	
	offsetX=this.getWidth()/2;
	offsetY=this.getHeight()*3/10;
	width=offsetX;
	height=this.getHeight()-offsetY;

	this.logicalX=x?x:0;
	this.speed=speed?speed:2;
	this.action="WALK";
	this.setLane(lane?lane:0);

	dizzyTimer.timedListener={trigger:function(){
		thisHare.action="WALK";
		ctr=0;
	}};
	
	jumpTimer.timedListener={trigger:function(){
		thisHare.action="PICK";
		ctr=0;
	}};
	
	eatTimer.timedListener={trigger:function(){
		state.killed++;
		state.addScore(1/*,thisHare.x+thisHare.getWidth()/2,
		thisHare.y+thisHare.getHeight()/2*/);
		state.removeHare(thisHare);
		state.updateRabbitsLeft();
	}};
	
	this.stand=function(){
		this.setImage(walkImg[0]);
		this.action="STAND";
	};
	
	
	this.stun=function(){
		if(this.action=="WALK"){
			this.action="DIZZY";
			ctr=0;
		}
	};
	this.eat=function(){
		if(this.action!="DEAD"){
			this.action="JUMP";
			ctr=0;
		}
	};
	
	
	this.getMinimapUnit=function(minimap){
		return new MinimapUnit(new Sprite(IMG["img/ui/marker_enemy.png"]),this,minimap);
	};
	
	this.getCollisionRectangle=function(){
		return new Rectangle(this.x+offsetX,this.y+offsetY,width,height);
	};
	
	this.kill=function(){
		var rect=this.getCollisionRectangle();
		/*for(var i=0;i<15;i++)
		state.addParticle(new Blood2(20+this.x+Math.random()*this.getWidth(),
			this.y+Math.random()*this.getHeight(),10+Math.random()*20));*/
		/*state.addParticle(new Blood2(rect.x+rect.width/2,
		rect.y+rect.height/2));*/
		/*state.addParticle(new Blood2(20+this.x+Math.random()*this.getWidth(),
			this.y+Math.random()*this.getHeight()));*/
		state.removeHare(this);
	};
	
	this.kill2=function(){
		if(this.action!="DEAD"){
			ctr=0;
			this.scaleX=this.scaleY=.7;
			this.setImage(deadImg[0]);
			this.action="DEAD";
			state.killed++;
			state.updateRabbitsLeft();
			state.addScore(this.isBlack?2:1/*,thisHare.x+thisHare.getWidth()/2,
				thisHare.y+thisHare.getHeight()/2*/);
			play("sounds/ahhh.wav");
		}
	};
	
}


var BUTTON_CARROT_COOLDOWN_URL="img/ui/carrot/btn_carrot_cooldown0",BUTTON_CARROT_COOLDOWN_IMG=[],
BUTTON_BOMB_COOLDOWN_URL="img/ui/bomb/btn_bomb_cooldown0",BUTTON_BOMB_COOLDOWN_IMG=[],
BUTTON_BRUTAL_KILL_COOLDOWN_URL="img/ui/brutalKill/btn_brutalKill_cooldown0",BUTTON_BRUTAL_KILL_COOLDOWN_IMG=[];


function SkillMenuItem(img,dragImg,state,delay,cdIMGs){

	this.superClass=Sprite;
	this.superClass(img);
	
	this.defaultImg=img;
	
	var thisMenu=this,hold=0,game=state.game,lane=-1,rect,offsetHeight=dragImg.height,
	dragSprite=new Sprite(dragImg);
	
	this.cooldownTimer=new TimedTriggerPoller(delay);
	this.isCooldown=0;
	this.countText=new FredTextSprite("");
	this.countText.textAlign="right";
	this.countText.textBaseline="bottom";
	this.countText.font="11px "+FONT;
	this.count=0;
	
	this.cooldownTimer.timedListener={
		trigger:function(){
			thisMenu.isCooldown=0;
			thisMenu.setImage(img);
		}
	};
	
	function computeCD(){
		return thisMenu.cooldownTimer.totalMillis/thisMenu.cooldownTimer.delayMillis;
	}
	
	this.initRect=function(){
		rect=this.getRectangle();
		this.countText.x=rect.x+rect.width-2;
		this.countText.y=rect.y+rect.height-2;
	};

	this.update=function(t){
	
		if(!this.count){
			this.setImage(cdIMGs[0]);
		}else if(this.isCooldown){
			this.setImage(cdIMGs[Math.floor(computeCD()*cdIMGs.length)]);
			this.cooldownTimer.update(t);
		}else{
			var mx=game.getMouseX(),my=game.getMouseY();
			if(hold){
				if(game.isMouseNewlyUp()){
					game.removeSprite(dragSprite);
					state.skillHold=hold=0;
					this.x=rect.x;
					this.y=rect.y;
					if(lane>-1){
						this.ondrop(dragSprite.getCenterX()+state.screenX,lane);
						this.isCooldown=1;
						this.count--;
						this.countText.text=""+this.count;
					}
				}else{
					dragSprite.setCenterX(mx);
					if(my<LANE_Y[0]){
						dragSprite.setCenterY(my);
						lane=-1;
					}else if(my<LANE_Y[1]){
						dragSprite.y=LANE_BOTTOM_Y[0]-offsetHeight;
						lane=0;
					}else if(my<LANE_Y[2]){
						dragSprite.y=LANE_BOTTOM_Y[1]-offsetHeight;
						lane=1;
					}else{
						dragSprite.y=LANE_BOTTOM_Y[2]-offsetHeight;
						lane=2;
					}
				}
			}else if(game.isMouseNewlyDown()&&rect.contains(mx,my)){
				hold=1;
				state.skillHold=1;
				game.addSprite(dragSprite);
				dragSprite.setCenterX(mx);
				dragSprite.setCenterY(my);
			}
		
		}
	};
}

function Carrot(state,x,lane){
	this.superClass=Unit;
	this.superClass(IMG["img/ui/trap_carrot.png"]);

	this.setLane(lane);
	this.logicalX=x-this.getWidth()/2;
	var targetX=this.logicalX+this.getWidth()/2;
	this.update=function(t){
		var i=0,h,rect;
		for(;i<state.hares.length;i++){
			h=state.hares[i];
			rect=h.getRectangle();
			if(!h.isBlack&&h.lane==this.lane&&h.action=="WALK"&&h.logicalX<=targetX&&h.logicalX+rect.width>targetX){
				h.eat();
				state.removeUnit(this);
				break;
			}
		}
	};
}

function Smoke(x,y,state){

	var radius=Math.random()*30+20,alpha=1,dalpha=.01*Math.random()+.01,r=Math.random()*80,angle=Math.random()*TWO_PI,
		sin=Math.sin(angle),cos=Math.cos(angle),
		rx=x+r*cos,ry=y+r*sin,dx=Math.random()*3*cos,dy=Math.random()*3*sin;
	
	this.draw=function(c){
		c.globalAlpha=alpha;
		drawCircle(c,rx-state.screenX,ry,radius,"#555555");
		c.globalAlpha=1;
	};
	this.update=function(t){
		radius=Math.max(0,radius-.5);
		alpha-=dalpha;
		rx+=dx;
		ry+=dy;
	};
	this.willDispose=function(t){
		return alpha<=0;
	};
}

function Bomb(state,x,lane){
	this.superClass=Unit;
	this.superClass(IMG["img/ui/trap_bomb.png"]);
	
	var text=new FredTextSprite("3"),timer=new TimedTriggerPoller(1000),thisBomb=this,time=3,
	left=x-200,right=x+200,smallLeft=left+100,smallRight=right-100,
	centerY=LANE_BOTTOM_Y[lane]-this.getHeight()/2;
	
	
	text.textAlign="center";
	text.textBaseline="middle";
	text.font="12px "+FONT;
	text.y=LANE_Y[lane]+58;

	this.superDraw=this.draw;
	this.draw=function(c){
		this.superDraw(c);
		text.x=x-state.screenX+1;
		text.draw(c);
	};
	

	timer.timedListener={
		trigger:function(){
			time--;
			text.text=""+time;

			if (time<1){
				state.removeUnit(thisBomb);
				var i=0,h,laneDiff,xDiff,currX=x-state.screenX,hCenter,rect,hares=state.hares.slice(),killed=[],score=0;
				
				for(;i<10;i++){
					state.addParticle(new Smoke(
					x,
					thisBomb.y+thisBomb.getHeight()/2,state));
				}
				
				for(i=0;i<hares.length;i++){
					h=hares[i];
					rect=h.getCollisionRectangle();
					hCenter=rect.x+rect.width/2;
					
					laneDiff=Math.abs(thisBomb.lane-h.lane);
					xDiff=Math.abs(currX-hCenter);
					
					if(laneDiff<1&&
					xDiff<150||
					laneDiff<2&&
					xDiff<75){
						h.kill();
						killed.push(h);
						score+=(h.isBlack?2:1);
						if(h.action!="DEAD")
							state.killed++;
					}
				}
				state.updateRabbitsLeft();
				score*=killed.length;
				if(killed.length)
				state.addParticle(new Blood2(x,centerY));
				state.addScore(score/*,thisBomb.x+thisBomb.getWidth()/2,thisBomb.y+thisBomb.getHeight()/2*/);
				
				play("sounds/firework-explosion-1.wav");
			}
		}
	};
	
	this.setLane(lane);
	this.logicalX=x-this.getWidth()/2;
	this.update=function(t){
		this.scaleY=this.scaleX=this.scaleX+.01;
		this.setCenterY(centerY);
		this.logicalX=x-this.getWidth()/2;
		timer.update(t);
	};
}

function BrutalKill(state,x,lane){
	this.superClass=Unit;
	this.superClass(IMG["img/ui/trap_brutalKill.png"]);

	this.setLane(lane);
	this.logicalX=x-this.getWidth()/2;
	var oy=this.y-5,py=5,dy=1;
	this.update=function(t){
		py+=dy;
		this.y=oy+py;
		if(Math.abs(py)>5)
			dy=-dy;
		var i=0,h,rect,currX=x-state.screenX;
		for(;i<state.hares.length;i++){
			h=state.hares[i];
			rect=h.getCollisionRectangle();
			if(h.lane===this.lane&&h.action!="DEAD"&&rect.x<=currX&&rect.x+rect.width>currX){
				h.kill2();
				state.removeUnit(this);
				break;
			}
		}
	};
}

function FredGameState(game){

	
	this.game=game;
	var thisState=this,bg=new Background(this),minimap,startX,unitArray=[],
	pauseButton=new Sprite(IMG["img/ui/btn_pause.png"]),exitButton=new Sprite(IMG["img/ui/btn_exit.png"]),
	bonusText=new FredTextSprite(""),
	playButton=new Sprite(IMG["img/ui/btn_play.png"]),
	updateExecutor=new MultiUpdateExecutor(),particleEngine=new ParticleEngine(game),
	winListener={
		update:function(){
			if(thisState.totalRabbits<=thisState.killed){
				thisState.removeUpdateable(this);
				game.addSprite(YOU_WIN_SPRITE);
				thisState.isWin=1;
				var bonus=(thisState.carrotSkill.count+
							thisState.bombSkill.count+
							thisState.brutalKillSkill.count);
				bonusText.text="unused skills bonus: +"+bonus;
				thisState.addScore(bonus);
				game.addSprite(bonusText);
				play("sounds/sigh-1.wav");
			}
		}
	},
	startCountDown,startTimer=new TimedTriggerPoller(1000);
	rabbitsLeft=new FredTextSprite("");
	pauseButton.x=2;
	pauseButton.y=2;
	exitButton.x=WIDTH-exitButton.getWidth()-2;
	exitButton.y=2;
	
	bonusText.x=WIDTH/2;
	bonusText.y=YOU_WIN_SPRITE.y+YOU_WIN_SPRITE.getHeight()-40;
	bonusText.textAlign="center";
	bonusText.color="black";
	bonusText.font="bold 12px "+FONT;
	
	playButton.x=(WIDTH-playButton.getWidth())/2;
	playButton.y=(HEIGHT-playButton.getHeight())/2;
	
	startTimer.timedListener={
		trigger:function(){
			startCountDown--;
			TEXT.text=""+startCountDown;
			if(!startCountDown){
				TEXT.text="RAWR!!!";
				

				
				thisState.initLevel();
				thisState.addUpdateable(winListener);
				thisState.killed=0;
				thisState.totalRabbits=0;
				for(var i=0;i<thisState.hares.length;i++){
					if(thisState.hares[i].action!="DEAD")
						thisState.totalRabbits++;
				}
				var s=new Sprite(IMG["img/ui/bar_bunniesLeft.png"]);
				s.y=HEIGHT-s.getHeight()-30;
				game.addSprite(s);

				game.addSprite(rabbitsLeft);
				thisState.updateRabbitsLeft();
			}else if(startCountDown<0){
				thisState.removeUpdateable(this);
				game.removeSprite(TEXT);
				game.removeSprite(TEXT_BOX);
			}
		}
	};
	
	rabbitsLeft.x=95;
	rabbitsLeft.y=HEIGHT-55;
	
	this.end=2000;
	this.carrotSkill=new SkillMenuItem(IMG["img/ui/carrot/btn_carrot.png"],IMG["img/ui/trap_carrot.png"],this,3000,BUTTON_CARROT_COOLDOWN_IMG);
	this.bombSkill=new SkillMenuItem(IMG["img/ui/bomb/btn_bomb.png"],IMG["img/ui/trap_bomb.png"],this,5000,BUTTON_BOMB_COOLDOWN_IMG);
	this.brutalKillSkill=new SkillMenuItem(IMG["img/ui/brutalKill/btn_brutalKill.png"],IMG["img/ui/trap_brutalKill.png"],this,5000,BUTTON_BRUTAL_KILL_COOLDOWN_IMG);

	this.carrotSkill.ondrop=function(x,lane){
		thisState.addUnit(new Carrot(thisState,x,lane));
	};
	this.bombSkill.ondrop=function(x,lane){
		thisState.addUnit(new Bomb(thisState,x,lane));
	};
	this.brutalKillSkill.ondrop=function(x,lane){
		thisState.addUnit(new BrutalKill(thisState,x,lane));
	};

	this.carrotSkill.y=5;
	this.bombSkill.y=5;
	this.brutalKillSkill.y=5
	this.carrotSkill.x=50;
	this.carrotSkill.initRect();
	this.bombSkill.x=120;
	this.bombSkill.initRect();
	this.brutalKillSkill.x=190;
	this.brutalKillSkill.initRect();

	this.hares=[];

	this.addSkill=function(skill,n){
		this.addUpdateableSprite(skill);
		game.addSprite(skill.countText);
		skill.count=n;
		skill.countText.text=""+n;
		skill.cooldownTimer.initTimer();
		skill.isCooldown=0;
		skill.setImage(skill.defaultImg);
	};
	
	this.addParticle=function(p){
		particleEngine.add(p);
	};
	
	this.addUnit=function(u){
		unitArray.push(u);
		this.addUpdateableSprite(u);
	};
	
	this.removeUnit=function(u){
		this.removeUpdateableSprite(u);
		arrayRemove(unitArray,u);
	};
	
	this.addHare=function(h){
		this.addUnit(h);
		h.minimapUnit=h.getMinimapUnit(minimap);
		game.addSprite(h.minimapUnit);
		this.hares.push(h);
	};
	
	this.updateRabbitsLeft=function(){
		rabbitsLeft.text=""+(this.totalRabbits-this.killed);
	};
	
	this.removeHare=function(h){
		this.removeUnit(h);
		game.removeSprite(h.minimapUnit);
		arrayRemove(this.hares,h);
	};

	this.addHares=function(hares){
		hares.sort(function(a,b){
			return a.lane-b.lane;
		});
		
		for(var i=0;i<hares.length;i++)
			this.addHare(hares[i]);
	};

	this.addScore=function(s,x,y){
		if(!this.isGameOver){
			setScore(score+s);
			if(x&&y)
			this.addParticle(new PopupText("+"+s,x,y));
		}
	};
	
	
	this.load=function(){
		game.addSprite(BORDER);
		game.addSprite(bg);
		game.addSprite(pauseButton);
		game.addSprite(MUTE_BUTTON);
		var /*s=new Sprite(IMG["img/ui/bar_lvl.png"]);
		s.x=WIDTH-s.getWidth();
		s.y=HEIGHT-s.getHeight()-30;
		game.addSprite(s);*/

		s=new Sprite(IMG["img/ui/bar_score.png"]);
		s.x=WIDTH-s.getWidth();
		s.y=HEIGHT-s.getHeight()-30;
		game.addSprite(s);

		//game.addSprite(LEVEL_TEXT);
		
		//LEVEL_TEXT.text=""+(currentLevel+1);
		minimap=new Minimap(this);
		game.addSprite(minimap);
		this.hares=[];
		unitArray=[];

		this.beforeGameStart();

		this.skillHold=0;
		startX=game.getMouseX();
		updateExecutor.add(particleEngine);
		
		this.isGameOver=0;
		this.isWin=0;
		this.screenX=0;
		this.isPause=0;
		
		SCORE_TEXT.text=""+score;
		game.addSprite(SCORE_TEXT);
	
	};
	
	this.start=function(){
		TEXT.text="Rabbits are arriving in";
		startCountDown=4;
		game.addSprite(TEXT_BOX);
		game.addSprite(TEXT);
		this.addUpdateable(startTimer);
	};
	
	this.beforeGameStart=this.start;
	this.addUpdateable=function(u){
		updateExecutor.add(u);
	};
	this.removeUpdateable=function(u){
		updateExecutor.remove(u);
	};
	
	this.addUpdateableSprite=function(s){
		updateExecutor.add(s);
		game.addSprite(s);
	};
	
	this.removeUpdateableSprite=function(s){
		updateExecutor.remove(s);
		game.removeSprite(s);
	};
	
	this.setScreenX=function(x){
		this.screenX=Math.min(this.end-WIDTH,Math.max(0,x));
	};
	
	this.update=function(t){

		if(game.isMouseNewlyDown()){
			if(pauseButton.getRectangle().contains(game.getMouseX(),game.getMouseY())){
				this.isPause=!this.isPause;
				if(this.isPause){
					game.addSprite(GRAY_SCREEN);
					game.addSprite(exitButton);
					game.addSprite(playButton);
				}else{
					game.removeSprite(GRAY_SCREEN);
					game.removeSprite(exitButton);
					game.removeSprite(playButton);
				}
			}else if(MUTE_BUTTON.getRectangle().contains(game.getMouseX(),game.getMouseY())){
				MUTE_BUTTON.toggle();
			}
		}

		if(this.isPause){
			if(game.isMouseNewlyDown()){
				if(exitButton.getRectangle().contains(game.getMouseX(),game.getMouseY())){
					game.setState(MENU_STATE);
				}else if(playButton.getRectangle().contains(game.getMouseX(),game.getMouseY())){
					this.isPause=0;
					game.removeSprite(GRAY_SCREEN);
					game.removeSprite(exitButton);
					game.removeSprite(playButton);
				}
			}
		}else{
	
			updateExecutor.update(game.delay);

		}
	
		if(game.isMouseDown()&&minimap.getRectangle().contains(game.getMouseX(),game.getMouseY())){
			this.setScreenX(minimap.getScreenX(game.getMouseX())-WIDTH/2);
		}else if(!this.skillHold){
			if(game.isMouseNewlyDown()){
				startX=game.getMouseX();
			}else if(game.isMouseDown()){
				this.screenX+=-game.getMouseX()+startX;
				this.setScreenX(this.screenX);
				startX=game.getMouseX();
			}
		}

		var i=0;
		for(;i<unitArray.length;i++){
			unitArray[i].x=unitArray[i].logicalX-this.screenX;
		}
		
		if(this.isWin&&game.isMouseNewlyDown()){
			currentLevel++;
			if(currentLevel<MAX_LEVEL){
				game.setState(LEVEL[currentLevel]);
			}else{
				if(TOP_10.length<10||TOP_10[9]<score)
					addTopScore(score);

				game.setState(CREDITS_STATE);
			}
		}else if(this.isGameOver&&game.isMouseNewlyDown()){
			game.setState(HIGH_SCORE_STATE);
		}


	};
	
	this.unload=function(){
		updateExecutor.clear();
		particleEngine.clear();
		game.removeAllSprites();
		this.hares=[];
		unitArray=[];
	};
	this.gameOver=function(){
		if(TOP_10.length<10||TOP_10[9]<score)
			addTopScore(score);

		this.isGameOver=1;
		game.addSprite(GAME_OVER_SPRITE);

	};
}


function generateRabbits(state,n,minLane,
		minSpeed,speedLen,minDistance,distanceLen,blackRatio){
	blackRatio=blackRatio?blackRatio:0;
	var array=[],laneArray=[],i=0,x=-100,
	laneLen=3-minLane+1,
	lane,laneCount;
	function move(){
		x-=minDistance+Math.random()*distanceLen;
		laneArray=[];
		laneCount=Math.floor(Math.random()*laneLen+minLane);
	}
	move();
	for(;i<n;i++){
		while(laneArray.length==laneCount){
			move();
		}
		lane=Math.floor(Math.random()*3);
		while(arrayContains(laneArray,lane))
			lane=(lane+1)%3;
		array.push(new Hare(state,minSpeed+Math.random()*speedLen,x,lane,Math.random()<blackRatio?1:0));
		laneArray.push(lane);
	}
	return array;
}


function Level0(game){
	this.superClass=FredGameState;
	this.superClass(game);

	this.end=600;
	var thisState=this,textTimer=new TimedTriggerPoller(2000),
	tutorial2Listener={
		update:function(){
			if(thisState.hares.length<1){
				thisState.removeUpdateable(this);
				thisState.removeUpdateableSprite(TUTORIAL_TEXT);
				game.removeSprite(TEXT_BOX);
				thisState.start();
			}
		}
	},
	
	tutorialScoreListener={update:function(){
		if(thisState.hares.length<1){
			thisState.removeUpdateable(this);
			TUTORIAL_TEXT.setText("Tap the rabbits to slow them down.");
			thisState.addUpdateable(tutorial2Listener);
			for(var i=0,hare;i<3;i++) {
				thisState.addHare(new Hare(thisState,2,-100,i));
			}
		}

	
	}};


	
	this.beforeGameStart=function(){

		this.addSkill(this.carrotSkill,20);

		game.addSprite(TEXT_BOX);
		TUTORIAL_TEXT.setText("Don't let the rabbits reach the \"other side\".");
		TUTORIAL_TEXT.oncomplete=function(){
			thisState.addUpdateable(textTimer);
		};

		textTimer.timedListener={
			trigger:function(){

				thisState.addHare(new Hare(thisState,2,-100,1));

				TUTORIAL_TEXT.oncomplete=null;
				thisState.removeUpdateable(textTimer);
				TUTORIAL_TEXT.setText("Drag the carrot to the rabbit.");
				
				thisState.addUpdateable(tutorialScoreListener);
			}
		};
		
		
		this.addUpdateableSprite(TUTORIAL_TEXT);
	};
	
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;

		array.push(new Hare(thisState,2,-100,1));
		array.push(new Hare(thisState,2,-250,1));
		array.push(new Hare(thisState,2,-250,2));
		array.push(new Hare(thisState,2,-400,0));
		array.push(new Hare(thisState,2,-400,2));
		array.push(new Hare(thisState,2,-500,0));
		array.push(new Hare(thisState,2,-500,1));
		array.push(new Hare(thisState,2,-600,0));
		array.push(new Hare(thisState,2,-600,1));
		array.push(new Hare(thisState,2,-600,2));
		
		this.addHares(array);
	};
}



function Level1(game){
	this.superClass=FredGameState;
	this.superClass(game);
	this.end=700;
	var thisState=this;
	this.beforeGameStart=function(){
		this.addSkill(this.carrotSkill,12);
		this.start();
	};
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;

		array=generateRabbits(this,10,//rabbit count
		1,//lane count min
		3,0,//speed min len
		150,50//distance min len
		);

		this.addHares(array);
	};
}
function Level2(game){
	this.superClass=FredGameState;
	this.superClass(game);
	this.end=800;

	var thisState=this,textTimer=new TimedTriggerPoller(2000),
	
	tutorialScoreListener={update:function(){
		if(thisState.hares.length<1){
			thisState.removeUpdateable(this);
			thisState.removeUpdateableSprite(TUTORIAL_TEXT);
			game.removeSprite(TEXT_BOX);
			thisState.start();
		}
	}};
	this.beforeGameStart=function(){

		this.addSkill(this.carrotSkill,7);
		this.addSkill(this.bombSkill,7);


		game.addSprite(TEXT_BOX);
		TUTORIAL_TEXT.setText("You have unlocked the bomb.");

		TUTORIAL_TEXT.oncomplete=function(){
			thisState.addUpdateable(textTimer);
		};
		
		
		textTimer.timedListener={
			trigger:function(){
				thisState.addHare(new Hare(thisState,2,-150,0));
				thisState.addHare(new Hare(thisState,2,-150,2));
				
				thisState.addHare(new Hare(thisState,2,-100,1));
				thisState.addHare(new Hare(thisState,2,-150,1));
				thisState.addHare(new Hare(thisState,2,-200,1));

				TUTORIAL_TEXT.oncomplete=null;
				thisState.removeUpdateable(textTimer);
				TUTORIAL_TEXT.setText("Bombs explodes in 3 seconds.");
				
				thisState.addUpdateable(tutorialScoreListener);

			}
		};
		this.addUpdateableSprite(TUTORIAL_TEXT);
	};
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;

		array=generateRabbits(this,15,//rabbit count
		2,//lane count min
		3,0,//speed min len
		100,0//distance min len
		);

		this.addHares(array);
	};
}

function Level3(game){
	this.superClass=FredGameState;
	this.superClass(game);
	this.end=1000;
	var thisState=this;
	this.beforeGameStart=function(){
		this.addSkill(this.carrotSkill,3);
		this.addSkill(this.bombSkill,4);
		this.start();
	};
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;
		array=generateRabbits(this,15,//rabbit count
		2,//lane count min
		3,1,//speed min len
		100,50//distance min len
		);
		this.addHares(array);
	};
}


function Level4(game){
	this.superClass=FredGameState;
	this.superClass(game);

	this.end=1200;
	var thisState=this,textTimer=new TimedTriggerPoller(2000),

	tutorialScoreListener={update:function(){
		if(!thisState.hares.length||thisState.hares[0].action==="DEAD"){
			thisState.removeUpdateableSprite(TUTORIAL_TEXT);
			game.removeSprite(TEXT_BOX);
			thisState.removeUpdateable(this);
			thisState.start();
		}

	
	}};


	
	this.beforeGameStart=function(){

		this.addSkill(this.carrotSkill,10);
		this.addSkill(this.bombSkill,3);
		this.addSkill(this.brutalKillSkill,6);
		
		game.addSprite(TEXT_BOX);
		TUTORIAL_TEXT.setText("Black rabbits don't eat carrots.");
		TUTORIAL_TEXT.oncomplete=function(){
			thisState.addUpdateable(textTimer);
		};

		textTimer.timedListener={
			trigger:function(){

				thisState.addHare(new Hare(thisState,3,-100,1,1));

				TUTORIAL_TEXT.oncomplete=null;
				thisState.removeUpdateable(textTimer);
				TUTORIAL_TEXT.setText("Use the secret weapon.");
				
				thisState.addUpdateable(tutorialScoreListener);
			}
		};
		
		
		this.addUpdateableSprite(TUTORIAL_TEXT);
	};
	
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;

		array=generateRabbits(this,20,//rabbit count
		1,//lane count min
		3,1,//speed min len
		100,50,//distance min len
		.3);
		
		this.addHares(array);
	};
}

function Level5(game){
	this.superClass=FredGameState;
	this.superClass(game);
	this.end=1200;
	var thisState=this;
	this.beforeGameStart=function(){
		this.addSkill(this.carrotSkill,10);
		this.addSkill(this.bombSkill,3);
		this.addSkill(this.brutalKillSkill,8);
		this.start();
	};
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;
		array=generateRabbits(this,25,//rabbit count
		2,//lane count min
		3,1,//speed min len
		100,50,//distance min len
		.5);
		this.addHares(array);
	};
}


function Level6(game){
	this.superClass=FredGameState;
	this.superClass(game);

	this.end=1500;
	var thisState=this,textTimer=new TimedTriggerPoller(2000);


	
	this.beforeGameStart=function(){

		this.addSkill(this.carrotSkill,10);
		this.addSkill(this.bombSkill,5);
		this.addSkill(this.brutalKillSkill,10);
		
		game.addSprite(TEXT_BOX);
		TUTORIAL_TEXT.setText("Final Level");
		TUTORIAL_TEXT.oncomplete=function(){
			thisState.addUpdateable(textTimer);
		};

		textTimer.timedListener={
			trigger:function(){
				game.removeSprite(TEXT_BOX);
				thisState.removeUpdateableSprite(TUTORIAL_TEXT);
				thisState.removeUpdateable(textTimer);
				TUTORIAL_TEXT.oncomplete=null;
				thisState.start();
			}
		};
		
		
		this.addUpdateableSprite(TUTORIAL_TEXT);
	};
	
	
	this.initLevel=function(){
		var array=[],x=-100,hare,i=0;

		array=generateRabbits(this,30,//rabbit count
		2,//lane count min
		3,1,//speed min len
		100,50,//distance min len
		.5);
		
		this.addHares(array);
	};
}

var canvas=document.getElementById("canvas"),
imgURLs=["img/ui/title.png","img/ui/btn_play.png","img/ui/btn_highscore.png","img/ui/btn_credits.png",
"img/ui/credits.png",
"img/ui/btn_soundOff.png","img/ui/btn_soundOn.png",
BG_URL,
"img/ui/marker_enemy.png","img/ui/blood2.png",
"img/ui/pane_gameover.png","img/ui/pane_youwin.png",
"img/ui/menu_highScore.png",
"img/ui/btn_pause.png","img/ui/btn_exit.png",
"img/ui/bar.png","img/ui/bar_score.png",
"img/ui/bar_bunniesLeft.png",
"img/spilgames_splash_screen_for_HTML5.jpg",
//"img/ui/bar_lvl.png",
"img/ui/carrot/btn_carrot.png","img/ui/brutalKill/btn_brutalKill.png","img/ui/bomb/btn_bomb.png",
"img/ui/trap_carrot.png","img/ui/trap_brutalKill.png","img/ui/trap_bomb.png"],
game=new Game(canvas);
















for(i=0;i<12;i++){
	imgURLs.push(
	(i<10?HARE_DEAD_URL+"0"+i:HARE_DEAD_URL+i)+".png"
	);
	imgURLs.push(
	(i<10?BLACK_HARE_DEAD_URL+"0"+i:BLACK_HARE_DEAD_URL+i)+".png"
	);
}
for(i=0;i<8;i++){
	imgURLs.push(HARE_WALK_URL+i+".png");
	imgURLs.push(BLACK_HARE_WALK_URL+i+".png");
	imgURLs.push(HARE_DIZZY_URL+i+".png");
	imgURLs.push(BUTTON_CARROT_COOLDOWN_URL+i+".png");
	imgURLs.push(BUTTON_BOMB_COOLDOWN_URL+i+".png");
	imgURLs.push(BUTTON_BRUTAL_KILL_COOLDOWN_URL+i+".png");
}
for(i=0;i<6;i++){
	imgURLs.push(HARE_JUMP_URL+i+".png");
	imgURLs.push(HARE_PICK_URL+i+".png");
}
for(i=0;i<10;i++){
	imgURLs.push(HARE_EAT_URL+i+".png");
}





canvas.width=WIDTH;
canvas.height=HEIGHT;
game.delay=100;


game.setState(new LoadingState(game));
game.start();



loadImages(imgURLs,

function(data){
	IMG=data;
	for(i=0;i<8;i++){
		HARE_WALK_IMG.push(IMG[HARE_WALK_URL+i+".png"]);
		BLACK_HARE_WALK_IMG.push(IMG[BLACK_HARE_WALK_URL+i+".png"]);
		HARE_DIZZY_IMG.push(IMG[HARE_DIZZY_URL+i+".png"]);
		BUTTON_CARROT_COOLDOWN_IMG.push(IMG[BUTTON_CARROT_COOLDOWN_URL+i+".png"]);
		BUTTON_BOMB_COOLDOWN_IMG.push(IMG[BUTTON_BOMB_COOLDOWN_URL+i+".png"]);
		BUTTON_BRUTAL_KILL_COOLDOWN_IMG.push(IMG[BUTTON_BRUTAL_KILL_COOLDOWN_URL+i+".png"]);
	}
	for(i=0;i<6;i++){
		HARE_JUMP_IMG.push(IMG[HARE_JUMP_URL+i+".png"]);
		HARE_PICK_IMG.push(IMG[HARE_PICK_URL+i+".png"]);
	}
	for(i=0;i<10;i++){
		HARE_EAT_IMG.push(IMG[HARE_EAT_URL+i+".png"]);
	}
	
	for(i=0;i<12;i++){
		HARE_DEAD_IMG.push(IMG[
		(i<10?HARE_DEAD_URL+"0"+i:HARE_DEAD_URL+i)+".png"
		]);
		BLACK_HARE_DEAD_IMG.push(IMG[
		(i<10?BLACK_HARE_DEAD_URL+"0"+i:BLACK_HARE_DEAD_URL+i)+".png"
		]);
	}
	
	
	GAME_OVER_SPRITE=new Sprite(IMG["img/ui/pane_gameover.png"]);
	GAME_OVER_SPRITE.x=(WIDTH-GAME_OVER_SPRITE.getWidth())/2;
	GAME_OVER_SPRITE.y=(HEIGHT-GAME_OVER_SPRITE.getHeight())/2;
	YOU_WIN_SPRITE=new Sprite(IMG["img/ui/pane_youwin.png"]);
	YOU_WIN_SPRITE.x=(WIDTH-YOU_WIN_SPRITE.getWidth())/2;
	YOU_WIN_SPRITE.y=(HEIGHT-YOU_WIN_SPRITE.getHeight())/2;
	MUTE_BUTTON=new MuteButton();
	
	LEVEL[0]=new Level0(game);
	LEVEL[1]=new Level1(game);
	LEVEL[2]=new Level2(game);
	LEVEL[3]=new Level3(game);
	LEVEL[4]=new Level4(game);
	LEVEL[5]=new Level5(game);
	LEVEL[6]=new Level6(game);
	

	

	MENU_STATE=new MenuState(game);
	GAME_STATE=new FredGameState(game);
	HIGH_SCORE_STATE=new HighScoreState(game);
	SCREEN_CREDITS_STATE=new ScreenCreditsState(game);
	CREDITS_STATE=new CreditsState(game);
	
	game.setState(new SplashScreenState(game));
	//game.setState(MENU_STATE);
});

};