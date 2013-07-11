(function (TexturePackerUtils){
	var frames={};
	TexturePackerUtils.frameFromSprite=function(image,json,name){
		if(frames[name]==undefined){
			var eI=document.createElement("canvas");
			eI.width=json.frames[name].frame.w;
			eI.height=json.frames[name].frame.h;
			eI.getContext("2d").drawImage(image,json.frames[name].frame.x,json.frames[name].frame.y,json.frames[name].frame.w,json.frames[name].frame.h,0,0,json.frames[name].frame.w,json.frames[name].frame.h);			
			frames[name]=eI;
		}
		return frames[name];
	}
	
	window.TexturePackerUtils=TexturePackerUtils;
})(window.TexturePackerUtils || {});
