/* Built with Hydra */
(function () {
    function g() {
        return function () {}
    }
    var h, j = this;

    function aa(a) {
        var b = typeof a;
        if (b == "object")
            if (a) {
                if (a instanceof Array || !(a instanceof Object) && Object.prototype.toString.call(a) == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) return "array";
                if (!(a instanceof Object) && (Object.prototype.toString.call(a) == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call"))) return "function"
            } else return "null";
            else if (b == "function" && typeof a.call == "undefined") return "object";
        return b
    }
    Math.floor(Math.random() * 2147483648).toString(36);

    function k(a, b) {
        var c = b || j;
        if (arguments.length > 2) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function () {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(c, e)
            }
        } else return function () {
            return a.apply(c, arguments)
        }
    }

    function l(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.T = b.prototype;
        a.prototype = new c
    };
    var m, da, n;
    var o = Math.random;

    function p(a, b, c, d) {
        return b + (c - b) * (a / d)
    }

    function ea(a, b, c, d) {
        a /= d;
        return (c - b) * a * a + b
    };

    function fa(a, b) {
        var c = a.indexOf(b);
        if (c >= 0) {
            a.splice(c, 1);
            return true
        } else return false
    }

    function q(a, b) {
        a[a.length] = b
    };

    function ga(a, b, c, d) {
        var e = a.getPropertyValue("-webkit-transition-property");
        if (e) {
            var f = e.split(", ").indexOf(b);
            if (f < 0) {
                a.setProperty("-webkit-transition-property", e + ", " + b, "");
                a.setProperty("-webkit-transition-duration", a.getPropertyValue("-webkit-transition-duration") + ", " + c, "");
                a.setProperty("-webkit-transition-timing-function", a.getPropertyValue("-webkit-transition-timing-function") + ", " + d, "")
            } else {
                b = a.getPropertyValue("-webkit-transition-duration").split(", ");
                b[f] = c;
                a.setProperty("-webkit-transition-duration",
                    b.join(", "), "");
                c = a.getPropertyValue("-webkit-transition-timing-function").split(", ");
                c[f] = d;
                a.setProperty("-webkit-transition-timing-function", c.join(", "), "")
            }
        } else {
            a.setProperty("-webkit-transition-property", b, "");
            a.setProperty("-webkit-transition-duration", c, "");
            a.setProperty("-webkit-transition-timing-function", d, "")
        }
    }

    function ha(a, b) {
        var c = a.getPropertyValue("-webkit-transition-property");
        if (c) {
            var d = c.split(", ");
            c = d.indexOf(b);
            if (c >= 0)
                if (d.length > 1) {
                    d.splice(c, 1);
                    a.setProperty("-webkit-transition-property", d.join(", "), "");
                    d = a.getPropertyValue("-webkit-transition-duration").split(", ");
                    d.splice(c, 1);
                    a.setProperty("-webkit-transition-duration", d.join(", "), "");
                    d = a.getPropertyValue("-webkit-transition-timing-function").split(", ");
                    d.splice(c, 1);
                    a.setProperty("-webkit-transition-timing-function", d.join(", "), "")
                } else {
                    a.setProperty("-webkit-transition-property",
                        "", "");
                    a.setProperty("-webkit-transition-duration", "", "");
                    a.setProperty("-webkit-transition-timing-function", "", "")
                }
        }
    }

    function r(a) {
        var b = document.createElement("div");
        b.className = a;
        return b
    }

    function s(a) {
        var b = document.createElement("div");
        b.innerHTML = a;
        if (b.childElementCount == 1) b = b.firstElementChild;
        return b
    };

    function t(a) {
        ia.call(this);
        this.element = a || document.createElement("div");
        this.y = this.x = 0;
        this.A = this.F = 1;
        this.rotation = 0
    }
    l(t, ia);
    t.prototype.detach = function () {
        if (this.parent) {
            if (fa(this.parent.q, this)) {
                this.parent = null;
                this.detach()
            }
        } else this.element.parentNode && this.element.parentNode.removeChild(this.element)
    };
    t.prototype.j = function () {
        t.T.j.call(this);
        this.detach();
        this.element = null
    };

    function ja(a, b) {
        a.x = b;
        v(a)
    }

    function w(a, b) {
        a.y = b;
        v(a)
    }

    function x(a, b, c) {
        a.x = b;
        a.y = c;
        v(a)
    }

    function ka(a, b) {
        a.F = b;
        a.A = b;
        v(a)
    }

    function v(a) {
        a.element.style.webkitTransform = "translate3d(" + a.x + "px," + a.y + "px,0)rotate(" + a.rotation + "deg)scale(" + a.F + "," + a.A + ")"
    }

    function y(a) {
        t.call(this, a);
        this.q = []
    }
    l(y, t);
    y.prototype.p = function (a) {
        y.T.p.call(this, a);
        for (var b = 0; b < this.q.length; ++b) z(a, this.q[b], null)
    };
    y.prototype.j = function () {
        y.T.j.call(this);
        for (var a = 0; a < this.q.length; ++a) {
            var b = this.q[a];
            b.parent = null;
            b.j()
        }
    };

    function A(a, b) {
        if (a.g != null && b.g == null) z(a.g, b, a);
        else {
            if (b.parent != null)
                if (fa(b.parent.q, b)) {
                    b.parent = null;
                    b.detach()
                }
            q(a.q, b);
            b.parent = a;
            a.element.appendChild(b.element)
        }
    }

    function B(a, b, c, d) {
        this.l = a;
        this.duration = 1E3 * b;
        this.Z = c;
        this.S = d;
        this.t = la;
        this.m = 0
    }
    var la = 0;
    B.prototype.s = g();

    function C(a, b, c) {
        return a.J(a.m, b, c, a.duration)
    }
    B.prototype.handleEvent = function (a) {
        if (a.propertyName == this.l) {
            this.t = 2;
            a.target.removeEventListener("webkitTransitionEnd", this, false)
        }
    };
    B.prototype.update = function (a, b) {
        b = this.S || b;
        switch (this.t) {
        case 1:
            this.m += a;
            if (this.m > this.duration) this.m = this.duration;
            this.s(b);
            return false;
        case la:
            var c = window.getComputedStyle(b.element, null).getPropertyValue(this.l);
            this.w(b);
            if (c != b.element.style.getPropertyValue(this.l)) {
                this.t = 1;
                ga(b.element.style, this.l, this.duration + "ms", this.Z);
                b.element.addEventListener("webkitTransitionEnd", this, false);
                this.m = 0;
                this.s(b);
                return false
            } else return true;
        case 2:
            this.t = la;
            ha(b.element.style, this.l);
            this.m =
                this.duration;
            this.s(b);
            return true
        }
    };
    B.prototype.stop = function (a) {
        if (this.t == 1) {
            a = this.S || a;
            var b = window.getComputedStyle(a.element, null).getPropertyValue(this.l);
            ha(a.element.style, this.l);
            a.element.removeEventListener("webkitTransitionEnd", this, false);
            a.element.style.setProperty(this.l, b, "")
        }
    };
    B.prototype.start = function (a) {
        if (this.t == 1) {
            a = this.S || a;
            var b = window.getComputedStyle(a.element, null).getPropertyValue(this.l);
            this.w(a);
            if (b != a.element.style.getPropertyValue(this.l)) {
                ga(a.element.style, this.l, this.duration - this.m + "ms", this.Z);
                a.element.addEventListener("webkitTransitionEnd", this, false)
            } else this.t = 2
        }
    };

    function ma(a, b, c, d, e) {
        B.call(this, a, c, d, e);
        this.value = b
    }
    l(ma, B);
    ma.prototype.w = function (a) {
        a.element.style.setProperty(this.l, this.value, "")
    };

    function D(a, b, c, d, e, f) {
        B.call(this, "-webkit-transform", c, d, f);
        this.x = a;
        this.y = b;
        this.J = e
    }
    l(D, B);
    D.prototype.w = function (a) {
        this.B = a.x;
        this.C = a.y;
        a.x = this.x;
        a.y = this.y;
        v(a)
    };
    D.prototype.s = function (a) {
        a.x = C(this, this.B, this.x);
        a.y = C(this, this.C, this.y)
    };

    function E(a, b, c, d, e, f) {
        B.call(this, "-webkit-transform", c, d, f);
        this.ja = a;
        this.ka = b;
        this.J = e
    }
    l(E, B);
    E.prototype.w = function (a) {
        this.B = a.x;
        this.C = a.y;
        if (this.V == null) {
            this.V = this.ja + a.x;
            this.ea = this.ka + a.y
        }
        a.x = this.V;
        a.y = this.ea;
        v(a)
    };
    E.prototype.s = function (a) {
        a.x = C(this, this.B, this.V);
        a.y = C(this, this.C, this.ea)
    };

    function F(a, b, c, d, e, f) {
        B.call(this, "-webkit-transform", c, d, f);
        this.x = a;
        this.y = b;
        this.J = e
    }
    l(F, B);
    F.prototype.w = function (a) {
        this.B = a.F;
        this.C = a.A;
        a.F = this.x;
        a.A = this.y;
        v(a)
    };
    F.prototype.s = function (a) {
        a.F = C(this, this.B, this.x);
        a.A = C(this, this.C, this.y)
    };

    function na(a, b, c, d, e) {
        B.call(this, "-webkit-transform", b, c, e);
        this.rotation = a;
        this.J = d
    }
    l(na, B);
    na.prototype.w = function (a) {
        this.na = a.rotation;
        a.rotation += this.rotation;
        v(a);
        this.Da = a.rotation
    };
    na.prototype.s = function (a) {
        a.rotation = C(this, this.na, this.Da)
    };

    function G(a, b, c, d) {
        return new ma(a, b, c, "linear", d)
    }

    function H(a, b, c, d) {
        return new D(a, b, c, "linear", p, d)
    }

    function oa(a, b, c, d) {
        return new D(a, b, c, "ease-out", p, d)
    };

    function pa() {
        this.D = {}
    }
    pa.prototype.addEventListener = function (a, b) {
        var c = this.D[a];
        if (c == null) this.D[a] = [b];
        else q(c, b)
    };
    pa.prototype.removeEventListener = function (a, b) {
        var c = this.D[a];
        c != null && fa(c, b)
    };
    pa.prototype.dispatchEvent = function (a) {
        var b = this.D[a];
        if (b != null) {
            var c = Array.prototype.slice.apply(arguments);
            c.shift();
            for (var d = 0; d < b.length; ++d) b[d].apply(undefined, c)
        }
    };

    function qa() {
        this.L = []
    }
    qa.prototype.e = function (a, b, c) {
        q(this.L, new ra(a, b, c));
        a.addEventListener(b, c, false)
    };
    qa.prototype.G = function () {
        for (var a = 0; a < this.L.length; ++a) {
            var b = this.L[a];
            b.ia.removeEventListener(b.la, b.oa, false)
        }
        this.L = []
    };

    function ra(a, b, c) {
        this.ia = a;
        this.la = b;
        this.oa = c
    };
    var I = [],
        sa = document.getElementById("hydra-stage");
        sa.innerHTML = '<div style="left: -60px; top: -150px"><div class="block" style="-webkit-transform: translate3d(120px, 360px, 0px) rotate(0deg) scale(1, 1); background-position: -60px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(80px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -60px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(100px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -60px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(120px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -60px 0px;"></div></div>' + 
                       '<div style="top: -150px"><div class="block" style="-webkit-transform: translate3d(140px, 360px, 0px) rotate(0deg) scale(1, 1); background-position: -100px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(120px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -100px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(140px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -100px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(160px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -100px 0px;"></div></div>' + 
                       '<div style="top: -150px; left: 80px"><div class="block" style="-webkit-transform: translate3d(160px, 360px, 0px) rotate(0deg) scale(1, 1); background-position: -40px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(180px, 360px, 0px) rotate(0deg) scale(1, 1); background-position: -40px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(160px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -40px 0px;"></div>' +
                       '<div class="block" style="-webkit-transform: translate3d(140px, 380px, 0px) rotate(0deg) scale(1, 1); background-position: -40px 0px;"></div></div>';
    function ta(a) {
        if (a != m) {
            m && m.z();
            for (var b = I.length - 1; b >= 0; --b) {
                var c = I[b];
                if (a != c) {
                    --I.length;
                    ua(c)
                } else {
                    m = c;
                    a.r();
                    return
                }
            }
            I = [a];
            m = a;
            a.load();
            a.r()
        }
    }

    function J() {
        if (I.length > 1) {
            var a = I.pop();
            a.z();
            ua(a);
            m = I[I.length - 1];
            m.r()
        }
    }

    function K(a) {
        m && m.z();
        q(I, a);
        m = a;
        a.load();
        a.r()
    }

    function ia() {
        this.a = [];
        this.g = null
    }
    h = ia.prototype;
    h.e = function (a, b, c) {
        if (!this.K) this.K = new qa;
        this.K.e(a, b, c)
    };
    h.G = function () {
        this.K && this.K.G()
    };
    h.c = function (a) {
        this.a.length == 0 && this.g != null && q(this.g.u, this);
        q(this.a, a);
        a.start(this)
    };
    h.O = function () {
        for (var a = 0; a < this.a.length; ++a) {
            var b = this.a[a];
            if (b) {
                b.stop(this);
                this.a[a] = null
            }
        }
    };
    h.p = function (a) {
        this.g = a;
        this.a.length > 0 && q(this.g.u, this)
    };
    h.update = function (a) {
        for (var b = 0; b < this.a.length; ++b) {
            var c = this.a[b];
            if (!c || c.update(a, this)) this.a.splice(b--, 1)
        }
        return b == 0
    };
    h.j = function () {
        this.O();
        this.G();
        if (this.g != null) {
            fa(this.g.entities, this);
            this.g = null
        }
    };
    h.r = function () {
        for (var a = 0; a < this.a.length; ++a) {
            var b = this.a[a];
            b && b.start(this)
        }
    };
    h.z = function () {
        for (var a = 0; a < this.a.length; ++a) {
            var b = this.a[a];
            b && b.stop(this)
        }
    };

    function O(a) {
        this.entities = [];
        this.u = [];
        this.name = a;
        this.d = new y(r("scene scene-" + a));
        z(this, this.d, sa)
    }
    h = O.prototype;
    h.update = function (a) {
        for (var b = 0; b < this.u.length; ++b) {
            var c = this.u[b];
            if (!c || c.update(a)) this.u.splice(b--, 1)
        }
    };

    function z(a, b, c) {
        if (!b.g) {
            q(a.entities, b);
            b.p(a);
            if (b instanceof t)
                if (c instanceof HTMLElement) c.appendChild(b.element);
                else if (c !== null) {
                c = c || a.d;
                A(c, b)
            }
        }
    }
    h.load = g();

    function ua(a) {
        for (var b = 0; b < a.entities.length; ++b) {
            var c = a.entities[b];
            if (c.g != null) {
                c.g = null;
                c.j()
            }
        }
        a.entities = [];
        a.u = []
    }
    h.r = function () {
        for (var a = 0; a < this.entities.length; ++a) this.entities[a].r()
    };
    h.z = function () {
        for (var a = 0; a < this.entities.length; ++a) this.entities[a].z()
    };
    h.e = function (a, b, c) {
        this.d.e(a, b, c)
    };
    h.G = function () {
        this.d.G()
    };
    h.c = function (a) {
        this.d.c(a)
    };
    h.O = function () {
        this.d.O()
    };

    function P(a) {
        this.ma = a
    }
    P.prototype.start = g();
    P.prototype.stop = g();
    P.prototype.update = function (a, b) {
        this.ma(a, b);
        return true
    };

    function Q(a) {
        this.Y = 1E3 * a;
        this.m = 0
    }
    Q.prototype.start = g();
    Q.prototype.stop = g();
    Q.prototype.update = function (a) {
        this.m += a;
        if (this.m >= this.Y) {
            this.m = 0;
            return true
        } else return false
    };

    function R(a) {
        this.a = a;
        this.H = []
    }
    R.prototype.stop = function (a) {
        for (var b = 0; b < this.a.length; ++b) {
            var c = this.a[b];
            c && c.stop(a)
        }
    };
    R.prototype.start = function (a) {
        for (var b = 0; b < this.a.length; ++b) {
            var c = this.a[b];
            c && c.start(a)
        }
    };
    R.prototype.update = function (a, b) {
        for (var c = 0; c < this.a.length; ++c) {
            var d = this.a[c];
            if (d && d.update(a, b)) {
                this.a[c] = null;
                q(this.H, d)
            }
        }
        if (this.H.length == this.a.length) {
            this.a = this.H;
            this.H = [];
            return true
        } else return false
    };

    function S(a) {
        this.U = a
    }
    S.prototype.stop = function (a) {
        this.U.stop(a)
    };
    S.prototype.start = function (a) {
        this.U.start(a)
    };
    S.prototype.update = function (a, b) {
        this.U.update(a, b);
        return false
    };

    function T() {}
    T.prototype.start = g();
    T.prototype.stop = g();
    T.prototype.update = function (a, b) {
        b.j();
        return true
    };

    function U(a) {
        this.a = a;
        this.o = 0
    }
    U.prototype.stop = function (a) {
        this.o < this.a.length && this.a[this.o].stop(a)
    };
    U.prototype.start = function (a) {
        this.o < this.a.length && this.a[this.o].start(a)
    };
    U.prototype.update = function (a, b) {
        if (this.a[this.o].update(a, b))
            if (++this.o < this.a.length) {
                this.a[this.o].start(b);
                return false
            } else {
                this.o = 0;
                return true
            } else return false
    };

    function va(a) {
        return eval("(" + a + ")")
    }

    function wa(a) {
        var b = [];
        xa(new ya, a, b);
        return b.join("")
    }

    function ya() {}

    function xa(a, b, c) {
        switch (typeof b) {
        case "string":
            za(a, b, c);
            break;
        case "number":
            c.push(isFinite(b) && !isNaN(b) ? b : "null");
            break;
        case "boolean":
            c.push(b);
            break;
        case "undefined":
            c.push("null");
            break;
        case "object":
            if (b == null) {
                c.push("null");
                break
            }
            if (aa(b) == "array") {
                var d = b.length;
                c.push("[");
                for (var e = "", f = 0; f < d; f++) {
                    c.push(e);
                    xa(a, b[f], c);
                    e = ","
                }
                c.push("]");
                break
            }
            c.push("{");
            d = "";
            for (e in b)
                if (b.hasOwnProperty(e)) {
                    f = b[e];
                    if (typeof f != "function") {
                        c.push(d);
                        za(a, e, c);
                        c.push(":");
                        xa(a, f, c);
                        d = ","
                    }
                }
            c.push("}");
            break;
        case "function":
            break;
        default:
            throw Error("Unknown type: " + typeof b);
        }
    }
    var Aa = {
        '"': '\\"',
        "\\": "\\\\",
        "/": "\\/",
        "\u0008": "\\b",
        "\u000c": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\u000b": "\\u000b"
    }, Ba = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff"]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;

    function za(a, b, c) {
        c.push('"', b.replace(Ba, function (d) {
            if (d in Aa) return Aa[d];
            var e = d.charCodeAt(0),
                f = "\\u";
            if (e < 16) f += "000";
            else if (e < 256) f += "00";
            else if (e < 4096) f += "0";
            return Aa[d] = f + e.toString(16)
        }), '"')
    };
    "JSON" in window || (JSON = {
        parse: va,
        stringify: wa
    });
    "localStorage" in window || (localStorage = {});

    function V(a) {
        t.call(this, a);
        this.Fa = false;
        a = this.element;
        if (a.className)(" " + a.className + " ").indexOf(" button ") >= 0 || (a.className += " button");
        else a.className = "button";
        this.e(this.element, "touchstart", this);
        this.e(this.element, "touchend", this);
        this.e(this.element, "touchcancel", this)
    }
    l(V, t);
    V.prototype.n = g();
    V.prototype.handleEvent = function (a) {
        if (m == this.g) switch (a.type) {
        case "touchstart":
            var b = this.element;
            if (b.className)(" " + b.className + " ").indexOf(" button-down ") >= 0 || (b.className += " button-down");
            else b.className = "button-down";
            break;
        case "touchend":
        case "touchcancel":
            if (!a.targetTouches.length) {
                b = this.element;
                var c = b.className.split(" "),
                    d = c.indexOf("button-down");
                if (d >= 0) {
                    c.splice(d, 1);
                    b.className = c.join(" ")
                }
                this.n()
            }
        }
        a.stopPropagation()
    };

    function Ca() {
        O.call(this, "orientation")
    }
    l(Ca, O);
    Ca.prototype.load = function () {
        this.d.element.appendChild(s("Rotate your device to play!"));
        this.e(window, "orientationchange", function () {
            document.body.offsetWidth > 320 && document.body.offsetHeight < 416 || J()
        })
    };

    function Da(a, b) {
        if (b) return a.replace(Ea, "&amp;").replace(Fa, "&lt;").replace(Ga, "&gt;").replace(Ha, "&quot;");
        else {
            if (!Ia.test(a)) return a;
            if (a.indexOf("&") != -1) a = a.replace(Ea, "&amp;");
            if (a.indexOf("<") != -1) a = a.replace(Fa, "&lt;");
            if (a.indexOf(">") != -1) a = a.replace(Ga, "&gt;");
            if (a.indexOf('"') != -1) a = a.replace(Ha, "&quot;");
            return a
        }
    }
    var Ea = /&/g,
        Fa = /</g,
        Ga = />/g,
        Ha = /\"/g,
        Ia = /[&<>\"]/;

    function Ja(a, b) {
        for (var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), i = 0; c == 0 && i < f; i++) {
            var u = d[i] || "",
                L = e[i] || "",
                M = RegExp("(\\d*)(\\D*)", "g"),
                ba = RegExp("(\\d*)(\\D*)", "g");
            do {
                var N = M.exec(u) || ["", "", ""],
                    ca = ba.exec(L) || ["", "", ""];
                if (N[0].length == 0 && ca[0].length == 0) break;
                c = Ka(N[1].length == 0 ? 0 : parseInt(N[1], 10), ca[1].length == 0 ? 0 : parseInt(ca[1], 10)) || Ka(N[2].length == 0, ca[2].length == 0) || Ka(N[2],
                    ca[2])
            } while (c == 0)
        }
        return c
    }

    function Ka(a, b) {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0
    };
    var W, La, Ma, Na;
    "ScriptEngine" in j && j.ScriptEngine() == "JScript" && (j.ScriptEngineMajorVersion(), j.ScriptEngineMinorVersion(), j.ScriptEngineBuildVersion());

    function Oa() {
        return j.navigator ? j.navigator.userAgent : null
    }
    Na = Ma = La = W = false;
    var Pa;
    if (Pa = Oa()) {
        var Qa = j.navigator;
        W = Pa.indexOf("Opera") == 0;
        La = !W && Pa.indexOf("MSIE") != -1;
        Ma = !W && Pa.indexOf("WebKit") != -1;
        Na = !W && !Ma && Qa.product == "Gecko"
    }
    var Ra = La,
        Sa = Na,
        Ta = Ma,
        Ua;
    a: {
        var Va = "",
            Wa;
        if (W && j.opera) {
            var Xa = j.opera.version;
            Va = typeof Xa == "function" ? Xa() : Xa
        } else {
            if (Sa) Wa = /rv\:([^\);]+)(\)|;)/;
            else if (Ra) Wa = /MSIE\s+([^\);]+)(\)|;)/;
            else if (Ta) Wa = /WebKit\/(\S+)/;
            if (Wa) {
                var Ya = Wa.exec(Oa());
                Va = Ya ? Ya[1] : ""
            }
        } if (Ra) {
            var Za, $a = j.document;
            Za = $a ? $a.documentMode : undefined;
            if (Za > parseFloat(Va)) {
                Ua = String(Za);
                break a
            }
        }
        Ua = Va
    }
    var ab = {};
    !Ra || ab["9"] || (ab["9"] = Ja(Ua, "9") >= 0);
    Ra && (ab["9"] || (ab["9"] = Ja(Ua, "9") >= 0));

    function bb(a) {
        return '<div class="label-gameover"><div>分数: <span class="stat">' + Da(String(a.f)) + '</span></div><div>关数: <span class="stat">' + Da(String(a.h)) + "</span></div>" + '</div><div class="button-replay button-big">重新再来</div><div class="button-quit button-big" style="margin-top: 10px;">主 菜 单</div>'
    }

    function cb(a) {
        var b = '<div class="scoremenu">';
        a = a.Ca;
        var c = a.length;
        if (c > 0)
            for (var d = 0; d < c; d++) {
                var e = a[d];
                b += '<div class="' + (d == 0 ? "label-highscore" : "") + '">' + Da(String(e.f)) + " pts, " + Da(String(e.ha)) + "</div>"
            } else b += " <div>No scores recorded yet!</div>";
        b += '<div class="button-back button-big">Back</div></div>';
        return b
    };

    function X(a, b) {
        this.color = a;
        this.coords = b
    }
    var Y = [new X(1, [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [0, -1]
    ]), new X(6, [
        [-2, 0],
        [-1, 0],
        [0, 0],
        [1, 0]
    ]), new X(2, [
        [0, -1],
        [1, -1],
        [0, 0],
        [-1, 0]
    ]), new X(0, [
        [0, -1],
        [-1, -1],
        [0, 0],
        [1, 0]
    ]), new X(4, [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [1, 0]
    ]), new X(3, [
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0]
    ]), new X(5, [
        [0, -1],
        [-1, 0],
        [0, 0],
        [1, 0]
    ])];
    X.prototype.rotate = function () {
        if (this == Y[0]) return null;
        else {
            for (var a = [], b = 0; b < this.coords.length; ++b) {
                var c = this.coords[b];
                q(a, [-c[1], c[0]])
            }
            a = new X(this.color, a);
            a.x = this.x;
            a.y = this.y;
            return a
        }
    };

    function db() {
        this.D = {}
    }
    l(db, pa);

    function eb(a) {
        a.k = [];
        a.ba = true;
        var b = o() * Y.length;
        a.Q = Y[b | 0];
        a.ca = 0;
        a.f = 0;
        a.h = 1;
        a.dispatchEvent(7);
        a.dispatchEvent(6);
        fb(a)
    }

    function gb(a) {
        if (a.ba && !hb(a, 0, 1)) {
            for (var b = 0; b < a.b.coords.length; ++b) {
                var c = a.b.coords[b];
                a.k[(a.b.y + c[1]) * 10 + (a.b.x + c[0])] = true
            }
            a.dispatchEvent(2, a.b);
            b = [];
            c = 0;
            a: for (; c < a.b.coords.length; ++c) {
                var d = a.b.y + a.b.coords[c][1];
                if (!(b.indexOf(d) >= 0)) {
                    for (var e = 0; e < 10; ++e)
                        if (!a.k[d * 10 + e]) continue a;
                    q(b, d)
                }
            }
            if (b.length) {
                b.sort();
                for (c = 0; c < b.length; ++c)
                    for (d = b[c]; d > 0;) {
                        for (e = 0; e < 10; ++e) a.k[d * 10 + e] = a.k[(d - 1) * 10 + e];
                        --d
                    }
                b.reverse();
                c = b.length;
                a.f += a.h * [40, 100, 300, 1200][c - 1];
                a.ca += c;
                c = 1 + (a.ca / 4 | 0);
                if (c != a.h) {
                    a.h =
                        c;
                    a.dispatchEvent(7)
                }
                a.dispatchEvent(5, b);
                a.dispatchEvent(6)
            }
            fb(a)
        }
    }
    db.prototype.rotate = function () {
        var a = this.b.rotate();
        if (a && ib(this, a)) {
            this.b = a;
            this.dispatchEvent(3, this.b)
        }
    };

    function jb(a) {
        for (; ib(a, a.b);) a.b.y += 1;
        a.b.y -= 1;
        a.dispatchEvent(1, a.b);
        gb(a)
    }

    function hb(a, b, c) {
        for (var d = a.b.x + b, e = a.b.y + c, f = 0; f < a.b.coords.length; ++f) {
            var i = a.b.coords[f];
            if (d + i[0] < 0 || d + i[0] >= 10 || e + i[1] < 0 || e + i[1] >= 20 || a.k[(e + i[1]) * 10 + (d + i[0])]) return false
        }
        a.b.x = d;
        a.b.y = e;
        a.dispatchEvent(0, a.b, b, c);
        return true
    }

    function ib(a, b) {
        for (var c = 0; c < b.coords.length; ++c) {
            var d = b.coords[c];
            if (b.x + d[0] < 0 || b.x + d[0] >= 10 || b.y + d[1] < 0 || b.y + d[1] >= 20 || a.k[(b.y + d[1]) * 10 + (b.x + d[0])]) return false
        }
        return true
    }

    function fb(a) {
        a.b = a.Q;
        a.b.x = 5;
        a.b.y = 2;
        var b = o() * Y.length;
        a.Q = Y[b | 0];
        if (ib(a, a.b)) a.dispatchEvent(4, a.b, a.Q);
        else {
            a.ba = false;
            a.dispatchEvent(8)
        }
    };

    function kb(a) {
        var b = r("block");
        b.style.backgroundPosition = -Z * a + "px 0";
        return b
    };
    var $;

    function lb() {
        y.call(this);
        this.k = [];
        this.v = new y;
        A(this, this.v);
        this.e($, 0, k(this.ua, this));
        this.e($, 1, k(this.ta, this));
        this.e($, 4, k(this.N, this));
        this.e($, 5, k(this.xa, this));
        this.e($, 3, k(this.wa, this));
        this.e($, 2, k(this.va, this))
    }
    l(lb, y);
    var Z = 20;
    h = lb.prototype;
    h.ua = function (a) {
        x(this.v, Z * a.x, Z * a.y)
    };
    h.ta = function () {
        A(this, this.i);
        this.element.insertBefore(this.i.element, this.element.childNodes[0]);
        x(this.i, this.v.x, this.v.y);
        var a = this.i;
        a.A = 10;
        v(a);
        this.i.element.style.opacity = "0.2";
        this.i.c(new E(0, 500, 0.5, "linear", p, void 0));
        this.i.c(new U([G("opacity", "0", 0.5), new T]));
        this.i = null
    };
    h.wa = function (a) {
        this.N(a);
        a = this.i;
        a.rotation = -90;
        v(a);
        this.i.c(new na(90, 0.1, "linear", p, void 0))
    };
    h.va = function (a) {
        for (var b = 0; b < a.coords.length; ++b) {
            var c = a.coords[b],
                d = new t(kb(a.color)),
                e = a.x + c[0];
            c = a.y + c[1];
            this.k[c * 10 + e] = d;
            x(d, e * Z, c * Z);
            A(this, d)
        }
    };
    h.N = function (a) {
        this.i && this.i.j();
        this.i = new mb(a);
        x(this.v, a.x * Z, a.y * Z);
        A(this.v, this.i)
    };
    h.xa = function (a) {
        var b = [],
            c = new y;
        a.push(0);
        for (var d = [], e = 0, f = a.length - 1; e < f; ++e) {
            var i = a[e],
                u = new t(r("explosion"));
            x(u, 0, i * Z);
            A(c, u);
            for (var L = 0; L < 10; ++L)(u = this.k[i * 10 + L]) && q(b, u);
            i = i - 1;
            if (i > a[e + 1]) {
                L = Math.sqrt(e + 1) / 4;
                do {
                    for (var M = 0; M < 10; ++M) {
                        this.k[10 * (i + e + 1) + M] = this.k[10 * i + M];
                        (u = this.k[10 * i + M]) && q(d, new D(u.x, (i + e + 1) * Z, L, "ease-in", ea, u))
                    }--i
                } while (i > a[e + 1])
            }
        }
        c.element.style.opacity = "0";
        A(this, c);
        this.c(new U([G("opacity", "0.8", 0.5, c), new P(function () {
            for (var ba = 0, N = b.length; ba < N; ++ba) b[ba].j();
            c.j()
        }), new R(d)]))
    };

    function nb(a, b) {
        b = b || Date.now();
        var c = b - a;
        if (c < 6E4) return "just now";
        if (c < 12E4) return "one minute ago";
        if (c < 36E5) return Math.round(c / 6E4) + " minutes ago";
        if (c < 54E5) return "one hour ago";
        if (c < 864E5) return Math.round(c / 36E5) + " hours ago";
        if (c < 1728E5) return "yesterday";
        if (c < 2592E6) return Math.round(c / 864E5) + " days ago";
        if (c < 3888E6) return "one month ago";
        if (c < 31104E6) return Math.round(c / 2592E6) + " months ago";
        if (c < 62208E6) return "one year ago";
        return Math.round(c / 31104E6) + " years ago"
    };

    function ob(a) {
        O.call(this, "transition");
        this.aa = a
    }
    l(ob, O);
    ob.prototype.load = function () {
        var a = this.aa,
            b = 0;
        if (b < 0) {
            b += I.length;
            if (b < 0) b = 0
        } else if (b > I.length) b = I.length;
        if (m && I[b] == m) {
            m.z();
            m = a
        }
        I.splice(b, 0, a);
        a.load();
        m == a && a.r()
    };
    ob.prototype.complete = function () {
        ta(this.aa)
    };

    function pb(a) {
        O.call(this, "mainmenu");
        this.ga = a
    }
    l(pb, O);
    pb.prototype.load = function () {
        var c = new y;
        c.c(new S(new U([new P(function () {
            var d;
            d = o() * Y.length;
            d = Y[d | 0];
            if (d != Y[0]) {
                var e = 0,
                    f;
                for (f = o() * 4 + 0 | 0; e < f; ++e) d = d.rotate()
            }
            d = new mb(d);
            e = o() * 320 + 0;
            x(d, e | 0, 450);
            e = o() * 4 + 1;
            ka(d, 2 / e);
            d.c(new U([new E(0, -480, e, "linear", p, void 0), new T]));
            A(c, d)
        }), new Q(0.1)])));
        qb(this, false)
    };

    function qb(a, b) {
        var c = new y(s('<div class="mainmenu" style="position: relative; margin-top: 60px"><font color="white" style="margin-top: 50px; font-size: 50px">俄罗斯方块</font></div><br />' + 
            '<div class="mainmenu" style="background-color: rgba(34, 34, 34, 0.3)"><div class="button-play button-big" style="margin-top: 180px;">开始游戏</div></div>'));
        z(a, c);
        var d = c.element.offsetHeight;
        if (b || a.ga) {
            w(c, -d);
            c.c(oa(0, 0, 0.5))
        }
        var e = new V(c.element.querySelector(".button-play"));
        e.n = function () {
            var f = m,
                i = new rb;
            w(i.d, 416);
            var u = new ob(i);
            q(u.u, f);
            u.c(new U([new R([H(0, -416, 1, f.d), G("opacity", "0.2", 0.5, f.d), H(0, 0, 1, i.d)]), new P(function () {
                u.complete()
            })]));
            K(u)
        };
        e.p(a);
        e = new V(c.element.querySelector(".button-scores"));
        e.n = function () {
            c.c(new U([oa(0, -d, 0.5), new P(function () {
                var f = c.g;
                c.j();
                sb(f)
            })]))
        };
        e.p(a);
        e = new V(c.element.querySelector(".button-more"));
        e.n = function () {
            window.location = "https://aduros.com/games"
        };
        e.p(a)
    }

    function sb(a) {
        var b;
        if ("scores" in n) {
            var c = Date.now();
            b = n.scores.map(function (f) {
                return {
                    f: f.score,
                    ha: nb(f.date, c)
                }
            })
        } else b = [];
        var d = new y(s(cb({
            Ca: b
        })));
        z(a, d);
        var e = d.element.offsetHeight;
        b = new V(d.element.querySelector(".button-back"));
        b.n = function () {
            d.c(new U([oa(0, -e, 0.5), new P(function () {
                var f = d.g;
                d.j();
                qb(f, true)
            })]))
        };
        b.p(a);
        w(d, -e);
        d.c(oa(0, 0, 0.5))
    }

    function tb() {
        var a = m,
            b = new pb(true);
        w(b.d, -416);
        var c = new ob(b);
        c.c(new U([new R([H(0, 416, 1, a.d), G("opacity", "0.2", 0.5, a.d), H(0, 0, 1, b.d)]), new P(function () {
            c.complete()
        })]));
        return c
    };

    function ub() {
        O.call(this, "pause")
    }
    l(ub, O);
    ub.prototype.load = function () {
        var a = s('<div class="label-pause">PAUSED</div><div class="button-resume button-big">Continue</div><div class="button-quit button-big">主 菜 单</div>');
        this.d.element.appendChild(a);
        x(this.d, -320, 100);
        this.d.element.style.setProperty("opacity", "0", "");
        this.c(H(0, 100, 0.2));
        this.c(G("opacity", "1", 0.2));
        var b = this,
            c = new V(a.querySelector(".button-resume"));
        c.n = function () {
            b.c(new U([G("opacity", "0", 0.2), new P(J)]))
        };
        z(this, c, null);
        a = new V(a.querySelector(".button-quit"));
        a.n = function () {
            J();
            K(tb())
        };
        z(this, a, null)
    };

    function vb() {
        y.call(this, r("marquee"));
        this.label = new t(r("marquee-text"));
        A(this, this.label);
        this.element.style.setProperty("opacity", "0", "")
    }
    l(vb, y);

    function wb(a, b) {
        a.O();
        ja(a.label, 200);
        a.label.element.innerHTML = b;
        setTimeout(function () {
            var c = a.label.element.offsetWidth;
            a.c(new U([G("opacity", "1", 0.5), H(-c, 0, (c + 200) / 100, a.label), G("opacity", "0", 0.5)]))
        }, 0)
    };

    function xb() {
        O.call(this, "gameover")
    }
    l(xb, O);
    xb.prototype.load = function () {
        n.lastGame = Date.now();
        var a = n.scores;
        a || (n.scores = a = []);
        for (var b = 0; b < a.length; ++b)
            if (a[b].score < $.f) break;
        a.splice(b, 0, {
            date: Date.now(),
            score: $.f
        });
        if (a.length > 10) a.length = 10;
        try {
            localStorage["hydra:tetris"] = JSON.stringify(n) || null
        } catch (c) {}
        a = s(bb({
            f: $.f,
            h: $.h,
            pa: b == 0
        }));
        this.d.element.appendChild(a);
        x(this.d, 320, 100);
        this.d.element.style.setProperty("opacity", "0", "");
        this.c(H(0, 100, 0.2));
        this.c(G("opacity", "1", 0.2));
        b = new V(a.querySelector(".button-replay"));
        b.n = function () {
            ta(new rb)
        };
        z(this, b, null);
        a = new V(a.querySelector(".button-quit"));
        a.n = function () {
            J();
            K(tb())
        };
        z(this, a, null)
    };

    function mb(a) {
        t.call(this);
        for (var b = 0; b < a.coords.length; ++b) {
            var c = a.coords[b],
                d = kb(a.color);
            d.style.left = c[0] * Z + "px";
            d.style.top = c[1] * Z + "px";
            this.element.appendChild(d)
        }
    }
    l(mb, t);

    function rb() {
        O.call(this, "playing")
    }
    l(rb, O);
    h = rb.prototype;
    h.load = function () {
        var a = s('<div class="ui-board"></div><div class="ui-preview"></div><div class="ui-score"></div><div class="ui-level"></div><div></div>');
        this.f = new t(a.querySelector(".ui-score"));
        z(this, this.f, null);
        this.Ea = a.querySelector(".ui-preview");
        this.h = new t(a.querySelector(".ui-level"));
        z(this, this.h, null);
        this.d.element.appendChild(a);
        var b = new V();
        b.n = function () {
            K(new ub)
        };
        z(this, b, null);
        $ = new db;
        a = a.querySelector(".ui-board");
        this.M =
            new vb;
        w(this.M, 40);
        "lastGame" in n || wb(this.M, yb ? "" : "");
        z(this, this.M, a);
        z(this, new lb, a);
        this.e($, 8, k(this.qa, this));
        this.e($, 4, k(this.N, this));
        this.e($, 6, k(this.ya, this));
        this.e($, 7, k(this.sa, this));
        this.e(window, "keydown", k(this.ra, this));
        this.I = 0;
        this.e(window, "touchstart", k(this.Ba, this));
        this.e(window, "touchmove", k(this.Aa, this));
        this.e(window, "touchend", k(this.za, this));
        this.da = new Q(1);
        this.c(new S(new U([this.da, new P(function () {
            gb($)
        })])));
        eb($)
    };
    h.qa = function () {
        K(new xb)
    };
    h.N = function (a, b) {
        this.R && this.R.j();
        this.R = new mb(b);
        z(this, this.R, this.Ea)
    };
    h.ya = function () {
        this.f.element.textContent = String($.f);
        if ($.f > 0) {
            ka(this.f, 2);
            this.f.c(new F(1, 1, 1, "ease-in", ea, void 0))
        }
    };
    h.sa = function () {
        this.da.Y = 1E3 / $.h;
        this.h.element.textContent = "第 " + $.h + " 关";
        if ($.h > 1) {
            wb(this.M, "Level " + Da(String($.h)));
            ka(this.h, 2);
            this.h.c(new F(1, 1, 1, "ease-in", ea, void 0))
        }
    };
    h.ra = function (a) {
        if (m == this) {
            switch (a.keyCode) {
            case 27:
                K(new ub);
                break;
            case 37:
                hb($, -1, 0);
                break;
            case 39:
                hb($, 1, 0);
                break;
            case 38:
                $.rotate();
                break;
            case 40:
                jb($);
                break;
            default:
                return
            }
            a.preventDefault()
        }
    };
    h.Ba = function (a) {
        if (m == this) {
            var b = a.touches[0];
            this.$ = b.clientX;
            this.I = 1;
            this.W = b.clientY;
            this.P = a.timeStamp;
            this.X = this.fa = null
        }
    };
    h.Aa = function (a) {
        if (m == this) {
            var b = a.touches[0];
            this.fa = this.W;
            this.X = this.P;
            this.W = b.clientY;
            this.P = a.timeStamp;
            a = b.clientX - this.$;
            if (a > Z) hb($, 1, 0);
            else if (a < -Z) hb($, -1, 0);
            else return;
            this.$ = b.clientX;
            this.I = 2
        }
    };
    h.za = function () {
        if (m == this) {
            if (this.X && (this.W - this.fa) / (this.P - this.X) > 0.25) jb($);
            else this.I == 1 && $.rotate();
            this.P = this.I = 0
        }
    };
    var yb = "ontouchstart" in window,
        zb = null,
        Ab = 0;

    function Bb(a) {
        var b = "";
        switch (a.type) {
        case "mousedown":
            b = "touchstart";
            zb = a.target;
            break;
        case "mousemove":
            if (!zb) return;
            b = "touchmove";
            break;
        case "mouseup":
            b = "touchend";
            Ab++
        }
        a = {
            clientX: a.clientX,
            clientY: a.clientY,
            identifier: Ab,
            pageX: a.pageX,
            pageY: a.pageY,
            screenX: a.screenX,
            screenY: a.screenY,
            target: zb
        };
        var c = document.createEvent("UIEvent");
        c.initEvent(b, true, false);
        c.type = b;
        c.touches = b == "touchend" ? [] : [a];
        c.targetTouches = b == "touchend" ? [] : [a];
        c.changedTouches = [a];
        zb.dispatchEvent(c);
        if (b == "touchend") zb =
            null
    };
    if (!yb) {
        document.addEventListener("mousemove", Bb, true);
        document.addEventListener("mouseup", Bb, true);
        document.addEventListener("mousedown", Bb, true)
    }
    var Cb;
    try {
        Cb = JSON.parse(localStorage["hydra:tetris"] || null)
    } catch (Db) {
        Cb = null
    }
    n = Cb || {};
    var Eb = new pb(false);
    K(Eb);
    da = Date.now();
    setInterval(function () {
        var a = Date.now();
        m.update(a - da);
        da = a
    }, 1E3 / 30);
    var Fb = new O("intro"),
        Gb = new t(r("darkness"));
    Gb.c(new U([new ma("opacity", "0", 1, "ease-in", void 0), new P(J)]));
    z(Fb, Gb);
    K(Fb);

    function Hb() {
        (document.body.offsetWidth > 320 && document.body.offsetHeight < 416) & !(m instanceof Ca) && K(new Ca)
    }
    window.addEventListener("orientationchange", Hb, false);
    Hb();
    window.addEventListener("resize", function () {
        window.setTimeout(window.scrollTo, 0, 1, 0)
    }, false);
    document.addEventListener("touchstart", function (a) {
        a.preventDefault();
        window.scrollTo(0, 1)
    }, true);
    window.scrollTo(0, 1);
    if ("applicationCache" in window) {
        applicationCache.addEventListener("updateready", applicationCache.swapCache, false);
        applicationCache.status == 2 && applicationCache.update()
    };
})()