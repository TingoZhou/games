var chainrxn = false;
Ball = new Class({
  number: 0,
  xposition: 0,
  yposition: 0,
  downspeed:0,
  rightspeed:0,
  color:"#fff",
  radius:0,
  expanding:0,
  sizeChangeCount:0,
  disabled:false,
  expanded:false,
  chainlevel:0,
  isBonus:false,
  isDoNotExplode: false,
  bonus:0,
  expandedLifeLength: 0,

  initialize: function(gameLevel, number, xposition, yposition, bonus){
    this.number = number;
    this.gameLevel = gameLevel;
    this.radius = this.gameLevel.ballSize;
    this.expandedLifeLength = Math.random()*(this.gameLevel.maxExpandedLifeLength-this.gameLevel.minExpandedLifeLength)+this.gameLevel.minExpandedLifeLength;
    if(xposition == null){
      //random placement
      this.xposition = (this.gameLevel.xmax-2*this.gameLevel.ballSize)*Math.random()+this.gameLevel.ballSize;
      this.yposition = (this.gameLevel.ymax-2*this.gameLevel.ballSize)*Math.random()+this.gameLevel.ballSize;
      var direction = Math.random()*360; //random direction
      var ballSpeed = Math.random()*(this.gameLevel.maxBallSpeed-this.gameLevel.minBallSpeed)+this.gameLevel.minBallSpeed; //random speed
      this.downspeed = Math.cos(direction)*ballSpeed;
      this.rightspeed = Math.sin(direction)*ballSpeed;
      if(bonus == null){
        this.color = "rgb("+Math.round(255*Math.random())+", "+Math.round(255*Math.random())+", "+Math.round(255*Math.random())+")"; //random color
      }else{//bonus or don't explode ball
        if(bonus == -1){ //do not explode - negative bonus
          this.isDoNotExplode = true;
          this.color="rgb(0,0,0)";
          this.bonus = this.gameLevel.badBonusStart;
        }else{//bonus ball
          this.isBonus = true;
          this.color="rgb(255,255,255)";
          this.bonus = this.gameLevel.goodBonusStart;
        }
      }
    }else{//starter ball
      this.xposition = xposition;
      this.yposition = yposition;
      this.color = "rgb(150,150,150)";
      this.startExpansion();
    }
    this.gameLevel.movingBalls.push(this);
    this.draw();
  },
  move: function(){
    this.xposition += this.rightspeed;
    this.yposition += this.downspeed;
    this.draw();
    //check for hitting expanded balls
    var notHit = true;
    this.gameLevel.expandedBalls.each(function(expandedBall){
      if(notHit && this.gameLevel.movingBalls[expandedBall].expanded == true && Math.sqrt(Math.pow(this.gameLevel.movingBalls[expandedBall].xposition-this.xposition, 2)+Math.pow(this.gameLevel.movingBalls[expandedBall].yposition-this.yposition, 2)) <= this.radius+this.gameLevel.movingBalls[expandedBall].radius){
        //collision
        this.chainlevel = this.gameLevel.movingBalls[expandedBall].chainlevel+1;
        this.startExpansion();
        if(this.gameLevel.totalBallsExpanded == this.gameLevel.numBalls){
          this.gameLevel.doClearFieldBonus();
        }
        notHit = false;
      }
    }.bind(this))

    if(notHit){
      //check for edge-hitting
      if(this.xposition <= this.gameLevel.ballSize || this.xposition >= this.gameLevel.xmax-this.gameLevel.ballSize){
        this.rightspeed = -1*this.rightspeed;
      }
      if(this.yposition <= this.gameLevel.ballSize || this.yposition >= this.gameLevel.ymax-this.gameLevel.ballSize){
        this.downspeed = -1*this.downspeed;
      }
    }
    
    //update bonuses
    if(this.isBonus && this.gameLevel.bonusCounter == 0){
      this.bonus = this.bonus*this.gameLevel.bonusFactor;
    }else if(this.isDoNotExplode && this.gameLevel.doNotExplodeCounter == 0 && this.bonus <= this.gameLevel.maxDoNotExplodePoints){
      this.bonus+= this.gameLevel.doNotExplodeIncrement;
    }
  },
  startExpansion: function(){
    this.expanded = true;
    this.gameLevel.expandedBalls.push(this.number);
    this.gameLevel.totalBallsExpanded++;
    if(this.isBonus || this.isDoNotExplode){
      var newPoints = this.bonus;
    }else{
      var newPoints = 100*Math.pow(this.chainlevel, 3);
    }
    this.gameLevel.score += newPoints;
    this.expandedBallSize = Math.random()*(this.gameLevel.maxExpandedBallSize-this.gameLevel.minExpandedBallSize)+this.gameLevel.minExpandedBallSize;

    this.gameLevel.chainrxn.ballsExpandedEl.set("text", this.gameLevel.totalBallsExpanded+" 个点被捕获");
    this.gameLevel.chainrxn.levelScoreEl.set("text", "本关分数: "+this.gameLevel.score);
    this.gameLevel.chainrxn.totalScoreEl.set("text", "总数: "+(this.gameLevel.score+this.gameLevel.chainrxn.score));
    this.downspeed = 0;
    this.rightspeed = 0;
    this.expanding = 1;
    if(this.gameLevel.totalBallsExpanded >= this.gameLevel.ballWinCount && document.body.getStyle("background") != "#333"){
      this.gameLevel.showWinBG();
    }
    (function(){ //death
      this.expanding = -1; //shrinking
      this.sizeChangeCount = this.gameLevel.shrinkingIntervals;
    }).delay(this.expandedLifeLength, this);
    if(this.number == this.gameLevel.numBalls){//starterBall has this number, so it won't do a pointbox for it
      return;
    }
    var coordinates = this.gameLevel.chainrxn.ballField.getCoordinates();
    if(newPoints > 0){newPoints = "+"+newPoints;}
    var pointBox = new Element("div",{"text":newPoints}).inject(document.body);
    pointBox.addClass("points");
    pointBox.setStyles({
      "position":"absolute",
      "top":(this.yposition+coordinates.top-this.gameLevel.pointPopupHeight/2),
      "left":(this.xposition+coordinates.left-this.gameLevel.pointPopupWidth/2)
    });
    (function(){
      pointBox.destroy();
    }).delay(this.expandedLifeLength, this);
  },
  expand:function(){
    this.radius = Math.round(this.sizeChangeCount*(this.expandedBallSize-this.gameLevel.ballSize)/this.gameLevel.expandingIntervals+this.gameLevel.ballSize);
    this.draw();
    this.sizeChangeCount++;
    if(this.gameLevel.expandingIntervals < this.sizeChangeCount){
      this.sizeChangeCount = 0;
      this.expanding = 0;
    }
  },
  shrink: function(){
    this.radius = Math.round(this.sizeChangeCount*(this.expandedBallSize)/this.gameLevel.shrinkingIntervals);
    this.draw();
    if(this.sizeChangeCount == 0){
      this.expanded = false;
      this.expanding = 0;
      this.gameLevel.expandedBalls.erase(this.number);
      this.disabled = true;
    }
    this.sizeChangeCount--;
  },
  maintain: function(){
    if(this.expanding == 1){
      this.expand();
    }else if(this.expanding == -1){
      this.shrink();
    }else if(this.expanded == true){
      this.draw();
    }else if(this.disabled == false){
      this.move();
    }
  },
  draw: function(){
    this.gameLevel.canvas.beginPath();
    this.gameLevel.canvas.fillStyle = this.color;
    this.gameLevel.canvas.moveTo(this.xposition, this.yposition);
    this.gameLevel.canvas.arc(this.xposition, this.yposition, this.radius, 0, Math.PI*2, true);
    this.gameLevel.canvas.closePath();
    this.gameLevel.canvas.fill();
  }
})

