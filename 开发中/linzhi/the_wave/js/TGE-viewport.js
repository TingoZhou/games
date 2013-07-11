if (!Function.prototype.bind) {
	Function.prototype.bind = function(a) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
		}
		var f = Array.prototype.slice.call(arguments, 1),
			e = this,
			b = function() {}, d = function() {
				return e.apply(this instanceof b && a ? this : a, f.concat(Array.prototype.slice.call(arguments)))
			};
		b.prototype = this.prototype;
		d.prototype = new b();
		return d
	}
}

function getElementPosition(b) {
	var d = b;
	var e = "";
	var a = 0;
	var f = 0;
	if (d == null) {
		return null
	}
	while ((typeof(d) == "object") && (typeof(d.tagName) != "undefined")) {
		f += d.offsetTop;
		a += d.offsetLeft;
		e = d.tagName.toUpperCase();
		if (e == "BODY") {
			d = 0
		}
		if (typeof(d) == "object") {
			if (typeof(d.offsetParent) == "object") {
				d = d.offsetParent
			}
		}
		if (d == null) {
			return null
		}
	}
	return {
		x: a,
		y: f
	}
}

var TGE = {};

TGE.log = function() {
	if (window.console) {
		window.console.log(Array.prototype.slice.call(arguments))
	}
};

TGE.debugLog = function() {};

TGE.Game = function(argument) {
	if (TGE.Game._sInstance !== null) {
		TGE.log("***** ERROR: you can only create one instance of a TGE.Game object");
		return this
	}
	TGE.Game._sInstance = this;
	this.analytics = null;
	this.mCanvasDiv = null;
	this.mReorientationDiv = null;
	this.mCanvasPosition = null;
	// this.mGameManager = new TGE.ObjectsManager();
	this.mLayers = {};
	this.mCameraLocation = null;
	this.mLoadingStartTime = new Date().getTime();
	this.mLoadingScreen = null;
	this.stage = null;
	// this.assetManager = new TGE.AssetManager();
	// this.audioManager = new TGE.AudioManager(this.assetManager);
	this.mPlaying = false;
	this.mPaused = false;
	this.mCurrentLevel = null;
	this.mPauseButton = null;
	this.mUserPauseEnabled = false;
	this.mGameTime = 0;
	this.mFilterStrength = 10;
	this.mFrameTime = 0;
	this.mLastLoop = new Date;
	this.mLastDisplay = new Date;
	this.mThisLoop;
	this.mFPSText = null;
	this.mMaxTickTime = 0.1;
	this.mMinTickTime = Number.MIN_VALUE;
	// this.mUIManager = new TGE.ObjectsManager();
	// this.mScreenManager = new TGE.ScreenManager(this);
	this.mMouseX = 0;
	this.mMouseY = 0;
	this.mMouseDown = false;
	this.mKeysDown = {};
	this.mDefaultLinkTarget = "_blank";
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this._mNativeScaling = null;
	this._mViewportScale = 1;
	this._oniOS = (TGE.BrowserDetect.platform === "iPhone" || TGE.BrowserDetect.platform === "iPad");
	this._onAndroid = (TGE.BrowserDetect.platform === "Android")
};

TGE.Game._sInstance = null;

