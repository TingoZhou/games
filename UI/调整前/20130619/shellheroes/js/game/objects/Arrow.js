var Arrow=function(sx,sy,tx,ty){
	var dx=tx-sx;
	var dy=ty-sy;
	var dist=(Math.sqrt(Math.abs(dx*dx+dy*dy))-20)>>0;
	
	var g=new Graphics();
	g.beginFill("#222");
	g.rect(0,-1,dist,2);
	g.moveTo(dist,-5);
	g.lineTo(dist+10,0);
	g.lineTo(dist,5);
	g.lineTo(dist,0);
	g.endFill();
	this.clip=new Shape(g);

	var angle=Math.atan2(dy,dx);
	this.clip.rotation=angle*180/Math.PI;
	
	this.clip.x=sx+(Math.cos(angle)*15)>>0;
	this.clip.y=sy+(Math.sin(angle)*15)>>0;
	
	this.dispose=function(){
		g=null;
		this.clip=null;
	}
}