var StarterBall = new Class({
  element:false,
  xposition:false,
  yposition:false,
  gameLevel: false,
  initialize:function(gameLevel){
    this.gameLevel = gameLevel;
    var coordinates = this.gameLevel.chainrxn.ballField.getCoordinates();
    var dimensions = this.gameLevel.chainrxn.ballField.getSize();
    this.element = new Element("div", {"id":"starterBall"}).inject(document.body);
    this.xposition = coordinates.left+dimensions.x/2;
    this.yposition = coordinates.top+dimensions.y/2;
    this.move();
  },
  checkBounds: function(){
    var coordinates = this.gameLevel.chainrxn.ballField.getCoordinates();
    var max_y = this.gameLevel.ymax+coordinates.top;
    var max_x = this.gameLevel.xmax+coordinates.left;
    if(this.xposition > max_x){
      this.xposition = max_x;
    }else if(this.xposition < coordinates.left){
      this.xposition = coordinates.left;
    }
    if(this.yposition > max_y){
      this.yposition = max_y;
    }else if(this.yposition < coordinates.top){
      this.yposition = coordinates.top;
    }
  },
  move: function(){
    this.checkBounds();
    this.element.setStyles({"top":this.yposition-this.gameLevel.starterBallSize,"left":this.xposition-this.gameLevel.starterBallSize})
  },
  place: function(e){
		if(e.pageX){
			this.xposition = e.pageX;
			this.yposition = e.pageY;
		}else{
			this.xposition = e.page.x;
			this.yposition = e.page.y;
		}
    this.checkBounds();
    var coordinates = this.gameLevel.chainrxn.ballField.getCoordinates();
    new Ball(this.gameLevel, this.gameLevel.numBalls, this.xposition-coordinates.left, this.yposition-coordinates.top);
    this.element.removeClass("starterBall");
    this.element.destroy();
    $$("body")[0].removeEvents("mousemove");
    $$("body")[0].removeEvents("click");
  }
})

