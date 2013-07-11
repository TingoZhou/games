String.prototype.trim = function() {
	return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
};

function UtilClass() {
	this.getXmlHttp = function() {
		var a;
		try {
			a = new XMLHttpRequest()
		} catch (b) {
			try {
				a = new ActiveXObject("Msxml2.XMLHTTP")
			} catch (b) {
				try {
					a = new ActiveXObject("Microsoft.XMLHTTP")
				} catch (b) {
					alert("Your browser does not support AJAX!");
					return null
				}
			}
		}
		return a
	};
	this.xmlLoadUrl = function(b, c) {
		var a = this.getXmlHttp();
		if (a == null) {
			return false
		}
		a.onreadystatechange = function() {
			if (a.readyState == 4) {
				if (c) {
					c(a)
				}
			}
		};
		a.open("GET", b, true);
		a.send(null)
	};
	this.xmlGetUrl = function(b) {
		var a = this.getXmlHttp();
		if (a == null) {
			return false
		}
		a.open("GET", b, false);
		a.send(null);
		return a.responseText
	};
	this.getCookie = function(b) {
		var c, a, e, d = document.cookie.split(";");
		for (c = 0; c < d.length; c++) {
			a = d[c].substr(0, d[c].indexOf("="));
			e = d[c].substr(d[c].indexOf("=") + 1);
			a = a.replace(/^\s+|\s+$/g, "");
			if (a == b) {
				return unescape(e)
			}
		}
	};
	this.setCookie = function(a, d, b) {
		var e = new Date();
		e.setDate(e.getDate() + b);
		var c = escape(d) + ((b == null) ? "" : "; expires=" + e.toUTCString());
		document.cookie = a + "=" + c
	}
}
var Util = new UtilClass();

function JAction() {
	this.timePassed = 0;
	this.stop = function() {
		scheduler.unSchedule(this);
		this.stoped()
	};
	this.stoped = function() {
		this.node.actionStopped(this)
	};
	this.start = function(a) {
		this.timePassed = 0;
		this.node = a;
		scheduler.schedule(this)
	};
	this.tick = function(a) {
		this.timePassed += a;
		if (this.timePassed > this.duration) {
			a -= this.timePassed - this.duration
		}
		this.update(a);
		if (this.timePassed >= this.duration) {
			this.stop()
		}
	}
}
function JSequence(a) {
	this.extend(JAction);
	this.actions = a;
	var b = this;
	this.stop = function() {
		this.actions[this.nextAction - 1].stoped = function() {};
		this.actions[this.nextAction - 1].stop();
		this.stoped()
	};
	this.start = function(c) {
		this.nextAction = 0;
		this.node = c;
		this.startNextAction()
	};
	this.startNextAction = function() {
		if (b.nextAction >= b.actions.length) {
			b.stop();
			return
		}
		var c = b.actions[b.nextAction++];
		c.stoped = function() {
			b.startNextAction()
		};
		c.start(b.node)
	}
}
function JSpawn(a) {
	this.extend(JAction);
	this.actions = a;
	var b = this;
	this.stop = function() {
		for (var c = 0; c < this.actions.length; c++) {
			this.actions[c].stop()
		}
	};
	this.start = function(d) {
		this.nextAction = 0;
		this.node = d;
		for (var c = 0; c < this.actions.length; c++) {
			this.actions[c].start(d)
		}
	}
}
function JRepeatForever(a) {
	this.action = a;
	var b = this;
	a.stoped = function() {
		a.node.actionStopped(a);
		a.node.runAction(a)
	};
	this.stoped = function() {
		this.node.actionStopped(this)
	};
	this.stop = function() {
		this.action.stoped = function() {
			a.node.actionStopped(a)
		};
		this.action.stop();
		this.stoped()
	};
	this.start = function(c) {
		this.node = c;
		this.action.start(c)
	}
}
function JCallFunc(obj, func) {
	this.stoped = function() {};
	this.stop = function() {
		this.stoped()
	};
	this.start = function(node) {
		eval("obj." + func + "();");
		this.stop()
	}
}
function JCallFuncO(obj, func, arg) {
	this.stoped = function() {};
	this.stop = function() {
		this.stoped()
	};
	this.start = function() {
		eval("obj." + func + "(arg);");
		this.stop()
	}
}
function JDelayTime(a) {
	this.extend(JAction);
	this.duration = a;
	this.update = function() {}
}
function JMoveBy(a, b) {
	this.extend(JAction);
	this.pos = b;
	this.duration = a;
	this.update = function(c) {
		this.node.position.x += this.pos.x * c / this.duration;
		this.node.position.y += this.pos.y * c / this.duration
	}
}
function JMoveTo(a, b) {
	this.extend(JAction);
	this.pos = b;
	this.duration = a;
	this.firstTime = true;
	this.update = function(c) {
		if (this.firstTime) {
			this.pos = ccp(this.pos.x - this.node.position.x, this.pos.y - this.node.position.y);
			this.firstTime = false
		}
		this.node.position.x += this.pos.x * c / this.duration;
		this.node.position.y += this.pos.y * c / this.duration
	}
}
function JScaleTo(a, b) {
	this.extend(JAction);
	this.scale = b;
	this.duration = a;
	this.firstTime = true;
	this.update = function(c) {
		if (this.firstTime) {
			this.scale = this.scale - this.node.scale;
			this.firstTime = false
		}
		this.node.scale += this.scale * c / this.duration
	}
}
function JRotateBy(b, a) {
	this.extend(JAction);
	this.rotation = a;
	this.duration = b;
	this.update = function(c) {
		this.node.rotation += this.rotation * c / this.duration
	}
}
function JFadeTo(b, a) {
	this.extend(JAction);
	this.opacity = a;
	this.duration = b;
	this.firstTime = true;
	this.update = function(c) {
		if (this.firstTime) {
			this.opacity = this.opacity - this.node.opacity;
			this.firstTime = false
		}
		this.node.opacity += this.opacity * c / this.duration;
		if (this.node.opacity < 0) {
			this.node.opacity = 0
		}
	}
}
function JFadeIn(a) {
	this.extend(JFadeTo);
	this.opacity = 1;
	this.duration = a
}
function JFadeOut(a) {
	this.extend(JFadeTo);
	this.opacity = 0;
	this.duration = a
}
function SchedulerClass() {
	this.sched = [];
	this.schedule = function(a) {
		this.sched.push(a)
	};
	this.unSchedule = function(b) {
		for (var a = 0; a < this.sched.length; a++) {
			if (this.sched[a] == b) {
				this.sched.splice(a, 1);
				return
			}
		}
	};
	this.update = function(b) {
		for (var a = 0; a < this.sched.length; a++) {
			this.sched[a].tick(b)
		}
	}
}
var scheduler = new SchedulerClass();
var TO_DEG = 180 / 3.14159;
var TO_RAD = 3.14195 / 180;
var iPadMultiplier = 1;
var ctx = null;
Object.prototype.extend = function(a) {
	this.__extend = a;
	this.__extend()
};

function ccp(a, b) {
	return {
		x: a,
		y: b
	}
}
function ccs(b, a) {
	return {
		width: b,
		height: a
	}
}
function ccc4(h, f, c, e) {
	function d(l, k, i, j) {
		this.r = l;
		this.g = k;
		this.b = i;
		this.a = j;
		this.getFillStyle = function() {
			return "rgba(" + l + "," + k + "," + i + "," + j + ")"
		}
	}
	return new d(h, f, c, e)
}
var JWhite = ccc4(255, 255, 255, 1);
var JBlack = ccc4(0, 0, 0, 1);

