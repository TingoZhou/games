var CAAT = CAAT || {};
Function.prototype.bind = function () {
    var a = this,
        b = Array.prototype.slice.call(arguments),
        c = b.shift();
    return function () {
        return a.apply(c, b.concat(Array.prototype.slice.call(arguments)))
    }
};
(function () {
    CAAT.Behavior = function () {
        this.lifecycleListenerList = [];
        this.setDefaultInterpolator();
        return this
    };
    CAAT.Behavior.prototype = {
        lifecycleListenerList: null,
        behaviorStartTime: -1,
        behaviorDuration: -1,
        cycleBehavior: false,
        expired: true,
        interpolator: null,
        actor: null,
        id: 0,
        setId: function (a) {
            this.id = a;
            return this
        },
        setDefaultInterpolator: function () {
            this.interpolator = (new CAAT.Interpolator).createLinearInterpolator(false);
            return this
        },
        setPingPong: function () {
            this.interpolator = (new CAAT.Interpolator).createLinearInterpolator(true);
            return this
        },
        setFrameTime: function (a, b) {
            this.behaviorStartTime = a;
            this.behaviorDuration = b;
            this.expired = false;
            return this
        },
        setOutOfFrameTime: function () {
            this.expired = true;
            this.behaviorStartTime = Number.MAX_VALUE;
            this.behaviorDuration = 0;
            return this
        },
        setInterpolator: function (a) {
            this.interpolator = a;
            return this
        },
        apply: function (a, b) {
            var c = a;
            this.isBehaviorInTime(a, b) && (a = this.normalizeTime(a), this.fireBehaviorAppliedEvent(b, c, a, this.setForTime(a, b)))
        },
        setCycle: function (a) {
            this.cycleBehavior = a;
            return this
        },
        addListener: function (a) {
            this.lifecycleListenerList.push(a);
            return this
        },
        emptyListenerList: function () {
            this.lifecycleListenerList = [];
            return this
        },
        getStartTime: function () {
            return this.behaviorStartTime
        },
        getDuration: function () {
            return this.behaviorDuration
        },
        isBehaviorInTime: function (a, b) {
            if (this.expired || this.behaviorStartTime < 0) return false;
            this.cycleBehavior && a >= this.behaviorStartTime && (a = (a - this.behaviorStartTime) % this.behaviorDuration + this.behaviorStartTime);
            return a > this.behaviorStartTime + this.behaviorDuration ?
                (this.expired || this.setExpired(b, a), false) : this.behaviorStartTime <= a && a < this.behaviorStartTime + this.behaviorDuration
        },
        fireBehaviorExpiredEvent: function (a, b) {
            for (var c = 0; c < this.lifecycleListenerList.length; c++) this.lifecycleListenerList[c].behaviorExpired(this, b, a)
        },
        fireBehaviorAppliedEvent: function (a, b, c, d) {
            for (var e = 0; e < this.lifecycleListenerList.length; e++) this.lifecycleListenerList[e].behaviorApplied && this.lifecycleListenerList[e].behaviorApplied(this, b, c, a, d)
        },
        normalizeTime: function (a) {
            a -= this.behaviorStartTime;
            this.cycleBehavior && (a %= this.behaviorDuration);
            return this.interpolator.getPosition(a / this.behaviorDuration).y
        },
        setExpired: function (a, b) {
            this.expired = true;
            this.setForTime(this.interpolator.getPosition(1).y, a);
            this.fireBehaviorExpiredEvent(a, b)
        },
        setForTime: function () {},
        initialize: function (a) {
            if (a)
                for (var b in a) this[b] = a[b];
            return this
        }
    }
})();
(function () {
    CAAT.ContainerBehavior = function () {
        CAAT.ContainerBehavior.superclass.constructor.call(this);
        this.behaviors = [];
        return this
    };
    CAAT.ContainerBehavior.prototype = {
        behaviors: null,
        addBehavior: function (a) {
            this.behaviors.push(a);
            a.addListener(this);
            return this
        },
        apply: function (a, b) {
            if (this.isBehaviorInTime(a, b)) {
                a -= this.getStartTime();
                this.cycleBehavior && (a %= this.getDuration());
                for (var c = this.behaviors, d = 0; d < c.length; d++) c[d].apply(a, b)
            }
        },
        setInterpolator: function () {
            return this
        },
        behaviorExpired: function (a) {
            if (this.cycleBehavior) a.expired =
                false
        },
        setForTime: function (a, b) {
            for (var c = this.behaviors, d = 0; d < c.length; d++) c[d].setForTime(a, b);
            return null
        },
        setExpired: function (a, b) {
            CAAT.ContainerBehavior.superclass.setExpired.call(this, a, b);
            for (var c = this.behaviors, d = 0; d < c.length; d++) {
                var e = c[d];
                e.expired || e.setExpired(a, b - this.behaviorStartTime)
            }
            this.fireBehaviorExpiredEvent(a, b);
            return this
        },
        setFrameTime: function (a, b) {
            CAAT.ContainerBehavior.superclass.setFrameTime.call(this, a, b);
            for (var c = this.behaviors, d = 0; d < c.length; d++) c[d].expired = false;
            return this
        }
    };
    extend(CAAT.ContainerBehavior, CAAT.Behavior, null)
})();
(function () {
    CAAT.RotateBehavior = function () {
        CAAT.RotateBehavior.superclass.constructor.call(this);
        this.anchor = CAAT.Actor.prototype.ANCHOR_CENTER;
        return this
    };
    CAAT.RotateBehavior.prototype = {
        startAngle: 0,
        endAngle: 0,
        anchorX: 0.5,
        anchorY: 0.5,
        setForTime: function (a, b) {
            var c = this.startAngle + a * (this.endAngle - this.startAngle);
            b.setRotationAnchored(c, this.anchorX, this.anchorY);
            return c
        },
        setValues: function (a, b, c, d) {
            this.startAngle = a;
            this.endAngle = b;
            if (typeof c !== "undefined" && typeof d !== "undefined") this.anchorX =
                c, this.anchorY = d;
            return this
        },
        setAngles: function (a, b) {
            return this.setValues(a, b)
        },
        setAnchor: function (a, b, c) {
            this.anchorX = b / a.width;
            this.anchorY = c / a.height;
            return this
        }
    };
    extend(CAAT.RotateBehavior, CAAT.Behavior, null)
})();
(function () {
    CAAT.GenericBehavior = function () {
        CAAT.GenericBehavior.superclass.constructor.call(this);
        return this
    };
    CAAT.GenericBehavior.prototype = {
        start: 0,
        end: 0,
        target: null,
        property: null,
        callback: null,
        setForTime: function (a, b) {
            var c = this.start + a * (this.end - this.start);
            this.callback && this.callback(c, this.target, b);
            this.property && (this.target[this.property] = c)
        },
        setValues: function (a, b, c, d, e) {
            this.start = a;
            this.end = b;
            this.target = c;
            this.property = d;
            this.callback = e;
            return this
        }
    };
    extend(CAAT.GenericBehavior, CAAT.Behavior,
        null)
})();
(function () {
    CAAT.ScaleBehavior = function () {
        CAAT.ScaleBehavior.superclass.constructor.call(this);
        this.anchor = CAAT.Actor.prototype.ANCHOR_CENTER;
        return this
    };
    CAAT.ScaleBehavior.prototype = {
        startScaleX: 1,
        endScaleX: 1,
        startScaleY: 1,
        endScaleY: 1,
        anchorX: 0.5,
        anchorY: 0.5,
        setForTime: function (a, b) {
            var c = this.startScaleX + a * (this.endScaleX - this.startScaleX),
                d = this.startScaleY + a * (this.endScaleY - this.startScaleY);
            0 === c && (c = 0.01);
            0 === d && (d = 0.01);
            b.setScaleAnchored(c, d, this.anchorX, this.anchorY);
            return {
                scaleX: c,
                scaleY: d
            }
        },
        setValues: function (a, b, c, d, e, f) {
            this.startScaleX = a;
            this.endScaleX = b;
            this.startScaleY = c;
            this.endScaleY = d;
            if (typeof e !== "undefined" && typeof f !== "undefined") this.anchorX = e, this.anchorY = f;
            return this
        },
        setAnchor: function (a, b, c) {
            this.anchorX = b / a.width;
            this.anchorY = c / a.height;
            return this
        }
    };
    extend(CAAT.ScaleBehavior, CAAT.Behavior, null)
})();
(function () {
    CAAT.AlphaBehavior = function () {
        CAAT.AlphaBehavior.superclass.constructor.call(this);
        return this
    };
    CAAT.AlphaBehavior.prototype = {
        startAlpha: 0,
        endAlpha: 0,
        setForTime: function (a, b) {
            var c = this.startAlpha + a * (this.endAlpha - this.startAlpha);
            b.setAlpha(c);
            return c
        },
        setValues: function (a, b) {
            this.startAlpha = a;
            this.endAlpha = b;
            return this
        }
    };
    extend(CAAT.AlphaBehavior, CAAT.Behavior, null)
})();
(function () {
    CAAT.PathBehavior = function () {
        CAAT.PathBehavior.superclass.constructor.call(this);
        return this
    };
    CAAT.PathBehavior.autorotate = {
        LEFT_TO_RIGHT: 0,
        RIGHT_TO_LEFT: 1,
        FREE: 2
    };
    CAAT.PathBehavior.prototype = {
        path: null,
        autoRotate: false,
        prevX: -1,
        prevY: -1,
        autoRotateOp: CAAT.PathBehavior.autorotate.FREE,
        translateX: 0,
        translateY: 0,
        setAutoRotate: function (a, b) {
            this.autoRotate = a;
            if (b !== void 0) this.autoRotateOp = b;
            return this
        },
        setPath: function (a) {
            this.path = a;
            return this
        },
        setValues: function (a) {
            return this.setPath(a)
        },
        setFrameTime: function (a, b) {
            CAAT.PathBehavior.superclass.setFrameTime.call(this, a, b);
            this.prevY = this.prevX = -1;
            return this
        },
        setTranslation: function (a, b) {
            this.translateX = a;
            this.translateY = b;
            return this
        },
        setForTime: function (a, b) {
            if (!this.path) return {
                x: b.x,
                y: b.y
            };
            var c = this.path.getPosition(a);
            if (this.autoRotate) {
                if (-1 === this.prevX && -1 === this.prevY) this.prevX = c.x, this.prevY = c.y;
                var d = c.x - this.prevX,
                    e = c.y - this.prevY;
                if (d === 0 && e === 0) return b.setLocation(c.x - this.translateX, c.y - this.translateY), {
                    x: b.x,
                    y: b.y
                };
                var f = Math.atan2(e, d),
                    g = CAAT.SpriteImage.prototype,
                    h = CAAT.PathBehavior.autorotate;
                this.autoRotateOp === h.LEFT_TO_RIGHT ? this.prevX <= c.x ? b.setImageTransformation(g.TR_NONE) : (b.setImageTransformation(g.TR_FLIP_HORIZONTAL), f += Math.PI) : this.autoRotateOp === h.RIGHT_TO_LEFT && (this.prevX <= c.x ? b.setImageTransformation(g.TR_FLIP_HORIZONTAL) : (b.setImageTransformation(g.TR_NONE), f -= Math.PI));
                b.setRotation(f);
                this.prevX = c.x;
                this.prevY = c.y;
                Math.sqrt(d * d + e * e)
            }
            b.setLocation(c.x - this.translateX, c.y - this.translateY);
            return {
                x: b.x,
                y: b.y
            }
        },
        positionOnTime: function (a) {
            return this.isBehaviorInTime(a, null) ? (a = this.normalizeTime(a), this.path.getPosition(a)) : {
                x: -1,
                y: -1
            }
        }
    };
    extend(CAAT.PathBehavior, CAAT.Behavior, null)
})();
(function () {
    CAAT.BrowserDetect = function () {
        this.init();
        return this
    };
    CAAT.BrowserDetect.prototype = {
        browser: "",
        version: 0,
        OS: "",
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS"
        },
        searchString: function (a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b].string,
                    d = a[b].prop;
                this.versionSearchString = a[b].versionSearch ||
                    a[b].identity;
                if (c) {
                    if (c.indexOf(a[b].subString) !== -1) return a[b].identity
                } else if (d) return a[b].identity
            }
        },
        searchVersion: function (a) {
            var b = a.indexOf(this.versionSearchString);
            return b === -1 ? void 0 : parseFloat(a.substring(b + this.versionSearchString.length + 1))
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, {
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
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
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, {
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
        dataOS: [{
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
            identity: "iPhone/iPod"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }]
    }
})();

function extend(a, b) {
    var c = a.prototype,
        d = function () {};
    d.prototype = b.prototype;
    a.prototype = new d;
    a.superclass = b.prototype;
    a.prototype.constructor = a;
    if (b.prototype.constructor === Object.prototype.constructor) b.prototype.constructor = b;
    for (var e in c) c.hasOwnProperty(e) && (a.prototype[e] = c[e])
}

function proxy(a, b, c, d) {
    if (typeof a === "function") return a.__isProxy ? a : function (a) {
        var e = function () {
            b && b({
                fn: a,
                arguments: Array.prototype.slice.call(arguments)
            });
            var e = null;
            try {
                e = a.apply(a, Array.prototype.slice.call(arguments)), c && c({
                    fn: a,
                    arguments: Array.prototype.slice.call(arguments)
                })
            } catch (f) {
                if (d) e = d({
                    fn: a,
                    arguments: Array.prototype.slice.call(arguments),
                    exception: f
                });
                else throw f;
            }
            return e
        };
        e.__isProxy = true;
        return e
    }(a);
    if (!typeof a === "object" || a.constructor === Array || a.constructor === String || a.__isProxy) return a;
    var e = new function () {};
    e.__object = a;
    e.__isProxy = true;
    for (var f in a) typeof a[f] === "function" && (e[f] = function (a, e, f) {
        return function () {
            b && b({
                object: a.__object,
                method: f,
                arguments: Array.prototype.slice.call(arguments)
            });
            var k = null;
            try {
                k = e.apply(a.__object, arguments), c && c({
                    object: a.__object,
                    method: f,
                    arguments: Array.prototype.slice.call(arguments)
                })
            } catch (l) {
                if (d) k = d({
                    object: a.__object,
                    method: f,
                    arguments: Array.prototype.slice.call(arguments),
                    exception: l
                });
                else throw l;
            }
            return k
        }
    }(e, a[f], f));
    return e
}
(function () {
    CAAT.Matrix3 = function () {
        this.matrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.fmatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        return this
    };
    CAAT.Matrix3.prototype = {
        matrix: null,
        fmatrix: null,
        transformCoord: function (a) {
            var b = a.x,
                c = a.y,
                d = a.z;
            a.x = b * this.matrix[0][0] + c * this.matrix[0][1] + d * this.matrix[0][2] + this.matrix[0][3];
            a.y = b * this.matrix[1][0] + c * this.matrix[1][1] + d * this.matrix[1][2] + this.matrix[1][3];
            a.z = b * this.matrix[2][0] + c * this.matrix[2][1] + d * this.matrix[2][2] + this.matrix[2][3];
            return a
        },
        initialize: function (a, b, c, d, e, f, g, h, j) {
            this.identity();
            this.matrix[0][0] = a;
            this.matrix[0][1] = b;
            this.matrix[0][2] = c;
            this.matrix[1][0] = d;
            this.matrix[1][1] = e;
            this.matrix[1][2] = f;
            this.matrix[2][0] = g;
            this.matrix[2][1] = h;
            this.matrix[2][2] = j;
            return this
        },
        initWithMatrix: function (a) {
            this.matrix = a;
            return this
        },
        flatten: function () {
            var a = this.fmatrix,
                b = this.matrix;
            a[0] = b[0][0];
            a[1] = b[1][0];
            a[2] = b[2][0];
            a[3] = b[3][0];
            a[4] = b[0][1];
            a[5] = b[1][1];
            a[6] = b[2][1];
            a[7] = b[2][1];
            a[8] = b[0][2];
            a[9] = b[1][2];
            a[10] = b[2][2];
            a[11] =
                b[3][2];
            a[12] = b[0][3];
            a[13] = b[1][3];
            a[14] = b[2][3];
            a[15] = b[3][3];
            return this.fmatrix
        },
        identity: function () {
            for (var a = 0; a < 4; a++)
                for (var b = 0; b < 4; b++) this.matrix[a][b] = a === b ? 1 : 0;
            return this
        },
        getMatrix: function () {
            return this.matrix
        },
        rotateXY: function (a) {
            return this.rotate(a, 0, 0)
        },
        rotateXZ: function (a) {
            return this.rotate(0, a, 0)
        },
        rotateYZ: function (a) {
            return this.rotate(0, 0, a)
        },
        setRotate: function (a, b, c) {
            this.copy(this.rotate(a, b, c));
            return this
        },
        rotate: function (a, b, c) {
            var d = new CAAT.Matrix3,
                e, f;
            a !== 0 && (f = new CAAT.Matrix3,
                e = Math.sin(a), a = Math.cos(a), f.matrix[1][1] = a, f.matrix[1][2] = -e, f.matrix[2][1] = e, f.matrix[2][2] = a, d.multiply(f));
            b !== 0 && (f = new CAAT.Matrix3, e = Math.sin(b), a = Math.cos(b), f.matrix[0][0] = a, f.matrix[0][2] = -e, f.matrix[2][0] = e, f.matrix[2][2] = a, d.multiply(f));
            c !== 0 && (f = new CAAT.Matrix3, e = Math.sin(c), a = Math.cos(c), f.matrix[0][0] = a, f.matrix[0][1] = -e, f.matrix[1][0] = e, f.matrix[1][1] = a, d.multiply(f));
            return d
        },
        getClone: function () {
            var a = new CAAT.Matrix3;
            a.copy(this);
            return a
        },
        multiply: function (a) {
            var b = this.getClone().matrix,
                c = b[0][0],
                d = b[0][1],
                e = b[0][2],
                f = b[0][3],
                g = b[1][0],
                h = b[1][1],
                j = b[1][2],
                k = b[1][3],
                l = b[2][0],
                m = b[2][1],
                o = b[2][2],
                b = b[2][3],
                n = a.matrix,
                a = n[0][0],
                p = n[0][1],
                q = n[0][2],
                r = n[0][3],
                s = n[1][0],
                t = n[1][1],
                u = n[1][2],
                v = n[1][3],
                w = n[2][0],
                x = n[2][1],
                y = n[2][2],
                z = n[2][3],
                A = n[3][0],
                B = n[3][1],
                C = n[3][2],
                n = n[3][3];
            this.matrix[0][0] = c * a + d * s + e * w + f * A;
            this.matrix[0][1] = c * p + d * t + e * x + f * B;
            this.matrix[0][2] = c * q + d * u + e * y + f * C;
            this.matrix[0][3] = c * r + d * v + e * z + f * n;
            this.matrix[1][0] = g * a + h * s + j * w + k * A;
            this.matrix[1][1] = g * p + h * t + j * x + k * B;
            this.matrix[1][2] =
                g * q + h * u + j * y + k * C;
            this.matrix[1][3] = g * r + h * v + j * z + k * n;
            this.matrix[2][0] = l * a + m * s + o * w + b * A;
            this.matrix[2][1] = l * p + m * t + o * x + b * B;
            this.matrix[2][2] = l * q + m * u + o * y + b * C;
            this.matrix[2][3] = l * r + m * v + o * z + b * n;
            return this
        },
        premultiply: function (a) {
            var b = this.getClone().matrix,
                c = b[0][0],
                d = b[0][1],
                e = b[0][2],
                f = b[0][3],
                g = b[1][0],
                h = b[1][1],
                j = b[1][2],
                k = b[1][3],
                l = b[2][0],
                m = b[2][1],
                o = b[2][2],
                b = b[2][3],
                n = a.matrix,
                a = n[0][0],
                p = n[0][1],
                q = n[0][2],
                r = n[0][3],
                s = n[1][0],
                t = n[1][1],
                u = n[1][2],
                v = n[1][3],
                w = n[2][0],
                x = n[2][1],
                y = n[2][2],
                n = n[2][3];
            this.matrix[0][0] = c * a + d * s + e * w;
            this.matrix[0][1] = c * p + d * t + e * x;
            this.matrix[0][2] = c * q + d * u + e * y;
            this.matrix[0][3] = c * r + d * v + e * n + f;
            this.matrix[1][0] = g * a + h * s + j * w;
            this.matrix[1][1] = g * p + h * t + j * x;
            this.matrix[1][2] = g * q + h * u + j * y;
            this.matrix[1][3] = g * r + h * v + j * n + k;
            this.matrix[2][0] = l * a + m * s + o * w;
            this.matrix[2][1] = l * p + m * t + o * x;
            this.matrix[2][2] = l * q + m * u + o * y;
            this.matrix[2][3] = l * r + m * v + o * n + b;
            return this
        },
        setTranslate: function (a, b, c) {
            this.identity();
            this.matrix[0][3] = a;
            this.matrix[1][3] = b;
            this.matrix[2][3] = c;
            return this
        },
        translate: function (a,
            b, c) {
            var d = new CAAT.Matrix3;
            d.setTranslate(a, b, c);
            return d
        },
        setScale: function (a, b, c) {
            this.identity();
            this.matrix[0][0] = a;
            this.matrix[1][1] = b;
            this.matrix[2][2] = c;
            return this
        },
        scale: function (a, b, c) {
            var d = new CAAT.Matrix3;
            d.setScale(a, b, c);
            return d
        },
        rotateModelView: function (a, b, c) {
            var d = Math.sin(a),
                e = Math.sin(b),
                f = Math.sin(c),
                a = Math.cos(a),
                b = Math.cos(b),
                c = Math.cos(c);
            this.matrix[0][0] = b * a;
            this.matrix[0][1] = -b * d;
            this.matrix[0][2] = e;
            this.matrix[0][3] = 0;
            this.matrix[1][0] = f * e * a + d * c;
            this.matrix[1][1] = c * a -
                f * e * d;
            this.matrix[1][2] = -f * b;
            this.matrix[1][3] = 0;
            this.matrix[2][0] = f * d - c * e * a;
            this.matrix[2][1] = c * e * d + f * a;
            this.matrix[2][2] = c * b;
            this.matrix[2][3] = 0;
            this.matrix[3][0] = 0;
            this.matrix[3][1] = 0;
            this.matrix[3][2] = 0;
            this.matrix[3][3] = 1;
            return this
        },
        copy: function (a) {
            for (var b = 0; b < 4; b++)
                for (var c = 0; c < 4; c++) this.matrix[b][c] = a.matrix[b][c];
            return this
        },
        calculateDeterminant: function () {
            var a = this.matrix,
                b = a[0][0],
                c = a[0][1],
                d = a[0][2],
                e = a[0][3],
                f = a[1][0],
                g = a[1][1],
                h = a[1][2],
                j = a[1][3],
                k = a[2][0],
                l = a[2][1],
                m = a[2][2],
                o = a[2][3],
                n = a[3][0],
                p = a[3][1],
                q = a[3][2],
                a = a[3][3];
            return e * g * m * n + c * j * m * n + e * h * k * p + d * j * k * p + d * f * o * p + b * h * o * p + e * f * l * q + b * j * l * q + d * g * k * a + c * h * k * a + c * f * m * a + b * g * m * a + e * h * l * n - d * j * l * n - d * g * o * n - c * h * o * n - e * f * m * p - b * j * m * p - e * g * k * q - c * j * k * q - c * f * o * q - b * g * o * q - d * f * l * a - b * h * l * a
        },
        getInverse: function () {
            var a = this.matrix,
                b = a[0][0],
                c = a[0][1],
                d = a[0][2],
                e = a[0][3],
                f = a[1][0],
                g = a[1][1],
                h = a[1][2],
                j = a[1][3],
                k = a[2][0],
                l = a[2][1],
                m = a[2][2],
                o = a[2][3],
                n = a[3][0],
                p = a[3][1],
                q = a[3][2],
                a = a[3][3],
                r = new CAAT.Matrix3;
            r.matrix[0][0] = h * o * p + j * l * q + g * m * a -
                j * m * p - g * o * q - h * l * a;
            r.matrix[0][1] = e * m * p + c * o * q + d * l * a - c * m * a - d * o * p - e * l * q;
            r.matrix[0][2] = d * j * p + c * h * a + e * g * q - c * j * q - d * g * a - e * h * p;
            r.matrix[0][3] = e * h * l + c * j * m + d * g * o - d * j * l - e * g * m - c * h * o;
            r.matrix[1][0] = j * m * n + f * o * q + h * k * a - h * o * n - j * k * q - f * m * a;
            r.matrix[1][1] = d * o * n + e * k * q + b * m * a - e * m * n - b * o * q - d * k * a;
            r.matrix[1][2] = e * h * n + b * j * q + d * f * a - d * j * n - e * f * q - b * h * a;
            r.matrix[1][3] = d * j * k + e * f * m + b * h * o - e * h * k - b * j * m - d * f * o;
            r.matrix[2][0] = g * o * n + j * k * p + f * l * a - j * l * n - f * o * p - g * k * a;
            r.matrix[2][1] = e * l * n + b * o * p + c * k * a - b * l * a - c * o * n - e * k * p;
            r.matrix[2][2] = d * j * n + e * f *
                p + b * g * a - e * g * n - b * j * p - c * f * a;
            r.matrix[2][3] = e * g * k + b * j * l + c * f * o - b * g * o - c * j * k - e * f * l;
            r.matrix[3][0] = h * l * n + f * m * p + g * k * q - g * m * n - h * k * p - f * l * q;
            r.matrix[3][1] = c * m * n + d * k * p + b * l * q - d * l * n - b * m * p - c * k * q;
            r.matrix[3][2] = d * g * n + b * h * p + c * f * q - b * g * q - c * h * n - d * f * p;
            r.matrix[3][3] = c * h * k + d * f * l + b * g * m - d * g * k - b * h * l - c * f * m;
            return r.multiplyScalar(1 / this.calculateDeterminant())
        },
        multiplyScalar: function (a) {
            var b, c;
            for (b = 0; b < 4; b++)
                for (c = 0; c < 4; c++) this.matrix[b][c] *= a;
            return this
        }
    }
})();
(function () {
    CAAT.Matrix = function () {
        this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        return this
    };
    CAAT.Matrix.prototype = {
        matrix: null,
        transformCoord: function (a) {
            var b = a.x,
                c = a.y,
                d = this.matrix;
            a.x = b * d[0] + c * d[1] + d[2];
            a.y = b * d[3] + c * d[4] + d[5];
            return a
        },
        rotate: function (a) {
            var b = new CAAT.Matrix;
            b.setRotation(a);
            return b
        },
        setRotation: function (a) {
            this.identity();
            var b = this.matrix,
                c = Math.cos(a),
                a = Math.sin(a);
            b[0] = c;
            b[1] = -a;
            b[3] = a;
            b[4] = c;
            return this
        },
        scale: function (a, b) {
            var c = new CAAT.Matrix;
            c.matrix[0] = a;
            c.matrix[4] = b;
            return c
        },
        setScale: function (a, b) {
            this.identity();
            this.matrix[0] = a;
            this.matrix[4] = b;
            return this
        },
        translate: function (a, b) {
            var c = new CAAT.Matrix;
            c.matrix[2] = a;
            c.matrix[5] = b;
            return c
        },
        setTranslate: function (a, b) {
            this.identity();
            this.matrix[2] = a;
            this.matrix[5] = b;
            return this
        },
        copy: function (a) {
            var a = a.matrix,
                b = this.matrix;
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            return this
        },
        identity: function () {
            var a = this.matrix;
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 1;
            a[5] = 0;
            a[6] = 0;
            a[7] =
                0;
            a[8] = 1;
            return this
        },
        multiply: function (a) {
            var b = this.matrix,
                c = a.matrix,
                a = b[0],
                d = b[1],
                e = b[2],
                f = b[3],
                g = b[4],
                h = b[5],
                j = b[6],
                k = b[7],
                l = b[8],
                m = c[0],
                o = c[1],
                n = c[2],
                p = c[3],
                q = c[4],
                r = c[5],
                s = c[6],
                t = c[7],
                c = c[8];
            b[0] = a * m + d * p + e * s;
            b[1] = a * o + d * q + e * t;
            b[2] = a * n + d * r + e * c;
            b[3] = f * m + g * p + h * s;
            b[4] = f * o + g * q + h * t;
            b[5] = f * n + g * r + h * c;
            b[6] = j * m + k * p + l * s;
            b[7] = j * o + k * q + l * t;
            b[8] = j * n + k * r + l * c;
            return this
        },
        premultiply: function (a) {
            var b = a.matrix[0] * this.matrix[1] + a.matrix[1] * this.matrix[4] + a.matrix[2] * this.matrix[7],
                c = a.matrix[0] * this.matrix[2] +
                    a.matrix[1] * this.matrix[5] + a.matrix[2] * this.matrix[8],
                d = a.matrix[3] * this.matrix[0] + a.matrix[4] * this.matrix[3] + a.matrix[5] * this.matrix[6],
                e = a.matrix[3] * this.matrix[1] + a.matrix[4] * this.matrix[4] + a.matrix[5] * this.matrix[7],
                f = a.matrix[3] * this.matrix[2] + a.matrix[4] * this.matrix[5] + a.matrix[5] * this.matrix[8],
                g = a.matrix[6] * this.matrix[0] + a.matrix[7] * this.matrix[3] + a.matrix[8] * this.matrix[6],
                h = a.matrix[6] * this.matrix[1] + a.matrix[7] * this.matrix[4] + a.matrix[8] * this.matrix[7],
                j = a.matrix[6] * this.matrix[2] + a.matrix[7] *
                    this.matrix[5] + a.matrix[8] * this.matrix[8];
            this.matrix[0] = a.matrix[0] * this.matrix[0] + a.matrix[1] * this.matrix[3] + a.matrix[2] * this.matrix[6];
            this.matrix[1] = b;
            this.matrix[2] = c;
            this.matrix[3] = d;
            this.matrix[4] = e;
            this.matrix[5] = f;
            this.matrix[6] = g;
            this.matrix[7] = h;
            this.matrix[8] = j;
            return this
        },
        getInverse: function () {
            var a = this.matrix,
                b = a[0],
                c = a[1],
                d = a[2],
                e = a[3],
                f = a[4],
                g = a[5],
                h = a[6],
                j = a[7],
                a = a[8],
                k = new CAAT.Matrix,
                l = b * (f * a - j * g) - e * (c * a - j * d) + h * (c * g - f * d);
            if (l === 0) return null;
            var m = k.matrix;
            m[0] = f * a - g * j;
            m[1] = d *
                j - c * a;
            m[2] = c * g - d * f;
            m[3] = g * h - e * a;
            m[4] = b * a - d * h;
            m[5] = d * e - b * g;
            m[6] = e * j - f * h;
            m[7] = c * h - b * j;
            m[8] = b * f - c * e;
            k.multiplyScalar(1 / l);
            return k
        },
        multiplyScalar: function (a) {
            var b;
            for (b = 0; b < 9; b++) this.matrix[b] *= a;
            return this
        },
        transformRenderingContextSet: function (a) {
            var b = this.matrix;
            a.setTransform(b[0], b[3], b[1], b[4], b[2], b[5]);
            return this
        },
        transformRenderingContext: function (a) {
            var b = this.matrix;
            a.transform(b[0], b[3], b[1], b[4], b[2], b[5]);
            return this
        }
    }
})();
(function () {
    CAAT.MatrixStack = function () {
        this.stack = [];
        this.saved = [];
        return this
    };
    CAAT.MatrixStack.prototype = {
        stack: null,
        saved: null,
        pushMatrix: function (a) {
            this.stack.push(a);
            return this
        },
        popMatrix: function () {
            return this.stack.pop()
        },
        save: function () {
            this.saved.push(this.stack.length);
            return this
        },
        restore: function () {
            for (var a = this.saved.pop(); this.stack.length !== a;) this.popMatrix();
            return this
        },
        getMatrix: function () {
            for (var a = new CAAT.Matrix, b = 0; b < this.stack.length; b++) a.multiply(this.stack[b]);
            return a
        }
    }
})();
(function () {
    CAAT.Color = function () {
        return this
    };
    CAAT.Color.prototype = {
        hsvToRgb: function (a, b, c) {
            var d, e, f, a = Math.max(0, Math.min(360, a)),
                b = Math.max(0, Math.min(100, b)),
                c = Math.max(0, Math.min(100, c));
            b /= 100;
            c /= 100;
            if (b === 0) return d = b = c, [Math.round(d * 255), Math.round(b * 255), Math.round(c * 255)];
            a /= 60;
            d = Math.floor(a);
            e = a - d;
            a = c * (1 - b);
            f = c * (1 - b * e);
            e = c * (1 - b * (1 - e));
            switch (d) {
            case 0:
                d = c;
                b = e;
                c = a;
                break;
            case 1:
                d = f;
                b = c;
                c = a;
                break;
            case 2:
                d = a;
                b = c;
                c = e;
                break;
            case 3:
                d = a;
                b = f;
                break;
            case 4:
                d = e;
                b = a;
                break;
            default:
                d = c, b = a, c = f
            }
            return new CAAT.Color.RGB(Math.round(d *
                255), Math.round(b * 255), Math.round(c * 255))
        },
        RampEnumeration: {
            RAMP_RGBA: 0,
            RAMP_RGB: 1,
            RAMP_CHANNEL_RGB: 2,
            RAMP_CHANNEL_RGBA: 3,
            RAMP_CHANNEL_RGB_ARRAY: 4,
            RAMP_CHANNEL_RGBA_ARRAY: 5
        },
        interpolate: function (a, b, c, d, e, f, g, h) {
            if (h <= 0) return {
                r: a,
                g: b,
                b: c
            };
            else if (h >= g) return {
                r: d,
                g: e,
                b: f
            };
            a = a + (d - a) / g * h >> 0;
            b = b + (e - b) / g * h >> 0;
            c = c + (f - c) / g * h >> 0;
            a > 255 ? a = 255 : a < 0 && (a = 0);
            b > 255 ? b = 255 : b < 0 && (b = 0);
            c > 255 ? c = 255 : c < 0 && (c = 0);
            return {
                r: a,
                g: b,
                b: c
            }
        },
        makeRGBColorRamp: function (a, b, c) {
            var d = [],
                e = a.length - 1;
            b /= e;
            for (var f = 0; f < e; f++) {
                var g =
                    a[f],
                    h = g >> 24 & 255,
                    j = (g & 16711680) >> 16,
                    k = (g & 65280) >> 8;
                g &= 255;
                for (var l = a[f + 1], m = ((l >> 24 & 255) - h) / b, o = (((l & 16711680) >> 16) - j) / b, n = (((l & 65280) >> 8) - k) / b, l = ((l & 255) - g) / b, p = 0; p < b; p++) {
                    var q = h + m * p >> 0,
                        r = j + o * p >> 0,
                        s = k + n * p >> 0,
                        t = g + l * p >> 0;
                    switch (c) {
                    case this.RampEnumeration.RAMP_RGBA:
                        d.push("argb(" + q + "," + r + "," + s + "," + t + ")");
                        break;
                    case this.RampEnumeration.RAMP_RGB:
                        d.push("rgb(" + r + "," + s + "," + t + ")");
                        break;
                    case this.RampEnumeration.RAMP_CHANNEL_RGB:
                        d.push(4278190080 | r << 16 | s << 8 | t);
                        break;
                    case this.RampEnumeration.RAMP_CHANNEL_RGBA:
                        d.push(q <<
                            24 | r << 16 | s << 8 | t);
                        break;
                    case this.RampEnumeration.RAMP_CHANNEL_RGBA_ARRAY:
                        d.push([r, s, t, q]);
                        break;
                    case this.RampEnumeration.RAMP_CHANNEL_RGB_ARRAY:
                        d.push([r, s, t])
                    }
                }
            }
            return d
        }
    }
})();
(function () {
    CAAT.Color.RGB = function (a, b, c) {
        this.r = a || 255;
        this.g = b || 255;
        this.b = c || 255;
        return this
    };
    CAAT.Color.RGB.prototype = {
        r: 255,
        g: 255,
        b: 255,
        toHex: function () {
            return ("000000" + ((this.r << 16) + (this.g << 8) + this.b).toString(16)).slice(-6)
        }
    }
})();
(function () {
    CAAT.Rectangle = function () {
        return this
    };
    CAAT.Rectangle.prototype = {
        x: 0,
        y: 0,
        x1: 0,
        y1: 0,
        width: -1,
        height: -1,
        setEmpty: function () {
            this.height = this.width = -1;
            return this
        },
        setLocation: function (a, b) {
            this.x = a;
            this.y = b;
            this.x1 = this.x + this.width;
            this.y1 = this.y + this.height;
            return this
        },
        setDimension: function (a, b) {
            this.width = a;
            this.height = b;
            this.x1 = this.x + this.width;
            this.y1 = this.y + this.height;
            return this
        },
        contains: function (a, b) {
            return a >= 0 && a < this.width && b >= 0 && b < this.height
        },
        isEmpty: function () {
            return this.width === -1 && this.height === -1
        },
        union: function (a, b) {
            if (this.isEmpty()) this.x1 = this.x = a, this.y1 = this.y = b, this.height = this.width = 0;
            else {
                this.x1 = this.x + this.width;
                this.y1 = this.y + this.height;
                if (b < this.y) this.y = b;
                if (a < this.x) this.x = a;
                if (b > this.y1) this.y1 = b;
                if (a > this.x1) this.x1 = a;
                this.width = this.x1 - this.x;
                this.height = this.y1 - this.y
            }
        },
        unionRectangle: function (a) {
            this.union(a.x, a.y);
            this.union(a.x1, a.y);
            this.union(a.x, a.y1);
            this.union(a.x1, a.y1);
            return this
        }
    }
})();
(function () {
    CAAT.Curve = function () {
        return this
    };
    CAAT.Curve.prototype = {
        coordlist: null,
        k: 0.05,
        length: -1,
        interpolator: false,
        HANDLE_SIZE: 20,
        drawHandles: true,
        paint: function (a) {
            if (false !== this.drawHandles) {
                a = a.ctx;
                a.save();
                a.beginPath();
                a.strokeStyle = "#a0a0a0";
                a.moveTo(this.coordlist[0].x, this.coordlist[0].y);
                a.lineTo(this.coordlist[1].x, this.coordlist[1].y);
                a.stroke();
                this.cubic && (a.moveTo(this.coordlist[2].x, this.coordlist[2].y), a.lineTo(this.coordlist[3].x, this.coordlist[3].y), a.stroke());
                a.globalAlpha =
                    0.5;
                for (var b = 0; b < this.coordlist.length; b++) a.fillStyle = "#7f7f00", a.beginPath(), a.arc(this.coordlist[b].x, this.coordlist[b].y, this.HANDLE_SIZE / 2, 0, 2 * Math.PI, false), a.fill();
                a.restore()
            }
        },
        update: function () {
            this.calcLength()
        },
        solve: function () {},
        getContour: function (a) {
            var b = [],
                c;
            for (c = 0; c <= a; c++) {
                var d = new CAAT.Point;
                this.solve(d, c / a);
                b.push(d)
            }
            return b
        },
        getBoundingBox: function (a) {
            a || (a = new CAAT.Rectangle);
            a.union(this.coordlist[0].x, this.coordlist[0].y);
            for (var b = new CAAT.Point, c = this.k; c <= 1 + this.k; c +=
                this.k) this.solve(b, c), a.union(b.x, b.y);
            return a
        },
        calcLength: function () {
            var a, b;
            a = this.coordlist[0].x;
            b = this.coordlist[0].y;
            for (var c = 0, d = new CAAT.Point, e = this.k; e <= 1 + this.k; e += this.k) this.solve(d, e), c += Math.sqrt((d.x - a) * (d.x - a) + (d.y - b) * (d.y - b)), a = d.x, b = d.y;
            return this.length = c
        },
        getLength: function () {
            return this.length
        },
        endCurvePosition: function () {
            return this.coordlist[this.coordlist.length - 1]
        },
        startCurvePosition: function () {
            return this.coordlist[0]
        },
        setPoints: function () {},
        setPoint: function (a, b) {
            b >=
                0 && b < this.coordlist.length && (this.coordlist[b] = a)
        },
        applyAsPath: function () {}
    }
})();
(function () {
    CAAT.Bezier = function () {
        CAAT.Bezier.superclass.constructor.call(this);
        return this
    };
    CAAT.Bezier.prototype = {
        cubic: false,
        applyAsPath: function (a) {
            var b = this.coordlist;
            this.cubic ? a.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y) : a.quadraticCurveTo(b[1].x, b[1].y, b[2].x, b[2].y);
            return this
        },
        isQuadric: function () {
            return !this.cubic
        },
        isCubic: function () {
            return this.cubic
        },
        setCubic: function (a, b, c, d, e, f, g, h) {
            this.coordlist = [];
            this.coordlist.push((new CAAT.Point).set(a, b));
            this.coordlist.push((new CAAT.Point).set(c,
                d));
            this.coordlist.push((new CAAT.Point).set(e, f));
            this.coordlist.push((new CAAT.Point).set(g, h));
            this.cubic = true;
            this.update();
            return this
        },
        setQuadric: function (a, b, c, d, e, f) {
            this.coordlist = [];
            this.coordlist.push((new CAAT.Point).set(a, b));
            this.coordlist.push((new CAAT.Point).set(c, d));
            this.coordlist.push((new CAAT.Point).set(e, f));
            this.cubic = false;
            this.update();
            return this
        },
        setPoints: function (a) {
            if (a.length === 3) this.coordlist = a, this.cubic = false, this.update();
            else if (a.length === 4) this.coordlist = a,
            this.cubic = true, this.update();
            else throw "points must be an array of 3 or 4 CAAT.Point instances.";
            return this
        },
        paint: function (a) {
            this.cubic ? this.paintCubic(a) : this.paintCuadric(a);
            CAAT.Bezier.superclass.paint.call(this, a)
        },
        paintCuadric: function (a) {
            var b, c;
            b = this.coordlist[0].x;
            c = this.coordlist[0].y;
            a = a.ctx;
            a.save();
            a.beginPath();
            a.moveTo(b, c);
            b = new CAAT.Point;
            for (c = this.k; c <= 1 + this.k; c += this.k) this.solve(b, c), a.lineTo(b.x, b.y);
            a.stroke();
            a.restore()
        },
        paintCubic: function (a) {
            var b, c;
            b = this.coordlist[0].x;
            c = this.coordlist[0].y;
            a = a.ctx;
            a.save();
            a.beginPath();
            a.moveTo(b, c);
            b = new CAAT.Point;
            for (c = this.k; c <= 1 + this.k; c += this.k) this.solve(b, c), a.lineTo(b.x, b.y);
            a.stroke();
            a.restore()
        },
        solve: function (a, b) {
            return this.cubic ? this.solveCubic(a, b) : this.solveQuadric(a, b)
        },
        solveCubic: function (a, b) {
            var c = b * b,
                d = b * c,
                e = this.coordlist,
                f = e[0],
                g = e[1],
                h = e[2],
                e = e[3];
            a.x = f.x + b * (-f.x * 3 + b * (3 * f.x - f.x * b)) + b * (3 * g.x + b * (-6 * g.x + g.x * 3 * b)) + c * (h.x * 3 - h.x * 3 * b) + e.x * d;
            a.y = f.y + b * (-f.y * 3 + b * (3 * f.y - f.y * b)) + b * (3 * g.y + b * (-6 * g.y + g.y * 3 * b)) + c * (h.y *
                3 - h.y * 3 * b) + e.y * d;
            return a
        },
        solveQuadric: function (a, b) {
            var c = this.coordlist,
                d = c[0],
                e = c[1],
                c = c[2],
                f = 1 - b;
            a.x = f * f * d.x + 2 * f * b * e.x + b * b * c.x;
            a.y = f * f * d.y + 2 * f * b * e.y + b * b * c.y;
            return a
        }
    };
    extend(CAAT.Bezier, CAAT.Curve, null)
})();
(function () {
    CAAT.CatmullRom = function () {
        CAAT.CatmullRom.superclass.constructor.call(this);
        return this
    };
    CAAT.CatmullRom.prototype = {
        setCurve: function (a, b, c, d, e, f, g, h) {
            this.coordlist = [];
            this.coordlist.push((new CAAT.Point).set(a, b));
            this.coordlist.push((new CAAT.Point).set(c, d));
            this.coordlist.push((new CAAT.Point).set(e, f));
            this.coordlist.push((new CAAT.Point).set(g, h));
            this.cubic = true;
            this.update()
        },
        paint: function (a) {
            var b, c;
            b = this.coordlist[0].x;
            c = this.coordlist[0].y;
            var d = a.ctx;
            d.save();
            d.beginPath();
            d.moveTo(b, c);
            b = new CAAT.Point;
            for (c = this.k; c <= 1 + this.k; c += this.k) this.solve(b, c), d.lineTo(b.x, b.y);
            d.stroke();
            d.restore();
            CAAT.CatmullRom.superclass.paint.call(this, a)
        },
        solve: function (a, b) {
            var c = b * b,
                d = b * c,
                e = this.coordlist;
            a.x = 0.5 * (2 * e[1].x + (-e[0].x + e[2].x) * b + (2 * e[0].x - 5 * e[1].x + 4 * e[2].x - e[3].x) * c + (-e[0].x + 3 * e[1].x - 3 * e[2].x + e[3].x) * d);
            a.y = 0.5 * (2 * e[1].y + (-e[0].y + e[2].y) * b + (2 * e[0].y - 5 * e[1].y + 4 * e[2].y - e[3].y) * c + (-e[0].y + 3 * e[1].y - 3 * e[2].y + e[3].y) * d);
            return a
        }
    };
    extend(CAAT.CatmullRom, CAAT.Curve, null)
})();
(function () {
    CAAT.Point = function (a, b, c) {
        this.x = a;
        this.y = b;
        this.z = c || 0;
        return this
    };
    CAAT.Point.prototype = {
        x: 0,
        y: 0,
        z: 0,
        set: function (a, b, c) {
            this.x = a;
            this.y = b;
            this.z = c || 0;
            return this
        },
        clone: function () {
            return new CAAT.Point(this.x, this.y, this.z)
        },
        translate: function (a, b, c) {
            this.x += a;
            this.y += b;
            this.z += c || 0;
            return this
        },
        translatePoint: function (a) {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
            return this
        },
        subtract: function (a) {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
            return this
        },
        multiply: function (a) {
            this.x *= a;
            this.y *= a;
            this.z *=
                a;
            return this
        },
        rotate: function (a) {
            var b = this.x,
                c = this.y;
            this.x = b * Math.cos(a) - Math.sin(a) * c;
            this.y = b * Math.sin(a) + Math.cos(a) * c;
            this.z = 0;
            return this
        },
        setAngle: function (a) {
            var b = this.getLength();
            this.x = Math.cos(a) * b;
            this.y = Math.sin(a) * b;
            this.z = 0;
            return this
        },
        setLength: function (a) {
            var b = this.getLength();
            b ? this.multiply(a / b) : this.x = this.y = this.z = a;
            return this
        },
        normalize: function () {
            var a = this.getLength();
            this.x /= a;
            this.y /= a;
            this.z /= a;
            return this
        },
        getAngle: function () {
            return Math.atan2(this.y, this.x)
        },
        limit: function (a) {
            var b =
                this.getLengthSquared();
            if (b + 0.01 > a * a) b = Math.sqrt(b), this.x = this.x / b * a, this.y = this.y / b * a, this.z = this.z / b * a;
            return this
        },
        getLength: function () {
            var a = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            return a < 0.0050 && a > -0.0050 ? 1.0E-6 : a
        },
        getLengthSquared: function () {
            var a = this.x * this.x + this.y * this.y + this.z * this.z;
            return a < 0.0050 && a > -0.0050 ? 0 : a
        },
        getDistance: function (a) {
            var b = this.x - a.x,
                c = this.y - a.y,
                a = this.z - a.z;
            return Math.sqrt(b * b + c * c + a * a)
        },
        getDistanceSquared: function (a) {
            var b = this.x - a.x,
                c = this.y - a.y,
                a = this.z - a.z;
            return b * b + c * c + a * a
        },
        toString: function () {
            return "(CAAT.Point) x:" + String(Math.round(Math.floor(this.x * 10)) / 10) + " y:" + String(Math.round(Math.floor(this.y * 10)) / 10) + " z:" + String(Math.round(Math.floor(this.z * 10)) / 10)
        }
    }
})();
(function () {
    CAAT.Debug = function () {
        return this
    };
    CAAT.Debug.prototype = {
        width: 0,
        height: 0,
        canvas: null,
        ctx: null,
        SCALE: 50,
        setScale: function (a) {
            this.scale = a;
            return this
        },
        initialize: function (a, b) {
            this.width = a;
            this.height = b;
            this.canvas = document.createElement("canvas");
            this.canvas.width = a;
            this.canvas.height = b;
            this.ctx = this.canvas.getContext("2d");
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.width, this.height);
            var c = document.getElementById("caat-debug");
            null === c ? document.body.appendChild(this.canvas) :
                c.appendChild(this.canvas);
            return this
        },
        debugInfo: function (a, b) {
            this.size_total = a;
            this.size_active = b;
            this.paint()
        },
        paint: function () {
            var a = this.ctx,
                b = 0;
            a.drawImage(this.canvas, 1, 0, this.width - 1, this.height, 0, 0, this.width - 1, this.height);
            a.strokeStyle = "black";
            a.beginPath();
            a.moveTo(this.width - 0.5, 0);
            a.lineTo(this.width - 0.5, this.height);
            a.stroke();
            a.strokeStyle = CAAT.FRAME_TIME < 16 ? "green" : CAAT.FRAME_TIME < 25 ? "yellow" : "red";
            a.beginPath();
            a.moveTo(this.width - 0.5, this.height);
            a.lineTo(this.width - 0.5, this.height -
                CAAT.FRAME_TIME * this.height / this.SCALE);
            a.stroke();
            a.strokeStyle = "rgba(0,255,0,.8)";
            a.beginPath();
            b = this.height - (15 / this.SCALE * this.height >> 0) - 0.5;
            a.moveTo(0, b);
            a.lineTo(this.width, b);
            a.stroke();
            a.strokeStyle = "rgba(255,255,0,.8)";
            a.beginPath();
            b = this.height - (25 / this.SCALE * this.height >> 0) - 0.5;
            a.moveTo(0, b);
            a.lineTo(this.width, b);
            a.stroke();
            a.fillStyle = "red";
            a.fillRect(0, 0, 120, 15);
            a.fillStyle = "white";
            a.fillText("  Total: " + this.size_total + "  Active: " + this.size_active, 0, 12)
        }
    }
})();
(function () {
    CAAT.Actor = function () {
        this.behaviorList = [];
        this.lifecycleListenerList = [];
        this.AABB = new CAAT.Rectangle;
        this.viewVertices = [new CAAT.Point(0, 0, 0), new CAAT.Point(0, 0, 0), new CAAT.Point(0, 0, 0), new CAAT.Point(0, 0, 0)];
        this.rotateAnchor = this.scaleAnchor = this.ANCHOR_CENTER;
        this.modelViewMatrix = new CAAT.Matrix;
        this.worldModelViewMatrix = new CAAT.Matrix;
        this.modelViewMatrixI = new CAAT.Matrix;
        this.worldModelViewMatrixI = new CAAT.Matrix;
        this.tmpMatrix = new CAAT.Matrix;
        this.resetTransform();
        this.setScale(1,
            1);
        this.setRotation(0);
        return this
    };
    CAAT.Actor.prototype = {
        tmpMatrix: null,
        lifecycleListenerList: null,
        behaviorList: null,
        parent: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        start_time: 0,
        duration: Number.MAX_VALUE,
        clip: false,
        clipPath: null,
        scaleX: 0,
        scaleY: 0,
        scaleTX: 0.5,
        scaleTY: 0.5,
        scaleAnchor: 0,
        rotationAngle: 0,
        rotationY: 0.5,
        alpha: 1,
        rotationX: 0.5,
        isGlobalAlpha: false,
        frameAlpha: 1,
        expired: false,
        discardable: false,
        pointed: false,
        mouseEnabled: true,
        visible: true,
        ANCHOR_CENTER: 0,
        ANCHOR_TOP: 1,
        ANCHOR_BOTTOM: 2,
        ANCHOR_LEFT: 3,
        ANCHOR_RIGHT: 4,
        ANCHOR_TOP_LEFT: 5,
        ANCHOR_TOP_RIGHT: 6,
        ANCHOR_BOTTOM_LEFT: 7,
        ANCHOR_BOTTOM_RIGHT: 8,
        ANCHOR_CUSTOM: 9,
        fillStyle: null,
        strokeStyle: null,
        time: 0,
        AABB: null,
        viewVertices: null,
        inFrame: false,
        dirty: true,
        wdirty: true,
        oldX: -1,
        oldY: -1,
        modelViewMatrix: null,
        worldModelViewMatrix: null,
        modelViewMatrixI: null,
        worldModelViewMatrixI: null,
        glEnabled: false,
        backgroundImage: null,
        id: null,
        size_active: 1,
        size_total: 1,
        getId: function () {
            return this.id
        },
        setId: function (a) {
            this.id = a;
            return this
        },
        setParent: function (a) {
            this.parent = a;
            return this
        },
        setBackgroundImage: function (a, b) {
            if (a) {
                a instanceof CAAT.SpriteImage || (a = (new CAAT.SpriteImage).initialize(a, 1, 1));
                a.setOwner(this);
                this.backgroundImage = a;
                if (typeof b === "undefined" || b) this.width = a.singleWidth, this.height = a.singleHeight;
                this.glEnabled = true
            }
            return this
        },
        setSpriteIndex: function (a) {
            this.backgroundImage && this.backgroundImage.setSpriteIndex(a);
            return this
        },
        setBackgroundImageOffset: function (a, b) {
            this.backgroundImage && this.backgroundImage.setOffset(a, b);
            return this
        },
        setAnimationImageIndex: function (a) {
            this.backgroundImage &&
                this.backgroundImage.setAnimationImageIndex(a);
            return this
        },
        setChangeFPS: function (a) {
            this.backgroundImage && this.backgroundImage.setChangeFPS(a);
            return this
        },
        setImageTransformation: function (a) {
            this.backgroundImage && this.backgroundImage.setSpriteTransformation(a);
            return this
        },
        centerOn: function (a, b) {
            this.setLocation(a - this.width / 2, b - this.height / 2);
            return this
        },
        centerAt: function (a, b) {
            return this.centerOn(a, b)
        },
        getTextureGLPage: function () {
            return this.backgroundImage.image.__texturePage
        },
        setVisible: function (a) {
            this.visible =
                a;
            return this
        },
        setOutOfFrameTime: function () {
            this.setFrameTime(-1, 0);
            return this
        },
        addListener: function (a) {
            this.lifecycleListenerList.push(a);
            return this
        },
        removeListener: function (a) {
            for (var b = this.lifecycleListenerList.length; b--;)
                if (this.lifecycleListenerList[b] === a) {
                    this.lifecycleListenerList.splice(b, 1);
                    break
                }
        },
        setGlobalAlpha: function (a) {
            this.isGlobalAlpha = a;
            return this
        },
        fireEvent: function (a, b) {
            for (var c = 0; c < this.lifecycleListenerList.length; c++) this.lifecycleListenerList[c].actorLifeCycleEvent(this,
                a, b)
        },
        setScreenBounds: function () {
            this.viewVertices[0].set(0, 0);
            this.viewVertices[1].set(this.width, 0);
            this.viewVertices[2].set(this.width, this.height);
            this.viewVertices[3].set(0, this.height);
            this.modelToView(this.viewVertices);
            for (var a = Number.MAX_VALUE, b = Number.MIN_VALUE, c = Number.MAX_VALUE, d = Number.MIN_VALUE, e = 0; e < 4; e++) {
                if (this.viewVertices[e].x < a) a = this.viewVertices[e].x;
                if (this.viewVertices[e].x > b) b = this.viewVertices[e].x;
                if (this.viewVertices[e].y < c) c = this.viewVertices[e].y;
                if (this.viewVertices[e].y >
                    d) d = this.viewVertices[e].y
            }
            this.AABB.x = a;
            this.AABB.y = c;
            this.AABB.width = b - a;
            this.AABB.height = d - c;
            return this
        },
        setExpired: function (a) {
            this.expired = true;
            this.fireEvent("expired", a);
            return this
        },
        enableEvents: function (a) {
            this.mouseEnabled = a;
            return this
        },
        emptyBehaviorList: function () {
            this.behaviorList = [];
            return this
        },
        setFillStyle: function (a) {
            this.fillStyle = a;
            return this
        },
        setStrokeStyle: function (a) {
            this.strokeStyle = a;
            return this
        },
        setPaint: function (a) {
            return this.setFillStyle(a)
        },
        setAlpha: function (a) {
            this.alpha =
                a;
            return this
        },
        resetTransform: function () {
            this.rotateAnchor = this.rotationAngle = 0;
            this.rotationY = this.rotationX = 0.5;
            this.scaleY = this.scaleX = 1;
            this.scaleTY = this.scaleTX = 0.5;
            this.scaleAnchor = 0;
            this.oldY = this.oldX = -1;
            this.dirty = true;
            return this
        },
        setFrameTime: function (a, b) {
            this.start_time = a;
            this.duration = b;
            this.expired = false;
            this.dirty = true;
            return this
        },
        paint: function (a, b) {
            if (this.backgroundImage) this.backgroundImage.paint(a, b, 0, 0);
            else if (this.fillStyle) {
                var c = a.crc;
                c.fillStyle = this.fillStyle;
                c.fillRect(0,
                    0, this.width, this.height)
            }
        },
        setScale: function (a, b) {
            this.setScaleAnchored(a, b, 0.5, 0.5);
            this.dirty = true;
            return this
        },
        getAnchorPercent: function (a) {
            var b = [0.5, 0.5, 0.5, 0, 0.5, 1, 0, 0.5, 1, 0.5, 0, 0, 1, 0, 0, 1, 1, 1];
            return {
                x: b[a * 2],
                y: b[a * 2 + 1]
            }
        },
        getAnchor: function (a) {
            var b = 0,
                c = 0;
            switch (a) {
            case this.ANCHOR_CENTER:
                c = b = 0.5;
                break;
            case this.ANCHOR_TOP:
                b = 0.5;
                c = 0;
                break;
            case this.ANCHOR_BOTTOM:
                b = 0.5;
                c = 1;
                break;
            case this.ANCHOR_LEFT:
                b = 0;
                c = 0.5;
                break;
            case this.ANCHOR_RIGHT:
                b = 1;
                c = 0.5;
                break;
            case this.ANCHOR_TOP_RIGHT:
                b = 1;
                c = 0;
                break;
            case this.ANCHOR_BOTTOM_LEFT:
                b = 0;
                c = 1;
                break;
            case this.ANCHOR_BOTTOM_RIGHT:
                c = b = 1;
                break;
            case this.ANCHOR_TOP_LEFT:
                c = b = 0
            }
            return {
                x: b,
                y: c
            }
        },
        setScaleAnchored: function (a, b, c, d) {
            this.scaleTX = c;
            this.scaleTY = d;
            this.scaleX = a;
            this.scaleY = b;
            this.dirty = true;
            return this
        },
        setRotation: function (a) {
            this.setRotationAnchored(a, 0.5, 0.5);
            return this
        },
        setRotationAnchored: function (a, b, c) {
            this.rotationAngle = a;
            this.rotationX = b ? b : 0;
            this.rotationY = c ? c : 0;
            this.dirty = true;
            return this
        },
        setSize: function (a, b) {
            this.width = a | 0;
            this.height =
                b | 0;
            this.dirty = true;
            return this
        },
        setBounds: function (a, b, c, d) {
            this.x = a | 0;
            this.y = b | 0;
            this.width = c | 0;
            this.height = d | 0;
            this.dirty = true;
            return this
        },
        setLocation: function (a, b) {
            this.x = a | 0;
            this.y = b | 0;
            this.oldX = a | 0;
            this.oldY = b | 0;
            this.dirty = true;
            return this
        },
        isInAnimationFrame: function (a) {
            if (this.expired) return false;
            if (this.duration === Number.MAX_VALUE) return this.start_time <= a;
            return a >= this.start_time + this.duration ? (this.expired || this.setExpired(a), false) : this.start_time <= a && a < this.start_time + this.duration
        },
        contains: function (a, b) {
            return a >= 0 && b >= 0 && a < this.width && b < this.height
        },
        create: function () {
            return this
        },
        addBehavior: function (a) {
            this.behaviorList.push(a);
            return this
        },
        removeBehaviour: function (a) {
            for (var b = this.behaviorList.length - 1; b;)
                if (this.behaviorList[b] === a) {
                    this.behaviorList.splice(b, 1);
                    break
                }
            return this
        },
        removeBehaviorById: function (a) {
            for (var b = 0; b < this.behaviorList.length; b++) this.behaviorList[b].id === a && this.behaviorList.splice(b, 1);
            return this
        },
        getBehavior: function (a) {
            for (var b = 0; b < this.behaviorList.length; b++)
                if (this.behaviorList[b].id ===
                    a) return this.behaviorList[b];
            return null
        },
        setDiscardable: function (a) {
            this.discardable = a;
            return this
        },
        destroy: function (a) {
            this.parent && this.parent.removeChild(this);
            this.fireEvent("destroyed", a)
        },
        modelToView: function (a) {
            if (a instanceof Array)
                for (var b = 0; b < a.length; b++) this.worldModelViewMatrix.transformCoord(a[b]);
            else this.worldModelViewMatrix.transformCoord(a);
            return a
        },
        modelToModel: function (a, b) {
            return b.viewToModel(this.modelToView(a))
        },
        viewToModel: function (a) {
            this.worldModelViewMatrixI = this.worldModelViewMatrix.getInverse();
            this.worldModelViewMatrixI.transformCoord(a);
            return a
        },
        findActorAtPosition: function (a) {
            if (!this.mouseEnabled || !this.isInAnimationFrame(this.time)) return null;
            this.modelViewMatrixI = this.modelViewMatrix.getInverse();
            this.modelViewMatrixI.transformCoord(a);
            return this.contains(a.x, a.y) ? this : null
        },
        enableDrag: function () {
            this.my = this.mx = this.ay = this.ax = 0;
            this.asy = this.asx = 1;
            this.screeny = this.screenx = this.ara = 0;
            this.mouseEnter = function () {
                this.__d_ay = this.__d_ax = -1;
                this.pointed = true;
                CAAT.setCursor("move")
            };
            this.mouseExit = function () {
                this.__d_ay = this.__d_ax = -1;
                this.pointed = false;
                CAAT.setCursor("default")
            };
            this.mouseMove = function () {};
            this.mouseUp = function () {
                this.__d_ay = this.__d_ax = -1
            };
            this.mouseDrag = function (a) {
                var b;
                b = this.modelToView(new CAAT.Point(a.x, a.y));
                this.parent.viewToModel(b);
                if (this.__d_ax === -1 || this.__d_ay === -1) this.__d_ax = b.x, this.__d_ay = b.y, this.__d_asx = this.scaleX, this.__d_asy = this.scaleY, this.__d_ara = this.rotationAngle, this.__d_screenx = a.screenPoint.x, this.__d_screeny = a.screenPoint.y;
                if (a.isShiftDown()) {
                    var c = (a.screenPoint.x - this.__d_screenx) / 100,
                        d = (a.screenPoint.y - this.__d_screeny) / 100;
                    a.isAltDown() || (d = c = a = Math.max(c, d));
                    this.setScale(c + this.__d_asx, d + this.__d_asy)
                } else a.isControlDown() ? this.setRotation(-Math.atan2(a.screenPoint.x - this.__d_screenx, a.screenPoint.y - this.__d_screeny) + this.__d_ara) : (this.x += b.x - this.__d_ax, this.y += b.y - this.__d_ay);
                this.__d_ax = b.x;
                this.__d_ay = b.y
            };
            return this
        },
        mouseClick: function () {},
        mouseDblClick: function () {},
        mouseEnter: function () {
            this.pointed =
                true
        },
        mouseExit: function () {
            this.pointed = false
        },
        mouseMove: function () {},
        mouseDown: function () {},
        mouseUp: function () {},
        mouseDrag: function () {},
        drawScreenBoundingBox: function (a) {
            if (null !== this.AABB && this.inFrame) {
                var b = this.AABB;
                a.ctx.strokeRect(b.x, b.y, b.width, b.height)
            }
        },
        animate: function (a, b) {
            if (!this.isInAnimationFrame(b)) return this.inFrame = false, this.dirty = true, false;
            if (this.x !== this.oldX || this.y !== this.oldY) this.dirty = true, this.oldX = this.x, this.oldY = this.y;
            for (var c = 0; c < this.behaviorList.length; c++) this.behaviorList[c].apply(b,
                this);
            this.clipPath && this.clipPath.applyBehaviors && this.clipPath.applyBehaviors(b);
            this.setModelViewMatrix(a.glEnabled);
            return this.inFrame = true
        },
        setModelViewMatrix: function (a) {
            var b, c, d, e, f, g, h, j, k, l, m;
            this.wdirty = false;
            if (this.dirty) {
                m = this.modelViewMatrix.matrix;
                h = 1;
                k = e = 0;
                g = 1;
                j = this.x;
                l = this.y;
                if (this.rotationAngle) {
                    var o = this.rotationX * this.width,
                        n = this.rotationY * this.height;
                    j += h * o + e * n;
                    l += k * o + g * n;
                    b = Math.cos(this.rotationAngle);
                    c = Math.sin(this.rotationAngle);
                    d = h;
                    f = k;
                    h = d * b + e * c;
                    e = -d * c + e * b;
                    k = f * b +
                        g * c;
                    g = -f * c + g * b;
                    j += -h * o - e * n;
                    l += -k * o - g * n
                }
                if (this.scaleX != 1 || this.scaleY != 1) b = this.scaleTX * this.width, c = this.scaleTY * this.height, j += h * b + e * c, l += k * b + g * c, h *= this.scaleX, e *= this.scaleY, k *= this.scaleX, g *= this.scaleY, j += -h * b - e * c, l += -k * b - g * c;
                m[0] = h;
                m[1] = e;
                m[2] = j;
                m[3] = k;
                m[4] = g;
                m[5] = l
            }
            if (this.parent) {
                if (this.dirty || this.parent.wdirty) this.worldModelViewMatrix.copy(this.parent.worldModelViewMatrix), this.worldModelViewMatrix.multiply(this.modelViewMatrix), this.wdirty = true
            } else {
                if (this.dirty) this.wdirty = true;
                this.worldModelViewMatrix.identity()
            }
            a &&
                (this.dirty || this.wdirty) && this.setScreenBounds();
            this.dirty = false;
            return this
        },
        paintActor: function (a, b) {
            if (!this.visible) return true;
            var c = a.ctx;
            this.frameAlpha = this.parent ? this.parent.frameAlpha * this.alpha : 1;
            c.globalAlpha = this.frameAlpha;
            this.worldModelViewMatrix.transformRenderingContext(c);
            this.clip && (c.beginPath(), this.clipPath ? this.clipPath.applyAsPath(c) : c.rect(0, 0, this.width, this.height), c.clip());
            this.paint(a, b);
            return true
        },
        __paintActor: function (a, b) {
            if (!this.visible) return true;
            var c = a.ctx;
            this.frameAlpha = this.alpha;
            var d = this.worldModelViewMatrix.matrix;
            c.setTransform(d[0], d[3], d[1], d[4], d[2], d[5], this.frameAlpha);
            this.paint(a, b);
            return true
        },
        paintActorGL: function (a) {
            this.frameAlpha = this.parent.frameAlpha * this.alpha;
            if (this.glEnabled && this.visible)
                if (this.glNeedsFlush(a)) {
                    a.glFlush();
                    this.glSetShader(a);
                    if (!this.__uv) this.__uv = new Float32Array(8);
                    if (!this.__vv) this.__vv = new Float32Array(12);
                    this.setGLCoords(this.__vv, 0);
                    this.setUV(this.__uv, 0);
                    a.glRender(this.__vv, 12, this.__uv)
                } else {
                    var b =
                        a.coordsIndex;
                    this.setGLCoords(a.coords, b);
                    a.coordsIndex = b + 12;
                    this.setUV(a.uv, a.uvIndex);
                    a.uvIndex += 8
                }
        },
        setGLCoords: function (a, b) {
            var c = this.viewVertices;
            a[b++] = c[0].x;
            a[b++] = c[0].y;
            a[b++] = 0;
            a[b++] = c[1].x;
            a[b++] = c[1].y;
            a[b++] = 0;
            a[b++] = c[2].x;
            a[b++] = c[2].y;
            a[b++] = 0;
            a[b++] = c[3].x;
            a[b++] = c[3].y;
            a[b++] = 0
        },
        setUV: function (a, b) {
            this.backgroundImage.setUV(a, b)
        },
        glNeedsFlush: function (a) {
            return this.getTextureGLPage() !== a.currentTexturePage ? true : this.frameAlpha !== a.currentOpacity ? true : false
        },
        glSetShader: function (a) {
            this.frameAlpha !==
                a.currentOpacity && a.setGLCurrentOpacity(this.frameAlpha)
        },
        endAnimate: function () {
            return this
        },
        initialize: function (a) {
            if (a)
                for (var b in a) this[b] = a[b];
            return this
        },
        setClip: function (a, b) {
            this.clip = a;
            this.clipPath = b;
            return this
        },
        cacheAsBitmap: function (a) {
            var a = a || 0,
                b = document.createElement("canvas");
            b.width = this.width;
            b.height = this.height;
            var c = b.getContext("2d");
            this.paintActor({
                ctx: c,
                crc: c,
                modelViewMatrix: new CAAT.Matrix
            }, a);
            this.setBackgroundImage(b);
            return this
        },
        setAsButton: function (a, b, c, d, e, f) {
            this.setBackgroundImage(a,
                true);
            this.iNormal = b || 0;
            this.iOver = c || b;
            this.iPress = d || b;
            this.iDisabled = e || b;
            this.iCurrent = b;
            this.fnOnClick = f;
            this.enabled = true;
            this.setSpriteIndex(b);
            this.setEnabled = function (a) {
                this.enabled = a
            };
            this.actionPerformed = function () {
                this.enabled && null !== this.fnOnClick && this.fnOnClick(this)
            };
            this.mouseEnter = function () {
                this.dragging ? this.setSpriteIndex(this.iPress) : this.setSpriteIndex(this.iOver);
                CAAT.setCursor("pointer")
            };
            this.mouseExit = function () {
                this.setSpriteIndex(this.iNormal);
                CAAT.setCursor("default")
            };
            this.mouseDown = function () {
                this.setSpriteIndex(this.iPress)
            };
            this.mouseUp = function () {
                this.setSpriteIndex(this.iNormal);
                this.dragging = false
            };
            this.mouseClick = function () {};
            this.mouseDrag = function () {
                this.dragging = true
            };
            this.setButtonImageIndex = function (a, c, d, e) {
                this.iNormal = a;
                this.iOver = c;
                this.iPress = d;
                this.iDisabled = e;
                this.setSpriteIndex(b);
                return this
            };
            return this
        }
    };
    if (CAAT.NO_PERF) CAAT.Actor.prototype.paintActor = CAAT.Actor.prototype.__paintActor
})();
(function () {
    CAAT.ActorContainer = function () {
        CAAT.ActorContainer.superclass.constructor.call(this);
        this.childrenList = [];
        this.pendingChildrenList = [];
        return this
    };
    CAAT.ActorContainer.prototype = {
        childrenList: null,
        activeChildren: null,
        pendingChildrenList: null,
        drawScreenBoundingBox: function (a, b) {
            if (this.inFrame) {
                for (var c = this.childrenList, d = 0; d < c.length; d++) c[d].drawScreenBoundingBox(a, b);
                CAAT.ActorContainer.superclass.drawScreenBoundingBox.call(this, a, b)
            }
        },
        emptyChildren: function () {
            this.childrenList = [];
            return this
        },
        paintActor: function (a, b) {
            if (!this.visible) return true;
            var c = a.ctx,
                d = a.modelViewMatrix;
            c.save();
            d.transformRenderingContextSet(c);
            CAAT.ActorContainer.superclass.paintActor.call(this, a, b);
            if (!this.isGlobalAlpha) this.frameAlpha = this.parent ? this.parent.frameAlpha : 1;
            for (var e = this.activeChildren; e; e = e.__next) d.transformRenderingContextSet(c), e.visible && (c.save(), e.paintActor(a, b), c.restore());
            c.restore();
            return true
        },
        __paintActor: function (a, b) {
            if (!this.visible) return true;
            var c = a.ctx;
            this.frameAlpha =
                this.parent ? this.parent.frameAlpha * this.alpha : 1;
            var d = this.worldModelViewMatrix.matrix;
            c.setTransform(d[0], d[3], d[1], d[4], d[2], d[5], this.frameAlpha);
            this.paint(a, b);
            if (!this.isGlobalAlpha) this.frameAlpha = this.parent ? this.parent.frameAlpha : 1;
            for (c = this.activeChildren; c; c = c.__next) c.paintActor(a, b);
            return true
        },
        paintActorGL: function (a, b) {
            var c;
            if (!this.visible) return true;
            CAAT.ActorContainer.superclass.paintActorGL.call(this, a, b);
            if (!this.isGlobalAlpha) this.frameAlpha = this.parent.frameAlpha;
            for (c = this.activeChildren; c; c =
                c.__next) c.paintActorGL(a, b)
        },
        animate: function (a, b) {
            var c = this.activeChildren = null;
            if (false === CAAT.ActorContainer.superclass.animate.call(this, a, b)) return false;
            var d, e = this.pendingChildrenList;
            for (d = 0; d < e.length; d++) this.addChild(e[d]);
            this.pendingChildrenList = [];
            var e = [],
                f = this.childrenList;
            this.activeChildren = null;
            for (d = this.size_total = this.size_active = 0; d < f.length; d++) {
                var g = f[d];
                g.time = b;
                this.size_total += g.size_total;
                g.animate(a, b) ? (this.activeChildren ? (g.__next = null, c.__next = g) : (this.activeChildren =
                    g, g.__next = null), c = g, this.size_active += g.size_active) : g.expired && g.discardable && e.push(g)
            }
            for (d = 0, c = e.length; d < c; d++) e[d].destroy(b);
            return true
        },
        endAnimate: function () {},
        addChildImmediately: function (a) {
            return this.addChild(a)
        },
        addChild: function (a) {
            if (a.parent != null) throw "adding to a container an element with parent.";
            a.parent = this;
            this.childrenList.push(a);
            a.dirty = true;
            return this
        },
        addChildDelayed: function (a) {
            this.pendingChildrenList.push(a);
            return this
        },
        addChildAt: function (a, b) {
            if (b <= 0) return a.parent =
                this, a.dirty = true, this.childrenList.splice(0, 0, a), this;
            else if (b >= this.childrenList.length) b = this.childrenList.length;
            a.parent = this;
            a.dirty = true;
            this.childrenList.splice(b, 0, a);
            return this
        },
        findChild: function (a) {
            for (var b = this.childrenList, c = 0, d = b.length, c = 0; c < d; c++)
                if (b[c] === a) return c;
            return -1
        },
        removeChild: function (a) {
            var a = this.findChild(a),
                b = this.childrenList; - 1 !== a && (b[a].setParent(null), b.splice(a, 1));
            return this
        },
        findActorAtPosition: function (a) {
            if (null === CAAT.ActorContainer.superclass.findActorAtPosition.call(this,
                a)) return null;
            for (var b = this.childrenList.length - 1; b >= 0; b--) {
                var c = this.childrenList[b],
                    d = new CAAT.Point(a.x, a.y, 0),
                    c = c.findActorAtPosition(d);
                if (null !== c) return c
            }
            return this
        },
        destroy: function () {
            for (var a = this.childrenList, b = a.length - 1; b >= 0; b--) a[b].destroy();
            CAAT.ActorContainer.superclass.destroy.call(this);
            return this
        },
        getNumChildren: function () {
            return this.childrenList.length
        },
        getNumActiveChildren: function () {
            return this.activeChildren.length
        },
        getChildAt: function (a) {
            return this.childrenList[a]
        },
        setZOrder: function (a, b) {
            var c = this.findChild(a),
                d = this.childrenList;
            if (-1 !== c && b !== c)
                if (b >= d.length) d.splice(c, 1), d.push(a);
                else {
                    c = d.splice(c, 1);
                    if (b < 0) b = 0;
                    else if (b > d.length) b = d.length;
                    d.splice(b, 1, c)
                }
        }
    };
    if (CAAT.NO_PERF) CAAT.ActorContainer.prototype.paintActor = CAAT.ActorContainer.prototype.__paintActor;
    extend(CAAT.ActorContainer, CAAT.Actor, null)
})();
(function () {
    CAAT.SpriteActor = function () {
        CAAT.SpriteActor.superclass.constructor.call(this);
        this.glEnabled = true;
        this.setAnimationImageIndex([0]);
        return this
    };
    CAAT.SpriteActor.prototype = {
        compoundbitmap: null,
        animationImageIndex: null,
        prevAnimationTime: -1,
        changeFPS: 1E3,
        transformation: 0,
        spriteIndex: 0,
        TR_NONE: 0,
        TR_FLIP_HORIZONTAL: 1,
        TR_FLIP_VERTICAL: 2,
        TR_FLIP_ALL: 3,
        setSpriteImage: function (a) {
            this.compoundbitmap = a;
            this.width = a.singleWidth;
            this.height = a.singleHeight;
            return this
        },
        setChangeFPS: function (a) {
            this.changeFPS =
                a;
            return this
        },
        setSpriteTransformation: function (a) {
            this.transformation = a;
            switch (a) {
            case this.TR_FLIP_HORIZONTAL:
                this.compoundbitmap.paint = this.compoundbitmap.paintInvertedH;
                break;
            case this.TR_FLIP_VERTICAL:
                this.compoundbitmap.paint = this.compoundbitmap.paintInvertedV;
                break;
            case this.TR_FLIP_ALL:
                this.compoundbitmap.paint = this.compoundbitmap.paintInvertedHV;
                break;
            default:
                this.compoundbitmap.paint = this.compoundbitmap.paintN
            }
            return this
        },
        setAnimationImageIndex: function (a) {
            this.animationImageIndex = a;
            this.spriteIndex =
                a[0];
            return this
        },
        setSpriteIndex: function (a) {
            this.spriteIndex = a;
            return this
        },
        paint: function (a, b) {
            if (this.animationImageIndex.length > 1)
                if (this.prevAnimationTime === -1) this.prevAnimationTime = b;
                else {
                    var c = b;
                    c -= this.prevAnimationTime;
                    c /= this.changeFPS;
                    c %= this.animationImageIndex.length;
                    this.spriteIndex = this.animationImageIndex[Math.floor(c)]
                }
            c = a.ctx;
            this.spriteIndex != -1 && this.compoundbitmap.paint(c, this.spriteIndex, 0, 0)
        },
        paintActorGL: function (a, b) {
            -1 !== this.spriteIndex && CAAT.SpriteActor.superclass.paintActorGL.call(this,
                a, b)
        },
        setUV: function (a, b) {
            this.compoundbitmap.setUV(this.spriteIndex, a, b)
        },
        glNeedsFlush: function (a) {
            return this.compoundbitmap.image.__texturePage !== a.currentTexturePage ? true : this.frameAlpha !== a.currentOpacity ? true : false
        }
    };
    extend(CAAT.SpriteActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.ImageActor = function () {
        CAAT.ImageActor.superclass.constructor.call(this);
        this.glEnabled = true;
        return this
    };
    CAAT.ImageActor.prototype = {
        image: null,
        transformation: 0,
        TR_NONE: 0,
        TR_FLIP_HORIZONTAL: 1,
        TR_FLIP_VERTICAL: 2,
        TR_FLIP_ALL: 3,
        TR_FIXED_TO_SIZE: 4,
        offsetX: 0,
        offsetY: 0,
        setOffsetX: function (a) {
            this.offsetX = a | 0;
            return this
        },
        setOffsetY: function (a) {
            this.offsetY = a | 0;
            return this
        },
        setOffset: function (a, b) {
            this.offsetX = a;
            this.offsetY = b;
            return this
        },
        setImage: function (a) {
            if ((this.image = a) && (this.width ===
                0 || this.height === 0)) this.width = a.width, this.height = a.height;
            return this
        },
        setImageTransformation: function (a) {
            this.transformation = a;
            switch (this.transformation) {
            case this.TR_FLIP_HORIZONTAL:
                this.paint = this.paintInvertedH;
                break;
            case this.TR_FLIP_VERTICAL:
                this.paint = this.paintInvertedV;
                break;
            case this.TR_FLIP_ALL:
                this.paint = this.paintInvertedHV;
                break;
            case this.TR_FIXED_TO_SIZE:
                this.paint = this.paintFixed
            }
            return this
        },
        paintFixed: function (a) {
            this.image ? a.ctx.drawImage(this.image, this.offsetX, this.offsetY,
                this.width, this.height) : (a = a.ctx, a.fillStyle = this.fillStyle, a.fillRect(0, 0, this.width, this.height))
        },
        paint: function (a) {
            a.ctx.drawImage(this.image, this.offsetX, this.offsetY)
        },
        paintActorGL: function (a, b) {
            null !== this.image && CAAT.ImageActor.superclass.paintActorGL.call(this, a, b)
        },
        paintInvertedH: function (a) {
            a = a.crc;
            a.save();
            a.translate(this.width, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.offsetX, this.offsetY);
            a.restore()
        },
        paintInvertedV: function (a) {
            a = a.crc;
            a.save();
            a.translate(0, this.height);
            a.scale(1, -1);
            a.drawImage(this.image, this.offsetX, this.offsetY);
            a.restore()
        },
        paintInvertedHV: function (a) {
            a = a.crc;
            a.save();
            a.translate(0, this.height);
            a.scale(1, -1);
            a.translate(this.width, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.offsetX, this.offsetY);
            a.restore()
        },
        setUV: function (a, b) {
            var c = b,
                d = this.image;
            if (d.__texturePage) {
                var e = d.__u,
                    f = d.__v,
                    g = d.__u1,
                    h = d.__v1;
                if (this.offsetX || this.offsetY) var g = this.width,
                h = this.height, j = d.__texturePage, e = (d.__tx - this.offsetX) / j.width, f = (d.__ty - this.offsetY) / j.height, g =
                    e + g / j.width, h = f + h / j.height;
                d.inverted ? (a[c++] = g, a[c++] = f, a[c++] = g, a[c++] = h, a[c++] = e, a[c++] = h, a[c++] = e, a[c++] = f) : (a[c++] = e, a[c++] = f, a[c++] = g, a[c++] = f, a[c++] = g, a[c++] = h, a[c++] = e, a[c++] = h)
            }
        },
        glNeedsFlush: function (a) {
            return this.image.__texturePage !== a.currentTexturePage ? true : this.frameAlpha !== a.currentOpacity ? true : false
        }
    };
    extend(CAAT.ImageActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.TextActor = function () {
        CAAT.TextActor.superclass.constructor.call(this);
        this.font = "10px sans-serif";
        this.textAlign = "left";
        this.textBaseline = "top";
        this.outlineColor = "black";
        this.clip = false;
        return this
    };
    CAAT.TextActor.TRAVERSE_PATH_FORWARD = 1;
    CAAT.TextActor.TRAVERSE_PATH_BACKWARD = -1;
    CAAT.TextActor.prototype = {
        font: null,
        textAlign: null,
        textBaseline: null,
        fill: true,
        text: null,
        textWidth: 0,
        textHeight: 0,
        outline: false,
        outlineColor: null,
        path: null,
        pathInterpolator: null,
        pathDuration: 1E4,
        sign: 1,
        setFill: function (a) {
            this.fill =
                a;
            return this
        },
        setOutline: function (a) {
            this.outline = a;
            return this
        },
        setPathTraverseDirection: function (a) {
            this.sign = a;
            return this
        },
        setOutlineColor: function (a) {
            this.outlineColor = a;
            return this
        },
        setText: function (a) {
            this.text = a;
            this.setFont(this.font);
            return this
        },
        setTextAlign: function (a) {
            this.textAlign = a;
            return this
        },
        setAlign: function (a) {
            return this.setTextAlign(a)
        },
        setTextBaseline: function (a) {
            this.textBaseline = a;
            return this
        },
        setBaseline: function (a) {
            return this.setTextBaseline(a)
        },
        setFont: function (a) {
            if (!a) return this;
            this.font = a;
            if (null === this.text || this.text === "") this.width = this.height = 0;
            return this
        },
        calcTextSize: function (a) {
            if (a.glEnabled) return this;
            a.ctx.save();
            a.ctx.font = this.font;
            this.textWidth = a.crc.measureText(this.text).width;
            if (this.width === 0) this.width = this.textWidth;
            try {
                var b = this.font.substring(0, this.font.indexOf("px"));
                this.textHeight = parseInt(b, 10);
                this.textHeight += this.textHeight / 4 >> 0
            } catch (c) {
                this.textHeight = 20
            }
            if (this.height === 0) this.height = this.textHeight;
            a.crc.restore();
            return this
        },
        paint: function (a,
            b) {
            if (this.backgroundImage) CAAT.TextActor.superclass.paint.call(this, a, b);
            else if (null !== this.text) {
                (this.textWidth === 0 || this.textHeight === 0) && this.calcTextSize(a);
                var c = a.crc;
                if (null !== this.font) c.font = this.font;
                if (null !== this.textAlign) c.textAlign = this.textAlign;
                if (null !== this.textBaseline) c.textBaseline = this.textBaseline;
                if (null !== this.fillStyle) c.fillStyle = this.fillStyle;
                if (null === this.path) {
                    var d = 0;
                    if (this.textAlign === "center") d = this.width / 2 | 0;
                    else if (this.textAlign === "right") d = this.width;
                    if (this.fill) {
                        if (c.fillText(this.text,
                            d, 0), this.outline) {
                            if (null !== this.outlineColor) c.strokeStyle = this.outlineColor;
                            c.beginPath();
                            c.strokeText(this.text, d, 0)
                        }
                    } else {
                        if (null !== this.outlineColor) c.strokeStyle = this.outlineColor;
                        c.strokeText(this.text, d, 0)
                    }
                } else this.drawOnPath(a, b)
            }
        },
        drawOnPath: function (a, b) {
            for (var c = a.crc, d = this.sign * this.pathInterpolator.getPosition(b % this.pathDuration / this.pathDuration).y * this.path.getLength(), e = new CAAT.Point(0, 0, 0), f = new CAAT.Point(0, 0, 0), g = 0; g < this.text.length; g++) {
                var h = this.text[g].toString(),
                    j =
                        c.measureText(h).width;
                this.path.getLength();
                f = j / 2 + d;
                e = this.path.getPositionFromLength(f).clone();
                f = this.path.getPositionFromLength(f - 0.1).clone();
                f = Math.atan2(e.y - f.y, e.x - f.x);
                c.save();
                c.translate(0.5 + e.x | 0, 0.5 + e.y | 0);
                c.rotate(f);
                this.fill && c.fillText(h, 0, 0);
                if (this.outline) c.strokeStyle = this.outlineColor, c.strokeText(h, 0, 0);
                c.restore();
                d += j
            }
        },
        setPath: function (a, b, c) {
            this.path = a;
            this.pathInterpolator = b || (new CAAT.Interpolator).createLinearInterpolator();
            this.pathDuration = c || 1E4;
            this.mouseEnabled =
                false;
            return this
        }
    };
    extend(CAAT.TextActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.Button = function () {
        CAAT.Button.superclass.constructor.call(this);
        this.glEnabled = true;
        return this
    };
    CAAT.Button.prototype = {
        iNormal: 0,
        iOver: 0,
        iPress: 0,
        iDisabled: 0,
        iCurrent: 0,
        fnOnClick: null,
        enabled: true,
        setEnabled: function (a) {
            this.enabled = a
        },
        initialize: function (a, b, c, d, e, f) {
            this.setSpriteImage(a);
            this.iNormal = b || 0;
            this.iOver = c || this.iNormal;
            this.iPress = d || this.iNormal;
            this.iDisabled = e || this.iNormal;
            this.iCurrent = this.iNormal;
            this.width = a.singleWidth;
            this.height = a.singleHeight;
            this.fnOnClick =
                f;
            this.spriteIndex = b;
            return this
        },
        mouseEnter: function () {
            this.setSpriteIndex(this.iOver);
            CAAT.setCursor("pointer")
        },
        mouseExit: function () {
            this.setSpriteIndex(this.iNormal);
            CAAT.setCursor("default")
        },
        mouseDown: function () {
            this.setSpriteIndex(this.iPress)
        },
        mouseUp: function () {
            this.setSpriteIndex(this.iNormal)
        },
        mouseClick: function () {
            this.enabled && null !== this.fnOnClick && this.fnOnClick(this)
        },
        toString: function () {
            return "CAAT.Button " + this.iNormal
        }
    };
    extend(CAAT.Button, CAAT.SpriteActor, null)
})();
(function () {
    CAAT.ShapeActor = function () {
        CAAT.ShapeActor.superclass.constructor.call(this);
        this.compositeOp = "source-over";
        this.setShape(this.SHAPE_CIRCLE);
        return this
    };
    CAAT.ShapeActor.prototype = {
        shape: 0,
        compositeOp: null,
        lineWidth: 1,
        lineCap: null,
        lineJoin: null,
        miterLimit: null,
        SHAPE_CIRCLE: 0,
        SHAPE_RECTANGLE: 1,
        setLineWidth: function (a) {
            this.lineWidth = a;
            return this
        },
        setLineCap: function (a) {
            this.lineCap = a;
            return this
        },
        setLineJoin: function (a) {
            this.lineJoin = a;
            return this
        },
        setMiterLimit: function (a) {
            this.miterLimit =
                a;
            return this
        },
        getLineCap: function () {
            return this.lineCap
        },
        getLineJoin: function () {
            return this.lineJoin
        },
        getMiterLimit: function () {
            return this.miterLimit
        },
        getLineWidth: function () {
            return this.lineWidth
        },
        setShape: function (a) {
            this.shape = a;
            this.paint = this.shape === this.SHAPE_CIRCLE ? this.paintCircle : this.paintRectangle;
            return this
        },
        setCompositeOp: function (a) {
            this.compositeOp = a;
            return this
        },
        paint: function () {},
        paintCircle: function (a) {
            a = a.crc;
            a.lineWidth = this.lineWidth;
            a.globalCompositeOperation = this.compositeOp;
            if (null !== this.fillStyle) a.fillStyle = this.fillStyle, a.beginPath(), a.arc(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2, 0, 2 * Math.PI, false), a.fill();
            if (null !== this.strokeStyle) a.strokeStyle = this.strokeStyle, a.beginPath(), a.arc(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2, 0, 2 * Math.PI, false), a.stroke()
        },
        paintRectangle: function (a) {
            a = a.crc;
            a.lineWidth = this.lineWidth;
            if (this.lineCap) a.lineCap = this.lineCap;
            if (this.lineJoin) a.lineJoin = this.lineJoin;
            if (this.miterLimit) a.miterLimit =
                this.miterLimit;
            a.globalCompositeOperation = this.compositeOp;
            if (null !== this.fillStyle) a.fillStyle = this.fillStyle, a.beginPath(), a.fillRect(0, 0, this.width, this.height), a.fill();
            if (null !== this.strokeStyle) a.strokeStyle = this.strokeStyle, a.beginPath(), a.strokeRect(0, 0, this.width, this.height), a.stroke()
        }
    };
    extend(CAAT.ShapeActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.StarActor = function () {
        CAAT.StarActor.superclass.constructor.call(this);
        this.compositeOp = "source-over";
        return this
    };
    CAAT.StarActor.prototype = {
        nPeaks: 0,
        maxRadius: 0,
        minRadius: 0,
        initialAngle: 0,
        compositeOp: null,
        lineWidth: 1,
        lineCap: null,
        lineJoin: null,
        miterLimit: null,
        setLineWidth: function (a) {
            this.lineWidth = a;
            return this
        },
        setLineCap: function (a) {
            this.lineCap = a;
            return this
        },
        setLineJoin: function (a) {
            this.lineJoin = a;
            return this
        },
        setMiterLimit: function (a) {
            this.miterLimit = a;
            return this
        },
        getLineCap: function () {
            return this.lineCap
        },
        getLineJoin: function () {
            return this.lineJoin
        },
        getMiterLimit: function () {
            return this.miterLimit
        },
        getLineWidth: function () {
            return this.lineWidth
        },
        setFilled: function () {
            return this
        },
        setOutlined: function () {
            return this
        },
        setCompositeOp: function (a) {
            this.compositeOp = a;
            return this
        },
        setInitialAngle: function (a) {
            this.initialAngle = a;
            return this
        },
        initialize: function (a, b, c) {
            this.setSize(2 * b, 2 * b);
            this.nPeaks = a;
            this.maxRadius = b;
            this.minRadius = c;
            return this
        },
        paint: function (a) {
            var a = a.ctx,
                b = this.width / 2,
                c = this.height / 2,
                d = this.maxRadius,
                e = this.minRadius,
                f = b + d * Math.cos(this.initialAngle),
                g = c + d * Math.sin(this.initialAngle);
            a.lineWidth = this.lineWidth;
            if (this.lineCap) a.lineCap = this.lineCap;
            if (this.lineJoin) a.lineJoin = this.lineJoin;
            if (this.miterLimit) a.miterLimit = this.miterLimit;
            a.globalCompositeOperation = this.compositeOp;
            a.beginPath();
            a.moveTo(f, g);
            for (f = 1; f < this.nPeaks * 2; f++) {
                var h = Math.PI / this.nPeaks * f + this.initialAngle,
                    j = f % 2 === 0 ? d : e,
                    g = b + j * Math.cos(h),
                    h = c + j * Math.sin(h);
                a.lineTo(g, h)
            }
            a.lineTo(b + d * Math.cos(this.initialAngle),
                c + d * Math.sin(this.initialAngle));
            a.closePath();
            if (this.fillStyle) a.fillStyle = this.fillStyle, a.fill();
            if (this.strokeStyle) a.strokeStyle = this.strokeStyle, a.stroke()
        }
    };
    extend(CAAT.StarActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.IMActor = function () {
        CAAT.IMActor.superclass.constructor.call(this);
        return this
    };
    CAAT.IMActor.prototype = {
        imageProcessor: null,
        changeTime: 100,
        lastApplicationTime: -1,
        setImageProcessor: function (a) {
            this.imageProcessor = a;
            return this
        },
        setImageProcessingTime: function (a) {
            this.changeTime = a;
            return this
        },
        paint: function (a, b) {
            if (b - this.lastApplicationTime > this.changeTime) this.imageProcessor.apply(a, b), this.lastApplicationTime = b;
            this.imageProcessor.paint(a, b)
        }
    };
    extend(CAAT.IMActor, CAAT.ActorContainer,
        null)
})();
(function () {
    CAAT.AudioManager = function () {
        this.browserInfo = new CAAT.BrowserDetect;
        return this
    };
    CAAT.AudioManager.prototype = {
        browserInfo: null,
        musicEnabled: true,
        fxEnabled: true,
        audioCache: null,
        channels: null,
        workingChannels: null,
        loopingChannels: [],
        audioTypes: {
            mp3: "audio/mpeg;",
            ogg: 'audio/ogg; codecs="vorbis"',
            wav: 'audio/wav; codecs="1"',
            mp4: 'audio/mp4; codecs="mp4a.40.2"'
        },
        initialize: function (a) {
            this.audioCache = [];
            this.channels = [];
            this.workingChannels = [];
            for (var b = 0; b < a; b++) {
                var c = document.createElement("audio");
                if (null !==
                    c) {
                    c.finished = -1;
                    this.channels.push(c);
                    var d = this;
                    c.addEventListener("ended", function (a) {
                        var a = a.target,
                            b;
                        for (b = 0; b < d.workingChannels.length; b++)
                            if (d.workingChannels[b] === a) {
                                d.workingChannels.splice(b, 1);
                                break
                            }
                        a.caat_callback && a.caat_callback(a.caat_id);
                        d.channels.push(a)
                    }, false)
                }
            }
            return this
        },
        addAudioFromURL: function (a, b, c) {
            var d = null,
                e = document.createElement("audio");
            if (null !== e) {
                if (!e.canPlayType) return false;
                d = b.substr(b.lastIndexOf(".") + 1);
                d = e.canPlayType(this.audioTypes[d]);
                if (d !== "" && d !== "no") {
                    e.src =
                        b;
                    e.preload = "auto";
                    e.load();
                    if (c) e.caat_callback = c, e.caat_id = a;
                    this.audioCache.push({
                        id: a,
                        audio: e
                    });
                    return true
                }
            }
            return false
        },
        addAudioFromDomNode: function (a, b, c) {
            var d = b.src.substr(b.src.lastIndexOf(".") + 1);
            if (b.canPlayType(this.audioTypes[d])) {
                if (c) b.caat_callback = c, b.caat_id = a;
                this.audioCache.push({
                    id: a,
                    audio: b
                });
                return true
            }
            return false
        },
        addAudioElement: function (a, b, c) {
            if (typeof b === "string") return this.addAudioFromURL(a, b, c);
            else try {
                if (b instanceof HTMLAudioElement) return this.addAudioFromDomNode(a,
                    b, c)
            } catch (d) {}
            return false
        },
        addAudio: function (a, b, c) {
            if (b instanceof Array)
                for (var d = 0; d < b.length; d++) {
                    if (this.addAudioElement(a, b[d], c)) break
                } else this.addAudioElement(a, b, c);
            return this
        },
        getAudio: function (a) {
            for (var b = 0; b < this.audioCache.length; b++)
                if (this.audioCache[b].id === a) return this.audioCache[b].audio;
            return null
        },
        play: function (a) {
            if (!this.fxEnabled) return this;
            a = this.getAudio(a);
            if (null !== a && this.channels.length > 0) {
                var b = this.channels.shift();
                b.src = a.src;
                b.load();
                b.play();
                this.workingChannels.push(b)
            }
            return this
        },
        loop: function (a) {
            if (!this.musicEnabled) return this;
            a = this.getAudio(a);
            if (null !== a) {
                var b = document.createElement("audio");
                if (null !== b) return b.src = a.src, b.preload = "auto", this.browserInfo.browser === "Firefox" ? b.addEventListener("ended", function (a) {
                    a.target.currentTime = 0
                }, false) : b.loop = true, b.load(), b.play(), this.loopingChannels.push(b), b
            }
            return null
        },
        endSound: function () {
            var a;
            for (a = 0; a < this.workingChannels.length; a++) this.workingChannels[a].pause(), this.channels.push(this.workingChannels[a]);
            for (a = 0; a <
                this.loopingChannels.length; a++) this.loopingChannels[a].pause();
            return this
        },
        setSoundEffectsEnabled: function (a) {
            this.fxEnabled = a;
            return this
        },
        isSoundEffectsEnabled: function () {
            return this.fxEnabled
        },
        setMusicEnabled: function (a) {
            this.musicEnabled = a;
            for (var b = 0; b < this.loopingChannels.length; b++) a ? this.loopingChannels[b].play() : this.loopingChannels[b].pause();
            return this
        },
        isMusicEnabled: function () {
            return this.musicEnabled
        }
    }
})();
(function () {
    CAAT.Dock = function () {
        CAAT.Dock.superclass.constructor.call(this);
        return this
    };
    CAAT.Dock.prototype = {
        scene: null,
        ttask: null,
        minSize: 0,
        maxSize: 0,
        range: 2,
        layoutOp: 0,
        OP_LAYOUT_BOTTOM: 0,
        OP_LAYOUT_TOP: 1,
        OP_LAYOUT_LEFT: 2,
        OP_LAYOUT_RIGHT: 3,
        initialize: function (a) {
            this.scene = a;
            return this
        },
        setApplicationRange: function (a) {
            this.range = a;
            return this
        },
        setLayoutOp: function (a) {
            this.layoutOp = a;
            return this
        },
        setSizes: function (a, b) {
            this.minSize = a;
            this.maxSize = b;
            for (var c = 0; c < this.childrenList.length; c++) this.childrenList[c].width =
                a, this.childrenList[c].height = a;
            return this
        },
        layout: function () {
            var a, b;
            if (this.layoutOp === this.OP_LAYOUT_BOTTOM || this.layoutOp === this.OP_LAYOUT_TOP) {
                var c = b = 0;
                for (a = 0; a < this.getNumChildren(); a++) b += this.getChildAt(a).width;
                c = (this.width - b) / 2;
                for (a = 0; a < this.getNumChildren(); a++) b = this.getChildAt(a), b.x = c, c += b.width, b.y = this.layoutOp === this.OP_LAYOUT_BOTTOM ? this.maxSize - b.height : 0
            } else {
                for (a = c = b = 0; a < this.getNumChildren(); a++) b += this.getChildAt(a).height;
                c = (this.height - b) / 2;
                for (a = 0; a < this.getNumChildren(); a++) b =
                    this.getChildAt(a), b.y = c, c += b.height, b.x = this.layoutOp === this.OP_LAYOUT_LEFT ? 0 : this.width - b.width
            }
        },
        mouseMove: function () {
            this.actorNotPointed()
        },
        mouseExit: function () {
            this.actorNotPointed()
        },
        actorNotPointed: function () {
            var a, b = this;
            for (a = 0; a < this.getNumChildren(); a++) {
                var c = this.getChildAt(a);
                c.emptyBehaviorList();
                c.addBehavior((new CAAT.GenericBehavior).setValues(c.width, this.minSize, c, "width").setFrameTime(this.scene.time, 250)).addBehavior((new CAAT.GenericBehavior).setValues(c.height, this.minSize,
                    c, "height").setFrameTime(this.scene.time, 250));
                a === this.getNumChildren() - 1 && c.behaviorList[0].addListener({
                    behaviorApplied: function (a, b, c, g) {
                        g.parent.layout()
                    },
                    behaviorExpired: function (d, e, f) {
                        for (a = 0; a < b.getNumChildren(); a++) c = b.getChildAt(a), c.width = b.minSize, c.height = b.minSize;
                        f.parent.layout()
                    }
                })
            }
        },
        actorPointed: function (a, b, c) {
            for (var d = this.findChild(c), e = 0, e = this.layoutOp === this.OP_LAYOUT_BOTTOM || this.layoutOp === this.OP_LAYOUT_TOP ? a / c.width : b / c.height, a = 0; a < this.childrenList.length; a++) b = this.childrenList[a],
            b.emptyBehaviorList(), c = 0, c = a < d - this.range || a > d + this.range ? this.minSize : a === d ? this.maxSize : a < d ? this.minSize + (this.maxSize - this.minSize) * (Math.cos((a - d - e + 1) / this.range * Math.PI) + 1) / 2 : this.minSize + (this.maxSize - this.minSize) * (Math.cos((a - d - e) / this.range * Math.PI) + 1) / 2, b.height = c, b.width = c;
            this.layout()
        },
        actorMouseExit: function () {
            null !== this.ttask && this.ttask.cancel();
            var a = this;
            this.ttask = this.scene.createTimer(this.scene.time, 100, function () {
                a.actorNotPointed()
            }, null, null)
        },
        actorMouseEnter: function () {
            if (null !==
                this.ttask) this.ttask.cancel(), this.ttask = null
        },
        addChild: function (a) {
            var b = this;
            a.__Dock_mouseEnter = a.mouseEnter;
            a.__Dock_mouseExit = a.mouseExit;
            a.__Dock_mouseMove = a.mouseMove;
            a.mouseEnter = function (a) {
                b.actorMouseEnter(a);
                this.__Dock_mouseEnter(a)
            };
            a.mouseExit = function (a) {
                b.actorMouseExit(a);
                this.__Dock_mouseExit(a)
            };
            a.mouseMove = function (a) {
                b.actorPointed(a.point.x, a.point.y, a.source);
                this.__Dock_mouseMove(a)
            };
            a.width = this.minSize;
            a.height = this.minSize;
            return CAAT.Dock.superclass.addChild.call(this,
                a)
        }
    };
    extend(CAAT.Dock, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.Director = function () {
        CAAT.Director.superclass.constructor.call(this);
        this.browserInfo = new CAAT.BrowserDetect;
        this.audioManager = (new CAAT.AudioManager).initialize(8);
        this.scenes = [];
        this.mousePoint = new CAAT.Point(0, 0, 0);
        this.prevMousePoint = new CAAT.Point(0, 0, 0);
        this.screenMousePoint = new CAAT.Point(0, 0, 0);
        this.isMouseDown = false;
        this.lastSelectedActor = null;
        this.dragging = false;
        return this
    };
    CAAT.Director.prototype = {
        debug: false,
        onRenderStart: null,
        onRenderEnd: null,
        mousePoint: null,
        prevMousePoint: null,
        screenMousePoint: null,
        isMouseDown: false,
        lastSelectedActor: null,
        dragging: false,
        scenes: null,
        currentScene: null,
        canvas: null,
        crc: null,
        ctx: null,
        time: 0,
        timeline: 0,
        imagesCache: null,
        audioManager: null,
        clear: true,
        transitionScene: null,
        browserInfo: null,
        gl: null,
        glEnabled: false,
        glTextureManager: null,
        glTtextureProgram: null,
        glColorProgram: null,
        pMatrix: null,
        coords: null,
        coordsIndex: 0,
        uv: null,
        uvIndex: 0,
        front_to_back: false,
        currentTexturePage: 0,
        currentOpacity: 1,
        intervalId: null,
        frameCounter: 0,
        RESIZE_NONE: 1,
        RESIZE_WIDTH: 2,
        RESIZE_HEIGHT: 4,
        RESIZE_BOTH: 8,
        RESIZE_PROPORTIONAL: 16,
        resize: 1,
        onResizeCallback: null,
        checkDebug: function () {
            if (CAAT.DEBUG) {
                var a = (new CAAT.Debug).initialize(this.width, 60);
                this.debugInfo = a.debugInfo.bind(a)
            }
        },
        getRenderType: function () {
            return this.glEnabled ? "WEBGL" : "CANVAS"
        },
        windowResized: function (a, b) {
            switch (this.resize) {
            case this.RESIZE_WIDTH:
                this.setBounds(0, 0, a, this.height);
                break;
            case this.RESIZE_HEIGHT:
                this.setBounds(0, 0, this.width, b);
                break;
            case this.RESIZE_BOTH:
                this.setBounds(0, 0, a, b);
                break;
            case this.RESIZE_PROPORTIONAL:
                this.setScaleProportional(a,
                    b)
            }
            if (this.onResizeCallback) this.onResizeCallback(this, a, b)
        },
        setScaleProportional: function (a, b) {
            var c = Math.min(a / this.referenceWidth, b / this.referenceHeight);
            this.setScaleAnchored(c, c, 0, 0);
            this.canvas.width = this.referenceWidth * c;
            this.canvas.height = this.referenceHeight * c;
            this.crc = this.ctx = this.canvas.getContext(this.glEnabled ? "experimental-webgl" : "2d");
            this.glEnabled && this.glReset()
        },
        enableResizeEvents: function (a, b) {
            a === this.RESIZE_BOTH || a === this.RESIZE_WIDTH || a === this.RESIZE_HEIGHT || a === this.RESIZE_PROPORTIONAL ?
                (this.referenceWidth = this.width, this.referenceHeight = this.height, this.resize = a, CAAT.registerResizeListener(this), this.onResizeCallback = b, this.windowResized(window.innerWidth, window.innerHeight)) : (CAAT.unregisterResizeListener(this), this.onResizeCallback = null)
        },
        setBounds: function (a, b, c, d) {
            CAAT.Director.superclass.setBounds.call(this, a, b, c, d);
            this.canvas.width = c;
            this.canvas.height = d;
            this.crc = this.ctx = this.canvas.getContext(this.glEnabled ? "experimental-webgl" : "2d");
            for (a = 0; a < this.scenes.length; a++) this.scenes[a].setBounds(0,
                0, c, d);
            this.glEnabled && this.glReset();
            return this
        },
        initialize: function (a, b, c) {
            this.canvas = c = c || document.createElement("canvas");
            this.setBounds(0, 0, a, b);
            this.create();
            this.enableEvents();
            this.timeline = (new Date).getTime();
            this.transitionScene = (new CAAT.Scene).create().setBounds(0, 0, a, b);
            c = document.createElement("canvas");
            c.width = a;
            c.height = b;
            a = (new CAAT.Actor).create().setBackgroundImage(c);
            this.transitionScene.ctx = c.getContext("2d");
            this.transitionScene.addChildImmediately(a);
            this.transitionScene.setEaseListener(this);
            this.checkDebug();
            return this
        },
        glReset: function () {
            this.pMatrix = makeOrtho(0, this.canvas.width, this.canvas.height, 0, -1, 1);
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.glColorProgram.setMatrixUniform(this.pMatrix);
            this.glTextureProgram.setMatrixUniform(this.pMatrix);
            this.gl.viewportWidth = this.canvas.width;
            this.gl.viewportHeight = this.canvas.height
        },
        initializeGL: function (a, b, c) {
            c = c || document.createElement("canvas");
            c.width = a;
            c.height = b;
            try {
                this.gl = c.getContext("experimental-webgl"),
                this.gl.viewportWidth = a, this.gl.viewportHeight = b
            } catch (d) {}
            if (this.gl) this.canvas = c, this.create(), this.setBounds(0, 0, a, b), this.crc = this.ctx, this.enableEvents(), this.timeline = (new Date).getTime(), this.glColorProgram = (new CAAT.ColorProgram(this.gl)).create().initialize(), this.glTextureProgram = (new CAAT.TextureProgram(this.gl)).create().initialize(), this.glTextureProgram.useProgram(), this.glReset(), this.coords = new Float32Array(24576), this.uv = new Float32Array(16384), this.gl.clearColor(0, 0, 0, 255), this.front_to_back ?
                (this.gl.clearDepth(1), this.gl.enable(this.gl.DEPTH_TEST), this.gl.depthFunc(this.gl.LESS)) : this.gl.disable(this.gl.DEPTH_TEST), this.gl.enable(this.gl.BLEND), this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA), this.glEnabled = true, this.checkDebug();
            else return this.initialize(a, b, c);
            return this
        },
        createScene: function () {
            var a = (new CAAT.Scene).create();
            this.addScene(a);
            return a
        },
        setImagesCache: function (a, b, c) {
            var d;
            if (null !== this.glTextureManager) this.glTextureManager.deletePages(), this.glTextureManager =
                null;
            if (this.imagesCache) {
                var e = [];
                for (d = 0; d < this.imagesCache.length; d++) e.push(this.imagesCache[d].id);
                for (d = 0; d < e.length; d++) delete this.imagesCache[e[d]]
            }
            if (this.imagesCache = a)
                for (d = 0; d < a.length; d++) this.imagesCache[a[d].id] = a[d].image;
            this.tpW = b || 2048;
            this.tpH = c || 2048;
            this.updateGLPages()
        },
        updateGLPages: function () {
            if (this.glEnabled) this.glTextureManager = new CAAT.GLTexturePageManager, this.glTextureManager.createPages(this.gl, this.tpW, this.tpH, this.imagesCache), this.currentTexturePage = this.glTextureManager.pages[0],
            this.glTextureProgram.setTexture(this.currentTexturePage.texture)
        },
        addImage: function (a, b, c) {
            if (this.getImage(a))
                for (var d = 0; d < this.imagesCache.length; d++) {
                    if (this.imagesCache[d].id === a) {
                        this.imagesCache[d].image = b;
                        break
                    }
                } else this.imagesCache.push({
                    id: a,
                    image: b
                });
            this.imagesCache[a] = b;
            c || this.updateGLPages()
        },
        deleteImage: function (a, b) {
            for (var c = 0; c < this.imagesCache.length; c++)
                if (this.imagesCache[c].id === a) {
                    delete this.imagesCache[a];
                    this.imagesCache.splice(c, 1);
                    break
                }
            b || this.updateGLPages()
        },
        setGLCurrentOpacity: function (a) {
            this.currentOpacity =
                a;
            this.glTextureProgram.setAlpha(a)
        },
        glRender: function (a, b, c) {
            var a = a || this.coords,
                c = c || this.uv,
                b = b || this.coordsIndex,
                d = this.gl,
                b = b / 12 * 2;
            this.glTextureProgram.updateVertexBuffer(a);
            this.glTextureProgram.updateUVBuffer(c);
            d.drawElements(d.TRIANGLES, 3 * b, d.UNSIGNED_SHORT, 0)
        },
        glFlush: function () {
            this.coordsIndex !== 0 && this.glRender(this.coords, this.coordsIndex, this.uv);
            this.uvIndex = this.coordsIndex = 0
        },
        findActorAtPosition: function (a) {
            for (var b = this.childrenList.length - 1; b >= 0; b--) {
                var c = this.childrenList[b],
                    d = new CAAT.Point(a.x, a.y, 0),
                    c = c.findActorAtPosition(d);
                if (null !== c) return c
            }
            return this
        },
        render: function (a) {
            this.time += a;
            this.animate(this, a);
            if (CAAT.DEBUG) this.size_active = this.size_total = 0;
            var b = this.childrenList.length,
                c, d;
            if (this.glEnabled) {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                for (c = this.uvIndex = this.coordsIndex = 0; c < b; c++) {
                    var e = this.childrenList[c];
                    if (e.isInAnimationFrame(this.time)) {
                        d = e.time - e.start_time;
                        if (e.onRenderStart) e.onRenderStart(d);
                        e.paintActorGL(this, d);
                        if (e.onRenderEnd) e.onRenderEnd(d);
                        e.isPaused() || (e.time += a);
                        CAAT.DEBUG && (this.size_total += e.size_total, this.size_active += e.size_active)
                    }
                }
                this.glFlush()
            } else {
                this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = "source-over";
                this.clear && this.ctx.clearRect(0, 0, this.width, this.height);
                for (c = 0; c < b; c++)
                    if (e = this.childrenList[c], e.isInAnimationFrame(this.time)) {
                        d = e.time - e.start_time;
                        this.ctx.save();
                        if (e.onRenderStart) e.onRenderStart(d);
                        e.paintActor(this, d);
                        if (e.onRenderEnd) e.onRenderEnd(d);
                        this.ctx.restore();
                        if (this.debug) this.ctx.strokeStyle = "red", e.drawScreenBoundingBox(this, d);
                        e.isPaused() || (e.time += a);
                        CAAT.DEBUG && (this.size_total += e.size_total, this.size_active += e.size_active)
                    }
            }
            this.frameCounter++
        },
        animate: function () {
            this.setModelViewMatrix(this.glEnabled);
            for (var a = 0; a < this.childrenList.length; a++) this.childrenList[a].animate(this, this.childrenList[a].time - this.childrenList[a].start_time);
            return this
        },
        renderToContext: function (a, b) {
            if (b.isInAnimationFrame(this.time)) {
                a.globalAlpha = 1;
                a.globalCompositeOperation =
                    "source-over";
                a.clearRect(0, 0, this.width, this.height);
                a.setTransform(1, 0, 0, 0, 1, 0);
                var c = this.ctx,
                    d = this.crc;
                this.ctx = this.crc = a;
                a.save();
                var e = this.worldModelViewMatrix;
                this.worldModelViewMatrix = new CAAT.Matrix;
                this.wdirty = true;
                b.animate(this, b.time);
                if (b.onRenderStart) b.onRenderStart(b.time);
                b.paintActor(this, b.time);
                if (b.onRenderEnd) b.onRenderEnd(b.time);
                this.worldModelViewMatrix = e;
                a.restore();
                this.ctx = c;
                this.crc = d
            }
        },
        addScene: function (a) {
            a.setBounds(0, 0, this.width, this.height);
            this.scenes.push(a);
            a.setEaseListener(this);
            null === this.currentScene && this.setScene(0)
        },
        getNumScenes: function () {
            return this.scenes.length
        },
        easeInOut: function (a, b, c, d, e, f, g, h, j, k) {
            if (a !== this.getCurrentSceneIndex()) {
                a = this.scenes[a];
                d = this.scenes[d];
                if (!this.glEnabled && !navigator.browser === "iOS") this.worldModelViewMatrix.transformRenderingContext(this.transitionScene.ctx), this.renderToContext(this.transitionScene.ctx, d), d = this.transitionScene;
                a.setExpired(false);
                d.setExpired(false);
                a.mouseEnabled = false;
                d.mouseEnabled =
                    false;
                a.resetTransform();
                d.resetTransform();
                a.setLocation(0, 0);
                d.setLocation(0, 0);
                a.alpha = 1;
                d.alpha = 1;
                b === CAAT.Scene.prototype.EASE_ROTATION ? a.easeRotationIn(g, h, c, j) : b === CAAT.Scene.prototype.EASE_SCALE ? a.easeScaleIn(0, g, h, c, j) : a.easeTranslationIn(g, h, c, j);
                e === CAAT.Scene.prototype.EASE_ROTATION ? d.easeRotationOut(g, h, f, k) : e === CAAT.Scene.prototype.EASE_SCALE ? d.easeScaleOut(0, g, h, f, k) : d.easeTranslationOut(g, h, f, k);
                this.childrenList = [];
                this.addChild(d);
                this.addChild(a)
            }
        },
        easeInOutRandom: function (a, b,
            c, d) {
            var e = Math.random(),
                f = Math.random(),
                g;
            e < 0.33 ? (e = CAAT.Scene.prototype.EASE_ROTATION, g = (new CAAT.Interpolator).createExponentialInOutInterpolator(4)) : e < 0.66 ? (e = CAAT.Scene.prototype.EASE_SCALE, g = (new CAAT.Interpolator).createElasticOutInterpolator(1.1, 0.4)) : (e = CAAT.Scene.prototype.EASE_TRANSLATE, g = (new CAAT.Interpolator).createBounceOutInterpolator());
            var h;
            f < 0.33 ? (f = CAAT.Scene.prototype.EASE_ROTATION, h = (new CAAT.Interpolator).createExponentialInOutInterpolator(4)) : f < 0.66 ? (f = CAAT.Scene.prototype.EASE_SCALE,
                h = (new CAAT.Interpolator).createExponentialOutInterpolator(4)) : (f = CAAT.Scene.prototype.EASE_TRANSLATE, h = (new CAAT.Interpolator).createBounceOutInterpolator());
            this.easeInOut(a, e, Math.random() * 8.99 >> 0, b, f, Math.random() * 8.99 >> 0, c, d, g, h)
        },
        easeIn: function (a, b, c, d, e, f) {
            a = this.scenes[a];
            b === CAAT.Scene.prototype.EASE_ROTATION ? a.easeRotationIn(c, d, e, f) : b === CAAT.Scene.prototype.EASE_SCALE ? a.easeScaleIn(0, c, d, e, f) : a.easeTranslationIn(c, d, e, f);
            this.childrenList = [];
            this.addChild(a);
            a.resetTransform();
            a.setLocation(0,
                0);
            a.alpha = 1;
            a.mouseEnabled = false;
            a.setExpired(false)
        },
        setScene: function (a) {
            a = this.scenes[a];
            this.childrenList = [];
            this.addChild(a);
            this.currentScene = a;
            a.setExpired(false);
            a.mouseEnabled = true;
            a.resetTransform();
            a.setLocation(0, 0);
            a.alpha = 1;
            a.activated()
        },
        switchToScene: function (a, b, c, d) {
            var e = this.getSceneIndex(this.currentScene);
            d ? this.easeInOutRandom(a, e, b, c) : this.setScene(a)
        },
        switchToPrevScene: function (a, b, c) {
            var d = this.getSceneIndex(this.currentScene);
            this.getNumScenes() <= 1 || d === 0 || (c ? this.easeInOutRandom(d -
                1, d, a, b) : this.setScene(d - 1))
        },
        switchToNextScene: function (a, b, c) {
            var d = this.getSceneIndex(this.currentScene);
            this.getNumScenes() <= 1 || d === this.getNumScenes() - 1 || (c ? this.easeInOutRandom(d + 1, d, a, b) : this.setScene(d + 1))
        },
        mouseEnter: function () {},
        mouseExit: function () {},
        mouseMove: function () {},
        mouseDown: function () {},
        mouseUp: function () {},
        mouseDrag: function () {},
        easeEnd: function (a, b) {
            b ? (this.currentScene = a, this.currentScene.activated()) : a.setExpired(true);
            a.mouseEnabled = true;
            a.emptyBehaviorList()
        },
        getSceneIndex: function (a) {
            for (var b =
                0; b < this.scenes.length; b++)
                if (this.scenes[b] === a) return b;
            return -1
        },
        getScene: function (a) {
            return this.scenes[a]
        },
        getCurrentSceneIndex: function () {
            return this.getSceneIndex(this.currentScene)
        },
        getBrowserName: function () {
            return this.browserInfo.browser
        },
        getBrowserVersion: function () {
            return this.browserInfo.version
        },
        getOSName: function () {
            return this.browserInfo.OS
        },
        getImage: function (a) {
            var b = this.imagesCache[a];
            if (b) return b;
            for (b = 0; b < this.imagesCache.length; b++)
                if (this.imagesCache[b].id === a) return this.imagesCache[b].image;
            return null
        },
        addAudio: function (a, b) {
            this.audioManager.addAudio(a, b);
            return this
        },
        audioPlay: function (a) {
            this.audioManager.play(a)
        },
        audioLoop: function (a) {
            return this.audioManager.loop(a)
        },
        endSound: function () {
            return this.audioManager.endSound()
        },
        setSoundEffectsEnabled: function (a) {
            return this.audioManager.setSoundEffectsEnabled(a)
        },
        setMusicEnabled: function (a) {
            return this.audioManager.setMusicEnabled(a)
        },
        isMusicEnabled: function () {
            return this.audioManager.isMusicEnabled()
        },
        isSoundEffectsEnabled: function () {
            return this.audioManager.isSoundEffectsEnabled()
        },
        emptyScenes: function () {
            this.scenes = []
        },
        addChild: function (a) {
            a.parent = this;
            this.childrenList.push(a)
        },
        loop: function (a, b, c) {
            if (c) this.onRenderStart = b, this.onRenderEnd = c;
            else if (b) this.onRenderEnd = b;
            CAAT.loop()
        },
        renderFrame: function () {
            var a = (new Date).getTime(),
                b = a - this.timeline;
            if (this.onRenderStart) this.onRenderStart(b);
            this.render(b);
            this.debugInfo && this.debugInfo(this.size_total, this.size_active);
            this.timeline = a;
            if (this.onRenderEnd) this.onRenderEnd(b)
        },
        endLoop: function () {},
        setClear: function (a) {
            this.clear =
                a;
            return this
        },
        getAudioManager: function () {
            return this.audioManager
        },
        cumulateOffset: function (a, b, c) {
            var d = c + "Left";
            c += "Top";
            for (var e = 0, f = 0, g; a && a.style;)
                if (g = a.currentStyle ? a.currentStyle.position : (g = (a.ownerDocument.defaultView || a.ownerDocument.parentWindow).getComputedStyle(a, null)) ? g.getPropertyValue("position") : null, /^(fixed)$/.test(g)) break;
                else e += a[d], f += a[c], a = a[b];
            return {
                x: e,
                y: f,
                style: g
            }
        },
        getOffset: function (a) {
            var b = this.cumulateOffset(a, "offsetParent", "offset");
            return b.style === "fixed" ?
                (a = this.cumulateOffset(a, a.parentNode ? "parentNode" : "parentElement", "scroll"), {
                x: b.x + a.x,
                y: b.y + a.y
            }) : {
                x: b.x,
                y: b.y
            }
        },
        getCanvasCoord: function (a, b) {
            var c = 0,
                d = 0;
            if (!b) b = window.event;
            if (b.pageX || b.pageY) c = b.pageX, d = b.pageY;
            else if (b.clientX || b.clientY) c = b.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, d = b.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            var e = this.getOffset(b.target);
            c -= e.x;
            d -= e.y;
            d = new CAAT.Point(c, d);
            this.modelViewMatrixI = this.modelViewMatrix.getInverse();
            this.modelViewMatrixI.transformCoord(d);
            c = d.x;
            d = d.y;
            a.set(c, d);
            this.screenMousePoint.set(c, d)
        },
        enableEvents: function () {
            function a(a) {
                var b = a.changedTouches[0],
                    d = "";
                switch (a.type) {
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
                var h = document.createEvent("MouseEvent");
                h.initMouseEvent(d, true, true, c.canvas, 1, b.screenX, b.screenY, b.clientX, b.clientY, false, false, false, false, 0, null);
                c.canvas.dispatchEvent(h);
                a.preventDefault()
            }
            CAAT.RegisterDirector(this);
            var b = this.canvas,
                c = this,
                d = false;
            b.addEventListener("mouseup", function (a) {
                a.preventDefault();
                c.isMouseDown = false;
                c.getCanvasCoord(c.mousePoint, a);
                var b = null,
                    g = c.lastSelectedActor;
                null !== g && (b = g.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0)), g.actionPerformed && g.contains(b.x, b.y) && g.actionPerformed(a), g.mouseUp((new CAAT.MouseEvent).init(b.x, b.y, a, g, c.screenMousePoint)));
                !c.dragging && null !== g && g.contains(b.x, b.y) && g.mouseClick((new CAAT.MouseEvent).init(b.x,
                    b.y, a, g, c.screenMousePoint));
                d = c.dragging = false;
                CAAT.setCursor("default")
            }, false);
            b.addEventListener("mousedown", function (a) {
                a.preventDefault();
                c.getCanvasCoord(c.mousePoint, a);
                c.isMouseDown = true;
                var b = c.findActorAtPosition(c.mousePoint);
                if (null !== b) {
                    var d = b.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0));
                    b.mouseDown((new CAAT.MouseEvent).init(d.x, d.y, a, b, new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y)))
                }
                c.lastSelectedActor = b
            }, false);
            // b.addEventListener("mouseover",
            //     function (a) {
            //         a.preventDefault();
            //         c.getCanvasCoord(c.mousePoint, a);
            //         var b = c.findActorAtPosition(c.mousePoint),
            //             d;
            //         null !== b && (d = b.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0)), b.mouseEnter((new CAAT.MouseEvent).init(d.x, d.y, a, b, c.screenMousePoint)));
            //         c.lastSelectedActor = b
            //     }, false);
            // b.addEventListener("mouseout", function (a) {
            //     a.preventDefault();
            //     if (null !== c.lastSelectedActor) {
            //         c.getCanvasCoord(c.mousePoint, a);
            //         var b = new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0);
            //         c.lastSelectedActor.viewToModel(b);
            //         c.lastSelectedActor.mouseExit((new CAAT.MouseEvent).init(b.x, b.y, a, c.lastSelectedActor, c.screenMousePoint));
            //         c.lastSelectedActor = null
            //     }
            //     d = c.isMouseDown = false
            // }, false);
            b.addEventListener("mousemove", function (a) {
                a.preventDefault();
                // c.getCanvasCoord(c.mousePoint, a);
                // var b, g;
                // if (c.isMouseDown && null !== c.lastSelectedActor) {
                //     b = c.lastSelectedActor;
                //     g = b.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0));
                //     c.dragging = true;
                //     var h = b.x,
                //         j = b.y;
                //     b.mouseDrag((new CAAT.MouseEvent).init(g.x, g.y, a, b, new CAAT.Point(c.screenMousePoint.x,
                //         c.screenMousePoint.y)));
                //     c.prevMousePoint.x = g.x;
                //     c.prevMousePoint.y = g.y;
                //     h === b.x && j === b.y && (h = b.contains(g.x, g.y), d && !h && (b.mouseExit((new CAAT.MouseEvent).init(g.x, g.y, a, b, c.screenMousePoint)), d = false), !d && h && (b.mouseEnter((new CAAT.MouseEvent).init(g.x, g.y, a, b, c.screenMousePoint)), d = true))
                // } else d = true, b = c.findActorAtPosition(c.mousePoint), b !== c.lastSelectedActor && (null !== c.lastSelectedActor && (g = c.lastSelectedActor.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0)), c.lastSelectedActor.mouseExit((new CAAT.MouseEvent).init(g.x,
                //     g.y, a, c.lastSelectedActor, c.screenMousePoint))), null !== b && (g = b.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0)), b.mouseEnter((new CAAT.MouseEvent).init(g.x, g.y, a, b, c.screenMousePoint)))), g = b.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0)), null !== b && b.mouseMove((new CAAT.MouseEvent).init(g.x, g.y, a, b, c.screenMousePoint)), c.lastSelectedActor = b
            }, false);
            // b.addEventListener("dblclick", function (a) {
            //     a.preventDefault();
            //     c.getCanvasCoord(c.mousePoint, a);
            //     null !==
            //         c.lastSelectedActor && (c.lastSelectedActor.viewToModel(new CAAT.Point(c.screenMousePoint.x, c.screenMousePoint.y, 0)), c.lastSelectedActor.mouseDblClick((new CAAT.MouseEvent).init(c.mousePoint.x, c.mousePoint.y, a, c.lastSelectedActor, c.screenMousePoint)))
            // }, false);
            // b.addEventListener("touchstart", a, false);
            b.addEventListener("touchmove", a, false);
            // b.addEventListener("touchend", a, false);
            // b.addEventListener("touchcancel", a, false);
        }
    };
    extend(CAAT.Director, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.MouseEvent = function () {
        this.point = new CAAT.Point(0, 0, 0);
        this.screenPoint = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.MouseEvent.prototype = {
        screenPoint: null,
        point: null,
        time: 0,
        source: null,
        shift: false,
        control: false,
        alt: false,
        meta: false,
        sourceEvent: null,
        init: function (a, b, c, d, e) {
            this.point.set(a, b);
            this.source = d;
            this.screenPoint = e;
            this.alt = c.altKey;
            this.control = c.ctrlKey;
            this.shift = c.shiftKey;
            this.meta = c.metaKey;
            this.sourceEvent = c;
            this.x = a;
            this.y = b;
            return this
        },
        isAltDown: function () {
            return this.alt
        },
        isControlDown: function () {
            return this.control
        },
        isShiftDown: function () {
            return this.shift
        },
        isMetaDown: function () {
            return this.meta
        },
        getSourceEvent: function () {
            return this.sourceEvent
        }
    }
})();
CAAT.PMR = 64;
CAAT.DEBUG = false;
CAAT.log = function () {
    window.console && window.console.log(Array.prototype.slice.call(arguments))
};
CAAT.FRAME_TIME = 0;
CAAT.GlobalEventsEnabled = false;
CAAT.prevOnDeviceMotion = null;
CAAT.onDeviceMotion = null;
CAAT.accelerationIncludingGravity = {
    x: 0,
    y: 0,
    z: 0
};
CAAT.rotationRate = {
    alpha: 0,
    beta: 0,
    gamma: 0
};
CAAT.DRAG_THRESHOLD_X = 5;
CAAT.DRAG_THRESHOLD_Y = 5;
CAAT.renderEnabled = false;
CAAT.FPS = 60;
CAAT.windowResizeListeners = [];
CAAT.registerResizeListener = function (a) {
    CAAT.windowResizeListeners.push(a)
};
CAAT.unregisterResizeListener = function (a) {
    for (var b = 0; b < CAAT.windowResizeListeners.length; b++)
        if (a === CAAT.windowResizeListeners[b]) {
            CAAT.windowResizeListeners.splice(b, 1);
            break
        }
};
CAAT.keyListeners = [];
CAAT.registerKeyListener = function (a) {
    CAAT.keyListeners.push(a)
};
CAAT.SHIFT_KEY = 16;
CAAT.CONTROL_KEY = 17;
CAAT.ALT_KEY = 18;
CAAT.ENTER_KEY = 13;
CAAT.KEY_MODIFIERS = {
    alt: false,
    control: false,
    shift: false
};
CAAT.GlobalEnableEvents = function () {
    if (!CAAT.GlobalEventsEnabled) this.GlobalEventsEnabled = true, window.addEventListener("keydown", function (a) {
        var b = a.which ? a.which : a.keyCode;
        if (b === CAAT.SHIFT_KEY) CAAT.KEY_MODIFIERS.shift = true;
        else if (b === CAAT.CONTROL_KEY) CAAT.KEY_MODIFIERS.control = true;
        else if (b === CAAT.ALT_KEY) CAAT.KEY_MODIFIERS.alt = true;
        else
            for (var c = 0; c < CAAT.keyListeners.length; c++) CAAT.keyListeners[c](b, "down", {
                    alt: CAAT.KEY_MODIFIERS.alt,
                    control: CAAT.KEY_MODIFIERS.control,
                    shift: CAAT.KEY_MODIFIERS.shift
                },
                a)
    }, false), window.addEventListener("keyup", function (a) {
        var b = a.which ? a.which : a.keyCode;
        if (b === CAAT.SHIFT_KEY) CAAT.KEY_MODIFIERS.shift = false;
        else if (b === CAAT.CONTROL_KEY) CAAT.KEY_MODIFIERS.control = false;
        else if (b === CAAT.ALT_KEY) CAAT.KEY_MODIFIERS.alt = false;
        else
            for (var c = 0; c < CAAT.keyListeners.length; c++) CAAT.keyListeners[c](b, "up", {
                alt: CAAT.KEY_MODIFIERS.alt,
                control: CAAT.KEY_MODIFIERS.control,
                shift: CAAT.KEY_MODIFIERS.shift
            }, a)
    }, false), window.addEventListener("resize", function () {
        for (var a = 0; a < CAAT.windowResizeListeners.length; a++) CAAT.windowResizeListeners[a].windowResized(window.innerWidth,
            window.innerHeight)
    }, false)
};
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
        window.setTimeout(a, 1E3 / CAAT.FPS)
    }
}();
CAAT.loop = function (a) {
    if (!CAAT.renderEnabled) CAAT.FPS = a || 60, CAAT.renderEnabled = true, CAAT.NO_PERF ? setInterval(function () {
        for (var a = 0, c = CAAT.director.length; a < c; a++) CAAT.director[a].renderFrame()
    }, 1E3 / CAAT.FPS) : CAAT.renderFrame()
};
CAAT.renderFrame = function () {
    for (var a = (new Date).getTime(), b = 0, c = CAAT.director.length; b < c; b++) CAAT.director[b].renderFrame();
    a = (new Date).getTime() - a;
    CAAT.FRAME_TIME = a;
    window.requestAnimFrame(CAAT.renderFrame, 0)
};
CAAT.setCursor = function (a) {
    if (navigator.browser !== "iOS") document.body.style.cursor = a
};
CAAT.RegisterDirector = function (a) {
    if (!CAAT.director) CAAT.director = [];
    CAAT.director.push(a);
    CAAT.GlobalEnableEvents()
};
(function () {
    function a(a) {
        CAAT.rotationRate = {
            alpha: 0,
            beta: a[0],
            gamma: a[1]
        }
    }
    window.DeviceOrientationEvent ? window.addEventListener("deviceorientation", function (b) {
        a([b.beta, b.gamma])
    }, true) : window.DeviceMotionEvent ? window.addEventListener("devicemotion", function (b) {
        a([b.acceleration.x * 2, b.acceleration.y * 2])
    }, true) : window.addEventListener("MozOrientation", function (b) {
        a([-b.y * 45, b.x * 45])
    }, true)
})();
(function () {
    CAAT.CompoundImage = function () {
        this.paint = this.paintN;
        return this
    };
    CAAT.CompoundImage.prototype = {
        TR_NONE: 0,
        TR_FLIP_HORIZONTAL: 1,
        TR_FLIP_VERTICAL: 2,
        TR_FLIP_ALL: 3,
        image: null,
        rows: 0,
        cols: 0,
        width: 0,
        height: 0,
        singleWidth: 0,
        singleHeight: 0,
        xyCache: null,
        initialize: function (a, b, c) {
            this.image = a;
            this.rows = b;
            this.cols = c;
            this.width = a.width;
            this.height = a.height;
            this.singleWidth = Math.floor(this.width / c);
            this.singleHeight = Math.floor(this.height / b);
            this.xyCache = [];
            var d, e;
            if (a.__texturePage) {
                a.__du = this.singleWidth /
                    a.__texturePage.width;
                a.__dv = this.singleHeight / a.__texturePage.height;
                d = this.singleWidth;
                e = this.singleHeight;
                var f = this.cols;
                if (a.inverted) a = d, d = e, e = a, f = this.rows;
                for (var g = this.image.__tx, h = this.image.__ty, j = this.image.__texturePage, a = 0; a < b * c; a++) {
                    var k = g + (a % f >> 0) * d,
                        l = h + (a / f >> 0) * e,
                        m = k + d,
                        o = l + e;
                    this.xyCache.push([k / j.width, l / j.height, m / j.width, o / j.height, k, l, m, o])
                }
            } else
                for (a = 0; a < b * c; a++) d = (a % this.cols | 0) * this.singleWidth, e = (a / this.cols | 0) * this.singleHeight, this.xyCache.push([d, e]);
            return this
        },
        paintInvertedH: function (a,
            b, c, d) {
            a.save();
            a.translate((0.5 + c | 0) + this.singleWidth, 0.5 + d | 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, 0, 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },
        paintInvertedV: function (a, b, c, d) {
            a.save();
            a.translate(c + 0.5 | 0, 0.5 + d + this.singleHeight | 0);
            a.scale(1, -1);
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, 0, 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },
        paintInvertedHV: function (a, b, c, d) {
            a.save();
            a.translate(c + 0.5 | 0, 0.5 + d + this.singleHeight | 0);
            a.scale(1, -1);
            a.translate(this.singleWidth, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, 0, 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },
        paintN: function (a, b, c, d) {
            a.drawImage(this.image, this.xyCache[b][0] >> 0, this.xyCache[b][1] >> 0, this.singleWidth, this.singleHeight, c >> 0, d >> 0, this.singleWidth, this.singleHeight);
            return this
        },
        paint: function (a,
            b, c, d) {
            return this.paintN(a, b, c, d)
        },
        paintScaled: function (a, b, c, d, e, f) {
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, c + 0.5 | 0, d + 0.5 | 0, e, f);
            return this
        },
        getNumImages: function () {
            return this.rows * this.cols
        },
        setUV: function (a, b, c) {
            var d = this.image;
            d.__texturePage && (d.inverted ? (b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][1], b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][3], b[c++] = this.xyCache[a][0], b[c++] = this.xyCache[a][3], b[c++] = this.xyCache[a][0],
                b[c++] = this.xyCache[a][1]) : (b[c++] = this.xyCache[a][0], b[c++] = this.xyCache[a][1], b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][1], b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][3], b[c++] = this.xyCache[a][0], b[c++] = this.xyCache[a][3]))
        }
    }
})();
(function () {
    CAAT.SpriteImage = function () {
        this.paint = this.paintN;
        this.setAnimationImageIndex([0]);
        return this
    };
    CAAT.SpriteImage.prototype = {
        animationImageIndex: null,
        prevAnimationTime: -1,
        changeFPS: 1E3,
        transformation: 0,
        spriteIndex: 0,
        TR_NONE: 0,
        TR_FLIP_HORIZONTAL: 1,
        TR_FLIP_VERTICAL: 2,
        TR_FLIP_ALL: 3,
        TR_FIXED_TO_SIZE: 4,
        image: null,
        rows: 1,
        columns: 1,
        width: 0,
        height: 0,
        singleWidth: 0,
        singleHeight: 0,
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0,
        xyCache: null,
        ownerActor: null,
        setOwner: function (a) {
            this.ownerActor = a;
            return this
        },
        getRows: function () {
            return this.rows
        },
        getColumns: function () {
            return this.columns
        },
        getRef: function () {
            var a = new CAAT.SpriteImage;
            a.image = this.image;
            a.rows = this.rows;
            a.columns = this.columns;
            a.width = this.width;
            a.height = this.height;
            a.singleWidth = this.singleWidth;
            a.singleHeight = this.singleHeight;
            a.xyCache = this.xyCache;
            a.offsetX = this.offsetX;
            a.offsetY = this.offsetY;
            a.scaleX = this.scaleX;
            a.scaleY = this.scaleY;
            return a
        },
        setOffsetX: function (a) {
            this.offsetX = a | 0;
            return this
        },
        setOffsetY: function (a) {
            this.offsetY = a | 0;
            return this
        },
        setOffset: function (a, b) {
            this.offsetX = a;
            this.offsetY = b;
            return this
        },
        initialize: function (a, b, c) {
            this.image = a;
            this.rows = b;
            this.columns = c;
            this.width = a.width;
            this.height = a.height;
            this.singleWidth = Math.floor(this.width / c);
            this.singleHeight = Math.floor(this.height / b);
            this.xyCache = [];
            var d, e;
            if (a.__texturePage) {
                a.__du = this.singleWidth / a.__texturePage.width;
                a.__dv = this.singleHeight / a.__texturePage.height;
                d = this.singleWidth;
                e = this.singleHeight;
                var f = this.columns;
                if (a.inverted) a = d, d = e, e = a, f = this.rows;
                for (var g = this.image.__tx, h = this.image.__ty, j = this.image.__texturePage, a = 0; a < b * c; a++) {
                    var k = g + (a % f >> 0) * d,
                        l = h + (a / f >> 0) * e,
                        m = k + d,
                        o = l + e;
                    this.xyCache.push([k / j.width, l / j.height, m / j.width, o / j.height, k, l, m, o])
                }
            } else
                for (a = 0; a < b * c; a++) d = (a % this.columns | 0) * this.singleWidth, e = (a / this.columns | 0) * this.singleHeight, this.xyCache.push([d, e]);
            return this
        },
        paintInvertedH: function (a, b, c, d) {
            this.setSpriteIndexAtTime(b);
            a = a.ctx;
            a.save();
            a.translate((0.5 + c | 0) + this.singleWidth, 0.5 + d | 0);
            a.scale(-1, 1);
            a.drawImage(this.image,
                this.xyCache[this.spriteIndex][0], this.xyCache[this.spriteIndex][1], this.singleWidth, this.singleHeight, this.offsetX >> 0, this.offsetY >> 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },
        paintInvertedV: function (a, b, c, d) {
            this.setSpriteIndexAtTime(b);
            a = a.ctx;
            a.save();
            a.translate(c + 0.5 | 0, 0.5 + d + this.singleHeight | 0);
            a.scale(1, -1);
            a.drawImage(this.image, this.xyCache[this.spriteIndex][0], this.xyCache[this.spriteIndex][1], this.singleWidth, this.singleHeight, this.offsetX >> 0, this.offsetY >> 0, this.singleWidth,
                this.singleHeight);
            a.restore();
            return this
        },
        paintInvertedHV: function (a, b, c, d) {
            this.setSpriteIndexAtTime(b);
            a = a.ctx;
            a.save();
            a.translate(c + 0.5 | 0, 0.5 + d + this.singleHeight | 0);
            a.scale(1, -1);
            a.translate(this.singleWidth, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.xyCache[this.spriteIndex][0], this.xyCache[this.spriteIndex][1], this.singleWidth, this.singleHeight, this.offsetX >> 0, this.offsetY >> 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },
        paintN: function (a, b, c, d) {
            this.setSpriteIndexAtTime(b);
            a.ctx.drawImage(this.image, this.xyCache[this.spriteIndex][0] >> 0, this.xyCache[this.spriteIndex][1] >> 0, this.singleWidth, this.singleHeight, this.offsetX + c >> 0, this.offsetY + d >> 0, this.singleWidth, this.singleHeight);
            return this
        },
        paintScaled: function (a, b, c, d) {
            this.setSpriteIndexAtTime(b);
            a.ctx.drawImage(this.image, this.xyCache[this.spriteIndex][0], this.xyCache[this.spriteIndex][1], this.singleWidth, this.singleHeight, c >> 0, d >> 0, this.ownerActor.width, this.ownerActor.height);
            return this
        },
        getCurrentSpriteImageCSSPosition: function () {
            return "-" +
                (this.xyCache[this.spriteIndex][0] - this.offsetX) + "px -" + (this.xyCache[this.spriteIndex][1] - this.offsetY) + "px"
        },
        getNumImages: function () {
            return this.rows * this.columns
        },
        setUV: function (a, b) {
            var c = this.image;
            if (c.__texturePage) {
                var d = b,
                    e = this.spriteIndex,
                    f = this.xyCache[e][0],
                    g = this.xyCache[e][1],
                    h = this.xyCache[e][2],
                    e = this.xyCache[e][3];
                if (this.offsetX || this.offsetY) f = c.__texturePage, g = -this.offsetY / f.height, h = (this.ownerActor.width - this.offsetX) / f.width, e = (this.ownerActor.height - this.offsetY) / f.height,
                f = -this.offsetX / f.width + c.__u, g += c.__v, h += c.__u, e += c.__v;
                c.inverted ? (a[d++] = h, a[d++] = g, a[d++] = h, a[d++] = e, a[d++] = f, a[d++] = e, a[d++] = f, a[d++] = g) : (a[d++] = f, a[d++] = g, a[d++] = h, a[d++] = g, a[d++] = h, a[d++] = e, a[d++] = f, a[d++] = e)
            }
        },
        setChangeFPS: function (a) {
            this.changeFPS = a;
            return this
        },
        setSpriteTransformation: function (a) {
            this.transformation = a;
            switch (a) {
            case this.TR_FLIP_HORIZONTAL:
                this.paint = this.paintInvertedH;
                break;
            case this.TR_FLIP_VERTICAL:
                this.paint = this.paintInvertedV;
                break;
            case this.TR_FLIP_ALL:
                this.paint =
                    this.paintInvertedHV;
                break;
            case this.TR_FIXED_TO_SIZE:
                this.paint = this.paintScaled;
                break;
            default:
                this.paint = this.paintN
            }
            return this
        },
        setAnimationImageIndex: function (a) {
            this.animationImageIndex = a;
            this.spriteIndex = a[0];
            return this
        },
        setSpriteIndex: function (a) {
            this.spriteIndex = a;
            return this
        },
        setSpriteIndexAtTime: function (a) {
            if (this.animationImageIndex.length > 1) this.prevAnimationTime === -1 ? (this.prevAnimationTime = a, this.spriteIndex = 0) : (a -= this.prevAnimationTime, a /= this.changeFPS, a %= this.animationImageIndex.length,
                this.spriteIndex = this.animationImageIndex[Math.floor(a)])
        }
    }
})();
(function () {
    CAAT.ImagePreloader = function () {
        this.images = [];
        return this
    };
    CAAT.ImagePreloader.prototype = {
        images: null,
        notificationCallback: null,
        imageCounter: 0,
        loadImages: function (a, b) {
            a || b && b(0, []);
            var c = this,
                d;
            this.notificationCallback = b;
            this.images = [];
            for (d = 0; d < a.length; d++) this.images.push({
                id: a[d].id,
                image: new Image
            });
            for (d = 0; d < a.length; d++) this.images[d].image.onload = function () {
                c.imageCounter++;
                c.notificationCallback(c.imageCounter, c.images)
            }, this.images[d].image.src = a[d].url;
            a.length === 0 && b(0, [])
        }
    }
})();
(function () {
    CAAT.TimerTask = function () {
        return this
    };
    CAAT.TimerTask.prototype = {
        startTime: 0,
        duration: 0,
        callback_timeout: null,
        callback_tick: null,
        callback_cancel: null,
        scene: null,
        taskId: 0,
        remove: false,
        create: function (a, b, c, d, e) {
            this.startTime = a;
            this.duration = b;
            this.callback_timeout = c;
            this.callback_tick = d;
            this.callback_cancel = e;
            return this
        },
        checkTask: function (a) {
            var b = a;
            b -= this.startTime;
            b >= this.duration ? (this.remove = true, this.callback_timeout && this.callback_timeout(a, b, this)) : this.callback_tick && this.callback_tick(a,
                b, this);
            return this
        },
        reset: function (a) {
            this.remove = false;
            this.startTime = a;
            this.scene.ensureTimerTask(this);
            return this
        },
        cancel: function () {
            this.remove = true;
            null != this.callback_cancel && this.callback_cancel(this.scene.time, this.scene.time - this.startTime, this);
            return this
        }
    }
})();
(function () {
    CAAT.Scene = function () {
        CAAT.Scene.superclass.constructor.call(this);
        this.timerList = [];
        this.fillStyle = null;
        return this
    };
    CAAT.Scene.prototype = {
        easeContainerBehaviour: null,
        easeContainerBehaviourListener: null,
        easeIn: false,
        EASE_ROTATION: 1,
        EASE_SCALE: 2,
        EASE_TRANSLATE: 3,
        timerList: null,
        timerSequence: 0,
        paused: false,
        isPaused: function () {
            return this.paused
        },
        setPaused: function (a) {
            this.paused = a
        },
        checkTimers: function (a) {
            for (var b = this.timerList, c = b.length - 1; c >= 0;) b[c].remove || b[c].checkTask(a), c--
        },
        ensureTimerTask: function (a) {
            this.hasTimer(a) ||
                this.timerList.push(a);
            return this
        },
        hasTimer: function (a) {
            for (var b = this.timerList, c = b.length - 1; c >= 0;) {
                if (b[c] === a) return true;
                c--
            }
            return false
        },
        createTimer: function (a, b, c, d, e) {
            a = (new CAAT.TimerTask).create(a, b, c, d, e);
            a.taskId = this.timerSequence++;
            a.sceneTime = this.time;
            a.scene = this;
            this.timerList.push(a);
            return a
        },
        removeExpiredTimers: function () {
            var a, b = this.timerList;
            for (a = 0; a < b.length; a++) b[a].remove && b.splice(a, 1)
        },
        animate: function (a, b) {
            this.checkTimers(b);
            CAAT.Scene.superclass.animate.call(this,
                a, b);
            this.removeExpiredTimers()
        },
        createAlphaBehaviour: function (a, b) {
            var c = new CAAT.AlphaBehavior;
            c.setFrameTime(0, a);
            c.startAlpha = b ? 0 : 1;
            c.endAlpha = b ? 1 : 0;
            this.easeContainerBehaviour.addBehavior(c)
        },
        easeTranslationIn: function (a, b, c, d) {
            this.easeTranslation(a, b, c, true, d)
        },
        easeTranslationOut: function (a, b, c, d) {
            this.easeTranslation(a, b, c, false, d)
        },
        easeTranslation: function (a, b, c, d, e) {
            this.easeContainerBehaviour = new CAAT.ContainerBehavior;
            this.easeIn = d;
            var f = new CAAT.PathBehavior;
            e && f.setInterpolator(e);
            f.setFrameTime(0,
                a);
            c < 1 ? c = 1 : c > 4 && (c = 4);
            switch (c) {
            case CAAT.Actor.prototype.ANCHOR_TOP:
                d ? f.setPath((new CAAT.Path).setLinear(0, -this.height, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, 0, -this.height));
                break;
            case CAAT.Actor.prototype.ANCHOR_BOTTOM:
                d ? f.setPath((new CAAT.Path).setLinear(0, this.height, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, 0, this.height));
                break;
            case CAAT.Actor.prototype.ANCHOR_LEFT:
                d ? f.setPath((new CAAT.Path).setLinear(-this.width, 0, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, -this.width, 0));
                break;
            case CAAT.Actor.prototype.ANCHOR_RIGHT:
                d ? f.setPath((new CAAT.Path).setLinear(this.width, 0, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, this.width, 0))
            }
            b && this.createAlphaBehaviour(a, d);
            this.easeContainerBehaviour.addBehavior(f);
            this.easeContainerBehaviour.setFrameTime(this.time, a);
            this.easeContainerBehaviour.addListener(this);
            this.emptyBehaviorList();
            CAAT.Scene.superclass.addBehavior.call(this, this.easeContainerBehaviour)
        },
        easeScaleIn: function (a, b, c, d, e) {
            this.easeScale(a, b, c, d, true, e);
            this.easeIn =
                true
        },
        easeScaleOut: function (a, b, c, d, e) {
            this.easeScale(a, b, c, d, false, e);
            this.easeIn = false
        },
        easeScale: function (a, b, c, d, e, f) {
            this.easeContainerBehaviour = new CAAT.ContainerBehavior;
            var g = 0,
                h = 0,
                j = 0,
                k = 0;
            switch (d) {
            case CAAT.Actor.prototype.ANCHOR_TOP_LEFT:
            case CAAT.Actor.prototype.ANCHOR_TOP_RIGHT:
            case CAAT.Actor.prototype.ANCHOR_BOTTOM_LEFT:
            case CAAT.Actor.prototype.ANCHOR_BOTTOM_RIGHT:
            case CAAT.Actor.prototype.ANCHOR_CENTER:
                k = j = 1;
                break;
            case CAAT.Actor.prototype.ANCHOR_TOP:
            case CAAT.Actor.prototype.ANCHOR_BOTTOM:
                j =
                    g = 1;
                h = 0;
                k = 1;
                break;
            case CAAT.Actor.prototype.ANCHOR_LEFT:
            case CAAT.Actor.prototype.ANCHOR_RIGHT:
                k = h = 1;
                g = 0;
                j = 1;
                break;
            default:
                alert("scale anchor ?? " + d)
            }
            if (!e) {
                var l;
                l = g;
                g = j;
                j = l;
                l = h;
                h = k;
                k = l
            }
            c && this.createAlphaBehaviour(b, e);
            c = this.getAnchorPercent(d);
            a = (new CAAT.ScaleBehavior).setFrameTime(a, b).setValues(g, j, h, k, c.x, c.y);
            f && a.setInterpolator(f);
            this.easeContainerBehaviour.addBehavior(a);
            this.easeContainerBehaviour.setFrameTime(this.time, b);
            this.easeContainerBehaviour.addListener(this);
            this.emptyBehaviorList();
            CAAT.Scene.superclass.addBehavior.call(this, this.easeContainerBehaviour)
        },
        addBehavior: function () {
            return this
        },
        easeRotationIn: function (a, b, c, d) {
            this.easeRotation(a, b, c, true, d);
            this.easeIn = true
        },
        easeRotationOut: function (a, b, c, d) {
            this.easeRotation(a, b, c, false, d);
            this.easeIn = false
        },
        easeRotation: function (a, b, c, d, e) {
            this.easeContainerBehaviour = new CAAT.ContainerBehavior;
            var f = 0,
                g = 0;
            if (c == CAAT.Actor.prototype.ANCHOR_CENTER) c = CAAT.Actor.prototype.ANCHOR_TOP;
            switch (c) {
            case CAAT.Actor.prototype.ANCHOR_TOP:
            case CAAT.Actor.prototype.ANCHOR_BOTTOM:
            case CAAT.Actor.prototype.ANCHOR_LEFT:
            case CAAT.Actor.prototype.ANCHOR_RIGHT:
                f =
                    Math.PI * (Math.random() < 0.5 ? 1 : -1);
                break;
            case CAAT.Actor.prototype.ANCHOR_TOP_LEFT:
            case CAAT.Actor.prototype.ANCHOR_TOP_RIGHT:
            case CAAT.Actor.prototype.ANCHOR_BOTTOM_LEFT:
            case CAAT.Actor.prototype.ANCHOR_BOTTOM_RIGHT:
                f = Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
                break;
            default:
                alert("rot anchor ?? " + c)
            }
            if (false === d) var h = f,
            f = g, g = h;
            b && this.createAlphaBehaviour(a, d);
            b = this.getAnchorPercent(c);
            f = (new CAAT.RotateBehavior).setFrameTime(0, a).setValues(f, g, b.x, b.y);
            e && f.setInterpolator(e);
            this.easeContainerBehaviour.addBehavior(f);
            this.easeContainerBehaviour.setFrameTime(this.time, a);
            this.easeContainerBehaviour.addListener(this);
            this.emptyBehaviorList();
            CAAT.Scene.superclass.addBehavior.call(this, this.easeContainerBehaviour)
        },
        setEaseListener: function (a) {
            this.easeContainerBehaviourListener = a
        },
        behaviorExpired: function () {
            this.easeContainerBehaviourListener.easeEnd(this, this.easeIn)
        },
        activated: function () {},
        setExpired: function (a) {
            this.expired = a
        },
        paint: function (a) {
            if (this.fillStyle) a = a.crc, a.fillStyle = this.fillStyle, a.fillRect(0,
                0, this.width, this.height)
        }
    };
    extend(CAAT.Scene, CAAT.ActorContainer, null)
})();
CAAT.modules = CAAT.modules || {};
CAAT.modules.CircleManager = CAAT.modules.CircleManager || {};
(function () {
    CAAT.modules.CircleManager.PackedCircle = function () {
        this.boundsRule = CAAT.modules.CircleManager.PackedCircle.BOUNDS_RULE_IGNORE;
        this.position = new CAAT.Point(0, 0, 0);
        this.offset = new CAAT.Point(0, 0, 0);
        this.targetPosition = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.modules.CircleManager.PackedCircle.prototype = {
        id: 0,
        delegate: null,
        position: new CAAT.Point(0, 0, 0),
        offset: new CAAT.Point(0, 0, 0),
        targetPosition: null,
        targetChaseSpeed: 0.02,
        isFixed: false,
        boundsRule: 0,
        collisionMask: 0,
        collisionGroup: 0,
        BOUNDS_RULE_WRAP: 1,
        BOUNDS_RULE_CONSTRAINT: 2,
        BOUNDS_RULE_DESTROY: 4,
        BOUNDS_RULE_IGNORE: 8,
        containsPoint: function (a) {
            return this.position.getDistanceSquared(a) < this.radiusSquared
        },
        getDistanceSquaredFromPosition: function (a) {
            return this.position.getDistanceSquared(a) < this.radiusSquared
        },
        intersects: function (a) {
            var b = this.position.getDistanceSquared(a.position);
            return b < this.radiusSquared || b < a.radiusSquared
        },
        setPosition: function (a) {
            this.position = a;
            return this
        },
        setDelegate: function (a) {
            this.delegate = a;
            return this
        },
        setOffset: function (a) {
            this.offset =
                a;
            return this
        },
        setTargetPosition: function (a) {
            this.targetPosition = a;
            return this
        },
        setTargetChaseSpeed: function (a) {
            this.targetChaseSpeed = a;
            return this
        },
        setIsFixed: function (a) {
            this.isFixed = a;
            return this
        },
        setCollisionMask: function (a) {
            this.collisionMask = a;
            return this
        },
        setCollisionGroup: function (a) {
            this.collisionGroup = a;
            return this
        },
        setRadius: function (a) {
            this.radius = a;
            this.radiusSquared = this.radius * this.radius;
            return this
        },
        initialize: function (a) {
            if (a)
                for (var b in a) this[b] = a[b];
            return this
        },
        dealloc: function () {
            this.targetPosition =
                this.delegate = this.offset = this.position = null
        }
    }
})();
(function () {
    CAAT.modules.CircleManager.PackedCircleManager = function () {
        return this
    };
    CAAT.modules.CircleManager.PackedCircleManager.prototype = {
        allCircles: [],
        numberOfCollisionPasses: 1,
        numberOfTargetingPasses: 0,
        bounds: new CAAT.Rectangle,
        addCircle: function (a) {
            a.id = this.allCircles.length;
            this.allCircles.push(a);
            return this
        },
        removeCircle: function (a) {
            var b = 0,
                c = false,
                d = this.allCircles.length;
            if (d === 0) throw "Error: (PackedCircleManager) attempting to remove circle, and allCircles.length === 0!!";
            for (; d--;)
                if (this.allCircles[d] ===
                    a) {
                    c = true;
                    b = d;
                    break
                }
            if (!c) throw "Could not locate circle in allCircles array!";
            this.allCircles[b].dealloc();
            this.allCircles[b] = null;
            return this
        },
        forceCirclesToMatchDelegatePositions: function () {
            for (var a = this.allCircles.length, b = 0; b < a; b++) {
                var c = this.allCircles[b];
                c && c.delegate && c.position.set(c.delegate.x + c.offset.x, c.delegate.y + c.offset.y)
            }
        },
        pushAllCirclesTowardTarget: function () {
            for (var a = new CAAT.Point(0, 0, 0), b = this.allCircles, c = b.length, d = 0; d < this.numberOfTargetingPasses; d++)
                for (var e = 0; e < c; e++) {
                    var f =
                        b[e];
                    if (!f.isFixed) a.x = f.position.x - (f.targetPosition.x + f.offset.x), a.y = f.position.y - (f.targetPosition.y + f.offset.y), a.multiply(f.targetChaseSpeed), f.position.x -= a.x, f.position.y -= a.y
                }
        },
        handleCollisions: function () {
            this.removeExpiredElements();
            for (var a = new CAAT.Point(0, 0, 0), b = this.allCircles, c = b.length, d = 0; d < this.numberOfCollisionPasses; d++)
                for (var e = 0; e < c; e++)
                    for (var f = b[e], g = e + 1; g < c; g++) {
                        var h = b[g];
                        if (this.circlesCanCollide(f, h)) {
                            var j = h.position.x - f.position.x,
                                k = h.position.y - f.position.y,
                                l = (f.radius +
                                    h.radius) * 1.08,
                                m = f.position.getDistanceSquared(h.position);
                            if (m < l * l - 0.02) a.x = j, a.y = k, a.normalize(), j = (l - Math.sqrt(m)) * 0.5, a.multiply(j), h.isFixed || (f.isFixed && a.multiply(2.2), h.position.translatePoint(a)), f.isFixed || (h.isFixed && a.multiply(2.2), f.position.subtract(a))
                        }
                    }
        },
        handleBoundaryForCircle: function (a, b) {
            var c = a.position.x,
                d = a.position.y,
                e = a.radius,
                f = e * 2,
                b = 12;
            if (b & 1 && c - f > this.bounds.right) a.position.x = this.bounds.left + e;
            else if (b & 1 && c + f < this.bounds.left) a.position.x = this.bounds.right - e;
            if (b & 4 &&
                d - f > this.bounds.bottom) a.position.y = this.bounds.top - e;
            else if (b & 4 && d + f < this.bounds.top) a.position.y = this.bounds.bottom + e;
            if (b & 8 && c + e >= this.bounds.right) a.position.x = a.position.x = this.bounds.right - e;
            else if (b & 8 && c - e < this.bounds.left) a.position.x = this.bounds.left + e;
            if (b & 16 && d + e > this.bounds.bottom) a.position.y = this.bounds.bottom - e;
            else if (b & 16 && d - e < this.bounds.top) a.position.y = this.bounds.top + e
        },
        getCircleAt: function (a, b, c) {
            for (var d = this.allCircles, e = d.length, a = new CAAT.Point(a, b, 0), b = null, f = Number.MAX_VALUE,
                    g = 0; g < e; g++) {
                var h = d[g];
                if (h) {
                    var j = h.position.getDistanceSquared(a);
                    j < f && j < h.radiusSquared + c && (f = j, b = h)
                }
            }
            return b
        },
        circlesCanCollide: function (a, b) {
            return !a || !b || a === b ? false : true
        },
        setBounds: function (a, b, c, d) {
            this.bounds.x = a;
            this.bounds.y = b;
            this.bounds.width = c;
            this.bounds.height = d
        },
        setNumberOfCollisionPasses: function (a) {
            this.numberOfCollisionPasses = a;
            return this
        },
        setNumberOfTargetingPasses: function (a) {
            this.numberOfTargetingPasses = a;
            return this
        },
        sortOnDistanceToTarget: function (a, b) {
            var c = a.getDistanceSquaredFromPosition(a.targetPosition),
                d = b.getDistanceSquaredFromPosition(a.targetPosition),
                e = 0;
            c > d ? e = -1 : c < d && (e = 1);
            return e
        },
        removeExpiredElements: function () {
            for (var a = this.allCircles.length; a >= 0; a--) this.allCircles[a] === null && this.allCircles.splice(a, 1)
        },
        initialize: function (a) {
            if (a)
                for (var b in a) this[b] = a[b];
            return this
        }
    }
})();
(function () {
    CAAT.modules.LocalStorage = function () {
        return this
    };
    CAAT.modules.LocalStorage.prototype = {
        save: function (a, b) {
            try {
                localStorage.setItem(a, JSON.stringify(b))
            } catch (c) {}
            return this
        },
        load: function (a) {
            try {
                return JSON.parse(localStorage.getItem(a))
            } catch (b) {
                return null
            }
        },
        remove: function (a) {
            try {
                localStorage.removeItem(a)
            } catch (b) {}
            return this
        }
    }
})();
(function () {
    CAAT.modules.ImageUtil = function () {
        return this
    };
    CAAT.modules.ImageUtil.prototype = {
        createAlphaSpriteSheet: function (a, b, c, d, e) {
            if (a < b) var f = a,
            a = b, b = f;
            f = document.createElement("canvas");
            f.width = d.width;
            f.height = d.height * c;
            var g = f.getContext("2d");
            g.fillStyle = e ? e : "rgba(255,255,255,0)";
            g.fillRect(0, 0, d.width, d.height * c);
            for (e = 0; e < c; e++) g.globalAlpha = 1 - (a - b) / c * (e + 1), g.drawImage(d, 0, e * d.height);
            return f
        },
        rotate: function (a, b) {
            b = b || 0;
            if (!b) return a;
            var c = document.createElement("canvas");
            c.width =
                a.height;
            c.height = a.width;
            var d = c.getContext("2d");
            d.globalAlpha = 1;
            d.fillStyle = "rgba(0,0,0,0)";
            d.clearRect(0, 0, c.width, c.height);
            var e = new CAAT.Matrix;
            e.multiply((new CAAT.Matrix).setTranslate(c.width / 2, c.width / 2));
            e.multiply((new CAAT.Matrix).setRotation(b * Math.PI / 180));
            e.multiply((new CAAT.Matrix).setTranslate(-c.width / 2, -c.width / 2));
            e.transformRenderingContext(d);
            d.drawImage(a, 0, 0);
            return c
        },
        optimize: function (a, b) {
            b >>= 0;
            var c = document.createElement("canvas");
            c.width = a.width;
            c.height = a.height;
            var d =
                c.getContext("2d");
            d.fillStyle = "rgba(0,0,0,0)";
            d.fillRect(0, 0, a.width, a.height);
            d.drawImage(a, 0, 0);
            var e = d.getImageData(0, 0, a.width, a.height).data,
                f, g, h = c.height,
                j = 0,
                k = c.width;
            f = 0;
            var l = false;
            for (f = 0; f < c.height; f++) {
                for (g = 0; g < c.width; g++)
                    if (e[f * c.width * 4 + 3 + g * 4] > b) {
                        l = true;
                        break
                    }
                if (l) break
            }
            h = f;
            l = false;
            for (f = c.height - 1; f >= h; f--) {
                for (g = 3; g < c.width * 4; g += 4)
                    if (e[f * c.width * 4 + 3 + g * 4] > b) {
                        l = true;
                        break
                    }
                if (l) break
            }
            j = f;
            l = false;
            for (g = 0; g < c.width; g++) {
                for (f = 0; f < c.height; f++)
                    if (e[f * c.width * 4 + 3 + g * 4] > b) {
                        l = true;
                        break
                    }
                if (l) break
            }
            k =
                g;
            l = false;
            for (g = c.width - 1; g >= k; g--) {
                for (f = 0; f < c.height; f++)
                    if (e[f * c.width * 4 + 3 + g * 4] > b) {
                        l = true;
                        break
                    }
                if (l) break
            }
            f = g;
            if (0 === k && 0 === h && c.width - 1 === f && c.height - 1 === j) return c;
            e = f - k + 1;
            j = j - h + 1;
            h = d.getImageData(k, h, e, j);
            c.width = e;
            c.height = j;
            d = c.getContext("2d");
            d.putImageData(h, 0, 0);
            return c
        },
        createThumb: function (a, b, c, d) {
            var b = b || 24,
                c = c || 24,
                e = document.createElement("canvas");
            e.width = b;
            e.height = c;
            var f = e.getContext("2d");
            if (d) {
                var g = Math.max(a.width, a.height),
                    d = a.width / g * b,
                    g = a.height / g * c;
                f.drawImage(a, (b -
                    d) / 2, (c - g) / 2, d, g)
            } else f.drawImage(a, 0, 0, b, c);
            return e
        }
    }
})();
(function () {
    CAAT.modules.LayoutUtils = {};
    CAAT.modules.LayoutUtils.row = function (a, b, c) {
        for (var d = a.width, e = 0, f = 0, g = 0, h = 0, h = Number.MIN_VALUE, j = Number.MAX_VALUE, g = b.length - 1; g; g -= 1) {
            if (j < b[g].width) j = b[g].width;
            if (h < b[g].height) h = b[g].height
        }
        if (c.padding_left) e = c.padding_left, d -= e;
        c.padding_right && (d -= c.padding_right);
        if (c.top && (f = parseInt(c.top, 10), isNaN(f))) switch (c.top) {
        case "center":
            f = (a.height - h) / 2;
            break;
        case "top":
            f = 0;
            break;
        case "bottom":
            f = a.height - h;
            break;
        default:
            f = 0
        }
        a = d / b.length;
        for (g = 0, h = b.length; g <
            h; g++) b[g].setLocation(e + g * a + (a - b[g].width) / 2, f)
    }
})();
(function () {
    CAAT.Interpolator = function () {
        this.interpolated = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.Interpolator.prototype = {
        interpolated: null,
        paintScale: 90,
        createLinearInterpolator: function (a, b) {
            this.getPosition = function (c) {
                var d = c;
                a && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                b !== null && b && (c = 1 - c);
                return this.interpolated.set(d, c)
            };
            return this
        },
        createBackOutInterpolator: function (a) {
            this.getPosition = function (b) {
                var c = b;
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                b -= 1;
                return this.interpolated.set(c, b * b * (2.70158 * b + 1.70158) + 1)
            };
            return this
        },
        createExponentialInInterpolator: function (a, b) {
            this.getPosition = function (c) {
                var d = c;
                b && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                return this.interpolated.set(d, Math.pow(c, a))
            };
            return this
        },
        createExponentialOutInterpolator: function (a, b) {
            this.getPosition = function (c) {
                var d = c;
                b && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                return this.interpolated.set(d, 1 - Math.pow(1 - c, a))
            };
            return this
        },
        createExponentialInOutInterpolator: function (a, b) {
            this.getPosition = function (c) {
                var d = c;
                b && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                return c * 2 < 1 ? this.interpolated.set(d,
                    Math.pow(c * 2, a) / 2) : this.interpolated.set(d, 1 - Math.abs(Math.pow(c * 2 - 2, a)) / 2)
            };
            return this
        },
        createQuadricBezierInterpolator: function (a, b, c, d) {
            this.getPosition = function (e) {
                var f = e;
                d && (e < 0.5 ? e *= 2 : e = 1 - (e - 0.5) * 2);
                e = (1 - e) * (1 - e) * a.y + 2 * (1 - e) * e * b.y + e * e * c.y;
                return this.interpolated.set(f, e)
            };
            return this
        },
        createCubicBezierInterpolator: function (a, b, c, d, e) {
            this.getPosition = function (f) {
                var g = f;
                e && (f < 0.5 ? f *= 2 : f = 1 - (f - 0.5) * 2);
                var h = f * f,
                    f = a.y + f * (-a.y * 3 + f * (3 * a.y - a.y * f)) + f * (3 * b.y + f * (-6 * b.y + b.y * 3 * f)) + h * (c.y * 3 - c.y * 3 * f) +
                        d.y * f * h;
                return this.interpolated.set(g, f)
            };
            return this
        },
        createElasticOutInterpolator: function (a, b, c) {
            this.getPosition = function (d) {
                c && (d < 0.5 ? d *= 2 : d = 1 - (d - 0.5) * 2);
                if (d === 0) return {
                    x: 0,
                    y: 0
                };
                if (d === 1) return {
                    x: 1,
                    y: 1
                };
                var e = b / (2 * Math.PI) * Math.asin(1 / a);
                return this.interpolated.set(d, a * Math.pow(2, -10 * d) * Math.sin((d - e) * 2 * Math.PI / b) + 1)
            };
            return this
        },
        createElasticInInterpolator: function (a, b, c) {
            this.getPosition = function (d) {
                c && (d < 0.5 ? d *= 2 : d = 1 - (d - 0.5) * 2);
                if (d === 0) return {
                    x: 0,
                    y: 0
                };
                if (d === 1) return {
                    x: 1,
                    y: 1
                };
                var e = b /
                    (2 * Math.PI) * Math.asin(1 / a);
                return this.interpolated.set(d, -(a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * 2 * Math.PI / b)))
            };
            return this
        },
        createElasticInOutInterpolator: function (a, b, c) {
            this.getPosition = function (d) {
                c && (d < 0.5 ? d *= 2 : d = 1 - (d - 0.5) * 2);
                var e = b / (2 * Math.PI) * Math.asin(1 / a);
                d *= 2;
                return d <= 1 ? this.interpolated.set(d, -0.5 * a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * 2 * Math.PI / b)) : this.interpolated.set(d, 1 + 0.5 * a * Math.pow(2, -10 * (d -= 1)) * Math.sin((d - e) * 2 * Math.PI / b))
            };
            return this
        },
        bounce: function (a) {
            return (a /= 1) < 1 / 2.75 ? {
                x: a,
                y: 7.5625 * a * a
            } : a < 2 / 2.75 ? {
                x: a,
                y: 7.5625 * (a -= 1.5 / 2.75) * a + 0.75
            } : a < 2.5 / 2.75 ? {
                x: a,
                y: 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375
            } : {
                x: a,
                y: 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
            }
        },
        createBounceOutInterpolator: function (a) {
            this.getPosition = function (b) {
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                return this.bounce(b)
            };
            return this
        },
        createBounceInInterpolator: function (a) {
            this.getPosition = function (b) {
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                b = this.bounce(1 - b);
                b.y = 1 - b.y;
                return b
            };
            return this
        },
        createBounceInOutInterpolator: function (a) {
            this.getPosition =
                function (b) {
                    a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                    if (b < 0.5) return b = this.bounce(1 - b * 2), b.y = (1 - b.y) * 0.5, b;
                    b = this.bounce(b * 2 - 1, a);
                    b.y = b.y * 0.5 + 0.5;
                    return b
            };
            return this
        },
        paint: function (a) {
            a = a.crc;
            a.save();
            a.beginPath();
            a.moveTo(0, this.getPosition(0).y * this.paintScale);
            for (var b = 0; b <= this.paintScale; b++) a.lineTo(b, this.getPosition(b / this.paintScale).y * this.paintScale);
            a.strokeStyle = "black";
            a.stroke();
            a.restore()
        },
        getContour: function (a) {
            for (var b = [], c = 0; c <= a; c++) b.push({
                x: c / a,
                y: this.getPosition(c / a).y
            });
            return b
        },
        enumerateInterpolators: function () {
            return [(new CAAT.Interpolator).createLinearInterpolator(false, false), "Linear pingpong=false, inverse=false", (new CAAT.Interpolator).createLinearInterpolator(true, false), "Linear pingpong=true, inverse=false", (new CAAT.Interpolator).createLinearInterpolator(false, true), "Linear pingpong=false, inverse=true", (new CAAT.Interpolator).createLinearInterpolator(true, true), "Linear pingpong=true, inverse=true", (new CAAT.Interpolator).createExponentialInInterpolator(2, false),
                "ExponentialIn pingpong=false, exponent=2", (new CAAT.Interpolator).createExponentialOutInterpolator(2, false), "ExponentialOut pingpong=false, exponent=2", (new CAAT.Interpolator).createExponentialInOutInterpolator(2, false), "ExponentialInOut pingpong=false, exponent=2", (new CAAT.Interpolator).createExponentialInInterpolator(2, true), "ExponentialIn pingpong=true, exponent=2", (new CAAT.Interpolator).createExponentialOutInterpolator(2, true), "ExponentialOut pingpong=true, exponent=2", (new CAAT.Interpolator).createExponentialInOutInterpolator(2,
                    true), "ExponentialInOut pingpong=true, exponent=2", (new CAAT.Interpolator).createExponentialInInterpolator(4, false), "ExponentialIn pingpong=false, exponent=4", (new CAAT.Interpolator).createExponentialOutInterpolator(4, false), "ExponentialOut pingpong=false, exponent=4", (new CAAT.Interpolator).createExponentialInOutInterpolator(4, false), "ExponentialInOut pingpong=false, exponent=4", (new CAAT.Interpolator).createExponentialInInterpolator(4, true), "ExponentialIn pingpong=true, exponent=4", (new CAAT.Interpolator).createExponentialOutInterpolator(4,
                    true), "ExponentialOut pingpong=true, exponent=4", (new CAAT.Interpolator).createExponentialInOutInterpolator(4, true), "ExponentialInOut pingpong=true, exponent=4", (new CAAT.Interpolator).createExponentialInInterpolator(6, false), "ExponentialIn pingpong=false, exponent=6", (new CAAT.Interpolator).createExponentialOutInterpolator(6, false), "ExponentialOut pingpong=false, exponent=6", (new CAAT.Interpolator).createExponentialInOutInterpolator(6, false), "ExponentialInOut pingpong=false, exponent=6", (new CAAT.Interpolator).createExponentialInInterpolator(6,
                    true), "ExponentialIn pingpong=true, exponent=6", (new CAAT.Interpolator).createExponentialOutInterpolator(6, true), "ExponentialOut pingpong=true, exponent=6", (new CAAT.Interpolator).createExponentialInOutInterpolator(6, true), "ExponentialInOut pingpong=true, exponent=6", (new CAAT.Interpolator).createBounceInInterpolator(false), "BounceIn pingpong=false", (new CAAT.Interpolator).createBounceOutInterpolator(false), "BounceOut pingpong=false", (new CAAT.Interpolator).createBounceInOutInterpolator(false), "BounceInOut pingpong=false", (new CAAT.Interpolator).createBounceInInterpolator(true), "BounceIn pingpong=true", (new CAAT.Interpolator).createBounceOutInterpolator(true), "BounceOut pingpong=true", (new CAAT.Interpolator).createBounceInOutInterpolator(true), "BounceInOut pingpong=true", (new CAAT.Interpolator).createElasticInInterpolator(1.1, 0.4, false), "ElasticIn pingpong=false, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticOutInterpolator(1.1, 0.4, false), "ElasticOut pingpong=false, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInOutInterpolator(1.1,
                    0.4, false), "ElasticInOut pingpong=false, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInInterpolator(1.1, 0.4, true), "ElasticIn pingpong=true, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticOutInterpolator(1.1, 0.4, true), "ElasticOut pingpong=true, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInOutInterpolator(1.1, 0.4, true), "ElasticInOut pingpong=true, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInInterpolator(1, 0.2, false), "ElasticIn pingpong=false, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticOutInterpolator(1,
                    0.2, false), "ElasticOut pingpong=false, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticInOutInterpolator(1, 0.2, false), "ElasticInOut pingpong=false, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticInInterpolator(1, 0.2, true), "ElasticIn pingpong=true, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticOutInterpolator(1, 0.2, true), "ElasticOut pingpong=true, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticInOutInterpolator(1, 0.2, true), "ElasticInOut pingpong=true, amp=1.0, d=.2"]
        }
    }
})();
(function () {
    CAAT.InterpolatorActor = function () {
        CAAT.InterpolatorActor.superclass.constructor.call(this);
        return this
    };
    CAAT.InterpolatorActor.prototype = {
        interpolator: null,
        contour: null,
        S: 50,
        gap: 5,
        setGap: function (a) {
            this.gap = a;
            return this
        },
        setInterpolator: function (a, b) {
            this.interpolator = a;
            this.contour = a.getContour(b || this.S);
            return this
        },
        paint: function (a, b) {
            CAAT.InterpolatorActor.superclass.paint.call(this, a, b);
            if (this.backgroundImage) return this;
            if (this.interpolator) {
                var c = a.crc,
                    d = this.width - 2 * this.gap,
                    e = this.height - 2 * this.gap;
                c.beginPath();
                c.moveTo(this.gap + d * this.contour[0].x, -this.gap + this.height - e * this.contour[0].y);
                for (var f = 1; f < this.contour.length; f++) c.lineTo(this.gap + d * this.contour[f].x, -this.gap + this.height - e * this.contour[f].y);
                c.strokeStyle = this.strokeStyle;
                c.stroke()
            }
        },
        getInterpolator: function () {
            return this.interpolator
        }
    };
    extend(CAAT.InterpolatorActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.PathSegment = function () {
        this.bbox = new CAAT.Rectangle;
        return this
    };
    CAAT.PathSegment.prototype = {
        color: "black",
        length: 0,
        bbox: null,
        parent: null,
        setParent: function (a) {
            this.parent = a;
            return this
        },
        setColor: function (a) {
            if (a) this.color = a;
            return this
        },
        endCurvePosition: function () {},
        startCurvePosition: function () {},
        setPoints: function () {},
        setPoint: function () {},
        getPosition: function () {},
        getLength: function () {
            return this.length
        },
        getBoundingBox: function () {
            return this.bbox
        },
        numControlPoints: function () {},
        getControlPoint: function () {},
        endPath: function () {},
        getContour: function () {},
        updatePath: function () {},
        applyAsPath: function () {},
        transform: function () {}
    }
})();
(function () {
    CAAT.LinearPath = function () {
        CAAT.LinearPath.superclass.constructor.call(this);
        this.points = [];
        this.points.push(new CAAT.Point);
        this.points.push(new CAAT.Point);
        this.newPosition = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.LinearPath.prototype = {
        points: null,
        newPosition: null,
        applyAsPath: function (a) {
            a.lineTo(this.points[0].x, this.points[1].y)
        },
        setPoint: function (a, b) {
            b === 0 ? this.points[0] = a : b === 1 && (this.points[1] = a)
        },
        updatePath: function () {
            var a = this.points[1].x - this.points[0].x,
                b = this.points[1].y -
                    this.points[0].y;
            this.length = Math.sqrt(a * a + b * b);
            this.bbox.setEmpty();
            this.bbox.union(this.points[0].x, this.points[0].y);
            this.bbox.union(this.points[1].x, this.points[1].y);
            return this
        },
        setPoints: function (a) {
            this.points[0] = a[0];
            this.points[1] = a[1];
            this.updatePath();
            return this
        },
        setInitialPosition: function (a, b) {
            this.points[0].x = a;
            this.points[0].y = b;
            this.newPosition.set(a, b);
            return this
        },
        setFinalPosition: function (a, b) {
            this.points[1].x = a;
            this.points[1].y = b;
            return this
        },
        endCurvePosition: function () {
            return this.points[1]
        },
        startCurvePosition: function () {
            return this.points[0]
        },
        getPosition: function (a) {
            if (a > 1 || a < 0) a %= 1;
            a < 0 && (a = 1 + a);
            this.newPosition.set(this.points[0].x + (this.points[1].x - this.points[0].x) * a, this.points[0].y + (this.points[1].y - this.points[0].y) * a);
            return this.newPosition
        },
        initialPositionX: function () {
            return this.points[0].x
        },
        finalPositionX: function () {
            return this.points[1].x
        },
        paint: function (a, b) {
            var c = a.crc;
            c.save();
            c.strokeStyle = this.color;
            c.beginPath();
            c.moveTo(this.points[0].x, this.points[0].y);
            c.lineTo(this.points[1].x,
                this.points[1].y);
            c.stroke();
            if (b) c.globalAlpha = 0.5, c.fillStyle = "#7f7f00", c.beginPath(), c.arc(this.points[0].x, this.points[0].y, CAAT.Curve.prototype.HANDLE_SIZE / 2, 0, 2 * Math.PI, false), c.arc(this.points[1].x, this.points[1].y, CAAT.Curve.prototype.HANDLE_SIZE / 2, 0, 2 * Math.PI, false), c.fill();
            c.restore()
        },
        numControlPoints: function () {
            return 2
        },
        getControlPoint: function (a) {
            if (0 === a) return this.points[0];
            else if (1 === a) return this.points[1]
        },
        getContour: function () {
            var a = [];
            a.push(this.getPosition(0).clone());
            a.push(this.getPosition(1).clone());
            return a
        }
    };
    extend(CAAT.LinearPath, CAAT.PathSegment)
})();
(function () {
    CAAT.CurvePath = function () {
        CAAT.CurvePath.superclass.constructor.call(this);
        this.newPosition = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.CurvePath.prototype = {
        curve: null,
        newPosition: null,
        applyAsPath: function (a) {
            this.curve.applyAsPath(a);
            return this
        },
        setPoint: function (a, b) {
            this.curve && this.curve.setPoint(a, b)
        },
        setPoints: function (a) {
            var b = new CAAT.Bezier;
            b.setPoints(a);
            this.curve = b;
            return this
        },
        setQuadric: function (a, b, c, d, e, f) {
            var g = new CAAT.Bezier;
            g.setQuadric(a, b, c, d, e, f);
            this.curve = g;
            this.updatePath();
            return this
        },
        setCubic: function (a, b, c, d, e, f, g, h) {
            var j = new CAAT.Bezier;
            j.setCubic(a, b, c, d, e, f, g, h);
            this.curve = j;
            this.updatePath();
            return this
        },
        updatePath: function () {
            this.curve.update();
            this.length = this.curve.getLength();
            this.curve.getBoundingBox(this.bbox);
            return this
        },
        getPosition: function (a) {
            if (a > 1 || a < 0) a %= 1;
            a < 0 && (a = 1 + a);
            this.curve.solve(this.newPosition, a);
            return this.newPosition
        },
        getPositionFromLength: function (a) {
            this.curve.solve(this.newPosition, a / this.length);
            return this.newPosition
        },
        initialPositionX: function () {
            return this.curve.coordlist[0].x
        },
        finalPositionX: function () {
            return this.curve.coordlist[this.curve.coordlist.length - 1].x
        },
        paint: function (a, b) {
            this.curve.drawHandles = b;
            a.ctx.strokeStyle = this.color;
            this.curve.paint(a)
        },
        numControlPoints: function () {
            return this.curve.coordlist.length
        },
        getControlPoint: function (a) {
            return this.curve.coordlist[a]
        },
        endCurvePosition: function () {
            return this.curve.endCurvePosition()
        },
        startCurvePosition: function () {
            return this.curve.startCurvePosition()
        },
        getContour: function (a) {
            for (var b = [], c = 0; c <= a; c++) b.push({
                x: c / a,
                y: this.getPosition(c / a).y
            });
            return b
        }
    };
    extend(CAAT.CurvePath, CAAT.PathSegment, null)
})();
(function () {
    CAAT.ShapePath = function () {
        CAAT.ShapePath.superclass.constructor.call(this);
        this.points = [];
        this.points.push(new CAAT.Point);
        this.points.push(new CAAT.Point);
        this.points.push(new CAAT.Point);
        this.points.push(new CAAT.Point);
        this.points.push(new CAAT.Point);
        this.newPosition = new CAAT.Point;
        return this
    };
    CAAT.ShapePath.prototype = {
        points: null,
        length: -1,
        cw: true,
        bbox: null,
        newPosition: null,
        applyAsPath: function (a) {
            this.cw ? (a.lineTo(this.points[0].x, this.points[0].y), a.lineTo(this.points[1].x, this.points[1].y),
                a.lineTo(this.points[2].x, this.points[2].y), a.lineTo(this.points[3].x, this.points[3].y), a.lineTo(this.points[4].x, this.points[4].y)) : (a.lineTo(this.points[4].x, this.points[4].y), a.lineTo(this.points[3].x, this.points[3].y), a.lineTo(this.points[2].x, this.points[2].y), a.lineTo(this.points[1].x, this.points[1].y), a.lineTo(this.points[0].x, this.points[0].y));
            return this
        },
        setPoint: function (a, b) {
            b >= 0 && b < this.points.length && (this.points[b] = a)
        },
        setPoints: function (a) {
            this.points = [];
            this.points.push(a[0]);
            this.points.push((new CAAT.Point).set(a[1].x,
                a[0].y));
            this.points.push(a[1]);
            this.points.push((new CAAT.Point).set(a[0].x, a[1].y));
            this.points.push(a[0].clone());
            this.updatePath();
            return this
        },
        setClockWise: function (a) {
            this.cw = a !== void 0 ? a : true;
            return this
        },
        isClockWise: function () {
            return this.cw
        },
        setInitialPosition: function (a, b) {
            for (var c = 0, d = this.points.length; c < d; c++) this.points[c].x = a, this.points[c].y = b;
            return this
        },
        setFinalPosition: function (a, b) {
            this.points[2].x = a;
            this.points[2].y = b;
            this.points[1].x = a;
            this.points[1].y = this.points[0].y;
            this.points[3].x =
                this.points[0].x;
            this.points[3].y = b;
            this.points[4].x = this.points[0].x;
            this.points[4].y = this.points[0].y;
            this.updatePath();
            return this
        },
        endCurvePosition: function () {
            return this.points[4]
        },
        startCurvePosition: function () {
            return this.points[0]
        },
        getPosition: function (a) {
            if (a > 1 || a < 0) a %= 1;
            a < 0 && (a = 1 + a);
            if (-1 === this.length) this.newPosition.set(0, 0);
            else {
                var b = this.bbox.width / this.length,
                    c = this.bbox.height / this.length,
                    d = 0,
                    e, f = 0;
                this.cw ? (e = [0, 1, 2, 3, 4], b = [b, c, b, c]) : (e = [4, 3, 2, 1, 0], b = [c, b, c, b]);
                for (; f < b.length;)
                    if (d +
                        b[f] < a) d += b[f], f++;
                    else break;
                a -= d;
                d = e[f];
                e = e[f + 1];
                this.newPosition.set(this.points[d].x + (this.points[e].x - this.points[d].x) * a / b[f], this.points[d].y + (this.points[e].y - this.points[d].y) * a / b[f])
            }
            return this.newPosition
        },
        initialPositionX: function () {
            return this.points[0].x
        },
        finalPositionX: function () {
            return this.points[2].x
        },
        paint: function (a, b) {
            var c = a.crc;
            c.save();
            c.strokeStyle = this.color;
            c.beginPath();
            c.strokeRect(this.bbox.x, this.bbox.y, this.bbox.width, this.bbox.height);
            if (b) {
                c.globalAlpha = 0.5;
                c.fillStyle =
                    "#7f7f00";
                for (var d = 0; d < this.points.length; d++) c.beginPath(), c.arc(this.points[d].x, this.points[d].y, CAAT.Curve.prototype.HANDLE_SIZE / 2, 0, 2 * Math.PI, false), c.fill()
            }
            c.restore()
        },
        numControlPoints: function () {
            return this.points.length
        },
        getControlPoint: function (a) {
            return this.points[a]
        },
        getContour: function () {
            for (var a = [], b = 0; b < this.points.length; b++) a.push(this.points[b]);
            return a
        },
        updatePath: function (a) {
            if (a) {
                if (a === this.points[0]) this.points[1].y = a.y, this.points[3].x = a.x;
                else if (a === this.points[1]) this.points[0].y =
                    a.y, this.points[2].x = a.x;
                else if (a === this.points[2]) this.points[3].y = a.y, this.points[1].x = a.x;
                else if (a === this.points[3]) this.points[0].x = a.x, this.points[2].y = a.y;
                this.points[4].x = this.points[0].x;
                this.points[4].y = this.points[0].y
            }
            this.bbox.setEmpty();
            for (a = 0; a < 4; a++) this.bbox.union(this.points[a].x, this.points[a].y);
            this.length = 2 * this.bbox.width + 2 * this.bbox.height;
            this.points[0].x = this.bbox.x;
            this.points[0].y = this.bbox.y;
            this.points[1].x = this.bbox.x + this.bbox.width;
            this.points[1].y = this.bbox.y;
            this.points[2].x =
                this.bbox.x + this.bbox.width;
            this.points[2].y = this.bbox.y + this.bbox.height;
            this.points[3].x = this.bbox.x;
            this.points[3].y = this.bbox.y + this.bbox.height;
            this.points[4].x = this.bbox.x;
            this.points[4].y = this.bbox.y;
            return this
        }
    };
    extend(CAAT.ShapePath, CAAT.PathSegment)
})();
(function () {
    CAAT.Path = function () {
        CAAT.Path.superclass.constructor.call(this);
        this.newPosition = new CAAT.Point(0, 0, 0);
        this.pathSegments = [];
        this.behaviorList = [];
        this.matrix = new CAAT.Matrix;
        this.tmpMatrix = new CAAT.Matrix;
        return this
    };
    CAAT.Path.prototype = {
        pathSegments: null,
        pathSegmentDurationTime: null,
        pathSegmentStartTime: null,
        newPosition: null,
        pathLength: -1,
        beginPathX: -1,
        beginPathY: -1,
        trackPathX: -1,
        trackPathY: -1,
        ax: -1,
        ay: -1,
        point: [],
        interactive: true,
        behaviorList: null,
        rb_angle: 0,
        rb_rotateAnchorX: 0.5,
        rb_rotateAnchorY: 0.5,
        sb_scaleX: 1,
        sb_scaleY: 1,
        sb_scaleAnchorX: 0.5,
        sb_scaleAnchorY: 0.5,
        tb_x: 0,
        tb_y: 0,
        matrix: null,
        tmpMatrix: null,
        pathPoints: null,
        width: 0,
        height: 0,
        applyAsPath: function (a) {
            a.beginPath();
            a.globalCompositeOperation = "source-out";
            a.moveTo(this.getFirstPathSegment().startCurvePosition().x, this.getFirstPathSegment().startCurvePosition().y);
            for (var b = 0; b < this.pathSegments.length; b++) this.pathSegments[b].applyAsPath(a);
            a.globalCompositeOperation = "source-over";
            return this
        },
        setInteractive: function (a) {
            this.interactive =
                a;
            return this
        },
        getFirstPathSegment: function () {
            return this.pathSegments.length ? this.pathSegments[0] : null
        },
        getLastPathSegment: function () {
            return this.pathSegments.length ? this.pathSegments[this.pathSegments.length - 1] : null
        },
        endCurvePosition: function () {
            return this.pathSegments.length ? this.pathSegments[this.pathSegments.length - 1].endCurvePosition() : (new CAAT.Point).set(this.beginPathX, this.beginPathY)
        },
        startCurvePosition: function () {
            return this.pathSegments[0].startCurvePosition()
        },
        getCurrentPathSegment: function () {
            return this.pathSegments[this.pathSegments.length -
                1]
        },
        setLinear: function (a, b, c, d) {
            this.beginPath(a, b);
            this.addLineTo(c, d);
            this.endPath();
            return this
        },
        setQuadric: function (a, b, c, d, e, f) {
            this.beginPath(a, b);
            this.addQuadricTo(c, d, e, f);
            this.endPath();
            return this
        },
        setCubic: function (a, b, c, d, e, f, g, h) {
            this.beginPath(a, b);
            this.addCubicTo(c, d, e, f, g, h);
            this.endPath();
            return this
        },
        setRectangle: function (a, b, c, d) {
            this.beginPath(a, b);
            this.addRectangleTo(c, d);
            this.endPath();
            return this
        },
        addSegment: function (a) {
            a.setParent(this);
            this.pathSegments.push(a);
            return this
        },
        addRectangleTo: function (a, b, c, d) {
            var e = new CAAT.ShapePath;
            e.setPoints([this.endCurvePosition(), (new CAAT.Point).set(a, b)]);
            e.setClockWise(c);
            e.setColor(d);
            e.setParent(this);
            this.pathSegments.push(e);
            return this
        },
        addQuadricTo: function (a, b, c, d, e) {
            var f = new CAAT.Bezier;
            f.setPoints([this.endCurvePosition(), (new CAAT.Point).set(a, b), (new CAAT.Point).set(c, d)]);
            this.trackPathX = c;
            this.trackPathY = d;
            a = (new CAAT.CurvePath).setColor(e).setParent(this);
            a.curve = f;
            this.pathSegments.push(a);
            return this
        },
        addCubicTo: function (a,
            b, c, d, e, f, g) {
            var h = new CAAT.Bezier;
            h.setPoints([this.endCurvePosition(), (new CAAT.Point).set(a, b), (new CAAT.Point).set(c, d), (new CAAT.Point).set(e, f)]);
            this.trackPathX = e;
            this.trackPathY = f;
            a = (new CAAT.CurvePath).setColor(g).setParent(this);
            a.curve = h;
            this.pathSegments.push(a);
            return this
        },
        addCatmullTo: function (a, b, c, d, e, f, g) {
            g = (new CAAT.CatmullRom).setColor(g);
            g.setCurve(this.trackPathX, this.trackPathY, a, b, c, d, e, f);
            this.trackPathX = e;
            this.trackPathY = f;
            a = (new CAAT.CurvePath).setParent(this);
            a.curve = g;
            this.pathSegments.push(a);
            return this
        },
        addLineTo: function (a, b, c) {
            c = (new CAAT.LinearPath).setColor(c);
            c.setPoints([this.endCurvePosition(), (new CAAT.Point).set(a, b)]);
            c.setParent(this);
            this.trackPathX = a;
            this.trackPathY = b;
            this.pathSegments.push(c);
            return this
        },
        beginPath: function (a, b) {
            this.trackPathX = a;
            this.trackPathY = b;
            this.beginPathX = a;
            this.beginPathY = b;
            return this
        },
        closePath: function () {
            this.getLastPathSegment().setPoint(this.getFirstPathSegment().startCurvePosition(), this.getLastPathSegment().numControlPoints() -
                1);
            this.trackPathX = this.beginPathX;
            this.trackPathY = this.beginPathY;
            this.endPath();
            return this
        },
        endPath: function () {
            this.pathSegmentStartTime = [];
            this.pathSegmentDurationTime = [];
            this.updatePath();
            return this
        },
        getPosition: function (a) {
            if (a > 1 || a < 0) a %= 1;
            a < 0 && (a = 1 + a);
            for (var b = 0; b < this.pathSegments.length; b++)
                if (this.pathSegmentStartTime[b] <= a && a <= this.pathSegmentStartTime[b] + this.pathSegmentDurationTime[b]) {
                    a = this.pathSegmentDurationTime[b] ? (a - this.pathSegmentStartTime[b]) / this.pathSegmentDurationTime[b] :
                        0;
                    a = this.pathSegments[b].getPosition(a);
                    this.newPosition.x = a.x;
                    this.newPosition.y = a.y;
                    break
                }
            return this.newPosition
        },
        getPositionFromLength: function (a) {
            a %= this.getLength();
            a < 0 && (a += this.getLength());
            for (var b = 0, c = 0; c < this.pathSegments.length; c++) {
                if (b <= a && a <= this.pathSegments[c].getLength() + b) {
                    a -= b;
                    a = this.pathSegments[c].getPositionFromLength(a);
                    this.newPosition.x = a.x;
                    this.newPosition.y = a.y;
                    break
                }
                b += this.pathSegments[c].getLength()
            }
            return this.newPosition
        },
        paint: function (a) {
            for (var b = 0; b < this.pathSegments.length; b++) this.pathSegments[b].paint(a,
                this.interactive)
        },
        release: function () {
            this.ay = this.ax = -1
        },
        getNumSegments: function () {
            return this.pathSegments.length
        },
        getSegment: function (a) {
            return this.pathSegments[a]
        },
        numControlPoints: function () {
            return this.points.length
        },
        getControlPoint: function (a) {
            return this.points[a]
        },
        updatePath: function (a) {
            var b, c;
            this.length = 0;
            this.bbox.setEmpty();
            this.points = [];
            for (b = 0; b < this.pathSegments.length; b++) {
                this.pathSegments[b].updatePath(a);
                this.length += this.pathSegments[b].getLength();
                this.bbox.unionRectangle(this.pathSegments[b].bbox);
                for (c = 0; c < this.pathSegments[b].numControlPoints(); c++) this.points.push(this.pathSegments[b].getControlPoint(c))
            }
            this.width = this.bbox.width;
            this.height = this.bbox.height;
            this.pathSegmentStartTime = [];
            this.pathSegmentDurationTime = [];
            for (b = 0; b < this.pathSegments.length; b++) this.pathSegmentStartTime.push(0), this.pathSegmentDurationTime.push(0);
            for (b = 0; b < this.pathSegments.length; b++) this.pathSegmentDurationTime[b] = this.getLength() ? this.pathSegments[b].getLength() / this.getLength() : 0, b > 0 ? this.pathSegmentStartTime[b] =
                this.pathSegmentStartTime[b - 1] + this.pathSegmentDurationTime[b - 1] : this.pathSegmentStartTime[0] = 0, this.pathSegments[b].endPath();
            return this
        },
        press: function (a, b) {
            if (this.interactive) {
                for (var c = CAAT.Curve.prototype.HANDLE_SIZE / 2, d = 0; d < this.pathSegments.length; d++)
                    for (var e = 0; e < this.pathSegments[d].numControlPoints(); e++) {
                        var f = this.pathSegments[d].getControlPoint(e);
                        if (a >= f.x - c && b >= f.y - c && a < f.x + c && b < f.y + c) {
                            this.point = f;
                            return
                        }
                    }
                this.point = null
            }
        },
        drag: function (a, b) {
            if (this.interactive && null !== this.point) {
                if (-1 ===
                    this.ax || -1 === this.ay) this.ax = a, this.ay = b;
                this.point.x += a - this.ax;
                this.point.y += b - this.ay;
                this.ax = a;
                this.ay = b;
                this.updatePath(this.point)
            }
        },
        getContour: function (a) {
            for (var b = [], c = 0; c <= a; c++) b.push((new CAAT.Point).set(c / a, this.getPosition(c / a).y, 0));
            return b
        },
        setPoints: function (a) {
            if (this.points.length === a.length)
                for (var b = 0; b < a.length; b++) this.points[b].x = a[b].x, this.points[b].y = a[b].y;
            return this
        },
        setPoint: function (a, b) {
            if (b >= 0 && b < this.points.length) this.points[b].x = a.x, this.points[b].y = a.y;
            return this
        },
        emptyBehaviorList: function () {
            this.behaviorList = [];
            return this
        },
        extractPathPoints: function () {
            if (!this.pathPoints) {
                var a;
                this.pathPoints = [];
                for (a = 0; a < this.numControlPoints(); a++) this.pathPoints.push(this.getControlPoint(a).clone())
            }
            return this
        },
        addBehavior: function (a) {
            this.behaviorList.push(a);
            this.extractPathPoints();
            return this
        },
        removeBehaviour: function (a) {
            for (var b = this.behaviorList.length - 1; b;)
                if (this.behaviorList[b] === a) {
                    this.behaviorList.splice(b, 1);
                    break
                }
            return this
        },
        removeBehaviorById: function (a) {
            for (var b =
                0; b < this.behaviorList.length; b++) this.behaviorList[b].id === a && this.behaviorList.splice(b, 1);
            return this
        },
        applyBehaviors: function (a) {
            if (this.behaviorList.length) {
                for (var b = 0; b < this.behaviorList.length; b++) this.behaviorList[b].apply(a, this);
                this.setATMatrix();
                for (b = 0; b < this.numControlPoints(); b++) this.setPoint(this.matrix.transformCoord(this.pathPoints[b].clone()), b)
            }
            return this
        },
        setATMatrix: function () {
            this.matrix.identity();
            this.tmpMatrix.identity();
            var a = this.matrix.matrix,
                b, c, d, e, f, g, h, j, k, l;
            h = this.bbox;
            var m = h.width,
                o = h.height,
                n = h.x,
                p = h.y;
            h = 1;
            k = e = 0;
            g = 1;
            j = this.tb_x - n;
            l = this.tb_y - p;
            if (this.rb_angle) {
                var q = this.rb_rotateAnchorX * m + n,
                    r = this.rb_rotateAnchorY * o + p;
                j += h * q + e * r;
                l += k * q + g * r;
                b = Math.cos(this.rb_angle);
                c = Math.sin(this.rb_angle);
                d = h;
                f = k;
                h = d * b + e * c;
                e = -d * c + e * b;
                k = f * b + g * c;
                g = -f * c + g * b;
                j += -h * q - e * r;
                l += -k * q - g * r
            }
            if (this.sb_scaleX != 1 || this.sb_scaleY != 1) m = this.sb_scaleAnchorX * m + n, o = this.sb_scaleAnchorY * o + p, j += h * m + e * o, l += k * m + g * o, h *= this.sb_scaleX, e *= this.sb_scaleY, k *= this.sb_scaleX, g *= this.sb_scaleY, j += -h * m -
                e * o, l += -k * m - g * o;
            a[0] = h;
            a[1] = e;
            a[2] = j;
            a[3] = k;
            a[4] = g;
            a[5] = l;
            return this
        },
        setRotationAnchored: function (a, b, c) {
            this.rb_angle = a;
            this.rb_rotateAnchorX = b;
            this.rb_rotateAnchorY = c;
            return this
        },
        setScaleAnchored: function (a, b, c, d) {
            this.sb_scaleX = a;
            this.sb_scaleAnchorX = c;
            this.sb_scaleY = b;
            this.sb_scaleAnchorY = d;
            return this
        },
        setLocation: function (a, b) {
            this.tb_x = a;
            this.tb_y = b;
            return this
        }
    };
    extend(CAAT.Path, CAAT.PathSegment, null)
})();
(function () {
    CAAT.PathActor = function () {
        CAAT.PathActor.superclass.constructor.call(this);
        return this
    };
    CAAT.PathActor.prototype = {
        path: null,
        pathBoundingRectangle: null,
        bOutline: false,
        outlineColor: "black",
        getPath: function () {
            return this.path
        },
        setPath: function (a) {
            this.path = a;
            this.pathBoundingRectangle = a.getBoundingBox();
            return this
        },
        paint: function (a) {
            var b = a.crc;
            b.strokeStyle = "black";
            this.path.paint(a);
            if (this.bOutline) b.strokeStyle = this.outlineColor, b.strokeRect(0, 0, this.width, this.height)
        },
        showBoundingBox: function (a,
            b) {
            if ((this.bOutline = a) && b) this.outlineColor = b
        },
        setInteractive: function (a) {
            this.path && this.path.setInteractive(a);
            return this
        },
        mouseDrag: function (a) {
            this.path.drag(a.point.x, a.point.y)
        },
        mouseDown: function (a) {
            this.path.press(a.point.x, a.point.y)
        },
        mouseUp: function () {
            this.path.release()
        }
    };
    extend(CAAT.PathActor, CAAT.ActorContainer, null)
})();
(function () {
    CAAT.ImageProcessor = function () {
        return this
    };
    CAAT.ImageProcessor.prototype = {
        canvas: null,
        ctx: null,
        width: 0,
        height: 0,
        imageData: null,
        bufferImage: null,
        grabPixels: function (a) {
            var b = document.createElement("canvas");
            if (b !== null) {
                b.width = a.width;
                b.height = a.height;
                var c = b.getContext("2d");
                c.drawImage(a, 0, 0);
                try {
                    return c.getImageData(0, 0, b.width, b.height)
                } catch (d) {
                    CAAT.log("error pixelgrabbing.", a)
                }
            }
            return null
        },
        makeArray: function (a, b) {
            for (var c = [], d = 0; d < a; d++) c.push(b);
            return c
        },
        makeArray2D: function (a,
            b, c) {
            for (var d = [], e = 0; e < a; e++) d.push(this.makeArray(b, c));
            return d
        },
        initialize: function (a, b) {
            this.width = a;
            this.height = b;
            this.canvas = document.createElement("canvas");
            if (this.canvas !== null) this.canvas.width = a, this.canvas.height = b, this.ctx = this.canvas.getContext("2d"), this.imageData = this.ctx.getImageData(0, 0, a, b), this.bufferImage = this.imageData.data;
            return this
        },
        clear: function (a, b, c, d) {
            if (null === this.imageData) return this;
            for (var e = this.imageData.data, f = 0; f < this.width * this.height; f++) e[f * 4 + 0] = a, e[f *
                4 + 1] = b, e[f * 4 + 2] = c, e[f * 4 + 3] = d;
            this.imageData.data = e;
            return this
        },
        getImageData: function () {
            return this.ctx.getImageData(0, 0, this.width, this.height)
        },
        apply: function () {
            if (null !== this.imageData) this.imageData.data = this.bufferImage, this.ctx.putImageData(this.imageData, 0, 0);
            return this
        },
        getCanvas: function () {
            return this.canvas
        },
        createPattern: function (a) {
            return this.ctx.createPattern(this.canvas, a ? a : "repeat")
        },
        paint: function (a) {
            null !== this.canvas && a.ctx.drawImage(this.getCanvas(), 0, 0)
        }
    }
})();
(function () {
    CAAT.IMPlasma = function () {
        CAAT.IMPlasma.superclass.constructor.call(this);
        return this
    };
    CAAT.IMPlasma.prototype = {
        wavetable: null,
        m_colorMap: null,
        spd1: 1,
        spd2: 2,
        spd3: 3,
        spd4: 4,
        pos1: 0,
        pos2: 0,
        pos3: 0,
        pos4: 0,
        tpos1: 0,
        tpos2: 0,
        tpos3: 0,
        tpos4: 0,
        m_colorMapSize: 256,
        i1: 0,
        i2: 0,
        i3: 0,
        i4: 0,
        b1: false,
        b2: false,
        b3: false,
        b4: false,
        color: [4294967295, 4294902015, 4294967040, 4278255360, 4294901760, 4278190335, 4278190080],
        initialize: function (a, b, c) {
            CAAT.IMPlasma.superclass.initialize.call(this, a, b);
            this.wavetable = [];
            for (a =
                0; a < 256; a++) this.wavetable.push(Math.floor(32 * (1 + Math.cos(a * 2 * Math.PI / 256))));
            this.pos1 = Math.floor(255 * Math.random());
            this.pos2 = Math.floor(255 * Math.random());
            this.pos3 = Math.floor(255 * Math.random());
            this.pos4 = Math.floor(255 * Math.random());
            this.m_colorMap = CAAT.Color.prototype.makeRGBColorRamp(c !== null ? c : this.color, 256, CAAT.Color.prototype.RampEnumeration.RAMP_CHANNEL_RGBA_ARRAY);
            this.setB();
            return this
        },
        setB: function () {
            this.b1 = Math.random() > 0.5;
            this.b2 = Math.random() > 0.5;
            this.b3 = Math.random() > 0.5;
            this.b4 =
                Math.random() > 0.5;
            this.spd1 = Math.floor((Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.spd2 = Math.floor((Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.spd3 = Math.floor((Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.spd4 = Math.floor((Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.i1 = Math.floor((Math.random() * 2.4 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.i2 = Math.floor((Math.random() * 2.4 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.i3 = Math.floor((Math.random() * 2.4 + 1) * (Math.random() < 0.5 ? 1 : -1));
            this.i4 = Math.floor((Math.random() *
                2.4 + 1) * (Math.random() < 0.5 ? 1 : -1))
        },
        apply: function (a, b) {
            var c = 0;
            this.tpos1 = this.pos1;
            this.tpos2 = this.pos2;
            for (var d = this.bufferImage, e = this.m_colorMap, f = this.wavetable, g, h = 0; h < this.height; h++) {
                this.tpos3 = this.pos3;
                this.tpos4 = this.pos4;
                for (var j = 0; j < this.width; j++) {
                    g = this.tpos1 + this.tpos2 + this.tpos3;
                    var k = this.tpos2 + this.tpos3 - this.tpos1,
                        l = this.tpos3 + this.tpos4 - this.tpos2,
                        m = this.tpos4 + this.tpos1 - this.tpos2;
                    this.b1 && (g = -g);
                    this.b2 && (k = -k);
                    this.b3 && (l = -l);
                    this.b4 && (m = -m);
                    g = Math.floor(f[g & 255] + f[k & 255] +
                        f[l & 255] + f[m & 255]);
                    g = e[g];
                    d[c++] = g[0];
                    d[c++] = g[1];
                    d[c++] = g[2];
                    d[c++] = g[3];
                    this.tpos3 += this.i1;
                    this.tpos3 &= 255;
                    this.tpos4 += this.i2;
                    this.tpos4 &= 255
                }
                this.tpos1 += this.i3;
                this.tpos1 &= 255;
                this.tpos2 += this.i4;
                this.tpos2 &= 255
            }
            this.pos1 += this.spd1;
            this.pos2 -= this.spd2;
            this.pos3 += this.spd3;
            this.pos4 -= this.spd4;
            this.pos1 &= 255;
            this.pos3 &= 255;
            this.pos2 &= 255;
            this.pos4 &= 255;
            return CAAT.IMPlasma.superclass.apply.call(this, a, b)
        }
    };
    extend(CAAT.IMPlasma, CAAT.ImageProcessor, null)
})();
(function () {
    CAAT.IMBump = function () {
        CAAT.IMBump.superclass.constructor.call(this);
        return this
    };
    CAAT.IMBump.prototype = {
        m_avgX: null,
        m_avgY: null,
        m_tt: null,
        phong: null,
        m_radius: 75,
        m_lightcolor: null,
        bcolor: false,
        lightPosition: [],
        prepareBump: function (a, b) {
            var c, d;
            this.m_radius = b ? b : 75;
            d = this.grabPixels(a);
            this.m_tt = this.makeArray(this.height, 0);
            for (c = 0; c < this.height; c++) this.m_tt[c] = this.width * c;
            this.m_avgX = this.makeArray2D(this.height, this.width, 0);
            this.m_avgY = this.makeArray2D(this.height, this.width, 0);
            var e =
                this.makeArray2D(this.height, this.width, 0);
            if (null !== d) {
                var f = d.data;
                for (c = 0; c < this.height; c++)
                    for (d = 0; d < this.width; d++) {
                        var g = (c * this.width + d) * 4;
                        e[c][d] = f[g] + f[g + 1] + f[g + 2]
                    }
                e = this.soften(e);
                for (c = 1; c < this.width - 1; c++)
                    for (d = 1; d < this.height - 1; d++) this.m_avgX[d][c] = Math.floor(e[d][c + 1] - e[d][c - 1]), this.m_avgY[d][c] = Math.floor(e[d + 1][c] - e[d - 1][c])
            }
        },
        soften: function (a) {
            for (var b, c = this.makeArray2D(this.height, this.width, 0), d = 0; d < this.width; d++)
                for (var e = 0; e < this.height; e++) b = a[e][d], b += a[(e + 1) % this.height][d],
            b += a[(e + this.height - 1) % this.height][d], b += a[e][(d + 1) % this.width], b += a[e][(d + this.width - 1) % this.width], b += a[(e + 1) % this.height][(d + 1) % this.width], b += a[(e + this.height - 1) % this.height][(d + this.width - 1) % this.width], b += a[(e + this.height - 1) % this.height][(d + 1) % this.width], b += a[(e + 1) % this.height][(d + this.width - 1) % this.width], b /= 9, c[e][d] = b / 3;
            return c
        },
        calculatePhong: function () {
            this.phong = this.makeArray2D(this.m_radius, this.m_radius, 0);
            var a, b, c;
            for (a = 0; a < this.m_radius; a++)
                for (b = 0; b < this.m_radius; b++) {
                    c = b / this.m_radius;
                    var d = a / this.m_radius;
                    c = (1 - Math.sqrt(c * c + d * d)) * 0.8;
                    c < 0 && (c = 0);
                    this.phong[a][b] = Math.floor(c * 255)
                }
        },
        drawColored: function (a) {
            var b, c, d;
            for (b = 0; b < this.height; b++)
                for (c = 0; c < this.width; c++) {
                    var e = 0,
                        f = 0,
                        g = 0;
                    for (d = 0; d < this.m_lightcolor.length; d++) {
                        var h = this.lightPosition[d].y,
                            j = Math.floor(Math.abs(this.m_avgX[b][c] - c + this.lightPosition[d].x)),
                            h = Math.floor(Math.abs(this.m_avgY[b][c] - b + h));
                        j >= this.m_radius && (j = this.m_radius - 1);
                        h >= this.m_radius && (h = this.m_radius - 1);
                        var j = this.phong[j][h],
                            k = h = 0,
                            l = 0;
                        j >= 0 ? (h =
                            this.m_lightcolor[d][0] * j / 128, k = this.m_lightcolor[d][1] * j / 128, l = this.m_lightcolor[d][2] * j / 128) : (j = 128 + j, h = this.m_lightcolor[d][0], k = this.m_lightcolor[d][1], l = this.m_lightcolor[d][2], h = Math.floor(h + (255 - h) * j / 128), k = Math.floor(k + (255 - k) * j / 128), l = Math.floor(l + (255 - l) * j / 128));
                        e += h;
                        f += k;
                        g += l
                    }
                    e > 255 && (e = 255);
                    f > 255 && (f = 255);
                    g > 255 && (g = 255);
                    d = (c + this.m_tt[b]) * 4;
                    a[d] = e;
                    a[d + 1] = f;
                    a[d + 2] = g;
                    a[d + 3] = 255
                }
        },
        setLightColors: function (a) {
            this.m_lightcolor = a;
            this.lightPosition = [];
            for (a = 0; a < this.m_lightcolor.length; a++) {
                var b =
                    this.width * Math.random(),
                    c = this.height * Math.random();
                this.lightPosition.push((new CAAT.Point).set(b, c))
            }
            return this
        },
        initialize: function (a, b) {
            CAAT.IMBump.superclass.initialize.call(this, a.width, a.height);
            this.setLightColors([
                [255, 128, 0],
                [0, 0, 255]
            ]);
            this.prepareBump(a, b);
            this.calculatePhong();
            return this
        },
        setLightPosition: function (a, b, c) {
            this.lightPosition[a].set(b, c);
            return this
        },
        apply: function (a, b) {
            this.drawColored(this.bufferImage);
            return CAAT.IMBump.superclass.apply.call(this, a, b)
        }
    };
    extend(CAAT.IMBump,
        CAAT.ImageProcessor, null)
})();
(function () {
    CAAT.IMRotoZoom = function () {
        CAAT.IMRotoZoom.superclass.constructor.call(this);
        return this
    };
    CAAT.IMRotoZoom.prototype = {
        m_alignv: 1,
        m_alignh: 1,
        distortion: 2,
        mask: 0,
        shift: 0,
        sourceImageData: null,
        initialize: function (a, b, c) {
            CAAT.IMRotoZoom.superclass.initialize.call(this, a, b);
            this.clear(255, 128, 0, 255);
            this.sourceImageData = this.grabPixels(c);
            if (null !== this.sourceImageData) switch (this.sourceImageData.width) {
            case 1024:
                this.mask = 1023;
                this.shift = 10;
                break;
            case 512:
                this.mask = 511;
                this.shift = 9;
                break;
            case 256:
                this.mask =
                    255;
                this.shift = 8;
                break;
            case 128:
                this.mask = 127;
                this.shift = 7;
                break;
            case 64:
                this.mask = 63;
                this.shift = 6;
                break;
            case 32:
                this.mask = 31;
                this.shift = 5;
                break;
            case 16:
                this.mask = 15;
                this.shift = 4;
                break;
            case 8:
                this.mask = 7, this.shift = 3
            }
            this.setCenter();
            return this
        },
        rotoZoom: function () {
            var a = (new Date).getTime(),
                b = Math.PI * 2 * Math.cos(a * 1.0E-4),
                c = 600 + 550 * Math.sin(a * 2.0E-4),
                a = this.distortion,
                d = 0,
                e = Math.floor(Math.cos(b) * c),
                b = Math.floor(Math.sin(b) * c),
                f = 0,
                g = 0;
            switch (this.m_alignh) {
            case 0:
                f = 0;
                break;
            case 1:
                f = this.height >>
                    1;
                break;
            case 2:
                f = this.height - 1
            }
            switch (this.m_alignv) {
            case 0:
                g = 0;
                break;
            case 1:
                g = this.width >> 1;
                break;
            case 2:
                g = this.width - 1
            }
            for (var c = (this.width >> 1 << 8) - e * g + b * f & 65535, f = (this.height >> 1 << 8) - b * g - e * f & 65535, g = this.sourceImageData.width, h = this.sourceImageData.data, j = this.bufferImage, k, l, m; d < this.width * this.height * 4;) {
                l = c;
                m = f;
                for (var o = 0; o < this.width; o++) k = (m >> this.shift & this.mask) * g + (l >> this.shift & this.mask), k <<= 2, j[d++] = h[k++], j[d++] = h[k++], j[d++] = h[k++], j[d++] = h[k++], l += e, m += b;
                a += this.distortion;
                c -= b;
                f +=
                    e - a
            }
        },
        apply: function (a, b) {
            null !== this.sourceImageData && this.rotoZoom(a, b);
            return CAAT.IMRotoZoom.superclass.apply.call(this, a, b)
        },
        setCenter: function () {
            var a = Math.random();
            this.m_alignv = a < 0.33 ? 0 : a < 0.66 ? 1 : 2;
            a = Math.random();
            this.m_alignh = a < 0.33 ? 0 : a < 0.66 ? 1 : 2
        }
    };
    extend(CAAT.IMRotoZoom, CAAT.ImageProcessor, null)
})();
(function () {
    CAAT.Program = function (a) {
        this.gl = a;
        return this
    };
    CAAT.Program.prototype = {
        shaderProgram: null,
        gl: null,
        setAlpha: function () {},
        getShader: function (a, b, c) {
            if (b === "x-shader/x-fragment") b = a.createShader(a.FRAGMENT_SHADER);
            else if (b === "x-shader/x-vertex") b = a.createShader(a.VERTEX_SHADER);
            else return null;
            a.shaderSource(b, c);
            a.compileShader(b);
            return !a.getShaderParameter(b, a.COMPILE_STATUS) ? (alert(a.getShaderInfoLog(b)), null) : b
        },
        getDomShader: function (a, b) {
            var c = document.getElementById(b);
            if (!c) return null;
            for (var d = "", e = c.firstChild; e;) e.nodeType === 3 && (d += e.textContent), e = e.nextSibling;
            if (c.type === "x-shader/x-fragment") c = a.createShader(a.FRAGMENT_SHADER);
            else if (c.type === "x-shader/x-vertex") c = a.createShader(a.VERTEX_SHADER);
            else return null;
            a.shaderSource(c, d);
            a.compileShader(c);
            return !a.getShaderParameter(c, a.COMPILE_STATUS) ? (alert(a.getShaderInfoLog(c)), null) : c
        },
        initialize: function () {
            return this
        },
        getFragmentShader: function () {
            return null
        },
        getVertexShader: function () {
            return null
        },
        create: function () {
            var a =
                this.gl;
            this.shaderProgram = a.createProgram();
            a.attachShader(this.shaderProgram, this.getVertexShader());
            a.attachShader(this.shaderProgram, this.getFragmentShader());
            a.linkProgram(this.shaderProgram);
            a.useProgram(this.shaderProgram);
            return this
        },
        setMatrixUniform: function (a) {
            this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, new Float32Array(a.flatten()))
        },
        useProgram: function () {
            this.gl.useProgram(this.shaderProgram);
            return this
        }
    }
})();
(function () {
    CAAT.ColorProgram = function (a) {
        CAAT.ColorProgram.superclass.constructor.call(this, a);
        return this
    };
    CAAT.ColorProgram.prototype = {
        colorBuffer: null,
        vertexPositionBuffer: null,
        vertexPositionArray: null,
        getFragmentShader: function () {
            return this.getShader(this.gl, "x-shader/x-fragment", "#ifdef GL_ES \nprecision highp float; \n#endif \nvarying vec4 color; \nvoid main(void) { \n  gl_FragColor = color;\n}\n")
        },
        getVertexShader: function () {
            return this.getShader(this.gl, "x-shader/x-vertex", "attribute vec3 aVertexPosition; \nattribute vec4 aColor; \nuniform mat4 uPMatrix; \nvarying vec4 color; \nvoid main(void) { \ngl_Position = uPMatrix * vec4(aVertexPosition, 1.0); \ncolor= aColor; \n}\n")
        },
        initialize: function () {
            this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
            this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aColor");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
            this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            this.useProgram();
            this.colorBuffer = this.gl.createBuffer();
            this.setColor([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            this.vertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.vertexPositionArray = new Float32Array(49152);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionArray, this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
            return CAAT.ColorProgram.superclass.initialize.call(this)
        },
        setColor: function (a) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
                this.colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(a), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.colorBuffer, this.gl.FLOAT, false, 0, 0)
        }
    };
    extend(CAAT.ColorProgram, CAAT.Program, null)
})();
(function () {
    CAAT.TextureProgram = function (a) {
        CAAT.TextureProgram.superclass.constructor.call(this, a);
        return this
    };
    CAAT.TextureProgram.prototype = {
        vertexPositionBuffer: null,
        vertexPositionArray: null,
        vertexUVBuffer: null,
        vertexUVArray: null,
        vertexIndexBuffer: null,
        linesBuffer: null,
        prevAlpha: -1,
        prevR: -1,
        prevG: -1,
        prevB: -1,
        prevA: -1,
        prevTexture: null,
        getFragmentShader: function () {
            return this.getShader(this.gl, "x-shader/x-fragment", "#ifdef GL_ES \nprecision highp float; \n#endif \nvarying vec2 vTextureCoord; \nuniform sampler2D uSampler; \nuniform float alpha; \nuniform bool uUseColor;\nuniform vec4 uColor;\nvoid main(void) { \nif ( uUseColor ) {\n  gl_FragColor= vec4(uColor.rgb, uColor.a*alpha);\n} else { \n  vec4 textureColor= texture2D(uSampler, vec2(vTextureCoord)); \n  gl_FragColor = vec4(textureColor.rgb, textureColor.a * alpha); \n}\n}\n")
        },
        getVertexShader: function () {
            return this.getShader(this.gl, "x-shader/x-vertex", "attribute vec3 aVertexPosition; \nattribute vec2 aTextureCoord; \nuniform mat4 uPMatrix; \nvarying vec2 vTextureCoord; \nvoid main(void) { \ngl_Position = uPMatrix * vec4(aVertexPosition, 1.0); \nvTextureCoord = aTextureCoord;\n}\n")
        },
        useProgram: function () {
            CAAT.TextureProgram.superclass.useProgram.call(this);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
        },
        initialize: function () {
            var a;
            this.linesBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.linesBuffer);
            var b = [];
            for (a = 0; a < 1024; a++) b[a] = a;
            this.linesBufferArray = new Uint16Array(b);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.linesBufferArray, this.gl.DYNAMIC_DRAW);
            this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
            this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
            this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
            this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
            this.shaderProgram.alphaUniform = this.gl.getUniformLocation(this.shaderProgram, "alpha");
            this.shaderProgram.useColor = this.gl.getUniformLocation(this.shaderProgram,
                "uUseColor");
            this.shaderProgram.color = this.gl.getUniformLocation(this.shaderProgram, "uColor");
            this.setAlpha(1);
            this.setUseColor(false);
            this.vertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.vertexPositionArray = new Float32Array(49152);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionArray, this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
            this.vertexUVBuffer =
                this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.vertexUVArray = new Float32Array(32768);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexUVArray, this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
            this.vertexIndexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            b = [];
            for (a = 0; a < 4096; a++) b.push(0 + a * 4), b.push(1 + a * 4), b.push(2 + a * 4), b.push(0 + a * 4),
            b.push(2 + a * 4), b.push(3 + a * 4);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(b), this.gl.STATIC_DRAW);
            return CAAT.TextureProgram.superclass.initialize.call(this)
        },
        setUseColor: function (a, b, c, d, e) {
            this.gl.uniform1i(this.shaderProgram.useColor, a ? 1 : 0);
            if (a && (this.prevA !== e || this.prevR !== b || this.prevG !== c || this.prevB !== d)) this.gl.uniform4f(this.shaderProgram.color, b, c, d, e), this.prevA = e, this.prevR = b, this.prevG = c, this.prevB = d
        },
        setTexture: function (a) {
            if (this.prevTexture !== a) {
                var b = this.gl;
                b.activeTexture(b.TEXTURE0);
                b.bindTexture(b.TEXTURE_2D, a);
                b.uniform1i(this.shaderProgram.samplerUniform, 0);
                this.prevTexture = a
            }
            return this
        },
        updateVertexBuffer: function (a) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, a);
            return this
        },
        updateUVBuffer: function (a) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, a);
            return this
        },
        setAlpha: function (a) {
            if (this.prevAlpha !== a) this.gl.uniform1f(this.shaderProgram.alphaUniform,
                a), this.prevAlpha = a;
            return this
        },
        drawLines: function (a, b, c, d, e, f, g) {
            var h = this.gl;
            this.setAlpha(f);
            h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, this.linesBuffer);
            h.lineWidth(g);
            this.updateVertexBuffer(a);
            this.setUseColor(true, c, d, e, 1);
            h.drawElements(h.LINES, b, h.UNSIGNED_SHORT, 0);
            this.setAlpha(1);
            this.setUseColor(false);
            h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
        },
        drawPolylines: function (a, b, c, d, e, f, g) {
            var h = this.gl;
            h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, this.linesBuffer);
            h.lineWidth(g);
            this.setAlpha(f);
            this.updateVertexBuffer(a);
            this.setUseColor(true, c, d, e, 1);
            h.drawElements(h.LINE_STRIP, b, h.UNSIGNED_SHORT, 0);
            this.setAlpha(1);
            this.setUseColor(false);
            h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
        }
    };
    extend(CAAT.TextureProgram, CAAT.Program, null)
})();

function makePerspective(a, b, c, d, e) {
    var a = c * Math.tan(a * Math.PI / 360),
        f = -a;
    return makeFrustum(f * b, a * b, f, a, c, d, e)
}

function makeFrustum(a, b, c, d, e, f, g) {
    var h = 2 * e / (b - a),
        j = 2 * e / (d - c),
        a = (b + a) / (b - a),
        c = (d + c) / (d - c),
        d = -(f + e) / (f - e),
        e = -2 * f * e / (f - e);
    return (new CAAT.Matrix3).initWithMatrix([
        [h, 0, a, -g / 2],
        [0, -j, c, g / 2],
        [0, 0, d, e],
        [0, 0, -1, 0]
    ])
}

function makeOrtho(a, b, c, d, e, f) {
    var g = -(b + a) / (b - a),
        h = -(d + c) / (d - c),
        j = -(f + e) / (f - e);
    return (new CAAT.Matrix3).initWithMatrix([
        [2 / (b - a), 0, 0, g],
        [0, 2 / (d - c), 0, h],
        [0, 0, -2 / (f - e), j],
        [0, 0, 0, 1]
    ])
}
(function () {
    CAAT.GLTextureElement = function () {
        return this
    };
    CAAT.GLTextureElement.prototype = {
        inverted: false,
        image: null,
        u: 0,
        v: 0,
        glTexture: null
    }
})();
(function () {
    CAAT.GLTextureScan = function (a) {
        this.freeChunks = [{
            position: 0,
            size: a || 1024
        }];
        return this
    };
    CAAT.GLTextureScan.prototype = {
        freeChunks: null,
        findWhereFits: function (a) {
            if (this.freeChunks.length === 0) return [];
            var b = [],
                c;
            for (c = 0; c < this.freeChunks.length; c++)
                for (var d = 0; d + a <= this.freeChunks[c].size;) b.push(d + this.freeChunks[c].position), d += a;
            return b
        },
        fits: function (a, b) {
            for (var c = 0, c = 0; c < this.freeChunks.length; c++) {
                var d = this.freeChunks[c];
                if (d.position <= a && a + b <= d.position + d.size) return true
            }
            return false
        },
        substract: function (a, b) {
            for (var c = 0, c = 0; c < this.freeChunks.length; c++) {
                var d = this.freeChunks[c];
                if (d.position <= a && a + b <= d.position + d.size) {
                    var e = 0,
                        f = 0,
                        g = 0,
                        h = 0,
                        e = d.position,
                        f = a - d.position,
                        g = a + b,
                        h = d.position + d.size - g;
                    this.freeChunks.splice(c, 1);
                    f > 0 && this.freeChunks.splice(c++, 0, {
                        position: e,
                        size: f
                    });
                    h > 0 && this.freeChunks.splice(c, 0, {
                        position: g,
                        size: h
                    });
                    return true
                }
            }
            return false
        },
        log: function (a) {
            if (0 === this.freeChunks.length) CAAT.log("index " + a + " empty");
            else {
                for (var a = "index " + a, b = 0; b < this.freeChunks.length; b++) {
                    var c =
                        this.freeChunks[b];
                    a += "[" + c.position + "," + c.size + "]"
                }
                CAAT.log(a)
            }
        }
    }
})();
(function () {
    CAAT.GLTextureScanMap = function (a, b) {
        this.scanMapHeight = b;
        this.scanMapWidth = a;
        this.scanMap = [];
        for (var c = 0; c < this.scanMapHeight; c++) this.scanMap.push(new CAAT.GLTextureScan(this.scanMapWidth));
        return this
    };
    CAAT.GLTextureScanMap.prototype = {
        scanMap: null,
        scanMapWidth: 0,
        scanMapHeight: 0,
        whereFitsChunk: function (a, b) {
            if (a > this.width || b > this.height) return null;
            for (var c, d, e = 0; e <= this.scanMapHeight - b;) {
                var f = null;
                for (c = false; e <= this.scanMapHeight - b; e++)
                    if (f = this.scanMap[e].findWhereFits(a), null !==
                        f && f.length > 0) {
                        c = true;
                        break
                    }
                if (c) {
                    for (d = 0; d < f.length; d++) {
                        var g = true;
                        for (c = e; c < e + b; c++)
                            if (!this.scanMap[c].fits(f[d], a)) {
                                g = false;
                                break
                            }
                        if (g) return {
                            x: f[d],
                            y: e
                        }
                    }
                    e++
                } else break
            }
            return null
        },
        substract: function (a, b, c, d) {
            for (var e = 0; e < d; e++) this.scanMap[e + b].substract(a, c) || CAAT.log("Error: removing chunk ", c, d, " at ", a, b)
        },
        log: function () {
            for (var a = 0; a < this.scanMapHeight; a++) this.scanMap[a].log(a)
        }
    }
})();
(function () {
    CAAT.GLTexturePage = function (a, b) {
        this.width = a || 1024;
        this.height = b || 1024;
        this.images = [];
        return this
    };
    CAAT.GLTexturePage.prototype = {
        width: 1024,
        height: 1024,
        gl: null,
        texture: null,
        allowImagesInvertion: false,
        padding: 4,
        scan: null,
        images: null,
        criteria: "area",
        initialize: function (a) {
            this.gl = a;
            this.texture = a.createTexture();
            a.bindTexture(a.TEXTURE_2D, this.texture);
            a.enable(a.BLEND);
            a.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA);
            for (var b = new Uint8Array(this.width * this.height * 4), c = 0; c < 4 * this.width *
                this.height;) b[c++] = 0, b[c++] = 0, b[c++] = 0, b[c++] = 0;
            a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, this.width, this.height, 0, a.RGBA, a.UNSIGNED_BYTE, b);
            a.enable(a.BLEND);
            for (b = 0; b < this.images.length; b++) c = this.images[b], c.inverted && (c = CAAT.modules.ImageUtil.prototype.rotate(c, -90)), a.texSubImage2D(a.TEXTURE_2D, 0, this.images[b].__tx, this.images[b].__ty, a.RGBA, a.UNSIGNED_BYTE, c)
        },
        create: function (a) {
            for (var b = [], c = 0; c < a.length; c++) b.push(a[c].image);
            this.createFromImages(b)
        },
        clear: function () {
            this.createFromImages([])
        },
        update: function (a, b, c, d) {
            this.allowImagesInvertion = a;
            this.padding = b;
            c < 100 && (c = 100);
            d < 100 && (d = 100);
            this.width = c;
            this.height = d;
            this.createFromImages(this.images)
        },
        createFromImages: function (a) {
            var b;
            this.scan = new CAAT.GLTextureScanMap(this.width, this.height);
            this.images = [];
            if (this.allowImagesInvertion)
                for (b = 0; b < a.length; b++) a[b].inverted = this.allowImagesInvertion && a[b].height < a[b].width;
            var c = this;
            a.sort(function (a, b) {
                var f = a.width * a.height,
                    g = b.width * b.height;
                if (c.criteria === "width") return a.width < b.width ?
                    1 : a.width > b.width ? -1 : 0;
                else if (c.criteria === "height") return a.height < b.height ? 1 : a.height > b.height ? -1 : 0;
                return f < g ? 1 : f > g ? -1 : 0
            });
            for (b = 0; b < a.length; b++) this.packImage(a[b])
        },
        addImage: function (a, b, c) {
            this.allowImagesInvertion = b;
            this.padding = c;
            this.images.push(a);
            this.createFromImages(Array.prototype.slice.call(this.images))
        },
        endCreation: function () {
            var a = this.gl;
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_NEAREST);
            a.generateMipmap(a.TEXTURE_2D)
        },
        deletePage: function () {
            for (var a = 0; a < this.images.length; a++) delete this.images[a].__texturePage, delete this.images[a].__u, delete this.images[a].__v;
            this.gl.deleteTexture(this.texture)
        },
        toCanvas: function (a, b) {
            a = a || document.createElement("canvas");
            a.width = this.width;
            a.height = this.height;
            var c = a.getContext("2d");
            c.fillStyle = "rgba(0,0,0,0)";
            c.fillRect(0, 0, this.width, this.height);
            for (var d = 0; d < this.images.length; d++) {
                c.drawImage(!this.images[d].inverted ? this.images[d] : CAAT.modules.ImageUtil.prototype.rotate(this.images[d],
                    90), this.images[d].__tx, this.images[d].__ty);
                if (b) c.strokeStyle = "red", c.strokeRect(this.images[d].__tx, this.images[d].__ty, this.images[d].__w, this.images[d].__h);
                if (this.images[d].__gridC && this.images[d].__gridR)
                    for (var e = 0; e < this.images[d].__gridR; e++)
                        for (var f = 0; f < this.images[d].__gridC; f++) c.strokeStyle = "blue", c.strokeRect(this.images[d].__tx + f * this.images[d].__w / this.images[d].__gridC, this.images[d].__ty + e * this.images[d].__h / this.images[d].__gridR, this.images[d].__w / this.images[d].__gridC, this.images[d].__h /
                            this.images[d].__gridR)
            }
            if (b) c.strokeStyle = "red", c.strokeRect(0, 0, this.width, this.height);
            return a
        },
        packImage: function (a) {
            var b, c;
            a.inverted ? (b = a.height, c = a.width) : (b = a.width, c = a.height);
            var d = b,
                e = c,
                f;
            if (d && this.padding) f = this.padding, d + f <= this.width && (d += f);
            if (e && this.padding) f = this.padding, e + f <= this.height && (e += f);
            f = this.scan.whereFitsChunk(d, e);
            null !== f ? (this.images.push(a), a.__tx = f.x, a.__ty = f.y, a.__u = f.x / this.width, a.__v = f.y / this.height, a.__u1 = (f.x + b) / this.width, a.__v1 = (f.y + c) / this.height, a.__texturePage =
                this, a.__w = b, a.__h = c, this.scan.substract(f.x, f.y, d, e)) : CAAT.log("Imagen ", a.src, " de tama\ufffdo ", a.width, a.height, " no cabe.")
        },
        changeHeuristic: function (a) {
            this.criteria = a
        }
    }
})();
(function () {
    CAAT.GLTexturePageManager = function () {
        this.pages = [];
        return this
    };
    CAAT.GLTexturePageManager.prototype = {
        pages: null,
        createPages: function (a, b, c, d) {
            for (var e = false; !e;) {
                e = new CAAT.GLTexturePage(b, c);
                e.create(d);
                e.initialize(a);
                e.endCreation();
                this.pages.push(e);
                for (var e = true, f = 0; f < d.length; f++)
                    if (!d[f].image.__texturePage) {
                        d[f].image.width <= b && d[f].height <= c && (e = false);
                        break
                    }
            }
        },
        deletePages: function () {
            for (var a = 0; a < this.pages.length; a++) this.pages[a].deletePage();
            this.pages = null
        }
    }
})();
var HN = HN || {};
(function () {
    HN.GameModes = {
        classic: {
            fixed_table_size: true,
            rearrange_on_remove: true,
            rows_initial: 8,
            columns_initial: 8,
            rows_max: 8,
            columns_max: 8,
            time_policy: -500,
            minTurnTime: 12E3,
            number_policy: [10, 10, 10, 15, 15, 15, 20, 20, 25, 30, 35, 40, 45, 50],
            name: "classic"
        },
        progressive: {
            fixed_table_size: false,
            rearrange_on_remove: true,
            rows_initial: 3,
            columns_initial: 3,
            rows_max: 8,
            columns_max: 8,
            time_policy: 0,
            number_policy: [10, 10, 10, 10, 10, 15, 15, 15, 15, 20, 25, 30, 35, 40, 45, 50],
            name: "progressive"
        },
        respawn: {
            fixed_table_size: true,
            rearrange_on_remove: true,
            respawn: true,
            respawn_time: 22E3,
            rows_initial: 8,
            columns_initial: 8,
            rows_max: 8,
            columns_max: 8,
            time_policy: -1E3,
            initial_map: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            number_policy: [10, 10, 10, 10, 10, 15, 15, 15, 15, 20, 25, 30, 35, 40, 45, 50],
            name: "respawn"
        }
    }
})();
(function () {
    HN.Brick = function () {
        return this
    };
    HN.Brick.prototype = {
        value: 0,
        color: 0,
        selected: false,
        removed: false,
        row: 0,
        column: 0,
        context: null,
        delegate: null,
        initialize: function (a, b, c, d) {
            this.row = a;
            this.column = b;
            this.selected = false;
            this.removed = d || false;
            this.color = Math.random() * c.getNumberColors() >> 0;
            this.context = c;
            this.respawn()
        },
        changeSelection: function () {
            this.selected = !this.selected;
            this.context.selectionChanged(this)
        },
        respawn: function () {
            this.selected = false;
            this.value = Math.random() > 0.3 ? 4 + Math.random() *
                6 >> 0 : 1 + Math.random() * 3 >> 0;
            if (this.value < 1) this.value = 1;
            else if (this.value > 9) this.value = 9;
            null != this.delegate && this.delegate();
            return this
        }
    }
})();
(function () {
    HN.Context = function () {
        this.eventListener = [];
        return this
    };
    HN.Context.prototype = {
        eventListener: null,
        gameMode: null,
        rows: 0,
        columns: 0,
        numNumberColors: 0,
        initialRows: 0,
        initialColumns: 0,
        currentRows: 0,
        currentColumns: 0,
        initialBricks: 0,
        data: null,
        guessNumber: 0,
        time: 0,
        selectedList: null,
        status: 0,
        level: 0,
        score: 0,
        turnTime: 15E3,
        turnTimes: [2E4, 15E3, 1E4],
        difficulty: 0,
        brickIncrementByDifficulty: [5, 10],
        meters: 0,
        ST_STARTGAME: 5,
        ST_INITIALIZING: 0,
        ST_START_LEVEL: 2,
        ST_RUNNNING: 1,
        ST_LEVEL_RESULT: 3,
        ST_ENDGAME: 4,
        create: function (a, b, c) {
            this.rows = a;
            this.columns = b;
            this.numNumberColors = c;
            this.data = [];
            for (a = 0; a < this.rows; a++) {
                this.data.push([]);
                for (b = 0; b < this.columns; b++) this.data[a].push(new HN.Brick)
            }
            return this
        },
        setGameMode: function (a) {
            if (a != this.gameMode) this.gameMode = a, this.initialRows = a.rows_initial, this.initialColumns = a.columns_initial;
            this.initialize()
        },
        getNumberColors: function () {
            return this.numNumberColors
        },
        initialize: function () {
            this.setStatus(this.ST_STARTGAME);
            this.turnTime = this.turnTimes[this.difficulty];
            this.level = this.score = 0;
            this.setAltitude(0);
            this.currentRows = this.initialRows;
            this.currentColumns = this.initialColumns;
            this.nextLevel();
            return this
        },
        getLevelActiveBricks: function () {
            return this.initialBricks
        },
        prepareBricks: function () {
            var a, b;
            for (a = 0; a < this.rows; a++)
                for (b = 0; b < this.columns; b++) this.data[a][b].initialize(a, b, this, true);
            if (this.gameMode.initial_map) {
                var c = this.gameMode.initial_map;
                for (a = this.initialBricks = 0; a < this.currentRows; a++)
                    for (b = 0; b < this.currentColumns; b++) {
                        var d = true,
                            d = c.length <
                                a ? false : c[a].length < b ? false : c[a][b] == 0;
                        this.data[a][b].initialize(a, b, this, d);
                        d || this.initialBricks++
                    }
            } else {
                this.initialBricks = this.currentRows * this.currentColumns;
                for (a = 0; a < this.currentRows; a++)
                    for (b = 0; b < this.currentColumns; b++) this.data[a][b].initialize(a, b, this, false)
            }
        },
        nextLevel: function () {
            this.level++;
            this.fireEvent("context", "levelchange", this.level);
            this.selectedList = [];
            if (!this.gameMode.fixed_table_size && this.level > 1 && (this.currentRows < this.rows || this.currentColumns < this.columns)) this.currentRows ==
                this.currentColumns ? this.currentColumns++ : this.currentRows++;
            this.prepareBricks();
            this.setStatus(this.ST_INITIALIZING);
            if (this.level > 1 && (this.turnTime -= this.gameMode.time_policy, this.gameMode.minTurnTime && this.turnTime < this.gameMode.minTurnTime)) this.turnTime = this.gameMode.minTurnTime;
            return this
        },
        fireEvent: function (a, b, c) {
            var d;
            for (d = 0; d < this.eventListener.length; d++) this.eventListener[d].contextEvent({
                source: a,
                event: b,
                params: c
            })
        },
        addContextListener: function (a) {
            this.eventListener.push(a);
            return this
        },
        getBrick: function (a, b) {
            return this.data[a][b]
        },
        setStatus: function (a) {
            this.status = a;
            this.fireEvent("context", "status", this.status);
            this.status == this.ST_RUNNNING && this.setGuessNumber()
        },
        selectionChanged: function (a) {
            var b;
            for (b = 0; b < this.selectedList.length; b++)
                if (this.selectedList[b] == a) {
                    this.selectedList.splice(b, 1);
                    this.fireEvent("brick", "selection", a);
                    return
                }
            var c = 0;
            for (b = 0; b < this.selectedList.length; b++) c += this.selectedList[b].value;
            c += a.value;
            if (c > this.guessNumber) {
                a.selected = false;
                a = this.selectedList.slice(0);
                for (b = 0; b < this.selectedList.length; b++) this.selectedList[b].selected = false;
                this.selectedList = [];
                this.fireEvent("brick", "selectionoverflow", a)
            } else if (c == this.guessNumber) {
                this.selectedList.push(a);
                a = this.selectedList.slice(0);
                for (b = 0; b < this.selectedList.length; b++) this.selectedList[b].selected = false, this.selectedList[b].removed = true;
                if (this.gameMode.rearrange_on_remove)
                    for (b = 0; b < this.selectedList.length; b++)
                        for (var c = this.selectedList[b].column, d = this.selectedList[b].row; d > 0; d--) {
                            var e = this.data[d -
                                1][c],
                                f = this.data[d][c],
                                g = e;
                            this.data[d - 1][c] = this.data[d][c];
                            this.data[d][c] = g;
                            g = e.row;
                            e.row = f.row;
                            f.row = g;
                            this.fireEvent("brick", "rearranged", {
                                fromRow: e.row - 1,
                                toRow: e.row,
                                column: c
                            })
                        }
                this.selectedList = [];
                this.fireEvent("brick", "selection-cleared", a);
                this.score += this.multiplier * (a.length + 1) * (this.difficulty == 0 ? 10 : 20) * a.length;
                this.fireEvent("context", "score", this);
                for (b = 0; b < this.rows; b++)
                    for (a = 0; a < this.columns; a++)
                        if (!this.data[b][a].removed) {
                            this.setGuessNumber();
                            return
                        }
                this.setStatus(this.ST_LEVEL_RESULT)
            } else this.selectedList.push(a),
            this.fireEvent("brick", "selection", a), this.setMultipliers()
        },
        setGuessNumber: function () {
            var a = [],
                b, c;
            for (b = 0; b < this.rows; b++)
                for (c = 0; c < this.columns; c++) this.data[b][c].removed || a.push(this.data[b][c]);
            if (a.length > 1)
                for (b = 0; b < a.length; b++) {
                    c = Math.random() * a.length >> 0;
                    var d = a[b];
                    a[b] = a[c];
                    a[c] = d
                }
            c = 0;
            b = this.brickIncrementByDifficulty[this.difficulty];
            d = this.level - 1;
            d >= this.gameMode.number_policy.length && (d = this.gameMode.number_policy.length - 1);
            var d = this.gameMode.number_policy[d],
                e = d + b,
                f = 0;
            if (a.length ==
                1) c = a[0].value;
            else if (a.length == 2) c = a[0].value + a[1].value;
            else {
                for (b = 0; b < a.length; b++)
                    if (c + a[b].value <= e) c += a[b].value, f++;
                    else if (c > d) break;
                f == 1 && (c = a[0].value + a[1].value)
            }
            this.guessNumber = c;
            this.fireEvent("context", "guessnumber", this);
            this.setMultipliers()
        },
        timeUp: function () {
            this.setStatus(this.ST_ENDGAME)
        },
        respawn: function () {
            var a = true,
                b;
            for (b = 0; b < this.currentColumns; b++)
                if (!this.data[0][b].removed) {
                    a = false;
                    break
                }
            if (a) {
                for (var c = [], a = 0; a < this.currentColumns; a++) {
                    for (b = 0; b < this.currentRows; b++)
                        if (!this.data[b][a].removed) break;
                    b--;
                    this.data[b][a].removed = false;
                    this.data[b][a].selected = false;
                    this.data[b][a].respawn();
                    c.push({
                        row: b,
                        column: a
                    })
                }
                this.fireEvent("brick", "respawn", c)
            } else this.setStatus(this.ST_ENDGAME)
        },
        setMultipliers: function () {
            if (this.selectedList && this.selectedList.length > 0) {
                var a = this.selectedList[0].column,
                    b = this.selectedList[0].row,
                    c = 0,
                    d;
                for (d = 1; d < this.selectedList.length; d++) {
                    var e = this.selectedList[d].column,
                        f = this.selectedList[d].row;
                    c += Math.sqrt((e - a) * (e - a) + (f - b) * (f - b));
                    a = e;
                    b = f
                }
                c >>= 0;
                c = 1 + c / 10 >> 0;
                c < 1 ?
                    c = 1 : c > 5 && (c = 5);
                this.multiplier = c
            } else this.multiplier = 0;
            this.fireEvent("context", "multiplier", this)
        },
        incrementAltitude: function (a) {
            this.setAltitude(this.meters + a)
        },
        setAltitude: function (a) {
            this.meters = a;
            this.fireEvent("context", "altitude", this.meters)
        }
    }
})();

function __CAAT__loadingScene(a) {
    var b = a.createScene(),
        c = (new Date).getTime(),
        d = (new CAAT.ActorContainer).setBackgroundImage(a.getImage("splash0"), true).addBehavior((new CAAT.GenericBehavior).setFrameTime(3E3, 0).setValues(1, 0, null, null, function (b, c, d) {
            d.setBackgroundImage(a.getImage("splash1"), true)
        }));
    b.addChild(d);
    var e = (new CAAT.Actor).setBackgroundImage(a.getImage("lading"), true).enableEvents(false);
    e.setLocation(a.width - e.width - 10, a.height - e.height - 30);
    b.addChild(e);
    var f = (new CAAT.Actor).setBackgroundImage(a.getImage("rueda"),
        true).setLocation(e.x + 20, e.y + 10).enableEvents(false);
    b.addChild(f);
    f.addBehavior((new CAAT.RotateBehavior).setValues(0, 2 * Math.PI).setFrameTime(0, 1E3).setCycle(true));
    var g = null,
        g = (new CAAT.SpriteImage).initialize(a.getImage("stars"), 24, 6),
        h = function (c) {
            for (var e = 0; e < 3; e++) {
                var f = Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1) + c.point.x,
                    h = Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1) + c.point.y,
                    o = Math.random() * 6 >> 0,
                    n = new CAAT.Actor;
                n.__imageIndex = o;
                n.setBackgroundImage(g.getRef().setAnimationImageIndex([Math.random() *
                    6 >> 0
                ]), true).setLocation(f, h).setDiscardable(true).enableEvents(false).setFrameTime(b.time, 600).addBehavior((new CAAT.ScaleBehavior).setFrameTime(b.time, 600).setValues(1, 5, 1, 5).setInterpolator((new CAAT.Interpolator).createExponentialInInterpolator(3, false)));
                a.getRenderType() === "CSS" ? n.addBehavior((new CAAT.AlphaBehavior).setFrameTime(b.time, 600).setValues(1, 0.1).setInterpolator((new CAAT.Interpolator).createExponentialInInterpolator(3, false))) : n.addBehavior((new CAAT.GenericBehavior).setFrameTime(b.time,
                    600).setValues(1, 0.1, null, null, function (a, b, c) {
                    c.backgroundImage.setAnimationImageIndex([c.__imageIndex + (23 - (23 * a >> 0)) * c.backgroundImage.getColumns()])
                }));
                d.addChild(n)
            }
        };
    d.mouseMove = h;
    d.mouseDrag = h;
    b.loadedImage = function (d, g) {
        if (d == g) {
            var h = (new Date).getTime() - c;
            h < 6E3 ? (h = Math.abs(6E3 - h), h > 6E3 && (h = 6E3), b.createTimer(b.time, h, function () {
                e.setOutOfFrameTime();
                f.setOutOfFrameTime();
                __end_loading(a)
            })) : __end_loading(a)
        }
    };
    return b
}

function __end_loading(a) {
    a.emptyScenes();
    a.setImagesCache(a.__next_images);
    delete a.__next_images;
    var b = (new HN.GardenScene).create(a, a.getRenderType() === "CANVAS" ? navigator.browser !== "iOS" ? 120 : 0 : 0),
        c = (new HN.GameScene).create(a, HN.GameModes.respawn);
    b.gameScene = c;
    c.addGameListener(b);
    a.easeIn(0, CAAT.Scene.prototype.EASE_TRANSLATE, 1E3, false, CAAT.Actor.prototype.ANCHOR_TOP, (new CAAT.Interpolator).createExponentialInOutInterpolator(5, false))
}

function __Hypernumbers_init() {
    var a;
    a = (new CAAT.Director).initialize(700, 500).setClear(false);
    document.getElementById("game").appendChild(a.canvas);
    HN.director = a;
    var b = a.width > a.height,
        c = typeof __RESOURCE_URL !== "undefined" ? __RESOURCE_URL : "";
    (new CAAT.ImagePreloader).loadImages([{
            id: "stars",
            url: c + "res/img/stars.png"
        }, {
            id: "splash0",
            url: c + (b ? "res/splash/splash0.jpg" : "res/splash/splash0-i.jpg")
        }, {
            id: "splash1",
            url: c + (b ? "res/splash/splash1.jpg" : "res/splash/splash1-i.jpg")
        }, {
            id: "lading",
            url: c + "res/splash/lading.png"
        }, {
            id: "rueda",
            url: c + "res/splash/rueda.png"
        }], function (d, e) {
            if (d == e.length) {
                a.setImagesCache(e);
                var f = __CAAT__loadingScene(a);
                (new CAAT.ImagePreloader).loadImages([{
                    id: "smoke",
                    url: c + "res/img/humo.png"
                }, {
                    id: "stars",
                    url: c + "res/img/stars.png"
                }, {
                    id: "bricks",
                    url: c + "res/img/bricks.png"
                }, {
                    id: "buttons",
                    url: c + "res/img/botones.png"
                }, {
                    id: "numbers",
                    url: c + "res/img/numbers.png"
                }, {
                    id: "numberssmall",
                    url: c + "res/img/numbers_s.png"
                }, {
                    id: "madewith",
                    url: c + "res/img/madewith.png"
                }, {
                    id: "background-1",
                    url: c + "res/img/fondo1.jpg"
                }, {
                    id: "background-2",
                    url: c + (b ? "res/img/fondo2.jpg" : "res/img/fondo2inv.jpg")
                }, {
                    id: "background_op",
                    url: c + "res/img/gameover.png"
                }, {
                    id: "cloud0",
                    url: c + "res/img/nube1.png"
                }, {
                    id: "cloud1",
                    url: c + "res/img/nube2.png"
                }, {
                    id: "cloud2",
                    url: c + "res/img/nube3.png"
                }, {
                    id: "cloud3",
                    url: c + "res/img/nube4.png"
                }, {
                    id: "cloudb0",
                    url: c + "res/img/nubefondo1.png"
                }, {
                    id: "cloudb1",
                    url: c + "res/img/nubefondo2.png"
                }, {
                    id: "cloudb2",
                    url: c + "res/img/nubefondo3.png"
                }, {
                    id: "cloudb3",
                    url: c + "res/img/nubefondo4.png"
                }, {
                    id: "level",
                    url: c + "res/img/level.png"
                }, {
                    id: "level-small",
                    url: c + "res/img/levelsmall.png"
                }, {
                    id: "boton-salir",
                    url: c + "res/img/boton_salir.png"
                }, {
                    id: "points",
                    url: c + "res/img/score.png"
                }, {
                    id: "time",
                    url: c + "res/img/time.png"
                }, {
                    id: "timeprogress",
                    url: c + "res/img/time_progress.png"
                }, {
                    id: "multiplier",
                    url: c + (b ? "res/img/x.png" : "res/img/xsmall.png")
                }, {
                    id: "multiplier-star",
                    url: c + "res/img/multiplicador.png"
                }, {
                    id: "tweet",
                    url: c + "res/img/tweet.png"
                }, {
                    id: "ovni",
                    url: c + "res/img/ovni.png"
                }, {
                    id: "logo",
                    url: c + "res/img/logo_menu.png"
                }, {
                    id: "levelclear",
                    url: c + "res/img/levelcleared.png"
                }, {
                    id: "msg1",
                    url: c + "res/img/7.png"
                }, {
                    id: "msg2",
                    url: c + "res/img/6.png"
                }, {
                    id: "msg3",
                    url: c + "res/img/5.png"
                }, {
                    id: "msg4",
                    url: c + "res/img/4.png"
                }, {
                    id: "msg5",
                    url: c + "res/img/3.png"
                }, {
                    id: "msg6",
                    url: c + "res/img/2.png"
                }, {
                    id: "msg7",
                    url: c + "res/img/1.png"
                }, {
                    id: "info_howto",
                    url: c + "res/img/info.png"
                }, {
                    id: "sound",
                    url: c + "res/img/sound.png"
                }, {
                    id: "mode-respawn",
                    url: c + "res/img/respawn.png"
                }, {
                    id: "mode-progressive",
                    url: c + "res/img/progresive.png"
                }, {
                    id: "mode-classic",
                    url: c + "res/img/normal_mode.png"
                }, {
                    id: "mode-text",
                    url: c + "res/img/textos.png"
                }, {
                    id: "rclock-bg",
                    url: c + "res/img/rclock_bg.png"
                }, {
                    id: "rclock-tick",
                    url: c + "res/img/rclock_tick.png"
                }, {
                    id: "rclock-arrow",
                    url: c + "res/img/rclock_arrow.png"
                }, {
                    id: "bolas",
                    url: c + "res/img/bolas.png"
                }, {
                    id: "info",
                    url: c + (b ? "res/big/about.jpg" : "res/big/about-i.jpg")
                }, {
                    id: "howto",
                    url: c + (b ? "res/big/tutorial.jpg" : "res/big/tutorial-i.jpg")
                }, {
                    id: "target-number",
                    url: c + "res/img/target.png"
                }], function (b, d) {
                    if (b == d.length) a.__next_images = d, a.addAudio("01", c + "res/sound/01.mp3").addAudio("10", c + "res/sound/10.mp3").addAudio("11",
                        c + "res/sound/11.mp3").addAudio("12", c + "res/sound/12.mp3").addAudio("sumamal", c + "res/sound/suma_mal.mp3").addAudio("mostrarpanel", c + "res/sound/mostrarpanel.mp3").addAudio("deseleccionar", c + "res/sound/deseleccionar.mp3").addAudio("music", c + "res/sound/music.mp3");
                    f.loadedImage(b, d.length)
                })
            }
        });
    CAAT.loop(60)
}
window.addEventListener("load", __Hypernumbers_init, false);
(function () {
    HN.Grass = function () {
        return this
    };
    HN.Grass.prototype = {
        alto_hierba: 0,
        maxAngle: 0,
        angle: 0,
        coords: null,
        color: null,
        offset_control_point: 3,
        curve: null,
        initialize: function (a, b, c, d, e, f) {
            a = Math.floor(Math.random() * a);
            this.alto_hierba = c + Math.random() * d;
            this.maxAngle = 10 + Math.random() * e;
            this.angle = Math.random() * f * (Math.random() < 0.5 ? 1 : -1) * Math.PI / 180;
            c = a - 2;
            d = b - this.alto_hierba / 2;
            this.offset_control_point = 10;
            this.coords = [a, b, c, d, c, d, a + this.offset_control_point, b];
            this.color = [16 + Math.floor(Math.random() *
                32), 100 + Math.floor(Math.random() * 155), 16 + Math.floor(Math.random() * 32)]
        },
        paint: function (a, b, c) {
            var d = Math.sin(b * 5.0E-4),
                d = this.angle + Math.PI / 2 + d * Math.PI / 180 * this.maxAngle * Math.cos(b * 2.0E-4),
                b = this.coords[0] + this.offset_control_point + this.alto_hierba * Math.cos(d),
                d = this.coords[1] - this.alto_hierba * Math.sin(d);
            a.beginPath();
            a.moveTo(this.coords[0], this.coords[1]);
            a.bezierCurveTo(this.coords[0], this.coords[1], this.coords[2], this.coords[3], b, d);
            a.bezierCurveTo(b, d, this.coords[4], this.coords[5], this.coords[6],
                this.coords[7]);
            a.closePath();
            a.fillStyle = "rgb(" + Math.floor(this.color[0] * c) + "," + Math.floor(this.color[1] * c) + "," + Math.floor(this.color[2] * c) + ")";
            a.fill()
        },
        paintActorGL: function (a, b, c, d) {
            if (null == this.curve) this.curve = new CAAT.Bezier, this.__polyLine = new Float32Array(66);
            for (var e = Math.sin(b * 5.0E-4), b = this.angle + Math.PI / 2 + e * Math.PI / 180 * this.maxAngle * Math.cos(b * 2.0E-4), e = this.coords[0] + this.offset_control_point + this.alto_hierba * Math.cos(b), f = this.coords[1] - this.alto_hierba * Math.sin(b), b = this.curve.setQuadric(this.coords[0],
                    this.coords[1], this.coords[2], this.coords[3], e, f).getContour(10), e = this.curve.setQuadric(e, f, this.coords[4], this.coords[5], this.coords[6], this.coords[7]).getContour(10), b = b.concat(e), e = 0, f = -a.height / 2, g = 0; g < b.length; g++) d.transformCoord(b[g]), this.__polyLine[e++] = b[g].x, this.__polyLine[e++] = b[g].y, this.__polyLine[e++] = f;
            a.glTextureProgram.drawPolylines(this.__polyLine, b.length, Math.floor(this.color[0] * c) / 255, Math.floor(this.color[1] * c) / 255, Math.floor(this.color[2] * c) / 255, 1, 3)
        }
    }
})();
(function () {
    HN.Garden = function () {
        HN.Garden.superclass.constructor.call(this);
        return this
    };
    HN.Garden.prototype = {
        grass: null,
        ambient: 1,
        stars: null,
        firefly_radius: 10,
        num_fireflyes: 40,
        num_stars: 512,
        fireflyColor: ["#ffff00", "#7fff00", "#c0c000"],
        backgroundEnabled: false,
        initialize: function (a, b, c) {
            this.grass = [];
            for (var d = 0; d < b; d++) {
                var e = new HN.Grass;
                e.initialize(this.width, this.height, 50, c, 20, 40);
                this.grass.push(e)
            }
            this.stars = [];
            for (d = 0; d < this.num_stars; d++) this.stars.push(Math.floor(Math.random() * (this.width -
                10) + 5)), this.stars.push(Math.floor(Math.random() * (this.height - 10) + 5));
            this.backgroundEnabled && this.lerp(a, 0, 2E3);
            return this
        },
        paint: function (a, b) {
            var c = a.ctx,
                d;
            if (this.backgroundEnabled) {
                c.fillStyle = this.gradient;
                c.fillRect(0, 0, this.width, this.height);
                if (this.ambient < 0.3) {
                    c.globalAlpha = 1 - (this.ambient - 0.05) / 0.25;
                    d = Math.floor(192 * (1 - (this.ambient / 2 - 0.05) / 0.25));
                    c.strokeStyle = "rgb(" + d + "," + d + "," + d + ")";
                    for (d = this.num_fireflyes * 2; d < this.stars.length; d += 2) {
                        var e = 1;
                        d % 3 == 0 ? e = 1.5 : d % 11 == 0 && (e = 2.5);
                        this.stars[d] =
                            (this.stars[d] + 0.1 * e) % this.width;
                        c.strokeRect(this.stars[d], this.stars[d + 1], 1, 1)
                    }
                }
                c.globalAlpha = 1
            }
            for (d = 0; d < this.num_fireflyes * 2; d += 2) {
                c.fillStyle = this.fireflyColor[d % 3];
                var e = Math.PI * 2 * Math.sin(b * 3.0E-4) + d * Math.PI / 50,
                    f = this.firefly_radius * Math.cos(b * 3.0E-4),
                    g = this.height - this.height * 0.3 + 0.5 * this.stars[d + 1] + 20 * Math.sin(b * 3.0E-4) + f * Math.sin(e);
                g < a.height && (c.beginPath(), c.arc(this.width / 2 + 0.5 * this.stars[d] + 150 * Math.cos(b * 3.0E-4) + (f + 20 * Math.cos(d % 5 * Math.PI / 3600)) * Math.cos(e), g, 2, 0, Math.PI * 2, false),
                    c.fill())
            }
            for (d = 0; d < this.grass.length; d++) this.grass[d].paint(c, b, this.ambient);
            if (this.backgroundEnabled && b > this.nextLerpTime) this.lerpindex = Math.floor((b - this.nextLerpTime) / this.nextLerpTime), (b - this.nextLerpTime) % this.nextLerpTime < this.lerpTime && this.lerp(c, (b - this.nextLerpTime) % this.nextLerpTime, this.lerpTime)
        },
        gradient: null,
        lerpTime: 1E4,
        nextLerpTime: 15E3,
        colors: [
            [0, 63, 127, 0, 63, 127, 31, 95, 192, 63, 160, 255],
            [0, 63, 127, 160, 95, 127, 255, 144, 224, 255, 144, 0],
            [0, 63, 127, 0, 47, 127, 0, 40, 80, 0, 31, 63],
            [0, 63, 127,
                63, 47, 160, 160, 31, 31, 255, 127, 0
            ]
        ],
        ambients: [1, 0.35, 0.05, 0.5],
        lerpindex: 0,
        lerp: function (a, b, c) {
            this.gradient = a.createLinearGradient(0, 0, 0, this.height);
            for (var a = this.lerpindex % this.colors.length, d = (this.lerpindex + 1) % this.colors.length, e = 0; e < 4; e++) {
                for (var f = "rgb(", g = 0; g < 3; g++) f += Math.floor((this.colors[d][e * 3 + g] - this.colors[a][e * 3 + g]) * b / c + this.colors[a][e * 3 + g]), g < 2 && (f += ",");
                f += ")";
                this.gradient.addColorStop(e / 3, f)
            }
            this.ambient = (this.ambients[d] - this.ambients[a]) * b / c + this.ambients[a]
        }
    };
    extend(HN.Garden,
        CAAT.Actor)
})();
(function () {
    HN.Cloud = function () {
        HN.Cloud.superclass.constructor.call(this);
        return this
    };
    HN.Cloud.prototype = {
        scene: null,
        setupBehavior: function (a, b) {
            this.setBackgroundImage(a.getImage("cloudb" + (4 * Math.random() >> 0)), true);
            var c = this,
                d, e, f;
            Math.random();
            var g = a.width;
            e = a.height;
            d = this.backgroundImage.width;
            var h = 4E4 + Math.random() * 2E4;
            b ? (d = Math.random() * a.width >> 0, e = Math.random() * a.height >> 0, h *= (g - d) / g) : (d = -d + -d * 2 * Math.random(), e = e * Math.random() / 2);
            f = e + 50 * Math.random() / 2;
            this.emptyBehaviorList();
            this.addBehavior((new CAAT.PathBehavior).setFrameTime(this.time,
                h).setPath((new CAAT.Path).setLinear(d, e, g, f)).addListener({
                behaviorExpired: function () {
                    c.setupBehavior(a, false)
                }
            }));
            return this
        }
    };
    extend(HN.Cloud, CAAT.Actor)
})();
(function () {
    HN.ScoreItem = function () {
        return this
    };
    HN.ScoreItem.prototype = {
        score: 0,
        level: 0,
        mode: "",
        date: "",
        initialize: function (a, b, c) {
            this.score = a;
            this.level = b;
            this.mode = c;
            a = new Date;
            this.date = "" + a.getFullYear() + "/" + this.pad(1 + a.getMonth()) + "/" + this.pad(a.getDate());
            return this
        },
        pad: function (a) {
            a = "" + a;
            a.length == 1 && (a = "0" + a);
            return a
        }
    };
    HN.Scores = function () {
        return this
    };
    HN.Scores.prototype = {
        maxScoreRows: 10,
        scores: null,
        initialize: function () {
            var a = 0,
                b;
            if (null != this.scores) {
                a = this.scores.length;
                for (b = 0; b <
                    a; b++) this.setDOM(b + "_1", this.scores[b].score), this.setDOM(b + "_2", this.scores[b].level), this.setDOM(b + "_3", this.scores[b].mode), this.setDOM(b + "_4", this.scores[b].date)
            } else this.scores = [];
            for (b = a; b < 10; b++)
                for (a = 1; a <= 4; a++) this.setDOM(b + "_" + a, "");
            return this
        },
        setDOM: function (a, b) {
            var c = document.getElementById(a);
            if (null != c) c.innerHTML = b;
            return this
        },
        addScore: function (a, b, c) {
            for (; this.scores.length >= this.maxScoreRows;) this.scores.splice(this.scores.length - 1, 1);
            for (var d = 0, d = 0; d < this.scores.length; d++)
                if (a >
                    this.scores[d].score) break;
            this.scores.splice(d, 0, (new HN.ScoreItem).initialize(a, b, c));
            CAAT.modules.LocalStorage.prototype.save("sumon_scores_1", this.scores);
            this.initialize();
            return this
        },
        setData: function () {
            this.scores = CAAT.modules.LocalStorage.prototype.load("sumon_scores_1");
            return this
        }
    }
})();
(function () {
    HN.GardenScene = function () {
        if (CAAT.browser !== "iOS") this.scores = (new HN.Scores).setData().initialize();
        return this
    };
    HN.GardenScene.prototype = {
        gameScene: null,
        directorScene: null,
        director: null,
        buttonImage: null,
        scores: null,
        music: null,
        sound: null,
        createModeButtons: function () {
            function a(a) {
                var e = (new CAAT.SpriteImage).initialize(b.director.getImage("mode-text"), 1, 3).setAnimationImageIndex([a]),
                    k = (new CAAT.ActorContainer).create().setBounds(g + f * a, b.director.width > b.director.height ? b.director.height /
                        2 - 10 : b.director.height / 2 - 100, Math.max(c[a].singleWidth, e.singleWidth), c[a].singleWidth + e.singleHeight),
                    l = (new CAAT.Actor).setAsButton(c[a], 0, 1, 2, 0, function () {
                        b.director.audioPlay("11");
                        b.startGame(b.director, 0, d[a])
                    }).setBounds((k.width - c[a].singleWidth) / 2, 0, c[a].singleWidth, c[a].singleHeight),
                    e = (new CAAT.Actor).setBackgroundImage(e).setBounds((k.width - e.singleWidth) / 2, l.height, e.singleWidth, e.singleHeight);
                k.addChild(l);
                k.addChild(e);
                return k
            }
            var b = this,
                c = [];
            c.push((new CAAT.SpriteImage).initialize(b.director.getImage("mode-classic"),
                1, 3));
            c.push((new CAAT.SpriteImage).initialize(b.director.getImage("mode-progressive"), 1, 3));
            c.push((new CAAT.SpriteImage).initialize(b.director.getImage("mode-respawn"), 1, 3));
            var d = [HN.GameModes.classic, HN.GameModes.progressive, HN.GameModes.respawn],
                e, f = 0;
            for (e = 0; e < c.length; e++) f = Math.max(f, c[e].singleWidth);
            f += 20;
            var g = (b.director.width - f * c.length) / 2 + 10;
            this.directorScene.addChild(a(0));
            this.directorScene.addChild(a(1));
            this.directorScene.addChild(a(2))
        },
        create: function (a, b) {
            a.audioLoop("music");
            this.director = a;
            this.directorScene = a.createScene();
            var c = a.width,
                d = a.height,
                e = this;
            this.directorScene.activated = function () {
                e.prepareSound()
            };
            var f = a.getImage("background-2");
            this.directorScene.addChild((new CAAT.Actor).setBounds(0, 0, c, d).setBackgroundImage(f));
            for (k = 0; k < 5; k++) this.directorScene.addChild((new HN.Cloud).setupBehavior(a, true).setLocation(c / 5 * k + c / 5 * Math.random(), d / 3 * Math.random()));
            var g = (new CAAT.ActorContainer).create().setBounds(0, 0, c, d);
            this.directorScene.addChild(g);
            var f = (new CAAT.SpriteImage).initialize(a.getImage("ovni"),
                1, 2),
                h;
            h = (new CAAT.SpriteImage).initialize(a.getImage("smoke"), 32, 1);
            var j = 1E3;
            a.glEnabled && (j = 6E3);
            for (var k = 0; k < 2; k++) {
                var l = Math.random() * c,
                    m = Math.random() * d;
                this.directorScene.addChild((new CAAT.Actor).setBackgroundImage(f.getRef().setAnimationImageIndex([1 - k]), true).setLocation(l, m).enableEvents(false).addBehavior((new CAAT.PathBehavior).setFrameTime(0, 0).setPath((new CAAT.Path).setLinear(l, m, l, m)).addListener({
                    prevTime: -1,
                    smokeTime: j,
                    nextSmokeTime: 100,
                    behaviorExpired: function (b) {
                        var c = b.path.endCurvePosition();
                        b.setPath((new CAAT.Path).setCubic(c.x, c.y, Math.random() * a.width, Math.random() * a.height, Math.random() * a.width, Math.random() * a.height, Math.random() * a.width, Math.random() * a.height));
                        b.setFrameTime(e.directorScene.time, 3E3 + Math.random() * 3E3)
                    },
                    behaviorApplied: function (a, b, c, d) {
                        if (-1 == this.prevTime || b - this.prevTime >= this.nextSmokeTime) a = Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1), c = Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1), d = (new CAAT.Actor).setBackgroundImage(h.getRef().setAnimationImageIndex([0]), true).setLocation(a +
                            d.x + d.width / 2 - h.singleWidth / 2, c + d.y + d.height / 2 - h.singleHeight / 2).setDiscardable(true).enableEvents(false).setFrameTime(b, this.smokeTime).addBehavior((new CAAT.ScaleBehavior).setFrameTime(b, this.smokeTime).setValues(0.5, 1.5, 0.5, 1.5)), d.addBehavior((new CAAT.GenericBehavior).setFrameTime(b, this.smokeTime).setValues(1, 0, null, null, function (a, b, c) {
                            c.setAnimationImageIndex([31 - (a * 31 >> 0)])
                        })), g.addChild(d), this.prevTime = b
                    }
                })))
            }
            b > 0 && this.directorScene.addChild((new HN.Garden).create().setBounds(0, 0, c, d).initialize(a.ctx,
                b, d * 0.5));
            this.buttonImage = (new CAAT.SpriteImage).initialize(a.getImage("buttons"), 7, 3);
            var j = (new CAAT.SpriteImage).initialize(a.getImage("info_howto"), 2, 3),
                k = j.singleWidth,
                l = j.singleHeight,
                o = (new CAAT.Actor).setBackgroundImage((new CAAT.SpriteImage).initialize(a.getImage("info"), 1, 1), true).setOutOfFrameTime().setAlpha(0.9);
            o.mouseClick = function () {
                o.emptyBehaviorList().setFrameTime(e.directorScene.time, Number.MAX_VALUE).addBehavior((new CAAT.PathBehavior).setFrameTime(e.directorScene.time, 1E3).setValues((new CAAT.Path).setLinear(o.x,
                    0, -700, 0)).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator(false)).addListener({
                    behaviorExpired: function () {
                        o.setOutOfFrameTime()
                    }
                }))
            };
            this.soundControls(a);
            var f = (new CAAT.Actor).setAsButton(j.getRef(), 0, 1, 2, 0, function () {
                a.audioPlay("11");
                o.emptyBehaviorList().setFrameTime(e.directorScene.time, Number.MAX_VALUE).addBehavior((new CAAT.PathBehavior).setFrameTime(e.directorScene.time, 1E3).setValues((new CAAT.Path).setLinear(-700, 0, 0, 0)).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator(false)))
            }).setBounds(10,
                d - 10 - l, k, l),
                n = (new CAAT.Actor).setBackgroundImage((new CAAT.SpriteImage).initialize(a.getImage("howto"), 1, 1), true).setOutOfFrameTime().setAlpha(0.9);
            n.mouseClick = function () {
                n.emptyBehaviorList().setFrameTime(e.directorScene.time, Number.MAX_VALUE).addBehavior((new CAAT.PathBehavior).setFrameTime(e.directorScene.time, 1E3).setValues((new CAAT.Path).setLinear(n.x, 0, 700, 0)).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator(false)).addListener({
                    behaviorExpired: function () {
                        n.setOutOfFrameTime()
                    }
                }))
            };
            d = (new CAAT.Actor).setAsButton(j.getRef(), 3, 4, 5, 3, function () {
                a.audioPlay("11");
                n.emptyBehaviorList().setFrameTime(e.directorScene.time, Number.MAX_VALUE).addBehavior((new CAAT.PathBehavior).setFrameTime(e.directorScene.time, 1E3).setValues((new CAAT.Path).setLinear(700, 0, 0, 0)).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator(false)))
            }).setBounds(10, d - 10 - l - l - 5, k, l);
            a.width < a.height && CAAT.modules.LayoutUtils.row(this.directorScene, [f, d], {
                padding_left: 195,
                padding_right: 195,
                top: a.height / 2 + 100
            });
            this.createModeButtons();
            this.directorScene.addChild(f);
            this.directorScene.addChild(d);
            f = a.getImage("logo");
            d = (new CAAT.Actor).setBackgroundImage(f).setFrameTime(1500, Number.MAX_VALUE).enableEvents(false);
            a.width < a.height && d.setBackgroundImage(f, false).setSize(f.width * 0.8, f.height * 0.8).setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
            f = (c - d.width) / 2;
            d.addBehavior((new CAAT.PathBehavior).setPath((new CAAT.LinearPath).setInitialPosition(f, -d.height).setFinalPosition(f, -10)).setFrameTime(1500,
                1E3).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator(false)));
            this.directorScene.addChild(d);
            d = new CAAT.Actor;
            f = (new CAAT.SpriteImage).initialize(a.getImage("madewith"), 1, 3);
            CAAT.browser !== "iOS" ? d.setAsButton(f, 0, 1, 2, 0, function () {
                window.open("http://labs.hyperandroid.com", "Hyperandroid")
            }) : d.setBackgroundImage(f, true);
            d.setLocation(c - (a.width > a.height ? 100 : f.singleWidth), 0);
            this.directorScene.addChild(d);
            this.directorScene.addChild(o);
            this.directorScene.addChild(n);
            return this
        },
        soundControls: function (a) {
            var b = (new CAAT.SpriteImage).initialize(a.getImage("sound"), 2, 3),
                c = a.width,
                d = (new CAAT.Actor).setAsButton(b.getRef(), 0, 1, 0, 0, function (b) {
                    a.setMusicEnabled(!a.audioManager.isMusicEnabled());
                    a.isMusicEnabled() ? b.setButtonImageIndex(0, 1, 0, 0) : b.setButtonImageIndex(2, 2, 2, 2)
                }).setBounds(c - b.singleWidth - 2, 2, b.singleWidth, b.singleHeight),
                b = (new CAAT.Actor).setAsButton(b.getRef(), 3, 4, 3, 3, function (b) {
                    a.setSoundEffectsEnabled(!a.audioManager.isSoundEffectsEnabled());
                    a.isSoundEffectsEnabled() ?
                        b.setButtonImageIndex(3, 4, 3, 3) : b.setButtonImageIndex(5, 5, 5, 5)
                }).setBounds(c - b.singleWidth - 2, 4 + b.singleHeight, b.singleWidth, b.singleHeight);
            d.prepare = function () {
                a.audioManager.isMusicEnabled() ? this.setButtonImageIndex(0, 1, 0, 0) : this.setButtonImageIndex(2, 2, 2, 2)
            };
            b.prepare = function () {
                a.audioManager.isSoundEffectsEnabled() ? this.setButtonImageIndex(3, 4, 3, 3) : this.setButtonImageIndex(5, 5, 5, 5)
            };
            this.directorScene.addChild(b);
            this.directorScene.addChild(d);
            a.width < a.height && CAAT.modules.LayoutUtils.row(this.directorScene, [d, b], {
                padding_left: 195,
                padding_right: 195,
                top: a.height / 2 + 150
            });
            this.music = d;
            this.sound = b
        },
        prepareSound: function () {
            try {
                this.sound.prepare(), this.music.prepare()
            } catch (a) {}
        },
        startGame: function (a, b, c) {
            this.gameScene.setDifficulty(b);
            this.gameScene.prepareSceneIn(c);
            a.easeInOut(1, CAAT.Scene.EASE_TRANSLATE, CAAT.Actor.prototype.ANCHOR_TOP, 0, CAAT.Scene.EASE_TRANSLATE, CAAT.Actor.prototype.ANCHOR_BOTTOM, 1E3, false, (new CAAT.Interpolator).createExponentialInOutInterpolator(3, false), (new CAAT.Interpolator).createExponentialInOutInterpolator(3,
                false))
        },
        gameEvent: function (a, b) {
            CAAT.browser !== "iOS" && this.scores.addScore(b.score, b.level, b.gameMode)
        }
    }
})();
(function () {
    HN.BrickActor = function () {
        HN.BrickActor.superclass.constructor.call(this);
        this.sb = (new CAAT.ScaleBehavior).setFrameTime(-1, 0).setValues(1, 1);
        this.addBehavior(this.sb);
        this.rb = (new CAAT.RotateBehavior).setFrameTime(-1, 0).setValues(0, 0);
        this.addBehavior(this.rb);
        this.pb = (new CAAT.PathBehavior).setFrameTime(-1, 0);
        this.addBehavior(this.pb);
        this.ab = (new CAAT.AlphaBehavior).setFrameTime(-1, 0).setValues(1);
        this.addBehavior(this.ab);
        return this
    };
    HN.BrickActor.status = {
        REGULAR: 0,
        FALLING: 1,
        CLEARED: 2
    };
    HN.BrickActor.prototype = {
        timeOver: 250,
        timeSelection: 1E3,
        timeRespawn: 1500,
        timeRearrange: 1500,
        timeOverflow: 200,
        timeCleared: 800,
        brick: null,
        status: 0,
        ab: null,
        sb: null,
        rb: null,
        pb: null,
        initialize: function (a, b) {
            this.setSize(a.singleWidth, a.singleHeight);
            this.setBackgroundImage(a.getRef(), true);
            this.brick = b;
            var c = this;
            b.delegate = function () {
                c.setSpriteIndex(c.brick.value + a.columns * c.brick.color)
            };
            return this
        },
        setStatus: function (a) {
            this.status = a;
            return this
        },
        mouseEnter: function () {
            this.brick.selected || (this.parent.setZOrder(this,
                Number.MAX_VALUE), this.sb.setFrameTime(this.time, this.timeOver).setValues(1, 1.2, 1, 1.2).setPingPong(), CAAT.browser !== "iOS" && CAAT.setCursor("pointer"))
        },
        mouseExit: function () {
            CAAT.browser !== "iOS" && CAAT.setCursor("default")
        },
        mouseDown: function () {
            this.brick.changeSelection()
        },
        toString: function () {
            return "HN.Brick " + this.brick.row + "," + this.brick.column
        },
        reset: function () {
            this.resetAlpha().resetRotate().resetScale().resetTransform();
            this.alpha = 1;
            return this
        },
        resetBehavior: function (a, b, c) {
            a.emptyListenerList();
            a.setCycle(false);
            a.setInterpolator((new CAAT.Interpolator).createLinearInterpolator());
            a.setFrameTime(-1, 0);
            b && c && a.setValues(b, c)
        },
        resetAlpha: function () {
            this.resetBehavior(this.ab, 1, 1);
            return this
        },
        resetScale: function () {
            this.resetBehavior(this.sb, 1, 1);
            return this
        },
        resetRotate: function () {
            this.resetBehavior(this.rb, 0, 2 * Math.PI);
            return this
        },
        resetPath: function () {
            this.resetBehavior(this.pb);
            return this
        },
        resetBehaviors: function () {
            this.resetAlpha();
            this.resetScale();
            this.resetRotate();
            this.resetPath();
            return this
        },
        setSelected: function () {
            this.sb.setValues(1, 0.65, 1, 0.65).setFrameTime(this.time, this.timeSelection).setPingPong().setCycle(true);
            this.ab.setValues(0.75, 0.25).setFrameTime(this.time, this.timeSelection).setPingPong().setCycle(true)
        },
        set: function () {
            this.status = HN.BrickActor.status.REGULAR;
            this.enableEvents(true);
            this.reset()
        },
        respawn: function (a, b) {
            this.reset().enableEvents(true).setFrameTime(this.time, Number.MAX_VALUE).resetTransform().setAlpha(1).setStatus(HN.BrickActor.status.FALLING);
            this.pb.emptyListenerList().setFrameTime(this.time, this.timeRespawn + this.brick.row * 50).setPath((new CAAT.LinearPath).setInitialPosition(a, -this.height - (Math.random() * 100 >> 0)).setFinalPosition(a, b)).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator()).addListener({
                behaviorApplied: function () {},
                behaviorExpired: function (a, b, e) {
                    e.setStatus(HN.BrickActor.status.REGULAR)
                }
            })
        },
        rearrange: function (a, b) {
            this.status !== HN.BrickActor.status.CLEARED && (this.setStatus(HN.BrickActor.status.FALLING),
                this.pb.emptyListenerList().setFrameTime(this.time + this.brick.column * 50, this.timeRearrange).setPath((new CAAT.LinearPath).setInitialPosition(this.x, this.y).setFinalPosition(a, b)).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator()).addListener({
                    behaviorApplied: function () {},
                    behaviorExpired: function (a, b, e) {
                        e.setStatus(HN.BrickActor.status.REGULAR)
                    }
                }))
        },
        selectionOverflow: function () {
            if (this.status === HN.BrickActor.status.REGULAR) {
                var a = Math.random() < 0.5 ? 1 : -1;
                this.pb.emptyListenerList().setFrameTime(this.time,
                    this.timeOverflow).setPath((new CAAT.Path).beginPath(this.x, this.y).addLineTo(this.x + a * (5 + 5 * Math.random()), this.y).addLineTo(this.x - a * (5 + 5 * Math.random()), this.y).endPath()).setPingPong()
            }
        },
        selectionCleared: function (a, b) {
            this.setStatus(HN.BrickActor.status.CLEARED);
            var c = Math.random() < 0.5 ? 1 : -1,
                d = 50 + Math.random() * 30;
            this.enableEvents(false).setScale(1.5, 1.5);
            this.pb.emptyListenerList().setFrameTime(this.time, this.timeCleared).setPath((new CAAT.Path).beginPath(this.x, this.y).addQuadricTo(this.x + d * c,
                this.y - 300, this.x + d * c * 2, this.y + b + 20).endPath()).addListener({
                behaviorExpired: function (a, b, c) {
                    c.setExpired(true)
                },
                behaviorApplied: function (b, c, d, h) {
                    for (b = 0; b < (CAAT.browser === "iOS" ? 1 : 3); b++)
                        if (c = Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1), d = Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1), a.fallingStarCache.length > 0) {
                            var j = a.fallingStarCache.shift();
                            j.domParent || (j.setAnimationImageIndex([Math.random() * 6 >> 0]).setFrameTime(h.time, 400).setLocation(c + h.x + h.width / 2, d + h.y), j.__parent.addChild(j), j.__sb.setFrameTime(h.time,
                                400))
                        }
                }
            }).setInterpolator((new CAAT.Interpolator).createLinearInterpolator(false, false));
            this.rb.setFrameTime(this.time, this.timeCleared).setValues(0, (Math.PI + Math.random() * Math.PI * 2) * (Math.random() < 0.5 ? 1 : -1));
            this.ab.setFrameTime(this.time, this.timeCleared).setValues(1, 0.25)
        }
    };
    extend(HN.BrickActor, CAAT.Actor)
})();
(function () {
    HN.RespawnClockActor = function () {
        HN.RespawnClockActor.superclass.constructor.call(this);
        this.ticks = [];
        return this
    };
    HN.RespawnClockActor.prototype = {
        ticks: null,
        respawnTime: 1E4,
        scene: null,
        context: null,
        arrow: null,
        enabled: false,
        initialize: function (a, b, c) {
            this.scene = b;
            this.context = c;
            var b = a.getImage("rclock-tick"),
                c = (new CAAT.SpriteImage).initialize(b, 16, 1),
                d = a.getImage("rclock-bg"),
                a = a.getImage("rclock-arrow"),
                e = this;
            this.setSize(64, 64);
            this.addChild((new CAAT.Actor).setBackgroundImage(d, true).setLocation((this.width -
                d.width) / 2, (this.height - d.height) / 2));
            for (d = 0; d < 12; d++) {
                var f = (new CAAT.Actor).setBackgroundImage(c.getRef(), true).setLocation(this.width / 2 + 29 * Math.cos(-Math.PI / 2 + d * 2 * Math.PI / 12) - b.width / 2, this.height / 2 + 29 * Math.sin(-Math.PI / 2 + d * 2 * Math.PI / 12) - b.width / 2);
                this.addChild(f);
                this.ticks.push(f);
                var g = (new CAAT.ContainerBehavior).setOutOfFrameTime().addBehavior((new CAAT.ScaleBehavior).setFrameTime(d * this.respawnTime / 12, 300).setValues(1, 3, 1, 3));
                g.addBehavior((new CAAT.GenericBehavior).setFrameTime(d * this.respawnTime /
                    12, 300).setValues(1, 0, null, null, function (a, b, c) {
                    c.setAnimationImageIndex([15 - (a * 15 >> 0)])
                }));
                f.addBehavior(g)
            }
            b = (new CAAT.Actor).setBackgroundImage(a, true);
            b.setLocation((this.width - b.width) / 2, this.height / 2 - 23 - 0.5);
            this.addChild(b);
            b.addBehavior((new CAAT.RotateBehavior).setOutOfFrameTime().setValues(0, 2 * Math.PI, 50, 23 / b.height * 100).addListener({
                behaviorExpired: function () {
                    e.resetTimer();
                    e.context.respawn()
                },
                behaviorApplied: function () {}
            }));
            this.arrow = b;
            return this
        },
        resetTimer: function () {
            for (var a = this.ticks.length,
                    b = 0; b < a; b++) this.ticks[b].resetTransform().setAnimationImageIndex([0]), this.ticks[b].behaviorList[0].setFrameTime(this.scene.time, this.respawnTime), this.ticks[b].behaviorList[0].behaviors[0].setFrameTime(b * this.respawnTime / a, 300), this.ticks[b].behaviorList[0].behaviors[1].setFrameTime(b * this.respawnTime / a, 300);
            this.arrow.behaviorList[0].setFrameTime(this.scene.time, this.respawnTime)
        },
        stopTimer: function () {
            for (var a = 0; a < this.ticks.length; a++) this.ticks[a].resetTransform(), this.ticks[a].behaviorList[0].setOutOfFrameTime();
            this.arrow.behaviorList[0].setOutOfFrameTime()
        },
        contextEvent: function (a) {
            this.enabled && a.event == "status" && (a.params == HN.Context.prototype.ST_RUNNNING ? this.resetTimer() : this.stopTimer())
        },
        enable: function (a, b) {
            this.respawnTime = b;
            (this.enabled = a) ? this.setFrameTime(0, Number.MAX_VALUE) : this.setOutOfFrameTime()
        }
    };
    extend(HN.RespawnClockActor, CAAT.ActorContainer)
})();
(function () {
    HN.GuessNumberActor = function () {
        HN.GuessNumberActor.superclass.constructor.call(this);
        this.actors = [];
        this.setGlobalAlpha(true);
        return this
    };
    HN.GuessNumberActor.prototype = {
        guessNumber: 0,
        numbersImage: null,
        offsetX: 0,
        offsetY: 0,
        numbers: null,
        tmpnumbers: null,
        container: null,
        actors: null,
        setNumbersImage: function (a, b) {
            this.setBackgroundImage(b);
            this.numbersImage = a;
            this.container = (new CAAT.ActorContainer).setBounds(10, 0, this.width, this.height);
            this.addChild(this.container);
            this.offsetX = (this.width -
                2 * (a.singleWidth - 30)) / 2;
            this.offsetY = 10 + (this.height - a.singleHeight) / 2;
            for (var c = 0; c < 2; c++) {
                var d = (new CAAT.Actor).setBackgroundImage(a.getRef(), true).setLocation(this.offsetX, this.offsetY).setVisible(false);
                this.actors.push(d);
                this.container.addChild(d).setGlobalAlpha(true)
            }
            return this
        },
        contextEvent: function (a) {
            var b;
            if (a.source == "context")
                if (a.event == "guessnumber") {
                    var c = this;
                    c.guessNumber = a.params.guessNumber;
                    c.numbers = [];
                    var d = c.guessNumber.toString();
                    d.length === 1 && (d = "0" + d);
                    c.offsetX = 10;
                    c.offsetY =
                        (c.height - c.numbersImage.singleHeight) / 2;
                    for (b = 0; b < d.length; b++) c.numbers[b] = parseInt(d.charAt(b)), this.actors[b].setLocation(c.offsetX + b * (c.numbersImage.singleWidth - 30), this.actors[b].y), this.actors[b].setVisible(true);
                    if (null == c.tmpnumbers) {
                        for (b = 0; b < d.length; b++) this.actors[b].setAnimationImageIndex([this.numbers[b]]);
                        this.container.emptyBehaviorList();
                        this.container.addBehavior((new CAAT.AlphaBehavior).setFrameTime(this.time, 250).setValues(0, 1).setId(1E3));
                        c.tmpnumbers = c.numbers
                    } else this.container.emptyBehaviorList(),
                    this.container.addBehavior((new CAAT.AlphaBehavior).setFrameTime(this.time, 250).setValues(1, 0).addListener({
                        behaviorExpired: function (a, f, g) {
                            for (b = 0; b < d.length; b++) c.actors[b].setAnimationImageIndex([c.numbers[b]]);
                            g.emptyBehaviorList();
                            g.addBehavior((new CAAT.AlphaBehavior).setFrameTime(c.time, 250).setValues(0, 1))
                        },
                        behaviorApplied: function () {}
                    }))
                } else if (a.event == "status" && a.params != HN.Context.prototype.ST_RUNNNING) this.tmpnumbers = this.numbers = null
        }
    };
    extend(HN.GuessNumberActor, CAAT.ActorContainer,
        null)
})();
(function () {
    HN.Chrono = function () {
        HN.Chrono.superclass.constructor.call(this);
        this.actorventana = new CAAT.Actor;
        this.actorcrono = (new CAAT.Actor).setLocation(14, 18);
        this.addChild(this.actorcrono);
        this.addChild(this.actorventana);
        return this
    };
    HN.Chrono.prototype = {
        maxTime: 0,
        elapsedTime: 0,
        actorventana: null,
        actorcrono: null,
        progressHole: 160,
        setImages: function (a, b) {
            this.actorventana.setBackgroundImage(a, true);
            this.actorcrono.setBackgroundImage(b, true);
            this.setSize(this.actorventana.width, this.actorventana.height);
            this.actorcrono.setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
            return this
        },
        animate: function (a, b) {
            this.actorcrono.setSize(this.progressHole - (this.maxTime != 0 ? this.elapsedTime / this.maxTime * this.progressHole : 0), this.actorcrono.height);
            return HN.Chrono.superclass.animate.call(this, a, b)
        },
        tick: function (a, b) {
            this.maxTime = b;
            this.elapsedTime = a
        },
        contextEvent: function (a) {
            if (a.source == "context" && a.event == "status" && a.params == HN.Context.prototype.ST_ENDGAME) this.maxTime = 0, this.elapsedTime = 1E3
        }
    };
    extend(HN.Chrono, CAAT.ActorContainer)
})();
(function () {
    HN.SelectionPath = function (a) {
        HN.SelectionPath.superclass.constructor.call(this);
        this.coords = [];
        this.particles = [];
        this.fillStyle = null;
        this.bolasImage = (new CAAT.SpriteImage).initialize(a.getImage("bolas"), 1, 8);
        this.director = a;
        return this
    };
    HN.SelectionPath.prototype = {
        coords: null,
        path: null,
        pathMeasure: null,
        particles: null,
        particlesPerSegment: 10,
        traversingPathTime: 3E3,
        context: null,
        bolasImage: null,
        director: null,
        initialize: function () {
            this.coords = [];
            this.pathMeasure = this.path = null
        },
        setup: function (a,
            b) {
            this.context = a;
            this.brickActors = b;
            this.coords = [];
            if (0 == a.selectedList.length) this.initialize();
            else {
                var c = this.particlesPerSegment * (a.selectedList.length - 1);
                if (this.particles.length > c) this.particles.splice(c, this.particles.length - c);
                else
                    for (; this.particles.length < c;) this.particles.push(a.selectedList.length * this.traversingPathTime + this.traversingPathTime * Math.random())
            }
        },
        setupPath: function () {
            this.coords = [];
            if (this.context.selectedList.length) {
                for (i = 0; i < this.context.selectedList.length; i++) {
                    var a =
                        this.context.selectedList[i],
                        a = this.brickActors[a.row][a.column];
                    this.coords.push({
                        x: a.x + a.width / 2,
                        y: a.y + a.height / 2
                    })
                }
                this.path = new CAAT.Path;
                this.path.beginPath(this.coords[0].x, this.coords[0].y);
                for (i = 1; i < this.context.selectedList.length; i++) this.path.addLineTo(this.coords[i].x, this.coords[i].y);
                this.path.endPath();
                this.pathMeasure = (new CAAT.PathBehavior).setPath(this.path).setFrameTime(0, this.traversingPathTime * this.context.selectedList.length).setCycle(true)
            }
        },
        paint: function (a, b) {
            if (null != this.context &&
                0 != this.context.selectedList.length) {
                var c;
                this.setupPath();
                var d = a.ctx;
                d.beginPath();
                for (c = 0; c < this.coords.length; c++) d.lineTo(this.coords[c].x, this.coords[c].y);
                d.strokeStyle = "#ffff00";
                d.lineCap = "round";
                d.lineJoin = "round";
                for (c = 2; c <= (CAAT.browser === "iOS" ? 2 : 8); c += 2) d.lineWidth = c, d.globalAlpha = 0.5 - c / 8 / 3, d.stroke();
                if (this.pathMeasure)
                    for (c = 0; c < this.particles.length; c++) d = this.pathMeasure.positionOnTime((this.particles[c] + b) * (1 + c % 3 * 0.33)), this.bolasImage.setSpriteIndex(c % 8), this.bolasImage.paint(a,
                        0, d.x - 4, d.y - 4)
            }
        },
        contextEvent: function () {},
        paintActorGL: function (a, b) {
            if (null != this.context && 0 != this.context.selectedList.length && (this.setupPath(), !(null == this.coords || 0 == this.coords.length))) {
                a.glFlush();
                var c, d = 0,
                    e = new CAAT.Point,
                    f = this.worldModelViewMatrix;
                for (c = 0; c < this.coords.length; c++) e.set(this.coords[c].x, this.coords[c].y, 0), f.transformCoord(e), a.coords[d++] = e.x, a.coords[d++] = e.y, a.coords[d++] = 0;
                for (c = 2; c <= 8; c += 2) a.glTextureProgram.drawPolylines(a.coords, this.coords.length, 1, 1, 0, 0.5 - c / 8 /
                    3, c);
                for (c = d = 0; c < this.particles.length; c++) ppos = this.pathMeasure.positionOnTime((this.particles[c] + b) * (1 + c % 3 * 0.33)), e.set(ppos.x, ppos.y, 0), f.transformCoord(e), a.coords[d++] = e.x - 3, a.coords[d++] = e.y - 3, a.coords[d++] = 0, a.coords[d++] = e.x + 3, a.coords[d++] = e.y + 3, a.coords[d++] = 0;
                a.glTextureProgram.drawLines(a.coords, this.particles.length, 1, 1, 1, 0.3, 7)
            }
        }
    };
    extend(HN.SelectionPath, CAAT.Actor)
})();
(function () {
    HN.ScoreActor = function () {
        HN.ScoreActor.superclass.constructor.call(this);
        return this
    };
    HN.ScoreActor.prototype = {
        numDigits: 6,
        incrementScore: 0,
        maxScore: 0,
        minScore: 0,
        currentScore: 0,
        numbers: null,
        startTime: 0,
        interpolator: null,
        scoreDuration: 2E3,
        font: null,
        FONT_CORRECTION: 0.6,
        reset: function () {
            this.currentScore = this.minScore = this.maxScore = this.currentScore = 0;
            this.setScore()
        },
        initialize: function (a, b) {
            var c;
            this.font = a;
            this.interpolator = (new CAAT.Interpolator).createExponentialInOutInterpolator(2,
                false);
            this.setBackgroundImage(b, true);
            for (c = 0; c < this.numDigits; c++) this.addChild((new CAAT.Actor).setBackgroundImage(a.getRef(), true).setLocation((this.width - this.numDigits * this.font.singleWidth * this.FONT_CORRECTION) / 2 + c * this.font.singleWidth * this.FONT_CORRECTION - 5, 12).setScale(this.FONT_CORRECTION, this.FONT_CORRECTION));
            return this
        },
        contextEvent: function (a) {
            if (a.source == "context") a.event == "score" ? (this.maxScore = a.params.score, this.minScore = this.currentScore, this.incrementScore = this.maxScore - this.minScore,
                this.startTime = this.time) : a.event == "status" && a.params == HN.Context.prototype.ST_STARTGAME && this.reset()
        },
        setScore: function () {
            this.currentScore >>= 0;
            for (var a = "" + this.currentScore; a.length < 6;) a = "0" + a;
            this.numbers = [];
            for (var b = 0, b = 0; b < a.length; b++) this.numbers[b] = parseInt(a.charAt(b)), this.childrenList[b].setAnimationImageIndex([this.numbers[b]])
        },
        animate: function (a, b) {
            if (b >= this.startTime && b < this.startTime + this.scoreDuration) this.currentScore = this.minScore + this.incrementScore * this.interpolator.getPosition((b -
                this.startTime) / this.scoreDuration).y, this.setScore(a);
            else if (this.currentScore != this.maxScore) this.currentScore = this.maxScore, this.setScore(a);
            return HN.ScoreActor.superclass.animate.call(this, a, b)
        }
    };
    extend(HN.ScoreActor, CAAT.ActorContainer)
})();
(function () {
    HN.AnimatedBackground = function () {
        HN.AnimatedBackground.superclass.constructor.call(this);
        return this
    };
    HN.AnimatedBackground.prototype = {
        timer: null,
        context: null,
        scene: null,
        altitude: 0.05,
        altitudeMeterByIncrement: 2,
        currentAltitude: 0,
        initialOffset: 0,
        currentOffset: 0,
        setData: function (a, b) {
            this.context = b;
            this.scene = a;
            return this
        },
        contextEvent: function (a) {
            var b = this;
            if (a.source == "context")
                if (a.event == "status")
                    if (a.params == HN.Context.prototype.ST_ENDGAME) {
                        if (this.timer != null) this.timer.cancel(),
                        this.timer = null, this.currentOffset = this.backgroundImage.offsetY, this.addBehavior((new CAAT.GenericBehavior).setFrameTime(this.scene.time, 1E3).setValues(this.currentOffset, this.initialOffset, null, null, function (a) {
                            b.setBackgroundImageOffset(0, a)
                        }).setInterpolator((new CAAT.Interpolator).createBounceOutInterpolator(false))), b.currentAltitude = b.initialOffset
                    } else a.params == HN.Context.prototype.ST_LEVEL_RESULT && this.timer.cancel();
                    else a.event == "levelchange" && this.startTimer()
        },
        startTimer: function () {
            var a =
                this;
            if (!this.timer) this.timer = this.scene.createTimer(a.scene.time, 200, function (b, c, d) {
                a.currentAltitude += a.altitude;
                if (a.currentAltitude > 0) a.currentAltitude = 0;
                a.setBackgroundImageOffset(0, a.currentAltitude);
                d.reset(a.scene.time);
                a.context.incrementAltitude(a.altitudeMeterByIncrement)
            }, null, null)
        },
        setInitialOffset: function (a) {
            this.setBackgroundImageOffset(0, a);
            this.currentAltitude = this.initialOffset = a;
            return this
        },
        caer: function (a) {
            this.setBackgroundImageOffset(0, this.currentOffset + (this.initialOffset -
                this.currentOffset) * a)
        }
    };
    extend(HN.AnimatedBackground, CAAT.Actor)
})();
(function () {
    HN.BackgroundImage = function () {
        HN.BackgroundImage.superclass.constructor.call(this);
        return this
    };
    HN.BackgroundImage.prototype = {
        setupBehavior: function (a, b) {
            var c = Math.random() < 0.4;
            this.setBackgroundImage(a.getImage("cloud" + (c ? "b" : "") + (4 * Math.random() >> 0)), true);
            var c = 3E4 * (c ? 1.5 : 1) + Math.random() * 1E4,
                d = this,
                e, f, g, h;
            f = a.width;
            g = a.height - 200;
            h = this.backgroundImage.width;
            b ? (e = f * Math.random(), g *= Math.random(), c *= (f - e) / f) : (e = -h - h * Math.random(), g *= Math.random());
            f += h * Math.random();
            h = g + Math.random() *
                30;
            this.emptyBehaviorList();
            this.addBehavior((new CAAT.PathBehavior).setFrameTime(this.time, c).setPath((new CAAT.Path).setLinear(e, g, f, h)).addListener({
                behaviorExpired: function () {
                    d.setupBehavior(a, false)
                },
                behaviorApplied: function () {}
            }));
            return this
        }
    };
    extend(HN.BackgroundImage, CAAT.Actor)
})();
(function () {
    HN.LevelActor = function () {
        HN.LevelActor.superclass.constructor.call(this);
        this.numbers = [];
        return this
    };
    HN.LevelActor.prototype = {
        font: null,
        numbers: null,
        initialize: function (a, b) {
            this.font = a;
            for (var c = 0; c < 2; c++) {
                var d = (new CAAT.Actor).setBackgroundImage(a.getRef(), true).setVisible(false);
                this.numbers.push(d);
                this.addChild(d)
            }
            this.setBackgroundImage(b, true);
            return this
        },
        contextEvent: function (a) {
            if (a.source == "context" && a.event == "levelchange") {
                this.level = a.params;
                var a = this.level.toString(),
                    b, c, d = this.font.singleWidth * 0.8;
                for (b = 0; b < a.length; b++) c = parseInt(a.charAt(b)), this.numbers[b].setSpriteIndex(c).setLocation((this.width - a.length * d) / 2 + b * d, 24).setVisible(true);
                for (; b < this.numbers.length; b++) this.numbers[b].setVisible(false)
            }
        }
    };
    extend(HN.LevelActor, CAAT.ActorContainer)
})();
(function () {
    HN.MultiplierActor = function () {
        HN.MultiplierActor.superclass.constructor.call(this);
        this.actorx = (new CAAT.Actor).setVisible(false);
        this.actornum = new CAAT.Actor;
        this.addChild(this.actorx);
        this.addChild(this.actornum);
        return this
    };
    HN.MultiplierActor.prototype = {
        actorx: null,
        actornum: null,
        multiplier: 0,
        setImages: function (a, b) {
            this.actorx.setBackgroundImage(b, true);
            this.actornum.setBackgroundImage(a, true).setVisible(false);
            var c = (this.width - b.width - a.singleWidth) / 2 + 10;
            this.actorx.setLocation(c,
                this.height - b.height + 5);
            this.actornum.setLocation(c + b.width, 0);
            return this
        },
        hideMultiplier: function () {
            this.multiplier = 0;
            this.actornum.setVisible(false);
            this.actorx.setVisible(false)
        },
        b1: function (a) {
            a.emptyBehaviorList();
            var b = (new CAAT.ContainerBehavior).setFrameTime(this.time, 1E3).setCycle(true),
                c = (new CAAT.AlphaBehavior).setFrameTime(0, 1E3).setValues(0.6, 0.8).setPingPong();
            b.addBehavior(c);
            a.addBehavior(b)
        },
        b2: function (a) {
            var b = this;
            a.emptyBehaviorList();
            var c = (new CAAT.AlphaBehavior).setFrameTime(this.time,
                300).setValues(this.alpha, 0).addListener({
                behaviorExpired: function () {
                    b.hideMultiplier()
                },
                behaviorApplied: function () {}
            });
            a.addBehavior(c)
        },
        contextEvent: function (a) {
            if (a.source == "context") a.event == "multiplier" ? a.params.multiplier > 1 ? (this.multiplier = a.params.multiplier, this.actornum.setVisible(true).setAnimationImageIndex([this.multiplier]), this.actorx.setVisible(true), this.emptyBehaviorList(), this.addBehavior((new CAAT.ScaleBehavior).setFrameTime(this.time, 1E3).setValues(0.9, 1.1, 0.9, 1.1).setPingPong().setCycle(true)),
                this.b1(this.actorx), this.b1(this.actornum)) : (this.emptyBehaviorList(), this.b2(this.actorx), this.b2(this.actornum)) : a.event == "status" && a.params == HN.Context.prototype.ST_ENDGAME && this.hideMultiplier()
        }
    };
    extend(HN.MultiplierActor, CAAT.ActorContainer)
})();
(function () {
    HN.MultiplierActorS = function () {
        HN.MultiplierActorS.superclass.constructor.call(this);
        this.star = new CAAT.Actor;
        this.container = new CAAT.ActorContainer;
        this.actorx = new CAAT.Actor;
        this.actornum = new CAAT.Actor;
        this.addChild(this.star);
        this.addChild(this.container);
        this.container.addChild(this.actorx);
        this.container.addChild(this.actornum);
        this.container.setGlobalAlpha(true);
        return this
    };
    HN.MultiplierActorS.prototype = {
        actorx: null,
        actornum: null,
        star: null,
        multiplier: 0,
        setImages: function (a, b, c,
            d) {
            this.scene = d;
            this.setOutOfFrameTime();
            this.star.setBackgroundImage(c);
            c = this.star.width / 2;
            this.actorx.setBackgroundImage(b, false).setBounds(0, (this.star.height - c) / 2, c, c).setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
            this.actornum.setBackgroundImage(a, true).setScale(0.4, 0.4).setLocation(0, -20);
            this.setSize(this.star.width, this.star.height);
            this.container.setSize(this.star.width, this.star.height);
            this.container.setRotation(Math.PI / 16);
            this.star.setLocation(0, 0);
            return this
        },
        hideMultiplier: function () {
            this.multiplier = 0;
            this.setOutOfFrameTime()
        },
        b1: function (a) {
            a.emptyBehaviorList();
            var b = (new CAAT.ContainerBehavior).setFrameTime(this.scene.time, 1E3).setCycle(true),
                c = (new CAAT.AlphaBehavior).setFrameTime(0, 1E3).setValues(0.8, 1).setPingPong(),
                d = (new CAAT.ScaleBehavior).setFrameTime(0, 1E3).setValues(0.8, 1, 0.8, 1).setPingPong();
            b.addBehavior(c);
            b.addBehavior(d);
            a.addBehavior(b)
        },
        b2: function (a) {
            var b = this;
            a.emptyBehaviorList();
            var c = (new CAAT.AlphaBehavior).setFrameTime(this.time,
                300).setValues(this.alpha, 0).addListener({
                behaviorExpired: function () {
                    b.hideMultiplier()
                },
                behaviorApplied: function () {}
            });
            a.addBehavior(c)
        },
        contextEvent: function (a) {
            if (a.source == "context") a.event == "multiplier" ? a.params.multiplier > 1 ? (this.multiplier = a.params.multiplier, this.actornum.setAnimationImageIndex([this.multiplier]), this.setFrameTime(0, Number.MAX_VALUE), this.emptyBehaviorList(), this.star.addBehavior((new CAAT.RotateBehavior).setFrameTime(this.time, 1E3).setValues(0, Math.PI * 2).setCycle(true)),
                this.b1(this.container)) : (this.emptyBehaviorList(), this.b2(this.container)) : a.event == "status" && a.params == HN.Context.prototype.ST_ENDGAME && this.hideMultiplier()
        }
    };
    extend(HN.MultiplierActorS, CAAT.ActorContainer)
})();
(function () {
    HN.GameScene = function () {
        this.gameListener = [];
        return this
    };
    HN.GameScene.prototype = {
        gameRows: 15,
        gameColumns: 20,
        context: null,
        directorScene: null,
        selectionPath: null,
        bricksContainer: null,
        brickActors: null,
        particleContainer: null,
        selectionStarCache: null,
        fallingStarCache: null,
        brickWidth: 0,
        brickHeight: 0,
        buttonImage: null,
        starsImage: null,
        numbersImage: null,
        numbersImageSmall: null,
        levelActor: null,
        chronoActor: null,
        timer: null,
        scrollTimer: null,
        scoreActor: null,
        respawnClock: null,
        scoreActorEG: null,
        levelActorEG: null,
        endGameActor: null,
        endLevelActor: null,
        endLevelMessage: null,
        director: null,
        actorInitializationCount: 0,
        backgroundContainer: null,
        music: null,
        sound: null,
        gameListener: null,
        create: function (a) {
            var b = this,
                c, d;
            this.director = a;
            this.bricksImageAll = (new CAAT.SpriteImage).initialize(a.getImage("bricks"), 9, 10);
            this.brickWidth = this.bricksImageAll.singleWidth;
            this.brickHeight = this.bricksImageAll.singleHeight;
            this.buttonImage = (new CAAT.SpriteImage).initialize(a.getImage("buttons"), 7, 3);
            this.starsImage = (new CAAT.SpriteImage).initialize(a.getImage("stars"),
                24, 6);
            this.numbersImage = (new CAAT.SpriteImage).initialize(a.getImage("numbers"), 1, 10);
            this.numbersImageSmall = (new CAAT.SpriteImage).initialize(a.getImage("numberssmall"), 1, 10);
            this.context = (new HN.Context).create(8, 8, 9).addContextListener(this);
            this.gameRows = this.context.rows;
            this.gameColumns = this.context.columns;
            this.directorScene = a.createScene();
            this.directorScene.activated = function () {
                b.context.setGameMode(b.gameMode);
                b.prepareSound()
            };
            var e = a.width,
                f = a.height;
            this.backgroundContainer = (new HN.AnimatedBackground).setBounds(0,
                0, e, f).setBackgroundImage(a.getImage("background-1")).setInitialOffset(-a.getImage("background-1").height + f).setData(this.directorScene, this.context);
            this.directorScene.addChild(this.backgroundContainer);
            this.context.addContextListener(this.backgroundContainer);
            this.brickActors = [];
            for (c = 0; c < 4; c++) this.directorScene.addChild((new HN.BackgroundImage).setupBehavior(a, true));
            this.bricksContainer = (new CAAT.ActorContainer).create().setSize(this.gameColumns * this.brickWidth, this.gameRows * this.brickHeight);
            c = e > f ? 10 : f - this.brickHeight * this.gameRows - 105;
            var g = e > f ? c + 15 : (e - this.gameColumns * this.brickWidth) / 2;
            this.bricksContainer.setLocation(g, c);
            this.directorScene.addChild(this.bricksContainer);
            for (c = 0; c < this.gameRows; c++) {
                this.brickActors.push([]);
                for (d = 0; d < this.gameColumns; d++) {
                    var h = (new HN.BrickActor).initialize(this.bricksImageAll, this.context.getBrick(c, d)).setLocation(-100, -100);
                    this.brickActors[c].push(h);
                    this.bricksContainer.addChild(h)
                }
            }
            c = new CAAT.ActorContainer;
            e > f ? c.setBounds(this.bricksContainer.x +
                this.bricksContainer.width + g + 10, -15, e - g - (this.bricksContainer.x + this.bricksContainer.width) - g, this.director.height - 40) : c.setBounds(0, 0, e, this.bricksContainer.y - 5);
            this.directorScene.addChild(c);
            var j = new CAAT.Actor;
            e > f ? j.setAsButton(this.buttonImage.getRef(), 9, 10, 11, 9, function () {
                b.context.timeUp()
            }).setLocation((c.width - this.buttonImage.singleWidth) / 2 - 15, c.height - this.buttonImage.singleHeight - 15) : j.setAsButton((new CAAT.SpriteImage).initialize(a.getImage("boton-salir"), 1, 3), 0, 2, 0, 0, function () {
                b.context.timeUp()
            }).setLocation(0,
                0);
            j.contextEvent = function (a) {
                a.source == "context" && (a.event == "levelchange" ? j.enableEvents(true) : a.event == "status" && (a.params == HN.Context.prototype.ST_STARTGAME ? j.enableEvents(true) : (a.params == HN.Context.prototype.ST_ENDGAME || a.params == HN.Context.prototype.ST_LEVEL_RESULT) && j.enableEvents(false)))
            };
            this.context.addContextListener(j);
            c.addChild(j);
            g = (new HN.GuessNumberActor).setNumbersImage(this.numbersImage, a.getImage("target-number"));
            e > f ? g.setLocation(-15, 20, c.width, 70) : g.setLocation(10, 55, c.width,
                70);
            this.context.addContextListener(g);
            c.addChild(g);
            this.scoreActor = (new HN.ScoreActor).initialize(this.numbersImageSmall, a.getImage("points"));
            e > f ? this.scoreActor.setLocation(0, 250) : this.scoreActor.setLocation(e - this.scoreActor.width - 10, 55);
            c.addChild(this.scoreActor);
            this.context.addContextListener(this.scoreActor);
            this.chronoActor = (new HN.Chrono).setImages(a.getImage("time"), a.getImage("timeprogress"));
            e > f ? this.chronoActor.setLocation(0, 310) : this.chronoActor.setLocation(e - this.chronoActor.width -
                10, g.y + g.height - this.chronoActor.height - 15);
            this.context.addContextListener(this.chronoActor);
            c.addChild(this.chronoActor);
            this.levelActor = (new HN.LevelActor).initialize(this.numbersImageSmall, e > f ? a.getImage("level") : a.getImage("level-small"));
            e > f ? this.levelActor.setLocation(0, 170) : this.levelActor.setLocation((this.scoreActor.x - (g.x + g.width) - this.levelActor.width) / 2 + (g.x + g.width), g.y + g.height - this.levelActor.height - 10);
            this.context.addContextListener(this.levelActor);
            c.addChild(this.levelActor);
            g =
                a.getImage("multiplier-star");
            g = (new HN.MultiplierActorS).setLocation(this.scoreActor.x + this.scoreActor.width - g.width * 0.8, this.scoreActor.y - g.height * 0.3).setImages(this.numbersImage, a.getImage("multiplier"), g, this.directorScene);
            c.addChild(g);
            this.context.addContextListener(g);
            this.particleContainer = (new CAAT.ActorContainer).create().setBounds(this.bricksContainer.x, this.bricksContainer.y, e, f).enableEvents(false);
            this.directorScene.addChild(this.particleContainer);
            this.selectionPath = (new HN.SelectionPath(a)).setBounds(this.bricksContainer.x,
                this.bricksContainer.y, this.gameColumns * this.brickWidth, this.gameRows * this.brickHeight);
            this.selectionPath.enableEvents(false);
            this.directorScene.addChild(this.selectionPath);
            this.context.addContextListener(this.selectionPath);
            this.create_respawntimer(a);
            e > f ? this.respawnClock.setLocation(2, 2) : this.respawnClock.setLocation(this.levelActor.x + (this.levelActor.width - this.respawnClock.width) / 2, this.levelActor.y - this.respawnClock.height);
            this.create_EndGame(a);
            this.create_EndLevel(a);
            this.soundControls(a);
            this.create_cache();
            return this
        },
        create_cache: function () {
            this.selectionStarCache = [];
            this.fallingStarCache = [];
            var a, b, c;
            c = this;
            for (a = 0; a < 64; a++) b = this.createSelectionStarCache(), b.addListener({
                actorLifeCycleEvent: function (a, b) {
                    b === "destroyed" && c.selectionStarCache.push(a)
                }
            }), b.__parent = this.particleContainer, this.selectionStarCache.push(b);
            for (a = 0; a < 384; a++) b = this.createCachedStar(), b.addListener({
                actorLifeCycleEvent: function (a, b) {
                    b === "destroyed" && c.fallingStarCache.push(a)
                }
            }), b.__parent = this.particleContainer,
            this.fallingStarCache.push(b)
        },
        createCachedStar: function () {
            var a = Math.random() * this.starsImage.columns >> 0,
                b = new CAAT.Actor;
            b.__imageIndex = a;
            b.setBackgroundImage(this.starsImage.getRef().setAnimationImageIndex([a]), true).enableEvents(false).setDiscardable(true).setOutOfFrameTime();
            a = (new CAAT.GenericBehavior).setFrameTime(this.directorScene.time, 0).setValues(1, 0, null, null, function (a, b, e) {
                e.setAnimationImageIndex([e.__imageIndex + (23 - (23 * a >> 0)) * e.backgroundImage.columns])
            });
            b.__sb = a;
            b.addBehavior(a);
            return b
        },
        createSelectionStarCache: function () {
            var a = this.createCachedStar(),
                b = (new CAAT.PathBehavior).setFrameTime(this.directorScene.time, 0).setPath((new CAAT.LinearPath).setInitialPosition(0, 0).setFinalPosition(0, 0)).setInterpolator((new CAAT.Interpolator).createExponentialOutInterpolator(2, false));
            a.__trb = b;
            a.addBehavior(b);
            return a
        },
        create_respawntimer: function (a) {
            a = (new HN.RespawnClockActor).create().initialize(a, this.directorScene, this.context);
            this.directorScene.addChild(a);
            this.context.addContextListener(a);
            this.respawnClock = a;
            this.respawnClock.setOutOfFrameTime()
        },
        create_EndLevel: function (a) {
            this.endLevelActor = (new CAAT.ActorContainer).setBackgroundImage(a.getImage("levelclear"), true);
            var b = this,
                c = (new CAAT.Actor).setAsButton(this.buttonImage.getRef(), 12, 13, 14, 12, function () {
                    a.audioPlay("11");
                    b.removeGameEvent(b.endLevelActor, function () {
                        b.context.nextLevel()
                    })
                });
            c.setLocation((this.endLevelActor.width - c.width) / 2, this.endLevelActor.height - c.height - 50);
            this.endLevelMessage = (new CAAT.Actor).setBackgroundImage(a.getImage("msg1"),
                true);
            this.endLevelActor.addChild(c);
            this.endLevelActor.addChild(this.endLevelMessage);
            this.endLevelActor.setOutOfFrameTime();
            this.directorScene.addChild(this.endLevelActor)
        },
        create_EndGame: function (a) {
            var b = this;
            this.endGameActor = (new CAAT.ActorContainer).setBackgroundImage(a.getImage("background_op"), true);
            var c = (new CAAT.Actor).setAsButton(this.buttonImage.getRef(), 15, 16, 17, 15, function () {
                a.audioPlay("11");
                b.endGameActor.enableEvents(false);
                a.easeInOut(0, CAAT.Scene.EASE_TRANSLATE, CAAT.Actor.prototype.ANCHOR_BOTTOM,
                    1, CAAT.Scene.EASE_TRANSLATE, CAAT.Actor.prototype.ANCHOR_TOP, 1E3, false, (new CAAT.Interpolator).createExponentialInOutInterpolator(3, false), (new CAAT.Interpolator).createExponentialInOutInterpolator(3, false))
            }),
                d = (new CAAT.Actor).setAsButton(this.buttonImage.getRef(), 12, 13, 14, 12, function () {
                    a.audioPlay("11");
                    b.removeGameEvent(b.endGameActor, function () {
                        b.prepareSceneIn(b.context.gameMode);
                        b.context.initialize()
                    })
                });
            if (CAAT.browser !== "iOS") var e = (new CAAT.SpriteImage).initialize(a.getImage("tweet"), 1,
                3),
            f = (new CAAT.Actor).setAsButton(e, 0, 1, 2, 0, function () {
                window.open("http://twitter.com/home/?status=Wow! I just scored " + b.context.score + " points (mode " + b.context.gameMode.name + ") in Sumon. Beat that! http://labs.hyperandroid.com/static/sumon/sumon.html", "blank", "")
            });
            var g = this.endGameActor.height - 35 - c.height;
            c.setLocation(45, g);
            d.setLocation(45 + c.width + 10, g);
            this.endGameActor.addChild(c);
            this.endGameActor.addChild(d);
            c = [c, d];
            CAAT.browser !== "iOS" ? (f.setLocation(375, this.endGameActor.height - 25 - e.height),
                this.endGameActor.addChild(f), c.push(f)) : CAAT.modules.LayoutUtils.row(this.endGameActor, c, {
                padding_left: 50,
                padding_right: 50,
                top: g
            });
            this.levelActorEG = (new HN.LevelActor).initialize(this.numbersImageSmall, a.getImage("level"));
            this.levelActorEG.setBounds((this.endGameActor.width - this.levelActorEG.width) / 2, 265, this.levelActorEG.width, this.levelActorEG.height);
            this.endGameActor.addChild(this.levelActorEG);
            this.context.addContextListener(this.levelActorEG);
            this.scoreActorEG = (new HN.ScoreActor).create().setBounds((this.endGameActor.width -
                this.scoreActor.width) / 2, 335, this.scoreActor.width, this.scoreActor.height).initialize(this.numbersImageSmall, a.getImage("points"));
            this.endGameActor.addChild(this.scoreActorEG);
            this.context.addContextListener(this.scoreActorEG);
            this.endGameActor.setOutOfFrameTime();
            this.directorScene.addChild(this.endGameActor)
        },
        getBrickPosition: function (a, b) {
            return {
                x: (this.context.columns - this.context.currentColumns) / 2 * this.brickWidth + b * this.brickWidth,
                y: (this.context.rows - this.context.currentRows) / 2 * this.brickHeight + a * this.brickHeight
            }
        },
        uninitializeActors: function () {
            this.selectionPath.initialize();
            var a, b, c = Math.max(this.director.width, this.director.height),
                d = Math.PI * 2 * Math.random(),
                e = Math.random() * this.director.width,
                f = Math.random() * this.director.height,
                g = Math.random() * this.director.width,
                h = Math.random() * this.director.height;
            for (a = 0; a < this.gameRows; a++)
                for (b = 0; b < this.gameColumns; b++) {
                    var j = this.brickActors[a][b];
                    if (!j.brick.removed) {
                        var k = Math.random() * 1E3;
                        j.pb.emptyListenerList().setFrameTime(this.directorScene.time,
                            1E3 + k).setPath((new CAAT.CurvePath).setCubic(j.x, j.y, e, f, g, h, c / 2 + Math.cos(d) * c, c / 2 + Math.sin(d) * c)).setInterpolator((new CAAT.Interpolator).createExponentialInOutInterpolator(3, false));
                        j.sb.emptyListenerList().setFrameTime(this.directorScene.time, 1E3 + k).setValues(1, 0.1, 1, 0.1).setInterpolator((new CAAT.Interpolator).createExponentialInOutInterpolator(3, false));
                        j.enableEvents(false).setAlpha(1).resetTransform()
                    }
                }
        },
        initializeActors: function () {
            this.selectionPath.initialize();
            var a, b, c = Math.max(this.director.width,
                    this.director.height),
                d = Math.PI * 2 * Math.random(),
                e = this,
                f = Math.random() * this.director.width,
                g = Math.random() * this.director.height,
                h = Math.random() * this.director.width,
                j = Math.random() * this.director.height;
            for (a = 0; a < this.gameRows; a++)
                for (b = 0; b < this.gameColumns; b++) {
                    var k = this.brickActors[a][b];
                    if (k.brick.removed) k.setOutOfFrameTime();
                    else {
                        k.setFrameTime(this.directorScene.time, Number.MAX_VALUE).setAlpha(1).enableEvents(true).reset();
                        var l = Math.random() * 1E3 >> 0,
                            m = this.getBrickPosition(a, b);
                        k.pb.emptyListenerList().setPath((new CAAT.CurvePath).setCubic(c /
                            2 + Math.cos(d) * c, c / 2 + Math.sin(d) * c, f, g, h, j, m.x, m.y)).setInterpolator((new CAAT.Interpolator).createExponentialInOutInterpolator(3, false)).setFrameTime(this.directorScene.time, 1E3 + l);
                        k.sb.emptyListenerList().setValues(0.1, 1, 0.1, 1).setInterpolator((new CAAT.Interpolator).createExponentialInOutInterpolator(3, false)).setFrameTime(this.directorScene.time, 1E3 + l);
                        k.enableEvents(false);
                        var o = 0;
                        k.pb.addListener({
                            behaviorExpired: function () {
                                o++;
                                o == e.context.getLevelActiveBricks() && (k.pb.emptyListenerList(), e.context.status ==
                                    e.context.ST_INITIALIZING && e.context.setStatus(e.context.ST_RUNNNING))
                            }
                        })
                    }
                }
            this.actorInitializationCount = 0
        },
        contextEvent: function (a) {
            var b, c = this;
            if (a.source == "context")
                if (a.event == "levelchange") this.bricksContainer.enableEvents(true);
                else {
                    if (a.event == "status")
                        if (a.params == this.context.ST_INITIALIZING) this.director.audioPlay("mostrarpanel"), this.initializeActors();
                        else if (a.params == this.context.ST_RUNNNING) {
                        for (a = 0; a < this.gameRows; a++)
                            for (b = 0; b < this.gameColumns; b++) this.brickActors[a][b].set();
                        this.cancelTimer();
                        this.enableTimer()
                    } else a.params == this.context.ST_LEVEL_RESULT ? (this.director.audioPlay("10"), this.cancelTimer(), c = this, this.directorScene.createTimer(this.directorScene.time, 1E3, function () {
                        c.endLevel()
                    }, null)) : a.params == this.context.ST_ENDGAME && (this.director.audioPlay("01"), this.endGame())
                } else a.source === "brick" && (a.event === "selection" ? (this.director.audioPlay(a.params.selected ? "11" : "deseleccionar"), this.brickSelectionEvent(a)) : a.event === "selectionoverflow" ? (this.director.audioPlay("sumamal"),
                    this.selectionOverflowEvent(a)) : a.event === "selection-cleared" ? (CAAT.setCursor("default"), this.director.audioPlay("12"), this.selectionClearedEvent(a)) : a.event === "rearranged" ? this.rearrange(a) : a.event === "respawn" && this.respawn(a), this.selectionPath.setup(this.context, this.brickActors))
        },
        respawn: function (a) {
            for (var a = a.params, b = 0; b < a.length; b++) {
                var c = a[b].row,
                    d = a[b].column,
                    e = this.getBrickPosition(c, d);
                this.brickActors[c][d].respawn(e.x, e.y)
            }
        },
        rearrange: function (a) {
            var b = a.params.fromRow,
                c = a.params.toRow,
                a = a.params.column,
                d = this.brickActors[b][a];
            this.brickActors[b][a] = this.brickActors[c][a];
            this.brickActors[c][a] = d;
            b = this.brickActors[c][a];
            c = this.getBrickPosition(c, a);
            b.rearrange(c.x, c.y)
        },
        brickSelectionEvent: function (a) {
            var b = a.params,
                a = this.brickActors[b.row][b.column];
            if (b.selected) {
                var b = a.x + a.width / 2 - this.starsImage.singleWidth / 2,
                    c = a.y + a.height / 2 - this.starsImage.singleHeight / 2,
                    d = Math.sqrt(a.width * a.width + a.height * a.height) / 2,
                    e, f = Math.PI / 16 * 2;
                for (e = 0; e < 16; e++) {
                    var g = b + d * Math.cos(e * f),
                        h = c + d * Math.sin(e *
                            f);
                    if (this.selectionStarCache.length) {
                        var j = this.selectionStarCache.shift();
                        j.setFrameTime(this.directorScene.time, 300);
                        j.backgroundImage.setAnimationImageIndex([Math.random() * 6 >> 0]);
                        j.__trb.setFrameTime(this.directorScene.time, 300);
                        j.__trb.path.setInitialPosition(b, c).setFinalPosition(g, h);
                        j.__sb.setFrameTime(this.directorScene.time, 300);
                        j.__parent.addChild(j)
                    }
                }
                a.setSelected()
            } else a.reset()
        },
        selectionOverflowEvent: function (a) {
            var b;
            b = a.params;
            for (var c, a = 0; a < b.length; a++) this.brickActors[b[a].row][b[a].column].reset();
            this.bricksContainer.enableEvents(false);
            for (var d = [], a = 0; a < this.gameRows; a++)
                for (b = 0; b < this.gameColumns; b++) c = this.brickActors[a][b], c.brick.removed || d.push(c);
            for (var e = this, a = 0; a < d.length; a++) d[a].selectionOverflow();
            this.directorScene.createTimer(this.directorScene.time, HN.BrickActor.prototype.timeOverflow + 100, function () {
                e.bricksContainer.enableEvents(true)
            }, function () {})
        },
        selectionClearedEvent: function (a) {
            var a = a.params,
                b;
            for (b = 0; b < a.length; b++) {
                var c = this.brickActors[a[b].row][a[b].column];
                c.parent.setZOrder(c, Number.MAX_VALUE);
                c.selectionCleared(this, this.director.height)
            }
            this.timer.reset(this.directorScene.time)
        },
        showLevelInfo: function () {},
        prepareSceneIn: function (a) {
            var b;
            this.gameMode = a;
            this.gameMode.respawn ? this.respawnClock.enable(true, this.gameMode.respawn_time) : this.respawnClock.enable(false, this.gameMode.respawn_time);
            this.bricksContainer.enableEvents(true);
            for (a = 0; a < this.gameRows; a++)
                for (b = 0; b < this.gameColumns; b++) this.brickActors[a][b].setLocation(-100, -100);
            this.selectionPath.initialize();
            this.chronoActor.tick(0, 0);
            this.scoreActor.reset();
            this.endGameActor.setFrameTime(-1, 0)
        },
        endGame: function () {
            this.fireEvent("end-game", {
                score: this.context.score,
                level: this.context.level,
                gameMode: this.context.gameMode.name
            });
            this.showGameEvent(this.endGameActor)
        },
        addGameListener: function (a) {
            this.gameListener.push(a)
        },
        fireEvent: function (a, b) {
            for (var c = 0, d = this.gameListener.length; c < d; c++) this.gameListener[c].gameEvent(a, b)
        },
        setDifficulty: function (a) {
            this.context.difficulty = a
        },
        cancelTimer: function () {
            this.timer !=
                null && this.timer.cancel();
            this.timer = null
        },
        enableTimer: function () {
            var a = this;
            this.timer = this.directorScene.createTimer(this.directorScene.time, this.context.turnTime, function () {
                a.context.timeUp()
            }, function (b, c, d) {
                a.chronoActor.tick(c, d.duration)
            })
        },
        setGameMode: function (a) {
            this.context.setGameMode(a)
        },
        endLevel: function () {
            var a = this.context.level;
            a > 7 && (a = 7);
            a = this.director.getImage("msg" + a);
            null != a && (this.endLevelMessage.setBackgroundImage(a, true), this.endLevelMessage.setLocation((this.endLevelMessage.parent.width -
                a.width) / 2, this.endLevelMessage.parent.height / 2 - 25));
            this.showGameEvent(this.endLevelActor)
        },
        removeGameEvent: function (a, b) {
            a.enableEvents(false);
            this.uninitializeActors();
            a.emptyBehaviorList();
            a.addBehavior((new CAAT.PathBehavior).setFrameTime(a.time, 2E3).setPath((new CAAT.LinearPath).setInitialPosition(a.x, a.y).setFinalPosition(a.x, -a.height)).setInterpolator((new CAAT.Interpolator).createExponentialInInterpolator(2, false)).addListener({
                behaviorExpired: function (a, d, e) {
                    e.setOutOfFrameTime();
                    b()
                }
            }))
        },
        showGameEvent: function (a) {
            this.cancelTimer();
            this.bricksContainer.enableEvents(false);
            var b = (this.directorScene.width - a.width) / 2,
                c = (this.directorScene.height - a.height) / 2 - 100;
            a.emptyBehaviorList().setFrameTime(this.directorScene.time, Number.MAX_VALUE).enableEvents(false).addBehavior((new CAAT.PathBehavior).setFrameTime(this.directorScene.time, 2E3).setPath((new CAAT.LinearPath).setInitialPosition(b, this.directorScene.height).setFinalPosition(b, c)).setInterpolator((new CAAT.Interpolator).createExponentialInOutInterpolator(3,
                false)).addListener({
                behaviorExpired: function (b, c) {
                    a.enableEvents(true);
                    a.emptyBehaviorList();
                    a.addBehavior((new CAAT.PathBehavior).setFrameTime(c, 3E3).setPath((new CAAT.LinearPath).setInitialPosition(a.x, a.y).setFinalPosition(a.x + (Math.random() < 0.5 ? 1 : -1) * (5 + 5 * Math.random()), a.y + (Math.random() < 0.5 ? 1 : -1) * (5 + 5 * Math.random()))).addListener({
                        behaviorExpired: function (b, c) {
                            b.setFrameTime(c, 3E3);
                            b.path.setFinalPosition(a.x + (Math.random() < 0.5 ? 1 : -1) * (5 + 5 * Math.random()), a.y + (Math.random() < 0.5 ? 1 : -1) * (5 + 5 * Math.random()))
                        },
                        behaviorApplied: function () {}
                    }).setInterpolator((new CAAT.Interpolator).createExponentialInOutInterpolator(3, true)))
                },
                behaviorApplied: function () {}
            }))
        },
        soundControls: function (a) {
            var b = (new CAAT.SpriteImage).initialize(a.getImage("sound"), 2, 3),
                c = a.width,
                d = (new CAAT.Actor).setAsButton(b.getRef(), 0, 1, 0, 0, function (b) {
                    a.audioManager.setMusicEnabled(!a.audioManager.isMusicEnabled());
                    a.audioManager.isMusicEnabled() ? b.setButtonImageIndex(0, 1, 0, 0) : b.setButtonImageIndex(2, 2, 2, 2)
                }).setBounds(c - b.singleWidth - 2,
                    2, b.singleWidth, b.singleHeight),
                e = (new CAAT.Actor).setAsButton(b.getRef(), 3, 4, 3, 3, function (b) {
                    a.audioManager.setSoundEffectsEnabled(!a.audioManager.isSoundEffectsEnabled());
                    a.audioManager.isSoundEffectsEnabled() ? b.setButtonImageIndex(3, 4, 3, 3) : b.setButtonImageIndex(5, 5, 5, 5)
                });
            a.width > a.height ? e.setBounds(c - b.singleWidth - 2, 4 + b.singleHeight, b.singleWidth, b.singleHeight) : e.setBounds(c - b.singleWidth * 2 - 2, 4, b.singleWidth, b.singleHeight);
            d.prepare = function () {
                a.audioManager.isMusicEnabled() ? this.setButtonImageIndex(0,
                    1, 0, 0) : this.setButtonImageIndex(2, 2, 2, 2)
            };
            e.prepare = function () {
                a.audioManager.isSoundEffectsEnabled() ? this.setButtonImageIndex(3, 4, 3, 3) : this.setButtonImageIndex(5, 5, 5, 5)
            };
            this.directorScene.addChild(e);
            this.directorScene.addChild(d);
            this.music = d;
            this.sound = e
        },
        prepareSound: function () {
            try {
                this.sound.prepare(), this.music.prepare()
            } catch (a) {}
        }
    }
})();