TGE.Game.prototype = {
	_mViewportScale: 0,
	_mResizeTimeout: null,
	_oniOS: false,
	_onAndroid: false,
	onMobile: function() {
		return TGE.BrowserDetect.isMobileDevice
	},
	oniOS: function() {
		return this._oniOS
	},
	onAndroid: function() {
		return this._onAndroid
	},
	onPhoneGap: function() {
		return TGE.BrowserDetect.usingPhoneGap
	},
	InitializeRenderer: function(b, a) {
		this.stage = new TGE.Stage(this.mCanvasDiv, b, a)
	},
	Launch: function(m, e) {
		var l;
		var f;
		var b = -1;
		var n = -1;
		var d = -1;
		var g = -1;
		var k = false;
		if (this.analytics === null && this.mAnalytics != null) {
			this.analytics = this.mAnalytics
		}
		if (typeof m === "string") {
			l = m;
			f = e
		} else {
			l = typeof m.gameDiv === "undefined" ? null : m.gameDiv;
			f = typeof m.reorientDiv === "undefined" ? null : m.reorientDiv;
			b = typeof m.width === "undefined" ? -1 : m.width;
			n = typeof m.height === "undefined" ? -1 : m.height;
			d = typeof m.initialWidth === "undefined" ? -1 : parseInt(m.initialWidth);
			g = typeof m.initialHeight === "undefined" ? -1 : parseInt(m.initialHeight);
			k = typeof m.resizeForNative === "undefined" ? false : m.resizeForNative
		}
		this.mCanvasDiv = document.getElementById(l);
		if (this.mCanvasDiv == null) {
			TGE.log("***** ERROR: Could not find canvas div '" + l + "'");
			return false
		}
		var a = this.mCanvasDiv.getAttribute("style") || "";
		this.mCanvasDiv.setAttribute("style", a + " z-index: 1; overflow: hidden; -webkit-user-select: none; -ms-touch-action:none; -webkit-tap-highlight-color: transparent; -moz-tap-highlight-color: transparent; -webkit-transform: translateZ(0);");
		if (k) {
			var j = document.getElementById("viewporter");
			if (j !== null) {
				j.align = "left"
			}
			var h = 1;
			if (TGE.BrowserDetect.platform === "iPad") {
				h = 768 / 1024;
				b = this.mCanvasDiv.clientWidth;
				n = Math.round(h * b)
			} else {
				if (TGE.BrowserDetect.platform === "iPhone") {
					h = 320 / 480;
					b = this.mCanvasDiv.clientWidth;
					n = Math.round(h * b);
					if (j !== null && (window.innerWidth > 480 || window.innerHeight > 480)) {
						j.align = "center"
					}
				}
			} if (h !== 1) {
				this._mNativeScaling = {
					x: (b / this.mCanvasDiv.clientWidth),
					y: (n / this.mCanvasDiv.clientHeight)
				}
			}
		}
		if (b > 0 && n > 0) {
			this.mCanvasDiv.style.width = b + "px";
			this.mCanvasDiv.style.height = n + "px"
		}
		this.canvasWidth = this.mCanvasDiv.clientWidth;
		this.canvasHeight = this.mCanvasDiv.clientHeight;
		TGE.debugLog("game launch calling _resizeViewport");
		
		this.mReorientationDiv = document.getElementById(f);
		this._resizeViewport();
		this._determineCanvasPosition();
		window.addEventListener("resize", this._onResize.bind(this), false);
		if (this.onMobile()) {
			window.addEventListener("blur", this._onDeactivate.bind(this), false);
			window.addEventListener("pagehide", this._onDeactivate.bind(this), false);
			if (this.onPhoneGap()) {
				document.addEventListener("pause", this._onDeactivate.bind(this), false)
			}
		}
		if ("ontouchstart" in document.documentElement && TGE.BrowserDetect.isMobileDevice) {
			this.mCanvasDiv.addEventListener("touchstart", this._mouseDown.bind(this), false);
			this.mCanvasDiv.addEventListener("touchmove", this._mouseMove.bind(this), false);
			this.mCanvasDiv.addEventListener("touchend", this._mouseUp.bind(this), false)
		} else {
			this.mCanvasDiv.addEventListener("click", this._preventBehavior.bind(this), false);
			this.mCanvasDiv.addEventListener("mousedown", this._mouseDown.bind(this), false);
			this.mCanvasDiv.addEventListener("mouseup", this._mouseUp.bind(this), false);
			this.mCanvasDiv.addEventListener("mousemove", this._mouseMove.bind(this), false)
		}

		window.addEventListener("orientationchange", this._onOrientationChanged);
		window.addEventListener('touchstart', function(e){e.preventDefault();}, false);
		if ((typeof viewporter !== "undefined") && (typeof viewporter.preventPageScroll === "function")) {
			viewporter.preventPageScroll = true
		}

		return true
	},
	_onDeactivate: function() {
		if (this.mPlaying) {
			this.PauseGame(true);
			this.audioManager.Mute()
		}
	},
	_preventBehavior: function(a) {
		a.stopPropagation();
		a.preventDefault()
	},
	_processMousePosition: function(a) {
		if (this.mCanvasPosition === null) {
			this._determineCanvasPosition()
		}
		this.mMouseX = a.pageX;
		this.mMouseY = a.pageY;
		if (a.touches) {
			this.mMouseX = a.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			this.mMouseY = a.touches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop
		}
		this.mMouseX -= this.mCanvasPosition.x;
		this.mMouseY -= this.mCanvasPosition.y;
		this.mMouseX /= this._mViewportScale;
		this.mMouseY /= this._mViewportScale
	},
	_mouseDown: function(b) {
		window.focus();
		this._processMousePosition(b);
		this.mMouseDown = true;
		if (this.mUserPauseEnabled && this.mPauseButton != null && this.mGameTime > 0.5) {
			var a = Math.max(this.mPauseButton.Width(), this.mPauseButton.Height());
			if (this.mMouseX > this.Width() - a && this.mMouseY < a) {
				this.PauseGame(true);
				return
			}
		}
		// this.stage._notifyObjectsOfMouseEvent("down", this.mMouseX, this.mMouseY);
		if (!this.mPaused) {
			this.subclassMouseDown()
		}
		b.stopPropagation();
		b.preventDefault()
	},

	_mouseUp: function(a) {
		this.mMouseDown = false;
		// this.stage._notifyObjectsOfMouseEvent("up", this.mMouseX, this.mMouseY);
		if (!this.mPaused) {
			this.subclassMouseUp()
		}
		a.stopPropagation();
		a.preventDefault()
	},
	_mouseMove: function(a) {
		this._processMousePosition(a);
		if (!this.mPaused) {
			this.subclassMouseMove()
		}
		a.stopPropagation();
		a.preventDefault()
	},
	subclassMouseMove: function() {},
	subclassMouseDown: function() {},
	subclassMouseUp: function() {},

	_centerCanvasDiv: function(b, d, f, a) {
		this.mCanvasDiv.style.position = "absolute";
		if (b) {
			this.mCanvasDiv.style.align = "left";
			this.mCanvasDiv.style.left = ((this._getBrowserWidth() / 2) - (f / 2)) + "px";
			var e = document.getElementById("viewporter");
			if (e) {
				e.style.align = "left"
			}
		}
		if (d) {
			this.mCanvasDiv.style.top = ((this._getBrowserHeight() / 2) - (a / 2)) + "px"
		}
	},

	_getBrowserWidth: function() {
		if (window.innerWidth) {
			return window.innerWidth
		}
		if (document.documentElement && document.documentElement.clientWidth != 0) {
			return document.documentElement.clientWidth
		}
		if (document.body) {
			return document.body.clientWidth
		}
		return 0
	},
	_getBrowserHeight: function() {
		if (window.innerHeight) {
			return window.innerHeight
		}
		if (document.documentElement && document.documentElement.clientHeight != 0) {
			return document.documentElement.clientHeight
		}
		if (document.body) {
			return document.body.clientHeight
		}
		return 0
	},
	_resizeViewport: function() {
		TGE.debugLog("_resizeViewport");
		if (typeof window.canvasScale !== "undefined") {
			TGE.debugLog("_resizeViewport for JSEmbed using stage scaling");
			this.scaleStage(window.canvasScale);
			return
		}
		var f = this.mCanvasDiv;
		var b = f.getAttribute("style") || "";
		var g = this.canvasWidth;
		var n = this.canvasHeight;
		var a = window.innerWidth;
		var d = window.innerHeight;
		TGE.debugLog("_resizeViewport::game size: " + g + "x" + n + ", \nscreen size: " + a + "x" + d);
		var m = g <= n;
		var o = a <= d;
		var p = o === m;
		var j = {
			x: 1,
			y: 1
		};
		j.x = a / g;
		j.y = d / n;
		j.x = Math.round(j.x * 100) / 100;
		j.y = Math.round(j.y * 100) / 100;
		var l = 1;
		var h;
		if (j.x < j.y) {
			l = j.x;
			h = true
		} else {
			l = j.y;
			h = false
		} if (Math.abs(1 - l) <= 0.01) {
			l = 1
		}
		var k = g * l;
		var e = n * l;
		if (TGE.BrowserDetect.usingPhoneGap) {
			TGE.debugLog("_resizeViewport for native using stage scaling");
			this._scaleCanvasDiv(l);
			this._centerCanvasDiv(true, true, k, e);
			return
		}
		if (TGE.BrowserDetect.isMobileDevice) {
			if ((TGE.BrowserDetect.platform === "Android" && parseInt(TGE.BrowserDetect.OSversion.charAt(0)) < 4) || (TGE.BrowserDetect.oniOS && TGE.BrowserDetect.OSversion.charAt(0) < 6) || (TGE.BrowserDetect.platform === "Kindle Fire")) {
				TGE.debugLog("_resizeViewport for mobile web using stage scaling");
				this._scaleCanvasDiv(l)
			} else {
				TGE.debugLog("_resizeViewport for mobile web using css transform scaling");
				this._mViewportScale = l;
				j = l + ", " + l;
				f.setAttribute("style", b + " -ms-transform-origin: left top; -webkit-transform-origin: left top; -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top; -ms-transform: scale(" + j + "); -webkit-transform: scale3d(" + j + ", 1); -moz-transform: scale(" + j + "); -o-transform: scale(" + j + "); transform: scale(" + j + ");")
			}
			this._centerCanvasDiv(true, true, k, e)
		} else {
			if (0) {
				this._scaleCanvasDiv(l);
				this._centerCanvasDiv(true, true, k, e)
			} else {
				this._centerCanvasDiv(true, false, g, n)
			}
		};
		if (this.mReorientationDiv !== null && TGE.BrowserDetect.isMobileDevice && this.oniOS()) {
			if (!p) {
				this.mCanvasDiv.style.display = "none";
				this.mReorientationDiv.style.display = "block";
				// this.PauseGame(true)
			} else {
				this.mReorientationDiv.style.display = "none";
				this.mCanvasDiv.style.display = "block"
			}
		}
		this._determineCanvasPosition();
		if ((typeof viewporter !== "undefined") && (typeof viewporter.refresh === "function")) {
			// viewporter.refresh()
		}
	},
	_determineCanvasPosition: function() {
		TGE.debugLog("_determineCanvasPosition");
		this.mCanvasPosition = getElementPosition(this.mCanvasDiv)
	},

	_onResize: function() {
		TGE.debugLog("_onResize::_mResizeTimeout: " + this._mResizeTimeout);
		if (this._mResizeTimeout !== null) {
			clearTimeout(this._mResizeTimeout);
			this._mResizeTimeout = null
		}
		if (this.onAndroid()) {
			this._mResizeTimeout = setTimeout(this._resizeViewport.bind(this), 500)
		} else {
			this._resizeViewport()
		}
	},
}

