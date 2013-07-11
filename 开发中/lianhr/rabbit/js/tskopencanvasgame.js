var agent=navigator.userAgent.toLowerCase(),
IS_IPAD=agent.indexOf("ipad")>-1,
IS_IPHONE=agent.indexOf("iphone")>-1,
IS_IPOD=agent.indexOf("ipod")>-1,
IS_ANDROID=agent.indexOf("android")>-1,
IS_IPRODUCT=IS_IPAD||IS_IPHONE||IS_IPOD,
IS_TOUCH=IS_IPAD||IS_IPHONE||IS_IPOD||IS_ANDROID;
//utils


function arrayIndexOf(array,obj){
    for(var i=0;i<array.length;i++)
        if(array[i]===obj)
            return i;
    return -1;
}
function arrayContains(array,obj){
    return arrayIndexOf(array,obj)>-1;
}
function arrayRemove(array,obj){
    var i=arrayIndexOf(array,obj);
    if(i>-1)
        array.splice(i,1);
}

function loadImages(array,cb){

	function loaded(i,done){
		return function(){
			done[i]=1;
		};
	}

	function isDone(done){
		for(var i=0;i<done.length;i++)
			if(!done[i])
				return 0;
		return 1;
	}

    var imgArray=[],done=new Array(array.length),i=0,data={};
    for(;i<array.length;i++){
        imgArray[i]=document.createElement("img");
        imgArray[i].onload=loaded(i,done);
        imgArray[i].src=array[i];
    }
    function poll(){
        if(isDone(done)){
            for(i=0;i<array.length;i++)
                data[array[i]]=imgArray[i];
            cb(data);
        }else{
            setTimeout(poll,100);
        }
    }
    poll();
}


//objects

function Sprite(img){
	this.x=0;
	this.y=0;
	this.scaleX=1;
	this.scaleY=1;
	this.alpha=1;
	
	
	//

	
	this.setImage=function(img){
		this.img=img;
		this.cx=0;
		this.cy=0;
		this.cWidth=img.width;
		this.cHeight=img.height;
	};
	if(img)
	this.setImage(img);
	
	this.getWidth=function(){
		return this.cWidth*this.scaleX;
	};
	this.getHeight=function(){
		return this.cHeight*this.scaleY;
	};
	
	this.getCenterX=function(){
		return this.x+this.getWidth()/2;
	};
	this.getCenterY=function(){
		return this.y+this.getHeight()/2;
	};
	
	this.setCenterX=function(x){
		this.x=x-this.getWidth()/2;
	};
	this.setCenterY=function(y){
		this.y=y-this.getHeight()/2;
	};
	
	this.draw=function(c){
		c.globalAlpha=this.alpha;
		c.drawImage(this.img,this.cx,this.cy,this.cWidth,this.cHeight,
		this.x,this.y,this.getWidth(),this.getHeight());
		c.globalAlpha=1;
	};
	
	this.getRectangle=function(){
		return new Rectangle(this.x,this.y,this.getWidth(),this.getHeight());
	};
	
	//
};



function TextSprite(text){
	this.x=0;
	this.y=0;
	this.text=typeof text==="string"?text:"";
	//default html5 canvas google chrome
	this.textAlign="left";
	this.textBaseline="top";
	this.font="10px sans-serif";
	this.color="#ffffff";
	
	this.draw=function(c){
		c.fillStyle=this.color;
		c.textAlign=this.textAlign;
		c.textBaseline=this.textBaseline;
		c.font=this.font;
		c.fillText(this.text,this.x,this.y);
	};
};



function Rectangle(x,y,width,height){
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
	
	this.contains=function(x,y){
		return this.x<=x&&x<this.x+this.width&&
                this.y<=y&&y<this.y+this.height;
	};

    this.intersects=function(rect){
        if(rect.x<this.x){
            if(rect.x+rect.width>this.x){
                if (rect.y<this.y)
                    return rect.y+rect.height>this.y;
                return rect.y<this.y+this.height;
            }
        }else if(rect.x<this.x+this.width){
            if(rect.y<this.y)
                return rect.y+rect.height>this.y;
            return rect.y<this.y+this.height;
        }
        return 0;
    };
}




function TimedTriggerPoller(delayMillis){

	this.totalMillis=0;
	this.delayMillis=delayMillis;
	
	this.generateDelayMillis=function(){
		return this.delayMillis;
	};
	
	this.initTimer=function(){
		this.totalMillis=0;
		this.delayMillis=this.generateDelayMillis();
	};
	
	this.update=function(t){
		this.totalMillis+=t;
		if(this.totalMillis>=this.delayMillis){
			this.initTimer();
			if(this.timedListener)
				this.timedListener.trigger();
		}
	};
}

function GameState(){
	this.load=function(){};
	this.update=function(){};
	this.unload=function(){};
}