var GameLevel = new Class({
  ballSize:9,
  minExpandedBallSize:20,
  maxExpandedBallSize:60,
  minBallSpeed:1,
  maxBallSpeed:5,
  numBalls: 5,
  ballWinCount:4,
  checkInterval:30,
  bonusSpeed: 600, //keep this a multiple of checkInterval, it's how often bonus ball point values are updated
  doNotExplodeSpeed: 30, //this too, see above, but for do not explode balls
  expandDelay:300,
  shrinkDelay: 150,
  minExpandedLifeLength: 1000,
  maxExpandedLifeLength:6000,
  starterBallSize: 92,
  badBonusStart:-5000,
  doNotExplodeIncrement: 30, //how much that start gets incremented by
  goodBonusStart: 100,
  bonusFactor: 2, //how much to multiply bonuses by each time it grows
  maxDoNotExplodePoints: -100, //max points that will be awarded for a Do Not Explode ball.... generally this should be negative so they are deducted instead of added.
  clearFieldBonusMultiplier: 20000, //gets multiplied by level number for a bonus for clearing the field

  //Make sure the following 6 match the css for the canvas, points class and clearFieldBox
  xmax:800,//x counts from left, y from top
  ymax:600,
  pointPopupHeight:20,
  pointPopupWidth:50,
  clearFieldBoxHeight:80,
  clearFieldBoxWidth:300,
  
  //shouldn't need to change these
  chainrxn: false,
  ballField:false,
  expandedBalls: [],
  movingBalls: [],
  repeater: false,
  totalBallsExpanded: -1,
  score:0,
  expandingIntervals:0,
  canvas:false,
  bonusMaxCounter: 0,
  doNotExplodeMaxCounter: 0,
  bonusCounter: -1, //set to -1 so it can be caught, so bonuses don't get increased while a ball has not been placed
  doNotExplodeCounter: -1,
  numExpandedBallsBonusDone: false,

  initialize: function(ballDetails, chainrxn){
    this.chainrxn = chainrxn;
    this.chainrxn.ballField.setStyle("background-color","#1F1F1F");
    this.bonusMaxCounter = this.bonusSpeed/this.checkInterval;
    this.doNotExplodeMaxCounter = this.doNotExplodeSpeed/this.checkInterval;
    if(this.chainrxn.ballField.getContext){
      this.canvas = this.chainrxn.ballField.getContext("2d");
    }else{
      return alert("Your browser does not appear to support canvas, and our attempts to emulate it have failed.");
    }
    this.chainrxn.ballField.set({"height":this.ymax, "width":this.xmax});
    this.canvas.globalAlpha = 0.7;
    this.numBalls = ballDetails[1];
    this.ballWinCount = ballDetails[0];
    this.expandingIntervals = Math.round(this.expandDelay/this.checkInterval); //how many intervals for ball expansion
    this.shrinkingIntervals = Math.round(this.shrinkDelay/this.checkInterval); //intervals for shrinking

    for(var i = 0; i < this.numBalls; i++){ //starter ball is 0, the rest are numbered here
      var chance = Math.round(Math.random()*this.numBalls*2);
      if(chance <= 1){
        new Ball(this, i, null, null, 1); //make it a bonusBall
      }else if(chance <= 2){ //will be between 1 and 2
        new Ball(this, i, null, null, -1); //make it a do not explode ball
      }else{
        new Ball(this, i);
      }
    }

    starterBall = new StarterBall(this);
    this.repeater = function(){
      this.canvas.clearRect(0,0,this.xmax+this.ballSize,this.ymax+this.ballSize);
      if($chk(starterBall)){
        starterBall.move();
      }else{
        //update counters
        if(this.bonusCounter >= this.bonusMaxCounter){
          this.bonusCounter = 0;
        }else{
          this.bonusCounter++;
        }
        if(this.doNotExplodeCounter >= this.doNotExplodeMaxCounter){
          this.doNotExplodeCounter = 0;
        }else{
          this.doNotExplodeCounter++;
        }
        
        //check for completion
        if(this.expandedBalls.length == 0){
          if(this.totalBallsExpanded < this.ballWinCount){
            this.doLoser();
          }else{
            this.doWinner();
          }
        }
      }
      
      //do ball stuff
      this.movingBalls.each(function(ball, index){
        ball.maintain();
      }.bind(this))
    }.bind(this).periodical(this.checkInterval)

		$$("body")[0].addEvent("mousemove", function (e) {
			starterBall.xposition = e.page.x;
			starterBall.yposition = e.page.y;
		}.bind(this))
		
		$$("body")[0].addEvent("touchmove", function(event){
			var touch = event.changedTouches[0];
			starterBall.xposition = touch.pageX;
			starterBall.yposition = touch.pageY;
		}.bind(this))	
			
		$$("body")[0].addEvent("click", function (e) {
			if(e.target.id != "notifierButton") {
				if(e.changedTouches){
					e = e.changedTouches[0];	
				}
				starterBall.place(e);
				starterBall = null;
				this.chainrxn.levelNumberEl.set("text", "第 " + (this.chainrxn.levelNumber + 1) + " 关");
			}
		}.bind(this))
  },
  
  doClearFieldBonus: function(){
    var bonus = this.clearFieldBonusMultiplier*(this.chainrxn.levelNumber+1);
    this.score += bonus;
    this.chainrxn.ballField.set("morph", {"duration":500});
    this.chainrxn.ballField.morph({"background-color":"#FFFFFF"})
    var coordinates = this.chainrxn.ballField.getCoordinates();
    var clearFieldBox = new Element("div", {"id":"clearFieldBox"}).inject(document.body);
    new Element("div",{"text":"Clear Field Bonus"}).inject(clearFieldBox);
    new Element("div",{"text":bonus+" Points"}).inject(clearFieldBox);
    clearFieldBox.setStyles({
      "top":(coordinates.top+(coordinates.height-this.clearFieldBoxHeight)/2),
      "left":(coordinates.left+(coordinates.width-this.clearFieldBoxWidth)/2)
    });
  },

  showWinBG: function(){
    this.chainrxn.ballField.set("morph", {"duration":1000});
    this.chainrxn.ballField.morph({"background-color":"#525252"})
  },

  doLoser: function(){
    this.repeater = $clear(this.repeater);
    this.canvas.clearRect(0,0,this.xmax+this.ballSize,this.ymax+this.ballSize);
    this.chainrxn.repeatLevel();
  },
  doWinner: function(){
    this.repeater = $clear(this.repeater);
    (function(){
      var clearFieldBox = $('clearFieldBox');
      if($chk(clearFieldBox)){
        clearFieldBox.destroy();
      }
      this.canvas.clearRect(0,0,this.xmax+this.ballSize,this.ymax+this.ballSize);
      this.chainrxn.doNextLevel(this.score);
    }).delay(this.expandDelay, this)
  }
})