TGE.ObjectsManager = function() {
	this.mObjectsArray = []
};

TGE.BrowserDetect = {
	init: function() {
		this.browser = this.searchString(this.dataBrowser) || "an unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.platform = this.searchString(this.dataPlatform) || "an unknown OS or Device";
		this.OSversion = this.detectOSversion(this.platform);
		this.isMobileDevice = !(this.platform === "Windows" || this.platform === "Mac" || this.platform === "Linux");
		this.oniOS = this.platform === "iPhone" || this.platform === "iPad";
		this.onAndroid = this.platform === "Android";
		this.usingPhoneGap = (window.PhoneGap || window.cordova || window.Cordova)
	},
	detectOSversion: function(b) {
		var f = "-1";
		var e = "";
		var a = navigator.userAgent.toString();
		switch (b) {
			case "Windows Phone":
				e = /Windows Phone OS\s+[\d\.]+/;
				f = String(a.match(e)).substring(17, 20);
				break;
			case "iPhone":
			case "iPad":
				e = /OS\s+[\d\_]+/;
				f = String(a.match(e)).substring(3, 6);
				break;
			case "Windows":
				e = /Windows NT\s+[\d\.]+/;
				var d = String(a.match(e)).substring(11, 14);
				if (d == "6.1") {
					f = "7"
				} else {
					if (d == "5.1") {
						f = "XP"
					} else {
						if (d == "5.2") {
							f = "XP"
						} else {
							if (d == "6.0") {
								f = "Vista"
							} else {
								if (d == "5.01") {
									f = "2000 SP1"
								} else {
									if (d == "5.0") {
										f = "2000"
									}
								}
							}
						}
					}
				}
				break;
			case "Mac":
				e = /Mac OS X\s+[\d\_]+/;
				f = String(a.match(e)).substring(9, 13);
				break;
			case "Android":
				e = /ndroid\s+[\d\.]+/;
				f = String(a.match(e)).substring(7, 10);
				break
		}
		return f
	},
	searchString: function(e) {
		for (var a = 0; a < e.length; a++) {
			if (e[a] != null) {
				var b = e[a].string;
				var d = e[a].prop;
				this.versionSearchString = e[a].versionSearch || e[a].identity;
				if (b) {
					if (b.indexOf(e[a].subString) !== -1) {
						return e[a].identity
					}
				} else {
					if (d) {
						return e[a].identity
					}
				}
			}
		}
	},
	searchVersion: function(b) {
		var a = b.indexOf(this.versionSearchString);
		if (a === -1) {
			return
		}
		return parseFloat(b.substring(a + this.versionSearchString.length + 1))
	},
	dataBrowser: [{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		}, {
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		}, {
			string: navigator.userAgent,
			subString: "Explorer",
			identity: "Explorer",
			versionSearch: "Explorer"
		}, {
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		}, {
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		}, {
			prop: window.opera,
			identity: "Opera"
		}, {
			string: navigator.userAgent,
			subString: "Silk",
			identity: "Silk",
			versionSearch: "Silk"
		}, {
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		}, {
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}, {
			string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		}, {
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		}, {
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		}, {
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		}, {
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		}, {
			string: navigator.vendor,
			subString: "BlackBerry",
			identity: "BlackBerry"
		}
	],
	dataPlatform: [{
			string: navigator.userAgent,
			subString: "Windows Phone",
			identity: "Windows Phone"
		}, {
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		}, {
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		}, {
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone"
		}, {
			string: navigator.userAgent,
			subString: "iPad",
			identity: "iPad"
		}, {
			string: navigator.userAgent,
			subString: "iPod",
			identity: "iPod"
		}, {
			string: navigator.userAgent,
			subString: "Android",
			identity: "Android"
		}, {
			string: navigator.userAgent,
			subString: "Silk",
			identity: "Kindle Fire"
		}, {
			string: navigator.userAgent,
			subString: "webOS",
			identity: "webOS"
		}, {
			string: navigator.userAgent,
			subString: "Mobile",
			identity: "Mobile"
		}, {
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
};
TGE.BrowserDetect.init();
if (TGE.BrowserDetect.platform === "iPhone" || TGE.BrowserDetect.platform === "iPad") {
	var _vp = document.querySelector("meta[name=viewport]");
	if (_vp) {
		_vp.setAttribute("content", "maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no")
	}
}