function ContentLoader() {
	var a = this;
	this.loading = true;
	this.itemCount = 10;
	this.loadingCount = 0;
	this.loadedCount = 0;
	this.imgs = [];
	this.addImage = function(b) {
		for (var c = 0; c < this.imgs.length; c++) {
			if (this.imgs[c] == b) {
				return
			}
		}
		this.loadingCount++;
		this.imgs.push(b)
	};
	this.preloadImages = function(b) {
		if (this.loading == false) {
			return
		}
		for (var d = 0; d < b.length; d++) {
			var c = new Image();
			this.addImage(c);
			c.onload = function() {
				a.itemLoaded()
			};
			c.src = "img/" + b[d]
		}
	};
	this.itemLoaded = function() {
		if (this.loading == false) {
			return
		}
		this.loadedCount++;
		if (this.loadedCount == this.loadingCount) {
			this.finishedLoading()
		}
		if (this.itemCount < this.loadingCount) {
			this.itemCount = this.loadingCount
		}
		this.setPercentage(this.loadedCount / this.itemCount)
	};
	this.stopLoading = function() {
		this.loading = false
	};
	this.setPercentage = function() {}
}
function Node() {
	this.position = {
		x: 0,
		y: 0
	};
	this.size = {
		width: 0,
		height: 0
	};
	this.rotation = 0;
	this.scaleDual = {
		x: 1,
		y: 1
	};
	this.scale = 1;
	this.children = [];
	this.parent = null;
	this.update = null;
	this.isMouseEnabled = false;
	this.visible = true;
	this.zIndex = 0;
	this.opacity = 1;
	this.actions = [];
	this.draw = function(b) {
		if (this.update != null) {
			this.update(b)
		}
		if (!this.visible) {
			return
		}
		ctx.save();
		ctx.translate(this.position.x, -this.position.y);
		ctx.rotate(this.rotation * TO_RAD);
		ctx.scale(this.scaleDual.x * this.scale, this.scaleDual.y * this.scale);
		ctx.globalAlpha = this.opacity;
		this.visit();
		for (var a = 0; a < this.children.length; a++) {
			this.children[a].draw(b)
		}
		ctx.restore()
	};
	this.internalUpdateLayout = function() {
		if (this.updateLayout) {
			this.updateLayout()
		}
		for (var a = 0; a < this.children.length; a++) {
			if (this.children[a].internalUpdateLayout) {
				this.children[a].internalUpdateLayout()
			}
		}
	};
	this.addChild = function(a) {
		if (a.parent != null) {
			alert("child allready added");
			return
		}
		this.children.push(a);
		a.parent = this
	};
	this.addChildZ = function(c, b) {
		if (c.parent != null) {
			alert("child allready added");
			return
		}
		c.zIndex = b;
		for (var a = 0; a < this.children.length; a++) {
			if (this.children[a].zIndex > b) {
				this.children.splice(a, 0, c);
				c.parent = this;
				return
			}
		}
		this.children.push(c);
		c.parent = this;
		return
	};
	this.getAbsolutePosition = function(c) {
		var a = ccp(0, 0);
		var b = this;
		while (b != null) {
			a.x += b.position.x;
			a.y += b.position.y;
			b = b.parent
		}
		if (c) {
			c = ccp(c.x, c.y);
			c.x -= a.x;
			c.y -= a.y;
			return c
		}
		return a
	};
	this.propagateMouseDown = function(a) {
		if (this.isMouseEnabled) {
			var c = false;
			for (var b = 0; b < this.children.length; b++) {
				if (this.children[b].propagateMouseDown(a)) {
					c = true
				}
			}
			if (!c) {
				if (this.mouseDown) {
					if (this.mouseDown(a)) {}
				}
			}
			return true
		}
		return false
	};
	this.propagateMouseUp = function(a) {
		if (this.isMouseEnabled) {
			var b = false;
			for (var c = 0; c < this.children.length; c++) {
				if (this.children[c].propagateMouseUp(a)) {
					b = true
				}
			}
			if (!b) {
				if (this.mouseUp) {
					if (this.mouseUp(a)) {}
				}
			}
			return true
		}
		return false
	};
	this.propagateMouseOut = function(a) {
		if (this.isMouseEnabled) {
			var c = false;
			for (var b = 0; b < this.children.length; b++) {
				if (this.children[b].propagateMouseOut(a)) {
					c = true
				}
			}
			if (!c) {
				if (this.mouseOut) {
					if (this.mouseOut(a)) {}
				}
			}
			return true
		}
		return false
	};
	this.propagateMouseMove = function(a) {
		if (this.isMouseEnabled) {
			var c = false;
			for (var b = 0; b < this.children.length; b++) {
				if (this.children[b].propagateMouseMove(a)) {
					c = true
				}
			}
			if (!c) {
				if (this.mouseMove) {
					if (this.mouseMove(a)) {}
				}
			}
			return true
		}
		return false
	};
	this.runAction = function(a) {
		this.actions.push(a);
		a.start(this);
		if (this.actions.length > 30) {
			alert("probably stop action error length " + this.actions.lenght)
		}
	};
	this.actionStopped = function(b) {
		for (var a = 0; a < this.actions.length; a++) {
			if (this.actions[a] == b) {
				this.actions.splice(a, 1);
				break
			}
		}
	};
	this.stopActionByTag = function(a) {
		for (var b = 0; b < this.actions.length; b++) {
			if (this.actions[b].tag == a) {
				this.actions[b].stop();
				b--
			}
		}
	};
	this.stopAllActions = function() {
		for (var a = this.actions.length - 1; a >= 0; a--) {
			this.actions[a].stop()
		}
	};
	this.visit = function() {}
}
function Sprite(a) {
	this.extend(Node);
	this.file = a;
	this.image = new Image();
	var b = this;
	this.init = function() {
		this.image.onload = this.imageLoaded;
		if (this.file) {
			engine.loader.addImage(this);
			this.image.src = "img/" + this.file
		}
	};
	this.imageLoaded = function() {
		engine.loader.itemLoaded();
		b.size = ccs(this.width, this.height)
	};
	this.visit = function() {
		ctx.drawImage(this.image, -this.size.width / 2, -this.size.height / 2)
	};
	this.setFile = function(c) {
		engine.loader.addImage(this);
		this.file = "img/" + c;
		this.image.src = "img/" + c
	};
	this.init()
}
function SpriteCutOutHeight(a) {
	this.extend(Sprite);
	this.file = a;
	this.cutHeight = 0;
	this.visit = function() {
		if (this.size.height == 0) {
			return
		}
		if (this.cutHeight > this.size.height - 1) {
			this.cutHeight = this.size.height - 1
		}
		if (this.cutHeight < 1) {
			this.cutHeight = 1
		}
		ctx.drawImage(this.image, 0, this.cutHeight, this.size.width, this.size.height - this.cutHeight, -this.size.width / 2, -this.size.height / 2 + this.cutHeight, this.size.width, this.size.height - this.cutHeight)
	};
	this.init()
}
function JLabel(d, a, b, c) {
	this.extend(Node);
	this.text = d;
	this.fontName = a;
	this.fontSize = b;
	this.color = JWhite;
	this.strokeColor = JBlack;
	this.stroke = 0;
	this.strokeStyle = this.strokeColor.getFillStyle();
	this.fillStyle = this.color.getFillStyle();
	this.init = function() {
		if (c) {
			this.stroke = c
		}
		if (this.fontName == "" || this.fontName == "defaultFont") {
			this.fontName = "defaultFont"
		}
		ctx.font = this.fontSize + "pt " + this.fontName;
		this.updateSize()
	};
	this.visit = function() {
		ctx.font = this.fontSize + "pt " + this.fontName;
		if (this.stroke > 0) {
			ctx.lineWidth = this.stroke * 2;
			ctx.strokeStyle = this.strokeStyle;
			ctx.strokeText(this.text, -this.size.width / 2, this.size.height / 2)
		}
		ctx.fillStyle = this.fillStyle;
		ctx.fillText(this.text, -this.size.width / 2, this.size.height / 2)
	};
	this.updateLayout = function() {
		this.updateSize()
	};
	this.updateSize = function() {
		ctx.font = this.fontSize + "pt " + this.fontName;
		this.size = ccs(ctx.measureText(this.text).width + this.stroke * 0, this.fontSize + this.stroke * 0)
	};
	this.setText = function(e) {
		this.text = e;
		this.updateSize()
	};
	this.init()
}
function JMenuItemImage(normal, selected, target, func) {
	this.extend(Sprite);
	this.selectedImg = selected;
	this.normalImg = normal;
	this.target = target;
	this.func = func;
	this.enabled = true;
	this.init = function() {
		if (this.normalImg) {
			this.setFile(this.normalImg)
		}
	};
	this.select = function() {
		if (this.selectedImg) {
			this.setFile(this.selectedImg)
		}
	};
	this.deSelect = function() {
		if (this.normalImg) {
			this.setFile(this.normalImg)
		}
	};
	this.clicked = function() {
		eval("this.target." + this.func + "()")
	};
	this.isInside = function(pos) {
		if (this.position.x - this.size.width / 2 <= pos.x && this.position.x + this.size.width / 2 >= pos.x) {
			if (this.position.y - this.size.height / 2 <= pos.y && this.position.y + this.size.height / 2 >= pos.y) {
				return true
			}
		}
		return false
	};
	this.init()
}
function JMenu(a) {
	this.extend(Node);
	this.isMouseEnabled = true;
	if (a) {
		for (var b = 0; b < a.length; b++) {
			this.addChild(a[b])
		}
	}
	this.mouseDown = function(d) {
		d = this.getAbsolutePosition(d);
		for (var c = this.children.length - 1; c >= 0; c--) {
			if (this.children[c].enabled && this.children[c].isInside && this.children[c].isInside(d)) {
				this.selected = this.children[c];
				this.children[c].select();
				break
			}
		}
	};
	this.mouseUp = function(d) {
		d = this.getAbsolutePosition(d);
		for (var c = this.children.length - 1; c >= 0; c--) {
			if (this.children[c].enabled && this.children[c].isInside && this.children[c].isInside(d)) {
				this.children[c].clicked();
				break
			}
		}
		if (this.selected) {
			this.selected.deSelect()
		}
		this.selected = null
	}
}
function EngineClass() {
	this.scene = null;
	this.size = {
		width: 0,
		height: 0
	};
	this.preloaderScene = null;
	this.fps = 100;
	var b = this;
	this.setCanvas = function(c) {
		this.canvas = c;
		ctx = this.canvas.getContext("2d");
		this.size.width = c.width;
		this.size.height = c.height;
		this.canvas.onmousedown = this.mouseDown;
		this.canvas.onmouseup = this.mouseUp;
		this.canvas.onmouseout = this.mouseOut;
		this.canvas.onmousemove = this.mouseMove;
		document.addEventListener("touchstart", this.touchHandler, true);
		document.addEventListener("touchmove", this.touchHandler, true);
		document.addEventListener("touchend", this.touchHandler, true);
		document.addEventListener("touchcancel", this.touchHandler, true);
		window.onload = this.onLoad
	};
	this.setScene = function(c) {
		this.scene = c
	};
	this.setPreloaderScene = function(c) {
		this.preloaderScene = c
	};
	this.removePreloaderScene = function() {
		this.preloaderScene = null
	};
	this.updateLayout = function() {
		if (this.scene != null) {
			this.scene.internalUpdateLayout()
		}
	};
	this.onLoad = function() {};
	this.redraw = function(c) {
		if (ctx != null) {
			ctx.fillRect(0, 0, engine.size.width, engine.size.height)
		}
		if (this.scene != null) {
			ctx.translate(0, this.size.height);
			this.scene.draw(c);
			ctx.translate(0, -this.size.height)
		}
		if (this.preloaderScene != null) {
			ctx.translate(0, this.size.height);
			this.preloaderScene.draw(c);
			ctx.translate(0, -this.size.height)
		}
	};
	var a = new Date().getTime();
	this.loop = function() {
		var c = new Date().getTime();
		scheduler.update((c - a) * 0.001);
		b.redraw((c - a) * 0.001);
		a = c;
		setTimeout("engine.loop()", 1000 / this.fps)
	};
	this.getOffsetPosition = function(f) {
		var d = 0;
		var c = 0;
		if (!f) {
			return {
				x: 0,
				y: 0
			}
		}
		while (f.offsetParent) {
			d += f.offsetLeft;
			if (f.style.marginLeft) {
				d -= parseInt(f.style.marginLeft)
			}
			if (f.style.paddingLeft) {
				d -= parseInt(f.style.paddingLeft)
			}
			if (f.style.margin) {
				d -= parseInt(f.style.margin)
			}
			if (f.style.padding) {
				d -= parseInt(f.style.padding)
			}
			c += f.offsetTop;
			if (f.style.marginTop) {
				c -= parseInt(f.style.marginTop)
			}
			if (f.style.paddingTop) {
				c -= parseInt(f.style.paddingTop)
			}
			if (f.style.margin) {
				c -= parseInt(f.style.margin)
			}
			if (f.style.padding) {
				c -= parseInt(f.style.padding)
			}
			f = f.offsetParent
		}
		d += f.offsetLeft;
		c += f.offsetTop;
		return {
			x: d,
			y: c
		}
	};
	this.getMousePosition = function(f) {
		var d = 0;
		var g = 0;
		if (!f) {
			var f = window.event
		}
		if (f.pageX || f.pageY) {
			d = f.pageX;
			g = f.pageY
		} else {
			if (f.clientX || f.clientY) {
				d = f.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				g = f.clientY + document.body.scrollTop + document.documentElement.scrollTop
			}
		}
		var c = this.getOffsetPosition(this.canvas);
		d -= c.x;
		g -= c.y;
		g = engine.size.height - g;
		return {
			x: d,
			y: g
		}
	};
	this.mouseDown = function(c) {
		if (!c) {
			var c = window.event
		}
		if (b.preloaderScene != null) {
			b.preloaderScene.propagateMouseDown(b.getMousePosition(c))
		} else {
			if (b.scene != null) {
				b.scene.propagateMouseDown(b.getMousePosition(c))
			}
		}
	};
	this.mouseUp = function(c) {
		if (!c) {
			var c = window.event
		}
		if (b.preloaderScene != null) {
			b.preloaderScene.propagateMouseUp(b.getMousePosition(c))
		} else {
			if (b.scene != null) {
				b.scene.propagateMouseUp(b.getMousePosition(c))
			}
		}
	};
	this.mouseOut = function(c) {
		if (!c) {
			var c = window.event
		}
		if (b.scene != null) {
			b.scene.propagateMouseOut(b.getMousePosition(c))
		}
	};
	this.mouseMove = function(c) {
		if (!c) {
			var c = window.event
		}
		if (b.preloaderScene != null) {
			b.preloaderScene.propagateMouseMove(b.getMousePosition(c))
		} else {
			if (b.scene != null) {
				b.scene.propagateMouseMove(b.getMousePosition(c))
			}
		}
	};
	this.touchHandler = function(f) {
		var g = f.changedTouches,
			h = g[0],
			d = "";
		switch (f.type) {
			case "touchstart":
				d = "mousedown";
				break;
			case "touchmove":
				d = "mousemove";
				break;
			case "touchend":
				d = "mouseup";
				break;
			default:
				return
		}
		var e = document.createEvent("MouseEvent");
		e.initMouseEvent(d, true, true, window, 1, h.screenX, h.screenY, h.clientX, h.clientY, false, false, false, false, 0, null);
		h.target.dispatchEvent(e);
		if (f.type == "touchend") {
			var c = document.createEvent("MouseEvent");
			c.initMouseEvent("mouseout", true, true, window, 1, h.screenX, h.screenY, h.clientX, h.clientY, false, false, false, false, 0, null);
			h.target.dispatchEvent(c)
		}
		f.preventDefault()
	};
	this.loader = new ContentLoader();
	this.loader.finishedLoading = function() {
		b.loader.stopLoading();
		setTimeout(function() {
			b.updateLayout()
		}, 10);
		setTimeout(function() {
			b.updateLayout()
		}, 100);
		setTimeout(function() {
			window.scrollTo(0, 1)
		}, 0)
	};
	this.log = function(e, c, d) {
		
	};
	this.loop()
}
var engine = new EngineClass();
ctx = null;

