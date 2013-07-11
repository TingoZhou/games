var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = $hxClasses["IntHash"] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loader = function() {
	if(co.doubleduck.Assets._loader == null) {
		co.doubleduck.Assets._loader = new createjs.PreloadJS();
		co.doubleduck.Assets._loader.initialize(true);
		co.doubleduck.Assets._loader.onFileLoad = co.doubleduck.Assets.handleFileLoaded;
		co.doubleduck.Assets._loader.onFileError = co.doubleduck.Assets.handleLoadError;
		co.doubleduck.Assets._loader.setMaxConnections(10);
	}
	return co.doubleduck.Assets._loader;
}
co.doubleduck.Assets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.Assets.loader().loadFile(uri);
	co.doubleduck.Assets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds[sounds.length] = "sound/Theme";
	sounds[sounds.length] = "sound/click";
	sounds[sounds.length] = "sound/falling";
	sounds[sounds.length] = "sound/magic_blast";
	sounds[sounds.length] = "sound/special_sight";
	sounds[sounds.length] = "sound/magic1";
	sounds[sounds.length] = "sound/thunder";
	sounds[sounds.length] = "sound/bomb";
	sounds[sounds.length] = "sound/score";
	sounds[sounds.length] = "sound/level_up";
	sounds[sounds.length] = "sound/blast1";
	sounds[sounds.length] = "sound/blast2";
	sounds[sounds.length] = "sound/blast3";
	sounds[sounds.length] = "sound/transition";
	sounds[sounds.length] = "sound/gem_ding_last";
	var _g = 0;
	while(_g < 9) {
		var i = _g++;
		sounds[sounds.length] = "sound/gem_ding" + i;
	}
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var mySound = _g1++;
			co.doubleduck.SoundManager.initSound(sounds[mySound]);
		}
	}
	manifest[manifest.length] = "images/orientation_error.png";
	manifest[manifest.length] = "images/menu/bg.png";
	manifest[manifest.length] = "images/menu/tap2play.png";
	manifest[manifest.length] = "images/menu/branch_bottom.png";
	manifest[manifest.length] = "images/menu/branch_top.png";
	manifest[manifest.length] = "images/menu/logo.png";
	manifest[manifest.length] = "images/menu/bush.png";
	manifest[manifest.length] = "images/menu/cheetah.png";
	manifest[manifest.length] = "images/menu/light_circle.png";
	manifest[manifest.length] = "images/menu/play_btn.png";
	manifest[manifest.length] = "images/menu/level-bar_fill.png";
	manifest[manifest.length] = "images/menu/level-bar_empty.png";
	manifest[manifest.length] = "images/menu/next_level_box.png";
	manifest[manifest.length] = "images/menu/level_star.png";
	manifest[manifest.length] = "images/menu/chaz_happy.png";
	manifest[manifest.length] = "images/menu/help_btn.png";
	manifest[manifest.length] = "images/menu/next_level_unlocks.png";
	manifest[manifest.length] = "images/menu/special_sight.png";
	manifest[manifest.length] = "images/menu/big_time_bonus.png";
	manifest[manifest.length] = "images/menu/time_bonus.png";
	manifest[manifest.length] = "images/menu/lightning_bolt.png";
	manifest[manifest.length] = "images/menu/bomb_blast.png";
	manifest[manifest.length] = "images/menu/color_blast.png";
	manifest[manifest.length] = "images/menu/color_splash.png";
	manifest[manifest.length] = "images/menu/score_bonus.png";
	manifest[manifest.length] = "images/menu/highscore_stamp.png";
	manifest[manifest.length] = "images/menu/help.png";
	manifest[manifest.length] = "images/menu/gotit_btn.png";
	manifest[manifest.length] = "images/menu/audio_btn.png";
	manifest[manifest.length] = "images/menu/game_end.png";
	manifest[manifest.length] = "images/gems/gems-all.png";
	manifest[manifest.length] = "images/gems/powerup_blocks.png";
	manifest[manifest.length] = "images/gems/powerups.png";
	manifest[manifest.length] = "images/gems/poof.png";
	manifest[manifest.length] = "images/gems/lightning.png";
	manifest[manifest.length] = "images/font/,.png";
	manifest[manifest.length] = "images/font/0.png";
	manifest[manifest.length] = "images/font/1.png";
	manifest[manifest.length] = "images/font/2.png";
	manifest[manifest.length] = "images/font/3.png";
	manifest[manifest.length] = "images/font/4.png";
	manifest[manifest.length] = "images/font/5.png";
	manifest[manifest.length] = "images/font/6.png";
	manifest[manifest.length] = "images/font/7.png";
	manifest[manifest.length] = "images/font/8.png";
	manifest[manifest.length] = "images/font/9.png";
	manifest[manifest.length] = "images/hud/bar_empty.png";
	manifest[manifest.length] = "images/hud/bar_fill.png";
	manifest[manifest.length] = "images/hud/score_bar.png";
	manifest[manifest.length] = "images/hud/clock_empty.png";
	manifest[manifest.length] = "images/hud/clock_fill.png";
	manifest[manifest.length] = "images/hud/paused.png";
	manifest[manifest.length] = "images/hud/menu_btn.png";
	manifest[manifest.length] = "images/hud/replay_btn.png";
	manifest[manifest.length] = "images/hud/pause_btn.png";
	manifest[manifest.length] = "images/hud/resume_btn.png";
	manifest[manifest.length] = "images/hud/hud_font/,.png";
	manifest[manifest.length] = "images/hud/hud_font/0.png";
	manifest[manifest.length] = "images/hud/hud_font/1.png";
	manifest[manifest.length] = "images/hud/hud_font/2.png";
	manifest[manifest.length] = "images/hud/hud_font/3.png";
	manifest[manifest.length] = "images/hud/hud_font/4.png";
	manifest[manifest.length] = "images/hud/hud_font/5.png";
	manifest[manifest.length] = "images/hud/hud_font/6.png";
	manifest[manifest.length] = "images/hud/hud_font/7.png";
	manifest[manifest.length] = "images/hud/hud_font/8.png";
	manifest[manifest.length] = "images/hud/hud_font/9.png";
	if(co.doubleduck.Assets._useLocalStorage) co.doubleduck.Assets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.Assets.onLoadAll != null) co.doubleduck.Assets.onLoadAll();
	}
	co.doubleduck.Assets.loader().onProgress = co.doubleduck.Assets.handleProgress;
	co.doubleduck.Assets.loader().onFileLoad = co.doubleduck.Assets.manifestFileLoad;
	co.doubleduck.Assets.loader().loadManifest(manifest);
	co.doubleduck.Assets.loader().load();
}
co.doubleduck.Assets.manifestFileLoad = function(event) {
	if(co.doubleduck.Assets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.Persistence.setValue(event.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.Assets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.Persistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.Assets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.Assets.handleProgress = function(event) {
	co.doubleduck.Assets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.Assets.loader().onProgress = null;
		co.doubleduck.Assets.onLoadAll();
	}
}
co.doubleduck.Assets.handleLoadError = function(event) {
}
co.doubleduck.Assets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.Assets._cacheData[event.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.Assets._loadCallbacks,event.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.Assets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.Assets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.Assets.loader().getResult(uri) != null) {
			cache = co.doubleduck.Assets.loader().getResult(uri).result;
			co.doubleduck.Assets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.Assets.getRawImage = function(uri) {
	var cache = co.doubleduck.Assets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.Assets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.Assets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.Assets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.Assets.prototype = {
	__class__: co.doubleduck.Assets
}
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickSound == null) clickSound = "sound/click";
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	createjs.Container.call(this);
	this._clickSound = clickSound;
	this._bitmap = bmp;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	this.image = this._bitmap.image;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.__super__ = createjs.Container;
co.doubleduck.Button.prototype = $extend(createjs.Container.prototype,{
	handleEndPress: function() {
		co.doubleduck.Utils.tintBitmap(this._bitmap,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.Game.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function() {
		if(this.onToggle == null) return;
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function() {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				co.doubleduck.Utils.tintBitmap(this._bitmap,0.55,0.55,0.55,1);
				var tween = createjs.Tween.get(this._bitmap);
				tween.ignoreGlobalPause = true;
				tween.wait(200).call($bind(this,this.handleEndPress));
				if(createjs.Ticker.getPaused()) co.doubleduck.Game.getStage().update();
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,_bitmap: null
	,onToggle: null
	,image: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.Clock = $hxClasses["co.doubleduck.Clock"] = function() {
	createjs.Bitmap.call(this,co.doubleduck.Assets.getRawImage("images/hud/clock_fill.png"));
	this.regX = this.image.width / 2;
	this.regY = this.image.height / 2;
	this._mask = null;
	this._currProg = 1;
};
co.doubleduck.Clock.__name__ = ["co","doubleduck","Clock"];
co.doubleduck.Clock.__super__ = createjs.Bitmap;
co.doubleduck.Clock.prototype = $extend(createjs.Bitmap.prototype,{
	setProgress: function(progress) {
		if(progress == 1) return;
		if(this._mask == null) {
			this._mask = new createjs.Shape();
			this.mask = this._mask;
		}
		var radius = this.image.width / 2 * co.doubleduck.Game.getScale();
		this._mask.graphics.clear();
		this._mask.graphics.beginFill("#FF0000");
		var startDeg = -90 * Math.PI / 180;
		var endDeg = (-90 + 360 * (1 - progress)) * Math.PI / 180;
		this._mask.graphics.arc(this.x,this.y,radius,startDeg,endDeg,true);
		this._mask.graphics.lineTo(this.x,this.y);
		this._mask.graphics.closePath();
		this._mask.graphics.endFill();
	}
	,_currProg: null
	,_totalTime: null
	,_mask: null
	,_bmp: null
	,__class__: co.doubleduck.Clock
});
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() {
};
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.getPowerupByName = function(name) {
	var result = null;
	var gdb = new GameplayDB();
	var allPowerups = gdb.getAllPowerups();
	var _g1 = 0, _g = allPowerups.length;
	while(_g1 < _g) {
		var currPowerup = _g1++;
		var powerup = allPowerups[currPowerup];
		if(powerup.name == name) {
			result = powerup;
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getPowerById = function(id) {
	var result = null;
	var gdb = new GameplayDB();
	var allPowerups = gdb.getAllPowerups();
	var _g1 = 0, _g = allPowerups.length;
	while(_g1 < _g) {
		var currPowerup = _g1++;
		var powerup = allPowerups[currPowerup];
		if((powerup.id | 0) == id) {
			result = powerup;
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getAvailablePowerups = function(activeOnly) {
	if(activeOnly == null) activeOnly = false;
	var result = new Array();
	var userLevel = co.doubleduck.DataLoader.getLevelByXP(co.doubleduck.Persistence.getXP());
	var _g1 = 0, _g = userLevel.powerups.length;
	while(_g1 < _g) {
		var currPowerup = _g1++;
		var newPowerup = co.doubleduck.DataLoader.getPowerupByName(userLevel.powerups[currPowerup]);
		if(activeOnly && newPowerup.isActive != "true") continue; else result.push(newPowerup);
	}
	return result;
}
co.doubleduck.DataLoader.getLevelByXP = function(xp) {
	var currXp = xp;
	var unlockedLevel = null;
	var _levelsData = new LevelDB();
	var _g1 = 0, _g = _levelsData.getAllLevels().length;
	while(_g1 < _g) {
		var currLevel = _g1++;
		var level = _levelsData.getAllLevels()[currLevel];
		if((level.xpToUnlock | 0) <= currXp) unlockedLevel = level; else break;
	}
	return unlockedLevel;
}
co.doubleduck.DataLoader.getLevelById = function(id) {
	var unlockedLevel = null;
	var _levelsData = new LevelDB();
	var _g1 = 0, _g = _levelsData.getAllLevels().length;
	while(_g1 < _g) {
		var currLevel = _g1++;
		var level = _levelsData.getAllLevels()[currLevel];
		if((level.id | 0) == id) {
			unlockedLevel = level;
			break;
		}
	}
	return unlockedLevel;
}
co.doubleduck.DataLoader.getAvailPassivePowerupIds = function() {
	var result = new Array();
	var userLevel = co.doubleduck.DataLoader.getLevelByXP(co.doubleduck.Persistence.getXP());
	var _g1 = 0, _g = userLevel.powerups.length;
	while(_g1 < _g) {
		var currPowerup = _g1++;
		var newPowerup = co.doubleduck.DataLoader.getPowerupByName(userLevel.powerups[currPowerup]);
		if(newPowerup.isActive == "false") result.push(newPowerup.id);
	}
	return result;
}
co.doubleduck.DataLoader.prototype = {
	__class__: co.doubleduck.DataLoader
}
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims) {
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			result.regX = bmp.image.width / 2;
			result.regY = bmp.image.height / 2;
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale;
				}
			}
			result.regX = totalWidth / 2;
			result.regY = digits[0].image.height / 2;
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.Assets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.Assets.getImage(this._fontType + ",.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	if(co.doubleduck.Game.DEBUG) co.doubleduck.Persistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		js.Lib.alert("这个手机版本不支持，请更新您的手机。");
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.Game._stage = stage;
	co.doubleduck.Game._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.Game.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(viewporter.isLandscape()) co.doubleduck.Assets.loadAndCall("images/orientation_error.png",$bind(this,this.waitForPortrait)); else co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
	} else co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game._stage = null;
co.doubleduck.Game._bgMusic = null;
co.doubleduck.Game.hammer = null;
co.doubleduck.Game.playMusic = function() {
	if(co.doubleduck.Game._musicPlaying) return;
	co.doubleduck.Game._bgMusic = co.doubleduck.SoundManager.playMusic("sound/Theme");
	co.doubleduck.Game._musicPlaying = true;
}
co.doubleduck.Game.stopMusic = function() {
	if(!co.doubleduck.Game._musicPlaying) return;
	co.doubleduck.Game._bgMusic.stop();
	co.doubleduck.Game._musicPlaying = false;
}
co.doubleduck.Game.getUnlockedLevelNum = function(xp) {
	var currXp = xp;
	var unlockedLevel = 1;
	var _levelsData = new LevelDB();
	var _g1 = 0, _g = _levelsData.getAllLevels().length;
	while(_g1 < _g) {
		var currLevel = _g1++;
		var level = _levelsData.getAllLevels()[currLevel];
		if((level.xpToUnlock | 0) > currXp) {
			unlockedLevel = (level.id | 0) - 1;
			return unlockedLevel;
		}
	}
	return _levelsData.getAllLevels().length;
}
co.doubleduck.Game.getViewport = function() {
	return co.doubleduck.Game._viewport;
}
co.doubleduck.Game.getScale = function() {
	return co.doubleduck.Game._scale;
}
co.doubleduck.Game.getStage = function() {
	return co.doubleduck.Game._stage;
}
co.doubleduck.Game.setScale = function() {
	var regScale = co.doubleduck.Game._viewport.height / co.doubleduck.Game.MAX_HEIGHT;
	if(co.doubleduck.Game._viewport.width >= co.doubleduck.Game._viewport.height) co.doubleduck.Game._scale = regScale; else if(co.doubleduck.Game.MAX_WIDTH * regScale < co.doubleduck.Game._viewport.width) co.doubleduck.Game._scale = co.doubleduck.Game._viewport.width / co.doubleduck.Game.MAX_WIDTH; else co.doubleduck.Game._scale = regScale;
}
co.doubleduck.Game.prototype = {
	handleViewportChanged: function() {
		if(viewporter.isLandscape()) {
			if(this._orientError == null) {
				this._orientError = co.doubleduck.Assets.getImage("images/orientation_error.png");
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.Game._viewport.height / 2;
				this._orientError.y = co.doubleduck.Game._viewport.width / 2;
				co.doubleduck.Game._stage.addChildAt(this._orientError,co.doubleduck.Game._stage.getNumChildren());
				co.doubleduck.Game._stage.update();
				this._session.pause();
			}
		} else if(this._orientError != null) {
			co.doubleduck.Game._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.Game._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.showSplash));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.Game._stage.canvas.width = screenW;
		co.doubleduck.Game._stage.canvas.height = screenH;
		if(!viewporter.isLandscape()) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			if(!(viewporter.ACTIVE && screenH < screenW)) {
				co.doubleduck.Game._viewport.width = screenW;
				co.doubleduck.Game._viewport.height = screenH;
				co.doubleduck.Game.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.Game._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.Game._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu(this._lastSessionScore,this._isHighscore);
		co.doubleduck.Game._stage.addChildAt(this._menu,0);
		this._menu.onStart = $bind(this,this.handleStart);
	}
	,handleRestart: function() {
		this._session.destroy();
		co.doubleduck.Game._stage.removeChild(this._session);
		this._session = null;
		this.startSession();
	}
	,handleSessionEnd: function(score) {
		this._isHighscore = score > co.doubleduck.Persistence.getHighscore();
		if(this._isHighscore) co.doubleduck.Persistence.setHighscore(score);
		this._lastSessionScore = score;
		var currXp = co.doubleduck.Persistence.getXP();
		var newXp = currXp + score;
		co.doubleduck.Persistence.setXP(newXp);
		
    // we add the offer when user finished a session
    window.InAppOffer && new window.InAppOffer();
	}
	,handleStart: function() {
		this._isHighscore = false;
		co.doubleduck.Game._stage.removeChild(this._menu);
		this.startSession();
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function() {
		this._lastSessionScore = 0;
		this._session = new co.doubleduck.Session();
		this._session.setOnRestart($bind(this,this.handleRestart));
		this._session.setOnBackToMenu($bind(this,this.handleBackToMenu));
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.Game._stage.addChild(this._session);
	}
	,tapToPlayTextAlpha: function() {
		if(this._tapToPlayText == null) return;
		if(this._tapToPlayText.alpha == 0) createjs.Tween.get(this._tapToPlayText).to({ alpha : 1},750).call($bind(this,this.tapToPlayTextAlpha)); else if(this._tapToPlayText.alpha == 1) createjs.Tween.get(this._tapToPlayText).to({ alpha : 0},1500).call($bind(this,this.tapToPlayTextAlpha));
	}
	,removeSplash: function() {
		co.doubleduck.Game._stage.removeChild(this._splashScreen);
		this._splashScreen = null;
	}
	,showMenu: function() {
		this.removeSplash();
		co.doubleduck.Game._stage.removeChild(this._bush);
		co.doubleduck.Game._stage.removeChild(this._logo);
		co.doubleduck.Game._stage.removeChild(this._cheetah);
		co.doubleduck.Game._stage.removeChild(this._lightCircle);
		this._bush = null;
		this._logo = null;
		this._cheetah = null;
		this._lightCircle = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.Game._stage.addChildAt(this._menu,0);
		this._menu.onStart = $bind(this,this.handleStart);
	}
	,closeSplash: function() {
		co.doubleduck.Game.playMusic();
		co.doubleduck.Game._stage.removeChild(this._tapToPlayText);
		this._tapToPlayText = null;
		this._splashScreen.onClick = null;
		createjs.Tween.get(this._cheetah).wait(800).to({ y : this._cheetah.y + this._cheetah.image.height * co.doubleduck.Game.getScale(), scaleX : this._cheetah.scaleX * 0.8},300,createjs.Ease.sineIn).call($bind(this,this.showMenu));
		createjs.Tween.get(this._logo).wait(500).to({ y : -this._logo.image.height / 2 * co.doubleduck.Game.getScale()},300,createjs.Ease.sineIn);
		createjs.Tween.get(this._lightCircle).wait(800).to({ alpha : 0},300);
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.Game._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this._splashScreen = co.doubleduck.Assets.getImage("images/menu/bg.png",true);
		this._splashScreen.scaleX = this._splashScreen.scaleY = co.doubleduck.Game.getScale();
		this._splashScreen.regX = this._splashScreen.image.width / 2;
		this._splashScreen.regY = this._splashScreen.image.height / 2;
		this._splashScreen.x = co.doubleduck.Game.getViewport().width / 2;
		this._splashScreen.y = co.doubleduck.Game.getViewport().height / 2;
		co.doubleduck.Game._stage.addChildAt(this._splashScreen,0);
		this._cheetah = co.doubleduck.Assets.getImage("images/menu/cheetah.png");
		this._cheetah.regX = 0;
		this._cheetah.regY = this._cheetah.image.height;
		this._cheetah.scaleX = this._cheetah.scaleY = co.doubleduck.Game.getScale();
		this._cheetah.y = this._splashScreen.y + this._splashScreen.image.height * 0.85 * co.doubleduck.Game.getScale() / 2;
		this._cheetah.x = this._splashScreen.x - this._splashScreen.image.width * co.doubleduck.Game.getScale() / 2;
		this._lightCircle = co.doubleduck.Assets.getImage("images/menu/light_circle.png");
		this._lightCircle.regX = this._cheetah.regX;
		this._lightCircle.regY = this._cheetah.regY;
		this._lightCircle.scaleX = this._lightCircle.scaleY = co.doubleduck.Game.getScale();
		this._lightCircle.y = this._cheetah.y;
		this._lightCircle.x = this._cheetah.x;
		co.doubleduck.Game._stage.addChild(this._lightCircle);
		co.doubleduck.Game._stage.addChild(this._cheetah);
		this._bush = co.doubleduck.Assets.getImage("images/menu/bush.png");
		this._bush.regX = 0;
		this._bush.regY = this._bush.image.height;
		this._bush.scaleX = this._bush.scaleY = co.doubleduck.Game.getScale();
		this._bush.y = this._splashScreen.y + this._splashScreen.image.height * co.doubleduck.Game.getScale() / 2;
		this._bush.x = this._splashScreen.x - this._splashScreen.image.width * co.doubleduck.Game.getScale() / 2;
		co.doubleduck.Game._stage.addChild(this._bush);
		this._logo = co.doubleduck.Assets.getImage("images/menu/logo.png");
		this._logo.scaleX = this._logo.scaleY = co.doubleduck.Game.getScale();
		this._logo.regX = this._logo.image.width / 2;
		this._logo.regY = this._logo.image.height / 2;
		this._logo.x = co.doubleduck.Game.getViewport().width / 2;
		this._logo.y = co.doubleduck.Game.getViewport().height * 0.20;
		co.doubleduck.Game._stage.addChild(this._logo);
		this._tapToPlayText = co.doubleduck.Assets.getImage("images/menu/tap2play.png");
		this._tapToPlayText.regX = this._tapToPlayText.image.width;
		this._tapToPlayText.x = this._splashScreen.x + this._splashScreen.image.width / 2 * co.doubleduck.Game.getScale() - 10 * co.doubleduck.Game.getScale();
		this._tapToPlayText.y = this._splashScreen.y - this._splashScreen.image.height * co.doubleduck.Game.getScale() / 2;
		this._tapToPlayText.y += this._splashScreen.image.height * co.doubleduck.Game.getScale() * 0.41;
		this._tapToPlayText.scaleX = this._tapToPlayText.scaleY = co.doubleduck.Game.getScale();
		this._tapToPlayText.alpha = 0;
		this.tapToPlayTextAlpha();
		co.doubleduck.Game._stage.addChildAt(this._tapToPlayText,1);
		this._splashScreen.onClick = $bind(this,this.closeSplash);
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.Game._stage.removeChild(this._loadingBar);
		co.doubleduck.Game._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.Assets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.Assets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute();
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.Assets.getImage("images/splash_logo.png");
		this._splash.regX = this._splash.image.width / 2;
		this._splash.regY = this._splash.image.height / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		this._splash.y = 200;
		co.doubleduck.Game._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.Assets.getImage("images/loading_stroke.png");
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.Game._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.Assets.getImage("images/loading_fill.png");
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.Game._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 110;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.Game._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.Game._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.Assets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForPortrait: function() {
		this._waitingToStart = true;
		this._orientError = co.doubleduck.Assets.getImage("images/orientation_error.png");
		this._orientError.regX = this._orientError.image.width / 2;
		this._orientError.regY = this._orientError.image.height / 2;
		this._orientError.x = js.Lib.window.innerWidth / 2;
		this._orientError.y = js.Lib.window.innerHeight / 2;
		co.doubleduck.Game._stage.addChildAt(this._orientError,co.doubleduck.Game._stage.getNumChildren());
	}
	,loadBarStroke: function() {
		co.doubleduck.Assets.loadAndCall("images/loading_stroke.png",$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.Assets.loadAndCall("images/loading_fill.png",$bind(this,this.loadBarStroke));
	}
	,_isHighscore: null
	,_lastSessionScore: null
	,_playerXP: null
	,_lightCircle: null
	,_loadingStroke: null
	,_loadingBar: null
	,_tapToPlayText: null
	,_splashScreen: null
	,_waitingToStart: null
	,_orientError: null
	,_session: null
	,_menu: null
	,_bush: null
	,_cheetah: null
	,_logo: null
	,_splash: null
	,__class__: co.doubleduck.Game
}
co.doubleduck.Gem = $hxClasses["co.doubleduck.Gem"] = function(type) {
	this._stopAt = -1;
	this._isAlive = true;
	this._hasJustCreated = true;
	this._isFocusFaded = false;
	this._isZenGlow = false;
	this._isHintGlow = false;
	this._powerup = -1;
	createjs.Container.call(this);
	this._gemType = type;
	this._speed = co.doubleduck.Gem.INITIAL_SPEED;
	this._gemBMP = new createjs.BitmapAnimation(co.doubleduck.Gem._gemSpriteSheet);
	this._gemBMP.gotoAndStop("gem" + type);
	this.addChild(this._gemBMP);
	this._isInPlace = false;
	this.onClick = $bind(this,this.handleClick);
};
co.doubleduck.Gem.__name__ = ["co","doubleduck","Gem"];
co.doubleduck.Gem._gemSpriteSheet = null;
co.doubleduck.Gem._explodeSpriteSheet = null;
co.doubleduck.Gem._lastClickPos = null;
co.doubleduck.Gem.createGem = function(type,grid) {
	if(co.doubleduck.Gem._gemSpriteSheet == null) {
		var img;
		var initObject;
		img = co.doubleduck.Assets.getRawImage("images/gems/gems-all.png");
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : co.doubleduck.Gem.GEM_SIZE, height : co.doubleduck.Gem.GEM_SIZE, regX : co.doubleduck.Gem.GEM_SIZE / 2, regY : co.doubleduck.Gem.GEM_SIZE / 2};
		initObject.animations = { };
		var _g1 = 0, _g = co.doubleduck.Gem.GEMS_COUNT;
		while(_g1 < _g) {
			var i = _g1++;
			initObject.animations["gem" + (i + 1)] = { frames : i, frequency : 20};
			initObject.animations["glow" + (i + 1)] = { frames : co.doubleduck.Gem.SHEET_GLOW + i, frequency : 20};
			initObject.animations["gem_cover" + (i + 1)] = { frames : co.doubleduck.Gem.SHEET_COVER + i, frequency : 20};
			initObject.animations["glow_cover" + (i + 1)] = { frames : co.doubleduck.Gem.SHEET_COVER_GLOW + i, frequency : 20};
		}
		co.doubleduck.Gem._gemSpriteSheet = new createjs.SpriteSheet(initObject);
		img = co.doubleduck.Assets.getRawImage("images/gems/poof.png");
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : img.height, height : img.height, regX : img.height / 2, regY : img.height / 2};
		initObject.animations = { };
		initObject.animations.explode = { frames : [0,1,2,3,4], frequency : 1, next : false};
		co.doubleduck.Gem._explodeSpriteSheet = new createjs.SpriteSheet(initObject);
	}
	var newGem = new co.doubleduck.Gem(type);
	newGem._grid = grid;
	return newGem;
}
co.doubleduck.Gem.__super__ = createjs.Container;
co.doubleduck.Gem.prototype = $extend(createjs.Container.prototype,{
	getSpeed: function() {
		return this._speed;
	}
	,getPowerup: function() {
		return this._powerup;
	}
	,getType: function() {
		return this._gemType;
	}
	,isRelevantForSolve: function() {
		return this._isInPlace || this._hasJustCreated;
	}
	,isInPlace: function() {
		return this._isInPlace;
	}
	,setCol: function(col) {
		this._col = col;
		this.name = "gem" + this._row + "," + this._col;
	}
	,setRow: function(row) {
		this._row = row;
		this.name = "gem" + this._row + "," + this._col;
	}
	,getCol: function() {
		return this._col;
	}
	,getRow: function() {
		return this._row;
	}
	,isAlive: function() {
		return this._isAlive;
	}
	,destroy: function() {
		if(!this._isInPlace) {
			this._isInPlace = true;
			this._speed = 0;
		}
		if(this._gemBMP != null) createjs.Tween.removeTweens(this._gemBMP);
		if(this._glowBMP != null) createjs.Tween.removeTweens(this._glowBMP);
		if(this._coverBMP != null) createjs.Tween.removeTweens(this._coverBMP);
		if(this._powerupBMP != null) createjs.Tween.removeTweens(this._powerupBMP);
	}
	,dropGemAbove: function() {
		var gemAbove = this._grid.getGemAbove(this);
		if(gemAbove != null) gemAbove.drop();
	}
	,drop: function() {
		if(this._gemBMP.visible) {
			if(this._isZenGlow) this.stopZenGlow();
			var landAt = this._grid.ROW_COUNT - 1;
			if(this._row != landAt) {
				var gemToLandOn = this._grid.getGemBelow(this);
				while(gemToLandOn != null && !gemToLandOn.isAlive() && gemToLandOn.getRow() != landAt) gemToLandOn = this._grid.getGemBelow(gemToLandOn);
				if(gemToLandOn != null) {
					var landPos = Lambda.indexOf(this._grid.gems[this._col],gemToLandOn);
					landAt = this._grid.ROW_COUNT - (this._grid.gems[this._col].length - (landPos + 1)) - 2;
				}
			}
			this._isInPlace = false;
			this._speed = 0.001;
			if(landAt > this._stopAt) {
				this._stopAt = landAt;
				this._stopAtY = landAt * co.doubleduck.Gem.GEM_SIZE + co.doubleduck.Gem.GEM_SIZE / 2;
			}
			this.setRow(this._stopAt);
			this.onTick = $bind(this,this.handleTick);
			co.doubleduck.Utils.waitAndCall(this,10 + Std.random(140),$bind(this,this.dropGemAbove));
		}
	}
	,changeType: function(toType,animated) {
		if(animated == null) animated = false;
		if(!this._isHintGlow && !this._isZenGlow && animated) {
			this.initGlow();
			this._glowBMP.alpha = 1;
			createjs.Tween.get(this._glowBMP).to({ alpha : 0},300,createjs.Ease.sineIn);
		}
		this._gemType = toType;
		createjs.Tween.removeTweens(this._gemBMP);
		this._gemBMP.gotoAndStop("gem" + toType);
		this._gemBMP.alpha = 1;
		if(this._isFocusFaded) this._gemBMP.alpha = co.doubleduck.Gem.FOCUS_FADE;
		if(this._glowBMP != null) this._glowBMP.gotoAndStop("glow" + toType);
		if(this._coverBMP != null) {
			if(this._isHintGlow || this._isZenGlow) this._coverBMP.gotoAndStop("glow_cover" + toType); else this._coverBMP.gotoAndStop("gem_cover" + toType);
		}
	}
	,setNotInPlace: function() {
		this._isInPlace = false;
	}
	,handleRemove: function() {
		if(this.onRemove != null) {
			this.onRemove(this);
			this.onRemove = null;
			this._gemBMP.stop();
		}
	}
	,explode: function() {
		if(this.onExplode != null) {
			this.onExplode(this);
			this.onExplode = null;
			this._isAlive = false;
			var myParent = this.parent;
			if(myParent != null) {
				myParent.removeChild(this);
				myParent.addChild(this);
			}
			this.removeChild(this._gemBMP);
			this.stopHintGlow();
			this.stopZenGlow(true);
			this.removeChild(this._glowBMP);
			if(this._coverBMP != null) {
				if(this._coverBMP.parent != null) this.removeChild(this._coverBMP);
				this._coverBMP = null;
			}
			if(this._powerupBMP != null) {
				if(this._powerupBMP.parent != null) this.removeChild(this._powerupBMP);
				this._powerupBMP = null;
			}
			this._gemBMP = new createjs.BitmapAnimation(co.doubleduck.Gem._explodeSpriteSheet);
			this._gemBMP.gotoAndPlay("explode");
			this._gemBMP.onAnimationEnd = $bind(this,this.handleRemove);
			this.addChild(this._gemBMP);
			if(this.onPowerupActivated != null) {
				if(this._powerup != -1) this.onPowerupActivated(this);
			}
		}
	}
	,stopFocusFade: function() {
		if(this._isFocusFaded) {
			this._isFocusFaded = false;
			createjs.Tween.removeTweens(this._gemBMP);
			createjs.Tween.get(this._gemBMP).to({ alpha : 1},200);
		}
	}
	,startFocusFade: function(force) {
		if(force == null) force = false;
		this._isFocusFaded = true;
		if(force) {
			createjs.Tween.removeTweens(this._gemBMP);
			createjs.Tween.get(this._gemBMP).to({ alpha : co.doubleduck.Gem.FOCUS_FADE},200);
		} else this._gemBMP.alpha = co.doubleduck.Gem.FOCUS_FADE;
	}
	,alphaFade: function() {
		if(this._isFocusFaded) return;
		this._gemBMP.alpha = co.doubleduck.Gem.TAP_ALPHA;
		createjs.Tween.removeTweens(this._gemBMP);
		createjs.Tween.get(this._gemBMP).to({ alpha : 1},750);
	}
	,handleTick: function(elapsed) {
		this._speed += co.doubleduck.Gem.GRAVITY * elapsed;
		this.y += this._speed * elapsed;
		if(this.y >= this._stopAtY) {
			this.onTick = null;
			this.y = this._stopAtY;
			this._stopAt = -1;
			this._speed = 0;
			this._isInPlace = true;
			if(this.onLand != null) this.onLand(this);
		}
	}
	,handleClick: function() {
		if(co.doubleduck.Gem._lastClickTime + co.doubleduck.Gem.CLICK_THRESH_TIME >= createjs.Ticker.getTime(true)) {
			var mouse = new createjs.Point(this.getStage().mouseX,this.getStage().mouseY);
			var dist = Math.abs(mouse.x - co.doubleduck.Gem._lastClickPos.x);
			dist += Math.abs(mouse.y - co.doubleduck.Gem._lastClickPos.y);
			if(dist <= co.doubleduck.Gem.CLICK_THRESH_DIST) return;
		}
		co.doubleduck.Gem._lastClickTime = createjs.Ticker.getTime(true);
		co.doubleduck.Gem._lastClickPos = new createjs.Point(this.getStage().mouseX,this.getStage().mouseY);
		if(this._gemBMP != null && this._gemBMP.alpha == 1) this._gemBMP.alpha = co.doubleduck.Gem.TAP_ALPHA;
		if(this.onGemClick != null) this.onGemClick(this);
	}
	,setPowerup: function(type,force) {
		if(force == null) force = false;
		this._powerup = type;
		this._powerupBMP = co.doubleduck.Powerup.getPowerup(this._powerup);
		if(force) this._powerupBMP.alpha = 1; else {
			this._powerupBMP.alpha = 0;
			createjs.Tween.get(this._powerupBMP).to({ alpha : 1},200);
		}
		this.addChild(this._powerupBMP);
	}
	,coverGlyph: function() {
		this._coverBMP = new createjs.BitmapAnimation(co.doubleduck.Gem._gemSpriteSheet);
		if(this._isHintGlow || this._isZenGlow) this._coverBMP.gotoAndStop("glow_cover" + this._gemType); else this._coverBMP.gotoAndStop("gem_cover" + this._gemType);
		this._coverBMP.alpha = 0;
		this.addChild(this._coverBMP);
		createjs.Tween.get(this._coverBMP).to({ alpha : this._gemBMP.alpha},100);
	}
	,glowPulse: function() {
		createjs.Tween.get(this._glowBMP).to({ alpha : 1},co.doubleduck.Gem.PULSE_TIME).to({ alpha : 0},co.doubleduck.Gem.PULSE_TIME).call($bind(this,this.glowPulse));
	}
	,initGlow: function() {
		if(this._glowBMP == null) {
			this._glowBMP = new createjs.BitmapAnimation(co.doubleduck.Gem._gemSpriteSheet);
			this._glowBMP.gotoAndStop("glow" + this._gemType);
			if(this._powerupBMP != null) this.addChildAt(this._glowBMP,this.getChildIndex(this._powerupBMP)); else this.addChild(this._glowBMP);
			this._glowBMP.alpha = 0;
		}
	}
	,stopZenGlow: function(force) {
		if(force == null) force = false;
		if(this._isZenGlow) {
			this._isZenGlow = false;
			createjs.Tween.removeTweens(this._glowBMP);
			if(force) this._glowBMP.alpha = 0; else createjs.Tween.get(this._glowBMP).to({ alpha : 0},80);
		}
	}
	,startZenGlow: function(force) {
		if(force == null) force = false;
		this.initGlow();
		if(!this._isZenGlow) {
			this._isZenGlow = true;
			if(force) this._glowBMP.alpha = 1; else createjs.Tween.get(this._glowBMP).to({ alpha : 1},120);
		}
	}
	,stopHintGlow: function() {
		if(this._isHintGlow) {
			this._isHintGlow = false;
			createjs.Tween.removeTweens(this._glowBMP);
			this._glowBMP.alpha = 0;
		}
	}
	,startHintGlow: function() {
		this.initGlow();
		if(!this._isHintGlow) {
			this._isHintGlow = true;
			this.glowPulse();
		}
	}
	,_stopAtY: null
	,_stopAt: null
	,_speed: null
	,_isAlive: null
	,_isInPlace: null
	,_hasJustCreated: null
	,_isFocusFaded: null
	,_glowPulseTween: null
	,_isZenGlow: null
	,_isHintGlow: null
	,_powerup: null
	,_powerupBMP: null
	,_coverBMP: null
	,_glowBMP: null
	,_gemBMP: null
	,_gemType: null
	,_col: null
	,_row: null
	,_grid: null
	,onRemove: null
	,onLand: null
	,onPowerupActivated: null
	,onExplode: null
	,onGemClick: null
	,__class__: co.doubleduck.Gem
});
co.doubleduck.GemGrid = $hxClasses["co.doubleduck.GemGrid"] = function(passivePowers,passiveChance) {
	this._shouldPlayDing = false;
	this._groupExplodeBomb = null;
	this._isInSpecialSight = false;
	this._poweredGem = null;
	this._landingTested = false;
	this._hintTime = -1;
	this.COL_COUNT = 7;
	this.ROW_COUNT = 7;
	createjs.Container.call(this);
	this._passivePowerups = passivePowers;
	this._passiveChance = passiveChance;
	this.regX = this.getWidth() / 2;
	this.regY = this.getHeight() / 2;
	this.scaleX = this.scaleY = co.doubleduck.Game.getScale();
	this.x = co.doubleduck.Game.getViewport().width / 2;
	this.y = co.doubleduck.Game.getViewport().height / 2;
	var gridSolvable = false;
	while(!gridSolvable) {
		this.gems = new Array();
		var _g1 = 0, _g = this.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			var newColumn = new Array();
			this.gems[this.gems.length] = newColumn;
			this.fillGemCol(col);
		}
		this._solver = new co.doubleduck.GridSolver(this);
		this._solvingGroups = this._solver.getSolvingGroups();
		if(this._solvingGroups.length >= co.doubleduck.GemGrid.MIN_GROUPS) gridSolvable = true;
	}
	var _g1 = 0, _g = this.COL_COUNT;
	while(_g1 < _g) {
		var col = _g1++;
		this.gems[col][this.ROW_COUNT - 1].drop();
	}
	this.onTick = $bind(this,this.handleTick);
};
co.doubleduck.GemGrid.__name__ = ["co","doubleduck","GemGrid"];
co.doubleduck.GemGrid.__super__ = createjs.Container;
co.doubleduck.GemGrid.prototype = $extend(createjs.Container.prototype,{
	getHeight: function() {
		return this.ROW_COUNT * co.doubleduck.Gem.GEM_SIZE;
	}
	,getWidth: function() {
		return this.COL_COUNT * co.doubleduck.Gem.GEM_SIZE;
	}
	,getGemBelow: function(gem) {
		var gemIndex = Lambda.indexOf(this.gems[gem.getCol()],gem);
		if(gemIndex != -1) {
			if(gemIndex == this.gems[gem.getCol()].length - 1) return null;
			return this.getGem(gemIndex + 1,gem.getCol());
		}
		return null;
	}
	,getGemAbove: function(gem) {
		var gemIndex = Lambda.indexOf(this.gems[gem.getCol()],gem);
		if(gemIndex != -1) {
			if(gemIndex == 0) return null;
			return this.getGem(gemIndex - 1,gem.getCol());
		}
		return null;
	}
	,terminate: function() {
		createjs.Tween.removeTweens(this);
		var _g1 = 0, _g = this.gems.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0, _g2 = this.gems[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				this.gems[i][j].destroy();
				createjs.Tween.removeTweens(this.gems[i][j]);
			}
		}
	}
	,handleGemRemove: function(gem) {
		gem.destroy();
		this.removeChild(gem);
	}
	,activateColorBlast: function(gem) {
		co.doubleduck.SoundManager.playEffect("sound/magic_blast");
		var _g1 = 0, _g = this.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			var _g3 = 0, _g2 = this.ROW_COUNT;
			while(_g3 < _g2) {
				var row = _g3++;
				if(this.getGem(col,row).getType() == gem.getType()) this.getGem(col,row).explode();
			}
		}
	}
	,activateColorSplash: function(gem) {
		var srcType = -1;
		while(srcType == -1) {
			srcType = Std.random(co.doubleduck.Gem.GEMS_COUNT) + 1;
			if(srcType == gem.getType()) srcType = -1;
		}
		var _g1 = 0, _g = this.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			var _g3 = 0, _g2 = this.ROW_COUNT;
			while(_g3 < _g2) {
				var row = _g3++;
				if(this.getGem(col,row).getType() == srcType) this.getGem(col,row).changeType(gem.getType(),true);
			}
		}
	}
	,startSpecialSight: function() {
		this._specialSightEnd = createjs.Ticker.getTime(true) + co.doubleduck.GemGrid.SPECIAL_SIGHT_TIME;
		if(!this._isInSpecialSight) {
			this._isInSpecialSight = true;
			var _g1 = 0, _g = this.COL_COUNT;
			while(_g1 < _g) {
				var col = _g1++;
				var _g3 = 0, _g2 = this.ROW_COUNT;
				while(_g3 < _g2) {
					var row = _g3++;
					this.getGem(row,col).startFocusFade();
				}
			}
		}
	}
	,handleEndLightning: function() {
		this.removeChild(this._lightHoriz);
		this.removeChild(this._lightVerti);
		var _g1 = 0, _g = this._lightningAffected.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._lightningAffected[i].explode();
		}
		this.dropNeededGems();
		this.mouseEnabled = true;
	}
	,startLightningBolt: function(gem) {
		this.mouseEnabled = false;
		co.doubleduck.SoundManager.playEffect("sound/thunder");
		var img = co.doubleduck.Assets.getRawImage("images/gems/lightning.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : img.width, height : img.height / 2, regX : img.width / 2, regY : img.height / 4};
		initObject.animations = { };
		initObject.animations.lightning = { frames : [0,1,0,1,0,1,0,1], frequency : 1};
		var sprites = new createjs.SpriteSheet(initObject);
		if(this._lightHoriz == null) {
			this._lightHoriz = new createjs.BitmapAnimation(sprites);
			this._lightHoriz.rotation = 90;
		}
		this._lightHoriz.gotoAndPlay("lightning");
		this._lightHoriz.x = this.getWidth() / 2;
		this._lightHoriz.y = gem.y;
		this.addChild(this._lightHoriz);
		if(this._lightVerti == null) this._lightVerti = new createjs.BitmapAnimation(sprites);
		this._lightVerti.gotoAndPlay("lightning");
		this._lightVerti.onAnimationEnd = $bind(this,this.handleEndLightning);
		this._lightVerti.x = gem.x;
		this._lightVerti.y = this.getHeight() / 2;
		this.addChild(this._lightVerti);
		this._lightningAffected = new Array();
		var _g1 = 0, _g = this.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			if(col == gem.getCol()) continue;
			this._lightningAffected.push(this.getGem(gem.getRow(),col));
		}
		var _g1 = 0, _g = this.ROW_COUNT;
		while(_g1 < _g) {
			var row = _g1++;
			if(row == gem.getRow()) continue;
			this._lightningAffected.push(this.getGem(row,gem.getCol()));
		}
	}
	,handlePowerupActivated: function(gem) {
		var power = gem.getPowerup() | 0;
		var userInitiated = Lambda.has(this._clickedGroup,gem);
		switch(power) {
		case 1:
			if(userInitiated) {
				this._groupExplodeBomb = gem;
				co.doubleduck.SoundManager.playEffect("sound/bomb");
				this._decorativeSoundActivated = true;
			}
			break;
		case 2:
			if(userInitiated) {
				this.startLightningBolt(gem);
				this._decorativeSoundActivated = true;
			}
			break;
		case 4:
			this.startSpecialSight();
			break;
		case 5:
			this.activateColorSplash(gem);
			break;
		case 7:
			if(userInitiated) {
				this.activateColorBlast(gem);
				this._decorativeSoundActivated = true;
			}
			break;
		default:
		}
		if(this.onPowerupActivated != null) this.onPowerupActivated(gem);
	}
	,handleGemExplode: function(gem) {
		HxOverrides.remove(this.gems[gem.getCol()],gem);
		if(this.onGemBlast != null) this.onGemBlast(gem);
		this.fillGemCol(gem.getCol());
		var _g1 = 0, _g = gem.getRow() + 1;
		while(_g1 < _g) {
			var i = _g1++;
			this.getGem(i,gem.getCol()).setNotInPlace();
		}
		this._shouldPlayDing = true;
		var session = this.parent;
		this._noteToPlay = session.getSpreePercent() * 9 | 0;
	}
	,handleTick: function() {
		if(this._hintTime != -1) {
			if(createjs.Ticker.getTime(true) >= this._hintTime) {
				if(this._solvingGroups.length > 0) {
					this._hintTime = -1;
					if(!this._isInSpecialSight) {
						var group = Std.random(this._solvingGroups.length);
						this._hintGroup = this._solvingGroups[group];
						var _g1 = 0, _g = this._hintGroup.length;
						while(_g1 < _g) {
							var i = _g1++;
							this._hintGroup[i].startHintGlow();
						}
					}
				} else this.addSolvingGroups(co.doubleduck.GemGrid.MIN_GROUPS);
			}
		}
		if(this._isInSpecialSight) {
			if(createjs.Ticker.getTime(true) >= this._specialSightEnd) {
				this._isInSpecialSight = false;
				var _g1 = 0, _g = this.COL_COUNT;
				while(_g1 < _g) {
					var col = _g1++;
					var _g3 = 0, _g2 = this.ROW_COUNT;
					while(_g3 < _g2) {
						var row = _g3++;
						this.getGem(row,col).stopZenGlow();
						this.getGem(row,col).stopFocusFade();
					}
				}
				this._hintTime = createjs.Ticker.getTime(true) + co.doubleduck.GemGrid.HINT_INTERVAL;
			}
		}
	}
	,dropNeededGems: function() {
		var _g1 = 0, _g = this.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			var inPlace = true;
			var row = this.ROW_COUNT - 1;
			while(inPlace && row >= 0) {
				inPlace = this.getGem(row,col).isInPlace();
				inPlace = inPlace && this.getGem(row,col).isAlive();
				row--;
			}
			row++;
			if(row == 0 && inPlace) continue;
			if(row >= 0 && row < this.ROW_COUNT) this.getGem(row,col).drop();
		}
	}
	,addSolvingGroups: function(atLeast) {
		while(this._solvingGroups.length < atLeast) {
			var newGroupsToAdd = atLeast - this._solvingGroups.length;
			var _g = 0;
			while(_g < newGroupsToAdd) {
				var i = _g++;
				var randCol = Std.random(this.COL_COUNT - 2) + 1;
				var randRow = Std.random(this.ROW_COUNT - 2) + 1;
				if(Std.random(2) == 0) this.getGem(randRow + 1,randCol).changeType(this.getGem(randRow,randCol).getType()); else this.getGem(randRow - 1,randCol).changeType(this.getGem(randRow,randCol).getType());
				if(Std.random(2) == 0) this.getGem(randRow,randCol + 1).changeType(this.getGem(randRow,randCol).getType()); else this.getGem(randRow,randCol - 1).changeType(this.getGem(randRow,randCol).getType());
			}
			this._solvingGroups = this._solver.getSolvingGroups();
		}
	}
	,handleGemLand: function(gem) {
		var movingGems = 0;
		var _g1 = 0, _g = this.gems.length;
		while(_g1 < _g) {
			var col = _g1++;
			var _g3 = 0, _g2 = this.gems[col].length;
			while(_g3 < _g2) {
				var row = _g3++;
				if(this.gems[col][row].getSpeed() != 0) movingGems++;
			}
		}
		if(movingGems == 0) {
			if(!this._landingTested) {
				this._landingTested = true;
				this._solvingGroups = this._solver.getSolvingGroups();
				this.addSolvingGroups(co.doubleduck.GemGrid.MIN_GROUPS);
				this._hintTime = createjs.Ticker.getTime(true) + co.doubleduck.GemGrid.HINT_INTERVAL;
				if(this._isInSpecialSight) {
					if(createjs.Ticker.getTime(true) + co.doubleduck.GemGrid.SIGHT_STOP_THRESH >= this._specialSightEnd) this._specialSightEnd = createjs.Ticker.getTime(true) - 1; else {
						co.doubleduck.SoundManager.playEffect("sound/special_sight");
						if(this._prevSolvingGroups != null) {
							var _g1 = 0, _g = this._prevSolvingGroups.length;
							while(_g1 < _g) {
								var group = _g1++;
								var _g3 = 0, _g2 = this._prevSolvingGroups[group].length;
								while(_g3 < _g2) {
									var i = _g3++;
									if(this._prevSolvingGroups[group][i] != null) this._prevSolvingGroups[group][i].stopZenGlow();
								}
							}
						}
						var _g1 = 0, _g = this._solvingGroups.length;
						while(_g1 < _g) {
							var group = _g1++;
							var _g3 = 0, _g2 = this._solvingGroups[group].length;
							while(_g3 < _g2) {
								var i = _g3++;
								this._solvingGroups[group][i].startZenGlow();
							}
						}
					}
				}
				this._prevSolvingGroups = this._solvingGroups;
				if(this.onReadyForPowerup != null) this.onReadyForPowerup();
			}
		} else this._landingTested = false;
	}
	,handleGemClick: function(gem) {
		this._clickedGroup = new Array();
		if(this._solver.isInSolvingGroup(gem,this._clickedGroup)) {
			if(this._isInSpecialSight) {
				var _g1 = 0, _g = this.COL_COUNT;
				while(_g1 < _g) {
					var col = _g1++;
					var _g3 = 0, _g2 = this.ROW_COUNT;
					while(_g3 < _g2) {
						var row = _g3++;
						this.getGem(row,col).stopZenGlow();
					}
				}
			}
			this._decorativeSoundActivated = false;
			var _g1 = 0, _g = this._clickedGroup.length;
			while(_g1 < _g) {
				var i = _g1++;
				this._clickedGroup[i].explode();
			}
			if(!this._decorativeSoundActivated) {
				var effectNum = Std.random(3) + 1;
				co.doubleduck.SoundManager.playEffect("sound/blast" + effectNum,0.4,true);
			}
			if(this._groupExplodeBomb != null) {
				var gemsToExplode = new Array();
				var _g1 = 0, _g = this._clickedGroup.length;
				while(_g1 < _g) {
					var i = _g1++;
					var _g2 = -1;
					while(_g2 < 2) {
						var posx = _g2++;
						var _g3 = -1;
						while(_g3 < 2) {
							var posy = _g3++;
							if(posx == 0 && posy == 0) continue;
							var currGem = this.getGem(this._clickedGroup[i].getRow() + posy,this._clickedGroup[i].getCol() + posx);
							if(currGem != null && !Lambda.has(this._clickedGroup,currGem)) currGem.explode();
						}
					}
				}
				this._groupExplodeBomb = null;
			}
			this.dropNeededGems();
			this._hintTime = -1;
			if(this._hintGroup != null) {
				if(this.getChildIndex(this._hintGroup[0]) != -1) {
					var _g1 = 0, _g = this._hintGroup.length;
					while(_g1 < _g) {
						var i = _g1++;
						this._hintGroup[i].stopHintGlow();
					}
				}
			}
			if(this._shouldPlayDing) {
				this._shouldPlayDing = false;
				if(this._noteToPlay > 8) co.doubleduck.SoundManager.playEffect("sound/gem_ding_last"); else if(this._noteToPlay >= 0 && this._noteToPlay <= 8) co.doubleduck.SoundManager.playEffect("sound/gem_ding" + this._noteToPlay);
			}
		} else {
			if(!this._isInSpecialSight) {
				var _g1 = 0, _g = this._clickedGroup.length;
				while(_g1 < _g) {
					var i = _g1++;
					this._clickedGroup[i].alphaFade();
				}
			}
			if(this.onWrongGroup != null) this.onWrongGroup();
		}
	}
	,placePowerup: function() {
		this._poweredGem.setPowerup(this._powerupType);
	}
	,launchPowerup: function(type) {
		var applicableGems = new Array();
		var _g1 = 0, _g = this._solvingGroups.length;
		while(_g1 < _g) {
			var i = _g1++;
			applicableGems = applicableGems.concat(this._solvingGroups[i]);
		}
		this._poweredGem = null;
		while(this._poweredGem == null) {
			var pos = Std.random(applicableGems.length);
			this._poweredGem = applicableGems[pos];
			if(this._poweredGem.getPowerup() != -1) this._poweredGem = null;
		}
		this._powerupType = type;
		this._poweredGem.coverGlyph();
		return this.localToGlobal(this._poweredGem.x,this._poweredGem.y);
	}
	,getGem: function(row,col) {
		if(row < 0 || row >= this.ROW_COUNT || (col < 0 || col >= this.COL_COUNT)) return null;
		return this.gems[col][row];
	}
	,fillGemCol: function(col) {
		var gemsToAdd = this.ROW_COUNT - this.gems[col].length;
		var _g = 0;
		while(_g < gemsToAdd) {
			var gemIndex = _g++;
			var newGem = co.doubleduck.Gem.createGem(Std.random(5) + 1,this);
			newGem.setRow(gemsToAdd - (gemIndex + 1));
			newGem.setCol(col);
			newGem.x = newGem.getCol() * co.doubleduck.Gem.GEM_SIZE + co.doubleduck.Gem.GEM_SIZE / 2;
			newGem.y = -this.y;
			newGem.onGemClick = $bind(this,this.handleGemClick);
			newGem.onExplode = $bind(this,this.handleGemExplode);
			newGem.onPowerupActivated = $bind(this,this.handlePowerupActivated);
			newGem.onLand = $bind(this,this.handleGemLand);
			newGem.onRemove = $bind(this,this.handleGemRemove);
			if(this._isInSpecialSight) newGem.startFocusFade(true);
			if(this._passivePowerups.length > 0) {
				if(Math.random() <= this._passiveChance) {
					newGem.coverGlyph();
					var power = this._passivePowerups[Std.random(this._passivePowerups.length)];
					newGem.setPowerup(power,true);
				}
			}
			this.addChild(newGem);
			this.gems[col].unshift(newGem);
		}
	}
	,_noteToPlay: null
	,_shouldPlayDing: null
	,_lightningAffected: null
	,_lightVerti: null
	,_lightHoriz: null
	,_clickedGroup: null
	,_groupExplodeBomb: null
	,_specialSightEnd: null
	,_isInSpecialSight: null
	,_powerupType: null
	,_poweredGem: null
	,_passiveChance: null
	,_passivePowerups: null
	,_decorativeSoundActivated: null
	,_landingTested: null
	,_hintGroup: null
	,_hintTime: null
	,_prevSolvingGroups: null
	,_solvingGroups: null
	,_solver: null
	,gems: null
	,COL_COUNT: null
	,ROW_COUNT: null
	,onWrongGroup: null
	,onPowerupActivated: null
	,onGemBlast: null
	,onReadyForPowerup: null
	,__class__: co.doubleduck.GemGrid
});
co.doubleduck.GridSolver = $hxClasses["co.doubleduck.GridSolver"] = function(grid) {
	this.CONT_VISITED = 1;
	this.CONT_NONE = 0;
	this.MIN_GEMS_TO_SOLVE = 3;
	this._grid = grid;
};
co.doubleduck.GridSolver.__name__ = ["co","doubleduck","GridSolver"];
co.doubleduck.GridSolver.prototype = {
	getGroupByGem: function(gem,context,sourceType) {
		if(context == null) {
			context = new Array();
			var _g1 = 0, _g = this._grid.COL_COUNT;
			while(_g1 < _g) {
				var col = _g1++;
				var newColumn = new Array();
				var _g3 = 0, _g2 = this._grid.ROW_COUNT;
				while(_g3 < _g2) {
					var row = _g3++;
					newColumn[newColumn.length] = this.CONT_NONE;
				}
				context[context.length] = newColumn;
			}
			return this.getGroupByGem(gem,context,gem.getType());
		}
		if(context[gem.getCol()][gem.getRow()] == this.CONT_NONE && gem.isRelevantForSolve()) {
			var gemGroup = new Array();
			context[gem.getCol()][gem.getRow()] = this.CONT_VISITED;
			if(gem.isRelevantForSolve() && gem.getType() == sourceType) {
				gemGroup[gemGroup.length] = gem;
				if(gem.getRow() > 0) {
					var gemUp = this._grid.getGem(gem.getRow() - 1,gem.getCol());
					if(gemUp != null && gemUp.isRelevantForSolve()) gemGroup = gemGroup.concat(this.getGroupByGem(gemUp,context,sourceType));
				}
				if(gem.getCol() < this._grid.COL_COUNT - 1) {
					var gemRight = this._grid.getGem(gem.getRow(),gem.getCol() + 1);
					if(gemRight != null && gemRight.isRelevantForSolve()) gemGroup = gemGroup.concat(this.getGroupByGem(gemRight,context,sourceType));
				}
				if(gem.getRow() < this._grid.ROW_COUNT - 1) {
					var gemDown = this._grid.getGem(gem.getRow() + 1,gem.getCol());
					if(gemDown != null && gemDown.isRelevantForSolve()) gemGroup = gemGroup.concat(this.getGroupByGem(gemDown,context,sourceType));
				}
				if(gem.getCol() > 0) {
					var gemLeft = this._grid.getGem(gem.getRow(),gem.getCol() - 1);
					if(gemLeft != null && gemLeft.isRelevantForSolve()) gemGroup = gemGroup.concat(this.getGroupByGem(gemLeft,context,sourceType));
				}
			}
			return gemGroup;
		} else return new Array();
	}
	,isInGroupBySize: function(gem,minSize,gemGroup) {
		var gotGroup = this.getGroupByGem(gem);
		if(gemGroup != null) {
			var _g1 = 0, _g = gotGroup.length;
			while(_g1 < _g) {
				var i = _g1++;
				gemGroup[i] = gotGroup[i];
			}
		}
		if(gemGroup.length >= this.MIN_GEMS_TO_SOLVE) return true;
		return false;
	}
	,isInSolvingGroup: function(gem,gemGroup) {
		return this.isInGroupBySize(gem,this.MIN_GEMS_TO_SOLVE,gemGroup);
	}
	,getGroupsBySize: function(size,stopAt) {
		if(stopAt == null) stopAt = -1;
		var groups = new Array();
		var tested = new Array();
		var count = 0;
		var _g1 = 0, _g = this._grid.gems.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0, _g2 = this._grid.gems[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				count++;
			}
		}
		if(count != this._grid.COL_COUNT * this._grid.ROW_COUNT) null;
		var _g1 = 0, _g = this._grid.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			tested[col] = new Array();
			var _g3 = 0, _g2 = this._grid.ROW_COUNT;
			while(_g3 < _g2) {
				var row = _g3++;
				tested[col][row] = false;
			}
		}
		var group = new Array();
		var _g1 = 0, _g = this._grid.COL_COUNT;
		while(_g1 < _g) {
			var col = _g1++;
			var _g3 = 0, _g2 = this._grid.ROW_COUNT;
			while(_g3 < _g2) {
				var row = _g3++;
				if(tested[col][row]) continue;
				if(this.isInSolvingGroup(this._grid.gems[col][row],group)) {
					groups[groups.length] = group.slice();
					if(stopAt != -1 && groups.length == stopAt) return groups;
				}
				var _g5 = 0, _g4 = group.length;
				while(_g5 < _g4) {
					var i = _g5++;
					tested[group[i].getCol()][group[i].getRow()] = true;
				}
				group = new Array();
			}
		}
		return groups;
	}
	,getSolvingGroups: function(stopAt) {
		if(stopAt == null) stopAt = -1;
		return this.getGroupsBySize(this.MIN_GEMS_TO_SOLVE,stopAt);
	}
	,_grid: null
	,CONT_VISITED: null
	,CONT_NONE: null
	,MIN_GEMS_TO_SOLVE: null
	,__class__: co.doubleduck.GridSolver
}
co.doubleduck.HUD = $hxClasses["co.doubleduck.HUD"] = function() {
	this._availablePowerup = null;
	this._scoreTxt = null;
	this.onMenuClick = null;
	this.onRestart = null;
	this.onPauseClick = null;
	createjs.Container.call(this);
	this._pauseScreenBG = new createjs.Shape();
	this._pauseScreenBG.graphics.beginFill("#000000");
	this._pauseScreenBG.graphics.drawRect(0,0,co.doubleduck.Game.getViewport().width,co.doubleduck.Game.getViewport().height);
	this._pauseScreenBG.graphics.endFill();
	this._pauseScreenBG.alpha = 0.5;
	this._pauseScreenBG.visible = false;
	this._pauseBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/hud/pause_btn.png"));
	this._pauseBtn.regX = this._pauseBtn.image.width;
	this._pauseBtn.regY = this._pauseBtn.image.height / 2;
	this._pauseBtn.scaleX = this._pauseBtn.scaleY = co.doubleduck.Game.getScale();
	this._pauseBtn.x = co.doubleduck.Game.getViewport().width - 10 * co.doubleduck.Game.getScale();
	this._pauseBtn.y = 45 * co.doubleduck.Game.getScale();
	this._pauseBtn.onClick = $bind(this,this.handlePauseClick);
	createjs.Ticker.addListener(this,false);
	this.addChild(this._pauseBtn);
	this._pauseBtnScreenTitle = co.doubleduck.Assets.getImage("images/hud/paused.png");
	this._pauseBtnScreenTitle.regX = this._pauseBtnScreenTitle.image.width / 2;
	this._pauseBtnScreenTitle.regY = this._pauseBtnScreenTitle.image.height / 2;
	this._pauseBtnScreenTitle.scaleX = this._pauseBtnScreenTitle.scaleY = co.doubleduck.Game.getScale();
	this._pauseBtnScreenTitle.x = co.doubleduck.Game.getViewport().width / 2;
	this._pauseBtnScreenTitle.y = co.doubleduck.Game.getViewport().height * 0.4;
	this._pauseScreenBtnRestart = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/hud/replay_btn.png"),false);
	this._pauseScreenBtnRestart.regX = this._pauseScreenBtnRestart.image.width / 2;
	this._pauseScreenBtnRestart.regY = this._pauseScreenBtnRestart.image.height / 2;
	this._pauseScreenBtnRestart.scaleX = this._pauseScreenBtnRestart.scaleY = co.doubleduck.Game.getScale();
	this._pauseScreenBtnRestart.x = co.doubleduck.Game.getViewport().width / 2;
	this._pauseScreenBtnRestart.y = co.doubleduck.Game.getViewport().height * 0.55;
	this._pauseScreenBtnRestart.onClick = $bind(this,this.handleRestartClick);
	this._pauseScreenBtnResume = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/hud/resume_btn.png"),false);
	this._pauseScreenBtnResume.regX = this._pauseScreenBtnResume.image.width / 2;
	this._pauseScreenBtnResume.regY = this._pauseScreenBtnResume.image.height / 2;
	this._pauseScreenBtnResume.scaleX = this._pauseScreenBtnResume.scaleY = co.doubleduck.Game.getScale();
	this._pauseScreenBtnResume.onClick = $bind(this,this.handlePauseClick);
	this._pauseScreenBtnResume.y = this._pauseScreenBtnRestart.y;
	this._pauseScreenBtnResume.x = this._pauseScreenBtnRestart.x + this._pauseScreenBtnRestart.image.width * co.doubleduck.Game.getScale() + 15 * co.doubleduck.Game.getScale();
	this._pauseScreenBtnMenu = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/hud/menu_btn.png"),false);
	this._pauseScreenBtnMenu.regX = this._pauseScreenBtnMenu.image.width / 2;
	this._pauseScreenBtnMenu.regY = this._pauseScreenBtnMenu.image.height / 2;
	this._pauseScreenBtnMenu.scaleX = this._pauseScreenBtnMenu.scaleY = co.doubleduck.Game.getScale();
	this._pauseScreenBtnMenu.y = this._pauseScreenBtnRestart.y;
	this._pauseScreenBtnMenu.x = this._pauseScreenBtnRestart.x - this._pauseScreenBtnRestart.image.width * co.doubleduck.Game.getScale() - 15 * co.doubleduck.Game.getScale();
	this._pauseScreenBtnMenu.onClick = $bind(this,this.handleMenuClick);
	this._clockStroke = co.doubleduck.Assets.getImage("images/hud/clock_empty.png");
	this._clockStroke.regY = this._clockStroke.image.height / 2;
	this._clockStroke.regX = this._clockStroke.image.width;
	this._clockStroke.y = this._pauseBtn.y;
	this._clockStroke.x = this._pauseBtn.x - this._pauseBtn.image.width * 0.6 * co.doubleduck.Game.getScale();
	this._clockStroke.scaleX = this._clockStroke.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._clockStroke);
	this._clockFill = new co.doubleduck.Clock();
	this._clockFill.y = this._clockStroke.y;
	this._clockFill.x = this._pauseBtn.x - this._pauseBtn.image.width * 0.6 * co.doubleduck.Game.getScale() - this._clockFill.image.width * co.doubleduck.Game.getScale() / 2;
	this._clockFill.scaleX = this._clockFill.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._clockFill);
	this._scoreBar = co.doubleduck.Assets.getImage("images/hud/score_bar.png");
	this._scoreBar.regY = this._scoreBar.image.height / 2;
	this._scoreBar.regX = this._scoreBar.image.width;
	this._scoreBar.x = this._clockStroke.x - this._clockStroke.image.width * co.doubleduck.Game.getScale();
	this._scoreBar.y = this._clockStroke.y;
	this._scoreBar.scaleX = this._scoreBar.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._scoreBar);
	this._barStroke = co.doubleduck.Assets.getImage("images/hud/bar_empty.png");
	this._barStroke.regY = this._barStroke.image.height / 2;
	this._barStroke.regX = this._barStroke.image.width;
	this._barStroke.x = this._scoreBar.x - this._scoreBar.image.width * 0.95 * co.doubleduck.Game.getScale();
	this._barStroke.y = this._clockStroke.y;
	this._barStroke.scaleX = this._barStroke.scaleY = co.doubleduck.Game.getScale();
	this.addChildAt(this._barStroke,this.getChildIndex(this._scoreBar) - 1);
	this._barFill = co.doubleduck.Assets.getImage("images/hud/bar_fill.png");
	this._barFill.regY = this._barFill.image.height / 2;
	this._barFill.regX = this._barFill.image.width;
	this._barFill.x = this._barStroke.x;
	this._barFill.y = this._barStroke.y;
	this._barFill.scaleX = this._barFill.scaleY = co.doubleduck.Game.getScale();
	this.addChildAt(this._barFill,this.getChildIndex(this._scoreBar) - 1);
	this._spreeMask = new createjs.Shape();
	this._spreeMask.graphics.beginFill("#000000");
	this._spreeMask.graphics.drawRect(this._barFill.x,this._barFill.y,this._barFill.image.width * co.doubleduck.Game.getScale(),this._barFill.image.height * co.doubleduck.Game.getScale());
	this._spreeMask.graphics.endFill();
	this._spreeMask.regY = this._barFill.image.height / 2;
	this._spreeMask.regX = this._barFill.image.width * co.doubleduck.Game.getScale();
	this._spreeMask.x -= this._barFill.image.width * co.doubleduck.Game.getScale();
	this._barFill.mask = this._spreeMask;
	this._font = new co.doubleduck.FontHelper(co.doubleduck.FontHelper.FONT_REGULAR);
	this._hudFont = new co.doubleduck.FontHelper(co.doubleduck.FontHelper.FONT_HUD);
	this.setScore(0);
	if(co.doubleduck.Game.DEBUG) {
		this._fps = new createjs.Text("0","Arial 22px","#FF0000");
		this.addChild(this._fps);
		this._fps.x = co.doubleduck.Game.getViewport().width - 100;
		this._fps.y = 250;
		createjs.Ticker.addListener(this);
	}
	this.regY = this.getHeight();
};
co.doubleduck.HUD.__name__ = ["co","doubleduck","HUD"];
co.doubleduck.HUD.__super__ = createjs.Container;
co.doubleduck.HUD.prototype = $extend(createjs.Container.prototype,{
	removeSecs: function() {
		this.removeChild(this._secondsTweened);
	}
	,tweenTimeBonus: function(secsNum,sourcePoint,scale) {
		var locPoint = this.globalToLocal(sourcePoint.x,sourcePoint.y);
		this._secondsTweened = this._font.getNumber(secsNum,1,true);
		this._secondsTweened.x = locPoint.x;
		this._secondsTweened.y = locPoint.y;
		this._secondsTweened.scaleX = this._secondsTweened.scaleY = scale;
		this.addChild(this._secondsTweened);
		this._secondsTweened.alpha = 0;
		createjs.Tween.get(this._secondsTweened).to({ alpha : 1},500,createjs.Ease.sineOut).to({ alpha : 0},500,createjs.Ease.sineIn);
		createjs.Tween.get(this._secondsTweened).to({ x : this._secondsLeft.x, y : this._secondsLeft.y},1000,createjs.Ease.sineOut).call($bind(this,this.removeSecs));
	}
	,fadeOutPowerup: function() {
		createjs.Tween.get(this._availablePowerup).wait(100).to({ alpha : 0},500);
	}
	,tweenPowerup: function(loc,cb) {
		loc = this.globalToLocal(loc.x,loc.y);
		createjs.Tween.get(this._availablePowerup).to({ scaleX : co.doubleduck.Game.getScale() * 1.5, scaleY : co.doubleduck.Game.getScale() * 1.5},250).to({ scaleX : co.doubleduck.Game.getScale(), scaleY : co.doubleduck.Game.getScale()},250).to({ x : loc.x, y : loc.y},350).wait(390).call(cb);
	}
	,getHeight: function() {
		return this._clockStroke.image.height * co.doubleduck.Game.getScale();
	}
	,setSpreeProgression: function(progression) {
		if(progression > 1) return;
		var deltaX = this._barFill.image.width * co.doubleduck.Game.getScale() * progression;
		createjs.Tween.removeTweens(this._spreeMask);
		createjs.Tween.get(this._spreeMask).to({ x : deltaX - this._barFill.image.width * co.doubleduck.Game.getScale()},500);
	}
	,setRemainingTime: function(secs,progress) {
		if(this._secondsLeft != null) {
			this.removeChild(this._secondsLeft);
			this._secondsLeft = null;
		}
		this._secondsLeft = this._font.getNumber(secs,1,true);
		this._secondsLeft.x = this._clockFill.x;
		this._secondsLeft.y = this._clockFill.y;
		this._secondsLeft.scaleX = this._secondsLeft.scaleY = co.doubleduck.Game.getScale();
		this.addChild(this._secondsLeft);
		if(progress == 0) this._clockFill.visible = false; else this._clockFill.setProgress(progress);
	}
	,setPauseOverlay: function(flag) {
		this._pauseScreenBG.visible = flag;
		if(flag) {
			this.addChild(this._pauseScreenBG);
			this.addChild(this._pauseBtnScreenTitle);
			this.addChild(this._pauseScreenBtnRestart);
			this.addChild(this._pauseScreenBtnResume);
			this.addChild(this._pauseScreenBtnMenu);
			this._pauseBtn.mouseEnabled = false;
		} else {
			this.removeChild(this._pauseScreenBG);
			this.removeChild(this._pauseBtnScreenTitle);
			this.removeChild(this._pauseScreenBtnRestart);
			this.removeChild(this._pauseScreenBtnResume);
			this.removeChild(this._pauseScreenBtnMenu);
			this._pauseBtn.mouseEnabled = true;
		}
		co.doubleduck.Game.getStage().update();
	}
	,tick: function() {
		if(co.doubleduck.Game.DEBUG) this._fps.text = "" + createjs.Ticker.getMeasuredFPS();
	}
	,setScore: function(score) {
		if(this._scoreTxt != null) {
			this.removeChild(this._scoreTxt);
			this._scoreTxt = null;
		}
		this._scoreTxt = this._hudFont.getNumber(score,1,true);
		this._scoreTxt.scaleX = this._scoreTxt.scaleY = co.doubleduck.Game.getScale();
		this._scoreTxt.x = this._scoreBar.x - this._scoreBar.image.width * 2 / 5 * co.doubleduck.Game.getScale();
		this._scoreTxt.y = this._scoreBar.y;
		this.addChild(this._scoreTxt);
	}
	,handlePauseClick: function() {
		if(this.onPauseClick != null) this.onPauseClick();
	}
	,handleRestartClick: function() {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart();
		}
	}
	,setAvailablePowerup: function(type) {
		if(this._availablePowerup != null) this.removeChild(this._availablePowerup);
		this._availablePowerup = co.doubleduck.Powerup.getPowerupBlock(type);
		this._availablePowerup.scaleX = this._availablePowerup.scaleY = co.doubleduck.Game.getScale();
		this._availablePowerup.x = this._scoreBar.x - this._scoreBar.image.width * 0.85 * co.doubleduck.Game.getScale();
		this._availablePowerup.y = this._scoreBar.y;
		this._availablePowerup.alpha = 0;
		createjs.Tween.get(this._availablePowerup).to({ alpha : 1},500);
		this.addChild(this._availablePowerup);
	}
	,handleMenuClick: function() {
		if(this.onMenuClick != null) {
			createjs.Ticker.setPaused(false);
			this.onMenuClick();
		}
	}
	,_secondsTweened: null
	,_pauseScreenBtnResume: null
	,_pauseScreenBtnRestart: null
	,_pauseScreenBtnMenu: null
	,_pauseBtnScreenTitle: null
	,_pauseScreenBG: null
	,_pauseBtn: null
	,_secondsLeft: null
	,_clockFill: null
	,_clockStroke: null
	,_availablePowerup: null
	,_spreeMask: null
	,_scoreTxt: null
	,_hudFont: null
	,_font: null
	,_scoreBar: null
	,_barFill: null
	,_barStroke: null
	,_fps: null
	,onMenuClick: null
	,onRestart: null
	,onPauseClick: null
	,__class__: co.doubleduck.HUD
});
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isApplicable = /Firefox/.test(navigator.userAgent);
	if(isApplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function(sessionScore,highscore) {
	if(highscore == null) highscore = false;
	if(sessionScore == null) sessionScore = 0;
	this._playClicked = false;
	this._displayingScore = false;
	this.SCROLL_EASE = 0.01;
	this.LEVELS_PER_PACK = 4;
	this.PACK_ROW_POS = 0.5;
	createjs.Container.call(this);
	this._sessionScore = sessionScore;
	if(co.doubleduck.Game.getUnlockedLevelNum(co.doubleduck.Persistence.getXP()) == new LevelDB().getAllLevels().length) this._sessionScore = 0;
	this._highScore = highscore;
	this._background = co.doubleduck.Assets.getImage("images/menu/bg.png");
	this._background.scaleX = this._background.scaleY = co.doubleduck.Game.getScale();
	this._background.regX = this._background.image.width / 2;
	this._background.regY = this._background.image.height / 2;
	this._background.x = co.doubleduck.Game.getViewport().width / 2;
	this._background.y = co.doubleduck.Game.getViewport().height / 2;
	this.addChildAt(this._background,0);
	this._levelsData = new LevelDB();
	var scrollOpenedCB = $bind(this,this.menuScrollOpened);
	if(co.doubleduck.Persistence.getXP() == 0) scrollOpenedCB = $bind(this,this.helpScrollOpened);
	this._scroll = new co.doubleduck.Scroll(370);
	this._scroll.scaleX = this._scroll.scaleY = co.doubleduck.Game.getScale();
	this._scroll.x = -this._scroll.getWidth() * co.doubleduck.Game.getScale();
	this._scroll.y = co.doubleduck.Game.getViewport().height / 2;
	this.addChild(this._scroll);
	createjs.Tween.get(this._scroll).to({ x : co.doubleduck.Game.getViewport().width / 2},237,createjs.Ease.sineOut).call(($_=this._scroll,$bind($_,$_.open)));
	this._scroll.onOpen = scrollOpenedCB;
	this._currProgression = 0;
	co.doubleduck.Game.playMusic();
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.__super__ = createjs.Container;
co.doubleduck.Menu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		co.doubleduck.Game.stopMusic();
		this.onStart = null;
	}
	,fadeIn: function(object) {
		if(object == null) return;
		createjs.Tween.get(object).to({ alpha : 1},250);
	}
	,fadeOut: function(object) {
		if(object == null) return;
		if(this._playClicked) object.visible = false;
		createjs.Tween.removeTweens(object);
		createjs.Tween.get(object).to({ alpha : 0},150);
	}
	,fadeMenuOut: function() {
		this.fadeOut(this._playerLevel);
		this.fadeOut(this._playerLevelTxt);
		this.fadeOut(this._playButton);
		this.fadeOut(this._levelBarFill);
		this.fadeOut(this._levelBarStroke);
		this.fadeOut(this._helpBtn);
		this.fadeOut(this._box);
		this.fadeOut(this._newUnlockable);
		this.fadeOut(this._nextLevelUnlocksTitle);
		this.fadeOut(this._scoreBonusContainer);
		this.fadeOut(this._highscoreDisplay);
		this.fadeOut(this._muteButton);
		if(this._scoreDisplay != null) this._scoreDisplay.alpha = 0;
	}
	,handleLevelClick: function() {
		this._playClicked = true;
		this.fadeMenuOut();
		this._scroll.onClose = this.onStart;
		this._scroll.close();
	}
	,removeHelpScreen: function() {
		if(this._helpScreenShown) return;
		this._closeHelpBtn.visible = false;
		this._helpScreen.visible = false;
	}
	,closeHelp: function() {
		this._closeHelpBtn.onClick = null;
		this._helpScreenShown = false;
		this._helpBtn.onClick = $bind(this,this.showHelp);
		createjs.Tween.get(this._closeHelpBtn).to({ alpha : 0},500);
		createjs.Tween.get(this._helpScreen).to({ alpha : 0},600).call($bind(this,this.removeHelpScreen));
	}
	,showHelpCloseButton: function() {
		this._closeHelpBtn.alpha = 0;
		this._closeHelpBtn.onClick = $bind(this,this.closeHelp);
		createjs.Tween.get(this._closeHelpBtn).to({ alpha : 1},500);
	}
	,increaseLevel: function() {
		this.resetPlayerProgression();
		this._currLevel += 1;
		this._playerLevelTxt = this._bmpFont.getNumber(this._currLevel,1,true);
		this._playerLevelTxt.scaleX = this._playerLevelTxt.scaleY = co.doubleduck.Game.getScale();
		this._playerLevelTxt.x = this._playerLevel.x;
		this._playerLevelTxt.y = this._playerLevel.y + this._playerLevel.image.height * co.doubleduck.Game.getScale() * 0.08;
		this._playerLevelTxt.alpha = 0;
		createjs.Tween.get(this._playerLevelTxt).to({ alpha : 1},500);
		this.addChild(this._playerLevelTxt);
		this.setLevelProgression(this._currProgression);
	}
	,puffStar: function() {
		var star = co.doubleduck.Assets.getImage("images/menu/level_star.png");
		star.regX = star.image.width / 2;
		star.regY = star.image.height / 2;
		star.scaleX = star.scaleY = co.doubleduck.Game.getScale();
		star.x = this._playerLevel.x;
		star.y = this._playerLevel.y;
		star.alpha = 0.95;
		this.addChild(star);
		createjs.Tween.get(star).to({ alpha : 0.8, scaleX : co.doubleduck.Game.getScale() * 1.5, scaleY : co.doubleduck.Game.getScale() * 1.5},100,createjs.Ease.sineOut).to({ alpha : 0, scaleX : co.doubleduck.Game.getScale() * 3, scaleY : co.doubleduck.Game.getScale() * 3},800,createjs.Ease.sineOut).call($bind(this,this.increaseLevel));
	}
	,levelUp: function() {
		co.doubleduck.SoundManager.playEffect("sound/level_up");
		this.removeChild(this._playerLevelTxt);
		this.puffStar();
		createjs.Tween.get(this._playerLevel).to({ scaleX : co.doubleduck.Game.getScale() * 1.5, scaleY : co.doubleduck.Game.getScale() * 1.5},100,createjs.Ease.sineOut).to({ scaleX : co.doubleduck.Game.getScale(), scaleY : co.doubleduck.Game.getScale()},250,createjs.Ease.sineIn);
	}
	,resetPlayerProgression: function() {
		this._levelBarMask.x = -1 * this._levelBarFill.image.width / 2 * co.doubleduck.Game.getScale();
	}
	,removeChaz: function() {
		createjs.Tween.get(this._happyChaz).to({ y : co.doubleduck.Game.getViewport().height + this._happyChaz.image.height * co.doubleduck.Game.getScale()},200,createjs.Ease.sineOut);
	}
	,scoreTransition: function() {
		if(this._scoreDisplay != null) this._scoreDisplay.alpha = 0;
		if(this._highscoreStamp != null) createjs.Tween.get(this._highscoreStamp).to({ alpha : 0},50);
		this.removeChaz();
		co.doubleduck.SoundManager.playEffect("sound/transition");
		createjs.Tween.get(this._box).to({ scaleY : 0},180,createjs.Ease.sineIn).to({ scaleY : co.doubleduck.Game.getScale()},180,createjs.Ease.sineOut).call($bind(this,this.showNextLevelUnlocks));
	}
	,setLevelProgression: function(progression,noTween) {
		if(noTween == null) noTween = false;
		var startX = -1 * this._levelBarFill.image.width / 2 * co.doubleduck.Game.getScale();
		if(noTween) this._levelBarMask.x = startX + this._levelBarFill.image.width * co.doubleduck.Game.getScale() * progression; else if(progression < this._currProgression) createjs.Tween.get(this._levelBarMask).to({ x : startX + this._levelBarFill.image.width * co.doubleduck.Game.getScale()},1000).call($bind(this,this.levelUp)); else createjs.Tween.get(this._levelBarMask).to({ x : startX + this._levelBarFill.image.width * co.doubleduck.Game.getScale() * progression},1000).call($bind(this,this.showHighscore)).wait(1500).call($bind(this,this.removeChaz));
		this._currProgression = progression;
	}
	,showHighscore: function() {
		var highscore = co.doubleduck.Persistence.getHighscore();
		if(highscore == 0 || this._playClicked) return;
		var pxSize = 22 * co.doubleduck.Game.getScale() | 0;
		this._highscoreDisplay = new createjs.Text("最高分数： " + highscore,"bold " + pxSize + "px Arial","#FFFFFF");
		this._highscoreDisplay.textAlign = "right";
		this._highscoreDisplay.alpha = 0;
		this.addChild(this._highscoreDisplay);
		this._highscoreDisplay.regX = this._highscoreDisplay.getMeasuredWidth();
		this._highscoreDisplay.regY = 0;
		this._highscoreDisplay.x = this._scroll.x + this._scroll.getWidth() * co.doubleduck.Game.getScale() * 0.8;
		this._highscoreDisplay.y = this._scroll.y - this._scroll.getHeight() * co.doubleduck.Game.getScale() * 0.42;
		this.fadeIn(this._highscoreDisplay);
		if(this._highScore) {
			this._highscoreStamp = co.doubleduck.Assets.getImage("images/menu/highscore_stamp.png");
			this._highscoreStamp.regX = this._highscoreStamp.image.width * 0.5;
			this._highscoreStamp.regY = this._highscoreStamp.image.height * 0.5;
			this._highscoreStamp.rotation = 13;
			this._highscoreStamp.x = co.doubleduck.Game.getViewport().width + this._highscoreStamp.image.width / 2 * co.doubleduck.Game.getScale();
			this._highscoreStamp.y = this._box.y;
			this._highscoreStamp.scaleX = this._highscoreStamp.scaleY = co.doubleduck.Game.getScale();
			this.addChild(this._highscoreStamp);
			createjs.Tween.get(this._highscoreStamp).to({ x : this._box.x + this._box.image.width * 0.45 * co.doubleduck.Game.getScale(), y : this._box.y - this._box.image.height * 0.40 * co.doubleduck.Game.getScale()},300,createjs.Ease.sineOut).wait(2500).call($bind(this,this.scoreTransition));
		} else if(this._sessionScore > 0) co.doubleduck.Utils.waitAndCall(this,1750,$bind(this,this.scoreTransition));
	}
	,getNextUnlockeablePowerup: function() {
		var currPowerUps = co.doubleduck.DataLoader.getLevelById(this._currLevel).powerups;
		var nextLevelPowerUps = co.doubleduck.DataLoader.getLevelById(this._currLevel + 1).powerups;
		var unlockedPowerup = null;
		var _g1 = 0, _g = nextLevelPowerUps.length;
		while(_g1 < _g) {
			var currPower = _g1++;
			var powerupName = nextLevelPowerUps[currPower];
			var found = false;
			var _g3 = 0, _g2 = currPowerUps.length;
			while(_g3 < _g2) {
				var currCurrentPower = _g3++;
				var currPowerupName = currPowerUps[currCurrentPower];
				if(powerupName == currPowerupName) found = true;
			}
			if(!found) {
				unlockedPowerup = co.doubleduck.DataLoader.getPowerupByName(powerupName);
				break;
			}
		}
		return unlockedPowerup;
	}
	,showNextLevelScoreBonus: function() {
		var totalWidth = 0;
		this._scoreBonusContainer = new createjs.Container();
		var scoreBonus = Std.parseFloat(co.doubleduck.DataLoader.getLevelById(this._currLevel + 1).scoreMultiplier);
		scoreBonus *= 100;
		scoreBonus -= 100;
		var dims = new createjs.Rectangle(0,0,0,0);
		var bonusBmp = this._bmpFont.getNumber(scoreBonus | 0,1,true,dims);
		bonusBmp.regX = 0;
		bonusBmp.regY = 0;
		this._scoreBonusContainer.addChild(bonusBmp);
		totalWidth += dims.width;
		var bonusCaption = co.doubleduck.Assets.getImage("images/menu/score_bonus.png");
		bonusCaption.regY = 0;
		totalWidth += bonusCaption.image.width + 2;
		bonusCaption.x = dims.width + 2;
		this._scoreBonusContainer.addChild(bonusCaption);
		this._scoreBonusContainer.regX = totalWidth / 2;
		this._scoreBonusContainer.x = this._box.x;
		this._scoreBonusContainer.y = this._box.y + this._box.image.height / 2 * co.doubleduck.Game.getScale() - dims.height * 0.7 * co.doubleduck.Game.getScale();
		this._scoreBonusContainer.regY = dims.height;
		this.addChild(this._scoreBonusContainer);
		this._scoreBonusContainer.scaleX = this._scoreBonusContainer.scaleY = co.doubleduck.Game.getScale();
	}
	,showNextLevelUnlocks: function() {
		if(this._currLevel == this._levelsData.getAllLevels().length) {
			var gameEnded = co.doubleduck.Assets.getImage("images/menu/game_end.png");
			gameEnded.regX = gameEnded.image.width / 2;
			gameEnded.regY = gameEnded.image.height / 2;
			this.addChild(gameEnded);
			gameEnded.x = this._scroll.x;
			gameEnded.y = this._scroll.y + 10 * co.doubleduck.Game.getScale();
			return;
		}
		this._nextLevelUnlocksTitle = co.doubleduck.Assets.getImage("images/menu/next_level_unlocks.png");
		this._nextLevelUnlocksTitle.scaleX = this._nextLevelUnlocksTitle.scaleY = co.doubleduck.Game.getScale();
		this._nextLevelUnlocksTitle.regX = this._nextLevelUnlocksTitle.image.width / 2;
		this._nextLevelUnlocksTitle.regY = this._nextLevelUnlocksTitle.image.height / 2;
		this._nextLevelUnlocksTitle.x = this._box.x;
		this._nextLevelUnlocksTitle.y = this._box.y - this._nextLevelUnlocksTitle.image.height * 1.3 * co.doubleduck.Game.getScale();
		this.addChild(this._nextLevelUnlocksTitle);
		var nextUnlockable = this.getNextUnlockeablePowerup();
		if(this._playClicked) return;
		if(nextUnlockable == null) {
			this.showNextLevelScoreBonus();
			return;
		}
		var img = nextUnlockable.menuImage;
		var unlockable = co.doubleduck.Assets.getImage(img);
		unlockable.regY = unlockable.image.height / 2;
		var icon = co.doubleduck.Powerup.getPowerupBlock(nextUnlockable.id | 0);
		icon.spriteSheet._regX = 0;
		var dims = new createjs.Rectangle(0,0,0,0);
		this._newUnlockable = new createjs.Container();
		this._newUnlockable.addChild(icon);
		dims.width += icon.spriteSheet._frameWidth / 2;
		this._newUnlockable.addChild(unlockable);
		unlockable.x = icon.x + icon.spriteSheet._frameWidth / 2 + 10;
		dims.width += unlockable.image.width;
		dims.height = icon.spriteSheet._frameHeight;
		this._newUnlockable.scaleX = this._newUnlockable.scaleY = co.doubleduck.Game.getScale();
		this._newUnlockable.regY = 0;
		this._newUnlockable.regX = dims.width / 2;
		this._newUnlockable.x = this._box.x;
		this._newUnlockable.y = this._nextLevelUnlocksTitle.y + this._nextLevelUnlocksTitle.image.height / 2 * co.doubleduck.Game.getScale() + dims.height / 2 * co.doubleduck.Game.getScale() + 10 * co.doubleduck.Game.getScale();
		this.addChild(this._newUnlockable);
	}
	,showScore: function() {
		var alpha = 1;
		if(this._scoreDisplay != null) {
			this.removeChild(this._scoreDisplay);
			alpha = this._scoreDisplay.alpha;
		}
		this._scoreDisplay = this._bmpFont.getNumber(this._currScore,1,true);
		this._scoreDisplay.alpha = alpha;
		this._scoreDisplay.x = this._scroll.x;
		this._scoreDisplay.y = this._scroll.y;
		this._scoreDisplay.scaleX = this._scoreDisplay.scaleY = co.doubleduck.Game.getScale();
		this.addChild(this._scoreDisplay);
	}
	,calcLevelProgression: function(xp) {
		if(xp < 0) xp = 0;
		var unlockedLevelId = co.doubleduck.Game.getUnlockedLevelNum(xp);
		if(unlockedLevelId == this._levelsData.getAllLevels().length) return 1;
		var unlockedLevel = this._levelsData.getAllLevels()[co.doubleduck.Game.getUnlockedLevelNum(xp) - 1];
		var nextLevel = this._levelsData.getAllLevels()[unlockedLevel.id | 0];
		var prevUnlocked = unlockedLevel.xpToUnlock;
		var nextUnlocked = nextLevel.xpToUnlock;
		var dUnlocked = xp - prevUnlocked;
		var dTotal = nextUnlocked - prevUnlocked;
		var xpDiff = dUnlocked / dTotal;
		return xpDiff;
	}
	,tweenScore: function() {
		if(this._currScore <= this._sessionScore) {
			this.showScore();
			this._currScore += 1 + (this._sessionScore / 50 | 0);
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.tweenScore));
		} else {
			this._currScore = this._sessionScore;
			this.showScore();
		}
	}
	,happyChaz: function() {
		this._happyChaz = co.doubleduck.Assets.getImage("images/menu/chaz_happy.png");
		this._happyChaz.scaleX = this._happyChaz.scaleY = co.doubleduck.Game.getScale();
		this._happyChaz.regX = 0;
		this._happyChaz.regY = this._happyChaz.image.height;
		this._happyChaz.y = co.doubleduck.Game.getViewport().height + this._happyChaz.image.height * co.doubleduck.Game.getScale();
		this._happyChaz.x = -1 * this._happyChaz.image.width * co.doubleduck.Game.getScale();
		var destY = co.doubleduck.Game.getViewport().height + this._happyChaz.image.height * co.doubleduck.Game.getScale() * 0.12;
		var destX = -1 * this._happyChaz.image.width * co.doubleduck.Game.getScale() * 0.3;
		this.addChild(this._happyChaz);
		createjs.Tween.get(this._happyChaz).to({ y : destY},300);
		createjs.Tween.get(this._happyChaz).to({ x : destX},300,createjs.Ease.sineOut);
	}
	,showHelp: function() {
		this.fadeOut(this._newUnlockable);
		this.fadeOut(this._nextLevelUnlocksTitle);
		this._scroll.onOpen = $bind(this,this.helpScrollOpened);
		this._scroll.open();
	}
	,handleOpenHelp: function() {
		this.fadeMenuOut();
		this._scroll.onClose = $bind(this,this.showHelp);
		this._scroll.close();
	}
	,menuScrollOpened: function() {
		this._playButton = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/play_btn.png"));
		this._playButton.regY = this._playButton.image.height;
		this._playButton.regX = this._playButton.image.width;
		this._playButton.x = this._scroll.x + this._scroll.getWidth() * 0.4 * co.doubleduck.Game.getScale();
		this._playButton.y = this._scroll.y + this._scroll.getHeight() * 0.43 * co.doubleduck.Game.getScale();
		this._playButton.onClick = $bind(this,this.handleLevelClick);
		this._playButton.scaleX = this._playButton.scaleY = co.doubleduck.Game.getScale();
		this._playButton.alpha = 0;
		this.addChild(this._playButton);
		this._levelBarStroke = co.doubleduck.Assets.getImage("images/menu/level-bar_empty.png");
		this._levelBarStroke.regX = this._levelBarStroke.image.width / 2;
		this._levelBarStroke.regY = this._levelBarStroke.image.height / 2;
		this._levelBarStroke.scaleX = this._levelBarStroke.scaleY = co.doubleduck.Game.getScale();
		this._levelBarStroke.x = this._scroll.x;
		this._levelBarStroke.y = this._scroll.y - this._scroll.getHeight() / 4.2 * co.doubleduck.Game.getScale();
		this._levelBarStroke.alpha = 0;
		this.addChild(this._levelBarStroke);
		this._levelBarFill = co.doubleduck.Assets.getImage("images/menu/level-bar_fill.png");
		this._levelBarFill.scaleX = this._levelBarFill.scaleY = co.doubleduck.Game.getScale();
		this._levelBarFill.regX = this._levelBarFill.image.width / 2;
		this._levelBarFill.regY = this._levelBarFill.image.height / 2;
		this._levelBarFill.x = this._levelBarStroke.x;
		this._levelBarFill.y = this._levelBarStroke.y;
		this._levelBarFill.alpha = 0;
		this.addChild(this._levelBarFill);
		this._levelBarMask = new createjs.Shape();
		this._levelBarMask.graphics.beginFill("#000000");
		this._levelBarMask.graphics.drawRect(this._levelBarFill.x,this._levelBarFill.y,this._levelBarFill.image.width * co.doubleduck.Game.getScale(),this._levelBarFill.image.height * co.doubleduck.Game.getScale());
		this._levelBarMask.graphics.endFill();
		this._levelBarMask.regX = this._levelBarFill.image.width * co.doubleduck.Game.getScale();
		this._levelBarMask.regY = this._levelBarFill.image.height / 2 * co.doubleduck.Game.getScale();
		this._levelBarMask.x -= this._levelBarFill.image.width / 2 * co.doubleduck.Game.getScale();
		this._levelBarFill.mask = this._levelBarMask;
		this._helpBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/help_btn.png"));
		this._helpBtn.scaleX = this._helpBtn.scaleY = co.doubleduck.Game.getScale();
		this._helpBtn.regY = this._helpBtn.image.height;
		this._helpBtn.regX = 0;
		this._helpBtn.x = this._scroll.x - this._scroll.getWidth() * 0.4 * co.doubleduck.Game.getScale();
		this._helpBtn.y = this._playButton.y;
		this._helpBtn.alpha = 0;
		this._helpBtn.onClick = $bind(this,this.handleOpenHelp);
		this.addChild(this._helpBtn);
		this._box = co.doubleduck.Assets.getImage("images/menu/next_level_box.png");
		this._box.scaleX = this._box.scaleY = co.doubleduck.Game.getScale();
		this._box.regX = this._box.image.width / 2;
		this._box.regY = this._box.image.height / 2;
		this._box.x = this._scroll.x;
		this._box.y = this._scroll.y + this._box.image.height * 0.1 * co.doubleduck.Game.getScale();
		this._box.alpha = 0;
		this.addChild(this._box);
		this._playerLevel = co.doubleduck.Assets.getImage("images/menu/level_star.png");
		this._playerLevel.scaleX = this._playerLevel.scaleY = co.doubleduck.Game.getScale();
		this._playerLevel.regX = this._playerLevel.image.width / 2;
		this._playerLevel.regY = this._playerLevel.image.height / 2;
		this._playerLevel.y = this._levelBarFill.y;
		this._playerLevel.x = this._levelBarFill.x - this._levelBarFill.image.width * 0.3 * co.doubleduck.Game.getScale();
		this._playerLevel.alpha = 0;
		this.addChild(this._playerLevel);
		var unlockedLevel = this._levelsData.getAllLevels()[co.doubleduck.Game.getUnlockedLevelNum(co.doubleduck.Persistence.getXP() - this._sessionScore) - 1];
		this._currLevel = Std.parseInt(unlockedLevel.id);
		this._bmpFont = new co.doubleduck.FontHelper(co.doubleduck.FontHelper.FONT_REGULAR);
		this._playerLevelTxt = this._bmpFont.getNumber(this._currLevel,1,true);
		this._playerLevelTxt.scaleX = this._playerLevelTxt.scaleY = co.doubleduck.Game.getScale();
		this._playerLevelTxt.x = this._playerLevel.x;
		this._playerLevelTxt.y = this._playerLevel.y + this._playerLevel.image.height * co.doubleduck.Game.getScale() * 0.08;
		this._playerLevelTxt.alpha = 0;
		this.addChild(this._playerLevelTxt);
		this.setLevelProgression(this.calcLevelProgression(co.doubleduck.Persistence.getXP() - this._sessionScore),true);
		if(co.doubleduck.SoundManager.available) {
			this._muteButton = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/audio_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
			this._muteButton.y = this._scroll.y - this._scroll.getHeight() * 0.42 * co.doubleduck.Game.getScale();
			this._muteButton.x = this._scroll.x - this._scroll.getWidth() * 0.34 * co.doubleduck.Game.getScale();
			this._muteButton.scaleX = this._muteButton.scaleY = co.doubleduck.Game.getScale();
			this._muteButton.setToggle(co.doubleduck.SoundManager.isMuted());
			this._muteButton.onToggle = co.doubleduck.SoundManager.toggleMute;
			this.addChild(this._muteButton);
		}
		this.fadeIn(this._playButton);
		this.fadeIn(this._playerLevel);
		this.fadeIn(this._playerLevelTxt);
		this.fadeIn(this._levelBarFill);
		this.fadeIn(this._levelBarStroke);
		this.fadeIn(this._helpBtn);
		this.fadeIn(this._box);
		if(this._sessionScore > 0) {
			this._currScore = 0;
			this._displayingScore = true;
			this.setLevelProgression(this.calcLevelProgression(co.doubleduck.Persistence.getXP()));
			co.doubleduck.SoundManager.playEffect("sound/score");
			this.tweenScore();
			this.happyChaz();
		} else {
			this.showHighscore();
			this.showNextLevelUnlocks();
		}
	}
	,showMenu: function() {
		this._scroll.onOpen = $bind(this,this.menuScrollOpened);
		this._scroll.open();
	}
	,handleHelpClick: function() {
		this._highScore = false;
		this._sessionScore = 0;
		this.fadeOut(this._closeHelpBtn);
		this.fadeOut(this._helpScreen);
		this._scroll.onClose = $bind(this,this.showMenu);
		this._scroll.close();
	}
	,helpScrollOpened: function() {
		this._helpScreen = co.doubleduck.Assets.getImage("images/menu/help.png");
		this._helpScreen.regX = this._helpScreen.image.width / 2;
		this._helpScreen.regY = this._helpScreen.image.height / 2;
		this._helpScreen.scaleX = this._helpScreen.scaleY = co.doubleduck.Game.getScale();
		this.addChild(this._helpScreen);
		this._helpScreen.alpha = 0;
		this._helpScreen.x = this._scroll.x;
		this._helpScreen.y = this._scroll.y - this._scroll.getHeight() / 12 * co.doubleduck.Game.getScale();
		this.fadeIn(this._helpScreen);
		this._closeHelpBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/gotit_btn.png"));
		this._closeHelpBtn.regY = this._closeHelpBtn.image.height;
		this._closeHelpBtn.regX = this._closeHelpBtn.image.width;
		this._closeHelpBtn.x = this._scroll.x + this._scroll.getWidth() * 0.4 * co.doubleduck.Game.getScale();
		this._closeHelpBtn.y = this._scroll.y + this._scroll.getHeight() * 0.43 * co.doubleduck.Game.getScale();
		this._closeHelpBtn.onClick = $bind(this,this.handleHelpClick);
		this._closeHelpBtn.scaleX = this._closeHelpBtn.scaleY = co.doubleduck.Game.getScale();
		this._closeHelpBtn.alpha = 0;
		this.addChild(this._closeHelpBtn);
		createjs.Tween.get(this._closeHelpBtn).wait(1200).to({ alpha : 1},500);
	}
	,_muteButton: null
	,_playClicked: null
	,_highscoreDisplay: null
	,_highscoreStamp: null
	,_highScore: null
	,_happyChaz: null
	,_scoreBonusContainer: null
	,_newUnlockable: null
	,_nextLevelUnlocksTitle: null
	,_scroll: null
	,_closeHelpBtn: null
	,_helpScreen: null
	,_helpBtn: null
	,_helpScreenShown: null
	,_currLevel: null
	,_displayingScore: null
	,_currScore: null
	,_currProgression: null
	,_scoreDisplay: null
	,_sessionScore: null
	,_levelBarMask: null
	,_levelBarStroke: null
	,_levelBarFill: null
	,_playerLevelTxt: null
	,_playerLevel: null
	,_box: null
	,_bmpFont: null
	,_levelsData: null
	,_playButton: null
	,_background: null
	,POS_IN_PACK: null
	,PACK_COUNT: null
	,SCROLL_EASE: null
	,LEVELS_PER_PACK: null
	,PACK_ROW_POS: null
	,onStart: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() {
};
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.Persistence.getValue = function(key) {
	if(!co.doubleduck.Persistence.available) return "0";
	var val = localStorage[co.doubleduck.Persistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.Persistence.setValue = function(key,value) {
	if(!co.doubleduck.Persistence.available) return;
	localStorage[co.doubleduck.Persistence.GAME_PREFIX + key] = value;
}
co.doubleduck.Persistence.clearAll = function() {
	if(!co.doubleduck.Persistence.available) return;
	localStorage.clear();
}
co.doubleduck.Persistence.initGameData = function() {
	if(!co.doubleduck.Persistence.available) return;
	co.doubleduck.Persistence.initVar("xp");
	co.doubleduck.Persistence.initVar("highscore");
}
co.doubleduck.Persistence.initVar = function(initedVar) {
	var value = co.doubleduck.Persistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.Persistence.setValue(initedVar,"0");
	} catch( e ) {
		co.doubleduck.Persistence.available = false;
	}
}
co.doubleduck.Persistence.getXP = function() {
	return Std.parseInt(co.doubleduck.Persistence.getValue("xp"));
}
co.doubleduck.Persistence.setXP = function(xp) {
	co.doubleduck.Persistence.setValue("xp","" + xp);
}
co.doubleduck.Persistence.getHighscore = function() {
	return Std.parseInt(co.doubleduck.Persistence.getValue("highscore"));
}
co.doubleduck.Persistence.setHighscore = function(score) {
	co.doubleduck.Persistence.setValue("highscore","" + score);
}
co.doubleduck.Persistence.prototype = {
	__class__: co.doubleduck.Persistence
}
co.doubleduck.Powerup = $hxClasses["co.doubleduck.Powerup"] = function(type) {
	this._type = type;
};
co.doubleduck.Powerup.__name__ = ["co","doubleduck","Powerup"];
co.doubleduck.Powerup.POWERUP_SPRITES = null;
co.doubleduck.Powerup.getPowerupBlock = function(type) {
	if(co.doubleduck.Powerup.BLOCK_SPRITES == null) co.doubleduck.Powerup.initBlockSpriteSheet();
	var powerupData = co.doubleduck.DataLoader.getPowerById(type);
	var result = new createjs.BitmapAnimation(co.doubleduck.Powerup.BLOCK_SPRITES);
	var frameNum = (powerupData.blockFrame | 0) + 1;
	result.gotoAndStop("powerupblock" + frameNum);
	return result;
}
co.doubleduck.Powerup.getPowerup = function(type) {
	if(co.doubleduck.Powerup.POWERUP_SPRITES == null) co.doubleduck.Powerup.initPowerupSpriteSheet();
	var powerupData = co.doubleduck.DataLoader.getPowerById(type);
	var result = new createjs.BitmapAnimation(co.doubleduck.Powerup.POWERUP_SPRITES);
	var frameNum = (powerupData.powerupFrame | 0) + 1;
	result.gotoAndStop("powerup" + frameNum);
	return result;
}
co.doubleduck.Powerup.initBlockSpriteSheet = function() {
	var img;
	var initObject;
	var gdb = new GameplayDB();
	var spritesheetData = gdb.getBlockSpritesheet();
	img = co.doubleduck.Assets.getRawImage(spritesheetData.loc);
	initObject = { };
	initObject.images = [img];
	initObject.frames = { width : spritesheetData.frameWidth, height : spritesheetData.frameHeight, regX : (spritesheetData.frameWidth | 0) / 2, regY : (spritesheetData.frameHeight | 0) / 2};
	initObject.animations = { };
	var _g1 = 0, _g = gdb.getAllPowerups().length;
	while(_g1 < _g) {
		var i = _g1++;
		initObject.animations["powerupblock" + (i + 1)] = { frames : i, frequency : 20};
	}
	co.doubleduck.Powerup.BLOCK_SPRITES = new createjs.SpriteSheet(initObject);
}
co.doubleduck.Powerup.initPowerupSpriteSheet = function() {
	var img;
	var initObject;
	var gdb = new GameplayDB();
	var spritesheetData = gdb.getPowerupSpritesheet();
	img = co.doubleduck.Assets.getRawImage(spritesheetData.loc);
	initObject = { };
	initObject.images = [img];
	initObject.frames = { width : spritesheetData.frameWidth, height : spritesheetData.frameHeight, regX : spritesheetData.frameWidth / 2, regY : spritesheetData.frameHeight / 2};
	initObject.animations = { };
	var _g1 = 0, _g = gdb.getAllPowerups().length;
	while(_g1 < _g) {
		var i = _g1++;
		initObject.animations["powerup" + (i + 1)] = { frames : i, frequency : 20};
	}
	co.doubleduck.Powerup.POWERUP_SPRITES = new createjs.SpriteSheet(initObject);
}
co.doubleduck.Powerup.prototype = {
	_type: null
	,__class__: co.doubleduck.Powerup
}
co.doubleduck.Scroll = $hxClasses["co.doubleduck.Scroll"] = function(height) {
	createjs.Container.call(this);
	this._maxHeight = height;
	this._topBranch = co.doubleduck.Assets.getImage("images/menu/branch_top.png");
	this._topBranch.regY = this._topBranch.image.height / 2;
	this.addChild(this._topBranch);
	this._bottomBranch = co.doubleduck.Assets.getImage("images/menu/branch_bottom.png");
	this._bottomBranch.regY = this._bottomBranch.image.height / 2;
	this.addChild(this._bottomBranch);
	this._contents = null;
	this.setHeight(co.doubleduck.Scroll.STARTING_HEIGHT);
	this._currHeight = co.doubleduck.Scroll.STARTING_HEIGHT;
	this._tweenHeight = this._currHeight;
	this.regX = this._topBranch.image.width / 2;
	this.regY = height / 2;
	createjs.Ticker.addListener(this);
};
co.doubleduck.Scroll.__name__ = ["co","doubleduck","Scroll"];
co.doubleduck.Scroll.__super__ = createjs.Container;
co.doubleduck.Scroll.prototype = $extend(createjs.Container.prototype,{
	tick: function() {
		if((this._tweenHeight | 0) != this._currHeight) {
			this._currHeight = this._tweenHeight | 0;
			this.setHeight(this._currHeight);
		}
	}
	,getHeight: function() {
		return this._maxHeight;
	}
	,getWidth: function() {
		return this._topBranch.image.width;
	}
	,closeold: function() {
		if(this._currHeight > co.doubleduck.Scroll.STARTING_HEIGHT) {
			this._currHeight -= co.doubleduck.Scroll.CLOSE_SPEED;
			if(this._currHeight < co.doubleduck.Scroll.STARTING_HEIGHT) this._currHeight = co.doubleduck.Scroll.STARTING_HEIGHT;
			this.setHeight(this._currHeight);
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.close));
		} else if(this.onClose != null) this.onClose();
	}
	,oldopen: function() {
		if(this._currHeight < this._maxHeight) {
			this._currHeight += co.doubleduck.Scroll.OPEN_SPEED;
			if(this._currHeight > this._maxHeight) this._currHeight = this._maxHeight;
			this.setHeight(this._currHeight);
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.open));
		} else if(this.onOpen != null) this.onOpen();
	}
	,close: function() {
		createjs.Tween.get(this).to({ _tweenHeight : co.doubleduck.Scroll.STARTING_HEIGHT},400,createjs.Ease.sineIn).wait(500).call(this.onClose);
	}
	,open: function() {
		createjs.Tween.get(this).to({ _tweenHeight : this._maxHeight},800,createjs.Ease.elasticOut).call(this.onOpen);
	}
	,setHeight: function(height) {
		if(this._contents != null) this.removeChild(this._contents);
		this._contents = new createjs.Shape();
		this._contents.graphics.beginFill("#000000");
		this._contents.graphics.drawRect(0,0,co.doubleduck.Scroll.DEFAULT_WIDTH,height);
		this._contents.graphics.endFill();
		this._contents.regX = co.doubleduck.Scroll.DEFAULT_WIDTH / 2;
		this._contents.regY = height / 2;
		this._contents.y = this._maxHeight / 2;
		this._contents.x = this._topBranch.image.width / 2;
		this._contents.alpha = 0.9;
		this.addChildAt(this._contents,0);
		this._topBranch.y = this._contents.y - height / 2;
		this._bottomBranch.y = this._contents.y + height / 2;
	}
	,onClose: null
	,onOpen: null
	,_tweenHeight: null
	,_currHeight: null
	,_maxHeight: null
	,_contents: null
	,_bottomBranch: null
	,_topBranch: null
	,__class__: co.doubleduck.Scroll
});
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function() {
	this._sessionEnded = false;
	this._isPaused = false;
	createjs.Container.call(this);
	this.constructLevel();
	this._score = 0;
	this._scoreMutliplier = Std.parseFloat(co.doubleduck.DataLoader.getLevelByXP(co.doubleduck.Persistence.getXP()).scoreMultiplier);
	this._hud = new co.doubleduck.HUD();
	this._grid.y += this._hud.getHeight() / 2 * co.doubleduck.Game.getScale();
	this._hud.onPauseClick = $bind(this,this.handlePauseClick);
	this._hud.y = this._grid.y - this._grid.getHeight() / 2 * co.doubleduck.Game.getScale() - 10 * co.doubleduck.Game.getScale();
	this.addChild(this._hud);
	this._remainingTime = this._sessionTime = co.doubleduck.DataLoader.getLevelByXP(co.doubleduck.Persistence.getXP()).duration | 0;
	this.gameTimer();
	this.newPowerup();
	var now = createjs.Ticker.getTime(true);
	this._lastGemBlastTime = now;
	createjs.Ticker.addListener(this);
	co.doubleduck.SoundManager.playEffect("sound/falling");
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.__super__ = createjs.Container;
co.doubleduck.Session.prototype = $extend(createjs.Container.prototype,{
	getSpreePercent: function() {
		return this._spree / this._requiredSpree;
	}
	,isSpreeComplete: function() {
		return this._spree >= this._requiredSpree;
	}
	,setOnRestart: function(cb) {
		this.onRestart = cb;
		this._hud.onRestart = cb;
	}
	,setOnBackToMenu: function(cb) {
		this.onBackToMenu = cb;
		this._hud.onMenuClick = cb;
	}
	,getScore: function() {
		return this._score;
	}
	,destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
	}
	,timesUp: function() {
		if(this._sessionEnded) return;
		this._sessionEnded = true;
		if(this.onSessionEnd != null) this.onSessionEnd(this._score);
		this._grid.terminate();
		this._hud.mouseEnabled = false;
		this._grid.mouseEnabled = false;
		createjs.Tween.get(this._hud).wait(200).to({ y : 0 - this._hud.getHeight()},500,createjs.Ease.sineIn);
		createjs.Tween.get(this._grid).to({ x : co.doubleduck.Game.getViewport().width + this._grid.getWidth() * co.doubleduck.Game.getScale() / 2},600,createjs.Ease.sineIn).wait(300).call(this.onBackToMenu);
	}
	,resume: function() {
		if(this._isPaused) {
			this._isPaused = false;
			createjs.Ticker.setPaused(false);
			this._pauseDuration = createjs.Ticker.getTime(false) - this._pauseDuration;
			this._hud.setPauseOverlay(false);
			this._grid.mouseEnabled = true;
			this._grid.alpha = 1;
		}
	}
	,pause: function() {
		if(this._sessionEnded) return;
		if(!this._isPaused) {
			this._isPaused = true;
			this._grid.alpha = 0.35;
			createjs.Ticker.setPaused(true);
			this._pauseDuration = createjs.Ticker.getTime(false);
			this._hud.setPauseOverlay(true);
			this._grid.mouseEnabled = false;
		}
	}
	,handlePauseClick: function() {
		if(this._isPaused) this.resume(); else this.pause();
	}
	,getIsPaused: function() {
		return this._isPaused;
	}
	,resetSpree: function() {
		this._spree = 0;
		this._hud.setSpreeProgression(this._spree / this._requiredSpree);
	}
	,handleWrongGroup: function() {
		this.resetSpree();
	}
	,handleGemBlast: function() {
		this._spree += 1;
		this._score += 10 * this._scoreMutliplier | 0;
		this._hud.setScore(this._score);
		this._hud.setSpreeProgression(this._spree / this._requiredSpree);
		this._lastGemBlastTime = createjs.Ticker.getTime(true);
	}
	,handleTweenEnd: function() {
		createjs.Tween.get(this._grid).to({ alpha : 1},500);
		this._grid.mouseEnabled = true;
		this._grid.placePowerup();
		this._hud.fadeOutPowerup();
		this.newPowerup();
	}
	,playPowerSound: function() {
		co.doubleduck.SoundManager.playEffect("sound/magic1");
	}
	,handleReadyForPowerup: function() {
		if(this._sessionEnded) return;
		if(this.isSpreeComplete()) {
			var loc = this._grid.launchPowerup(this._currPowerupType);
			this._grid.mouseEnabled = false;
			createjs.Tween.get(this._grid).to({ alpha : 0.6},500);
			co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.playPowerSound));
			this._hud.tweenPowerup(loc,$bind(this,this.handleTweenEnd));
			this._spree = 0;
			this._hud.setSpreeProgression(this._spree);
		}
	}
	,addTime: function(secs,from) {
		this._remainingTime += secs;
		if(this._remainingTime > this._sessionTime) this._remainingTime = this._sessionTime;
		var progress = this._remainingTime / this._sessionTime;
		if(progress > 1) progress = 1;
		this._hud.setRemainingTime(this._remainingTime,progress);
		if(from == null) from = new createjs.Point(co.doubleduck.Game.getViewport().width / 2,co.doubleduck.Game.getViewport().height / 2);
		var scale = co.doubleduck.Game.getScale();
		if(secs > 3) scale *= 1.5;
		this._hud.tweenTimeBonus(secs,from,scale);
	}
	,handlePowerupActivated: function(gem) {
		var powerup = co.doubleduck.DataLoader.getPowerById(gem.getPowerup());
		if(powerup.name == "smallTimeBonus" || powerup.name == "bigTimeBonus") {
			var seconds = powerup.seconds | 0;
			var pos = this._grid.localToGlobal(gem.x,gem.y);
			this.addTime(seconds,pos);
		}
	}
	,constructLevel: function() {
		this._background = co.doubleduck.Assets.getImage("images/menu/bg.png");
		this._background.scaleX = this._background.scaleY = co.doubleduck.Game.getScale();
		this._background.regX = this._background.image.width / 2;
		this._background.regY = this._background.image.height / 2;
		this._background.y = co.doubleduck.Game.getViewport().height / 2;
		this._background.x = co.doubleduck.Game.getViewport().width / 2;
		this.addChild(this._background);
		var overlay = new createjs.Shape();
		overlay.graphics.beginFill("#000000");
		overlay.graphics.drawRect(0,0,this._background.image.width,this._background.image.height);
		overlay.graphics.endFill();
		overlay.scaleX = overlay.scaleY = co.doubleduck.Game.getScale();
		overlay.regX = this._background.image.width / 2;
		overlay.regY = this._background.image.height / 2;
		overlay.alpha = 0.6;
		overlay.x = co.doubleduck.Game.getViewport().width / 2;
		overlay.y = co.doubleduck.Game.getViewport().height / 2;
		this.addChild(overlay);
		var userLevel = co.doubleduck.DataLoader.getLevelByXP(co.doubleduck.Persistence.getXP());
		this._grid = new co.doubleduck.GemGrid(co.doubleduck.DataLoader.getAvailPassivePowerupIds(),userLevel.passiveChance);
		this.addChild(this._grid);
		this._grid.onGemBlast = $bind(this,this.handleGemBlast);
		this._grid.onWrongGroup = $bind(this,this.handleWrongGroup);
		this._grid.onReadyForPowerup = $bind(this,this.handleReadyForPowerup);
		this._grid.onPowerupActivated = $bind(this,this.handlePowerupActivated);
	}
	,gameTimer: function() {
		if(this._remainingTime > 0) {
			var progress = this._remainingTime / this._sessionTime;
			if(progress > 1) progress = 1;
			this._hud.setRemainingTime(this._remainingTime,progress);
			this._remainingTime -= 1;
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.gameTimer));
		} else {
			this._hud.setRemainingTime(0,0);
			this.timesUp();
		}
	}
	,tick: function() {
		var now = createjs.Ticker.getTime(true);
		if(now > this._lastGemBlastTime + co.doubleduck.Session.SPREE_RESET_INTERVAL && this._spree > 0) {
			this._lastGemBlastTime = now;
			this.resetSpree();
		}
	}
	,newPowerup: function() {
		var powerups = co.doubleduck.DataLoader.getAvailablePowerups(true);
		var randNum = Std.random(powerups.length);
		this._currPowerupType = powerups[randNum].id | 0;
		this._requiredSpree = powerups[randNum].spreeToActivate | 0;
		this._hud.setAvailablePowerup(this._currPowerupType);
	}
	,_lastGemBlastTime: null
	,_hud: null
	,_remainingTime: null
	,_sessionTime: null
	,_sessionEnded: null
	,_pauseDuration: null
	,_isPaused: null
	,_requiredSpree: null
	,_currPowerupBlock: null
	,_currPowerupType: null
	,_grid: null
	,_background: null
	,_spree: null
	,_scoreMutliplier: null
	,_score: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",3];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.Persistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.Persistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	return false;
}
co.doubleduck.SoundManager.mute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
}
co.doubleduck.SoundManager.unmute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(1);
	}
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
	co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.isMuted = function() {
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() {
};
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.prototype = {
	__class__: co.doubleduck.Utils
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Int32 = $hxClasses["haxe.Int32"] = function() { }
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	return a << 16 | b;
}
haxe.Int32.ofInt = function(x) {
	return x | 0;
}
haxe.Int32.clamp = function(x) {
	return x | 0;
}
haxe.Int32.toInt = function(x) {
	if((x >> 30 & 1) != x >>> 31) throw "Overflow " + Std.string(x);
	return x;
}
haxe.Int32.toNativeInt = function(x) {
	return x;
}
haxe.Int32.add = function(a,b) {
	return a + b | 0;
}
haxe.Int32.sub = function(a,b) {
	return a - b | 0;
}
haxe.Int32.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
}
haxe.Int32.div = function(a,b) {
	return a / b | 0;
}
haxe.Int32.mod = function(a,b) {
	return a % b;
}
haxe.Int32.shl = function(a,b) {
	return a << b;
}
haxe.Int32.shr = function(a,b) {
	return a >> b;
}
haxe.Int32.ushr = function(a,b) {
	return a >>> b;
}
haxe.Int32.and = function(a,b) {
	return a & b;
}
haxe.Int32.or = function(a,b) {
	return a | b;
}
haxe.Int32.xor = function(a,b) {
	return a ^ b;
}
haxe.Int32.neg = function(a) {
	return -a;
}
haxe.Int32.isNeg = function(a) {
	return a < 0;
}
haxe.Int32.isZero = function(a) {
	return a == 0;
}
haxe.Int32.complement = function(a) {
	return ~a;
}
haxe.Int32.compare = function(a,b) {
	return a - b;
}
haxe.Int32.ucompare = function(a,b) {
	if(a < 0) return b < 0?~b - ~a:1;
	return b < 0?-1:a - b;
}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.Serializer = $hxClasses["haxe.Serializer"] = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += Std.string("x");
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += Std.string("n");
			break;
		case 1:
			if(v == 0) {
				this.buf.b += Std.string("z");
				return;
			}
			this.buf.b += Std.string("i");
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += Std.string("k"); else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += Std.string("d");
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += Std.string("a");
				var l = v.length;
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += Std.string("n"); else {
								this.buf.b += Std.string("u");
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += Std.string("n"); else {
						this.buf.b += Std.string("u");
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += Std.string("h");
				break;
			case List:
				this.buf.b += Std.string("l");
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += Std.string("h");
				break;
			case Date:
				var d = v;
				this.buf.b += Std.string("v");
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += Std.string("b");
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case IntHash:
				this.buf.b += Std.string("q");
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += Std.string(":");
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += Std.string("s");
				this.buf.b += Std.string(chars.length);
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += Std.string("C");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += Std.string("g");
				} else {
					this.buf.b += Std.string("c");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += Std.string("o");
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += Std.string(":");
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += Std.string("g");
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += Std.string("r");
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += Std.string("R");
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += Std.string("y");
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += Std.string(":");
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = $hxClasses["haxe.io.BytesBuffer"] = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,b: null
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = $hxClasses["haxe.io.Input"] = function() { }
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return Std.parseInt((((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * Math.pow(2,32)).toString()) + Std.parseInt(((bytes[4] >> 7) * Math.pow(2,31)).toString()) + Std.parseInt(((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]).toString());
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		return this.bigEndian?(ch1 << 8 | ch2) << 16 | (ch3 << 8 | ch4):(ch4 << 8 | ch3) << 16 | (ch2 << 8 | ch1);
	}
	,readUInt30: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if((this.bigEndian?ch1:ch4) >= 64) throw haxe.io.Error.Overflow;
		return this.bigEndian?ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24:ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readInt31: function() {
		var ch1, ch2, ch3, ch4;
		if(this.bigEndian) {
			ch4 = this.readByte();
			ch3 = this.readByte();
			ch2 = this.readByte();
			ch1 = this.readByte();
		} else {
			ch1 = this.readByte();
			ch2 = this.readByte();
			ch3 = this.readByte();
			ch4 = this.readByte();
		}
		if((ch4 & 128) == 0 != ((ch4 & 64) == 0)) throw haxe.io.Error.Overflow;
		return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		return this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		return this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		return (function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this));
	}
	,bigEndian: null
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesInput = $hxClasses["haxe.io.BytesInput"] = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
};
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,len: null
	,pos: null
	,b: null
	,__class__: haxe.io.BytesInput
});
haxe.io.Eof = $hxClasses["haxe.io.Eof"] = function() {
};
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
if(!haxe.remoting) haxe.remoting = {}
haxe.remoting.FlashJsConnection = $hxClasses["haxe.remoting.FlashJsConnection"] = function() { }
haxe.remoting.FlashJsConnection.__name__ = ["haxe","remoting","FlashJsConnection"];
haxe.remoting.FlashJsConnection.flashCall = function(flashObj,name,path,params) {
	try {
		var fobj = window.document[flashObj];
		if(fobj == null) fobj = window.document.getElementById[flashObj];
		if(fobj == null) throw "Could not find flash object '" + flashObj + "'";
		var data = null;
		try {
			data = fobj.flashJsRemotingCall(name,path,params);
		} catch( e ) {
		}
		if(data == null) throw "Flash object " + flashObj + " does not have an active FlashJsConnection";
		return data;
	} catch( e ) {
		var s = new haxe.Serializer();
		s.serializeException(e);
		return s.toString();
	}
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.Assets.onLoadAll = null;
co.doubleduck.Assets._loader = null;
co.doubleduck.Assets._cacheData = { };
co.doubleduck.Assets._loadCallbacks = { };
co.doubleduck.Assets.loaded = 0;
co.doubleduck.Assets._useLocalStorage = false;
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.FontHelper.FONT_REGULAR = "images/font/";
co.doubleduck.FontHelper.FONT_HUD = "images/hud/hud_font/";
co.doubleduck.Game._viewport = null;
co.doubleduck.Game._scale = 1;
co.doubleduck.Game._musicPlaying = false;
co.doubleduck.Game.MAX_HEIGHT = 760;
co.doubleduck.Game.MAX_WIDTH = 427;
co.doubleduck.Game.DEBUG = false;
co.doubleduck.Gem.GEM_SIZE = 59;
co.doubleduck.Gem.GRAVITY = 0.01;
co.doubleduck.Gem.INITIAL_SPEED = 2;
co.doubleduck.Gem.GEM_1 = 1;
co.doubleduck.Gem.GEM_2 = 2;
co.doubleduck.Gem.GEM_3 = 3;
co.doubleduck.Gem.GEM_4 = 4;
co.doubleduck.Gem.GEM_5 = 5;
co.doubleduck.Gem.GEMS_COUNT = 5;
co.doubleduck.Gem.TAP_ALPHA = 0.3;
co.doubleduck.Gem.FOCUS_FADE = 0.4;
co.doubleduck.Gem.SHEET_GLOW = 5;
co.doubleduck.Gem.SHEET_COVER = 10;
co.doubleduck.Gem.SHEET_COVER_GLOW = 15;
co.doubleduck.Gem.PULSE_TIME = 400;
co.doubleduck.Gem.CLICK_THRESH_TIME = 200;
co.doubleduck.Gem.CLICK_THRESH_DIST = 50;
co.doubleduck.Gem._lastClickTime = -1;
co.doubleduck.GemGrid.MIN_GROUPS = 2;
co.doubleduck.GemGrid.HINT_INTERVAL = 2500;
co.doubleduck.GemGrid.SPECIAL_SIGHT_TIME = 5300;
co.doubleduck.GemGrid.SIGHT_STOP_THRESH = 400;
co.doubleduck.Persistence.GAME_PREFIX = "BAK";
co.doubleduck.Persistence.available = co.doubleduck.Persistence.localStorageSupported();
co.doubleduck.Powerup.BLOCK_SPRITES = null;
co.doubleduck.Powerup.ACTIVE_POWERUP_COUNT = 5;
co.doubleduck.Scroll.DEFAULT_WIDTH = 343;
co.doubleduck.Scroll.STARTING_HEIGHT = 18;
co.doubleduck.Scroll.OPEN_SPEED = 6;
co.doubleduck.Scroll.CLOSE_SPEED = 20;
co.doubleduck.Session.SPREE_RESET_INTERVAL = 3000;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
js.Lib.onerror = null;
co.doubleduck.Main.main();
