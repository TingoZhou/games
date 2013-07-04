(function(Input){
	var keys={};
	
	Input.assignActions = function(keys){
		for(var i=0;i<keys.length;i++){
			keys[keys[i]]=false;
		}
	}
	
	Input.isset = function(key){
		if(keys[key]){
			return keys[key];
		}
		return false;
	}
	
	Input.reset = function(){
		for(var key in keys){
			keys[key]=false;
		}
	}
	
	Input.setAction = function(key){
		keys[key]=true;
	}
	Input.unsetAction = function(key){
		keys[key]=false;
	}
	
	Input.dispose = function(){
		keys={};
	}

	window.Input=Input;
})(window.Input || {});