function Ball(a, b) {
	this.extend(Sprite);
	this.color = 0;
	this.suffix = "";
	if (a) {
		this.color = a
	}
	if (b) {
		this.suffix = b
	}
	this.init = function() {
		this.setFile("balls/ball-" + this.color + this.suffix + ".png")
	};
	this.setColor = function(c) {
		this.color = c;
		this.setFile("balls/ball-" + this.color + this.suffix + ".png")
	};
	this.setSuffix = function(c) {
		this.suffix = c;
		this.setFile("balls/ball-" + this.color + this.suffix + ".png")
	};
	this.init()
}
function CircleMini(a, b) {
	this.extend(Node);
	this.circleCounts = [1, 6, 12, 18];
	this.firstCircleRadius = 45;
	this.radius = a;
	this.suffix = b;
	this.init = function() {
		var e = "-mini" + this.suffix;
		this.balls = [];
		for (var d = 0; d < 4; d++) {
			this.balls[d] = [];
			for (var c = 0; c < this.circleCounts[d]; c++) {
				this.balls[d][c] = new Ball(2, e);
				this.addChild(this.balls[d][c]);
				if (d > 0) {
					this.balls[d][c].position = ccp(parseInt(d * this.radius * Math.cos(c * 2 * 3.14159 / this.circleCounts[d])), parseInt(d * this.radius * Math.sin(c * 2 * 3.14159 / this.circleCounts[d])))
				}
				this.balls[d][c].scale = 1.1
			}
		}
	};
	this.loadLevel = function(e) {
		for (var d = 0; d < this.balls.length; d++) {
			for (var c = 0; c < this.balls[d].length; c++) {
				this.balls[d][c].setColor(e.finishOrder[d][c])
			}
		}
	};
	this.init()
}
function Circle() {
	this.extend(Node);
	this.balls = [];
	this.circleCounts = [1, 6, 12, 18];
	this.firstCircleRadius = 45;
	this.horizontalDrift = 0;
	this.h60Drift = 0;
	this.v60Drift = 0;
	this.h120Drift = 0;
	this.v120Drift = 0;
	this.firstCircleAngle = 0;
	this.secondCircleAngle = 0;
	this.thirdCircleAngle = 0;
	this.firstCircleAngleAnimating = false;
	this.secondCircleAngleAnimating = false;
	this.thirdCircleAngleAnimating = false;
	this.horizontalAnimating = false;
	this.v60Animating = false;
	this.v120Animating = false;
	this.ballField = 0;
	this.constantHorizontalUnit;
	this.constantV60Unit;
	this.constantH60Unit;
	this.constantRotationUnit;
	this.init = function() {
		this.ballField = 64 / 2 + (this.firstCircleRadius - 64) / 2;
		for (var b = 0; b < 4; b++) {
			var c = this.circleCounts[b];
			this.balls[b] = [];
			for (var a = 0; a < c; a++) {
				var d = new Ball();
				d.setColor(1);
				this.balls[b][a] = d;
				this.addChild(d)
			}
		}
		this.updatePositions()
	};
	this.stopAllAnimation = function() {
		this.firstCircleAngleAnimating = false;
		this.firstCircleAngle = 0;
		this.secondCircleAngleAnimating = false;
		this.secondCircleAngle = 0;
		this.thirdCircleAngleAnimating = false;
		this.thirdCircleAngle = 0;
		this.horizontalAnimating = false;
		this.horizontalDrift = 0;
		this.v60Animating = false;
		this.v60Drift = 0;
		this.h60Drift = 0;
		this.v120Animating = false;
		this.v120Drift = 0;
		this.h120Drift = 0;
		this.updatePositions()
	};
	this.updatePositions = function() {
		this.balls[0][0].position = ccp(0 + this.horizontalDrift + this.h60Drift + this.h120Drift, 0 + this.v60Drift + this.v120Drift);
		for (var b = 0; b < this.circleCounts[1]; b++) {
			var a = Math.cos(b * 2 * 3.14159 / this.circleCounts[1] + this.firstCircleAngle) * this.firstCircleRadius;
			var c = Math.sin(b * 2 * 3.14159 / this.circleCounts[1] + this.firstCircleAngle) * this.firstCircleRadius;
			if (b % 3 == 0) {
				a += this.horizontalDrift
			}
			if (b % 3 == 1) {
				a += this.h60Drift;
				c += this.v60Drift
			}
			if (b % 3 == 2) {
				a += this.h120Drift;
				c += this.v120Drift
			}
			this.balls[1][b].position = ccp(a, c)
		}
		for (var b = 0; b < this.circleCounts[2]; b++) {
			var a = Math.cos(b * 2 * 3.14159 / this.circleCounts[2] + this.secondCircleAngle) * (2 * this.firstCircleRadius);
			var c = Math.sin(b * 2 * 3.14159 / this.circleCounts[2] + this.secondCircleAngle) * (2 * this.firstCircleRadius);
			if (b % 6 == 0) {
				a += this.horizontalDrift
			}
			if (b % 6 == 2) {
				a += this.h60Drift;
				c += this.v60Drift
			}
			if (b % 6 == 4) {
				a += this.h120Drift;
				c += this.v120Drift
			}
			this.balls[2][b].position = ccp(a, c)
		}
		for (var b = 0; b < this.circleCounts[3]; b++) {
			var a = Math.cos(b * 2 * 3.14159 / this.circleCounts[3] + this.thirdCircleAngle) * (3 * this.firstCircleRadius);
			var c = Math.sin(b * 2 * 3.14159 / this.circleCounts[3] + this.thirdCircleAngle) * (3 * this.firstCircleRadius);
			if (b % 9 == 0) {
				a += this.horizontalDrift
			}
			if (b % 9 == 3) {
				a += this.h60Drift;
				c += this.v60Drift
			}
			if (b % 9 == 6) {
				a += this.h120Drift;
				c += this.v120Drift
			}
			this.balls[3][b].position = ccp(a, c)
		}
	};
	this.update = function(e) {
		if (this.horizontalAnimating || this.v60Animating || this.v120Animating || this.firstCircleAngleAnimating || this.secondCircleAngleAnimating || this.thirdCircleAngleAnimating) {} else {}
		var f = this.constantHorizontalUnit * e;
		var g = this.constantV60Unit * e;
		var c = this.constantH60Unit * e;
		var d = g;
		var a = c;
		var b = this.constantRotationUnit * e;
		if (this.horizontalAnimating) {
			if (this.horizontalDrift <= f && this.horizontalDrift >= -f) {
				this.horizontalAnimating = false;
				this.horizontalDrift = 0
			} else {
				if (this.horizontalDrift > 0) {
					this.horizontalDrift -= f
				} else {
					this.horizontalDrift += f
				}
			}
		}
		if (this.v60Animating) {
			if (this.v60Drift <= g && this.v60Drift >= -g) {
				this.v60Animating = false;
				this.v60Drift = 0;
				this.h60Drift = 0
			} else {
				if (this.v60Drift > 0) {
					this.v60Drift -= g;
					this.h60Drift -= c
				} else {
					this.v60Drift += g;
					this.h60Drift += c
				}
			}
		}
		if (this.v120Animating) {
			if (this.v120Drift <= d && this.v120Drift >= -d) {
				this.v120Animating = false;
				this.v120Drift = 0;
				this.h120Drift = 0
			} else {
				if (this.v120Drift > 0) {
					this.v120Drift -= d;
					this.h120Drift += a
				} else {
					this.v120Drift += d;
					this.h120Drift -= a
				}
			}
		}
		if (this.firstCircleAngleAnimating) {
			if (this.firstCircleAngle <= b && this.firstCircleAngle >= -b) {
				this.firstCircleAngleAnimating = false;
				this.firstCircleAngle = 0
			} else {
				if (this.firstCircleAngle > 0) {
					this.firstCircleAngle -= b
				} else {
					this.firstCircleAngle += b
				}
			}
		}
		if (this.secondCircleAngleAnimating) {
			if (this.secondCircleAngle <= b && this.secondCircleAngle >= -b) {
				this.secondCircleAngleAnimating = false;
				this.secondCircleAngle = 0
			} else {
				if (this.secondCircleAngle > 0) {
					this.secondCircleAngle -= b
				} else {
					this.secondCircleAngle += b
				}
			}
		}
		if (this.thirdCircleAngleAnimating) {
			if (this.thirdCircleAngle <= b && this.thirdCircleAngle >= -b) {
				this.thirdCircleAngleAnimating = false;
				this.thirdCircleAngle = 0
			} else {
				if (this.thirdCircleAngle > 0) {
					this.thirdCircleAngle -= b
				} else {
					this.thirdCircleAngle += b
				}
			}
		}
		this.updatePositions()
	};
	this.loadLevel = function(c) {
		for (var b = 0; b < this.balls.length; b++) {
			for (var a = 0; a < this.balls[b].length; a++) {
				this.balls[b][a].setColor(c.startOrder[b][a])
			}
		}
	};
	this.isEqualToColors = function(a) {
		for (var c = 0; c < this.balls.length; c++) {
			for (var b = 0; b < this.balls[c].length; b++) {
				if (this.balls[c][b].color != a[c][b]) {
					return false
				}
			}
		}
		return true
	};
	this.init()
}
function TouchableCircle() {
	this.extend(Circle);
	this.selectedBall = null;
	this.currentMove = 0;
	this.isMouseEnabled = true;
	this.moveHistory = [];
	this.circleDelegate = null;
	this.currentDelay = 0;
	this.init = function() {
		this.pathSelected = new Sprite("pathsSelected-first.png");
		this.pathSelected.visible = false;
		this.addChildZ(this.pathSelected, -1)
	};
	this.normalizeAngle = function(b, a, c) {
		if (a < 0 && c > 0) {
			b += 3.14159
		}
		if (a < 0 && c <= 0) {
			b -= 3.14159
		}
		if (b > 2 * 3.14159) {
			b -= 2 * 3.14159
		}
		if (b < -2 * 3.14159) {
			b += 2 * 3.14159
		}
		return b
	};
	this.distanceFromLine = function(a, b) {
		return Math.abs(a * b.x - b.y) / Math.sqrt(Math.pow(a, 2) + 1)
	};
	this.calculateOnLineDistance = function(b, e) {
		var d = Math.atan(b);
		var a = e.x * Math.cos(-d) - e.y * Math.sin(-d);
		var c = this.startPos.x * Math.cos(-d) - this.startPos.y * Math.sin(-d);
		if (b > 0) {
			return a - c
		} else {
			return c - a
		}
	};
	this.setSelectedPath = function(f) {
		var b = 0;
		if (this.selected == "first") {
			for (var d = 0; d < this.balls[1].length; d++) {
				var e = this.balls[1][d];
				if (e.color != 0) {
					b++
				}
				e.setSuffix("-white")
			}
		} else {
			if (this.selected == "second") {
				for (var d = 0; d < this.balls[2].length; d++) {
					var e = this.balls[2][d];
					if (e.color != 0) {
						b++
					}
					e.setSuffix("-white")
				}
			} else {
				if (this.selected == "third") {
					for (var d = 0; d < this.balls[3].length; d++) {
						var e = this.balls[3][d];
						if (e.color != 0) {
							b++
						}
						e.setSuffix("-white")
					}
				} else {
					if (this.selected == "horizontal") {
						var g = this.balls;
						var c = [g[0][0], g[1][0], g[1][3], g[2][0], g[2][6], g[3][0], g[3][9]];
						for (var d = 0; d < c.length; d++) {
							var e = c[d];
							if (e.color != 0) {
								b++
							}
							e.setSuffix("-white")
						}
					} else {
						if (this.selected == "60") {
							var g = this.balls;
							var c = [g[0][0], g[1][1], g[1][4], g[2][2], g[2][8], g[3][3], g[3][12]];
							for (var d = 0; d < c.length; d++) {
								var e = c[d];
								if (e.color != 0) {
									b++
								}
								e.setSuffix("-white")
							}
						} else {
							if (this.selected == "120") {
								var g = this.balls;
								var c = [g[0][0], g[1][2], g[1][5], g[2][4], g[2][10], g[3][6], g[3][15]];
								for (var d = 0; d < c.length; d++) {
									var e = c[d];
									if (e.color != 0) {
										b++
									}
									e.setSuffix("-white")
								}
							}
						}
					}
				}
			}
		} if (b == 0) {
			this.pathDeselected();
			this.selected = "nil";
			return
		}
		if (f == "60") {
			f = "horizontal";
			this.pathSelected.rotation = -60
		} else {
			if (f == "120") {
				f = "horizontal";
				this.pathSelected.rotation = -120
			} else {
				this.pathSelected.rotation = 0
			}
		}
		var a = "pathsSelected-" + f + ".png";
		this.pathSelected.setFile(a);
		this.pathSelected.position = ccp(0, 0);
		this.pathSelected.visible = true
	};
	this.selectBall = function(f) {
		var d = Math.atan(f.y / f.x);
		d = this.normalizeAngle(d, f.x, f.y);
		var e = Math.sqrt(Math.pow(f.x, 2) + Math.pow(f.y, 2));
		var c = null;
		if (e >= this.ballField && e < this.ballField + this.firstCircleRadius) {
			c = this.balls[1]
		} else {
			if (e >= this.ballField + this.firstCircleRadius && e < 2 * this.firstCircleRadius + this.ballField) {
				c = this.balls[2]
			} else {
				if (e >= 2 * this.firstCircleRadius + this.ballField && e < 3 * this.firstCircleRadius + this.ballField) {
					c = this.balls[3]
				}
			}
		} if (c != null) {
			var b = c.length;
			var a = 2 * 3.14159 / b;
			if (d <= -a / 2) {
				d = 2 * 3.14159 + d
			}
			this.selectedBall = c[parseInt((d + a / 2) / a)]
		} else {
			if (e < this.ballField) {
				this.selectedBall = this.balls[0][0]
			} else {
				this.selectedBall = null
			}
		} if (this.selectedBall != null && this.selectedBall.color != 0) {
			this.selectedBall.setSuffix("-white")
		}
	};
	this.selectMethod = function(g) {
		var b = Math.sqrt(Math.pow(g.x, 2) + Math.pow(g.y, 2));
		var e = Math.sqrt(Math.pow(this.startPos.x, 2) + Math.pow(this.startPos.y, 2));
		var d = Math.sqrt(Math.pow(g.x - this.startPos.x, 2) + Math.pow(g.y - this.startPos.y, 2));
		var c = this.distanceFromLine(Math.sqrt(3), g);
		var j = this.distanceFromLine(Math.sqrt(3), ccp(g.x + (this.startPos.y / Math.sqrt(3) - this.startPos.x), g.y));
		var f = this.distanceFromLine(-Math.sqrt(3), g);
		var h = this.distanceFromLine(-Math.sqrt(3), ccp(g.x + (this.startPos.y / -Math.sqrt(3) - this.startPos.x), g.y));
		var a = this.calculateOnLineDistance(Math.sqrt(3), g);
		var i = this.calculateOnLineDistance(-Math.sqrt(3), g);
		if ("notsure60" == this.selected) {
			if (d > 10 * iPadMultiplier) {
				if (e < this.ballField) {
					if (Math.abs(a) > Math.abs(i) && Math.abs(a) > Math.abs(g.x - this.startPos.x)) {
						this.selected = "60"
					} else {
						if (Math.abs(i) > Math.abs(a) && Math.abs(i) > Math.abs(g.x - this.startPos.x)) {
							this.selected = "120"
						} else {
							this.selected = "horizontal"
						}
					}
				} else {
					if (j < Math.abs(a)) {
						this.selected = "60"
					} else {
						if (e >= this.ballField && e < this.ballField + this.firstCircleRadius) {
							this.selected = "first"
						} else {
							if (e >= this.ballField + this.firstCircleRadius && e < 2 * this.firstCircleRadius + this.ballField) {
								this.selected = "second"
							} else {
								if (e >= 2 * this.firstCircleRadius + this.ballField && e < 3 * this.firstCircleRadius + this.ballField) {
									this.selected = "third"
								} else {
									this.selected = "none"
								}
							}
						}
					}
				}
				this.startAngle = Math.atan(g.y / g.x);
				this.startAngle = this.normalizeAngle(this.startAngle, g.x, g.y);
				this.startPos.x = g.x;
				this.startPos.y = g.y
			}
		} else {
			if ("notsure120" == this.selected) {
				if (d > 10 * iPadMultiplier) {
					if (h < Math.abs(i)) {
						this.selected = "120"
					} else {
						if (e >= this.ballField && e < this.ballField + this.firstCircleRadius) {
							this.selected = "first"
						} else {
							if (e >= this.ballField + this.firstCircleRadius && e < 2 * this.firstCircleRadius + this.ballField) {
								this.selected = "second"
							} else {
								if (e >= 2 * this.firstCircleRadius + this.ballField && e < 3 * this.firstCircleRadius + this.ballField) {
									this.selected = "third"
								} else {
									this.selected = "none"
								}
							}
						}
					}
					this.startAngle = Math.atan(g.y / g.x);
					this.startAngle = this.normalizeAngle(this.startAngle, g.x, g.y);
					this.startPos.x = g.x;
					this.startPos.y = g.y
				}
			} else {
				if ("notsureh" == this.selected) {
					if (Math.abs(g.x - this.startPos.x) > 10 * iPadMultiplier || Math.abs(g.y - this.startPos.y) > 10 * iPadMultiplier) {
						if (Math.abs(g.y - this.startPos.y) < 10 * iPadMultiplier) {
							this.selected = "horizontal"
						} else {
							if (e >= this.ballField && e < this.ballField + this.firstCircleRadius) {
								this.selected = "first"
							} else {
								if (e >= this.ballField + this.firstCircleRadius && e < 2 * this.firstCircleRadius + this.ballField) {
									this.selected = "second"
								} else {
									if (e >= 2 * this.firstCircleRadius + this.ballField && e < 3 * this.firstCircleRadius + this.ballField) {
										this.selected = "third"
									} else {
										this.selected = "none"
									}
								}
							}
						}
						this.startAngle = Math.atan(g.y / g.x);
						this.startAngle = this.normalizeAngle(this.startAngle, g.x, g.y);
						this.startPos.x = g.x;
						this.startPos.y = g.y
					}
				} else {
					if (c > -this.ballField && c < this.ballField) {
						this.selected = "notsure60"
					} else {
						if (f > -this.ballField && f < this.ballField) {
							this.selected = "notsure120"
						} else {
							if (g.y > -this.ballField && g.y < this.ballField) {
								this.selected = "notsureh"
							} else {
								if (b >= this.ballField && b < this.ballField + this.firstCircleRadius) {
									this.selected = "first"
								} else {
									if (b >= this.ballField + this.firstCircleRadius && b < 2 * this.firstCircleRadius + this.ballField) {
										this.selected = "second"
									} else {
										if (b >= 2 * this.firstCircleRadius + this.ballField && b < 3 * this.firstCircleRadius + this.ballField) {
											this.selected = "third"
										} else {
											this.selected = "nil"
										}
									}
								}
							}
						}
					}
				}
			}
		} if (this.selected == "first" || this.selected == "second" || this.selected == "third" || this.selected == "horizontal" || this.selected == "60" || this.selected == "120") {
			this.setSelectedPath(this.selected)
		}
	};
	this.mouseDown = function(b) {
		var a = this.getAbsolutePosition();
		b = ccp(b.x, b.y);
		b.x -= a.x;
		b.y -= a.y;
		if (b.x == 0) {
			b.x = 1
		}
		this.startAngle = Math.atan(b.y / b.x);
		this.startAngle = this.normalizeAngle(this.startAngle, b.x, b.y);
		this.startPos = ccp(b.x, b.y);
		this.touchStartBalls = [this.balls[0][0], this.balls[1][0], this.balls[2][0], this.balls[3][0]];
		this.selectMethod(b);
		if ("nil" != this.selectedMethod) {
			this.stopAllAnimation()
		}
		this.selectBall(b);
		return true
	};
	this.mouseOut = function(a) {
		this.mouseUp(a)
	};
	this.mouseUp = function(c) {
		var a = this.getAbsolutePosition();
		c = ccp(c.x, c.y);
		c.x -= a.x;
		c.y -= a.y;
		if (c.x == 0) {
			c.x = 1
		}
		if ("60" == this.selected) {
			this.v60Animating = true;
			this.constantV60Unit = Math.sin(60 * 3.14159 / 180) * this.ballField * 10;
			this.constantH60Unit = Math.cos(60 * 3.14159 / 180) * this.ballField * 10;
			this.addMoveToHistoryForPlaces(this.currentMove);
			this.currentMove = 0
		} else {
			if ("120" == this.selected) {
				this.v120Animating = true;
				this.constantV60Unit = Math.sin(60 * 3.14159 / 180) * this.ballField * 10;
				this.constantH60Unit = Math.cos(60 * 3.14159 / 180) * this.ballField * 10;
				this.addMoveToHistoryForPlaces(this.currentMove);
				this.currentMove = 0
			} else {
				if ("horizontal" == this.selected) {
					this.horizontalAnimating = true;
					this.constantHorizontalUnit = this.ballField * 10;
					this.addMoveToHistoryForPlaces(this.currentMove);
					this.currentMove = 0
				} else {
					if ("first" == this.selected) {
						var b = Math.round(this.balls[1].length * this.firstCircleAngle / (2 * 3.14156));
						this.moveForward(this.balls[1], b);
						this.firstCircleAngle = this.firstCircleAngle - b * 2 * 3.14159 / this.balls[1].length;
						this.firstCircleAngleAnimating = true;
						this.initRotationForAngle(3.14159);
						this.addMoveToHistoryForPlaces(b)
					} else {
						if ("second" == this.selected) {
							var b = Math.round(this.balls[2].length * this.secondCircleAngle / (2 * 3.14156));
							this.moveForward(this.balls[2], b);
							this.secondCircleAngle = this.secondCircleAngle - b * 2 * 3.14159 / this.balls[2].length;
							this.secondCircleAngleAnimating = true;
							this.initRotationForAngle(3.14159);
							this.addMoveToHistoryForPlaces(b)
						} else {
							if ("third" == this.selected) {
								var b = Math.round(this.balls[3].length * this.thirdCircleAngle / (2 * 3.14156));
								this.moveForward(this.balls[3], b);
								this.thirdCircleAngle = this.thirdCircleAngle - b * 2 * 3.14159 / this.balls[3].length;
								this.thirdCircleAngleAnimating = true;
								this.initRotationForAngle(3.14159);
								this.addMoveToHistoryForPlaces(b)
							}
						}
					}
				}
			}
		}
		this.pathSelected.visible = false;
		this.updatePositions();
		this.pathDeselected();
		this.selected = "";
		if (this.selectedBall != null && this.selectedBall.color != 0) {
			this.selectedBall.setSuffix("")
		}
	};
	this.mouseMove = function(e) {
		var a = this.getAbsolutePosition();
		e = ccp(e.x, e.y);
		e.x -= a.x;
		e.y -= a.y;
		if (e.x == 0) {
			e.x = 1
		}
		if (this.selected == "") {
			return
		}
		if ("notsureh" == this.selected || "notsure60" == this.selected || "notsure120" == this.selected) {
			this.selectMethod(e)
		} else {
			if ("60" == this.selected) {
				var d = this.calculateOnLineDistance(Math.sqrt(3), e);
				while (d > this.ballField) {
					this.currentMove++;
					this.startPos.y += Math.sin(60 / 180 * 3.14159) * this.ballField * 2;
					this.startPos.x += Math.cos(60 / 180 * 3.14159) * this.ballField * 2;
					var b = this.balls[3][3];
					this.balls[3][3] = this.balls[2][2];
					this.balls[2][2] = this.balls[1][1];
					this.balls[1][1] = this.balls[0][0];
					this.balls[0][0] = this.balls[1][4];
					this.balls[1][4] = this.balls[2][8];
					this.balls[2][8] = this.balls[3][12];
					this.balls[3][12] = b;
					d = this.calculateOnLineDistance(Math.sqrt(3), e)
				}
				while (d < -this.ballField) {
					this.currentMove--;
					this.startPos.y -= Math.sin(60 / 180 * 3.14159) * this.ballField * 2;
					this.startPos.x -= Math.cos(60 / 180 * 3.14159) * this.ballField * 2;
					var b = this.balls[3][12];
					this.balls[3][12] = this.balls[2][8];
					this.balls[2][8] = this.balls[1][4];
					this.balls[1][4] = this.balls[0][0];
					this.balls[0][0] = this.balls[1][1];
					this.balls[1][1] = this.balls[2][2];
					this.balls[2][2] = this.balls[3][3];
					this.balls[3][3] = b;
					d = this.calculateOnLineDistance(Math.sqrt(3), e)
				}
				this.v60Drift = Math.sin(60 / 180 * 3.14159) * d;
				this.h60Drift = Math.cos(60 / 180 * 3.14159) * d
			} else {
				if ("120" == this.selected) {
					var c = this.calculateOnLineDistance(-Math.sqrt(3), e);
					while (c > this.ballField) {
						this.currentMove++;
						this.startPos.y += Math.sin(120 / 180 * 3.14159) * this.ballField * 2;
						this.startPos.x += Math.cos(120 / 180 * 3.14159) * this.ballField * 2;
						var b = this.balls[3][6];
						this.balls[3][6] = this.balls[2][4];
						this.balls[2][4] = this.balls[1][2];
						this.balls[1][2] = this.balls[0][0];
						this.balls[0][0] = this.balls[1][5];
						this.balls[1][5] = this.balls[2][10];
						this.balls[2][10] = this.balls[3][15];
						this.balls[3][15] = b;
						c = this.calculateOnLineDistance(-Math.sqrt(3), e)
					}
					while (c < -this.ballField) {
						this.currentMove--;
						this.startPos.y -= Math.sin(120 / 180 * 3.14159) * this.ballField * 2;
						this.startPos.x -= Math.cos(120 / 180 * 3.14159) * this.ballField * 2;
						var b = this.balls[3][15];
						this.balls[3][15] = this.balls[2][10];
						this.balls[2][10] = this.balls[1][5];
						this.balls[1][5] = this.balls[0][0];
						this.balls[0][0] = this.balls[1][2];
						this.balls[1][2] = this.balls[2][4];
						this.balls[2][4] = this.balls[3][6];
						this.balls[3][6] = b;
						c = this.calculateOnLineDistance(-Math.sqrt(3), e)
					}
					this.v120Drift = Math.sin(120 / 180 * 3.14159) * c;
					this.h120Drift = Math.cos(120 / 180 * 3.14159) * c
				} else {
					if ("horizontal" == this.selected) {
						this.horizontalDrift = e.x - this.startPos.x;
						while (this.horizontalDrift > this.ballField) {
							this.currentMove++;
							this.startPos.x += this.ballField * 2;
							var b = this.balls[3][0];
							this.balls[3][0] = this.balls[2][0];
							this.balls[2][0] = this.balls[1][0];
							this.balls[1][0] = this.balls[0][0];
							this.balls[0][0] = this.balls[1][3];
							this.balls[1][3] = this.balls[2][6];
							this.balls[2][6] = this.balls[3][9];
							this.balls[3][9] = b;
							this.horizontalDrift = e.x - this.startPos.x
						}
						while (this.horizontalDrift <= -this.ballField) {
							this.currentMove--;
							this.startPos.x -= this.ballField * 2;
							var b = this.balls[3][9];
							this.balls[3][9] = this.balls[2][6];
							this.balls[2][6] = this.balls[1][3];
							this.balls[1][3] = this.balls[0][0];
							this.balls[0][0] = this.balls[1][0];
							this.balls[1][0] = this.balls[2][0];
							this.balls[2][0] = this.balls[3][0];
							this.balls[3][0] = b;
							this.horizontalDrift = e.x - this.startPos.x
						}
					} else {
						if ("first" == this.selected) {
							this.firstCircleAngle = Math.atan(e.y / e.x) - this.startAngle;
							this.firstCircleAngle = this.normalizeAngle(this.firstCircleAngle, e.x, e.y);
							this.firstCircleAngleAnimating = false
						} else {
							if ("second" == this.selected) {
								this.secondCircleAngle = Math.atan(e.y / e.x) - this.startAngle;
								this.secondCircleAngle = this.normalizeAngle(this.secondCircleAngle, e.x, e.y);
								this.secondCircleAngleAnimating = false
							} else {
								if ("third" == this.selected) {
									this.thirdCircleAngle = Math.atan(e.y / e.x) - this.startAngle;
									this.thirdCircleAngle = this.normalizeAngle(this.thirdCircleAngle, e.x, e.y);
									this.thirdCircleAngleAnimating = false
								}
							}
						}
					}
				}
			}
		}
		this.updatePositions()
	};
	this.addMoveToHistoryForPlaces = function(b) {
		if (b == 0) {
			return
		}
		var a = -1;
		if (this.selected == "first") {
			a = this.balls[1].length
		} else {
			if (this.selected == "second") {
				a = this.balls[2].length
			} else {
				if (this.selected == "third") {
					a = this.balls[3].length
				}
			}
		}
		var d = {
			selected: this.selected,
			places: b
		};
		if (this.moveHistory.length > 0) {
			var c = this.moveHistory[this.moveHistory.length - 1];
			if (this.selected == c.selected) {
				if ((b == -c.places) || (b == c.places && (a / 2 == b || a / 2 == -b))) {
					this.moveHistory.pop();
					if (this.circleDelegate != null) {
						this.circleDelegate.addMoves(-1)
					}
					return
				}
			}
		}
		this.moveHistory.push(d);
		this.circleDelegate.addMoves(1)
	};
	this.moveForward = function(c, a) {
		if (a > 0) {
			for (var b = 0; b < a; b++) {
				c.splice(0, 0, c.pop())
			}
		} else {
			for (var b = 0; b < -a; b++) {
				c.push(c[0]);
				c.splice(0, 1)
			}
		}
	};
	this.initRotationForAngle = function(a) {
		if (a < 0) {
			a *= -1
		}
		this.constantRotationUnit = a / 0.4
	};
	this.pathDeselected = function() {
		if (this.selected == "first") {
			for (var a = 0; a < this.balls[1].length; a++) {
				this.balls[1][a].setSuffix("")
			}
		} else {
			if (this.selected == "second") {
				for (var a = 0; a < this.balls[2].length; a++) {
					this.balls[2][a].setSuffix("")
				}
			} else {
				if (this.selected == "third") {
					for (var a = 0; a < this.balls[3].length; a++) {
						this.balls[3][a].setSuffix("")
					}
				} else {
					if (this.selected == "horizontal") {
						this.balls[0][0].setSuffix("");
						this.balls[1][0].setSuffix("");
						this.balls[1][3].setSuffix("");
						this.balls[2][0].setSuffix("");
						this.balls[2][6].setSuffix("");
						this.balls[3][0].setSuffix("");
						this.balls[3][9].setSuffix("")
					} else {
						if (this.selected == "60") {
							this.balls[0][0].setSuffix("");
							this.balls[1][1].setSuffix("");
							this.balls[1][4].setSuffix("");
							this.balls[2][2].setSuffix("");
							this.balls[2][8].setSuffix("");
							this.balls[3][3].setSuffix("");
							this.balls[3][12].setSuffix("")
						} else {
							if (this.selected == "120") {
								this.balls[0][0].setSuffix("");
								this.balls[1][2].setSuffix("");
								this.balls[1][5].setSuffix("");
								this.balls[2][4].setSuffix("");
								this.balls[2][10].setSuffix("");
								this.balls[3][6].setSuffix("");
								this.balls[3][15].setSuffix("")
							}
						}
					}
				}
			}
		}
	};
	this.showPath = function(a) {
		if (a == "60") {
			a = "horizontal";
			this.pathSelected.rotation = -60
		} else {
			if (a == "120") {
				a = "horizontal";
				this.pathSelected.rotation = -120
			} else {
				this.pathSelected.rotation = 0
			}
		}
		this.pathSelected.setFile("pathsSelected-" + a + ".png");
		this.pathSelected.position = ccp(0, 0);
		this.pathSelected.visible = true
	};
	this.hidePath = function() {
		this.pathSelected.visible = false
	};
	this.historyUndo = function() {
		if (this.moveHistory.length <= 0) {
			return 0
		}
		var a = this.moveHistory.pop();
		var b = a.places;
		this.circleDelegate.addMoves(-1);
		if ("60" == a.selected) {
			this.constantV60Unit = Math.sin(60 * 3.14159 / 180) * this.ballField * Math.abs(a.places) / 0.2;
			this.constantH60Unit = Math.cos(60 * 3.14159 / 180) * this.ballField * Math.abs(a.places) / 0.2;
			this.currentDelay = 0.2 / Math.abs(a.places);
			this.addMove60ForPlaces(a.places);
			this.currentMove = 0
		} else {
			if ("120" == a.selected) {
				this.constantV60Unit = Math.sin(60 * 3.14159 / 180) * this.ballField * Math.abs(a.places) / 0.2;
				this.constantH60Unit = Math.cos(60 * 3.14159 / 180) * this.ballField * Math.abs(a.places) / 0.2;
				this.currentDelay = 0.2 / Math.abs(a.places);
				this.addMove120ForPlaces(a.places);
				this.currentMove = 0
			} else {
				if ("horizontal" == a.selected) {
					this.constantHorizontalUnit = this.ballField * Math.abs(a.places) / 0.2;
					this.currentDelay = 0.2 / Math.abs(a.places);
					this.addMoveHorizontalForPlaces(a.places);
					this.currentMove = 0
				} else {
					if ("first" == a.selected) {
						this.firstCircleAngle = this.firstCircleAngle + a.places * 2 * 3.14159 / this.balls[1].length;
						this.moveForward(this.balls[1], -a.places);
						this.firstCircleAngleAnimating = true;
						this.initRotationForAngle(this.firstCircleAngle)
					} else {
						if ("second" == a.selected) {
							this.secondCircleAngle = this.secondCircleAngle + a.places * 2 * 3.14159 / this.balls[2].length;
							this.moveForward(this.balls[2], -a.places);
							this.initRotationForAngle(this.secondCircleAngle);
							this.secondCircleAngleAnimating = true
						} else {
							if ("third" == a.selected) {
								this.thirdCircleAngle = this.thirdCircleAngle + a.places * 2 * 3.14159 / this.balls[3].length;
								this.moveForward(this.balls[3], -a.places);
								this.initRotationForAngle(this.thirdCircleAngle);
								this.thirdCircleAngleAnimating = true
							}
						}
					}
				}
			}
		}
		return b
	};
	this.addMoveHorizontalForPlaces = function(c) {
		var f = c;
		this.horizontalAnimating = true;
		var e = f;
		if (e > 0) {
			e = 1
		}
		if (e < 0) {
			e = -1
		}
		this.horizontalDrift = e * this.ballField * 2;
		if (f < 0) {
			f++;
			var d = this.balls[3][0];
			this.balls[3][0] = this.balls[2][0];
			this.balls[2][0] = this.balls[1][0];
			this.balls[1][0] = this.balls[0][0];
			this.balls[0][0] = this.balls[1][3];
			this.balls[1][3] = this.balls[2][6];
			this.balls[2][6] = this.balls[3][9];
			this.balls[3][9] = d
		}
		if (f > 0) {
			f--;
			var d = this.balls[3][9];
			this.balls[3][9] = this.balls[2][6];
			this.balls[2][6] = this.balls[1][3];
			this.balls[1][3] = this.balls[0][0];
			this.balls[0][0] = this.balls[1][0];
			this.balls[1][0] = this.balls[2][0];
			this.balls[2][0] = this.balls[3][0];
			this.balls[3][0] = d
		}
		if (f != 0) {
			var b = new JDelayTime(this.currentDelay);
			var a = new JCallFuncO(this, "addMoveHorizontalForPlaces", f);
			this.runAction(new JSequence([b, a]))
		}
	};
	this.addMove60ForPlaces = function(c) {
		var f = c;
		this.v60Animating = true;
		var e = f;
		if (e > 0) {
			e = 1
		}
		if (e < 0) {
			e = -1
		}
		this.v60Drift = Math.sin(60 / 180 * 3.14159) * e * this.ballField * 2;
		this.h60Drift = Math.cos(60 / 180 * 3.14159) * e * this.ballField * 2;
		if (f < 0) {
			f++;
			var d = this.balls[3][3];
			this.balls[3][3] = this.balls[2][2];
			this.balls[2][2] = this.balls[1][1];
			this.balls[1][1] = this.balls[0][0];
			this.balls[0][0] = this.balls[1][4];
			this.balls[1][4] = this.balls[2][8];
			this.balls[2][8] = this.balls[3][12];
			this.balls[3][12] = d
		}
		if (f > 0) {
			f--;
			var d = this.balls[3][12];
			this.balls[3][12] = this.balls[2][8];
			this.balls[2][8] = this.balls[1][4];
			this.balls[1][4] = this.balls[0][0];
			this.balls[0][0] = this.balls[1][1];
			this.balls[1][1] = this.balls[2][2];
			this.balls[2][2] = this.balls[3][3];
			this.balls[3][3] = d
		}
		if (f != 0) {
			var b = new JDelayTime(this.currentDelay);
			var a = new JCallFuncO(this, "addMove60ForPlaces", f);
			this.runAction(new JSequence([b, a]))
		}
	};
	this.addMove120ForPlaces = function(c) {
		var f = c;
		this.v120Animating = true;
		var e = f;
		if (e > 0) {
			e = 1
		}
		if (e < 0) {
			e = -1
		}
		this.v120Drift = Math.sin(120 / 180 * 3.14159) * e * this.ballField * 2;
		this.h120Drift = Math.cos(120 / 180 * 3.14159) * e * this.ballField * 2;
		if (f < 0) {
			f++;
			var d = this.balls[3][6];
			this.balls[3][6] = this.balls[2][4];
			this.balls[2][4] = this.balls[1][2];
			this.balls[1][2] = this.balls[0][0];
			this.balls[0][0] = this.balls[1][5];
			this.balls[1][5] = this.balls[2][10];
			this.balls[2][10] = this.balls[3][15];
			this.balls[3][15] = d
		}
		if (f > 0) {
			f--;
			var d = this.balls[3][15];
			this.balls[3][15] = this.balls[2][10];
			this.balls[2][10] = this.balls[1][5];
			this.balls[1][5] = this.balls[0][0];
			this.balls[0][0] = this.balls[1][2];
			this.balls[1][2] = this.balls[2][4];
			this.balls[2][4] = this.balls[3][6];
			this.balls[3][6] = d
		}
		if (f != 0) {
			var b = new JDelayTime(this.currentDelay);
			var a = new JCallFuncO(this, "addMove120ForPlaces", f);
			this.runAction(new JSequence([b, a]))
		}
	};
	this.init()
}
function Level() {
	this.startOrder = [];
	this.finishOrder = [];
	this.levelId = 0;
	this.title = "";
	this.minMoves = 0;
	for (var a = 0; a < 4; a++) {
		this.startOrder[a] = [];
		this.finishOrder[a] = []
	}
	this.loadFromReader = function(b) {
		var d;
		this.levelId = -1;
		var f = 0;
		while ((d = b.readTrimmedLine()) != null) {
			if (";" == d) {
				break
			}
			if (this.levelId == -1) {
				this.levelId = parseInt(d.substring(0, d.indexOf(" ")));
				this.title = d.substring(d.indexOf(" ") + 1)
			}
			if (f == 1) {
				this.startOrder[0][0] = parseInt(d)
			}
			if (f == 2) {
				var c = d.split(" ");
				for (var e = 0; e < c.length && e < 6; e++) {
					this.startOrder[1][e] = parseInt(c[e])
				}
			}
			if (f == 3) {
				var c = d.split(" ");
				for (var e = 0; e < c.length && e < 12; e++) {
					this.startOrder[2][e] = parseInt(c[e])
				}
			}
			if (f == 4) {
				var c = d.split(" ");
				for (var e = 0; e < c.length && e < 18; e++) {
					this.startOrder[3][e] = parseInt(c[e])
				}
			}
			if (f == 5) {
				this.finishOrder[0][0] = parseInt(d)
			}
			if (f == 6) {
				var c = d.split(" ");
				for (var e = 0; e < c.length && e < 6; e++) {
					this.finishOrder[1][e] = parseInt(c[e])
				}
			}
			if (f == 7) {
				var c = d.split(" ");
				for (var e = 0; e < c.length && e < 12; e++) {
					this.finishOrder[2][e] = parseInt(c[e])
				}
			}
			if (f == 8) {
				var c = d.split(" ");
				for (var e = 0; e < c.length && e < 18; e++) {
					this.finishOrder[3][e] = parseInt(c[e])
				}
			}
			if (f == 9) {
				this.minMoves = parseInt(d)
			}
			f++
		}
	}
}
function LineReader(a) {
	this.str = a.split("\n");
	this.last = 0;
	this.readLine = function() {
		if (this.last >= this.str.length) {
			return null
		}
		return this.str[this.last++]
	};
	this.readTrimmedLine = function() {
		var b = this.readLine();
		if (b != null) {
			b.trim()
		}
		return b
	};
	this.readInt = function() {
		var b = this.readLine();
		if (b != null) {
			return parseInt(b)
		}
		return b
	}
}
function JellyEye() {
	this.extend(Node);
	this.init = function() {
		this.isMouseEnabled = true;
		this.retina = new Sprite("gameBackground-eyeRetina.png");
		this.pupil = new Sprite("gameBackground-eyePupil.png");
		this.shine = new Sprite("gameBackground-eyeShine.png");
		this.eyeCap = new Sprite("gameBackground-eyeCap.png");
		this.eyeOpen = new Sprite("gameBackground-eyeOpen.png");
		this.addChild(this.retina);
		this.addChild(this.pupil);
		this.addChild(this.shine);
		this.addChild(this.eyeOpen);
		this.addChild(this.eyeCap);
		var b = new JMoveBy(0.1, ccp(0.5, 0.5));
		var a = new JMoveBy(0.1, ccp(-0.5, -0.5));
		this.shine.runAction(new JRepeatForever(new JSequence([b, a])));
		this.updateLayout()
	};
	this.updateLayout = function() {
		this.eyeCap.position = ccp(0, 95 * iPadMultiplier)
	};
	this.blink = function() {
		var b = new JMoveBy(0.2, ccp(0, -90 * iPadMultiplier));
		var a = new JMoveBy(0.2, ccp(0, +90 * iPadMultiplier));
		this.eyeCap.runAction(new JSequence([b, a]))
	};
	this.mouseMove = function(a) {
		a = this.getAbsolutePosition(a);
		this.pupil.position = ccp((a.x / engine.size.width) * 30 * iPadMultiplier, (a.y / engine.size.height) * 30 * iPadMultiplier)
	};
	this.mouseOut = function(a) {
		a = this.getAbsolutePosition(a);
		this.pupil.runAction(new JMoveTo(0.2, ccp(0, 0)))
	};
	this.init()
}
function GameStars() {
	this.extend(Node);
	this.init = function() {
		this.currentCount = -1;
		this.star1 = new Sprite("finishedStarFull.png");
		this.star1.rotation = -14;
		this.star2 = new Sprite("finishedStarFull.png");
		this.star3 = new Sprite("finishedStarFull.png");
		this.star3.rotation = 14;
		this.addChild(this.star1);
		this.addChild(this.star2);
		this.addChild(this.star3)
	};
	this.updateLayout = function() {
		this.star1.position = ccp(-this.star1.size.width, 0);
		this.star2.position = ccp(0, this.star2.size.height / 2 - 29 * iPadMultiplier);
		this.star3.position = ccp(this.star3.size.width, 0)
	};
	this.setCount = function(a) {
		if (a > 0) {
			this.star1.setFile("finishedStarFull.png")
		} else {
			this.star1.setFile("finishedStarEmpty.png")
		} if (a > 1) {
			this.star2.setFile("finishedStarFull.png")
		} else {
			this.star2.setFile("finishedStarEmpty.png")
		} if (a > 2) {
			this.star3.setFile("finishedStarFull.png")
		} else {
			this.star3.setFile("finishedStarEmpty.png")
		}
	};
	this.init()
}
function FinishedStars() {
	this.extend(Node);
	this.init = function() {
		this.currentCount = -1;
		this.star1Full = new Sprite("finishedStarFull.png");
		this.star1Full.rotation = -10;
		this.star2Full = new Sprite("finishedStarFull.png");
		this.star3Full = new Sprite("finishedStarFull.png");
		this.star3Full.rotation = 10;
		this.star1Empty = new Sprite("finishedStarEmpty.png");
		this.star1Empty.rotation = -10;
		this.star2Empty = new Sprite("finishedStarEmpty.png");
		this.star3Empty = new Sprite("finishedStarEmpty.png");
		this.star3Empty.rotation = 10;
		this.addChild(this.star1Empty);
		this.addChild(this.star2Empty);
		this.addChild(this.star3Empty);
		this.addChild(this.star1Full);
		this.addChild(this.star2Full);
		this.addChild(this.star3Full)
	};
	this.updateLayout = function() {
		this.star1Full.position = ccp(-this.star1Full.size.width + 14, 0);
		this.star2Full.position = ccp(0, this.star2Full.size.height / 2 - 18);
		this.star3Full.position = ccp(this.star3Full.size.width - 14, 0);
		this.star1Empty.position = ccp(-this.star1Empty.size.width + 14, 0);
		this.star2Empty.position = ccp(0, this.star2Empty.size.height / 2 - 18);
		this.star3Empty.position = ccp(this.star3Empty.size.width - 14, 0)
	};
	this.setCount = function(e) {
		this.currentCount = e;
		var b = [this.star1Full, this.star2Full, this.star3Full];
		for (var d = 0; d < 3; d++) {
			if (this.currentCount >= d + 1) {
				b[d].visible = true;
				b[d].scale = 10;
				b[d].opacity = 0;
				b[d].stopAllActions();
				var c = new JSpawn([new JScaleTo(0.5, 1), new JFadeIn(0.5)]);
				var a = new JDelayTime(d * 0.5);
				var f = new JSequence([a, c]);
				b[d].runAction(f)
			} else {
				b[d].visible = false
			}
		}
	};
	this.init()
}
function FinishedScreen() {
	this.extend(Node);
	this.isMouseEnabled = true;
	this.init = function() {
		this.active = false;
		this.visible = false;
		this.menu = new JMenu();
		this.box = new Sprite("finishedMenuBackground.png");
		this.box.isMouseEnabled = true;
		this.gray = new Sprite("finishedMenuBackgroundSunburst.png");
		this.gray.scale = 2;
		this.gray.opacity = 0;
		this.stars = new FinishedStars();
		this.nextButton = new JMenuItemImage("finishedNextButton.png", "finishedNextButtonSelected.png", this, "internalNextButtonTouched");
		this.restartButton = new JMenuItemImage("finishedRestartButton.png", "finishedRestartButtonSelected.png", this, "internalRestartButtonTouched");
		this.restartButton.scale = 0.8;
		this.menu.addChild(this.restartButton);
		this.menu.addChild(this.nextButton);
		this.box.addChild(this.menu);
		this.box.addChild(this.stars);
		this.addChild(this.gray);
		this.addChild(this.box)
	};
	this.updateLayout = function() {
		this.restartButton.position = ccp(0, -95 * iPadMultiplier);
		this.nextButton.position = ccp(0, -100 * iPadMultiplier + 63 * iPadMultiplier);
		this.stars.position = ccp(0, 18 * iPadMultiplier);
		if (this.active) {
			this.box.position = ccp(0, 0)
		} else {
			this.box.position = ccp(0, engine.size.height / 2 + 150 * iPadMultiplier)
		}
	};
	this.internalNextButtonTouched = function() {
		this.nextButtonTouched()
	};
	this.internalRestartButtonTouched = function() {
		var b = new JRotateBy(0.4, 360);
		var a = new JCallFunc(this, "restartButtonTouched");
		this.restartButton.runAction(new JSequence([b, a]))
	};
	this.show = function() {
		if(!this.count){
			this.count = 1;
		} else {
			this.count++;
		}
		
		if (this.count > 1) {
			var a = new JMoveBy(0.4, ccp(0, -(engine.size.height / 2 + 150 * iPadMultiplier) * 2));
		} else {
			var a = new JMoveBy(0.4, ccp(0, -(engine.size.height / 2 + 150 * iPadMultiplier)));
		};
		// var a = new JMoveBy(0.4, ccp(0, -(engine.size.height / 2 + 150 * iPadMultiplier)));
		this.box.runAction(a);
		this.gray.runAction(new JFadeIn(0.4));
		this.visible = true;
	};
	this.hide = function() {
		this.box.runAction(new JMoveBy(0.4, ccp(0, engine.size.height / 2 + 150 * iPadMultiplier)));
		var a = new JCallFunc(this, "hidden");
		this.gray.runAction(new JSequence([new JFadeOut(0.4), a]))
	};
	this.hidden = function() {
		this.visible = false
	};
	this.init()
}
function GameCompletedScreen() {
	this.extend(Node);
	this.isMouseEnabled = true;
	this.init = function() {
		this.active = false;
		this.visible = false;
		this.menu = new JMenu();
		this.box = new Sprite("finishedMenuBackground1.png");
		this.box.isMouseEnabled = true;
		this.gray = new Sprite("finishedMenuBackgroundSunburst.png");
		this.gray.scale = 2;
		this.gray.opacity = 0;
		this.stars = new FinishedStars();
		this.restartButton = new JMenuItemImage("finishedRestartButton.png", "finishedRestartButtonSelected.png", this, "internalRestartButtonTouched");
		this.restartButton.scale = 1;
		this.menu.addChild(this.restartButton);
		this.labelHolder = new Node();
		var a = new JLabel("Thanks for playing!", "", 13, 2);
		var d = new JLabel("The full version", "", 13, 2);
		var c = new JLabel("is available", "", 13, 2);
		var b = new JLabel("on the App Store!", "", 13, 2);
		a.position = ccp(-1 * iPadMultiplier, 30 * iPadMultiplier);
		d.position = ccp(0, 1 * iPadMultiplier);
		c.position = ccp(0, -19 * iPadMultiplier);
		b.position = ccp(0, -39 * iPadMultiplier);
		this.labelHolder.addChild(a);
		this.labelHolder.addChild(d);
		this.labelHolder.addChild(c);
		this.labelHolder.addChild(b);
		this.box.addChild(this.labelHolder);
		this.box.addChild(this.menu);
		this.box.addChild(this.stars);
		this.addChild(this.gray);
		this.addChild(this.box)
	};
	this.updateLayout = function() {
		this.restartButton.position = ccp(90 * iPadMultiplier, 0 * iPadMultiplier);
		this.stars.position = ccp(-41 * iPadMultiplier, 75 * iPadMultiplier);
		this.labelHolder.position = ccp(-37 * iPadMultiplier, 3 * iPadMultiplier);
		if (this.active) {
			this.box.position = ccp(0, 0)
		} else {
			this.box.position = ccp(0, engine.size.height / 2 + 150 * iPadMultiplier)
		}
	};
	this.internalRestartButtonTouched = function() {
		var b = new JRotateBy(0.4, 360);
		var a = new JCallFunc(this, "restartButtonTouched");
		this.restartButton.runAction(new JSequence([b, a]))
	};
	this.show = function() {
		var a = new JMoveBy(0.4, ccp(0, -(engine.size.height / 2 + 150 * iPadMultiplier)));
		this.box.runAction(a);
		this.gray.runAction(new JFadeIn(0.4));
		this.visible = true
	};
	this.hide = function() {
		this.box.runAction(new JMoveBy(0.4, ccp(0, engine.size.height / 2 + 150 * iPadMultiplier)));
		var a = new JCallFunc(this, "hidden");
		this.gray.runAction(new JSequence([new JFadeOut(0.4), a]))
	};
	this.hidden = function() {
		this.visible = false
	};
	this.init()
}
function HelpScreen() {
	this.extend(Node);
	this.isMouseEnabled = true;
	this.screenCount = 8;
	this.currentSpriteNo = 1;
	this.init = function() {
		this.sprite = new Sprite("help01.png");
		this.ttContinue = new JLabel("(click to continue)", "", 15, 3);
		this.ttContinue.position = ccp(2, -52);
		this.addChild(this.sprite);
		this.addChild(this.ttContinue)
	};
	this.mouseUp = function() {
		this.currentSpriteNo++;
		if (this.currentSpriteNo > 8) {
			this.isMouseEnabled = false;
			this.sprite.runAction(new JSequence([new JFadeOut(0.5), new JCallFunc(this, "internalHidden")]));
			this.ttContinue.runAction(new JFadeOut(0.5));
			return
		}
		if (this.currentSpriteNo == 2) {
			var f = new JCallFuncO(this.parent.circle, "showPath", "horizontal");
			var d = new JCallFuncO(this.parent.circle, "showPath", "60");
			var a = new JCallFuncO(this.parent.circle, "showPath", "120");
			var j = new JCallFunc(this.parent.circle, "hidePath");
			var g = new JDelayTime(1.5);
			var e = new JDelayTime(0.7);
			var c = new JDelayTime(0.7);
			var b = new JDelayTime(0.7);
			var i = new JSequence([g, f, e, d, c, a, b, j]);
			i.tag = 1;
			this.runAction(i)
		} else {
			if (this.currentSpriteNo == 3) {
				this.parent.circle.hidePath();
				this.stopActionByTag(1);
				var f = new JCallFuncO(this.parent.circle, "showPath", "first");
				var d = new JCallFuncO(this.parent.circle, "showPath", "second");
				var a = new JCallFuncO(this.parent.circle, "showPath", "third");
				var j = new JCallFunc(this.parent.circle, "hidePath");
				var g = new JDelayTime(0.8);
				var e = new JDelayTime(0.7);
				var c = new JDelayTime(0.7);
				var b = new JDelayTime(0.7);
				var h = new JSequence([g, f, e, d, c, a, b, j]);
				h.tag = 2;
				this.runAction(h)
			} else {
				if (this.currentSpriteNo == 4) {
					this.parent.circle.hidePath();
					this.stopActionByTag(2)
				}
			}
		}
		this.sprite.setFile("help0" + this.currentSpriteNo + ".png")
	};
	this.internalHidden = function() {
		this.visible = false;
		this.hidden()
	};
	this.init()
}
function GameTypePuzzle() {
	this.extend(Node);
	this.isMouseEnabled = true;
	this.levelGroups = [];
	this.levels = [];
	this.moveCount = 0;
	this.currentLevel = null;
	this.currentLevelNo = 0;
	var a = this;
	this.position = ccp(engine.size.width / 2, engine.size.height / 2);
	this.init = function() {
		this.loadLevels();
		this.circle = new TouchableCircle();
		this.circle.circleDelegate = this;
		this.puzzleBackground = new Sprite("puzzleBackground-0.png");
		this.leftEye = new JellyEye();
		this.rightEye = new JellyEye();
		this.rightEye.eyeCap.scaleDual.x = -1;
		this.rightEye.eyeOpen.scaleDual.x = -1;
		this.leftEyeCircle = new Sprite("gameBackground-eyeCircle.png");
		this.rightEyeCircle = new Sprite("gameBackground-eyeCircle.png");
		this.backgroundSprite = new Sprite("gameBackground-puzzleBackground.png");
		this.blackCircle = new Sprite("gameBackground-blackCircle.png");
		this.labelHolder = new Node();
		this.labelHolderBackground = new Sprite("gameBackground-movesBackground.png");
		this.titleLabel = new JLabel("None", "defaultFont", 14 * iPadMultiplier, 2);
		this.moveCountNoLabel = new JLabel("0", "defaultFont", 16 * iPadMultiplier, 2);
		this.minMovesNoLabel = new JLabel("0", "defaultFont", 16 * iPadMultiplier, 2);
		this.currentStars = new GameStars();
		this.currentStars.scale = 0.5;
		this.labelHolder.addChild(this.labelHolderBackground);
		this.labelHolder.addChild(this.titleLabel);
		this.labelHolder.addChild(this.moveCountNoLabel);
		this.labelHolder.addChild(this.minMovesNoLabel);
		this.undoButton = new JMenuItemImage("menuButtonUndo.png", "menuButtonUndoClicked.png", this, "undoButtonTouched");
		this.levelSelectorButton = new JMenuItemImage("menuButtonLevelsClicked.png", "menuButtonLevelsClicked.png", this, "levelSelectorButtonTouched");
		this.reloadButton = new JMenuItemImage("menuButtonReload.png", "menuButtonReloadClicked.png", this, "reloadButtonTouched");
		this.homeButton = new JMenuItemImage("menuButtonHomeClicked.png", "menuButtonHomeClicked.png", this, "homeButtonTouched");
		this.homeButton.position = ccp(-130 * iPadMultiplier, -2 * iPadMultiplier);
		this.levelSelectorButton.position = ccp(-74 * iPadMultiplier, 1 * iPadMultiplier);
		this.reloadButton.position = ccp(-18 * iPadMultiplier, 4 * iPadMultiplier);
		this.undoButton.position = ccp(38 * iPadMultiplier, 3 * iPadMultiplier);
		this.gameMenu = new JMenu([this.undoButton, this.levelSelectorButton, this.reloadButton, this.homeButton]);
		this.firstHolderBackground = new Sprite("menuBackgroundGame.png");
		this.gameMenu.addChildZ(this.firstHolderBackground, -1);
		this.miniCircle = new CircleMini(this.circle.firstCircleRadius / 6 * 1.8, "");
		this.miniCircle.scale = 1 / 1.2;
		this.miniCircleBackground = new Sprite("gameBackground-NetBackground-0.png");
		this.miniCircleBackground.addChildZ(this.miniCircle, 1);
		this.gameMenu.addChild(this.miniCircleBackground);
		this.finishedScreen = new FinishedScreen();
		this.finishedScreen.nextButtonTouched = function() {
			a.finishedScreenNextButtonTouched()
		};
		this.finishedScreen.restartButtonTouched = function() {
			a.finishedScreenRestartButtonTouched()
		};
		this.gameCompletedScreen = new GameCompletedScreen();
		this.gameCompletedScreen.restartButtonTouched = function() {
			a.gameCompletedScreenRestartButtonTouched()
		};
		this.addChild(this.leftEye);
		this.addChild(this.rightEye);
		this.addChild(this.puzzleBackground);
		this.addChild(this.circle);
		this.addChild(this.backgroundSprite);
		this.addChild(this.blackCircle);
		this.addChild(this.leftEyeCircle);
		this.addChild(this.rightEyeCircle);
		this.addChild(this.currentStars);
		this.addChild(this.labelHolder);
		this.addChild(this.gameMenu);
		this.addChild(this.finishedScreen);
		this.addChild(this.gameCompletedScreen);
		var b = Util.getCookie("helpShown");
		if (b != null && b != "") {} else {
			this.circle.isMouseEnabled = false;
			this.gameMenu.isMouseEnabled = false;
			this.helpScreen = new HelpScreen();
			this.helpScreen.hidden = function() {
				a.helpLayerHidden()
			};
			this.addChild(this.helpScreen)
		}
		this.activateLevel(this.currentLevelNo)
	};
	this.updateLayout = function() {
		var b = engine.size;
		this.circle.position = ccp(0, -15 * iPadMultiplier);
		this.puzzleBackground.position = ccp(0, -15 * iPadMultiplier);
		this.blackCircle.position = ccp(0, -15 * iPadMultiplier);
		this.leftEye.position = ccp(-108 * iPadMultiplier, b.height / 2 + this.backgroundSprite.size.height / 2 - 52 * iPadMultiplier - 20 * iPadMultiplier);
		this.leftEye.position = ccp(-108 * iPadMultiplier, this.backgroundSprite.size.height / 2 - 52 * iPadMultiplier - 20 * iPadMultiplier);
		this.rightEye.position = ccp(+108 * iPadMultiplier, this.backgroundSprite.size.height / 2 - 52 * iPadMultiplier - 20 * iPadMultiplier);
		this.leftEyeCircle.position = ccp(-108 * iPadMultiplier, this.backgroundSprite.size.height / 2 - 52 * iPadMultiplier - 20 * iPadMultiplier);
		this.rightEyeCircle.position = ccp(+108 * iPadMultiplier, this.backgroundSprite.size.height / 2 - 52 * iPadMultiplier - 20 * iPadMultiplier);
		this.labelHolder.position = ccp(0, b.height / 2 - this.labelHolderBackground.size.height / 2);
		this.titleLabel.position = ccp(0, 25 * iPadMultiplier);
		this.currentStars.position = ccp(0, 151 * iPadMultiplier);
		this.minMovesNoLabel.position = ccp(30 * iPadMultiplier, -18 * iPadMultiplier);
		this.moveCountNoLabel.position = ccp(-21 * iPadMultiplier, -18 * iPadMultiplier);
		this.gameMenu.position = ccp(0, -b.height / 2 + this.firstHolderBackground.size.height / 2);
		this.miniCircleBackground.position = ccp(113 * iPadMultiplier, 26 * iPadMultiplier);
		this.finishedScreen.position = ccp(0, 0)
	};
	this.loadLevels = function() {
		var b = new LineReader(Util.xmlGetUrl("levels.xml"));
		b.readLine();
		var h = b.readInt();
		var j = b.readInt();
		for (var f = 0; f < j; f++) {
			line = b.readLine();
			var c = {};
			c.title = line.substring(0, line.indexOf(":"));
			c.toId = parseInt(line.substring(line.indexOf(":") + 1));
			c.levels = [];
			this.levelGroups.push(c)
		}
		var c = this.levelGroups[0];
		var e = 1;
		var g = 0;
		for (var f = 0; f < h; f++) {
			if (f >= c.toId) {
				c = this.levelGroups[++g];
				e = 1
			}
			var d = new Level();
			d.loadFromReader(b);
			d.levelId = f + 1;
			d.no = e;
			c.levels.push(d);
			this.levels.push(d);
			e++
		}
	};
	this.levelRotationFinished = function() {
		this.circle.rotation = 0;
		this.reloadButton.enabled = true
	};
	this.activateLevel = function(d) {
		this.circle.moveHistory = [];
		if (this.currentLevel != null) {
			var c = new JRotateBy(1, 360 * 1);
			var b = new JCallFunc(this, "levelRotationFinished");
			this.circle.runAction(new JSequence([c, b]));
			c = new JDelayTime(0.5);
			b = new JCallFuncO(this, "activateLevelInternal", d);
			this.runAction(new JSequence([c, b]))
		} else {
			this.activateLevelInternal(d)
		}
	};
	this.activateLevelInternal = function(b) {
		this.moveCount = 0;
		this.circle.loadLevel(this.levels[b]);
		this.miniCircle.loadLevel(this.levels[b]);
		this.currentLevel = this.levels[b];
		this.currentLevelNo = b;
		this.leftEye.blink();
		this.rightEye.blink();
		this.minMovesNoLabel.setText(this.currentLevel.minMoves);
		this.updateMoveCount();
		this.titleLabel.setText(this.currentLevel.levelId + ". " + this.currentLevel.title);
		this.currentStars.setCount(this.starsFromMoves(this.moveCount + 1, this.currentLevel.minMoves))
	};
	this.updateMoveCount = function() {
		this.moveCountNoLabel.setText(this.moveCount)
	};
	this.levelPassed = function() {
		this.circle.isMouseEnabled = false;
		this.gameMenu.isMouseEnabled = false;
		engine.log("ozzlejs", "passedLevel." + this.currentLevelNo, this.moveCount);
		if (this.currentLevelNo == 11) {
			this.gameCompletedScreen.stars.setCount(this.starsFromMoves(this.moveCount, this.currentLevel.minMoves));
			this.gameCompletedScreen.show()
		} else {
			this.finishedScreen.stars.setCount(this.starsFromMoves(this.moveCount, this.currentLevel.minMoves));
			this.finishedScreen.show()
		}
	};
	this.finishedScreenNextButtonTouched = function() {
		this.circle.isMouseEnabled = true;
		this.gameMenu.isMouseEnabled = true;
		this.activateLevel(this.currentLevelNo + 1);
		this.finishedScreen.hide()
	};
	this.finishedScreenRestartButtonTouched = function() {
		this.circle.isMouseEnabled = true;
		this.gameMenu.isMouseEnabled = true;
		this.activateLevel(this.currentLevelNo);
		this.finishedScreen.hide()
	};
	this.gameCompletedScreenRestartButtonTouched = function() {
		this.circle.isMouseEnabled = true;
		this.gameMenu.isMouseEnabled = true;
		this.activateLevel(0);
		this.gameCompletedScreen.hide()
	};
	this.helpLayerHidden = function() {
		this.circle.isMouseEnabled = true;
		this.gameMenu.isMouseEnabled = true;
		Util.setCookie("helpShown", "1", 365)
	};
	this.starsFromMoves = function(d, c) {
		var b = 0;
		if (d == 0) {
			return b
		}
		if (d <= c * c + 1) {
			b = 1
		}
		if (d <= c * 2) {
			b = 2
		}
		if (d <= c) {
			b = 3
		}
		return b
	};
	this.addMoves = function(b) {
		this.moveCount += b;
		if (this.moveCount > 99) {
			this.moveCount = 99
		}
		this.updateMoveCount();
		if (this.circle.isEqualToColors(this.currentLevel.finishOrder) == true) {
			this.levelPassed();
			return
		}
		this.currentStars.setCount(this.starsFromMoves(this.moveCount + 1, this.currentLevel.minMoves))
	};
	this.homeButtonTouched = function() {};
	this.levelSelectorButtonTouched = function() {};
	this.reloadButtonTouched = function() {
		this.reloadButton.enabled = false;
		this.activateLevel(this.currentLevelNo)
	};
	this.enableUndo = function() {
		this.undoButton.enabled = true
	};
	this.undoButtonTouched = function() {
		this.undoButton.enabled = false;
		this.circle.historyUndo();
		var c = new JDelayTime(0.4);
		var b = new JCallFunc(this, "enableUndo");
		this.runAction(new JSequence([c, b]))
	};
	this.update = function(b) {};
	this.init()
}
function PreloaderScene() {
	this.extend(Node);
	var a = this;
	this.isMouseEnabled = false;
	this.init = function() {
		this.position = ccp(engine.size.width / 2, engine.size.height / 2);
		this.noColor = new Sprite("LoadingScreenNoColour.png");
		this.withColor = new SpriteCutOutHeight("LoadingScreenColour.png");
		this.upper = new Sprite("LoadingScreenMouthEyesLogo.png");
		this.text = new Sprite("clicktoplay.png");
		this.text.visible = false;
		this.text.position = ccp(0, -17);
		this.text.opacity = 0.8;
		this.addChild(this.noColor);
		this.addChild(this.withColor);
		this.addChild(this.upper);
		this.addChild(this.text)
	};
	this.fadedOut = function() {
		this.visible = false;
		engine.removePreloaderScene()
	};
	this.setPercentage = function(b) {
		if (b == 1) {
			engine.fps = 10;
			a.isMouseEnabled = true;
			a.text.visible = true
		}
		a.withColor.cutHeight = a.withColor.size.height - a.withColor.size.height * b
	};
	this.mouseDown = function(c) {
		c = this.getAbsolutePosition(c);
		var b = false;
		if (this.text.position.x - this.text.size.width / 2 <= c.x && this.text.position.x + this.text.size.width / 2 >= c.x) {
			if (this.text.position.y - this.text.size.height / 2 <= c.y && this.text.position.y + this.text.size.height / 2 >= c.y) {
				b = true
			}
		}
		if (b) {
			this.text.opacity = 0.6
		}
	};
	this.mouseUp = function(d) {
		d = this.getAbsolutePosition(d);
		if (this.text.position.x - this.text.size.width / 2 <= d.x && this.text.position.x + this.text.size.width / 2 >= d.x) {
			if (this.text.position.y - this.text.size.height / 2 <= d.y && this.text.position.y + this.text.size.height / 2 >= d.y) {
				this.analyticsTrack();
				engine.log("ozzlejs", "playClicked", "");
				engine.fps = 100;
				engine.scene.visible = true;
				this.text.opacity = 1;
				this.isMouseEnabled = false;
				a.noColor.visible = false;
				var c = new JFadeOut(1);
				var b = new JCallFunc(a, "fadedOut");
				a.withColor.runAction(new JSequence([c, b]));
				a.upper.runAction(new JFadeOut(1));
				a.text.runAction(new JFadeOut(1));
				setTimeout(function() {
					engine.updateLayout()
				}, 100)
			}
		}
	};
	this.mouseMove = function(c) {
		c = this.getAbsolutePosition(c);
		var b = false;
		if (this.text.position.x - this.text.size.width / 2 <= c.x && this.text.position.x + this.text.size.width / 2 >= c.x) {
			if (this.text.position.y - this.text.size.height / 2 <= c.y && this.text.position.y + this.text.size.height / 2 >= c.y) {
				b = true
			}
		}
		if (b) {
			this.text.opacity = 1
		} else {
			this.text.opacity = 0.8
		}
	};
	this.analyticsTrack = function() {
		var b = b || [];
		b.push(["_setAccount", "UA-28249461-1"]);
		b.push(["_trackPageview"]);
		(function() {
			var d = document.createElement("script");
			d.type = "text/javascript";
			d.async = true;
			d.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
			var c = document.getElementsByTagName("script")[0];
			c.parentNode.insertBefore(d, c)
		})()
	};
	this.init()
}
function Ozzle(c) {
	engine.log("ozzlejs", "init", "");
	engine.setCanvas(c);
	var b = new PreloaderScene();
	engine.loader.setPercentage = b.setPercentage;
	engine.setPreloaderScene(b);
	var a = ["pathsSelected-first.png", "pathsSelected-second.png", "pathsSelected-third.png", "pathsSelected-horizontal.png"];
	for (var d = 0; d < 9; d++) {
		a.push("balls/ball-" + d + ".png");
		a.push("balls/ball-" + d + "-white.png");
		a.push("balls/ball-" + d + "-mini.png")
	}
	for (var d = 1; d < 9; d++) {
		a.push("help0" + d + ".png")
	}
	engine.loader.preloadImages(a);
	var e = new GameTypePuzzle();
	e.visible = false;
	engine.setScene(e)
};