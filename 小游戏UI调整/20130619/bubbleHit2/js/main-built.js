/**
 * KineticJS JavaScript Framework v4.3.3
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Feb 12 2013
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function degsToRads(t) {
    return.0174532925 * t
}
define("snack/platform", [],
function() {
    var t = {};
    return t = {
        maxWidth: window.innerWidth,
        maxHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        resClass: "",
        resScale: 0,
        getResScale: function() {
            return this.resScale ? this.resScale: (this.getResClass(), this.resScale)
        },
        getResClass: function() {
            if ("" !== this.resClass) return this.resClass;
            var t = window.outerWidth,
            e = window.outerHeight;
            navigator.userAgent.match(/like Mac OS X/i) || (t = window.innerWidth, e = window.innerHeight);
            var i = Math.ceil(t * this.devicePixelRatio);
            Math.ceil(e * this.devicePixelRatio);
            var n = 1534;
            return i >= n ? (this.resScale = 1, this.resClass = "r4_5") : i >= .75 * n ? (this.resScale = .75, this.resClass = "r4") : i >= .5 * n ? (this.resScale = .5, this.resClass = "r3") : i >= .4 * n ? (this.resScale = .4, this.resClass = "r2_5") : i >= .3 * n ? (this.resScale = .3, this.resClass = "r2") : (this.resScale = .2, this.resClass = "r1"),
            this.resClass
        },
        getClickAction: function() {
            return Modernizr.touch ? "touchstart": "click"
        },
        isCrapAudio: function() {
            return navigator.userAgent.indexOf("Android") >= 0 ? !0 : navigator.userAgent.indexOf("Silk") >= 0 ? !0 : navigator.userAgent.match(/OS 5(_\d)+ like Mac OS X/i) ? !0 : navigator.userAgent.match(/OS 4(_\d)+ like Mac OS X/i) ? !0 : !1
        },
        isCrapGraphics: function() {
            return navigator.userAgent.indexOf("Android") >= 0 || navigator.userAgent.indexOf("Silk") >= 0 ? !0 : !1
        },
        _isiPhone: navigator.userAgent.match(/iPhone/i),
        _isiPod: navigator.userAgent.match(/iPod/i),
        _isiPad: navigator.userAgent.match(/iPad/i)
    }
}),
define("snack/coordinates", ["snack/platform"],
function(t) {
    var e = {};
    return e.scaleX = function() {
        var e = t.getResScale();
        return e /= t.devicePixelRatio
    },
    e.scaleY = function() {
        return e.scaleX()
    },
    e.w2dx = function(t) {
        return t * e.scaleX()
    },
    e.w2dy = function(t) {
        return t * e.scaleY()
    },
    e
}),
define("snack/debug", [],
function() {
    var t = {};
    return t = function(t) {
        this._initDebug(t)
    },
    t.prototype = {
        _initDebug: function(t) {
            this.enabled = t.enabled
        },
        trace: function(t) {
            this.enabled && console.log(t)
        }
    },
    t
}),
define("snack/spritesheet", [],
function() {
    var t = {};
    return t = function(t) {
        this._initSpriteSheet(t)
    },
    t.prototype = {
        _initSpriteSheet: function() {
            this.data = null,
            this.image = null
        },
        load: function(t, e, i) {
            var n = this;
            n.image = new Image,
            n.image.onload = function() {
                var t = new XMLHttpRequest;
                t.open("GET", e, !0),
                t.onreadystatechange = function() {
                    4 == t.readyState && 200 == t.status && (n.data = JSON.parse(t.responseText), i())
                },
                t.send(null)
            },
            n.image.src = t
        },
        hasImage: function(t) {
            return this.image && this.data && this.data.frames && this.data.frames.hasOwnProperty(t)
        },
        getImage: function(t) {
            if (!this.image || !this.data) return null;
            var e = this.data.frames[t];
            return void 0 !== e ? {
                image: this.image,
                data: e
            }: null
        }
    },
    t
}),
define("snack/assetmanager", ["snack/spritesheet"],
function(t) {
    var e = {};
    return e = function(t) {
        return arguments.callee._singletonInstance ? arguments.callee._singletonInstance: (arguments.callee._singletonInstance = this, this._initAssetManager(t), void 0)
    },
    e.prototype = {
        _initAssetManager: function() {
            this._imageStore = {},
            this._spriteSheets = [],
            this.cb = "?v=1"
        },
        loadAssets: function(t, e, i) {
            for (var n = t.length,
            s = 0; t.length > 0;) {
                var a = t.pop(),
                o = function() {++s === n ? (e(s, n), i()) : e(s, n)
                };
                void 0 !== a.dataURL ? this.loadSpriteSheet(a.imageURL + this.cb, a.dataURL + this.cb, o) : this.loadImage(a.imageURL, o)
            }
        },
        loadSpriteSheet: function(e, i, n) {
            var s = new t;
            this._spriteSheets.push(s),
            s.load(e, i, n)
        },
        loadImage: function(t, e) {
            var i = this,
            n = new Image;
            n.onload = function() {
                return i._imageStore[t] = n,
                e(n)
            },
            n.src = t + this.cb
        },
        getImage: function(t) {
            if (this._imageStore.hasOwnProperty(t)) return {
                image: this._imageStore[t],
                data: null
            };
            for (var e = 0,
            i = this._spriteSheets.length; i > e; ++e) if (this._spriteSheets[e].hasImage(t)) return this._spriteSheets[e].getImage(t);
            return null
        }
    },
    e
}),
define("bh2/balance", [],
function() {
    return {
        nColors: 6,
        nRows: 15,
        nCols: 14,
        nStartRows: 9,
        shooterSpeedFactor: 500,
        pointsPerPop: 525,
        areaBomb: {
            radius: 1
        },
        rowSpawn: {
            spawnAlgorithm: "fewColorsMoreRows",
            fewColorsMoreRows: {
                variable: "colorsRemaining",
                setVar: "numSpawnRows",
                values: [[6, 6, 1], [5, 5, 2], [4, 4, 3], [3, 3, 4], [2, 2, 6], [1, 1, 8]]
            },
            fewColorsFewerMisses: {
                variable: "colorsRemaining",
                setVar: "missesUntilRowSpawn",
                values: [[6, 6, 3], [5, 5, 2], [4, 4, 2], [3, 3, 1], [2, 2, 1], [1, 1, 1]]
            },
            fewBubblesMoreRows: {
                variable: "bubblesRemaining",
                setVar: "numSpawnRows",
                values: [[0, 14, 6], [15, 28, 5], [29, 54, 4], [55, 1e3, 3]]
            }
        },
        powerupFrequency: [[0, 13, {
            xBomb: 0,
            colorBomb: .02,
            areaBomb: .02
        }], [14, 28, {
            xBomb: 0,
            colorBomb: .05,
            areaBomb: .05
        }], [29, 54, {
            xBomb: .05,
            colorBomb: .15,
            areaBomb: .1
        }], [55, 1e3, {
            xBomb: .15,
            colorBomb: .1,
            areaBomb: .03
        }]],
        maxStreakMultiplier: 6
    }
}),
define("bh2/gameconfig", ["snack/platform", "snack/coordinates", "bh2/balance"],
function(t, e, i) {
    var n = {};
    return n = function(t) {
        this._initGameConfig(t)
    },
    n.prototype = {
        assetDir: "assets",
        spriteSheetBaseName: "spritesheet",
        _initGameConfig: function() {
            this.resClass = t.getResClass(),
            this._setDefaults()
        },
        onResize: function() {
            this.resClass = t.getResClass(),
            this._setDefaults()
        },
        _setDefaults: function() {
            this.worldBoardWidth = 1536,
            this.worldBoardHeight = 2008,
            this.worldPieceWidth = 100,
            this.worldPieceHeight = 100,
            this.boardWidth = e.w2dx(this.worldBoardWidth),
            this.boardHeight = e.w2dx(this.worldBoardHeight),
            this.pieceWidth = e.w2dx(this.worldPieceWidth),
            this.pieceHeight = e.w2dx(this.worldPieceHeight),
            this.spriteSheet1URL = this.assetDir + "/" + this.resClass + "/" + this.spriteSheetBaseName + "1.png",
            this.spriteSheet1DataURL = this.assetDir + "/" + this.resClass + "/" + this.spriteSheetBaseName + "1.json",
            this.spriteSheet2URL = this.assetDir + "/" + this.resClass + "/" + this.spriteSheetBaseName + "2.png",
            this.spriteSheet2DataURL = this.assetDir + "/" + this.resClass + "/" + this.spriteSheetBaseName + "2.json";
            var t = Math.floor(3 * Math.random()) + 1,
            n = 1 === t ? "": "_" + t;
            this.boardBorderURL = this.assetDir + "/" + this.resClass + "/stage_border" + n + ".jpg",
            this.threeSliceTopFlatURL = this.assetDir + "/" + this.resClass + "/dialog_3slice_topflat.png",
            this.threeSliceTopRoundURL = this.assetDir + "/" + this.resClass + "/dialog_3slice_topround.png",
            this.threeSliceMidURL = this.assetDir + "/" + this.resClass + "/dialog_3slice_mid.png",
            this.threeSliceBottomURL = this.assetDir + "/" + this.resClass + "/dialog_3slice_bottom.png",
            this.logoURL = this.assetDir + "/" + this.resClass + "/logo_large.png",
            this.highScoresRosterURL = this.assetDir + "/" + this.resClass + "/highscores_roster.png",
            this.htpShootingURL = this.assetDir + "/" + this.resClass + "/htp_shooting.jpg",
            this.htpPowerupsURL = this.assetDir + "/" + this.resClass + "/htp_powerups.jpg",
            this.prevButtonBase = "btn_prev_",
            this.nextButtonBase = "btn_next_",
            this.clearButtonBase = "btn_hiscore_clear",
            this.refreshButtonBase = "btn_hiscore_refresh",
            this.playButtonBase = "btn_play_",
            this.scoresButtonBase = "btn_hiscores_",
            this.portalButtonBase = "btn_zibbo_0",
            this.optionsButtonBase = "btn_options_0",
            this.switchButtonBase = "btn_switch_0",
            this.shooterBarrelURL = "shooter.png",
            this.shooterMaskURL = "shooter_mask.png",
            this.pointerTrailURL = "pointer-trail.png",
            this.rowMeterFillURL = "row_meter.png",
            this.musicToggleButtonBase = "btn_music",
            this.sfxToggleButtonBase = "btn_sfx",
            this.helpButtonBase = "btn_help_",
            this.mainMenuButtonBase = "btn_menu_",
            this.restartButtonBase = "btn_restart_",
            this.closeOptionsButtonBase = "btn_options_esc_",
            this.highScoresEllipsisURL = "hiscore_ellipsis.png",
            this.burstImage1 = "burst_bonus_wow.png",
            this.burstImage2 = "burst_bonus_super.png",
            this.burstImage3 = "burst_bonus_bonus.png",
            this.burstX2 = "burst_x2.png",
            this.burstX3 = "burst_x3.png",
            this.burstX4 = "burst_x4.png",
            this.burstX5 = "burst_x5.png",
            this.burstX6 = "burst_x6.png",
            this.deathline = "background_deathline.png";
            var s = i;
            this.nColors = s.nColors || 5,
            this.nRows = s.nRows || 14,
            this.nCols = s.nCols || 14,
            this.nStartRows = s.nStartRows || 7,
            this.shooterSpeedFactor = s.shooterSpeedFactor || 400,
            this.pointsPerPop = s.pointsPerPop || 1e3
        }
    },
    n
});
var Kinetic = {}; (function() {
    Kinetic.version = "4.3.3",
    Kinetic.Filters = {},
    Kinetic.Plugins = {},
    Kinetic.Global = {
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        shapes: {},
        warn: function(t) {
            window.console && console.warn && console.warn("Kinetic warning: " + t)
        },
        extend: function(t, e) {
            for (var i in e.prototype) i in t.prototype || (t.prototype[i] = e.prototype[i])
        },
        _addId: function(t, e) {
            void 0 !== e && (this.ids[e] = t)
        },
        _removeId: function(t) {
            void 0 !== t && delete this.ids[t]
        },
        _addName: function(t, e) {
            void 0 !== e && (void 0 === this.names[e] && (this.names[e] = []), this.names[e].push(t))
        },
        _removeName: function(t, e) {
            if (void 0 !== t) {
                var i = this.names[t];
                if (void 0 !== i) {
                    for (var n = 0; i.length > n; n++) {
                        var s = i[n];
                        s._id === e && i.splice(n, 1)
                    }
                    0 === i.length && delete this.names[t]
                }
            }
        }
    }
})(),
function(t, e) {
    "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define("kinetic/kinetic", e) : t.returnExports = e()
} (this,
function() {
    return Kinetic
}),
function() {
    Kinetic.Type = {
        _isElement: function(t) {
            return ! (!t || 1 != t.nodeType)
        },
        _isFunction: function(t) {
            return !! (t && t.constructor && t.call && t.apply)
        },
        _isObject: function(t) {
            return !! t && t.constructor == Object
        },
        _isArray: function(t) {
            return "[object Array]" == Object.prototype.toString.call(t)
        },
        _isNumber: function(t) {
            return "[object Number]" == Object.prototype.toString.call(t)
        },
        _isString: function(t) {
            return "[object String]" == Object.prototype.toString.call(t)
        },
        _hasMethods: function(t) {
            var e = [];
            for (var i in t) this._isFunction(t[i]) && e.push(i);
            return e.length > 0
        },
        _isInDocument: function(t) {
            for (; t = t.parentNode;) if (t == document) return ! 0;
            return ! 1
        },
        _getXY: function(t) {
            if (this._isNumber(t)) return {
                x: t,
                y: t
            };
            if (this._isArray(t)) {
                if (1 === t.length) {
                    var e = t[0];
                    if (this._isNumber(e)) return {
                        x: e,
                        y: e
                    };
                    if (this._isArray(e)) return {
                        x: e[0],
                        y: e[1]
                    };
                    if (this._isObject(e)) return e
                } else if (t.length >= 2) return {
                    x: t[0],
                    y: t[1]
                }
            } else if (this._isObject(t)) return t;
            return null
        },
        _getSize: function(t) {
            if (this._isNumber(t)) return {
                width: t,
                height: t
            };
            if (this._isArray(t)) if (1 === t.length) {
                var e = t[0];
                if (this._isNumber(e)) return {
                    width: e,
                    height: e
                };
                if (this._isArray(e)) {
                    if (e.length >= 4) return {
                        width: e[2],
                        height: e[3]
                    };
                    if (e.length >= 2) return {
                        width: e[0],
                        height: e[1]
                    }
                } else if (this._isObject(e)) return e
            } else {
                if (t.length >= 4) return {
                    width: t[2],
                    height: t[3]
                };
                if (t.length >= 2) return {
                    width: t[0],
                    height: t[1]
                }
            } else if (this._isObject(t)) return t;
            return null
        },
        _getPoints: function(t) {
            if (void 0 === t) return [];
            if (this._isArray(t[0])) {
                for (var e = [], i = 0; t.length > i; i++) e.push({
                    x: t[i][0],
                    y: t[i][1]
                });
                return e
            }
            if (this._isObject(t[0])) return t;
            for (var e = [], i = 0; t.length > i; i += 2) e.push({
                x: t[i],
                y: t[i + 1]
            });
            return e
        },
        _getImage: function(t, e) {
            if (t) if (this._isElement(t)) e(t);
            else if (this._isString(t)) {
                var i = new Image;
                i.onload = function() {
                    e(i)
                },
                i.src = t
            } else if (t.data) {
                var n = document.createElement("canvas");
                n.width = t.width,
                n.height = t.height;
                var s = n.getContext("2d");
                s.putImageData(t, 0, 0);
                var a = n.toDataURL(),
                i = new Image;
                i.onload = function() {
                    e(i)
                },
                i.src = a
            } else e(null);
            else e(null)
        },
        _rgbToHex: function(t, e, i) {
            return ((1 << 24) + (t << 16) + (e << 8) + i).toString(16).slice(1)
        },
        _hexToRgb: function(t) {
            var e = parseInt(t, 16);
            return {
                r: 255 & e >> 16,
                g: 255 & e >> 8,
                b: 255 & e
            }
        },
        _getRandomColorKey: function() {
            var t = Math.round(255 * Math.random()),
            e = Math.round(255 * Math.random()),
            i = Math.round(255 * Math.random());
            return this._rgbToHex(t, e, i)
        },
        _merge: function(t, e) {
            var i = this._clone(e);
            for (var n in t) i[n] = this._isObject(t[n]) ? this._merge(t[n], i[n]) : t[n];
            return i
        },
        _clone: function(t) {
            var e = {};
            for (var i in t) e[i] = this._isObject(t[i]) ? this._clone(t[i]) : t[i];
            return e
        },
        _degToRad: function(t) {
            return t * Math.PI / 180
        },
        _radToDeg: function(t) {
            return 180 * t / Math.PI
        }
    }
} (),
function() {
    var t = document.createElement("canvas"),
    e = t.getContext("2d"),
    i = window.devicePixelRatio || 1,
    n = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1,
    s = i / n;
    Kinetic.Canvas = function(t, e, i) {
        this.pixelRatio = i || s,
        this.width = t,
        this.height = e,
        this.element = document.createElement("canvas"),
        this.context = this.element.getContext("2d"),
        this.setSize(t || 0, e || 0)
    },
    Kinetic.Canvas.prototype = {
        clear: function() {
            var t = this.getContext(),
            e = this.getElement();
            t.clearRect(0, 0, e.width, e.height)
        },
        getElement: function() {
            return this.element
        },
        getContext: function() {
            return this.context
        },
        setWidth: function(t) {
            this.width = t,
            this.element.width = t * this.pixelRatio,
            this.element.style.width = t + "px"
        },
        setHeight: function(t) {
            this.height = t,
            this.element.height = t * this.pixelRatio,
            this.element.style.height = t + "px"
        },
        getWidth: function() {
            return this.width
        },
        getHeight: function() {
            return this.height
        },
        setSize: function(t, e) {
            this.setWidth(t),
            this.setHeight(e)
        },
        toDataURL: function(t, e) {
            try {
                return this.element.toDataURL(t, e)
            } catch(i) {
                try {
                    return this.element.toDataURL()
                } catch(i) {
                    return Kinetic.Global.warn("Unable to get data URL. " + i.message),
                    ""
                }
            }
        },
        fill: function(t) {
            t.getFillEnabled() && this._fill(t)
        },
        stroke: function(t) {
            t.getStrokeEnabled() && this._stroke(t)
        },
        fillStroke: function(t) {
            var e = t.getFillEnabled();
            e && this._fill(t),
            t.getStrokeEnabled() && this._stroke(t, t.hasShadow() && t.hasFill() && e)
        },
        applyShadow: function(t, e) {
            var i = this.context;
            i.save(),
            this._applyShadow(t),
            e(),
            i.restore(),
            e()
        },
        _applyLineCap: function(t) {
            var e = t.getLineCap();
            e && (this.context.lineCap = e)
        },
        _applyOpacity: function(t) {
            var e = t.getAbsoluteOpacity();
            1 !== e && (this.context.globalAlpha = e)
        },
        _applyLineJoin: function(t) {
            var e = t.getLineJoin();
            e && (this.context.lineJoin = e)
        },
        _applyAncestorTransforms: function(t) {
            var e = this.context;
            t._eachAncestorReverse(function(t) {
                var i = t.getTransform(),
                n = i.getMatrix();
                e.transform(n[0], n[1], n[2], n[3], n[4], n[5])
            },
            !0)
        }
    },
    Kinetic.SceneCanvas = function(t, e, i) {
        Kinetic.Canvas.call(this, t, e, i)
    },
    Kinetic.SceneCanvas.prototype = {
        setWidth: function(t) {
            var e = this.pixelRatio;
            Kinetic.Canvas.prototype.setWidth.call(this, t),
            this.context.scale(e, e)
        },
        setHeight: function(t) {
            var e = this.pixelRatio;
            Kinetic.Canvas.prototype.setHeight.call(this, t),
            this.context.scale(e, e)
        },
        _fillColor: function(t) {
            var e = this.context,
            i = t.getFill();
            e.fillStyle = i,
            t._fillFunc(e)
        },
        _fillPattern: function(t) {
            var e = this.context,
            i = t.getFillPatternImage(),
            n = t.getFillPatternX(),
            s = t.getFillPatternY(),
            a = t.getFillPatternScale(),
            o = t.getFillPatternRotation(),
            r = t.getFillPatternOffset(),
            h = t.getFillPatternRepeat(); (n || s) && e.translate(n || 0, s || 0),
            o && e.rotate(o),
            a && e.scale(a.x, a.y),
            r && e.translate( - 1 * r.x, -1 * r.y),
            e.fillStyle = e.createPattern(i, h || "repeat"),
            e.fill()
        },
        _fillLinearGradient: function(t) {
            for (var e = this.context,
            i = t.getFillLinearGradientStartPoint(), n = t.getFillLinearGradientEndPoint(), s = t.getFillLinearGradientColorStops(), a = e.createLinearGradient(i.x, i.y, n.x, n.y), o = 0; s.length > o; o += 2) a.addColorStop(s[o], s[o + 1]);
            e.fillStyle = a,
            e.fill()
        },
        _fillRadialGradient: function(t) {
            for (var e = this.context,
            i = t.getFillRadialGradientStartPoint(), n = t.getFillRadialGradientEndPoint(), s = t.getFillRadialGradientStartRadius(), a = t.getFillRadialGradientEndRadius(), o = t.getFillRadialGradientColorStops(), r = e.createRadialGradient(i.x, i.y, s, n.x, n.y, a), h = 0; o.length > h; h += 2) r.addColorStop(o[h], o[h + 1]);
            e.fillStyle = r,
            e.fill()
        },
        _fill: function(t, e) {
            var i = this.context,
            n = t.getFill(),
            s = t.getFillPatternImage(),
            a = t.getFillLinearGradientStartPoint(),
            o = t.getFillRadialGradientStartPoint(),
            r = t.getFillPriority();
            i.save(),
            !e && t.hasShadow() && this._applyShadow(t),
            n && "color" === r ? this._fillColor(t) : s && "pattern" === r ? this._fillPattern(t) : a && "linear-gradient" === r ? this._fillLinearGradient(t) : o && "radial-gradient" === r ? this._fillRadialGradient(t) : n ? this._fillColor(t) : s ? this._fillPattern(t) : a ? this._fillLinearGradient(t) : o && this._fillRadialGradient(t),
            i.restore(),
            !e && t.hasShadow() && this._fill(t, !0)
        },
        _stroke: function(t, e) {
            var i = this.context,
            n = t.getStroke(),
            s = t.getStrokeWidth(),
            a = t.getDashArray(); (n || s) && (i.save(), this._applyLineCap(t), a && t.getDashArrayEnabled() && (i.setLineDash ? i.setLineDash(a) : "mozDash" in i ? i.mozDash = a: "webkitLineDash" in i && (i.webkitLineDash = a)), !e && t.hasShadow() && this._applyShadow(t), i.lineWidth = s || 2, i.strokeStyle = n || "black", t._strokeFunc(i), i.restore(), !e && t.hasShadow() && this._stroke(t, !0))
        },
        _applyShadow: function(t) {
            var e = this.context;
            if (t.hasShadow() && t.getShadowEnabled()) {
                var i = t.getAbsoluteOpacity(),
                n = t.getShadowColor() || "black",
                s = t.getShadowBlur() || 5,
                a = t.getShadowOffset() || {
                    x: 0,
                    y: 0
                };
                t.getShadowOpacity() && (e.globalAlpha = t.getShadowOpacity() * i),
                e.shadowColor = n,
                e.shadowBlur = s,
                e.shadowOffsetX = a.x,
                e.shadowOffsetY = a.y
            }
        }
    },
    Kinetic.Global.extend(Kinetic.SceneCanvas, Kinetic.Canvas),
    Kinetic.HitCanvas = function(t, e, i) {
        Kinetic.Canvas.call(this, t, e, i)
    },
    Kinetic.HitCanvas.prototype = {
        _fill: function(t) {
            var e = this.context;
            e.save(),
            e.fillStyle = "#" + t.colorKey,
            t._fillFuncHit(e),
            e.restore()
        },
        _stroke: function(t) {
            var e = this.context,
            i = t.getStroke(),
            n = t.getStrokeWidth(); (i || n) && (this._applyLineCap(t), e.save(), e.lineWidth = n || 2, e.strokeStyle = "#" + t.colorKey, t._strokeFuncHit(e), e.restore())
        }
    },
    Kinetic.Global.extend(Kinetic.HitCanvas, Kinetic.Canvas)
} (),
function() {
    Kinetic.Tween = function(t, e, i, n, s, a) {
        this._listeners = [],
        this.addListener(this),
        this.obj = t,
        this.propFunc = e,
        this.begin = n,
        this._pos = n,
        this.setDuration(a),
        this.isPlaying = !1,
        this._change = 0,
        this.prevTime = 0,
        this.prevPos = 0,
        this.looping = !1,
        this._time = 0,
        this._position = 0,
        this._startTime = 0,
        this._finish = 0,
        this.name = "",
        this.func = i,
        this.setFinish(s)
    },
    Kinetic.Tween.prototype = {
        setTime: function(t) {
            this.prevTime = this._time,
            t > this.getDuration() ? this.looping ? (this.rewind(t - this._duration), this.update(), this.broadcastMessage("onLooped", {
                target: this,
                type: "onLooped"
            })) : (this._time = this._duration, this.update(), this.stop(), this.broadcastMessage("onFinished", {
                target: this,
                type: "onFinished"
            })) : 0 > t ? (this.rewind(), this.update()) : (this._time = t, this.update())
        },
        getTime: function() {
            return this._time
        },
        setDuration: function(t) {
            this._duration = null === t || 0 >= t ? 1e5: t
        },
        getDuration: function() {
            return this._duration
        },
        setPosition: function(t) {
            this.prevPos = this._pos,
            this.propFunc(t),
            this._pos = t,
            this.broadcastMessage("onChanged", {
                target: this,
                type: "onChanged"
            })
        },
        getPosition: function(t) {
            return void 0 === t && (t = this._time),
            this.func(t, this.begin, this._change, this._duration)
        },
        setFinish: function(t) {
            this._change = t - this.begin
        },
        getFinish: function() {
            return this.begin + this._change
        },
        start: function() {
            this.rewind(),
            this.startEnterFrame(),
            this.broadcastMessage("onStarted", {
                target: this,
                type: "onStarted"
            })
        },
        rewind: function(t) {
            this.stop(),
            this._time = void 0 === t ? 0 : t,
            this.fixTime(),
            this.update()
        },
        fforward: function() {
            this._time = this._duration,
            this.fixTime(),
            this.update()
        },
        update: function() {
            this.setPosition(this.getPosition(this._time))
        },
        startEnterFrame: function() {
            this.stopEnterFrame(),
            this.isPlaying = !0,
            this.onEnterFrame()
        },
        onEnterFrame: function() {
            this.isPlaying && this.nextFrame()
        },
        nextFrame: function() {
            this.setTime((this.getTimer() - this._startTime) / 1e3)
        },
        stop: function() {
            this.stopEnterFrame(),
            this.broadcastMessage("onStopped", {
                target: this,
                type: "onStopped"
            })
        },
        stopEnterFrame: function() {
            this.isPlaying = !1
        },
        continueTo: function(t, e) {
            this.begin = this._pos,
            this.setFinish(t),
            void 0 !== this._duration && this.setDuration(e),
            this.start()
        },
        resume: function() {
            this.fixTime(),
            this.startEnterFrame(),
            this.broadcastMessage("onResumed", {
                target: this,
                type: "onResumed"
            })
        },
        yoyo: function() {
            this.continueTo(this.begin, this._time)
        },
        addListener: function(t) {
            return this.removeListener(t),
            this._listeners.push(t)
        },
        removeListener: function(t) {
            for (var e = this._listeners,
            i = e.length; i--;) if (e[i] == t) return e.splice(i, 1),
            !0;
            return ! 1
        },
        broadcastMessage: function() {
            for (var t = [], e = 0; arguments.length > e; e++) t.push(arguments[e]);
            for (var i = t.shift(), n = this._listeners, s = n.length, e = 0; s > e; e++) n[e][i] && n[e][i].apply(n[e], t)
        },
        fixTime: function() {
            this._startTime = this.getTimer() - 1e3 * this._time
        },
        getTimer: function() {
            return (new Date).getTime() - this._time
        }
    },
    Kinetic.Tweens = {
        "back-ease-in": function(t, e, i, n) {
            var s = 1.70158;
            return i * (t /= n) * t * ((s + 1) * t - s) + e
        },
        "back-ease-out": function(t, e, i, n) {
            var s = 1.70158;
            return i * ((t = t / n - 1) * t * ((s + 1) * t + s) + 1) + e
        },
        "back-ease-in-out": function(t, e, i, n) {
            var s = 1.70158;
            return 1 > (t /= n / 2) ? i / 2 * t * t * (((s *= 1.525) + 1) * t - s) + e: i / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + e
        },
        "elastic-ease-in": function(t, e, i, n, s, a) {
            var o = 0;
            return 0 === t ? e: 1 == (t /= n) ? e + i: (a || (a = .3 * n), !s || Math.abs(i) > s ? (s = i, o = a / 4) : o = a / (2 * Math.PI) * Math.asin(i / s), -(s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - o) * 2 * Math.PI / a)) + e)
        },
        "elastic-ease-out": function(t, e, i, n, s, a) {
            var o = 0;
            return 0 === t ? e: 1 == (t /= n) ? e + i: (a || (a = .3 * n), !s || Math.abs(i) > s ? (s = i, o = a / 4) : o = a / (2 * Math.PI) * Math.asin(i / s), s * Math.pow(2, -10 * t) * Math.sin((t * n - o) * 2 * Math.PI / a) + i + e)
        },
        "elastic-ease-in-out": function(t, e, i, n, s, a) {
            var o = 0;
            return 0 === t ? e: 2 == (t /= n / 2) ? e + i: (a || (a = n * .3 * 1.5), !s || Math.abs(i) > s ? (s = i, o = a / 4) : o = a / (2 * Math.PI) * Math.asin(i / s), 1 > t ? -.5 * s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - o) * 2 * Math.PI / a) + e: .5 * s * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * n - o) * 2 * Math.PI / a) + i + e)
        },
        "bounce-ease-out": function(t, e, i, n) {
            return 1 / 2.75 > (t /= n) ? i * 7.5625 * t * t + e: 2 / 2.75 > t ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e: 2.5 / 2.75 > t ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e: i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
        },
        "bounce-ease-in": function(t, e, i, n) {
            return i - Kinetic.Tweens["bounce-ease-out"](n - t, 0, i, n) + e
        },
        "bounce-ease-in-out": function(t, e, i, n) {
            return n / 2 > t ? .5 * Kinetic.Tweens["bounce-ease-in"](2 * t, 0, i, n) + e: .5 * Kinetic.Tweens["bounce-ease-out"](2 * t - n, 0, i, n) + .5 * i + e
        },
        "ease-in": function(t, e, i, n) {
            return i * (t /= n) * t + e
        },
        "ease-out": function(t, e, i, n) {
            return - i * (t /= n) * (t - 2) + e
        },
        "ease-in-out": function(t, e, i, n) {
            return 1 > (t /= n / 2) ? i / 2 * t * t + e: -i / 2 * (--t * (t - 2) - 1) + e
        },
        "strong-ease-in": function(t, e, i, n) {
            return i * (t /= n) * t * t * t * t + e
        },
        "strong-ease-out": function(t, e, i, n) {
            return i * ((t = t / n - 1) * t * t * t * t + 1) + e
        },
        "strong-ease-in-out": function(t, e, i, n) {
            return 1 > (t /= n / 2) ? i / 2 * t * t * t * t * t + e: i / 2 * ((t -= 2) * t * t * t * t + 2) + e
        },
        linear: function(t, e, i, n) {
            return i * t / n + e
        }
    }
} (),
function() {
    Kinetic.Transform = function() {
        this.m = [1, 0, 0, 1, 0, 0]
    },
    Kinetic.Transform.prototype = {
        translate: function(t, e) {
            this.m[4] += this.m[0] * t + this.m[2] * e,
            this.m[5] += this.m[1] * t + this.m[3] * e
        },
        scale: function(t, e) {
            this.m[0] *= t,
            this.m[1] *= t,
            this.m[2] *= e,
            this.m[3] *= e
        },
        rotate: function(t) {
            var e = Math.cos(t),
            i = Math.sin(t),
            n = this.m[0] * e + this.m[2] * i,
            s = this.m[1] * e + this.m[3] * i,
            a = this.m[0] * -i + this.m[2] * e,
            o = this.m[1] * -i + this.m[3] * e;
            this.m[0] = n,
            this.m[1] = s,
            this.m[2] = a,
            this.m[3] = o
        },
        getTranslation: function() {
            return {
                x: this.m[4],
                y: this.m[5]
            }
        },
        multiply: function(t) {
            var e = this.m[0] * t.m[0] + this.m[2] * t.m[1],
            i = this.m[1] * t.m[0] + this.m[3] * t.m[1],
            n = this.m[0] * t.m[2] + this.m[2] * t.m[3],
            s = this.m[1] * t.m[2] + this.m[3] * t.m[3],
            a = this.m[0] * t.m[4] + this.m[2] * t.m[5] + this.m[4],
            o = this.m[1] * t.m[4] + this.m[3] * t.m[5] + this.m[5];
            this.m[0] = e,
            this.m[1] = i,
            this.m[2] = n,
            this.m[3] = s,
            this.m[4] = a,
            this.m[5] = o
        },
        invert: function() {
            var t = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
            e = this.m[3] * t,
            i = -this.m[1] * t,
            n = -this.m[2] * t,
            s = this.m[0] * t,
            a = t * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
            o = t * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = e,
            this.m[1] = i,
            this.m[2] = n,
            this.m[3] = s,
            this.m[4] = a,
            this.m[5] = o
        },
        getMatrix: function() {
            return this.m
        }
    }
} (),
function() {
    Kinetic.Collection = function() {
        var t = [].slice.call(arguments),
        e = t.length,
        i = 0;
        for (this.length = e; e > i; i++) this[i] = t[i];
        return this
    },
    Kinetic.Collection.prototype = [],
    Kinetic.Collection.prototype.apply = function(t) {
        args = [].slice.call(arguments),
        args.shift();
        for (var e = 0; this.length > e; e++) Kinetic.Type._isFunction(this[e][t]) && this[e][t].apply(this[e], args)
    },
    Kinetic.Collection.prototype.each = function(t) {
        for (var e = 0; this.length > e; e++) t.call(this[e], e, this[e])
    }
} (),
function() {
    Kinetic.Filters.Grayscale = function(t) {
        for (var e = t.data,
        i = 0; e.length > i; i += 4) {
            var n = .34 * e[i] + .5 * e[i + 1] + .16 * e[i + 2];
            e[i] = n,
            e[i + 1] = n,
            e[i + 2] = n
        }
    }
} (),
function() {
    Kinetic.Filters.Brighten = function(t, e) {
        for (var i = e.val || 0,
        n = t.data,
        s = 0; n.length > s; s += 4) n[s] += i,
        n[s + 1] += i,
        n[s + 2] += i
    }
} (),
function() {
    Kinetic.Filters.Invert = function(t) {
        for (var e = t.data,
        i = 0; e.length > i; i += 4) e[i] = 255 - e[i],
        e[i + 1] = 255 - e[i + 1],
        e[i + 2] = 255 - e[i + 2]
    }
} (),
function() {
    Kinetic.Node = function(t) {
        this._nodeInit(t)
    },
    Kinetic.Node.prototype = {
        _nodeInit: function(t) {
            this._id = Kinetic.Global.idCounter++,
            this.defaultNodeAttrs = {
                visible: !0,
                listening: !0,
                name: void 0,
                opacity: 1,
                x: 0,
                y: 0,
                scale: {
                    x: 1,
                    y: 1
                },
                rotation: 0,
                offset: {
                    x: 0,
                    y: 0
                },
                draggable: !1,
                dragOnTop: !0
            },
            this.setDefaultAttrs(this.defaultNodeAttrs),
            this.eventListeners = {},
            this.setAttrs(t)
        },
        on: function(t, e) {
            for (var i = t.split(" "), n = i.length, s = 0; n > s; s++) {
                var a = i[s],
                o = a,
                r = o.split("."),
                h = r[0],
                c = r.length > 1 ? r[1] : "";
                this.eventListeners[h] || (this.eventListeners[h] = []),
                this.eventListeners[h].push({
                    name: c,
                    handler: e
                })
            }
        },
        off: function(t) {
            for (var e = t.split(" "), i = e.length, n = 0; i > n; n++) {
                var s = e[n],
                a = s,
                o = a.split("."),
                r = o[0];
                if (o.length > 1) if (r) this.eventListeners[r] && this._off(r, o[1]);
                else for (var s in this.eventListeners) this._off(s, o[1]);
                else delete this.eventListeners[r]
            }
        },
        remove: function() {
            var t = this.getParent();
            t && t.children && (t.children.splice(this.index, 1), t._setChildrenIndices()),
            delete this.parent
        },
        destroy: function() {
            for (var t = (this.getParent(), this.getStage(), Kinetic.DD), e = Kinetic.Global; this.children && this.children.length > 0;) this.children[0].destroy();
            e._removeId(this.getId()),
            e._removeName(this.getName(), this._id),
            t && t.node && t.node._id === this._id && node._endDrag(),
            this.trans && this.trans.stop(),
            this.remove()
        },
        getAttrs: function() {
            return this.attrs
        },
        setDefaultAttrs: function(t) {
            if (void 0 === this.attrs && (this.attrs = {}), t) for (var e in t) void 0 === this.attrs[e] && (this.attrs[e] = t[e])
        },
        setAttrs: function(t) {
            if (t) for (var e in t) {
                var i = "set" + e.charAt(0).toUpperCase() + e.slice(1);
                Kinetic.Type._isFunction(this[i]) ? this[i](t[e]) : this.setAttr(e, t[e])
            }
        },
        getVisible: function() {
            var t = this.attrs.visible,
            e = this.getParent();
            return t && e && !e.getVisible() ? !1 : t
        },
        getListening: function() {
            var t = this.attrs.listening,
            e = this.getParent();
            return t && e && !e.getListening() ? !1 : t
        },
        show: function() {
            this.setVisible(!0)
        },
        hide: function() {
            this.setVisible(!1)
        },
        getZIndex: function() {
            return this.index
        },
        getAbsoluteZIndex: function() {
            function t(s) {
                for (var a = [], o = s.length, r = 0; o > r; r++) {
                    var h = s[r];
                    n++,
                    "Shape" !== h.nodeType && (a = a.concat(h.getChildren())),
                    h._id === i._id && (r = o)
                }
                a.length > 0 && e >= a[0].getLevel() && t(a)
            }
            var e = this.getLevel();
            this.getStage();
            var i = this,
            n = 0;
            return "Stage" !== i.nodeType && t(i.getStage().getChildren()),
            n
        },
        getLevel: function() {
            for (var t = 0,
            e = this.parent; e;) t++,
            e = e.parent;
            return t
        },
        setPosition: function() {
            var t = Kinetic.Type._getXY([].slice.call(arguments));
            this.setAttr("x", t.x),
            this.setAttr("y", t.y)
        },
        getPosition: function() {
            var t = this.attrs;
            return {
                x: t.x,
                y: t.y
            }
        },
        getAbsolutePosition: function() {
            var t = this.getAbsoluteTransform(),
            e = this.getOffset();
            return t.translate(e.x, e.y),
            t.getTranslation()
        },
        setAbsolutePosition: function() {
            var t = Kinetic.Type._getXY([].slice.call(arguments)),
            e = this._clearTransform();
            this.attrs.x = e.x,
            this.attrs.y = e.y,
            delete e.x,
            delete e.y;
            var i = this.getAbsoluteTransform();
            i.invert(),
            i.translate(t.x, t.y),
            t = {
                x: this.attrs.x + i.getTranslation().x,
                y: this.attrs.y + i.getTranslation().y
            },
            this.setPosition(t.x, t.y),
            this._setTransform(e)
        },
        move: function() {
            var t = Kinetic.Type._getXY([].slice.call(arguments)),
            e = this.getX(),
            i = this.getY();
            void 0 !== t.x && (e += t.x),
            void 0 !== t.y && (i += t.y),
            this.setPosition(e, i)
        },
        _eachAncestorReverse: function(t, e) {
            var i = [],
            n = this.getParent();
            for (e && i.unshift(this); n;) i.unshift(n),
            n = n.parent;
            for (var s = i.length,
            a = 0; s > a; a++) t(i[a])
        },
        rotate: function(t) {
            this.setRotation(this.getRotation() + t)
        },
        rotateDeg: function(t) {
            this.setRotation(this.getRotation() + Kinetic.Type._degToRad(t))
        },
        moveToTop: function() {
            var t = this.index;
            return this.parent.children.splice(t, 1),
            this.parent.children.push(this),
            this.parent._setChildrenIndices(),
            !0
        },
        moveUp: function() {
            var t = this.index,
            e = this.parent.getChildren().length;
            return e - 1 > t ? (this.parent.children.splice(t, 1), this.parent.children.splice(t + 1, 0, this), this.parent._setChildrenIndices(), !0) : void 0
        },
        moveDown: function() {
            var t = this.index;
            return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.splice(t - 1, 0, this), this.parent._setChildrenIndices(), !0) : void 0
        },
        moveToBottom: function() {
            var t = this.index;
            return t > 0 ? (this.parent.children.splice(t, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0) : void 0
        },
        setZIndex: function(t) {
            var e = this.index;
            this.parent.children.splice(e, 1),
            this.parent.children.splice(t, 0, this),
            this.parent._setChildrenIndices()
        },
        getAbsoluteOpacity: function() {
            var t = this.getOpacity();
            return this.getParent() && (t *= this.getParent().getAbsoluteOpacity()),
            t
        },
        moveTo: function(t) {
            Kinetic.Node.prototype.remove.call(this),
            t.add(this)
        },
        toObject: function() {
            var t = Kinetic.Type,
            e = {},
            i = this.attrs;
            e.attrs = {};
            for (var n in i) {
                var s = i[n];
                t._isFunction(s) || t._isElement(s) || t._isObject(s) && t._hasMethods(s) || (e.attrs[n] = s)
            }
            return e.nodeType = this.nodeType,
            e.shapeType = this.shapeType,
            e
        },
        toJSON: function() {
            return JSON.stringify(this.toObject())
        },
        getParent: function() {
            return this.parent
        },
        getLayer: function() {
            return this.getParent().getLayer()
        },
        getStage: function() {
            return this.getParent() ? this.getParent().getStage() : void 0
        },
        simulate: function(t, e) {
            this._handleEvent(t, e || {})
        },
        fire: function(t, e) {
            this._executeHandlers(t, e || {})
        },
        getAbsoluteTransform: function() {
            var t = new Kinetic.Transform;
            return this._eachAncestorReverse(function(e) {
                var i = e.getTransform();
                t.multiply(i)
            },
            !0),
            t
        },
        getTransform: function() {
            var t = new Kinetic.Transform,
            e = this.attrs,
            i = e.x,
            n = e.y,
            s = e.rotation,
            a = e.scale,
            o = a.x,
            r = a.y,
            h = e.offset,
            c = h.x,
            l = h.y;
            return (0 !== i || 0 !== n) && t.translate(i, n),
            0 !== s && t.rotate(s),
            (1 !== o || 1 !== r) && t.scale(o, r),
            (0 !== c || 0 !== l) && t.translate( - 1 * c, -1 * l),
            t
        },
        clone: function(t) {
            var e = this.shapeType || this.nodeType,
            i = new Kinetic[e](this.attrs);
            for (var n in this.eventListeners) for (var s = this.eventListeners[n], a = s.length, o = 0; a > o; o++) {
                var r = s[o];
                0 > r.name.indexOf("kinetic") && (i.eventListeners[n] || (i.eventListeners[n] = []), i.eventListeners[n].push(r))
            }
            return i.setAttrs(t),
            i
        },
        toDataURL: function(t) {
            t = t || {};
            var e, i, n = t.mimeType || null,
            s = t.quality || null,
            a = t.x || 0,
            o = t.y || 0;
            return t.width && t.height ? e = new Kinetic.SceneCanvas(t.width, t.height, 1) : (e = this.getStage().bufferCanvas, e.clear()),
            i = e.getContext(),
            i.save(),
            (a || o) && i.translate( - 1 * a, -1 * o),
            this.drawScene(e),
            i.restore(),
            e.toDataURL(n, s)
        },
        toImage: function(t) {
            Kinetic.Type._getImage(this.toDataURL(t),
            function(e) {
                t.callback(e)
            })
        },
        setSize: function() {
            var t = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
            this.setWidth(t.width),
            this.setHeight(t.height)
        },
        getSize: function() {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            }
        },
        getWidth: function() {
            return this.attrs.width || 0
        },
        getHeight: function() {
            return this.attrs.height || 0
        },
        _get: function(t) {
            return this.nodeType === t ? [this] : []
        },
        _off: function(t, e) {
            for (var i = 0; this.eventListeners[t].length > i; i++) if (this.eventListeners[t][i].name === e) {
                if (this.eventListeners[t].splice(i, 1), 0 === this.eventListeners[t].length) {
                    delete this.eventListeners[t];
                    break
                }
                i--
            }
        },
        _clearTransform: function() {
            var t = this.attrs,
            e = t.scale,
            i = t.offset,
            n = {
                x: t.x,
                y: t.y,
                rotation: t.rotation,
                scale: {
                    x: e.x,
                    y: e.y
                },
                offset: {
                    x: i.x,
                    y: i.y
                }
            };
            return this.attrs.x = 0,
            this.attrs.y = 0,
            this.attrs.rotation = 0,
            this.attrs.scale = {
                x: 1,
                y: 1
            },
            this.attrs.offset = {
                x: 0,
                y: 0
            },
            n
        },
        _setTransform: function(t) {
            for (var e in t) this.attrs[e] = t[e]
        },
        _fireBeforeChangeEvent: function(t, e, i) {
            this._handleEvent("before" + t.toUpperCase() + "Change", {
                oldVal: e,
                newVal: i
            })
        },
        _fireChangeEvent: function(t, e, i) {
            this._handleEvent(t + "Change", {
                oldVal: e,
                newVal: i
            })
        },
        setId: function(t) {
            var e = this.getId(),
            i = (this.getStage(), Kinetic.Global);
            i._removeId(e),
            i._addId(this, t),
            this.setAttr("id", t)
        },
        setName: function(t) {
            var e = this.getName(),
            i = (this.getStage(), Kinetic.Global);
            i._removeName(e, this._id),
            i._addName(this, t),
            this.setAttr("name", t)
        },
        setAttr: function(t, e) {
            if (void 0 !== e) {
                var i = this.attrs[t];
                this._fireBeforeChangeEvent(t, i, e),
                this.attrs[t] = e,
                this._fireChangeEvent(t, i, e)
            }
        },
        _handleEvent: function(t, e, i) {
            e && "Shape" === this.nodeType && (e.shape = this),
            this.getStage();
            var n = this.eventListeners,
            s = !0;
            "mouseenter" === t && i && this._id === i._id ? s = !1 : "mouseleave" === t && i && this._id === i._id && (s = !1),
            s && (n[t] && this.fire(t, e), e && !e.cancelBubble && this.parent && (i && i.parent ? this._handleEvent.call(this.parent, t, e, i.parent) : this._handleEvent.call(this.parent, t, e)))
        },
        _executeHandlers: function(t, e) {
            for (var i = this.eventListeners[t], n = i.length, s = 0; n > s; s++) i[s].handler.apply(this, [e])
        }
    },
    Kinetic.Node.addSetters = function(t, e) {
        for (var i = e.length,
        n = 0; i > n; n++) {
            var s = e[n];
            this._addSetter(t, s)
        }
    },
    Kinetic.Node.addPointSetters = function(t, e) {
        for (var i = e.length,
        n = 0; i > n; n++) {
            var s = e[n];
            this._addPointSetter(t, s)
        }
    },
    Kinetic.Node.addRotationSetters = function(t, e) {
        for (var i = e.length,
        n = 0; i > n; n++) {
            var s = e[n];
            this._addRotationSetter(t, s)
        }
    },
    Kinetic.Node.addGetters = function(t, e) {
        for (var i = e.length,
        n = 0; i > n; n++) {
            var s = e[n];
            this._addGetter(t, s)
        }
    },
    Kinetic.Node.addRotationGetters = function(t, e) {
        for (var i = e.length,
        n = 0; i > n; n++) {
            var s = e[n];
            this._addRotationGetter(t, s)
        }
    },
    Kinetic.Node.addGettersSetters = function(t, e) {
        this.addSetters(t, e),
        this.addGetters(t, e)
    },
    Kinetic.Node.addPointGettersSetters = function(t, e) {
        this.addPointSetters(t, e),
        this.addGetters(t, e)
    },
    Kinetic.Node.addRotationGettersSetters = function(t, e) {
        this.addRotationSetters(t, e),
        this.addRotationGetters(t, e)
    },
    Kinetic.Node._addSetter = function(t, e) {
        var i = "set" + e.charAt(0).toUpperCase() + e.slice(1);
        t.prototype[i] = function(t) {
            this.setAttr(e, t)
        }
    },
    Kinetic.Node._addPointSetter = function(t, e) {
        var i = "set" + e.charAt(0).toUpperCase() + e.slice(1);
        t.prototype[i] = function() {
            var t = Kinetic.Type._getXY([].slice.call(arguments));
            t && void 0 === t.x && (t.x = this.attrs[e].x),
            t && void 0 === t.y && (t.y = this.attrs[e].y),
            this.setAttr(e, t)
        }
    },
    Kinetic.Node._addRotationSetter = function(t, e) {
        var i = "set" + e.charAt(0).toUpperCase() + e.slice(1);
        t.prototype[i] = function(t) {
            this.setAttr(e, t)
        },
        t.prototype[i + "Deg"] = function(t) {
            this.setAttr(e, Kinetic.Type._degToRad(t))
        }
    },
    Kinetic.Node._addGetter = function(t, e) {
        var i = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        t.prototype[i] = function() {
            return this.attrs[e]
        }
    },
    Kinetic.Node._addRotationGetter = function(t, e) {
        var i = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        t.prototype[i] = function() {
            return this.attrs[e]
        },
        t.prototype[i + "Deg"] = function() {
            return Kinetic.Type._radToDeg(this.attrs[e])
        }
    },
    Kinetic.Node.create = function(t, e) {
        return this._createNode(JSON.parse(t), e)
    },
    Kinetic.Node._createNode = function(t, e) {
        var i;
        i = "Shape" === t.nodeType ? void 0 === t.shapeType ? "Shape": t.shapeType: t.nodeType,
        e && (t.attrs.container = e);
        var n = new Kinetic[i](t.attrs);
        if (t.children) for (var s = t.children.length,
        a = 0; s > a; a++) n.add(this._createNode(t.children[a]));
        return n
    },
    Kinetic.Node.addGettersSetters(Kinetic.Node, ["x", "y", "opacity"]),
    Kinetic.Node.addGetters(Kinetic.Node, ["name", "id"]),
    Kinetic.Node.addRotationGettersSetters(Kinetic.Node, ["rotation"]),
    Kinetic.Node.addPointGettersSetters(Kinetic.Node, ["scale", "offset"]),
    Kinetic.Node.addSetters(Kinetic.Node, ["width", "height", "listening", "visible"]),
    Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening,
    Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible;
    for (var t = ["on", "off"], e = 0; 2 > e; e++)(function(e) {
        var i = t[e];
        Kinetic.Collection.prototype[i] = function() {
            var t = [].slice.call(arguments);
            t.unshift(i),
            this.apply.apply(this, t)
        }
    })(e)
} (),
function() {
    Kinetic.Animation = function(t, e) {
        this.func = t,
        this.node = e,
        this.id = Kinetic.Animation.animIdCounter++,
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: (new Date).getTime()
        }
    },
    Kinetic.Animation.prototype = {
        isRunning: function() {
            for (var t = Kinetic.Animation,
            e = t.animations,
            i = 0; e.length > i; i++) if (e[i].id === this.id) return ! 0;
            return ! 1
        },
        start: function() {
            this.stop(),
            this.frame.timeDiff = 0,
            this.frame.lastTime = (new Date).getTime(),
            Kinetic.Animation._addAnimation(this)
        },
        stop: function() {
            Kinetic.Animation._removeAnimation(this)
        },
        _updateFrameObject: function(t) {
            this.frame.timeDiff = t - this.frame.lastTime,
            this.frame.lastTime = t,
            this.frame.time += this.frame.timeDiff,
            this.frame.frameRate = 1e3 / this.frame.timeDiff
        }
    },
    Kinetic.Animation.animations = [],
    Kinetic.Animation.animIdCounter = 0,
    Kinetic.Animation.animRunning = !1,
    Kinetic.Animation.fixedRequestAnimFrame = function(t) {
        window.setTimeout(t, 1e3 / 60)
    },
    Kinetic.Animation._addAnimation = function(t) {
        this.animations.push(t),
        this._handleAnimation()
    },
    Kinetic.Animation._removeAnimation = function(t) {
        for (var e = t.id,
        i = this.animations,
        n = i.length,
        s = 0; n > s; s++) if (i[s].id === e) {
            this.animations.splice(s, 1);
            break
        }
    },
    Kinetic.Animation._runFrames = function() {
        for (var t = {},
        e = this.animations,
        i = 0; e.length > i; i++) {
            var n = e[i],
            s = n.node,
            a = n.func;
            n._updateFrameObject((new Date).getTime()),
            s && void 0 !== s._id && (t[s._id] = s),
            a && a(n.frame)
        }
        for (var o in t) t[o].draw()
    },
    Kinetic.Animation._animationLoop = function() {
        var t = this;
        this.animations.length > 0 ? (this._runFrames(), Kinetic.Animation.requestAnimFrame(function() {
            t._animationLoop()
        })) : this.animRunning = !1
    },
    Kinetic.Animation._handleAnimation = function() {
        var t = this;
        this.animRunning || (this.animRunning = !0, t._animationLoop())
    },
    RAF = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Kinetic.Animation.fixedRequestAnimFrame
    } (),
    Kinetic.Animation.requestAnimFrame = function(t) {
        var e = Kinetic.DD && Kinetic.DD.moving ? this.fixedRequestAnimFrame: RAF;
        e(t)
    };
    var t = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo = function(e) {
        t.call(this, e)
    }
} (),
function() {
    Kinetic.DD = {
        anim: new Kinetic.Animation,
        moving: !1,
        offset: {
            x: 0,
            y: 0
        }
    },
    Kinetic.getNodeDragging = function() {
        return Kinetic.DD.node
    },
    Kinetic.DD._setupDragLayerAndGetContainer = function(t) {
        var e, i, n = t.getStage();
        return t.nodeType,
        t._eachAncestorReverse(function(t) {
            "Layer" === t.nodeType ? (n.dragLayer.setAttrs(t.getAttrs()), e = n.dragLayer, n.add(n.dragLayer)) : "Group" === t.nodeType && (i = new Kinetic.Group(t.getAttrs()), e.add(i), e = i)
        }),
        e
    },
    Kinetic.DD._initDragLayer = function(t) {
        t.dragLayer = new Kinetic.Layer,
        t.dragLayer.getCanvas().getElement().className = "kinetic-drag-and-drop-layer"
    },
    Kinetic.DD._drag = function(t) {
        var e = Kinetic.DD,
        i = e.node;
        if (i) {
            var n = i.getStage().getUserPosition(),
            s = i.attrs.dragBoundFunc,
            a = {
                x: n.x - e.offset.x,
                y: n.y - e.offset.y
            };
            void 0 !== s && (a = s.call(i, a, t)),
            i.setAbsolutePosition(a),
            e.moving || (e.moving = !0, i.setListening(!1), i._handleEvent("dragstart", t)),
            i._handleEvent("dragmove", t)
        }
    },
    Kinetic.DD._endDrag = function(t) {
        var e = Kinetic.DD,
        i = e.node;
        if (i) {
            var n = i.nodeType;
            i.getStage(),
            i.setListening(!0),
            "Stage" === n ? i.draw() : (("Group" === n || "Shape" === n) && i.getDragOnTop() && e.prevParent && (i.moveTo(e.prevParent), i.getStage().dragLayer.remove(), e.prevParent = null), i.getLayer().draw()),
            delete e.node,
            e.anim.stop(),
            e.moving && (e.moving = !1, i._handleEvent("dragend", t))
        }
    },
    Kinetic.Node.prototype._startDrag = function() {
        var t = Kinetic.DD,
        e = this,
        i = this.getStage(),
        n = i.getUserPosition();
        if (n) {
            var s, a = (this.getTransform().getTranslation(), this.getAbsolutePosition()),
            o = this.nodeType;
            t.node = this,
            t.offset.x = n.x - a.x,
            t.offset.y = n.y - a.y,
            "Stage" === o || "Layer" === o ? (t.anim.node = this, t.anim.start()) : this.getDragOnTop() ? (s = t._setupDragLayerAndGetContainer(this), t.anim.node = i.dragLayer, t.prevParent = this.getParent(), setTimeout(function() {
                t.node && (e.moveTo(s), t.prevParent.getLayer().draw(), i.dragLayer.draw(), t.anim.start())
            },
            0)) : (t.anim.node = this.getLayer(), t.anim.start())
        }
    },
    Kinetic.Node.prototype.setDraggable = function(t) {
        this.setAttr("draggable", t),
        this._dragChange()
    },
    Kinetic.Node.prototype.getDraggable = function() {
        return this.attrs.draggable
    },
    Kinetic.Node.prototype.isDragging = function() {
        var t = Kinetic.DD;
        return t.node && t.node._id === this._id && t.moving
    },
    Kinetic.Node.prototype._listenDrag = function() {
        this._dragCleanup();
        var t = this;
        this.on("mousedown.kinetic touchstart.kinetic",
        function(e) {
            Kinetic.getNodeDragging() || t._startDrag(e)
        })
    },
    Kinetic.Node.prototype._dragChange = function() {
        if (this.attrs.draggable) this._listenDrag();
        else {
            this._dragCleanup();
            var t = this.getStage(),
            e = Kinetic.DD;
            t && e.node && e.node._id === this._id && e._endDrag()
        }
    },
    Kinetic.Node.prototype._dragCleanup = function() {
        this.off("mousedown.kinetic"),
        this.off("touchstart.kinetic")
    },
    Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable,
    Kinetic.Node.addGettersSetters(Kinetic.Node, ["dragBoundFunc", "dragOnTop"]);
    var t = document.getElementsByTagName("html")[0];
    t.addEventListener("mouseup", Kinetic.DD._endDrag, !0),
    t.addEventListener("touchend", Kinetic.DD._endDrag, !0)
} (),
function() {
    Kinetic.Transition = function(t, e) {
        function i(t, e, s, a) {
            for (var o in t)"duration" !== o && "easing" !== o && "callback" !== o && (Kinetic.Type._isObject(t[o]) ? (s[o] = {},
            i(t[o], e[o], s[o], a)) : n._add(n._getTween(e, o, t[o], s, a)))
        }
        var n = this,
        s = {};
        this.node = t,
        this.config = e,
        this.tweens = [],
        i(e, t.attrs, s, s),
        this.tweens[0].onStarted = function() {},
        this.tweens[0].onStopped = function() {
            t.transAnim.stop()
        },
        this.tweens[0].onResumed = function() {
            t.transAnim.start()
        },
        this.tweens[0].onLooped = function() {},
        this.tweens[0].onChanged = function() {},
        this.tweens[0].onFinished = function() {
            var i = {};
            for (var n in e)"duration" !== n && "easing" !== n && "callback" !== n && (i[n] = e[n]);
            t.transAnim.stop(),
            t.setAttrs(i),
            e.callback && e.callback()
        }
    },
    Kinetic.Transition.prototype = {
        start: function() {
            for (var t = 0; this.tweens.length > t; t++) this.tweens[t].start()
        },
        stop: function() {
            for (var t = 0; this.tweens.length > t; t++) this.tweens[t].stop()
        },
        resume: function() {
            for (var t = 0; this.tweens.length > t; t++) this.tweens[t].resume()
        },
        _onEnterFrame: function() {
            for (var t = 0; this.tweens.length > t; t++) this.tweens[t].onEnterFrame()
        },
        _add: function(t) {
            this.tweens.push(t)
        },
        _getTween: function(t, e, i, n, s) {
            var a = this.config,
            o = this.node,
            r = a.easing;
            void 0 === r && (r = "linear");
            var h = new Kinetic.Tween(o,
            function(t) {
                n[e] = t,
                o.setAttrs(s)
            },
            Kinetic.Tweens[r], t[e], i, a.duration);
            return h
        }
    },
    Kinetic.Node.prototype.transitionTo = function(t) {
        var e = new Kinetic.Transition(this, t);
        return this.transAnim || (this.transAnim = new Kinetic.Animation),
        this.transAnim.func = function() {
            e._onEnterFrame()
        },
        this.transAnim.node = "Stage" === this.nodeType ? this: this.getLayer(),
        e.start(),
        this.transAnim.start(),
        this.trans = e,
        e
    }
} (),
function() {
    Kinetic.Container = function(t) {
        this._containerInit(t)
    },
    Kinetic.Container.prototype = {
        _containerInit: function(t) {
            this.children = [],
            Kinetic.Node.call(this, t)
        },
        getChildren: function() {
            return this.children
        },
        removeChildren: function() {
            for (; this.children.length > 0;) this.children[0].remove()
        },
        add: function(t) {
            var e = (Kinetic.Global, this.children);
            return t.index = e.length,
            t.parent = this,
            e.push(t),
            this
        },
        get: function(t) {
            var e = new Kinetic.Collection;
            if ("#" === t.charAt(0)) {
                var i = this._getNodeById(t.slice(1));
                i && e.push(i)
            } else if ("." === t.charAt(0)) {
                var n = this._getNodesByName(t.slice(1));
                Kinetic.Collection.apply(e, n)
            } else {
                for (var s = [], a = this.getChildren(), o = a.length, r = 0; o > r; r++) s = s.concat(a[r]._get(t));
                Kinetic.Collection.apply(e, s)
            }
            return e
        },
        _getNodeById: function(t) {
            var e = (this.getStage(), Kinetic.Global),
            i = e.ids[t];
            return void 0 !== i && this.isAncestorOf(i) ? i: null
        },
        _getNodesByName: function(t) {
            var e = Kinetic.Global,
            i = e.names[t] || [];
            return this._getDescendants(i)
        },
        _get: function(t) {
            for (var e = Kinetic.Node.prototype._get.call(this, t), i = this.getChildren(), n = i.length, s = 0; n > s; s++) e = e.concat(i[s]._get(t));
            return e
        },
        toObject: function() {
            var t = Kinetic.Node.prototype.toObject.call(this);
            t.children = [];
            for (var e = this.getChildren(), i = e.length, n = 0; i > n; n++) {
                var s = e[n];
                t.children.push(s.toObject())
            }
            return t
        },
        _getDescendants: function(t) {
            for (var e = [], i = t.length, n = 0; i > n; n++) {
                var s = t[n];
                this.isAncestorOf(s) && e.push(s)
            }
            return e
        },
        isAncestorOf: function(t) {
            for (var e = t.getParent(); e;) {
                if (e._id === this._id) return ! 0;
                e = e.getParent()
            }
            return ! 1
        },
        clone: function(t) {
            var e = Kinetic.Node.prototype.clone.call(this, t);
            for (var i in this.children) e.add(this.children[i].clone());
            return e
        },
        getIntersections: function() {
            for (var t = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), e = [], i = this.get("Shape"), n = i.length, s = 0; n > s; s++) {
                var a = i[s];
                a.isVisible() && a.intersects(t) && e.push(a)
            }
            return e
        },
        _setChildrenIndices: function() {
            for (var t = this.children,
            e = t.length,
            i = 0; e > i; i++) t[i].index = i
        },
        draw: function() {
            this.drawScene(),
            this.drawHit()
        },
        drawScene: function(t) {
            if (this.isVisible()) for (var e = this.children,
            i = e.length,
            n = 0; i > n; n++) e[n].drawScene(t)
        },
        drawHit: function() {
            if (this.isVisible() && this.isListening()) for (var t = this.children,
            e = t.length,
            i = 0; e > i; i++) t[i].drawHit()
        }
    },
    Kinetic.Global.extend(Kinetic.Container, Kinetic.Node)
} (),
function() {
    function t(t) {
        t.fill()
    }
    function e(t) {
        t.stroke()
    }
    function i(t) {
        t.fill()
    }
    function n(t) {
        t.stroke()
    }
    Kinetic.Shape = function(t) {
        this._initShape(t)
    },
    Kinetic.Shape.prototype = {
        _initShape: function(s) {
            this.setDefaultAttrs({
                fillEnabled: !0,
                strokeEnabled: !0,
                shadowEnabled: !0,
                dashArrayEnabled: !0,
                fillPriority: "color"
            }),
            this.nodeType = "Shape",
            this._fillFunc = t,
            this._strokeFunc = e,
            this._fillFuncHit = i,
            this._strokeFuncHit = n;
            for (var a, o = Kinetic.Global.shapes;;) if (a = Kinetic.Type._getRandomColorKey(), a && !(a in o)) break;
            this.colorKey = a,
            o[a] = this,
            Kinetic.Node.call(this, s)
        },
        getContext: function() {
            return this.getLayer().getContext()
        },
        getCanvas: function() {
            return this.getLayer().getCanvas()
        },
        hasShadow: function() {
            return !! (this.getShadowColor() || this.getShadowBlur() || this.getShadowOffset())
        },
        hasFill: function() {
            return !! (this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientStartPoint() || this.getFillRadialGradientStartPoint())
        },
        _get: function(t) {
            return this.nodeType === t || this.shapeType === t ? [this] : []
        },
        intersects: function() {
            var t = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),
            e = this.getStage(),
            i = e.hitCanvas;
            i.clear(),
            this.drawScene(i);
            var n = i.context.getImageData(Math.round(t.x), Math.round(t.y), 1, 1).data;
            return n[3] > 0
        },
        enableFill: function() {
            this.setAttr("fillEnabled", !0)
        },
        disableFill: function() {
            this.setAttr("fillEnabled", !1)
        },
        enableStroke: function() {
            this.setAttr("strokeEnabled", !0)
        },
        disableStroke: function() {
            this.setAttr("strokeEnabled", !1)
        },
        enableShadow: function() {
            this.setAttr("shadowEnabled", !0)
        },
        disableShadow: function() {
            this.setAttr("shadowEnabled", !1)
        },
        enableDashArray: function() {
            this.setAttr("dashArrayEnabled", !0)
        },
        disableDashArray: function() {
            this.setAttr("dashArrayEnabled", !1)
        },
        remove: function() {
            Kinetic.Node.prototype.remove.call(this),
            delete Kinetic.Global.shapes[this.colorKey]
        },
        drawScene: function(t) {
            var e = this.attrs,
            i = e.drawFunc,
            t = t || this.getLayer().getCanvas(),
            n = t.getContext();
            i && this.isVisible() && (n.save(), t._applyOpacity(this), t._applyLineJoin(this), t._applyAncestorTransforms(this), i.call(this, t), n.restore())
        },
        drawHit: function() {
            var t = this.attrs,
            e = t.drawHitFunc || t.drawFunc,
            i = this.getLayer().hitCanvas,
            n = i.getContext();
            e && this.isVisible() && this.isListening() && (n.save(), i._applyLineJoin(this), i._applyAncestorTransforms(this), e.call(this, i), n.restore())
        },
        _setDrawFuncs: function() { ! this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc),
            !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
        }
    },
    Kinetic.Global.extend(Kinetic.Shape, Kinetic.Node),
    Kinetic.Node.addGettersSetters(Kinetic.Shape, ["stroke", "lineJoin", "lineCap", "strokeWidth", "drawFunc", "drawHitFunc", "dashArray", "shadowColor", "shadowBlur", "shadowOpacity", "fillPatternImage", "fill", "fillPatternX", "fillPatternY", "fillLinearGradientColorStops", "fillRadialGradientStartRadius", "fillRadialGradientEndRadius", "fillRadialGradientColorStops", "fillPatternRepeat", "fillEnabled", "strokeEnabled", "shadowEnabled", "dashArrayEnabled", "fillPriority"]),
    Kinetic.Node.addPointGettersSetters(Kinetic.Shape, ["fillPatternOffset", "fillPatternScale", "fillLinearGradientStartPoint", "fillLinearGradientEndPoint", "fillRadialGradientStartPoint", "fillRadialGradientEndPoint", "shadowOffset"]),
    Kinetic.Node.addRotationGettersSetters(Kinetic.Shape, ["fillPatternRotation"])
} (),
function() {
    Kinetic.Stage = function(t) {
        this._initStage(t)
    },
    Kinetic.Stage.prototype = {
        _initStage: function(t) {
            var e = Kinetic.DD;
            this.setDefaultAttrs({
                width: 400,
                height: 200
            }),
            Kinetic.Container.call(this, t),
            this._setStageDefaultProperties(),
            this._id = Kinetic.Global.idCounter++,
            this._buildDOM(),
            this._bindContentEvents(),
            Kinetic.Global.stages.push(this),
            e && e._initDragLayer(this)
        },
        setContainer: function(t) {
            "string" == typeof t && (t = document.getElementById(t)),
            this.setAttr("container", t)
        },
        setHeight: function(t) {
            Kinetic.Node.prototype.setHeight.call(this, t),
            this._resizeDOM()
        },
        setWidth: function(t) {
            Kinetic.Node.prototype.setWidth.call(this, t),
            this._resizeDOM()
        },
        clear: function() {
            for (var t = this.children,
            e = 0; t.length > e; e++) t[e].clear()
        },
        remove: function() {
            var t = this.content;
            Kinetic.Node.prototype.remove.call(this),
            t && Kinetic.Type._isInDocument(t) && this.attrs.container.removeChild(t)
        },
        reset: function() {
            this.removeChildren(),
            this._setStageDefaultProperties(),
            this.setAttrs(this.defaultNodeAttrs)
        },
        getMousePosition: function() {
            return this.mousePos
        },
        getTouchPosition: function() {
            return this.touchPos
        },
        getUserPosition: function() {
            return this.getTouchPosition() || this.getMousePosition()
        },
        getStage: function() {
            return this
        },
        getContent: function() {
            return this.content
        },
        toDataURL: function(t) {
            function e(s) {
                var a = h[s],
                c = a.toDataURL(),
                l = new Image;
                l.onload = function() {
                    r.drawImage(l, 0, 0),
                    h.length - 1 > s ? e(s + 1) : t.callback(o.toDataURL(i, n))
                },
                l.src = c
            }
            t = t || {};
            var i = t.mimeType || null,
            n = t.quality || null,
            s = t.x || 0,
            a = t.y || 0,
            o = new Kinetic.SceneCanvas(t.width || this.getWidth(), t.height || this.getHeight()),
            r = o.getContext(),
            h = this.children; (s || a) && r.translate( - 1 * s, -1 * a),
            e(0)
        },
        toImage: function(t) {
            var e = t.callback;
            t.callback = function(t) {
                Kinetic.Type._getImage(t,
                function(t) {
                    e(t)
                })
            },
            this.toDataURL(t)
        },
        getIntersection: function(t) {
            for (var e, i = this.getChildren(), n = i.length - 1; n >= 0; n--) {
                var s = i[n];
                if (s.isVisible() && s.isListening()) {
                    var a = s.hitCanvas.context.getImageData(Math.round(t.x), Math.round(t.y), 1, 1).data;
                    if (255 === a[3]) {
                        var o = Kinetic.Type._rgbToHex(a[0], a[1], a[2]);
                        return e = Kinetic.Global.shapes[o],
                        {
                            shape: e,
                            pixel: a
                        }
                    }
                    if (a[0] > 0 || a[1] > 0 || a[2] > 0 || a[3] > 0) return {
                        pixel: a
                    }
                }
            }
            return null
        },
        _resizeDOM: function() {
            if (this.content) {
                var t = this.attrs.width,
                e = this.attrs.height;
                this.content.style.width = t + "px",
                this.content.style.height = e + "px",
                this.bufferCanvas.setSize(t, e, 1),
                this.hitCanvas.setSize(t, e);
                for (var i = this.children,
                n = 0; i.length > n; n++) {
                    var s = i[n];
                    s.getCanvas().setSize(t, e),
                    s.hitCanvas.setSize(t, e),
                    s.draw()
                }
            }
        },
        add: function(t) {
            return Kinetic.Container.prototype.add.call(this, t),
            t.canvas.setSize(this.attrs.width, this.attrs.height),
            t.hitCanvas.setSize(this.attrs.width, this.attrs.height),
            t.draw(),
            this.content.appendChild(t.canvas.element),
            this
        },
        getDragLayer: function() {
            return this.dragLayer
        },
        _setUserPosition: function(t) {
            t || (t = window.event),
            this._setMousePosition(t),
            this._setTouchPosition(t)
        },
        _bindContentEvents: function() {
            Kinetic.Global;
            for (var t = this,
            e = ["mousedown", "mousemove", "mouseup", "mouseout", "touchstart", "touchmove", "touchend"], i = 0; e.length > i; i++) {
                var n = e[i]; (function() {
                    var e = n;
                    t.content.addEventListener(e,
                    function(i) {
                        t["_" + e](i)
                    },
                    !1)
                })()
            }
        },
        _mouseout: function(t) {
            this._setUserPosition(t);
            var e = Kinetic.DD,
            i = this.targetShape; ! i || e && e.moving || (i._handleEvent("mouseout", t), i._handleEvent("mouseleave", t), this.targetShape = null),
            this.mousePos = void 0
        },
        _mousemove: function(t) {
            this._setUserPosition(t);
            var e = Kinetic.DD,
            i = this.getIntersection(this.getUserPosition());
            if (i) {
                var n = i.shape;
                n && (e && e.moving || 255 !== i.pixel[3] || this.targetShape && this.targetShape._id === n._id ? n._handleEvent("mousemove", t) : (this.targetShape && (this.targetShape._handleEvent("mouseout", t, n), this.targetShape._handleEvent("mouseleave", t, n)), n._handleEvent("mouseover", t, this.targetShape), n._handleEvent("mouseenter", t, this.targetShape), this.targetShape = n))
            } else ! this.targetShape || e && e.moving || (this.targetShape._handleEvent("mouseout", t), this.targetShape._handleEvent("mouseleave", t), this.targetShape = null);
            e && e._drag(t)
        },
        _mousedown: function(t) {
            var e, i = Kinetic.DD;
            if (this._setUserPosition(t), e = this.getIntersection(this.getUserPosition()), e && e.shape) {
                var n = e.shape;
                this.clickStart = !0,
                n._handleEvent("mousedown", t)
            }
            i && this.attrs.draggable && !i.node && this._startDrag(t)
        },
        _mouseup: function(t) {
            this._setUserPosition(t);
            var e = this,
            i = Kinetic.DD,
            n = this.getIntersection(this.getUserPosition());
            if (n && n.shape) {
                var s = n.shape;
                s._handleEvent("mouseup", t),
                this.clickStart && (i && i.moving && i.node || (s._handleEvent("click", t), this.inDoubleClickWindow && s._handleEvent("dblclick", t), this.inDoubleClickWindow = !0, setTimeout(function() {
                    e.inDoubleClickWindow = !1
                },
                this.dblClickWindow)))
            }
            this.clickStart = !1
        },
        _touchstart: function(t) {
            var e, i = Kinetic.DD;
            if (this._setUserPosition(t), t.preventDefault(), e = this.getIntersection(this.getUserPosition()), e && e.shape) {
                var n = e.shape;
                this.tapStart = !0,
                n._handleEvent("touchstart", t)
            }
            i && this.attrs.draggable && !i.node && this._startDrag(t)
        },
        _touchend: function(t) {
            this._setUserPosition(t);
            var e = this,
            i = Kinetic.DD,
            n = this.getIntersection(this.getUserPosition());
            if (n && n.shape) {
                var s = n.shape;
                s._handleEvent("touchend", t),
                this.tapStart && (i && i.moving && i.node || (s._handleEvent("tap", t), this.inDoubleClickWindow && s._handleEvent("dbltap", t), this.inDoubleClickWindow = !0, setTimeout(function() {
                    e.inDoubleClickWindow = !1
                },
                this.dblClickWindow)))
            }
            this.tapStart = !1
        },
        _touchmove: function(t) {
            this._setUserPosition(t);
            var e = Kinetic.DD;
            t.preventDefault();
            var i = this.getIntersection(this.getUserPosition());
            if (i && i.shape) {
                var n = i.shape;
                n._handleEvent("touchmove", t)
            }
            e && e._drag(t)
        },
        _setMousePosition: function(t) {
            var e = t.clientX - this._getContentPosition().left,
            i = t.clientY - this._getContentPosition().top;
            this.mousePos = {
                x: e,
                y: i
            }
        },
        _setTouchPosition: function(t) {
            if (void 0 !== t.touches && 1 === t.touches.length) {
                var e = t.touches[0],
                i = e.clientX - this._getContentPosition().left,
                n = e.clientY - this._getContentPosition().top;
                this.touchPos = {
                    x: i,
                    y: n
                }
            }
        },
        _getContentPosition: function() {
            var t = this.content.getBoundingClientRect();
            return {
                top: t.top,
                left: t.left
            }
        },
        _buildDOM: function() {
            this.content = document.createElement("div"),
            this.content.style.position = "relative",
            this.content.style.display = "inline-block",
            this.content.className = "kineticjs-content",
            this.attrs.container.appendChild(this.content),
            this.bufferCanvas = new Kinetic.SceneCanvas,
            this.hitCanvas = new Kinetic.HitCanvas,
            this._resizeDOM()
        },
        _onContent: function(t, e) {
            for (var i = t.split(" "), n = 0; i.length > n; n++) {
                var s = i[n];
                this.content.addEventListener(s, e, !1)
            }
        },
        _setStageDefaultProperties: function() {
            this.nodeType = "Stage",
            this.dblClickWindow = 400,
            this.targetShape = null,
            this.mousePos = void 0,
            this.clickStart = !1,
            this.touchPos = void 0,
            this.tapStart = !1
        }
    },
    Kinetic.Global.extend(Kinetic.Stage, Kinetic.Container),
    Kinetic.Node.addGetters(Kinetic.Stage, ["container"])
} (),
function() {
    Kinetic.Layer = function(t) {
        this._initLayer(t)
    },
    Kinetic.Layer.prototype = {
        _initLayer: function(t) {
            this.setDefaultAttrs({
                clearBeforeDraw: !0
            }),
            this.nodeType = "Layer",
            this.beforeDrawFunc = void 0,
            this.afterDrawFunc = void 0,
            this.canvas = new Kinetic.SceneCanvas,
            this.canvas.getElement().style.position = "absolute",
            this.hitCanvas = new Kinetic.HitCanvas,
            Kinetic.Container.call(this, t)
        },
        draw: function() {
            this.getContext(),
            void 0 !== this.beforeDrawFunc && this.beforeDrawFunc.call(this),
            Kinetic.Container.prototype.draw.call(this),
            void 0 !== this.afterDrawFunc && this.afterDrawFunc.call(this)
        },
        drawHit: function() {
            this.hitCanvas.clear(),
            Kinetic.Container.prototype.drawHit.call(this)
        },
        drawScene: function(t) {
            t = t || this.getCanvas(),
            this.attrs.clearBeforeDraw && t.clear(),
            Kinetic.Container.prototype.drawScene.call(this, t)
        },
        toDataURL: function(t) {
            t = t || {};
            var e = t.mimeType || null,
            i = t.quality || null;
            return t.x || 0,
            t.y || 0,
            t.width || t.height || t.x || t.y ? Kinetic.Node.prototype.toDataURL.call(this, t) : this.getCanvas().toDataURL(e, i)
        },
        beforeDraw: function(t) {
            this.beforeDrawFunc = t
        },
        afterDraw: function(t) {
            this.afterDrawFunc = t
        },
        getCanvas: function() {
            return this.canvas
        },
        getContext: function() {
            return this.canvas.context
        },
        clear: function() {
            this.getCanvas().clear()
        },
        setVisible: function(t) {
            Kinetic.Node.prototype.setVisible.call(this, t),
            t ? (this.canvas.element.style.display = "block", this.hitCanvas.element.style.display = "block") : (this.canvas.element.style.display = "none", this.hitCanvas.element.style.display = "none")
        },
        setZIndex: function(t) {
            Kinetic.Node.prototype.setZIndex.call(this, t);
            var e = this.getStage();
            e && (e.content.removeChild(this.canvas.element), e.getChildren().length - 1 > t ? e.content.insertBefore(this.canvas.element, e.getChildren()[t + 1].canvas.element) : e.content.appendChild(this.canvas.element))
        },
        moveToTop: function() {
            Kinetic.Node.prototype.moveToTop.call(this);
            var t = this.getStage();
            t && (t.content.removeChild(this.canvas.element), t.content.appendChild(this.canvas.element))
        },
        moveUp: function() {
            if (Kinetic.Node.prototype.moveUp.call(this)) {
                var t = this.getStage();
                t && (t.content.removeChild(this.canvas.element), this.index < t.getChildren().length - 1 ? t.content.insertBefore(this.canvas.element, t.getChildren()[this.index + 1].canvas.element) : t.content.appendChild(this.canvas.element))
            }
        },
        moveDown: function() {
            if (Kinetic.Node.prototype.moveDown.call(this)) {
                var t = this.getStage();
                if (t) {
                    var e = t.getChildren();
                    t.content.removeChild(this.canvas.element),
                    t.content.insertBefore(this.canvas.element, e[this.index + 1].canvas.element)
                }
            }
        },
        moveToBottom: function() {
            if (Kinetic.Node.prototype.moveToBottom.call(this)) {
                var t = this.getStage();
                if (t) {
                    var e = t.getChildren();
                    t.content.removeChild(this.canvas.element),
                    t.content.insertBefore(this.canvas.element, e[1].canvas.element)
                }
            }
        },
        getLayer: function() {
            return this
        },
        remove: function() {
            var t = this.getStage(),
            e = this.canvas,
            i = e.element;
            Kinetic.Node.prototype.remove.call(this),
            t && e && Kinetic.Type._isInDocument(i) && t.content.removeChild(i)
        }
    },
    Kinetic.Global.extend(Kinetic.Layer, Kinetic.Container),
    Kinetic.Node.addGettersSetters(Kinetic.Layer, ["clearBeforeDraw"])
} (),
function() {
    Kinetic.Group = function(t) {
        this._initGroup(t)
    },
    Kinetic.Group.prototype = {
        _initGroup: function(t) {
            this.nodeType = "Group",
            Kinetic.Container.call(this, t)
        }
    },
    Kinetic.Global.extend(Kinetic.Group, Kinetic.Container)
} (),
function() {
    Kinetic.Rect = function(t) {
        this._initRect(t)
    },
    Kinetic.Rect.prototype = {
        _initRect: function(t) {
            this.setDefaultAttrs({
                width: 0,
                height: 0,
                cornerRadius: 0
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Rect",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext();
            e.beginPath();
            var i = this.getCornerRadius(),
            n = this.getWidth(),
            s = this.getHeight();
            0 === i ? e.rect(0, 0, n, s) : (e.moveTo(i, 0), e.lineTo(n - i, 0), e.arc(n - i, i, i, 3 * Math.PI / 2, 0, !1), e.lineTo(n, s - i), e.arc(n - i, s - i, i, 0, Math.PI / 2, !1), e.lineTo(i, s), e.arc(i, s - i, i, Math.PI / 2, Math.PI, !1), e.lineTo(0, i), e.arc(i, i, i, Math.PI, 3 * Math.PI / 2, !1)),
            e.closePath(),
            t.fillStroke(this)
        }
    },
    Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Rect, ["cornerRadius"])
} (),
function() {
    Kinetic.Circle = function(t) {
        this._initCircle(t)
    },
    Kinetic.Circle.prototype = {
        _initCircle: function(t) {
            this.setDefaultAttrs({
                radius: 0
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Circle",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext();
            e.beginPath(),
            e.arc(0, 0, this.getRadius(), 0, 2 * Math.PI, !0),
            e.closePath(),
            t.fillStroke(this)
        },
        getWidth: function() {
            return 2 * this.getRadius()
        },
        getHeight: function() {
            return 2 * this.getRadius()
        },
        setWidth: function(t) {
            Kinetic.Node.prototype.setWidth.call(this, t),
            this.setRadius(t / 2)
        },
        setHeight: function(t) {
            Kinetic.Node.prototype.setHeight.call(this, t),
            this.setRadius(t / 2)
        }
    },
    Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Circle, ["radius"])
} (),
function() {
    Kinetic.Wedge = function(t) {
        this._initWedge(t)
    },
    Kinetic.Wedge.prototype = {
        _initWedge: function(t) {
            this.setDefaultAttrs({
                radius: 0,
                angle: 0,
                clockwise: !1
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Wedge",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext();
            e.beginPath(),
            e.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise()),
            e.lineTo(0, 0),
            e.closePath(),
            t.fillStroke(this)
        },
        setAngleDeg: function(t) {
            this.setAngle(Kinetic.Type._degToRad(t))
        },
        getAngleDeg: function() {
            return Kinetic.Type._radToDeg(this.getAngle())
        }
    },
    Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Wedge, ["radius", "angle", "clockwise"])
} (),
function() {
    Kinetic.Ellipse = function(t) {
        this._initEllipse(t)
    },
    Kinetic.Ellipse.prototype = {
        _initEllipse: function(t) {
            this.setDefaultAttrs({
                radius: {
                    x: 0,
                    y: 0
                }
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Ellipse",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext(),
            i = this.getRadius();
            e.beginPath(),
            e.save(),
            i.x !== i.y && e.scale(1, i.y / i.x),
            e.arc(0, 0, i.x, 0, 2 * Math.PI, !0),
            e.restore(),
            e.closePath(),
            t.fillStroke(this)
        },
        getWidth: function() {
            return 2 * this.getRadius().x
        },
        getHeight: function() {
            return 2 * this.getRadius().y
        },
        setWidth: function(t) {
            Kinetic.Node.prototype.setWidth.call(this, t),
            this.setRadius({
                x: t / 2
            })
        },
        setHeight: function(t) {
            Kinetic.Node.prototype.setHeight.call(this, t),
            this.setRadius({
                y: t / 2
            })
        }
    },
    Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape),
    Kinetic.Node.addPointGettersSetters(Kinetic.Ellipse, ["radius"])
} (),
function() {
    Kinetic.Image = function(t) {
        this._initImage(t)
    },
    Kinetic.Image.prototype = {
        _initImage: function(t) {
            Kinetic.Shape.call(this, t),
            this.shapeType = "Image",
            this._setDrawFuncs();
            var e = this;
            this.on("imageChange",
            function() {
                e._syncSize()
            }),
            this._syncSize()
        },
        drawFunc: function(t) {
            var e, i = this.getWidth(),
            n = this.getHeight(),
            s = this,
            a = t.getContext();
            if (a.beginPath(), a.rect(0, 0, i, n), a.closePath(), t.fillStroke(this), this.attrs.image) {
                if (this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height) {
                    var o = this.attrs.crop.x || 0,
                    r = this.attrs.crop.y || 0,
                    h = this.attrs.crop.width,
                    c = this.attrs.crop.height;
                    e = [this.attrs.image, o, r, h, c, 0, 0, i, n]
                } else e = [this.attrs.image, 0, 0, i, n];
                this.hasShadow() ? t.applyShadow(this,
                function() {
                    s._drawImage(a, e)
                }) : this._drawImage(a, e)
            }
        },
        drawHitFunc: function(t) {
            var e = this.getWidth(),
            i = this.getHeight(),
            n = this.imageHitRegion,
            s = t.getContext();
            n ? (s.drawImage(n, 0, 0, e, i), s.beginPath(), s.rect(0, 0, e, i), s.closePath(), t.stroke(this)) : (s.beginPath(), s.rect(0, 0, e, i), s.closePath(), t.fillStroke(this))
        },
        applyFilter: function(t, e, i) {
            var n = new Kinetic.Canvas(this.attrs.image.width, this.attrs.image.height),
            s = n.getContext();
            s.drawImage(this.attrs.image, 0, 0);
            try {
                var a = s.getImageData(0, 0, n.getWidth(), n.getHeight());
                t(a, e);
                var o = this;
                Kinetic.Type._getImage(a,
                function(t) {
                    o.setImage(t),
                    i && i()
                })
            } catch(r) {
                Kinetic.Global.warn("Unable to apply filter. " + r.message)
            }
        },
        setCrop: function() {
            var t = [].slice.call(arguments),
            e = Kinetic.Type._getXY(t),
            i = Kinetic.Type._getSize(t),
            n = Kinetic.Type._merge(e, i);
            this.setAttr("crop", Kinetic.Type._merge(n, this.getCrop()))
        },
        createImageHitRegion: function(t) {
            var e = new Kinetic.Canvas(this.attrs.width, this.attrs.height),
            i = e.getContext();
            i.drawImage(this.attrs.image, 0, 0);
            try {
                for (var n = i.getImageData(0, 0, e.getWidth(), e.getHeight()), s = n.data, a = Kinetic.Type._hexToRgb(this.colorKey), o = 0, r = s.length; r > o; o += 4) s[o] = a.r,
                s[o + 1] = a.g,
                s[o + 2] = a.b;
                var h = this;
                Kinetic.Type._getImage(n,
                function(e) {
                    h.imageHitRegion = e,
                    t && t()
                })
            } catch(c) {
                Kinetic.Global.warn("Unable to create image hit region. " + c.message)
            }
        },
        clearImageHitRegion: function() {
            delete this.imageHitRegion
        },
        _syncSize: function() {
            this.attrs.image && (this.attrs.width || this.setWidth(this.attrs.image.width), this.attrs.height || this.setHeight(this.attrs.image.height))
        },
        _drawImage: function(t, e) {
            5 === e.length ? t.drawImage(e[0], e[1], e[2], e[3], e[4]) : 9 === e.length && t.drawImage(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8])
        }
    },
    Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Image, ["image"]),
    Kinetic.Node.addGetters(Kinetic.Image, ["crop"])
} (),
function() {
    Kinetic.Polygon = function(t) {
        this._initPolygon(t)
    },
    Kinetic.Polygon.prototype = {
        _initPolygon: function(t) {
            this.setDefaultAttrs({
                points: []
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Polygon",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext(),
            i = this.getPoints(),
            n = i.length;
            e.beginPath(),
            e.moveTo(i[0].x, i[0].y);
            for (var s = 1; n > s; s++) e.lineTo(i[s].x, i[s].y);
            e.closePath(),
            t.fillStroke(this)
        },
        setPoints: function(t) {
            this.setAttr("points", Kinetic.Type._getPoints(t))
        }
    },
    Kinetic.Global.extend(Kinetic.Polygon, Kinetic.Shape),
    Kinetic.Node.addGetters(Kinetic.Polygon, ["points"])
} (),
function() {
    function t(t) {
        t.fillText(this.partialText, 0, 0)
    }
    function e(t) {
        t.strokeText(this.partialText, 0, 0)
    }
    var i = "auto",
    s = "Calibri",
    a = "canvas",
    o = "center",
    r = "Change.kinetic",
    h = "2d",
    c = "\n",
    l = "",
    u = "left",
    d = "\n",
    g = "text",
    f = "Text",
    p = "top",
    m = "middle",
    v = "normal",
    y = "px ",
    b = " ",
    w = "right",
    x = ["fontFamily", "fontSize", "fontStyle", "padding", "align", "lineHeight", "text", "width", "height"],
    _ = x.length;
    Kinetic.Text = function(t) {
        this._initText(t)
    },
    Kinetic.Text.prototype = {
        _initText: function(n) {
            var o = this;
            this.setDefaultAttrs({
                fontFamily: s,
                text: l,
                fontSize: 12,
                align: u,
                verticalAlign: p,
                fontStyle: v,
                padding: 0,
                width: i,
                height: i,
                lineHeight: 1
            }),
            this.dummyCanvas = document.createElement(a),
            Kinetic.Shape.call(this, n),
            this._fillFunc = t,
            this._strokeFunc = e,
            this.shapeType = f,
            this._setDrawFuncs();
            for (var h = 0; _ > h; h++) this.on(x[h] + r, o._setTextData);
            this._setTextData()
        },
        drawFunc: function(t) {
            var e = t.getContext(),
            i = this.getPadding(),
            n = this.getFontStyle(),
            s = this.getFontSize(),
            a = this.getFontFamily(),
            r = this.getTextHeight(),
            h = this.getLineHeight() * r,
            c = this.textArr,
            l = c.length,
            d = this.getWidth();
            e.font = n + b + s + y + a,
            e.textBaseline = m,
            e.textAlign = u,
            e.save(),
            e.translate(i, 0),
            e.translate(0, i + r / 2);
            for (var g = 0; l > g; g++) {
                var f = c[g],
                p = f.text,
                v = f.width;
                e.save(),
                this.getAlign() === w ? e.translate(d - v - 2 * i, 0) : this.getAlign() === o && e.translate((d - v - 2 * i) / 2, 0),
                this.partialText = p,
                t.fillStroke(this),
                e.restore(),
                e.translate(0, h)
            }
            e.restore()
        },
        drawHitFunc: function(t) {
            var e = t.getContext(),
            i = this.getWidth(),
            n = this.getHeight();
            e.beginPath(),
            e.rect(0, 0, i, n),
            e.closePath(),
            t.fillStroke(this)
        },
        setText: function(t) {
            var e = Kinetic.Type._isString(t) ? t: "" + t;
            this.setAttr(g, e)
        },
        getWidth: function() {
            return this.attrs.width === i ? this.getTextWidth() + 2 * this.getPadding() : this.attrs.width
        },
        getHeight: function() {
            return this.attrs.height === i ? this.getTextHeight() * this.textArr.length * this.attrs.lineHeight + 2 * this.attrs.padding: this.attrs.height
        },
        getTextWidth: function() {
            return this.textWidth
        },
        getTextHeight: function() {
            return this.textHeight
        },
        _getTextSize: function(t) {
            var e, i = this.dummyCanvas,
            n = i.getContext(h),
            s = this.getFontSize();
            return n.save(),
            n.font = this.getFontStyle() + b + s + y + this.getFontFamily(),
            e = n.measureText(t),
            n.restore(),
            {
                width: e.width,
                height: parseInt(s, 10)
            }
        },
        _expandTextData: function(t) {
            var e = t.length;
            for (n = 0, text = l, newArr = [], n = 0; e > n; n++) text = t[n],
            newArr.push({
                text: text,
                width: this._getTextSize(text).width
            });
            return newArr
        },
        _setTextData: function() {
            var t = this.getText().split(l),
            e = [],
            n = 0;
            for (addLine = !0, lineHeightPx = 0, padding = this.getPadding(), this.textWidth = 0, this.textHeight = this._getTextSize(this.getText()).height, lineHeightPx = this.getLineHeight() * this.textHeight; t.length > 0 && addLine && (this.attrs.height === i || this.attrs.height - 2 * padding > lineHeightPx * (n + 1));) {
                var s = 0,
                a = void 0;
                for (addLine = !1; t.length > s;) {
                    if (t.indexOf(d) === s) {
                        t.splice(s, 1),
                        a = t.splice(0, s).join(l);
                        break
                    }
                    var o = t.slice(0, s);
                    if (this.attrs.width !== i && this._getTextSize(o.join(l)).width > this.attrs.width - 2 * padding) {
                        if (0 == s) break;
                        var r = o.lastIndexOf(b),
                        h = o.lastIndexOf(c),
                        u = Math.max(r, h);
                        if (u >= 0) {
                            a = t.splice(0, 1 + u).join(l);
                            break
                        }
                        a = t.splice(0, s).join(l);
                        break
                    }
                    s++,
                    s === t.length && (a = t.splice(0, s).join(l))
                }
                this.textWidth = Math.max(this.textWidth, this._getTextSize(a).width),
                void 0 !== a && (e.push(a), addLine = !0),
                n++
            }
            this.textArr = this._expandTextData(e)
        }
    },
    Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Text, ["fontFamily", "fontSize", "fontStyle", "padding", "align", "lineHeight"]),
    Kinetic.Node.addGetters(Kinetic.Text, [g])
} (),
function() {
    Kinetic.Line = function(t) {
        this._initLine(t)
    },
    Kinetic.Line.prototype = {
        _initLine: function(t) {
            this.setDefaultAttrs({
                points: [],
                lineCap: "butt"
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Line",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = this.getPoints(),
            i = e.length,
            n = t.getContext();
            n.beginPath(),
            n.moveTo(e[0].x, e[0].y);
            for (var s = 1; i > s; s++) {
                var a = e[s];
                n.lineTo(a.x, a.y)
            }
            t.stroke(this)
        },
        setPoints: function(t) {
            this.setAttr("points", Kinetic.Type._getPoints(t))
        }
    },
    Kinetic.Global.extend(Kinetic.Line, Kinetic.Shape),
    Kinetic.Node.addGetters(Kinetic.Line, ["points"])
} (),
function() {
    Kinetic.Spline = function(t) {
        this._initSpline(t)
    },
    Kinetic.Spline._getControlPoints = function(t, e, i, n) {
        var s = t.x,
        a = t.y,
        o = e.x,
        r = e.y,
        h = i.x,
        c = i.y,
        l = Math.sqrt(Math.pow(o - s, 2) + Math.pow(r - a, 2)),
        u = Math.sqrt(Math.pow(h - o, 2) + Math.pow(c - r, 2)),
        d = n * l / (l + u),
        g = n * u / (l + u),
        f = o - d * (h - s),
        p = r - d * (c - a),
        m = o + g * (h - s),
        v = r + g * (c - a);
        return [{
            x: f,
            y: p
        },
        {
            x: m,
            y: v
        }]
    },
    Kinetic.Spline.prototype = {
        _initSpline: function(t) {
            this.setDefaultAttrs({
                tension: 1
            }),
            Kinetic.Line.call(this, t),
            this.shapeType = "Spline"
        },
        drawFunc: function(t) {
            var e = this.getPoints(),
            i = e.length,
            n = t.getContext(),
            s = this.getTension();
            if (n.beginPath(), n.moveTo(e[0].x, e[0].y), 0 !== s && i > 2) {
                var a = this.allPoints,
                o = a.length;
                n.quadraticCurveTo(a[0].x, a[0].y, a[1].x, a[1].y);
                for (var r = 2; o - 1 > r;) n.bezierCurveTo(a[r].x, a[r++].y, a[r].x, a[r++].y, a[r].x, a[r++].y);
                n.quadraticCurveTo(a[o - 1].x, a[o - 1].y, e[i - 1].x, e[i - 1].y)
            } else for (var r = 1; i > r; r++) {
                var h = e[r];
                n.lineTo(h.x, h.y)
            }
            t.stroke(this)
        },
        setPoints: function(t) {
            Kinetic.Line.prototype.setPoints.call(this, t),
            this._setAllPoints()
        },
        setTension: function(t) {
            this.setAttr("tension", t),
            this._setAllPoints()
        },
        _setAllPoints: function() {
            for (var t = this.getPoints(), e = t.length, i = this.getTension(), n = [], s = 1; e - 1 > s; s++) {
                var a = Kinetic.Spline._getControlPoints(t[s - 1], t[s], t[s + 1], i);
                n.push(a[0]),
                n.push(t[s]),
                n.push(a[1])
            }
            this.allPoints = n
        }
    },
    Kinetic.Global.extend(Kinetic.Spline, Kinetic.Line),
    Kinetic.Node.addGetters(Kinetic.Spline, ["tension"])
} (),
function() {
    Kinetic.Blob = function(t) {
        this._initBlob(t)
    },
    Kinetic.Blob.prototype = {
        _initBlob: function(t) {
            Kinetic.Spline.call(this, t),
            this.shapeType = "Blob"
        },
        drawFunc: function(t) {
            var e = this.getPoints(),
            i = e.length,
            n = t.getContext(),
            s = this.getTension();
            if (n.beginPath(), n.moveTo(e[0].x, e[0].y), 0 !== s && i > 2) for (var a = this.allPoints,
            o = a.length,
            r = 0; o - 1 > r;) n.bezierCurveTo(a[r].x, a[r++].y, a[r].x, a[r++].y, a[r].x, a[r++].y);
            else for (var r = 1; i > r; r++) {
                var h = e[r];
                n.lineTo(h.x, h.y)
            }
            n.closePath(),
            t.fillStroke(this)
        },
        _setAllPoints: function() {
            var t = this.getPoints(),
            e = t.length,
            i = this.getTension(),
            n = Kinetic.Spline._getControlPoints(t[e - 1], t[0], t[1], i),
            s = Kinetic.Spline._getControlPoints(t[e - 2], t[e - 1], t[0], i);
            Kinetic.Spline.prototype._setAllPoints.call(this),
            this.allPoints.unshift(n[1]),
            this.allPoints.push(s[0]),
            this.allPoints.push(t[e - 1]),
            this.allPoints.push(s[1]),
            this.allPoints.push(n[0]),
            this.allPoints.push(t[0])
        }
    },
    Kinetic.Global.extend(Kinetic.Blob, Kinetic.Spline)
} (),
function() {
    Kinetic.Sprite = function(t) {
        this._initSprite(t)
    },
    Kinetic.Sprite.prototype = {
        _initSprite: function(t) {
            this.setDefaultAttrs({
                index: 0,
                frameRate: 17
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Sprite",
            this._setDrawFuncs(),
            this.anim = new Kinetic.Animation;
            var e = this;
            this.on("animationChange",
            function() {
                e.setIndex(0)
            })
        },
        drawFunc: function(t) {
            var e = this.attrs.animation,
            i = this.attrs.index,
            n = this.attrs.animations[e][i],
            s = t.getContext(),
            a = this.attrs.image;
            a && s.drawImage(a, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height)
        },
        drawHitFunc: function(t) {
            var e = this.attrs.animation,
            i = this.attrs.index,
            n = this.attrs.animations[e][i],
            s = t.getContext();
            s.beginPath(),
            s.rect(0, 0, n.width, n.height),
            s.closePath(),
            t.fill(this)
        },
        start: function() {
            var t = this,
            e = this.getLayer();
            this.anim.node = e,
            this.lastTime = (new Date).getTime(),
            this.interval = setInterval(function() {
                var e = t.attrs.index,
                i = (new Date).getTime(),
                n = i - t.lastTime,
                s = Math.floor(Math.max(1, t.attrs.frameRate * n / 1e3));
                t.lastTime = i,
                t._updateIndex(s),
                t.afterFrameFunc && e + s >= t.afterFrameIndex && (t.afterFrameFunc(), delete t.afterFrameFunc, delete t.afterFrameIndex)
            },
            1e3 / this.attrs.frameRate),
            this.anim.start()
        },
        stop: function() {
            this.anim.stop(),
            clearInterval(this.interval)
        },
        afterFrame: function(t, e) {
            this.afterFrameIndex = t,
            this.afterFrameFunc = e
        },
        _updateIndex: function(t) {
            var e = this.attrs.index,
            i = this.attrs.animation;
            this.attrs.index = (e + t) % this.attrs.animations[i].length
        }
    },
    Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Sprite, ["animation", "animations", "index"])
} (),
function() {
    Kinetic.Star = function(t) {
        this._initStar(t)
    },
    Kinetic.Star.prototype = {
        _initStar: function(t) {
            this.setDefaultAttrs({
                numPoints: 0,
                innerRadius: 0,
                outerRadius: 0
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "Star",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext(),
            i = this.attrs.innerRadius,
            n = this.attrs.outerRadius,
            s = this.attrs.numPoints;
            e.beginPath(),
            e.moveTo(0, 0 - this.attrs.outerRadius);
            for (var a = 1; 2 * s > a; a++) {
                var o = 0 === a % 2 ? n: i,
                r = o * Math.sin(a * Math.PI / s),
                h = -1 * o * Math.cos(a * Math.PI / s);
                e.lineTo(r, h)
            }
            e.closePath(),
            t.fillStroke(this)
        }
    },
    Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.Star, ["numPoints", "innerRadius", "outerRadius"])
} (),
function() {
    Kinetic.RegularPolygon = function(t) {
        this._initRegularPolygon(t)
    },
    Kinetic.RegularPolygon.prototype = {
        _initRegularPolygon: function(t) {
            this.setDefaultAttrs({
                radius: 0,
                sides: 0
            }),
            Kinetic.Shape.call(this, t),
            this.shapeType = "RegularPolygon",
            this._setDrawFuncs()
        },
        drawFunc: function(t) {
            var e = t.getContext(),
            i = this.attrs.sides,
            n = this.attrs.radius;
            e.beginPath(),
            e.moveTo(0, 0 - n);
            for (var s = 1; i > s; s++) {
                var a = n * Math.sin(2 * s * Math.PI / i),
                o = -1 * n * Math.cos(2 * s * Math.PI / i);
                e.lineTo(a, o)
            }
            e.closePath(),
            t.fillStroke(this)
        }
    },
    Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ["radius", "sides"])
} (),
function() {
    Kinetic.Path = function(t) {
        this._initPath(t)
    },
    Kinetic.Path.prototype = {
        _initPath: function(t) {
            this.dataArray = [];
            var e = this;
            Kinetic.Shape.call(this, t),
            this.shapeType = "Path",
            this._setDrawFuncs(),
            this.dataArray = Kinetic.Path.parsePathData(this.attrs.data),
            this.on("dataChange",
            function() {
                e.dataArray = Kinetic.Path.parsePathData(e.attrs.data)
            })
        },
        drawFunc: function(t) {
            var e = this.dataArray,
            i = t.getContext();
            i.beginPath();
            for (var n = 0; e.length > n; n++) {
                var s = e[n].command,
                a = e[n].points;
                switch (s) {
                case "L":
                    i.lineTo(a[0], a[1]);
                    break;
                case "M":
                    i.moveTo(a[0], a[1]);
                    break;
                case "C":
                    i.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
                    break;
                case "Q":
                    i.quadraticCurveTo(a[0], a[1], a[2], a[3]);
                    break;
                case "A":
                    var o = a[0],
                    r = a[1],
                    h = a[2],
                    c = a[3],
                    l = a[4],
                    u = a[5],
                    d = a[6],
                    g = a[7],
                    f = h > c ? h: c,
                    p = h > c ? 1 : h / c,
                    m = h > c ? c / h: 1;
                    i.translate(o, r),
                    i.rotate(d),
                    i.scale(p, m),
                    i.arc(0, 0, f, l, l + u, 1 - g),
                    i.scale(1 / p, 1 / m),
                    i.rotate( - d),
                    i.translate( - o, -r);
                    break;
                case "z":
                    i.closePath()
                }
            }
            t.fillStroke(this)
        }
    },
    Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape),
    Kinetic.Path.getLineLength = function(t, e, i, n) {
        return Math.sqrt((i - t) * (i - t) + (n - e) * (n - e))
    },
    Kinetic.Path.getPointOnLine = function(t, e, i, n, s, a, o) {
        void 0 === a && (a = e),
        void 0 === o && (o = i);
        var r = (s - i) / (n - e + 1e-8),
        h = Math.sqrt(t * t / (1 + r * r));
        e > n && (h *= -1);
        var c, l = r * h;
        if ((o - i) / (a - e + 1e-8) === r) c = {
            x: a + h,
            y: o + l
        };
        else {
            var u, d, g = this.getLineLength(e, i, n, s);
            if (1e-8 > g) return void 0;
            var f = (a - e) * (n - e) + (o - i) * (s - i);
            f /= g * g,
            u = e + f * (n - e),
            d = i + f * (s - i);
            var p = this.getLineLength(a, o, u, d),
            m = Math.sqrt(t * t - p * p);
            h = Math.sqrt(m * m / (1 + r * r)),
            e > n && (h *= -1),
            l = r * h,
            c = {
                x: u + h,
                y: d + l
            }
        }
        return c
    },
    Kinetic.Path.getPointOnCubicBezier = function(t, e, i, n, s, a, o, r, h) {
        function c(t) {
            return t * t * t
        }
        function l(t) {
            return 3 * t * t * (1 - t)
        }
        function u(t) {
            return 3 * t * (1 - t) * (1 - t)
        }
        function d(t) {
            return (1 - t) * (1 - t) * (1 - t)
        }
        var g = r * c(t) + a * l(t) + n * u(t) + e * d(t),
        f = h * c(t) + o * l(t) + s * u(t) + i * d(t);
        return {
            x: g,
            y: f
        }
    },
    Kinetic.Path.getPointOnQuadraticBezier = function(t, e, i, n, s, a, o) {
        function r(t) {
            return t * t
        }
        function h(t) {
            return 2 * t * (1 - t)
        }
        function c(t) {
            return (1 - t) * (1 - t)
        }
        var l = a * r(t) + n * h(t) + e * c(t),
        u = o * r(t) + s * h(t) + i * c(t);
        return {
            x: l,
            y: u
        }
    },
    Kinetic.Path.getPointOnEllipticalArc = function(t, e, i, n, s, a) {
        var o = Math.cos(a),
        r = Math.sin(a),
        h = {
            x: i * Math.cos(s),
            y: n * Math.sin(s)
        };
        return {
            x: t + (h.x * o - h.y * r),
            y: e + (h.x * r + h.y * o)
        }
    },
    Kinetic.Path.parsePathData = function(t) {
        if (!t) return [];
        var e = t,
        i = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"];
        e = e.replace(RegExp(" ", "g"), ",");
        for (var n = 0; i.length > n; n++) e = e.replace(RegExp(i[n], "g"), "|" + i[n]);
        for (var s = e.split("|"), a = [], o = 0, r = 0, n = 1; s.length > n; n++) {
            var h = s[n],
            c = h.charAt(0);
            h = h.slice(1),
            h = h.replace(RegExp(",-", "g"), "-"),
            h = h.replace(RegExp("-", "g"), ",-"),
            h = h.replace(RegExp("e,-", "g"), "e-");
            var l = h.split(",");
            l.length > 0 && "" === l[0] && l.shift();
            for (var u = 0; l.length > u; u++) l[u] = parseFloat(l[u]);
            for (; l.length > 0 && !isNaN(l[0]);) {
                var d = null,
                g = [],
                f = o,
                p = r;
                switch (c) {
                case "l":
                    o += l.shift(),
                    r += l.shift(),
                    d = "L",
                    g.push(o, r);
                    break;
                case "L":
                    o = l.shift(),
                    r = l.shift(),
                    g.push(o, r);
                    break;
                case "m":
                    o += l.shift(),
                    r += l.shift(),
                    d = "M",
                    g.push(o, r),
                    c = "l";
                    break;
                case "M":
                    o = l.shift(),
                    r = l.shift(),
                    d = "M",
                    g.push(o, r),
                    c = "L";
                    break;
                case "h":
                    o += l.shift(),
                    d = "L",
                    g.push(o, r);
                    break;
                case "H":
                    o = l.shift(),
                    d = "L",
                    g.push(o, r);
                    break;
                case "v":
                    r += l.shift(),
                    d = "L",
                    g.push(o, r);
                    break;
                case "V":
                    r = l.shift(),
                    d = "L",
                    g.push(o, r);
                    break;
                case "C":
                    g.push(l.shift(), l.shift(), l.shift(), l.shift()),
                    o = l.shift(),
                    r = l.shift(),
                    g.push(o, r);
                    break;
                case "c":
                    g.push(o + l.shift(), r + l.shift(), o + l.shift(), r + l.shift()),
                    o += l.shift(),
                    r += l.shift(),
                    d = "C",
                    g.push(o, r);
                    break;
                case "S":
                    var m = o,
                    v = r,
                    y = a[a.length - 1];
                    "C" === y.command && (m = o + (o - y.points[2]), v = r + (r - y.points[3])),
                    g.push(m, v, l.shift(), l.shift()),
                    o = l.shift(),
                    r = l.shift(),
                    d = "C",
                    g.push(o, r);
                    break;
                case "s":
                    var m = o,
                    v = r,
                    y = a[a.length - 1];
                    "C" === y.command && (m = o + (o - y.points[2]), v = r + (r - y.points[3])),
                    g.push(m, v, o + l.shift(), r + l.shift()),
                    o += l.shift(),
                    r += l.shift(),
                    d = "C",
                    g.push(o, r);
                    break;
                case "Q":
                    g.push(l.shift(), l.shift()),
                    o = l.shift(),
                    r = l.shift(),
                    g.push(o, r);
                    break;
                case "q":
                    g.push(o + l.shift(), r + l.shift()),
                    o += l.shift(),
                    r += l.shift(),
                    d = "Q",
                    g.push(o, r);
                    break;
                case "T":
                    var m = o,
                    v = r,
                    y = a[a.length - 1];
                    "Q" === y.command && (m = o + (o - y.points[0]), v = r + (r - y.points[1])),
                    o = l.shift(),
                    r = l.shift(),
                    d = "Q",
                    g.push(m, v, o, r);
                    break;
                case "t":
                    var m = o,
                    v = r,
                    y = a[a.length - 1];
                    "Q" === y.command && (m = o + (o - y.points[0]), v = r + (r - y.points[1])),
                    o += l.shift(),
                    r += l.shift(),
                    d = "Q",
                    g.push(m, v, o, r);
                    break;
                case "A":
                    var b = l.shift(),
                    w = l.shift(),
                    x = l.shift(),
                    _ = l.shift(),
                    S = l.shift(),
                    C = o,
                    P = r;
                    o = l.shift(),
                    r = l.shift(),
                    d = "A",
                    g = this.convertEndpointToCenterParameterization(C, P, o, r, _, S, b, w, x);
                    break;
                case "a":
                    var b = l.shift(),
                    w = l.shift(),
                    x = l.shift(),
                    _ = l.shift(),
                    S = l.shift(),
                    C = o,
                    P = r;
                    o += l.shift(),
                    r += l.shift(),
                    d = "A",
                    g = this.convertEndpointToCenterParameterization(C, P, o, r, _, S, b, w, x)
                }
                a.push({
                    command: d || c,
                    points: g,
                    start: {
                        x: f,
                        y: p
                    },
                    pathLength: this.calcLength(f, p, d || c, g)
                })
            } ("z" === c || "Z" === c) && a.push({
                command: "z",
                points: [],
                start: void 0,
                pathLength: 0
            })
        }
        return a
    },
    Kinetic.Path.calcLength = function(e, i, n, s) {
        var a, o, r, h = Kinetic.Path;
        switch (n) {
        case "L":
            return h.getLineLength(e, i, s[0], s[1]);
        case "C":
            for (a = 0, o = h.getPointOnCubicBezier(0, e, i, s[0], s[1], s[2], s[3], s[4], s[5]), t = .01; 1 >= t; t += .01) r = h.getPointOnCubicBezier(t, e, i, s[0], s[1], s[2], s[3], s[4], s[5]),
            a += h.getLineLength(o.x, o.y, r.x, r.y),
            o = r;
            return a;
        case "Q":
            for (a = 0, o = h.getPointOnQuadraticBezier(0, e, i, s[0], s[1], s[2], s[3]), t = .01; 1 >= t; t += .01) r = h.getPointOnQuadraticBezier(t, e, i, s[0], s[1], s[2], s[3]),
            a += h.getLineLength(o.x, o.y, r.x, r.y),
            o = r;
            return a;
        case "A":
            a = 0;
            var c = s[4],
            l = s[5],
            u = s[4] + l,
            d = Math.PI / 180;
            if (d > Math.abs(c - u) && (d = Math.abs(c - u)), o = h.getPointOnEllipticalArc(s[0], s[1], s[2], s[3], c, 0), 0 > l) for (t = c - d; t > u; t -= d) r = h.getPointOnEllipticalArc(s[0], s[1], s[2], s[3], t, 0),
            a += h.getLineLength(o.x, o.y, r.x, r.y),
            o = r;
            else for (t = c + d; u > t; t += d) r = h.getPointOnEllipticalArc(s[0], s[1], s[2], s[3], t, 0),
            a += h.getLineLength(o.x, o.y, r.x, r.y),
            o = r;
            return r = h.getPointOnEllipticalArc(s[0], s[1], s[2], s[3], u, 0),
            a += h.getLineLength(o.x, o.y, r.x, r.y)
        }
        return 0
    },
    Kinetic.Path.convertEndpointToCenterParameterization = function(t, e, i, n, s, a, o, r, h) {
        var c = h * (Math.PI / 180),
        l = Math.cos(c) * (t - i) / 2 + Math.sin(c) * (e - n) / 2,
        u = -1 * Math.sin(c) * (t - i) / 2 + Math.cos(c) * (e - n) / 2,
        d = l * l / (o * o) + u * u / (r * r);
        d > 1 && (o *= Math.sqrt(d), r *= Math.sqrt(d));
        var g = Math.sqrt((o * o * r * r - o * o * u * u - r * r * l * l) / (o * o * u * u + r * r * l * l));
        s == a && (g *= -1),
        isNaN(g) && (g = 0);
        var f = g * o * u / r,
        p = g * -r * l / o,
        m = (t + i) / 2 + Math.cos(c) * f - Math.sin(c) * p,
        v = (e + n) / 2 + Math.sin(c) * f + Math.cos(c) * p,
        y = function(t) {
            return Math.sqrt(t[0] * t[0] + t[1] * t[1])
        },
        b = function(t, e) {
            return (t[0] * e[0] + t[1] * e[1]) / (y(t) * y(e))
        },
        w = function(t, e) {
            return (t[0] * e[1] < t[1] * e[0] ? -1 : 1) * Math.acos(b(t, e))
        },
        x = w([1, 0], [(l - f) / o, (u - p) / r]),
        _ = [(l - f) / o, (u - p) / r],
        S = [( - 1 * l - f) / o, ( - 1 * u - p) / r],
        C = w(_, S);
        return - 1 >= b(_, S) && (C = Math.PI),
        b(_, S) >= 1 && (C = 0),
        0 === a && C > 0 && (C -= 2 * Math.PI),
        1 == a && 0 > C && (C += 2 * Math.PI),
        [m, v, o, r, x, C, c, a]
    },
    Kinetic.Node.addGettersSetters(Kinetic.Path, ["data"])
} (),
function() {
    function t(t) {
        t.fillText(this.partialText, 0, 0)
    }
    function e(t) {
        t.strokeText(this.partialText, 0, 0)
    }
    Kinetic.TextPath = function(t) {
        this._initTextPath(t)
    },
    Kinetic.TextPath.prototype = {
        _initTextPath: function(i) {
            this.setDefaultAttrs({
                fontFamily: "Calibri",
                fontSize: 12,
                fontStyle: "normal",
                text: ""
            }),
            this.dummyCanvas = document.createElement("canvas"),
            this.dataArray = [];
            var n = this;
            Kinetic.Shape.call(this, i),
            this._fillFunc = t,
            this._strokeFunc = e,
            this.shapeType = "TextPath",
            this._setDrawFuncs(),
            this.dataArray = Kinetic.Path.parsePathData(this.attrs.data),
            this.on("dataChange",
            function() {
                n.dataArray = Kinetic.Path.parsePathData(this.attrs.data)
            });
            for (var s = ["text", "textStroke", "textStrokeWidth"], a = 0; s.length > a; a++) {
                var o = s[a];
                this.on(o + "Change", n._setTextData)
            }
            n._setTextData()
        },
        drawFunc: function(t) {
            var e = (this.charArr, t.getContext());
            e.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily,
            e.textBaseline = "middle",
            e.textAlign = "left",
            e.save();
            for (var i = this.glyphInfo,
            n = 0; i.length > n; n++) {
                e.save();
                var s = i[n].p0;
                i[n].p1,
                parseFloat(this.attrs.fontSize),
                e.translate(s.x, s.y),
                e.rotate(i[n].rotation),
                this.partialText = i[n].text,
                t.fillStroke(this),
                e.restore()
            }
            e.restore()
        },
        getTextWidth: function() {
            return this.textWidth
        },
        getTextHeight: function() {
            return this.textHeight
        },
        setText: function(t) {
            Kinetic.Text.prototype.setText.call(this, t)
        },
        _getTextSize: function(t) {
            var e = this.dummyCanvas,
            i = e.getContext("2d");
            i.save(),
            i.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
            var n = i.measureText(t);
            return i.restore(),
            {
                width: n.width,
                height: parseInt(this.attrs.fontSize, 10)
            }
        },
        _setTextData: function() {
            var t = this,
            e = this._getTextSize(this.attrs.text);
            this.textWidth = e.width,
            this.textHeight = e.height,
            this.glyphInfo = [];
            for (var i, n, s, a = this.attrs.text.split(""), o = -1, r = 0, h = function() {
                r = 0;
                for (var e = t.dataArray,
                n = o + 1; e.length > n; n++) {
                    if (e[n].pathLength > 0) return o = n,
                    e[n];
                    "M" == e[n].command && (i = {
                        x: e[n].points[0],
                        y: e[n].points[1]
                    })
                }
                return {}
            },
            c = function(e) {
                var a = t._getTextSize(e).width,
                o = 0,
                c = 0;
                for (n = void 0; Math.abs(a - o) / a > .01 && 25 > c;) {
                    c++;
                    for (var l = o; void 0 === s;) s = h(),
                    s && a > l + s.pathLength && (l += s.pathLength, s = void 0);
                    if (s === {} || void 0 === i) return void 0;
                    var u = !1;
                    switch (s.command) {
                    case "L":
                        Kinetic.Path.getLineLength(i.x, i.y, s.points[0], s.points[1]) > a ? n = Kinetic.Path.getPointOnLine(a, i.x, i.y, s.points[0], s.points[1], i.x, i.y) : s = void 0;
                        break;
                    case "A":
                        var d = s.points[4],
                        g = s.points[5],
                        f = s.points[4] + g;
                        0 === r ? r = d + 1e-8: a > o ? r += Math.PI / 180 * g / Math.abs(g) : r -= Math.PI / 360 * g / Math.abs(g),
                        Math.abs(r) > Math.abs(f) && (r = f, u = !0),
                        n = Kinetic.Path.getPointOnEllipticalArc(s.points[0], s.points[1], s.points[2], s.points[3], r, s.points[6]);
                        break;
                    case "C":
                        0 === r ? r = a > s.pathLength ? 1e-8: a / s.pathLength: a > o ? r += (a - o) / s.pathLength: r -= (o - a) / s.pathLength,
                        r > 1 && (r = 1, u = !0),
                        n = Kinetic.Path.getPointOnCubicBezier(r, s.start.x, s.start.y, s.points[0], s.points[1], s.points[2], s.points[3], s.points[4], s.points[5]);
                        break;
                    case "Q":
                        0 === r ? r = a / s.pathLength: a > o ? r += (a - o) / s.pathLength: r -= (o - a) / s.pathLength,
                        r > 1 && (r = 1, u = !0),
                        n = Kinetic.Path.getPointOnQuadraticBezier(r, s.start.x, s.start.y, s.points[0], s.points[1], s.points[2], s.points[3])
                    }
                    void 0 !== n && (o = Kinetic.Path.getLineLength(i.x, i.y, n.x, n.y)),
                    u && (u = !1, s = void 0)
                }
            },
            l = 0; a.length > l && (c(a[l]), void 0 !== i && void 0 !== n); l++) {
                var u = Kinetic.Path.getLineLength(i.x, i.y, n.x, n.y),
                d = 0,
                g = Kinetic.Path.getPointOnLine(d + u / 2, i.x, i.y, n.x, n.y),
                f = Math.atan2(n.y - i.y, n.x - i.x);
                this.glyphInfo.push({
                    transposeX: g.x,
                    transposeY: g.y,
                    text: a[l],
                    rotation: f,
                    p0: i,
                    p1: n
                }),
                i = n
            }
        }
    },
    Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape),
    Kinetic.Node.addGettersSetters(Kinetic.TextPath, ["fontFamily", "fontSize", "fontStyle"]),
    Kinetic.Node.addGetters(Kinetic.TextPath, ["text"])
} (),
define("snack/audiomanager", ["snack/platform"],
function(t) {
    var e = {};
    return e = function(t) {
        return arguments.callee._singletonInstance ? arguments.callee._singletonInstance: (arguments.callee._singletonInstance = this, this._initAudioManager(t), void 0)
    },
    e.prototype = {
        _initAudioManager: function(e) {
            this.format = t._isiPad || t._isiPhone || t._isiPod ? "aac": "mp3",
            this.sfxEnabled = "false" !== localStorage.bh2sfx,
            this.musicEnabled = "false" !== localStorage.bh2music,
            this.webAudio = !1;
            try {
                this.webAudio = webkitAudioContext || !1
            } catch(i) {}
            if (this.sounds = {},
            this.webAudio) this.audioContext = new webkitAudioContext,
            e.onready && e.onready();
            else {
                var n = document.createElement("script");
                n.type = "text/javascript",
                n.async = !0,
                n.src = "js/soundmanager/script/soundmanager2-nodebug-jsmin.js",
                n.onload = function() {
                    setTimeout(function() {
                        soundManager.setup({
                            url: "js/soundmanager/swf",
                            flashVersion: 9,
                            preferFlash: !1,
                            useFlashBlock: !1,
                            onready: function() {
                                e.onready && e.onready()
                            }
                        })
                    },
                    10)
                };
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(n, s)
            }
        },
        loadMusic: function(t) {
            this.webAudio ? (this.music = new Audio, this.music.setAttribute("loop", "loop"), this.music.setAttribute("src", t.url + "." + this.format), this.music.load()) : this.createSound({
                id: "_music",
                url: t.url
            })
        },
        playMusic: function() {
            if (this.musicEnabled) if (this.webAudio && this.music) this.music.play();
            else {
                var t = function() {
                    soundManager.play("_music", {
                        onfinish: function() {
                            t()
                        }
                    })
                };
                t()
            }
        },
        pauseMusic: function() {
            this.webAudio ? this.music && this.music.pause() : soundManager.pause("_music")
        },
        setFormat: function(t) {
            this.format = t
        },
        loadSounds: function(t, e, i) {
            for (var n = t.length,
            s = 0; t.length > 0;) {
                var a = t.pop();
                this.createSound({
                    id: a.id,
                    url: a.url,
                    volume: a.volume,
                    autoLoad: a.autoLoad,
                    onLoad: function() {++s === n ? (e(s, n), i()) : e(s, n)
                    }
                })
            }
        },
        createSound: function(t) {
            if (this.webAudio) {
                var e = this,
                i = new XMLHttpRequest;
                i.open("GET", t.url + "." + this.format, !0),
                i.responseType = "arraybuffer",
                i.onload = function() {
                    e.audioContext.decodeAudioData(i.response,
                    function(i) {
                        e.sounds[t.id] = {
                            sound: i,
                            volume: void 0 !== t.volume ? t.volume: 100
                        },
                        t.onLoad && t.onLoad()
                    })
                },
                i.send()
            } else this.sounds[t.id] = {},
            this.sounds[t.id].volume = void 0 !== t.volume ? t.volume: 100,
            this.sounds[t.id].sound = soundManager.createSound({
                id: t.id,
                autoLoad: !0,
                url: t.url + "." + this.format,
                onload: function() {
                    t.onLoad && t.onLoad()
                }
            })
        },
        playSound: function(t, e) {
            if (this.isSfxEnabled()) {
                var i = {};
                if (i.volume = e && e.volume ? e.volume: 100, this.webAudio) {
                    if (this.sounds[t]) {
                        var n = this.audioContext.createBufferSource(),
                        s = this.audioContext.createGainNode();
                        n.buffer = this.sounds[t].sound,
                        n.connect(s),
                        s.connect(this.audioContext.destination),
                        s.gain.value = (i.volume || this.sounds[t].volume) / 100,
                        n.noteOn(0)
                    }
                } else soundManager.play(t, i)
            }
        },
        setSfxEnabled: function(t) {
            this.sfxEnabled = t,
            localStorage && (localStorage.bh2sfx = t ? "true": "false")
        },
        isSfxEnabled: function() {
            return this.sfxEnabled && !t.isCrapAudio()
        },
        setMusicEnabled: function(t) {
            this.musicEnabled = t,
            localStorage && (localStorage.bh2music = t ? "true": "false"),
            this.musicEnabled ? this.playMusic() : this.pauseMusic()
        },
        isMusicEnabled: function() {
            return this.musicEnabled
        }
    },
    e
}),
define("snack/stats", ["kinetic/kinetic"],
function(t) {
    var e = {};
    return e = function(t) {
        this._initStats(t)
    },
    e.prototype = {
        _initStats: function(e) {
            t.Container.call(this, e),
            this.background = new t.Rect({
                fill: "#333333",
                width: 80,
                height: 30
            }),
            this.add(this.background),
            this.fpsDisplay = new t.Text({
                x: 10,
                y: 10,
                width: 60,
                text: "0 fps",
                fontSize: 16,
                fontFamily: "Calibri",
                fill: "white",
                align: "left",
                visible: !0
            }),
            this.add(this.fpsDisplay),
            this.rateSamples = [],
            this.sampleCount = 0
        },
        showFrameRate: function(e) {
            var i = this;
            e ? (this.fpsAnimation || (this.fpsAnimation = new t.Animation(function(t) {
                i.rateSamples[i.sampleCount % 60] = 60 >= t.frameRate ? t.frameRate: 60,
                i.sampleCount++;
                var e = 0;
                for (var n in i.rateSamples) e += i.rateSamples[n];
                e /= 60 > i.sampleCount ? i.sampleCount: 60,
                i.fpsDisplay.setText(Math.round(e) + " fps")
            },
            this)), this.fpsDisplay.visible = !0, this.fpsAnimation.start()) : (this.fpsAnimation.stop(), this.fpsDisplay.visible = !1)
        }
    },
    t.Global.extend(e, t.Container),
    e
}),
define("snack/textutils", [],
function() {
    var t = {};
    return t = function(t) {
        this._initTextUtils(t)
    },
    t.prototype = {
        _initTextUtils: function() {
            this._thousandsSep = ","
        },
        formatInt: function(t) {
            return t > 999 ? this.formatInt(Math.floor(t / 1e3)) + this._thousandsSep + this.zeroPad(t % 1e3) : t + ""
        },
        zeroPad: function(t) {
            var e = "";
            return 100 > t && (e += "0"),
            10 > t && (e += "0"),
            e += t
        }
    },
    t
}),
define("snack/highscores", ["snack/textutils"],
function(t) {
    var e = {};
    return e = function(t) {
        this._initHighScores(t)
    },
    e.prototype = {
        _initHighScores: function() {
            this.textUtils = new t({
                locale: "en"
            }),
            this.numScores = 10,
            this.scores = [];
            for (var e = 0; this.numScores > e; ++e) {
                var i = localStorage["score" + e];
                i && this.scores.push(parseInt(i))
            }
        },
        _test: function() {
            this.clearScores();
            for (var t = 0; 20 > t; ++t) {
                var e = Math.floor(1e6 * Math.random());
                this.postScore(e)
            }
        },
        postScore: function(t) {
            this.scores.push(t),
            this.scores.sort(function(t, e) {
                return e - t
            }),
            this.scores = this.scores.slice(0, this.numScores),
            this._save();
            for (var e = -1,
            i = 0; this.scores.length > i; ++i) if (t === this.scores[i]) {
                e = i + 1;
                break
            }
            return e
        },
        _save: function() {
            for (var t = 0; this.scores.length > t; ++t) localStorage["score" + t] = this.scores[t]
        },
        clearScores: function() {
            for (var t = 0; this.scores.length > t; ++t) localStorage.removeItem("score" + t);
            this.scores = []
        },
        getScores: function() {
            return this.scores
        },
        _dumpScores: function() {
            console.log(""),
            console.log("highscores"),
            console.log("----------");
            for (var t = 0; this.scores.length > t; ++t) console.log(t + 1 + ". " + this.textUtils.formatInt(parseInt(this.scores[t])))
        }
    },
    e
}),
define("bh2/audioconfig", {
    dir: "assets/audio/",
    music: {
        file: "bub_music_bg",
        volume: 10
    },
    shoot: {
        file: "10_whoosh",
        volume: 100
    },
    impact: {
        file: "bub_impact",
        volume: 100
    },
    wallimpact: {
        file: "bub_wall_hit",
        volume: 100
    },
    pop3: {
        file: "bub_pop_3",
        volume: 100
    },
    pop4: {
        file: "bub_pop_4",
        volume: 100
    },
    pop5: {
        file: "bub_pop_5",
        volume: 100
    },
    pop6: {
        file: "bub_pop_6",
        volume: 100
    },
    pop7: {
        file: "bub_pop_7",
        volume: 100
    },
    pop8: {
        file: "bub_pop_8",
        volume: 100
    },
    pop9: {
        file: "bub_pop_9",
        volume: 100
    },
    popBig: {
        file: "bub_pop_big",
        volume: 80
    },
    popBigger: {
        file: "bub_pop_bigger",
        volume: 80
    },
    popBiggest: {
        file: "bub_pop_biggest",
        volume: 80
    },
    bubbleSwap: {
        file: "bub_color_swap",
        volume: 100
    },
    negative: {
        file: "bub_neg_sound",
        volume: 100
    },
    rowSpawn: {
        file: "bub_new_row",
        volume: 100
    },
    buttonClick: {
        file: "bub_button_click",
        volume: 100
    },
    dialogSlideIn: {
        file: "bub_menu_up",
        volume: 100
    },
    dialogSlideOut: {
        file: "bub_menu_down",
        volume: 100
    },
    zinger: {
        file: "bub_win",
        volume: 100
    },
    dinger: {
        file: "bub_lose",
        volume: 100
    }
}),
define("bh2/layout", [],
function() {
    var t = {};
    return t = {
        logo: {
            x: 9,
            y: -10
        },
        boardBorder: {
            x: 0,
            y: 0
        },
        boardBackground: {
            x: 32,
            y: 140
        },
        board: {
            x: 44,
            y: 190
        },
        shootThreshold: {
            y: 1800
        },
        rowMeter: {
            x: 118,
            y: 82
        },
        shooter: {
            x: 768,
            y: 1970
        },
        nextBubbleHolder: {
            x: -595,
            y: -120
        },
        shooterMask: {
            x: -265,
            y: -73
        },
        missesLabel: {
            x: 0,
            y: 20
        },
        scoreLabel: {
            x: 630,
            y: 12
        },
        switchButton: {
            x: 15,
            y: 1825
        },
        optionsButton: {
            x: 1261,
            y: 1825
        },
        muteButton: {
            x: 1124,
            y: 1810
        },
        deathline: {
            x: 30,
            y: 1440
        },
        optionsMenu: {
            show: {
                x: 0,
                y: 1024
            },
            hide: {
                x: 0,
                y: 2008
            },
            close: {
                x: 1270,
                y: 798
            },
            sfx: {
                x: 410,
                y: 120
            },
            music: {
                x: 826,
                y: 120
            },
            help: {
                x: 1030,
                y: 430
            },
            menu: {
                x: 618,
                y: 430
            },
            restart: {
                x: 206,
                y: 430
            }
        },
        mainMenu: {
            logo: {
                x: 294.5,
                y: 200
            },
            play: {
                x: 603,
                y: 1e3
            },
            scores: {
                x: 603,
                y: 1350
            },
            portal: {
                x: 512,
                y: 1740
            }
        },
        highScores: {
            roster: {
                x: 130,
                y: 100
            },
            clear: {
                x: 663,
                y: 1520
            },
            refresh: {
                x: 663,
                y: 1520
            },
            menu: {
                x: 210,
                y: 1600
            },
            play: {
                x: 1024,
                y: 1600
            }
        },
        howToPlay: {
            shooting: {
                x: 260,
                y: 163
            },
            powerups: {
                x: 218,
                y: 168
            },
            prev: {
                x: 206,
                y: 1625
            },
            play: {
                x: 603,
                y: 1625
            },
            next: {
                x: 1030,
                y: 1625
            }
        }
    }
}),
define("snack/imagehelper", ["kinetic/kinetic", "snack/platform", "snack/assetmanager"],
function(t, e, i) {
    var n = {};
    return n.makeImage = function(n) {
        var s = i().getImage(n.name);
        return s ? s.data ? new t.Image({
            x: n.x || 0,
            y: n.y || 0,
            image: s.image,
            crop: {
                x: s.data.frame.x,
                y: s.data.frame.y,
                width: s.data.frame.w,
                height: s.data.frame.h
            },
            width: s.data.frame.w,
            height: s.data.frame.h,
            scale: {
                x: 1 / e.devicePixelRatio,
                y: 1 / e.devicePixelRatio
            },
            listening: n.listening || !1
        }) : new t.Image({
            x: n.x || 0,
            y: n.y || 0,
            image: s.image,
            scale: {
                x: 1 / e.devicePixelRatio,
                y: 1 / e.devicePixelRatio
            },
            listening: !1
        }) : null
    },
    n
}),
define("bh2/piececolor", [],
function() {
    return {
        NONE: 0,
        RED: 1,
        GREEN: 2,
        BLUE: 3,
        VIOLET: 4,
        YELLOW: 5,
        WHITE: 6,
        NCOLORS: 6,
        RED_BOMB: 101,
        GREEN_BOMB: 102,
        BLUE_BOMB: 103,
        VIOLET_BOMB: 104,
        YELLOW_BOMB: 105,
        WHITE_BOMB: 106,
        AREA_BOMB: 200,
        X_BOMB: 300
    }
}),
define("bh2/boardslot", ["bh2/piececolor"],
function(t) {
    var e = {};
    return e = function(t, e) {
        this._initGamePiece(t, e)
    },
    e.prototype = {
        row: 0,
        col: 0,
        gamePiece: null,
        orphan: !1,
        _initGamePiece: function(t, e) {
            this.row = t,
            this.col = e
        },
        setPiece: function(t) {
            this.gamePiece = t
        },
        getPiece: function() {
            return this.gamePiece
        },
        isFilled: function() {
            return null !== this.gamePiece
        },
        getColor: function() {
            return this.isFilled() ? this.gamePiece.getColor() : t.NONE
        },
        clear: function() {
            this.gamePiece = null
        },
        setOrphan: function(t) {
            this.orphan = t
        },
        getOrphan: function() {
            return this.orphan
        }
    },
    e
}),
define("bh2/gamepiece", ["kinetic/kinetic", "bh2/piececolor"],
function(t, e) {
    var i = {};
    return i = function(t) {
        this._initGamePiece(t)
    },
    i.prototype = {
        color: e.NONE,
        _initGamePiece: function(e) {
            this.config = e,
            this.color = e.color,
            this.maxFrames = 9,
            t.Sprite.call(this, e)
        },
        getColor: function() {
            return this.color
        },
        isPowerup: function() {
            return this.color > e.NCOLORS
        },
        shrink: function(t) {
            var e = this.getX() + this.getWidth(),
            i = this.getY() + this.getHeight();
            this.transitionTo({
                duration: 1,
                scale: {
                    x: 0,
                    y: 0
                },
                x: e,
                y: i,
                easing: "ease-in",
                callback: function() {
                    t()
                }
            })
        },
        explode: function(t) {
            this.setAnimation("explode"),
            this.afterFrame(8,
            function() {
                t()
            }),
            this.start()
        }
    },
    t.Global.extend(i, t.Sprite),
    i
}),
define("bh2/bubblefactory", ["kinetic/kinetic", "snack/platform", "snack/assetmanager", "snack/textutils", "bh2/piececolor", "bh2/gamepiece"],
function(t, e, i, n, s, a) {
    var o = {};
    return o = function(t) {
        this._initBubbleFactory(t)
    },
    o.prototype = {
        _expFrames: 9,
        _indexToImageBase: ["blank", "bbl_red", "bbl_grn", "bbl_blu", "bbl_yel", "bbl_vio", "bbl_wht"],
        _indexToPowerupImageBase: ["blank", "pwrup_red", "pwrup_grn", "pwrup_blu", "pwrup_yel", "pwrup_vio", "pwrup_wht"],
        _initBubbleFactory: function() {
            this.textUtils = new n({
                locale: "en"
            })
        },
        makeBubble: function(t) {
            if (t != s.NONE && s.NCOLORS >= t) {
                var n = this._indexToImageBase[t],
                o = {};
                o.explode = [];
                for (var r = n + "_explode",
                h = 0; this._expFrames > h; ++h) {
                    var c = this.textUtils.zeroPad(h),
                    l = i().getImage(r + "_" + c + ".png");
                    l || (c = this.textUtils.zeroPad(h + 1), l = i().getImage(n + "_" + c + ".png")),
                    l && o.explode.push({
                        x: l.data.frame.x,
                        y: l.data.frame.y,
                        width: l.data.frame.w,
                        height: l.data.frame.h
                    })
                }
                return new a({
                    color: t,
                    animation: "explode",
                    animations: o,
                    frameRate: 30,
                    image: l.image,
                    listening: !1,
                    scale: {
                        x: 1 / e.devicePixelRatio,
                        y: 1 / e.devicePixelRatio
                    }
                })
            }
            return null
        },
        makeColorBomb: function(t) {
            if (t != s.NONE && s.NCOLORS >= t) {
                var n, o, r = this._indexToImageBase[t],
                h = this._indexToPowerupImageBase[t],
                c = {};
                for (c.blink = [], n = 0; 2 > n; ++n) {
                    o = this.textUtils.zeroPad(n);
                    var l = i().getImage(h + "_" + o + ".png");
                    if (l) for (var u = 0; 7 > u; ++u) c.blink.push({
                        x: l.data.frame.x,
                        y: l.data.frame.y,
                        width: l.data.frame.w,
                        height: l.data.frame.h
                    })
                }
                c.explode = [];
                var d = r + "_explode";
                for (n = 0; this._expFrames > n; ++n) {
                    o = this.textUtils.zeroPad(n);
                    var g = i().getImage(d + "_" + o + ".png");
                    g && c.explode.push({
                        x: g.data.frame.x,
                        y: g.data.frame.y,
                        width: g.data.frame.w,
                        height: g.data.frame.h
                    })
                }
                return new a({
                    color: 100 + t,
                    animation: "blink",
                    animations: c,
                    frameRate: 30,
                    image: l.image,
                    listening: !1,
                    scale: {
                        x: 1 / e.devicePixelRatio,
                        y: 1 / e.devicePixelRatio
                    }
                })
            }
            return null
        },
        makeAreaBomb: function() {
            var t, n, o = "pwrup_blk",
            r = {};
            for (r.sparkle = [], t = 0; 8 > t; ++t) {
                n = this.textUtils.zeroPad(t);
                var h = i().getImage(o + "_" + n + ".png");
                h && r.sparkle.push({
                    x: h.data.frame.x,
                    y: h.data.frame.y,
                    width: h.data.frame.w,
                    height: h.data.frame.h
                })
            }
            r.explode = [];
            var c = "bbl_yel_explode";
            for (t = 0; this._expFrames > t; ++t) {
                n = this.textUtils.zeroPad(t);
                var l = i().getImage(c + "_" + n + ".png");
                l && r.explode.push({
                    x: l.data.frame.x,
                    y: l.data.frame.y,
                    width: l.data.frame.w,
                    height: l.data.frame.h
                })
            }
            return new a({
                color: s.AREA_BOMB,
                animation: "sparkle",
                animations: r,
                frameRate: 30,
                image: h.image,
                listening: !1,
                scale: {
                    x: 1 / e.devicePixelRatio,
                    y: 1 / e.devicePixelRatio
                }
            })
        },
        makeXBomb: function() {
            var t, n, o = "pwrup_crisscross",
            r = {};
            for (r.sparkle = [], t = 0; 8 > t; ++t) {
                n = this.textUtils.zeroPad(t);
                var h = i().getImage(o + "_" + n + ".png");
                h && r.sparkle.push({
                    x: h.data.frame.x,
                    y: h.data.frame.y,
                    width: h.data.frame.w,
                    height: h.data.frame.h
                })
            }
            r.explode = [];
            var c = "bbl_vio_explode";
            for (t = 0; this._expFrames > t; ++t) {
                n = this.textUtils.zeroPad(t);
                var l = i().getImage(c + "_" + n + ".png");
                l && r.explode.push({
                    x: l.data.frame.x,
                    y: l.data.frame.y,
                    width: l.data.frame.w,
                    height: l.data.frame.h
                })
            }
            return new a({
                color: s.X_BOMB,
                animation: "sparkle",
                animations: r,
                frameRate: 30,
                image: h.image,
                listening: !1,
                scale: {
                    x: 1 / e.devicePixelRatio,
                    y: 1 / e.devicePixelRatio
                }
            })
        },
        makeBubbleOrBomb: function(t) {
            return t === s.X_BOMB ? this.makeXBomb() : t === s.AREA_BOMB ? this.makeAreaBomb() : t > 100 ? this.makeColorBomb(t - 100) : this.makeBubble(t)
        }
    },
    o
}),
define("snack/button", ["kinetic/kinetic", "snack/platform", "snack/assetmanager", "snack/audiomanager"],
function(t, e, i, n) {
    var s = {};
    return s = function(t) {
        this._initButton(t)
    },
    s.prototype = {
        _initButton: function(n) {
            t.Container.call(this, n),
            this.active = !0,
            this.action = n.action,
            this.images = {};
            var s = i().getImage(n.name + "1.png"),
            a = i().getImage(n.name + "2.png");
            this.images["default"] = [{
                x: s.data.frame.x,
                y: s.data.frame.y,
                width: s.data.frame.w,
                height: s.data.frame.h
            }],
            this.images.hover = [{
                x: a.data.frame.x,
                y: a.data.frame.y,
                width: a.data.frame.w,
                height: a.data.frame.h
            }],
            this.sprite = new t.Sprite({
                animation: "default",
                animations: this.images,
                frameRate: 0,
                image: s.image,
                listening: !0,
                scale: {
                    x: 1 / e.devicePixelRatio,
                    y: 1 / e.devicePixelRatio
                }
            }),
            this.add(this.sprite);
            var o = this;
            this.on("mouseover",
            function() {
                o.sprite.setAnimation("hover"),
                o.getLayer().draw()
            }),
            this.on("mouseout",
            function() {
                o.sprite.setAnimation("default"),
                o.getLayer().draw()
            }),
            this.on(e.getClickAction(),
            function() {
                o.doAction()
            })
        },
        doAction: function() {
            n().playSound("buttonClick"),
            this.action && this.action()
        },
        isActive: function() {
            return this.active
        },
        setActive: function(t) {
            this.active = t
        }
    },
    t.Global.extend(s, t.Container),
    s
});
var SEEN = 4096;
define("bh2/boardmodel", ["bh2/piececolor", "bh2/balance"],
function(t, e) {
    var n = {};
    return n = function(t) {
        this._initBoardModel(t)
    },
    n.prototype = {
        _initBoardModel: function(t) {
            this.nRows = t.nRows,
            this.nCols = t.nCols,
            this.nStartRows = t.nStartRows,
            this.nColors = t.nColors,
            this.colorsRemaining = [];
            for (var e = 0; this.nColors >= e; ++e) this.colorsRemaining.push(1);
            this.board = [];
            var i, n, s, a;
            for (i = 0; this.nRows > i; ++i) {
                for (a = [], n = 0; this.nCols > n; ++n) this.nStartRows > i ? (s = this._getRandomColor(), this.colorsRemaining[s] += 1, a.push(s)) : a.push(0);
                this.board.push(a)
            }
        },
        getColorsRemaining: function() {
            for (var t = 0,
            e = 1; this.nColors >= e; ++e) this.colorsRemaining[e] > 0 && t++;
            return t
        },
        getBubblesRemaining: function() {
            var t, e, i = 0;
            for (t = 0; this.nRows > t; ++t) for (e = 0; this.nCols > e; ++e) 0 !== this.board[t][e] && i++;
            return i
        },
        addRow: function(t) {
            var e = [];
            for (i = 0; t > i; ++i) {
                for (var n = [], s = 0; this.nCols > s; ++s) n.push(this._getRandomColor());
                this.board.splice(0, 0, n),
                this._popOrphans(e)
            }
            return e
        },
        addBubble: function(e, i, n) {
            var s;
            if (n > t.NCOLORS) if (t.AREA_BOMB > n) {
                var a = n - 100;
                s = this._popColorBomb(e, i, a)
            } else n === t.AREA_BOMB ? s = this._popAreaBomb(e, i) : n === t.X_BOMB && (s = this._popXBomb(e, i));
            else s = this._pop(e, i, n);
            return s.length > 0 && this._popOrphans(s),
            s
        },
        isWinCondition: function() {
            for (var t = 0,
            e = 0; this.nColors >= e; ++e) t += this.colorsRemaining[e];
            return 0 === t
        },
        isLossCondition: function() {
            for (var t = this.nRows - 1,
            e = 0; this.nCols > e; ++e) if (!this.isEmpty(t, e)) return ! 0;
            return ! 1
        },
        isEmpty: function(t, e) {
            return 0 === this.board[t][e]
        },
        getMaxRowOccupied: function() {
            var t, e;
            for (t = this.nRows - 1; t >= 0; --t) for (e = 0; this.nCols > e; ++e) if (0 !== this.board[t][e]) return t;
            return - 1
        },
        _runTests: function() {
            this._dumpBoard();
            var t = 1e4;
            console.log("Adding " + t + " bubbles");
            for (var e = (new Date).getTime(), i = 0, n = 0; t > n; ++n) i += this._unitTest();
            console.log("Elapsed " + ((new Date).getTime() - e)),
            console.log("For " + i + " pops"),
            this._dumpBoard()
        },
        _unitTest: function() {
            var t, e, i;
            for (t = 0, e = Math.floor(Math.random() * this.nCols), i = this._getRandomColor(); 0 !== this.board[t][e] && this.nRows - 1 > t;) t++;
            var n = this._pop(t, e, i);
            return this._popOrphans(n),
            n.length
        },
        _getRandomColor: function() {
            var t, e = 100;
            do t = Math.floor(Math.random() * this.nColors) + 1;
            while (0 === this.colorsRemaining[t] && --e > 0);
            return t
        },
        _floodFill: function(t, e, i) {
            var n, s, a, o, r, h, c, l = [],
            u = [];
            for (l.push(t << 4 | e); l.length > 0;) if (n = l.pop(), t = 15 & n >> 4, e = 15 & n, h = this.board[t], i(h[e]) && (h[e] & SEEN) !== SEEN) {
                for (h[e] |= SEEN, u.push(n), s = e, a = e; s > 0 && i(h[s - 1]) && (h[s - 1] & SEEN) !== SEEN;)--s,
                h[s] |= SEEN,
                u.push(t << 4 | s);
                for (; this.nCols - 1 > a && i(h[a + 1]) && (h[a + 1] & SEEN) !== SEEN;)++a,
                h[a] |= SEEN,
                u.push(t << 4 | a);
                for (0 > s && (s = 0), a > this.nCols - 1 && (a = this.nCols - 1), o = s; a >= o; ++o) r = o + (1 - 2 * ((t + 1) % 2)),
                t > 0 && (c = this.board[t - 1], i(c[o]) && l.push(t - 1 << 4 | o), r >= 0 && this.nCols > r && i(c[r]) && l.push(t - 1 << 4 | r)),
                this.nRows - 1 > t && (c = this.board[t + 1], i(c[o]) && l.push(t + 1 << 4 | o), r >= 0 && this.nCols > r && i(c[r]) && l.push(t + 1 << 4 | r))
            }
            return u
        },
        _pop: function(t, e, i) {
            this.board[t][e] = i;
            for (var n = this._floodFill(t, e,
            function(t) {
                return t === i
            }), s = 0, a = n.length; a > s; ++s) {
                var o = n[s];
                t = 15 & o >> 4,
                e = 15 & o,
                this.board[t][e] &= ~SEEN,
                n.length > 2 && (this.board[t][e] = 0)
            }
            return n.length > 2 ? n: []
        },
        _popColorBomb: function(t, e, i) {
            this.board[t][e] = i;
            for (var n = Math.max(0, e - 2), s = Math.min(this.nCols - 1, e + 2), a = [], o = t; o >= 0 && o > t - 5; o--) for (var r = this.board[o], h = n; s >= h; h++) r[h] === i && (r[h] = 0, a.push(o << 4 | h));
            return a
        },
        _popXBomb: function(t, e) {
            this.board[t][e] = 0;
            var i = t - 1;
            Math.max(0, t - 1),
            Math.max(0, e - 1),
            Math.min(this.nCols - 1, e + 1);
            var n = [];
            n.push(t << 4 | e);
            var s = e,
            a = e;
            0 !== i % 2 ? --s: ++a;
            for (var o = i; o >= -this.nRows; o--) {
                var r = null;
                o >= 0 && (r = this.board[o]);
                var h = null,
                c = t + (i - o + 1);
                this.nRows - 1 > c && (h = this.board[c]);
                for (var l = 0; this.nCols - 1 >= l; l++)(l === s || l === a) && (r && 0 !== r[l] && (r[l] = 0, n.push(o << 4 | l)), h && 0 !== h[l] && (h[l] = 0, n.push(c << 4 | l)));
                0 === o % 2 ? --s: ++a
            }
            return n
        },
        _popAreaBomb: function(t, i) {
            this.board[t][i] = 0;
            var n = Math.min(this.nRows - 1, t + e.areaBomb.radius),
            s = Math.max(0, t - e.areaBomb.radius),
            a = Math.max(0, i - e.areaBomb.radius),
            o = Math.min(this.nCols - 1, i + e.areaBomb.radius),
            r = [];
            r.push(t << 4 | i);
            for (var h = n; h >= s; h--) for (var c = this.board[h], l = a; o >= l; l++) 0 !== c[l] && (c[l] = 0, r.push(h << 4 | l));
            return r
        },
        _popOrphans: function(t) {
            var e, i;
            for (i = this.board[0], e = 0; this.nCols > e; ++e) 0 !== i[e] && this._floodFill(0, e,
            function(t) {
                return 0 !== t
            });
            for (var n = 0; this.nColors >= n; ++n) this.colorsRemaining[n] = 0;
            for (var s = 0; this.nRows > s; s++) for (i = this.board[s], e = 0; this.nCols > e; e++)(i[e] & SEEN) === SEEN ? (i[e] &= ~SEEN, this.colorsRemaining[i[e]] += 1) : 0 !== i[e] && (i[e] = 0, t.push(s << 4 | e));
            return t
        },
        populateWinSequence: function() {
            var e, i, n;
            for (e = 0; t.NCOLORS / 2 >= e; e++) for (n = this.board[e], i = 0; this.nCols > i; i++) n[i] = e % t.NCOLORS + 1
        },
        popWin: function() {
            var t, e, i, n = [];
            for (t = this.nRows - 1; t >= 0; t--) {
                i = this.board[t];
                var s, a, o;
                for (0 === t % 2 ? (s = 0, a = this.nCols, o = 1) : (s = this.nCols - 1, a = -1, o = -1), e = s; e != a; e += o) 0 !== i[e] && (i[e] = 0, n.push(t << 4 | e))
            }
            return n
        },
        _dumpBoard: function() {
            for (var t = 0; this.nRows > t; ++t) {
                for (var e = "",
                i = 0; this.nCols > i; ++i) e += this.board[t][i] + " ";
                1 == t % 2 && (e = " " + e),
                console.log(e)
            }
        },
        toString: function() {
            for (var t = "",
            e = 0; this.nRows > e; ++e) {
                for (var i = "",
                n = 0; this.nCols > n; ++n) i += this.board[e][n] += ",";
                t += i
            }
        }
    },
    n
}),
define("bh2/shooter", ["kinetic/kinetic", "snack/platform", "snack/coordinates", "snack/assetmanager", "snack/imagehelper", "snack/button", "snack/textutils", "snack/audiomanager", "bh2/layout", "bh2/balance", "bh2/piececolor", "bh2/boardslot", "bh2/boardmodel", "bh2/bubblefactory"],
function(t, e, i, n, s, a, o, r, h, c, l) {
    var u = {};
    return u = function(t) {
        this._initShooter(t)
    },
    u.prototype = {
        showBarrelAnimation: !e.isCrapGraphics(),
        _initShooter: function(n) {
            this.textUtils = new o,
            t.Container.call(this, n),
            this.gameBoard = n.gameBoard,
            this.barrelAssembly = new t.Container({}),
            this.add(this.barrelAssembly);
            var a = s.makeImage({
                x: 0,
                y: 0,
                name: n.gameConfig.shooterBarrelURL
            });
            a.setRotationDeg(90),
            a.setX(a.getHeight() / e.devicePixelRatio - i.w2dy(193)),
            a.setY( - a.getWidth() / 2 / e.devicePixelRatio),
            this.barrelAssembly.add(a),
            this.trail = this.makePointerSprite(),
            this.trail.setRotationDeg(90),
            this.trail.setX(i.w2dx(670)),
            this.trail.setY( - i.w2dy(30)),
            this.barrelAssembly.add(this.trail),
            this.shooterOffset = {
                x: i.w2dx(193),
                y: -n.gameBoard.pieceH / 2
            },
            this.makeShooter(this.generatePieceColor()),
            this.barrelAssembly.setRotationDeg( - 90),
            this.nextPieceColor = this.generatePieceColor();
            var r = s.makeImage({
                x: i.w2dx(h.shooterMask.x),
                y: i.w2dy(h.shooterMask.y),
                name: n.gameConfig.shooterMaskURL
            });
            this.add(r)
        },
        watchNextPiece: function(t) {
            this.onNextPieceChanged = t
        },
        aim: function(t) {
            this.barrelAssembly.setRotation(t)
        },
        swap: function() {
            if (!this.gameBoard._isShooting) {
                if (this.nextPieceColor === this.shooterPiece.getColor()) return r().playSound("negative"),
                void 0;
                r().playSound("bubbleSwap"),
                this.shooterPiece.remove();
                var t = this.shooterPiece.getColor();
                this.makeShooter(this.nextPieceColor),
                this.nextPieceColor = t,
                this.getLayer().draw(),
                this.onNextPieceChanged && this.onNextPieceChanged(this.nextPieceColor)
            }
        },
        shoot: function() {
            if (this.shooterPiece.setRotationDeg(0), this.shooterPiece.remove(), this.getLayer().draw(), this.showBarrelAnimation) {
                var t = this;
                this.trail.setAnimation("shoot"),
                this.trail.afterFrame(8,
                function() {
                    t.trail.stop(),
                    t.trail.setIndex(0),
                    t.trail.setAnimation("idle"),
                    t.getLayer().draw()
                }),
                this.trail.start()
            }
        },
        loadNext: function() {
            this.makeShooter(this.nextPieceColor),
            this.nextPieceColor = this.generatePieceColor(),
            this.getLayer().draw(),
            this.onNextPieceChanged && this.onNextPieceChanged(this.nextPieceColor)
        },
        getColor: function() {
            return this.shooterPiece.getColor()
        },
        getPiece: function() {
            return this.shooterPiece
        },
        getNextPieceColor: function() {
            return this.nextPieceColor
        },
        makeShooter: function(t) {
            this.shooterPiece = this.gameBoard.bubbleFactory.makeBubbleOrBomb(t),
            this.shooterPiece.setRotationDeg(90),
            this.shooterPiece.setX(this.shooterOffset.x),
            this.shooterPiece.setY(this.shooterOffset.y),
            this.barrelAssembly.add(this.shooterPiece),
            this.getParent() && this.getLayer() && this.shooterPiece.isPowerup() && !e.isCrapGraphics() && this.shooterPiece.start(),
            this.shooterPiece.moveToBottom()
        },
        makePointerSprite: function() {
            var i = "pointer_",
            s = {};
            s.idle = [],
            s.shoot = [];
            for (var a = 0; 20 > a; a += 2) {
                var o = this.textUtils.zeroPad(a),
                r = n().getImage(i + o + ".png");
                r && (0 === a ? s.idle.push({
                    x: r.data.frame.x,
                    y: r.data.frame.y,
                    width: r.data.frame.w,
                    height: r.data.frame.h
                }) : s.shoot.push({
                    x: r.data.frame.x,
                    y: r.data.frame.y,
                    width: r.data.frame.w,
                    height: r.data.frame.h
                }))
            }
            return new t.Sprite({
                animation: "idle",
                animations: s,
                frameRate: 30,
                image: r.image,
                listening: !1,
                scale: {
                    x: 1 / e.devicePixelRatio,
                    y: 1 / e.devicePixelRatio
                }
            })
        },
        reset: function() {
            this.shooterPiece.remove(),
            this.makeShooter(this.generatePieceColor()),
            this.nextPieceColor = this.generatePieceColor(),
            this.onNextPieceChanged && this.onNextPieceChanged(this.nextPieceColor),
            this.getLayer().draw()
        },
        generatePieceColor: function() {
            for (var t = null,
            e = this.gameBoard.gameState.boardModel.getBubblesRemaining(), i = 0, n = c.powerupFrequency.length; n > i; ++i) e >= c.powerupFrequency[i][0] && c.powerupFrequency[i][1] >= e && (t = c.powerupFrequency[i][2]);
            var s = Math.random();
            return t.xBomb > s ? l.X_BOMB: t.xBomb + t.colorBomb > s ? this.gameBoard.gameState.boardModel._getRandomColor() + 100 : t.xBomb + t.colorBomb + t.areaBomb > s ? l.AREA_BOMB: this.gameBoard.gameState.boardModel._getRandomColor()
        }
    },
    t.Global.extend(u, t.Container),
    u
}),
define("bh2/rowmeter", ["kinetic/kinetic", "snack/imagehelper"],
function(t, e) {
    var i = {};
    return i = function(t) {
        this._initRowMeter(t)
    },
    i.prototype = {
        _initRowMeter: function(i) {
            t.Container.call(this, i),
            this.fill = e.makeImage({
                x: 0,
                y: 0,
                name: i.gameConfig.rowMeterFillURL
            }),
            this.origWidth = this.fill.getWidth(),
            this.origCrop = this.fill.getCrop(),
            this.add(this.fill)
        },
        setFill: function(t) {
            0 > t && (t = 0),
            t > 100 && (t = 100),
            this.fill.setCrop({
                x: this.origCrop.x,
                y: this.origCrop.y,
                width: this.origCrop.width * t / 100,
                height: this.origCrop.height
            }),
            this.fill.setWidth(this.origWidth * t / 100)
        }
    },
    t.Global.extend(i, t.Container),
    i
}),
define("bh2/layermanager", ["kinetic/kinetic"],
function(t) {
    var e = {};
    return e = function(t) {
        return arguments.callee._singletonInstance ? arguments.callee._singletonInstance: (arguments.callee._singletonInstance = this, this._initLayerManager(t), void 0)
    },
    e.prototype = {
        _initLayerManager: function(t) {
            this.stage = t.stage,
            this.layers = []
        },
        createLayer: function(e, i) {
            var n = new t.Layer(i),
            s = n.getCanvas().element;
            return s.id = e,
            s.style.display = "none",
            this.stage.add(n),
            this.layers[e] = n,
            n
        },
        getLayer: function(t) {
            return this.layers[t]
        },
        drawLayer: function(t) {
            this.layers[t].draw()
        },
        hideLayer: function(t) {
            this.layers[t].setVisible(!1)
        },
        showLayer: function(t) {
            this.layers[t].setVisible(!0),
            this.layers[t].draw()
        }
    },
    e
}),
define("bh2/gameboard", ["kinetic/kinetic", "snack/platform", "snack/coordinates", "snack/assetmanager", "snack/audiomanager", "snack/imagehelper", "snack/highscores", "bh2/layout", "bh2/piececolor", "bh2/boardslot", "bh2/bubblefactory", "bh2/shooter", "bh2/rowmeter", "bh2/audioconfig", "bh2/balance", "bh2/layermanager"],
function(t, e, i, n, s, a, o, r, h, c, l, u, d, g, f, p) {
    var m = {};
    return m = function(t) {
        this.debug = t.debug,
        this._initGameBoard(t)
    },
    m.prototype = {
        drawBoardBubbles: !0,
        drawGrid: !1,
        drawDebugGuideLine: !1,
        nColors: 5,
        nStartRows: 7,
        nRows: 16,
        nCols: 14,
        missesUntilNewRow: 5,
        missesSinceLastNewRow: 0,
        streak: 0,
        pieceW: 22,
        pieceH: 22,
        rowHeight: 0,
        colWidth: 0,
        shooterOriginX: 0,
        shooterOriginY: 0,
        shooterSpeed: 0,
        _isShooting: !1,
        boardChromeLayer: null,
        shooterLayer: null,
        boardPieceGroup: null,
        boardSlots: [],
        spriteSheet: null,
        gameUI: null,
        pointsPerPop: 1e3,
        shooterLimitRight: degsToRads( - 30),
        shooterLimitLeft: degsToRads( - 150),
        doAnimateDeathLine: !1,
        maxDeathlineOpacity: .5,
        deathlineFadeTime: 2,
        loopDeathlineAnimation: !1,
        deathlineAnimationPaused: !0,
        dla: null,
        _initGameBoard: function(t) {
            this.stage = t.stage,
            this.nStartRows = t.gameConfig.nStartRows,
            this.nRows = t.gameConfig.nRows,
            this.nCols = t.gameConfig.nCols,
            this.nColors = t.gameConfig.nColors,
            this.gameState = t.gameState,
            this.ignoreInput = !0,
            this.shootThresholdY = i.w2dy(r.shootThreshold.y),
            this.highScores = t.game.highScoreManager,
            this.onResize(t);
            var n = this;
            this.stage.on(e.getClickAction(),
            function() {
                if (!n.ignoreInput && n.gameState.isPlaying() && !n.gameState.gameOver) {
                    var t = n.stage.getUserPosition();
                    if (t.y < n.shootThresholdY) {
                        var e = n._computeShooterAngle(t.x, t.y);
                        n._onAimAndShoot(e)
                    }
                }
            }),
            this.stage.on("mousemove",
            function() {
                if (!n.ignoreInput && n.gameState.isPlaying() && !n.gameState.gameOver) {
                    var t = n.stage.getUserPosition(),
                    e = n._computeShooterAngle(t.x, t.y);
                    n.drawDebugGuideLine && n.drawGuideLine(e),
                    n.showAim(e)
                }
            })
        },
        onResize: function(n) {
            this.config = n,
            n.gameBoard = this,
            this.x = i.w2dx(r.board.x),
            this.y = i.w2dy(r.board.y),
            this.width = n.width,
            this.height = n.height,
            this.pieceW = n.gameConfig.pieceWidth,
            this.pieceH = n.gameConfig.pieceHeight,
            this.shooterSpeed = this.height / n.gameConfig.shooterSpeedFactor,
            this.rowHeight = this.pieceH - .1 * this.pieceH,
            this.colWidth = this.pieceW,
            this.leftBound = this.x + .8 * this.pieceW / 2,
            this.rightBound = this.x + this.width - .8 * this.pieceW / 2,
            this.boardChromeLayer && this.boardChromeLayer.remove(),
            this.shooterLayer && this.shooterLayer.remove(),
            this.boardChromeLayer = this._buildChromeLayer(n),
            this.shooterLayer = p().getLayer("shooterLayer"),
            this.deathline = a.makeImage({
                x: i.w2dx(r.deathline.x),
                y: i.w2dy(r.deathline.y),
                name: n.gameConfig.deathline
            }),
            this.deathline.setOpacity(this.maxDeathlineOpacity),
            p().getLayer("boardOverlayLayer").add(this.deathline),
            this.animateDeathLine(),
            this.restoreData = this.shooterLayer.getContext().createImageData(this.pieceW * e.devicePixelRatio, this.pieceH * e.devicePixelRatio),
            this.shooterOriginX = i.w2dx(r.shooter.x),
            this.shooterOriginY = i.w2dx(r.shooter.y),
            this.bubbleFactory = new l,
            this._populateBoard(),
            this.guideLine = new t.Line({
                points: [0, 0, 0, 0],
                stroke: "red",
                strokeWidth: 1,
                listening: !1
            }),
            this.boardChromeLayer.add(this.guideLine),
            this.guidePoints = new t.Group,
            this.boardChromeLayer.add(this.guidePoints),
            this.shooter = new u(n),
            this.shooter.setPosition(this.shooterOriginX, this.shooterOriginY),
            this.boardChromeLayer.add(this.shooter)
        },
        _populateBoard: function() {
            null !== this.boardPieceGroup && this.boardPieceGroup.remove();
            var e = this.gameState.boardModel.board;
            this.boardSlots = [],
            this.boardPieceGroup = new t.Group({
                x: i.w2dx(r.board.x),
                y: i.w2dy(r.board.y)
            });
            for (var n = 0; this.nRows > n; ++n) {
                this.boardSlots[n] = [];
                for (var s = 0; this.nCols > s; ++s) {
                    var a = new c(n, s);
                    if (e[n][s] !== h.NONE) {
                        var o = this.bubbleFactory.makeBubble(e[n][s]);
                        a.setPiece(o),
                        o.setX(this._getSlotX(a)),
                        o.setY(this._getSlotY(a)),
                        this.boardPieceGroup.add(o)
                    }
                    this.boardSlots[n].push(a)
                }
            }
            this.boardChromeLayer.add(this.boardPieceGroup),
            this.leftBound = this.boardPieceGroup.getX() + .5 * this.pieceW,
            this.rightBound = this.boardPieceGroup.getX() + this.pieceW * this.nCols
        },
        setUI: function(t) {
            this.gameUI = t
        },
        swapShooter: function() {
            this._isShooting || this.shooter.swap()
        },
        computeNewRows: function() {
            var t = 0,
            e = f.rowSpawn[f.rowSpawn.spawnAlgorithm],
            i = 0,
            n = 0;
            switch (e.variable) {
            case "colorsRemaining":
                i = this.gameState.boardModel.getColorsRemaining();
                break;
            case "bubblesRemaining":
                i = this.gameState.boardModel.getBubblesRemaining()
            }
            for (var s = 0,
            a = e.values.length; a > s; ++s) i >= e.values[s][0] && e.values[s][1] >= i && (n = e.values[s][2]);
            switch (e.setVar) {
            case "numSpawnRows":
                this.missesSinceLastNewRow > this.missesUntilNewRow && (t = n);
                break;
            case "missesUntilRowSpawn":
                this.missesUntilNewRow = n,
                this.missesSinceLastNewRow > this.missesUntilNewRow && (t = 1)
            }
            return t
        },
        _addRow: function(t, e) {
            var i = this;
            s().playSound("rowSpawn"),
            this.missesSinceLastNewRow = 0;
            var n = this.gameState.boardModel.addRow(t),
            a = i.gameState.boardModel.isLossCondition();
            this._doPops(n,
            function() {
                i._populateBoard(),
                a && i.handleLoss(),
                e()
            })
        },
        _computeShooterAngle: function(t, e) {
            var i = this.shooterOriginX,
            n = this.shooterOriginY,
            s = Math.atan2(e - n, t - i);
            return s > this.shooterLimitRight && (s = this.shooterLimitRight),
            this.shooterLimitLeft > s && (s = this.shooterLimitLeft),
            s
        },
        _onAimAndShoot: function(t) {
            this.drawDebugGuideLine && this.drawGuideLine(t),
            this.showAim(t),
            this.shoot(t)
        },
        shoot: function(n) {
            if (!this._isShooting) {
                var a = this,
                o = Math.cos(n),
                r = Math.sin(n),
                h = o * this.shooterSpeed,
                c = r * this.shooterSpeed,
                l = this._computeShooterPath(n),
                u = l[l.length - 2],
                d = l[l.length - 1],
                g = !0,
                p = 1,
                m = this.leftBound - this.boardPieceGroup.getX(),
                v = this.rightBound - this.boardPieceGroup.getX();
                this.pauseDeathlineAnimation(!0),
                this._isShooting = !0,
                this.gameState.shots++,
                s().playSound("shootSound"),
                this.shooterColor = this.shooter.getColor(),
                this.shooterPiece = this.shooter.getPiece(),
                this.shooter.shoot(),
                this.shooterLayer.add(this.shooterPiece),
                this.shooterPiece.moveToBottom(),
                this.shooterPiece.setPosition(this.shooterOriginX - this.boardPieceGroup.getX() + i.w2dy(330) * o - this.pieceW / 2, this.shooterOriginY - this.boardPieceGroup.getY() + i.w2dy(330) * r - this.pieceH / 2),
                this.shooterLayer.clear(),
                this.shooterLayer.draw();
                var y = a._xyToRowCol(u, d),
                b = a.gameState.boardModel.addBubble(y.row, y.col, a.shooterColor),
                w = a.gameState.boardModel.isWinCondition(),
                x = a.gameState.boardModel.isLossCondition(),
                _ = new t.Animation(function(t) {
                    if (g) return g = !1,
                    void 0;
                    var i, n, o, r, l, S;
                    if (l = h * t.timeDiff, S = c * t.timeDiff, o = a.shooterPiece.getX() + (a.pieceW >> 1), r = a.shooterPiece.getY() + (a.pieceH >> 1), i = o + p * l, n = r + S, (m >= i || i >= v) && (m >= i ? i = (m << 1) - i: i >= v && (i = (v << 1) - i), p = -p, s().playSound("wallImpactSound")), a.collision(i, n, u, d)) {
                        var C = a.boardSlots[y.row][y.col];
                        a.shooterPiece.moveTo(a.boardPieceGroup),
                        a.shooterPiece.setX(a._getSlotX(C)),
                        a.shooterPiece.setY(a._getSlotY(C)),
                        C.setPiece(a.shooterPiece),
                        a.shooterLayer.clear(),
                        a.boardChromeLayer.draw();
                        var P = function() {
                            var t = a._doPops(b,
                            function() {
                                w ? a.handleWin() : x && a.handleLoss(),
                                a.boardChromeLayer.draw()
                            });
                            if (a.popCount = t, 0 === t) {
                                a.streak = 0,
                                s().playSound("impactSound");
                                var e = function() {
                                    a.missesSinceLastNewRow++;
                                    var t = a.computeNewRows();
                                    t > 0 ? a._addRow(t,
                                    function() {
                                        a._isShooting = !1,
                                        a.updateDeathlineAnimation(),
                                        a.pauseDeathlineAnimation(!1)
                                    }) : (a._isShooting = !1, a.updateDeathlineAnimation(), a.pauseDeathlineAnimation(!1)),
                                    a.rowMeter.setFill(100 * (a.missesSinceLastNewRow / a.missesUntilNewRow)),
                                    a.boardChromeLayer.draw()
                                };
                                setTimeout(e, 10)
                            } else {
                                if (a._isShooting = !1, a.pauseDeathlineAnimation(!1), a.streak++, t > 6) a.showBurst(u, d, 3);
                                else if (t > 3) {
                                    var i = Math.floor(3 * Math.random());
                                    i > 0 && a.showBurst(u, d, i)
                                }
                                var n = 1;
                                a.streak > 1 && (n = Math.min(a.streak, f.maxStreakMultiplier), a.showStreakMultiplier(u, d, n)),
                                a.gameState.score += 225 * (t - 2) * n,
                                a.gameUI.setScore(a.gameState.score),
                                a.gameState.pops += t,
                                a.updateDeathlineAnimation()
                            }
                            w || x || a.shooter.loadNext()
                        };
                        setTimeout(P, 10),
                        _.stop()
                    } else a.shooterLayer.getContext().putImageData(a.restoreData, (a.x + a.shooterPiece.getX()) * e.devicePixelRatio, (a.y + a.shooterPiece.getY()) * e.devicePixelRatio),
                    a.shooterPiece.setPosition(i - (a.pieceW >> 1), n - (a.pieceH >> 1))
                },
                this.shooterLayer);
                _.start()
            }
        },
        collision: function(t, e, i, n) {
            return e - .8 * this.pieceH / 2 < n - this.boardPieceGroup.getY()
        },
        _getSlotX: function(t) {
            return t.col * this.pieceW + .5 * this.pieceW * (t.row % 2)
        },
        _getSlotY: function(t) {
            return t.row * this.rowHeight
        },
        _buildChromeLayer: function(e) {
            var n = p().getLayer("boardChromeLayer"),
            s = new t.Group({
                listening: !1
            });
            n.add(s);
            var o = a.makeImage({
                x: i.w2dx(r.boardBorder.x),
                y: i.w2dy(r.boardBorder.y),
                name: e.gameConfig.boardBorderURL
            });
            return s.add(o),
            this.rowMeter = new d(e),
            this.rowMeter.setPosition({
                x: i.w2dx(r.rowMeter.x),
                y: i.w2dy(r.rowMeter.y)
            }),
            this.rowMeter.setFill(0),
            s.add(this.rowMeter),
            n
        },
        drawGuideLine: function(e) {
            var i = this._computeShooterPath(e);
            this.guideLine.setPoints(i),
            this.guidePoints.removeChildren();
            for (var n = 0,
            s = i.length; s > n; n += 2) this.guidePoints.add(new t.Circle({
                x: i[n],
                y: i[n + 1],
                radius: 3,
                fill: "red",
                listening: !1
            }))
        },
        showAim: function(t) {
            this.shooter.aim(t),
            this.boardChromeLayer.draw()
        },
        _computeShooterPath: function(t) {
            var e = this.shooterOriginX,
            i = this.shooterOriginY,
            n = e + Math.cos(t),
            s = i + Math.sin(t);
            this.pieceH / 2;
            var a = [];
            if (a.push(e), a.push(i), s > this.height) return a;
            for (var o = this.nRows - 1,
            r = !1; ! r;) {
                var h = o * (this.pieceH - 2) + this.pieceH / 2,
                c = (n - e) * (h - i) / (s - i) + e;
                if (this.leftBound >= c || c >= this.rightBound) {
                    var l;
                    this.leftBound >= c ? (l = 2 * this.leftBound - c, c = this.leftBound) : c >= this.rightBound && (l = 2 * this.rightBound - c, c = this.rightBound),
                    h = (s - i) * (c - e) / (n - e) + i,
                    Math.abs(h - i) < this.boardPieceGroup.getY() + this.pieceH / 2 && (r = !0),
                    e = c,
                    i = h,
                    n = l,
                    s = o * (this.pieceH - 2) + this.pieceH / 2
                } else this.boardPieceGroup.getY() > h && (r = !0),
                0 > o ? r = !0 : o -= .25;
                var u = this._xyToRowCol(c, h);
                this.gameState.boardModel.isEmpty(u.row, u.col) ? (a.push(c), a.push(h)) : r = !0
            }
            return a
        },
        _xyToRowCol: function(t, e) {
            e -= this.boardPieceGroup.getY(),
            t -= this.boardPieceGroup.getX();
            var i = Math.floor(e / this.rowHeight);
            0 > i && (i = 0),
            i >= this.nRows && (i = this.nRows - 1);
            var n = Math.floor((t - i % 2 * this.colWidth / 2) / this.colWidth);
            return 0 > n && (n = 0),
            n >= this.nCols && (n = this.nCols - 1),
            {
                row: i,
                col: n
            }
        },
        _doPops: function(t, e) {
            var i = t.length;
            return i > 0 ? (t.reverse(), this.playPopSounds(i), this.popChain(t, e)) : e(),
            i
        },
        playPopSounds: function(t) {
            3 > t && s().playSound("pop3"),
            10 > t ? s().playSound("pop" + t) : 13 > t ? s().playSound("popBig") : 16 > t ? s().playSound("popBigger") : s().playSound("popBiggest")
        },
        popChain: function(t, e) {
            var i = this;
            if (t.length > 0) {
                var n = t.pop(),
                s = t.length,
                a = 15 & n >> 4,
                o = 15 & n,
                r = this.boardSlots[a][o],
                h = r.getPiece();
                h ? h.explode(function() {
                    null !== h && (h.stop(), h.remove()),
                    r.clear(),
                    0 === s && e()
                }) : 0 === s && e(),
                i.gameState.score += i.pointsPerPop,
                i.gameUI.setScore(i.gameState.score),
                setTimeout(function() {
                    i.popChain(t, e)
                },
                50)
            }
        },
        showBurst: function(t, n, s) {
            t = Math.max(this.leftBound + i.w2dx(10), t - i.w2dx(100)),
            t = Math.min(this.rightBound - i.w2dx(200), t);
            var o = a.makeImage({
                x: t,
                y: n - i.w2dy(120),
                name: this.config.gameConfig["burstImage" + s]
            });
            o.setScale(1.5 / e.devicePixelRatio, 1.5 / e.devicePixelRatio),
            this.boardChromeLayer.add(o),
            o.transitionTo({
                y: n - i.w2dy(300),
                opacity: .1,
                duration: .75,
                easing: "ease-in",
                callback: function() {
                    o.remove()
                }
            })
        },
        showStreakMultiplier: function(t, n, s) {
            t = Math.max(this.leftBound + i.w2dx(10), t - i.w2dx(100)),
            t = Math.min(this.rightBound - i.w2dx(200), t);
            var o = a.makeImage({
                x: t,
                y: n - i.w2dy(120),
                name: this.config.gameConfig["burstX" + s]
            });
            o.setScale(2 / e.devicePixelRatio, 2 / e.devicePixelRatio);
            var r = this;
            setTimeout(function() {
                r.boardChromeLayer.add(o),
                o.transitionTo({
                    y: n - i.w2dy(300),
                    opacity: .1,
                    duration: .75,
                    easing: "ease-in",
                    callback: function() {
                        o.remove()
                    }
                })
            },
            250)
        },
        handleWin: function() {
            s().playSound("zinger"),
            this.pauseDeathlineAnimation(!0),
            this.gameState.gameOver = !0,
            this.shooterLayer.clear(),
            this.gameState.boardModel.populateWinSequence(),
            this._populateBoard();
            var t = this.gameState.boardModel.popWin(),
            e = this;
            this._doPops(t,
            function() {
                setTimeout(function() {
                    e.highScores.postScore(e.gameState.score),
                    e.gameUI.gameOver(e.gameState.score)
                },
                1e3)
            })
        },
        handleLoss: function() {
            var t = this;
            this.pauseDeathlineAnimation(!0),
            s().playSound("dinger"),
            this.gameState.gameOver = !0,
            this.shooterLayer.clear();
            for (var e = 0; this.nRows > e; ++e) for (var i = 0; this.nCols > i; ++i) {
                var n = this.boardSlots[e][i],
                a = n.getPiece();
                a && a.shrink(function() {})
            }
            this.highScores.postScore(this.gameState.score);
            var t = this;
            setTimeout(function() {
                t.gameUI.gameOver(t.gameState.score)
            },
            3e3)
        },
        reset: function() {
            this.gameUI.setScore(this.gameState.score),
            this.missesSinceLastNewRow = 0,
            this.rowMeter.setFill(0),
            this._populateBoard(),
            this.shooter.reset(),
            this.pauseDeathlineAnimation(!0),
            this.boardChromeLayer.draw()
        },
        updateDeathlineAnimation: function() {
            var t = this.gameState.boardModel.getMaxRowOccupied(),
            e = 0,
            i = 1,
            n = .25,
            s = 4,
            a = (t + 1) / (this.config.gameConfig.nRows - 1);
            this.loopDeathlineAnimation = 1 == a,
            this.maxDeathlineOpacity = e + (i - e) * a,
            this.deathlineFadeTime = n + (s - n) * (1 - a)
        },
        pauseDeathlineAnimation: function(t) {
            this.doAnimateDeathLine && (t ? (this.dla.stop(), this.deathline.setOpacity(0)) : this.dla.start())
        },
        animateDeathLine: function() {
            var e = this,
            i = 1,
            n = .1;
            this.doAnimateDeathLine && (this.dla = new t.Animation(function(t) {
                if (t.timeDiff > 100) return e.dla.stop(),
                e.deathline.setOpacity(e.maxDeathlineOpacity),
                void 0;
                n = e.maxDeathlineOpacity * (t.timeDiff / 1e3 / e.deathlineFadeTime);
                var s = e.deathline.getOpacity();
                1 == i ? (s += n, s > e.maxDeathlineOpacity && (s = e.maxDeathlineOpacity, i = -1)) : (s -= n, 0 > s && (s = 0, i = 1)),
                e.deathline.setOpacity(s)
            },
            e.deathline.getLayer()), e.deathline.setOpacity(0))
        }
    },
    m
}),
define("snack/digitsprite", ["kinetic/kinetic", "snack/platform", "snack/assetmanager"],
function(t, e, i) {
    var n = {};
    return n = function(t) {
        this._initDigitSprite(t)
    },
    n.prototype = {
        _initDigitSprite: function(n) {
            t.Container.call(this, n),
            this.digit = 0,
            this.digits = {};
            for (var s = 0; 10 > s; ++s) {
                var a = i().getImage("number_0" + s + ".png");
                a && (this.digits[s] = [{
                    x: a.data.frame.x,
                    y: a.data.frame.y,
                    width: a.data.frame.w,
                    height: a.data.frame.h
                }])
            }
            var o = i().getImage("number_comma.png");
            o && (this.digits[","] = [{
                x: o.data.frame.x,
                y: o.data.frame.y,
                width: o.data.frame.w,
                height: o.data.frame.h
            }]);
            var r = i().getImage("number_slash.png");
            r && (this.digits["/"] = [{
                x: r.data.frame.x,
                y: r.data.frame.y,
                width: r.data.frame.w,
                height: r.data.frame.h
            }]),
            this.sprite = new t.Sprite({
                animation: "0",
                animations: this.digits,
                frameRate: 0,
                image: o.image,
                listening: !1,
                scale: {
                    x: 1 / e.devicePixelRatio,
                    y: 1 / e.devicePixelRatio
                }
            }),
            this.add(this.sprite)
        },
        getDigit: function() {
            return this.digit
        },
        setDigit: function(t) {
            " " === t && (t = ","),
            (t >= 0 && 10 > t || "," === t || "/" === t) && (this.digit = t, this.sprite.setAnimation(t + ""))
        },
        getDigitWidth: function() {
            return this.digits[this.digit][0].width
        }
    },
    t.Global.extend(n, t.Container),
    n
}),
define("snack/digitlabel", ["kinetic/kinetic", "snack/digitsprite", "snack/platform"],
function(t, e, i) {
    var n = {};
    return n = function(t) {
        this._initDigitLabel(t)
    },
    n.prototype = {
        _initDigitLabel: function(i) {
            i = i || {},
            t.Container.call(this, i),
            this.text = "",
            this.numDigits = i.numDigits || 8,
            this.numCommas = Math.ceil(this.numDigits / 3 - 1),
            this.numSprites = this.numDigits + this.numCommas,
            this.sprites = [];
            for (var n = 0; this.numSprites > n; ++n) this.sprites.push(new e),
            this.add(this.sprites[n]);
            this._layout()
        },
        getText: function() {
            return this.text
        },
        setText: function(t) {
            this.text = t,
            this._layout()
        },
        _layout: function() {
            for (var t = this.getWidth(), e = this.text.length - 1, n = 0, s = this.sprites.length; s > n; ++n) 0 > e ? this.sprites[n].setVisible(!1) : (this.sprites[n].setVisible(!0), this.sprites[n].setDigit(this.text[e]), t -= this.sprites[n].getDigitWidth() / i.devicePixelRatio, this.sprites[n].setX(t), --e)
        }
    },
    t.Global.extend(n, t.Container),
    n
}),
define("bh2/switchbutton", ["snack/button", "snack/coordinates", "snack/platform", "bh2/gameboard"],
function(t, e) {
    var i = {};
    return i = function(t) {
        this._initSwitchButton(t)
    },
    i.prototype = {
        pieceX: e.w2dx(30),
        pieceY: e.w2dy(27),
        _initSwitchButton: function(e) {
            var i = this;
            t.call(this, e),
            this.gameBoard = e.gameBoard,
            this.nextPieceColor = this.gameBoard.shooter.getNextPieceColor(),
            this.nextPiece = this.gameBoard.bubbleFactory.makeBubbleOrBomb(this.nextPieceColor),
            this.nextPiece.setPosition(this.pieceX, this.pieceY),
            this.add(this.nextPiece),
            document.onkeypress = function(t) {
                var e = window.event || t;
                32 === e.keyCode && i.isListening() && i.doAction()
            }
        },
        setNextPieceColor: function(t) {
            this.nextPiece.remove(),
            this.nextPieceColor = t,
            this.nextPiece = this.gameBoard.bubbleFactory.makeBubbleOrBomb(this.nextPieceColor),
            this.nextPiece.setPosition(this.pieceX, this.pieceY),
            this.add(this.nextPiece),
            this.getLayer().draw()
        }
    },
    Kinetic.Global.extend(i, t),
    i
}),
define("bh2/threeslicedialog", ["kinetic/kinetic", "snack/imagehelper", "snack/coordinates", "snack/platform", "bh2/gameconfig", "bh2/layout"],
function(t, e, i, n) {
    var s = {};
    return s = function(t) {
        this._initThreeSliceDialog(t)
    },
    s.prototype = {
        _initThreeSliceDialog: function(i) {
            t.Container.call(this, i),
            this.onShow = i.onShow,
            this.onHide = i.onHide;
            var s, a, o;
            s = i.top && "flat" === i.top ? e.makeImage({
                x: 0,
                y: 0,
                name: i.gameConfig.threeSliceTopFlatURL
            }) : e.makeImage({
                x: 0,
                y: 0,
                name: i.gameConfig.threeSliceTopRoundURL
            });
            var r = s.getHeight() / n.devicePixelRatio;
            for (this.add(s), o = e.makeImage({
                name: i.gameConfig.threeSliceBottomURL
            }); r + o.getHeight() / n.devicePixelRatio < i.height;) a = e.makeImage({
                x: 0,
                y: r,
                name: i.gameConfig.threeSliceMidURL
            }),
            this.add(a),
            r += a.getHeight() / n.devicePixelRatio;
            "flat" === i.top ? o.setPosition(0, i.height - o.getHeight() / n.devicePixelRatio) : o.setPosition(0, r),
            this.add(o)
        },
        show: function() {
            var t = this;
            this.setVisible(!0),
            this.transitionTo({
                opacity: 1,
                duration: .25,
                easing: "ease-in",
                callback: function() {
                    t.setListening(!0),
                    t.onShow && t.onShow()
                }
            })
        },
        hide: function() {
            var t = this;
            t.setListening(!1),
            this.transitionTo({
                opacity: 0,
                duration: .25,
                easing: "ease-in",
                callback: function() {
                    t.setVisible(!1),
                    t.onHide && t.onHide()
                }
            })
        },
        hideNow: function() {
            this.setListening(!1),
            this.setVisible(!1)
        }
    },
    t.Global.extend(s, t.Container),
    s
}),
define("bh2/mainmenu", ["kinetic/kinetic", "snack/imagehelper", "snack/coordinates", "snack/button", "bh2/threeslicedialog", "bh2/gameconfig", "bh2/layout"],
function(t, e, i, n, s, a, o) {
    var r = {};
    return r = function(t) {
        this._initMainMenu(t)
    },
    r.prototype = {
        _initMainMenu: function(t) {
            var a = this;
            this.helpSeen = "true" === localStorage.bh2helpseen,
            s.call(this, {
                height: i.w2dy(2008),
                gameConfig: t.gameConfig,
                top: "flat",
                onShow: t.onShow,
                onHide: t.onHide
            }),
            this.game = t.game,
            this.logo = e.makeImage({
                x: i.w2dx(o.mainMenu.logo.x),
                y: i.w2dy(o.mainMenu.logo.y),
                name: t.gameConfig.logoURL
            }),
            this.add(this.logo),
            this.playButton = new n({
                x: i.w2dx(o.mainMenu.play.x),
                y: i.w2dy(o.mainMenu.play.y),
                name: t.gameConfig.playButtonBase,
                action: function() {
                    a.helpSeen ? a.game.play() : (a.game.help(), a.helpSeen = !0, localStorage.bh2helpseen = "true")
                }
            }),
            this.add(this.playButton),
            this.scoresButton = new n({
                x: i.w2dx(o.mainMenu.scores.x),
                y: i.w2dy(o.mainMenu.scores.y),
                name: t.gameConfig.scoresButtonBase,
                action: function() {
                    a.game.highScores()
                }
            }),
            this.add(this.scoresButton)
            /*this.portalButton = new n({
                x: i.w2dx(o.mainMenu.portal.x),
                y: i.w2dy(o.mainMenu.portal.y),
                name: t.gameConfig.portalButtonBase,
                action: function() {
                    window.open("http://m.zibbo.com/", '_blank')
                }
            }),
            this.add(this.portalButton)*/
        }
    },
    t.Global.extend(r, s),
    r
}),
define("bh2/highscoresmenu", ["kinetic/kinetic", "snack/imagehelper", "snack/coordinates", "snack/button", "snack/audiomanager", "snack/highscores", "snack/digitlabel", "snack/textutils", "bh2/threeslicedialog", "bh2/gameconfig", "bh2/layout"],
function(t, e, i, n, s, a, o, r, h, c, l) {
    var u = {};
    return u = function(t) {
        this._initHighScoresMenu(t)
    },
    u.prototype = {
        _initHighScoresMenu: function(t) {
            var s = this;
            this.config = t,
            this.textUtils = new r,
            h.call(this, {
                height: i.w2dy(2008),
                gameConfig: t.gameConfig,
                top: "flat",
                onShow: function() {
                    s.scoreAnimation && s.scoreAnimation.start(),
                    t.onShow()
                },
                onHide: function() {
                    s.scoreAnimation && s.scoreAnimation.stop(),
                    t.onHide()
                }
            }),
            this.game = t.game,
            this.roster = e.makeImage({
                x: i.w2dx(l.highScores.roster.x),
                y: i.w2dy(l.highScores.roster.y),
                name: t.gameConfig.highScoresRosterURL
            }),
            this.add(this.roster),
            this.clearButton = new n({
                x: i.w2dx(l.highScores.clear.x),
                y: i.w2dy(l.highScores.clear.y),
                name: t.gameConfig.clearButtonBase,
                action: function() {
                    s.game.highScoreManager.clearScores(),
                    s.updateScores()
                }
            }),
            this.add(this.clearButton),
            this.refreshButton = new n({
                x: i.w2dx(l.highScores.refresh.x),
                y: i.w2dy(l.highScores.refresh.y),
                name: t.gameConfig.refreshButtonBase,
                action: function() {}
            }),
            this.playButton = new n({
                x: i.w2dx(l.highScores.play.x),
                y: i.w2dy(l.highScores.play.y),
                name: t.gameConfig.playButtonBase,
                action: function() {
                    s.game.play()
                }
            }),
            this.add(this.playButton),
            this.menuButton = new n({
                x: i.w2dx(l.highScores.menu.x),
                y: i.w2dy(l.highScores.menu.y),
                name: t.gameConfig.mainMenuButtonBase,
                action: function() {
                    s.game.ready()
                }
            }),
            this.add(this.menuButton),
            this.updateScores()
        },
        updateScores: function(e) {
            this.scoresList && this.scoresList.remove(),
            this.currentScore && this.currentScore.remove();
            var n = new a,
            s = n.getScores();
            e && (this.currentScore = new o({
                x: i.w2dx(l.highScores.roster.x + 800),
                y: i.w2dy(l.highScores.roster.y + 180)
            }), this.currentScore.setText(this.textUtils.formatInt(e)), this.add(this.currentScore)),
            this.scoresList = new t.Container({
                x: i.w2dx(l.highScores.roster.x + 80),
                y: i.w2dy(l.highScores.roster.y + 270)
            });
            for (var r = 540,
            h = 50,
            c = 0; s.length > c; ++c) {
                var u = new t.Container({
                    x: i.w2dx(530),
                    y: i.w2dy(h)
                }),
                d = new o({
                    x: i.w2dx( - 390),
                    y: 0
                }),
                g = new o({
                    x: i.w2dx(0),
                    y: 0
                }),
                f = new o({
                    x: i.w2dx(r),
                    y: 0
                });
                d.setText(this.textUtils.formatInt(c + 1)),
                g.setText("24/02"),
                g.setScale(.8, .8),
                f.setText(this.textUtils.formatInt(parseInt(s[c]))),
                u.add(d),
                u.add(f),
                this.scoresList.add(u);
                var p = this;
                if (e && e === parseInt(s[c])) {
                    var m = u,
                    v = 1,
                    y = 1;
                    m.moveToTop(),
                    this.scoreAnimation = new t.Animation(function(t) {
                        y += v * t.timeDiff / 1e4,
                        1 > y && (v = 1, y = 1),
                        y > 1.05 && (v = -1, y = 1.05),
                        m.setScale(y, y)
                    },
                    p.getLayer()),
                    e = 0
                }
                h += 110
            }
            this.add(this.scoresList)
        }
    },
    t.Global.extend(u, h),
    u
}),
define("snack/togglebutton", ["kinetic/kinetic", "snack/platform", "snack/assetmanager"],
function(t, e, i) {
    var n = {};
    return n = function(t) {
        this._initToggleButton(t)
    },
    n.prototype = {
        _initToggleButton: function(n) {
            t.Container.call(this, n),
            this.hover = !1,
            this.enabled = !1,
            this.ignoreInput = !1,
            this.images = {};
            var s = i().getImage(n.name + "OFF_1.png"),
            a = i().getImage(n.name + "OFF_2.png"),
            o = i().getImage(n.name + "ON_1.png"),
            r = i().getImage(n.name + "ON_2.png");
            this.images.disabled = [{
                x: s.data.frame.x,
                y: s.data.frame.y,
                width: s.data.frame.w,
                height: s.data.frame.h
            }],
            this.images.disabledHover = [{
                x: a.data.frame.x,
                y: a.data.frame.y,
                width: a.data.frame.w,
                height: a.data.frame.h
            }],
            this.images.enabled = [{
                x: o.data.frame.x,
                y: o.data.frame.y,
                width: o.data.frame.w,
                height: o.data.frame.h
            }],
            this.images.enabledHover = [{
                x: r.data.frame.x,
                y: r.data.frame.y,
                width: r.data.frame.w,
                height: r.data.frame.h
            }],
            this.sprite = new t.Sprite({
                animation: "disabled",
                animations: this.images,
                frameRate: 0,
                image: o.image,
                listening: !0,
                scale: {
                    x: 1 / e.devicePixelRatio,
                    y: 1 / e.devicePixelRatio
                }
            }),
            this.add(this.sprite);
            var h = this;
            this.on("mouseover",
            function() {
                this.enabled ? h.sprite.setAnimation("enabledHover") : h.sprite.setAnimation("disabledHover"),
                h.hover = !0,
                h.getLayer().draw()
            }),
            this.on("mouseout",
            function() {
                this.enabled ? h.sprite.setAnimation("enabled") : h.sprite.setAnimation("disabled"),
                h.hover = !1,
                h.getLayer().draw()
            }),
            this.on(e.getClickAction(),
            function() {
                n.action && n.action()
            })
        },
        setEnabled: function(t) {
            this.enabled = t,
            this.sprite && (this.hover ? this.sprite.setAnimation(t ? "enabledHover": "disabledHover") : this.sprite.setAnimation(t ? "enabled": "disabled"), this.getLayer && this.getLayer() && this.getLayer().draw())
        }
    },
    t.Global.extend(n, t.Container),
    n
}),
define("bh2/optionsmenu", ["kinetic/kinetic", "snack/platform", "snack/imagehelper", "snack/coordinates", "snack/button", "snack/togglebutton", "snack/audiomanager", "bh2/threeslicedialog", "bh2/gameconfig", "bh2/layout"],
function(t, e, i, n, s, a, o, r, h, c) {
    var l = {};
    return l = function(t) {
        this._initOptionsMenu(t)
    },
    l.prototype = {
        _initOptionsMenu: function(t) {
            var i = this;
            r.call(this, {
                height: n.w2dy(928),
                gameConfig: t.gameConfig,
                onShow: t.onShow,
                onHide: t.onHide
            }),
            this.game = t.game,
            this.gameState = t.gameState,
            this.closeOptions = new s({
                x: n.w2dx(c.optionsMenu.close.x),
                y: n.w2dy(c.optionsMenu.close.y),
                name: t.gameConfig.closeOptionsButtonBase,
                action: function() {
                    i.gameState.resume(),
                    i.hide()
                }
            }),
            this.add(this.closeOptions),
            this.sfxButton = new a({
                x: n.w2dx(c.optionsMenu.sfx.x),
                y: n.w2dy(c.optionsMenu.sfx.y),
                name: t.gameConfig.sfxToggleButtonBase,
                action: function() {
                    o().setSfxEnabled(!o().isSfxEnabled()),
                    i.sfxButton.setEnabled(o().isSfxEnabled()),
                    o().isSfxEnabled() && o().playSound("pop3")
                }
            }),
            this.add(this.sfxButton),
            this.musicButton = new a({
                x: n.w2dx(c.optionsMenu.music.x),
                y: n.w2dy(c.optionsMenu.music.y),
                name: t.gameConfig.musicToggleButtonBase,
                action: function() {
                    o().setMusicEnabled(!o().isMusicEnabled()),
                    i.musicButton.setEnabled(o().isMusicEnabled())
                }
            }),
            this.add(this.musicButton),
            e.isCrapAudio() && (this.sfxButton.setVisible(!1), this.musicButton.setX(n.w2dx(c.optionsMenu.menu.x)), this.musicButton.setY(n.w2dx(c.optionsMenu.music.y - 30))),
            this.helpButton = new s({
                x: n.w2dx(c.optionsMenu.help.x),
                y: n.w2dy(c.optionsMenu.help.y),
                name: t.gameConfig.helpButtonBase,
                action: function() {
                    i.game.help()
                }
            }),
            this.add(this.helpButton),
            this.menuButton = new s({
                x: n.w2dx(c.optionsMenu.menu.x),
                y: n.w2dy(c.optionsMenu.menu.y),
                name: t.gameConfig.mainMenuButtonBase,
                action: function() {
                    i.game.ready()
                }
            }),
            this.add(this.menuButton),
            this.restartButton = new s({
                x: n.w2dx(c.optionsMenu.restart.x),
                y: n.w2dy(c.optionsMenu.restart.y),
                name: t.gameConfig.restartButtonBase,
                action: function() {
                    i.hide(),
                    i.game.reset(),
                    i.game.play()
                }
            }),
            this.add(this.restartButton)
        },
        show: function() {
            var t = this;
            o().playSound("dialogSlideIn"),
            this.sfxButton.setEnabled(o().isSfxEnabled()),
            this.musicButton.setEnabled(o().isMusicEnabled()),
            this.setVisible(!0),
            this.transitionTo({
                x: n.w2dx(c.optionsMenu.show.x),
                y: n.w2dy(c.optionsMenu.show.y),
                duration: .25,
                easing: "ease-in",
                callback: function() {
                    t.onShow && t.onShow()
                }
            })
        },
        hide: function() {
            var t = this;
            o().playSound("dialogSlideOut"),
            this.transitionTo({
                x: n.w2dx(c.optionsMenu.hide.x),
                y: n.w2dy(c.optionsMenu.hide.y),
                duration: .25,
                easing: "ease-in",
                callback: function() {
                    t.onHide && t.onHide()
                }
            })
        }
    },
    t.Global.extend(l, r),
    l
}),
define("bh2/howtoplay", ["kinetic/kinetic", "snack/imagehelper", "snack/coordinates", "snack/button", "bh2/threeslicedialog", "bh2/gameconfig", "bh2/layout"],
function(t, e, i, n, s, a, o) {
    var r = {};
    return r = function(t) {
        this._initHowToPlay(t)
    },
    r.prototype = {
        _initHowToPlay: function(a) {
            var r = this;
            this.currentScreen = 0,
            this.boardWidth = a.gameConfig.boardWidth,
            s.call(this, {
                height: i.w2dy(2008),
                gameConfig: a.gameConfig,
                top: "flat",
                onShow: a.onShow,
                onHide: a.onHide
            }),
            this.game = a.game,
            this.screenContainer = new t.Container,
            this.add(this.screenContainer),
            this.shooting = e.makeImage({
                x: i.w2dx(o.howToPlay.shooting.x),
                y: i.w2dy(o.howToPlay.shooting.y),
                name: a.gameConfig.htpShootingURL
            }),
            this.screenContainer.add(this.shooting),
            this.powerups = e.makeImage({
                x: i.w2dx(o.howToPlay.powerups.x) + a.gameConfig.boardWidth,
                y: i.w2dy(o.howToPlay.powerups.y),
                name: a.gameConfig.htpPowerupsURL
            }),
            this.screenContainer.add(this.powerups),
            this.prevButton = new n({
                x: i.w2dx(o.howToPlay.prev.x),
                y: i.w2dy(o.howToPlay.prev.y),
                name: a.gameConfig.prevButtonBase,
                action: function() {
                    r.prevScreen()
                }
            }),
            this.add(this.prevButton),
            this.prevButton.setVisible(!1),
            this.playButton = new n({
                x: i.w2dx(o.howToPlay.play.x),
                y: i.w2dy(o.howToPlay.play.y),
                name: a.gameConfig.playButtonBase,
                action: function() {
                    r.game.play()
                }
            }),
            this.add(this.playButton),
            this.nextButton = new n({
                x: i.w2dx(o.howToPlay.next.x),
                y: i.w2dy(o.howToPlay.next.y),
                name: a.gameConfig.nextButtonBase,
                action: function() {
                    r.nextScreen()
                }
            }),
            this.add(this.nextButton)
        },
        nextScreen: function() {
            1 != this.currentScreen && (this.currentScreen++, this.transition())
        },
        prevScreen: function() {
            0 !== this.currentScreen && (this.currentScreen--, this.transition())
        },
        transition: function() {
            this.screenContainer.transitionTo({
                x: -this.boardWidth * this.currentScreen,
                duration: .25,
                easing: "ease-in",
                callback: function() {}
            }),
            0 === this.currentScreen ? (this.prevButton.setVisible(!1), this.nextButton.setVisible(!0)) : 1 === this.currentScreen ? (this.prevButton.setVisible(!0), this.nextButton.setVisible(!1)) : (this.prevButton.setVisible(!0), this.nextButton.setVisible(!0)),
            this.getLayer().draw()
        }
    },
    t.Global.extend(r, s),
    r
}),
define("bh2/gamestate", ["bh2/boardmodel"],
function(t) {
    var e = function(t) {
        this._initGameState(t)
    };
    return e.prototype = {
        _initGameState: function(e) {
            this.config = e,
            this.state_initializing = 0,
            this.state_ready = 1,
            this.state_playing = 2,
            this.state_paused = 3,
            this.state_gameover = 4,
            this.state_highscores = 5,
            this.state_help = 6,
            this.num_states = 7,
            this.state = this.state_initializing,
            this.transitionCallbacks = [],
            this.score = 0,
            this.pops = 0,
            this.shots = 0,
            this.gameOver = !1,
            this.paused = !1,
            this.boardModel = new t({
                nRows: e.gameConfig.nRows,
                nCols: e.gameConfig.nCols,
                nStartRows: e.gameConfig.nStartRows,
                nColors: e.gameConfig.nColors
            })
        },
        ready: function() {
            var t = this.state;
            this.state = this.state_ready,
            this.dispatchCallbacks(t, this.state)
        },
        isReady: function() {
            return this.state === this.state_ready
        },
        play: function() {
            var t = this.state;
            this.state = this.state_playing,
            this.dispatchCallbacks(t, this.state)
        },
        isPlaying: function() {
            return this.state === this.state_playing
        },
        reset: function() {
            this.state = this.state_initializing,
            this.score = 0,
            this.pops = 0,
            this.shots = 0,
            this.gameOver = !1,
            this.paused = !1,
            this.boardModel = new t({
                nRows: this.config.gameConfig.nRows,
                nCols: this.config.gameConfig.nCols,
                nStartRows: this.config.gameConfig.nStartRows,
                nColors: this.config.gameConfig.nColors
            })
        },
        pause: function() {
            var t = this.state;
            this.state = this.state_paused,
            this.dispatchCallbacks(t, this.state)
        },
        resume: function() {
            var t = this.state;
            this.state = this.state_playing,
            this.dispatchCallbacks(t, this.state)
        },
        isPaused: function() {
            return this.state === e.state_paused
        },
        gameOver: function() {
            var t = this.state;
            this.state = this.state_gameover,
            this.dispatchCallbacks(t, this.state)
        },
        isGameOver: function() {
            return this.state === this.state_gameover
        },
        help: function() {
            var t = this.state;
            this.state = this.state_help,
            this.dispatchCallbacks(t, this.state)
        },
        isHelp: function() {
            return this.state === this.state_help
        },
        highScores: function() {
            var t = this.state;
            this.state = this.state_highscores,
            this.dispatchCallbacks(t, this.state)
        },
        isHighScores: function() {
            return this.state === this.state_highscores
        },
        addListener: function(t) {
            this.transitionCallbacks.push(t)
        },
        dispatchCallbacks: function(t, e) {
            for (var i = 0; this.transitionCallbacks.length > i; ++i) {
                var n = this.transitionCallbacks[i];
                n && n(t, e)
            }
        }
    },
    e
}),
define("bh2/gameui", ["kinetic/kinetic", "snack/platform", "snack/coordinates", "snack/textutils", "snack/imagehelper", "snack/button", "snack/digitlabel", "snack/audiomanager", "bh2/switchbutton", "bh2/layout", "bh2/mainmenu", "bh2/highscoresmenu", "bh2/optionsmenu", "bh2/howtoplay", "bh2/gamestate", "bh2/layermanager"],
function(t, e, i, n, s, a, o, r, h, c, l, u, d, g, f, p) {
    var m = {};
    return m = function(t) {
        this._initGameUI(t)
    },
    m.prototype = {
        _initGameUI: function(e) {
            var s = this;
            t.Container.call(this, e),
            this.game = e.game,
            this.gameState = e.gameState,
            this.textUtils = new n({
                locale: "en"
            }),
            this.gameBoard = e.gameBoard,
            this.gameBoard.setUI(this),
            this.boardLayer = p().getLayer("boardOverlayLayer"),
            this.menuLayer = p().getLayer("menuLayer"),
            this.boardCapture = new t.Rect({
                width: e.width,
                height: .9 * e.height
            }),
            this.boardLayer.add(this.boardCapture),
            this.boardCapture.setListening(!1),
            this.scoreLabel = new o({
                numDigits: 8,
                x: i.w2dx(c.scoreLabel.x),
                y: i.w2dy(c.scoreLabel.y),
                width: Math.floor(300 * i.scaleY())
            }),
            this.boardLayer.add(this.scoreLabel),
            this.switchButton = new h({
                gameBoard: this.gameBoard,
                x: i.w2dx(c.switchButton.x),
                y: i.w2dy(c.switchButton.y),
                name: e.gameConfig.switchButtonBase,
                action: function() {
                    this.gameBoard.swapShooter()
                }
            }),
            this.boardLayer.add(this.switchButton),
            this.gameBoard.shooter.watchNextPiece(function(t) {
                s.switchButton.setNextPieceColor(t)
            }),
            this.optionsMenu = new d({
                game: e.game,
                gameState: e.gameState,
                gameConfig: e.gameConfig,
                onShow: function() {
                    s.gameBoard.ignoreInput = !0
                },
                onHide: function() {
                    s.gameBoard.ignoreInput = !1
                }
            }),
            this.optionsMenu.setPosition(i.w2dx(c.optionsMenu.hide.x), i.w2dy(c.optionsMenu.hide.y)),
            this.optionsButton = new a({
                gameState: this.gameState,
                x: i.w2dx(c.optionsButton.x),
                y: i.w2dy(c.optionsButton.y),
                name: e.gameConfig.optionsButtonBase,
                action: function() {
                    s.gameState.pause(),
                    s.optionsMenu.show()
                }
            }),
            this.boardLayer.add(this.optionsButton),
            this.boardLayer.add(this.optionsMenu),
            this.help = new g({
                game: e.game,
                gameState: e.gameState,
                gameConfig: e.gameConfig,
                onShow: function() {
                    s.gameBoard.ignoreInput = !0
                },
                onHide: function() {
                    s.gameBoard.ignoreInput = !1,
                    s.gameState.isPlaying() && p().hideLayer("menuLayer")
                }
            }),
            this.help.hideNow(),
            this.menuLayer.add(this.help),
            this.mainMenu = new l({
                game: e.game,
                gameState: e.gameState,
                gameConfig: e.gameConfig,
                onShow: function() {
                    s.gameBoard.ignoreInput = !0
                },
                onHide: function() {
                    s.gameBoard.ignoreInput = !1,
                    s.gameState.isPlaying() && p().hideLayer("menuLayer")
                }
            }),
            this.menuLayer.add(this.mainMenu),
            this.highScoresMenu = new u({
                game: e.game,
                gameState: e.gameState,
                gameConfig: e.gameConfig,
                onShow: function() {
                    s.gameBoard.ignoreInput = !0
                },
                onHide: function() {
                    s.gameBoard.ignoreInput = !1,
                    s.gameState.isPlaying() && p().hideLayer("menuLayer")
                }
            }),
            this.highScoresMenu.hideNow(),
            this.menuLayer.add(this.highScoresMenu),
            this.gameState.addListener(function(t, e) {
                s.onStateChange(t, e)
            })
        },
        onStateChange: function(t, e) {
            switch (t === this.gameState.state_highscores && this.highScoresMenu.hide(), t === this.gameState.state_paused && this.optionsMenu.hide(), t === this.gameState.state_ready && this.mainMenu.hide(), t === this.gameState.state_help && this.help.hide(), e) {
            case this.gameState.state_ready:
                this.optionsButton.setListening(!1),
                this.switchButton.setListening(!1),
                this.boardCapture.setListening(!1),
                p().showLayer("menuLayer"),
                this.mainMenu.show();
                break;
            case this.gameState.state_playing:
                this.optionsButton.setListening(!0),
                this.switchButton.setListening(!0),
                this.boardCapture.setListening(!0),
                p().showLayer("boardChromeLayer"),
                p().showLayer("shooterLayer"),
                p().showLayer("boardOverlayLayer");
                break;
            case this.gameState.state_paused:
                this.optionsButton.setListening(!1),
                this.switchButton.setListening(!1),
                this.boardCapture.setListening(!1);
                break;
            case this.gameState.state_highscores:
                this.optionsButton.setListening(!1),
                this.switchButton.setListening(!1),
                this.boardCapture.setListening(!1),
                p().showLayer("menuLayer"),
                this.highScoresMenu.show();
                break;
            case this.gameState.state_help:
                this.optionsButton.setListening(!1),
                this.switchButton.setListening(!1),
                this.boardCapture.setListening(!1),
                p().showLayer("menuLayer"),
                this.help.show()
            }
        },
        gameOver: function(t) {
            this.highScoresMenu.updateScores(t),
            this.game.reset(),
            this.game.highScores()
        },
        setScore: function(t) {
            var e = this._formatScore(t);
            this.scoreLabel.setText(e),
            this.boardLayer.draw()
        },
        _formatScore: function(t) {
            return this.textUtils.formatInt(t)
        }
    },
    t.Global.extend(m, t.Container),
    m
}),
define("bh2/game", ["kinetic/kinetic", "snack/platform", "snack/assetmanager", "snack/audiomanager", "snack/coordinates", "snack/stats", "snack/highscores", "bh2/audioconfig", "bh2/layout", "bh2/gameboard", "bh2/gameui", "bh2/gamestate", "bh2/layermanager"],
function(t, e, i, n, s, a, o, r, h, c, l, u, d) {
    var g = {};
    return g = function(t) {
        this._initGame(t)
    },
    g.prototype = {
        _initGame: function(i) {
            var s = this;
            this.scriptLoadProgress = 1,
            this.audioLoadProgress = 0,
            this.imageLoadProgress = 0,
            this.initProgress = 0,
            this.stage = new t.Stage({
                container: i.container,
                width: i.width,
                height: i.height,
                listening: !0
            }),
            new n({
                onready: function() {
                    e.isCrapAudio() ? (s.audioLoadProgress = 1, i.onLoadProgress(s.getLoadProgress()), s._loadResources(i)) : n().loadSounds([{
                        id: "shootSound",
                        volume: r.shoot.volume,
                        url: r.dir + r.shoot.file
                    },
                    {
                        id: "impactSound",
                        volume: r.impact.volume,
                        url: r.dir + r.impact.file
                    },
                    {
                        id: "wallImpactSound",
                        volume: r.wallimpact.volume,
                        url: r.dir + r.wallimpact.file
                    },
                    {
                        id: "pop3",
                        volume: r.pop3.volume,
                        url: r.dir + r.pop3.file
                    },
                    {
                        id: "pop4",
                        volume: r.pop4.volume,
                        url: r.dir + r.pop4.file
                    },
                    {
                        id: "pop5",
                        volume: r.pop5.volume,
                        url: r.dir + r.pop5.file
                    },
                    {
                        id: "pop6",
                        volume: r.pop6.volume,
                        url: r.dir + r.pop6.file
                    },
                    {
                        id: "pop7",
                        volume: r.pop7.volume,
                        url: r.dir + r.pop7.file
                    },
                    {
                        id: "pop8",
                        volume: r.pop8.volume,
                        url: r.dir + r.pop8.file
                    },
                    {
                        id: "pop9",
                        volume: r.pop9.volume,
                        url: r.dir + r.pop9.file
                    },
                    {
                        id: "popBig",
                        volume: r.popBig.volume,
                        url: r.dir + r.popBig.file
                    },
                    {
                        id: "popBigger",
                        volume: r.popBigger.volume,
                        url: r.dir + r.popBigger.file
                    },
                    {
                        id: "popBiggest",
                        volume: r.popBiggest.volume,
                        url: r.dir + r.popBiggest.file
                    },
                    {
                        id: "bubbleSwap",
                        volume: r.bubbleSwap.volume,
                        url: r.dir + r.bubbleSwap.file
                    },
                    {
                        id: "negative",
                        volume: r.negative.volume,
                        url: r.dir + r.negative.file
                    },
                    {
                        id: "rowSpawn",
                        volume: r.rowSpawn.volume,
                        url: r.dir + r.rowSpawn.file
                    },
                    {
                        id: "buttonClick",
                        volume: r.buttonClick.volume,
                        url: r.dir + r.buttonClick.file
                    },
                    {
                        id: "dialogSlideIn",
                        volume: r.dialogSlideIn.volume,
                        url: r.dir + r.dialogSlideIn.file
                    },
                    {
                        id: "dialogSlideOut",
                        volume: r.dialogSlideOut.volume,
                        url: r.dir + r.dialogSlideOut.file
                    },
                    {
                        id: "zinger",
                        volume: r.zinger.volume,
                        url: r.dir + r.zinger.file
                    },
                    {
                        id: "dinger",
                        volume: r.dinger.volume,
                        url: r.dir + r.dinger.file
                    }],
                    function(t, e) {
                        i.onLoadProgress && (s.audioLoadProgress = t / e, i.onLoadProgress(s.getLoadProgress()))
                    },
                    function() {
                        s._loadResources(i)
                    })
                }
            })
        },
        getLoadProgress: function() {
            return.1 * this.scriptLoadProgress + .3 * this.audioLoadProgress + .5 * this.imageLoadProgress + .1 * this.initProgress
        },
        _loadResources: function(t) {
            new i;
            var e = this;
            i().loadAssets([{
                imageURL: t.gameConfig.spriteSheet1URL,
                dataURL: t.gameConfig.spriteSheet1DataURL
            },
            {
                imageURL: t.gameConfig.spriteSheet2URL,
                dataURL: t.gameConfig.spriteSheet2DataURL
            },
            {
                imageURL: t.gameConfig.htpShootingURL
            },
            {
                imageURL: t.gameConfig.htpPowerupsURL
            },
            {
                imageURL: t.gameConfig.boardBorderURL
            },
            {
                imageURL: t.gameConfig.threeSliceTopFlatURL
            },
            {
                imageURL: t.gameConfig.threeSliceTopRoundURL
            },
            {
                imageURL: t.gameConfig.threeSliceMidURL
            },
            {
                imageURL: t.gameConfig.threeSliceBottomURL
            },
            {
                imageURL: t.gameConfig.logoURL
            },
            {
                imageURL: t.gameConfig.highScoresRosterURL
            }],
            function(i, n) {
                t.onLoadProgress && (e.imageLoadProgress = i / n, t.onLoadProgress(e.getLoadProgress()))
            },
            function() {
                e._completeInit(t)
            })
        },
        _completeInit: function(t) {
            var e = this,
            i = t.gameConfig.boardWidth,
            a = t.gameConfig.boardHeight;
            this.gameState = new u(t),
            this.highScoreManager = new o,
            new d({
                stage: this.stage
            }),
            d().createLayer("boardChromeLayer", {
                listening: !1
            }),
            d().createLayer("shooterLayer", {
                x: s.w2dx(h.board.x),
                y: s.w2dy(h.board.y),
                clearBeforeDraw: !1,
                listening: !1
            }),
            d().createLayer("boardOverlayLayer", {
                listening: !0
            }),
            d().createLayer("menuLayer", {
                listening: !0
            }),
            this.board = new c({
                game: this,
                gameState: this.gameState,
                gameConfig: t.gameConfig,
                debug: t.debug,
                stage: this.stage,
                x: (t.width - i) / 2,
                y: s.w2dx(h.board.y),
                width: i,
                height: a
            }),
            t.onLoadProgress && (e.initProgress = .2, t.onLoadProgress(e.getLoadProgress())),
            t.onLoadProgress && (e.initProgress = .4, t.onLoadProgress(e.getLoadProgress())),
            this.gameUI = new l({
                game: this,
                gameState: this.gameState,
                gameConfig: t.gameConfig,
                width: t.width,
                height: t.height,
                gameBoard: this.board
            }),
            t.onLoadProgress && (e.initProgress = .6, t.onLoadProgress(e.getLoadProgress())),
            this.gameState.ready(),
            window.addEventListener("pagehide",
            function() {
                e.gameState.state !== e.gameState.state_ready && e.ready()
            },
            !1),
            t.onLoadProgress && (e.initProgress = 1, t.onLoadProgress(e.getLoadProgress())),
            t.onReady && t.onReady(),
            n().loadMusic({
                url: r.dir + r.music.file
            })
        },
        onResize: function() {},
        start: function() {},
        ready: function() {
            n().pauseMusic(),
            this.gameState.ready()
        },
        isReady: function() {
            return this.gameState.isReady()
        },
        play: function() {
            n().playMusic(),
            this.gameState.play()
        },
        isPlaying: function() {
            return this.gameState.isPlaying()
        },
        reset: function() {
            this.gameState.reset(),
            this.board.reset()
        },
        pause: function() {
            this.gameState.pause()
        },
        resume: function() {
            this.gameState.resume()
        },
        isPaused: function() {
            return this.gameState.isPaused()
        },
        gameOver: function() {
            this.gameState.gameOver()
        },
        isGameOver: function() {
            return this.gameState.isGameOver()
        },
        help: function() {
            this.gameState.help()
        },
        isHelp: function() {
            return this.gameState.isHelp()
        },
        highScores: function() {
            this.gameState.highScores()
        },
        isHighScores: function() {
            return this.gameState.isHighScores()
        }
    },
    g
}),
require.config({
    waitSeconds: 0
}),
require(["snack/coordinates", "snack/debug", "snack/assetmanager", "bh2/gameconfig", "bh2/game"],
function(t, e, i, n, s) {
    var a = new e({
        enabled: !0
    }),
    o = new n({
        width: t.w2dx(1536),
        height: t.w2dx(2008)
    });
    try {
        var r = new s({
            container: "container",
            debug: a,
            gameConfig: o,
            width: t.w2dx(1536),
            height: t.w2dx(2008),
            onLoadProgress: function(t) {
                BHLoader.loadingProgress(t)
            },
            onReady: function() {
                BHLoader.loadingComplete(r)
            }
        });
        r.start()
    } catch(h) {
        console.log("caught exception " + h)
    }
}),
define("main",
function() {});

console.log('updated')
