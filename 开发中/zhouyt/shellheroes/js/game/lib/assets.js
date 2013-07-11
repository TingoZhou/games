(function(Assets){
	//private
	var _assets=[];
	var _total=0;
	var _callback=null;
	var _realAssets={};
	var soundAssets=[];
	var _realAssetCount=0;

	
	function assetLoaded(type,name,value){
		_realAssets[name]=value;
		_realAssetCount++;
		if(_total == _realAssetCount){
			_callback();
		}
	}
	
	function XMLParser(xmlStr){
		//http://stackoverflow.com/questions/649614/xml-parsing-in-javascript/8412989#8412989
		var parseXml;
		if (typeof window.DOMParser != "undefined") {
		    parseXml = function(xmlStr) {
		        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
		    };
		} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
		    parseXml = function(xmlStr) {
		        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
		        xmlDoc.async = "false";
		        xmlDoc.loadXML(xmlStr);
		        return xmlDoc;
		    };
		} else {
		    throw new Error("Cannot parse XML");
		}
		return parseXml(xmlStr);
	}
	//public
	Assets.loadAssets=function(assets,callback){
		_callback=callback;
		_assets=assets;
		_total=_realAssetCount+_assets.length;
		SoundJS.onSoundLoadComplete = function(o){
			var name=o.id.split("_").shift();
			assetLoaded("sound",name,o);
		};
		
		for(var i=0;i<assets.length;i++){
			var req = new XMLHttpRequest();
			var u=assets[i];
			if(u.constructor==Object){
				u=assets[i].urls[0];
				instances=assets[i].instances;
			}
			var url="js/game/"+u;
			var name=u.split("/").pop().split(".").shift();
			var type=u.split("/").pop().split(".").pop();
			if(type=="jpg" || type=="jpeg" || type=="gif" || type=="png"){
				var ni=new Image();
				ni.onload=function(e){
					assetLoaded("image",e.currentTarget.src.split("/").pop(),e.currentTarget);
				};
				ni.src=url;
				continue;
			}else if(type=="xml"){
				req.name=u.split("/").pop();
				req.onreadystatechange=function(e){
					var r=e.currentTarget;
					if(r.readyState==4){
						assetLoaded("xml",r.name,XMLParser(r.responseText));
					}
				}
        		req.open('GET', url, true);
        		req.send(null);
        		continue;
			}else if(type=="json"){
				req.name=u.split("/").pop();
				req.onreadystatechange=function(e){
					var r=e.currentTarget;
					if(r.readyState==4){
						assetLoaded("json",r.name,JSON.parse(r.responseText));
					}
				}
        		req.open('GET', url, true);
        		req.send(null);
        		continue;
			}else if(type=="txt"){
				req.name=u.split("/").pop();
				req.onreadystatechange=function(e){
					var r=e.currentTarget;
					if(r.readyState==4){
						assetLoaded("text",r.name,r.responseText);
					}
				}
        		req.open('GET', url, true);
        		req.send(null);
        		continue;
			}else if(type=="mp3" || type=="ogg"){
				for(var j=0;j<assets[i].urls.length;j++){
					assets[i].urls[j]="js/game/"+assets[i].urls[j];
				}
				//soundAssets.push({name:name,src:assets[i].urls,instances:instances});
				soundManager.createSound({
					id:name,
					url:assets[i].urls,
					onload:Assets.soundLoaded,
				});
				soundManager.load(name);
			}
		}
		
	}
	Assets.soundLoaded=function(){
		assetLoaded('sound',this.sID,"");
	}

	Assets.get=function(name){
		if(_realAssets[name]!=undefined){
			return _realAssets[name];
		}else{
			console.log("Asset "+name+" not preloaded.");
		}
	}
	Assets.percentageLoaded=function(){
		return Math.floor(_realAssetCount*100/_total);
	}
	
	//
	window.Assets=Assets;
})(window.Assets || {});

