(function(Trig){
	/**
	 * Find a point relies inside a rectangle.
	 * object registration points must be topleft
	 * o is any object with x,y,width,height properties
	 * p is an obect with x,y properties
	 */
	Trig.hitRect=function(o,p){
		return (p.x >= (o.x) && p.x <= (o.x+o.width) && p.y >= o.y && p.y <= (o.y+o.height))
	}
	/**
	 * Find the side of a hit between a rect and point
	 * Possible bug on corner hits.
	 * object registration points must be topleft
	 * o is any object with x,y,width,height properties
	 * p is an obect with x,y properties
	 */
	Trig.hitRectSide=function(o,p){
		var ld,rd,td,bd;
		ld=o.x+o.width/2;
		rd=o.width/2-p.x;
		ld=o.x+o.width/2-p.x;
		ld=o.x+o.width/2-p.x;
		var side="";
		if(p.x<=o.x+o.width/2){
			side="left";
		}
		if(p.y<o.y+o.height/2){
			side="top";
		}
		if(p.x>=o.x+o.width/2){
			side="right";
		}
		if(p.y>=o.y+o.height/2){
			side="bottom";
		}
		return side;
	}
	
	Trig.toDeg=function(angle){
		return angle * 180/Math.PI;
	}
	Trig.toRad=function(angle){
		return angle * Math.PI/180;
	}
	
	window.Trig=Trig;
})(window.Trig || {});