var ChainRxn = new Class({
  score: 0,
  game: false,
  notifierBox: false,
  notifierTitle: false,
  notifierButton: false,
  ballsExpandedEl: false,
  levelScoreEl: false,
  totalScoreEl: false,
  levelNumberEl: false,
  ballField: false,
  levels: [[1,5],[2,10], [4,15],[6,20],[10,25],[15,30],[18,35],[22,40],[30,45],[37,50],[48,55],[55,60]], //[needed, total]
  levelNumber: 0,
  initialize: function(){
    this.notifierBox = $('notifierBox');
    this.notifierTitle = $('notifierTitle');
    this.notifierButton = $('notifierButton');
    this.ballsExpandedEl = $('ballsExpanded');
    this.levelScoreEl = $('levelScore');
    this.totalScoreEl = $('totalScore');
    this.levelNumberEl = $('levelNumber');
    this.ballField = $("ballField");
    this.notifierButton.addEvent("click", function(){
      this.notifierButton.removeEvents();
      this.newGame();
    }.bind(this))
  },
  repeatLevel: function(){
    this.notifierTitle.set("text", "挑战失败");
    this.notifierButton.set("text", "再次挑战");
    this.notifierBox.setStyle("display","");
    this.notifierButton.addEvent("click", function(){
      this.newGame();
    }.bind(this))
  },
  doNextLevel: function(score){
    this.levelNumber++;
    this.score += score;
    this.notifierTitle.set("text", "完成任务! 获得 "+this.score+" 分");
    this.notifierBox.setStyle("display","");
    
    if(this.levelNumber < this.levels.length){
      this.notifierButton.set("text", "第 " + (this.levelNumber+1) + " 关");
      this.notifierButton.addEvent("click", function(){
        this.newGame();//without the delay the startball picks up the click and... starts
      }.bind(this))
    }else{
      this.notifierButton.set("text", "再玩一次");
      this.notifierButton.addEvent("click", function(){
        window.location = window.location; //reload
      })
    }
  },
  newGame: function(){
    this.ballsExpandedEl.empty();
    this.levelScoreEl.empty();
    this.totalScoreEl.empty();
    this.levelNumberEl.empty();
    this.notifierTitle.set("text", "在 " + this.levels[this.levelNumber][1] + " 个点中捕获 "+this.levels[this.levelNumber][0]+" 个点");
    this.notifierButton.set('text', "开始!");
    this.notifierButton.removeEvents();
    this.notifierButton.addEvent("click", function(){
      this.notifierBox.setStyle("display", "none");
      this.notifierButton.removeEvents();
      this.game = new GameLevel(this.levels[this.levelNumber], this);
    }.bind(this))
  }
})

window.addEvent("load", function(){
  chainrxn = new ChainRxn;
}.bind(this))