function Game(canvas){
	var game=this,prev=new Date().getTime(),currentState,spriteArray=[],
	context=canvas.getContext("2d"),mouseX=0,mouseY=0,
	
	prevIsMouseDown=0,isMouseDown=0,isMouseNewlyDown=0,isMouseNewlyUp=0;
	this.delay=33;//30fps
	this.bgColor="#000000";
	
	this.getMouseX=function(){
		return mouseX;
	};
	this.getMouseY=function(){
		return mouseY;
	};
	this.isMouseDown=function(){
		return isMouseDown;
	};
	this.isMouseNewlyDown=function(){
		return isMouseNewlyDown;
	};
	this.isMouseNewlyUp=function(){
		return isMouseNewlyUp;
	};

	function setMousePosition(e){
		if (e.pageX!=undefined) {
			mouseX=e.pageX-canvas.offsetLeft;
			mouseY=e.pageY-canvas.offsetTop;
		}
		else {
			mouseX=e.clientX+document.body.scrollLeft+
					document.documentElement.scrollLeft-canvas.offsetLeft;
			mouseY=e.clientY+document.body.scrollTop+
					document.documentElement.scrollTop-canvas.offsetTop;
		}
	}
	var updateMouse;
	if(IS_TOUCH){
		updateMouse=function(e){
			if(e.touches&&e.touches.item(0))
				setMousePosition(e.touches.item(0));
			else
				setMousePosition(e);
		};
	}else{
		updateMouse=setMousePosition;
	}

	function mouseMove(e){
		updateMouse(e);
	}
	function mouseDown(e){
		updateMouse(e);
		isMouseDown=1;
	}
	function mouseUp(e){
		updateMouse(e);
		isMouseDown=0;
	}
	// mouse events
	if(IS_TOUCH){
		canvas.ontouchstart=function(){
			event.preventDefault();//prevent moving
			mouseDown(event);
		};
		canvas.ontouchmove=mouseMove;
		canvas.ontouchend=mouseUp;
	}else{//windows
		canvas.onmousedown=mouseDown;
		canvas.onmousemove=mouseMove;
		canvas.onmouseup=mouseUp;
	}
	
	/*
	canvas.addEventListener("mousemove",function(e){
		if(e.offsetX||e.offsetX===0) {
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		}
		else if(e.layerX) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		}
	},false);
	
	canvas.addEventListener("mousedown",function(e){
		isMouseDown=1;
	},false);
	
	canvas.addEventListener("mouseup",function(e){
		isMouseDown=0;
	},false);*/
	
	
	
	
	function draw(){
		var width=canvas.width; //fastest for ipod touch
		canvas.width=1;
		canvas.width=width;
		//context.clearRect(0,0,canvas.width,canvas.height);
		//context.fillStyle=game.bgColor;
		//context.fillRect(0,0,canvas.width,canvas.height); //fastest for chrome
		for(var i=0;i<spriteArray.length;i++)
			spriteArray[i].draw(context);
	}
	
	this.update=function(t){
		isMouseNewlyDown=!prevIsMouseDown&&isMouseDown;
		isMouseNewlyUp=prevIsMouseDown&&!isMouseDown;
		prevIsMouseDown=isMouseDown;
		if(currentState)
			currentState.update(t);
		draw();
	};
	
	function loop(){
		var now=new Date().getTime(),t=now-prev;
		prev=now;
		game.update(t);
		setTimeout(loop,game.delay);
	};
	
	this.start=function(){
		loop();
	};
	
	this.getCanvas=function(){
		return canvas;
	};
	
	this.setState=function(state){
		if(currentState)
			currentState.unload();
		if(state)
			state.load();
		currentState=state;
	};

	this.addSprite=function(sprite){
		spriteArray.push(sprite);
	};
	this.removeSprite=function(sprite){
		arrayRemove(spriteArray,sprite);
	};
	this.removeAllSprites=function(){
		spriteArray=[];
	};
	
	this.getSpriteArray=function(){
		return spriteArray;
	};
};


function MultiUpdateExecutor(){
	var updateableArray=[];
	
	this.add=function(updateable){
		updateableArray.push(updateable);
	};
	
	this.remove=function(updateable){
		arrayRemove(updateableArray,updateable);
	};
	
	this.clear=function(){
		updateableArray=[];
	};
	
	this.getUpdateableArray=function(){
		return updateableArray;
	};
	
	this.update=function(t){
		var array=updateableArray.slice(),i=0;
		for(;i<array.length;i++)
			if(arrayContains(updateableArray,array[i]))
				array[i].update(t);
	};
};

function ParticleEngine(game){
	var particles=[];
	this.add=function(particle){
		game.addSprite(particle);
		particles.push(particle);
	};
	this.remove=function(particle){
		game.removeSprite(particle);
		arrayRemove(particles,particle);
	};
	
	this.clear=function(){
		for(var i=0;i<particles.length;i++)
			game.removeSprite(particles[i]);
		particles=[];
	};
	this.update=function(t){
		var i=0;
		for(;i<particles.length;i++)
			particles[i].update(t);
		i=0;
		while(i<particles.length){
			if(particles[i].willDispose(t)){
				game.removeSprite(particles[i]);
				particles.splice(i,1);
			}
			else{
				i++;
			}
		}
	};
}


function SpriteUpdater(sprite,dx,dy,dsx,dsy,dalpha){
	this.dx=dx?dx:0;
	this.dy=dy?dy:0;
	this.dsx=dsx?dsx:0;
	this.dsy=dsy?dsy:0;
	this.dalpha=dalpha?dalpha:0;
	
	this.update=function(t){
		sprite.x+=this.dx;
		sprite.y+=this.dy;
		sprite.scaleX+=this.dsx;
		sprite.scaleY+=this.dsy;
		sprite.alpha+=this.dalpha;
	};
}