(function (a, b) {
    function v() {
        var a = e++;
        return a in i ? v() : a
    }

    function w(a) {
        if (null === a || "object" != typeof a) return a;
        var b = a.constructor();
        for (var c in a) b[c] = w(a[c]);
        return b
    }
    var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, d = function (a) {
            return new d.fn.init(a)
        }, u = function () {
            e = 1, f = 50, g = 1, h = {}, i = {}, entityFactories = {}, j = {}, k = [], o = 0, p = 1e3 / f, q = (new Date).getTime(), r = Array.prototype.slice, s = /\s*,\s*/, t = /\s+/
        };
    u(), d.fn = d.prototype = {
        init: function (a) {
            if ("string" != typeof a) return a || (a = 0, a in i || (i[a] = this)), a in i ? (this[0] = a, this.length = 1, this.__c || (this.__c = {}), i[a] || (i[a] = this), i[a]) : (this.length = 0, this);
            var c, d, g, j, k, l, m, b = 0,
                e = !1,
                f = !1;
            if ("*" === a) {
                for (c in i) this[+c] = i[c], b++;
                return this.length = b, this
            } - 1 !== a.indexOf(",") ? (f = !0, g = s) : -1 !== a.indexOf(" ") && (e = !0, g = t);
            for (c in i)
                if (i.hasOwnProperty(c))
                    if (d = i[c], e || f) {
                        for (j = a.split(g), l = 0, m = j.length, k = 0; m > l; l++) d.__c[j[l]] && k++;
                        (e && k === m || f && k > 0) && (this[b++] = +c)
                    } else d.__c[a] && (this[b++] = +c);
            if (b > 0 && !e && !f && this.extend(h[a]), j && e)
                for (l = 0; m > l; l++) this.extend(h[j[l]]);
            return this.length = b, 1 === b ? i[this[b - 1]] : this
        },
        setName: function (a) {
            var b = a + "";
            return this._entityName = b, this.trigger("NewEntityName", b), this
        },
        addComponent: function (a) {
            var d, f, g, b = [],
                c = 0,
                e = 0;
            if (arguments.length > 1)
                for (f = arguments.length; f > e; e++) this.__c[arguments[e]] = !0, b.push(arguments[e]);
            else if (-1 !== a.indexOf(","))
                for (g = a.split(s), f = g.length; f > e; e++) this.__c[g[e]] = !0, b.push(g[e]);
            else this.__c[a] = !0, b.push(a);
            for (d = b.length; d > c; c++) comp = h[b[c]], this.extend(comp), comp && "init" in comp && comp.init.call(this);
            return this.trigger("NewComponent", d), this
        },
        toggleComponent: function (a) {
            var c, d, b = 0;
            if (arguments.length > 1)
                for (c = arguments.length; c > b; b++) this.has(arguments[b]) ? this.removeComponent(arguments[b]) : this.addComponent(arguments[b]);
            else if (-1 !== a.indexOf(","))
                for (d = a.split(s), c = d.length; c > b; b++) this.has(d[b]) ? this.removeComponent(d[b]) : this.addComponent(d[b]);
            else this.has(a) ? this.removeComponent(a) : this.addComponent(a);
            return this
        },
        requires: function (a) {
            for (var e, b = a.split(s), c = 0, d = b.length; d > c; ++c) e = b[c], this.has(e) || this.addComponent(e);
            return this
        },
        removeComponent: function (a, b) {
            if (b === !1) {
                var d, c = h[a];
                for (d in c) delete this[d]
            }
            return delete this.__c[a], this.trigger("RemoveComponent", a), this
        },
        has: function (a) {
            return !!this.__c[a]
        },
        attr: function (a, b) {
            if (1 === arguments.length) return "string" == typeof a ? this[a] : (this.extend(a), this.trigger("Change", a), this);
            this[a] = b;
            var c = {};
            return c[a] = b, this.trigger("Change", c), this
        },
        toArray: function () {
            return r.call(this, 0)
        },
        timeout: function (a, b) {
            return this.each(function () {
                var c = this;
                setTimeout(function () {
                    a.call(c)
                }, b)
            }), this
        },
        bind: function (a, b) {
            if (1 === this.length) {
                j[a] || (j[a] = {});
                var c = j[a];
                return c[this[0]] || (c[this[0]] = []), c[this[0]].push(b), this
            }
            return this.each(function () {
                j[a] || (j[a] = {});
                var c = j[a];
                c[this[0]] || (c[this[0]] = []), c[this[0]].push(b)
            }), this
        },
        unbind: function (a, b) {
            return this.each(function () {
                var e, f, c = j[a],
                    d = 0;
                if (!c || !c[this[0]]) return this;
                if (e = c[this[0]].length, !b) return delete c[this[0]], this;
                for (; e > d; d++) f = c[this[0]], f[d] == b && (f.splice(d, 1), d--)
            }), this
        },
        trigger: function (a, b) {
            if (1 === this.length) {
                if (j[a] && j[a][this[0]])
                    for (var c = j[a][this[0]], d = 0, e = c.length; e > d; d++) c[d].call(this, b);
                return this
            }
            return this.each(function () {
                if (j[a] && j[a][this[0]])
                    for (var c = j[a][this[0]], d = 0, e = c.length; e > d; d++) c[d].call(this, b)
            }), this
        },
        each: function (a) {
            for (var b = 0, c = this.length; c > b; b++) i[this[b]] && a.call(i[this[b]], b);
            return this
        },
        clone: function () {
            var b, c, a = this.__c,
                e = d.e();
            for (b in a) e.addComponent(b);
            for (c in this) "0" != c && "_global" != c && "_changed" != c && "function" != typeof this[c] && "object" != typeof this[c] && (e[c] = this[c]);
            return e
        },
        setter: function (a, b) {
            return d.support.setter ? this.__defineSetter__(a, b) : d.support.defineProperty ? Object.defineProperty(this, a, {
                    set: b,
                    configurable: !0
                }) : n.push({
                    prop: a,
                    obj: this,
                    fn: b
                }), this
        },
        destroy: function () {
            this.each(function () {
                this.trigger("Remove");
                for (var a in j) this.unbind(a);
                delete i[this[0]]
            })
        }
    }, d.fn.init.prototype = d.fn, d.extend = d.fn.extend = function (a) {
        var c, b = this;
        if (!a) return b;
        for (c in a) b !== a[c] && (b[c] = a[c]);
        return b
    }, d.extend({
            init: function (a, b) {
                return d.viewport.init(a, b), this.trigger("Load"), this.timer.init(), this
            },
            getVersion: function () {
                return "0.5.3"
            },
            stop: function (c) {
                if (this.timer.stop(), c) {
                    if (d.stage && d.stage.elem.parentNode) {
                        var e = document.createElement("div");
                        e.id = "cr-stage", d.stage.elem.parentNode.replaceChild(e, d.stage.elem)
                    }
                    u(), b(d, a, a.document)
                }
                return d.trigger("CraftyStop"), this
            },
            pause: function (a) {
                return (1 == arguments.length ? a : !this._paused) ? (this.trigger("Pause"), this._paused = !0, setTimeout(function () {
                            d.timer.stop()
                        }, 0), d.keydown = {}) : (this.trigger("Unpause"), this._paused = !1, setTimeout(function () {
                            d.timer.init()
                        }, 0)), this
            },
            isPaused: function () {
                return this._paused
            },
            timer: {
                prev: +new Date,
                current: +new Date,
                currentTime: +new Date,
                frames: 0,
                frameTime: 0,
                init: function () {
                    var b = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || null;
                    b ? (l = function () {
                        d.timer.step(), m = b(l)
                    }, l()) : l = setInterval(function () {
                        d.timer.step()
                    }, 1e3 / f)
                },
                stop: function () {
                    d.trigger("CraftyStopTimer"), "number" == typeof l && clearInterval(l);
                    var b = a.cancelRequestAnimationFrame || a.webkitCancelRequestAnimationFrame || a.mozCancelRequestAnimationFrame || a.oCancelRequestAnimationFrame || a.msCancelRequestAnimationFrame || null;
                    b && b(m), l = null
                },
                step: function () {
                    for (o = 0, this.currentTime = +new Date, this.currentTime - q > 60 * p && (q = this.currentTime - p); this.currentTime > q;) d.trigger("EnterFrame", {
                            frame: g++
                        }), q += p, o++;
                    o && d.DrawManager.draw(), this.currentTime > this.frameTime ? (d.trigger("MessureFPS", {
                                value: this.frame
                            }), this.frame = 0, this.frameTime = this.currentTime + 1e3) : this.frame++
                },
                getFPS: function () {
                    return f
                },
                simulateFrames: function (a) {
                    for (; a-- > 0;) d.trigger("EnterFrame", {
                            frame: g++
                        });
                    d.DrawManager.draw()
                }
            },
            addEntityFactory: function (a, b) {
                this.entityFactories[a] = b
            },
            newFactoryEntity: function (a) {
                return this.entityTemplates[a]()
            },
            e: function () {
                var b, a = v();
                return i[a] = null, i[a] = b = d(a), arguments.length > 0 && b.addComponent.apply(b, arguments), b.setName("Entity #" + a), b.addComponent("obj"), d.trigger("NewEntity", {
                        id: a
                    }), b
            },
            c: function (a, b) {
                h[a] = b
            },
            trigger: function (a, b) {
                var e, f, g, c = j[a];
                for (e in c)
                    if (c.hasOwnProperty(e))
                        for (f = 0, g = c[e].length; g > f; f++) c[e] && c[e][f] && (i[e] ? c[e][f].call(d(+e), b) : c[e][f].call(d, b))
            },
            bind: function (a, b) {
                j[a] || (j[a] = {});
                var c = j[a];
                return c.global || (c.global = []), c.global.push(b) - 1
            },
            unbind: function (a, b) {
                var d, e, f, c = j[a];
                for (d in c)
                    if (c.hasOwnProperty(d)) {
                        if ("number" == typeof b) return delete c[d][b], !0;
                        for (e = 0, f = c[d].length; f > e; e++)
                            if (c[d][e] === b) return delete c[d][e], !0
                    }
                return !1
            },
            frame: function () {
                return g
            },
            components: function () {
                return h
            },
            isComp: function (a) {
                return a in h
            },
            debug: function () {
                return i
            },
            settings: function () {
                var a = {}, b = {};
                return {
                    register: function (a, c) {
                        b[a] = c
                    },
                    modify: function (c, d) {
                        b[c] && (b[c].call(a[c], d), a[c] = d)
                    },
                    get: function (b) {
                        return a[b]
                    }
                }
            }(),
            clone: w
        }), d.bind("Load", function () {
            !d.support.setter && d.support.defineProperty && (n = [], d.bind("EnterFrame", function () {
                        for (var c, a = 0, b = n.length; b > a; ++a) c = n[a], c.obj[c.prop] !== c.obj["_" + c.prop] && c.fn.call(c.obj, c.obj[c.prop])
                    }))
        }), b(d, a, a.document), a.Crafty = d, "function" == typeof define && define("crafty", [], function () {
            return d
        })
})(window, function (Crafty, window, document) {
    function tweenEnterFrame() {
        if (!(0 >= this._numProps)) {
            var b, c;
            for (c in this._step) b = this._step[c], this[c] += b.val, 0 == --b.rem && (this[c] = b.prop, this.trigger("TweenEnd", c), 0 >= this._step[c].rem && delete this._step[c], this._numProps--);
            if (this.has("Mouse")) {
                var d = Crafty.over,
                    e = Crafty.mousePos;
                d && d[0] == this[0] && !this.isAt(e.x, e.y) ? (this.trigger("MouseOut", Crafty.lastEvent), Crafty.over = null) : d && d[0] == this[0] || !this.isAt(e.x, e.y) || (Crafty.over = this, this.trigger("MouseOver", Crafty.lastEvent))
            }
        }
    }(function (a) {
        function e(a, b, c) {
            this.keys = a, this.map = c, this.obj = b
        }
        var b, c = function (a) {
                b = a || 64, this.map = {}
            }, d = " ";
        c.prototype = {
            insert: function (a) {
                var h, i, b = c.key(a),
                    f = new e(b, a, this),
                    g = 0;
                for (g = b.x1; b.x2 >= g; g++)
                    for (h = b.y1; b.y2 >= h; h++) i = g + d + h, this.map[i] || (this.map[i] = []), this.map[i].push(a);
                return f
            },
            search: function (a, b) {
                var f, g, h, e = c.key(a),
                    i = [];
                for (void 0 === b && (b = !0), f = e.x1; e.x2 >= f; f++)
                    for (g = e.y1; e.y2 >= g; g++) h = f + d + g, this.map[h] && (i = i.concat(this.map[h]));
                if (b) {
                    var j, k, m = [],
                        n = {};
                    for (f = 0, l = i.length; l > f; f++) j = i[f], j && (k = j[0], !n[k] && j.x < a._x + a._w && j._x + j._w > a._x && j.y < a._y + a._h && j._h + j._y > a._y && (n[k] = i[f]));
                    for (j in n) m.push(n[j]);
                    return m
                }
                return i
            },
            remove: function (a, b) {
                var f, g, e = 0;
                for (1 == arguments.length && (b = a, a = c.key(b)), e = a.x1; a.x2 >= e; e++)
                    for (f = a.y1; a.y2 >= f; f++)
                        if (g = e + d + f, this.map[g]) {
                            var i, h = this.map[g],
                                j = h.length;
                            for (i = 0; j > i; i++) h[i] && h[i][0] === b[0] && h.splice(i, 1)
                        }
            },
            boundaries: function () {
                var a, b, c = {
                        max: {
                            x: -1 / 0,
                            y: -1 / 0
                        },
                        min: {
                            x: 1 / 0,
                            y: 1 / 0
                        }
                    }, e = {
                        max: {
                            x: -1 / 0,
                            y: -1 / 0
                        },
                        min: {
                            x: 1 / 0,
                            y: 1 / 0
                        }
                    };
                for (var f in this.map)
                    if (this.map[f].length) {
                        var g = f.split(d),
                            h = g[0],
                            i = g[0];
                        if (h >= c.max.x) {
                            c.max.x = h;
                            for (a in this.map[f]) b = this.map[f][a], "object" == typeof b && "requires" in b && (e.max.x = Math.max(e.max.x, b.x + b.w))
                        }
                        if (c.min.x >= h) {
                            c.min.x = h;
                            for (a in this.map[f]) b = this.map[f][a], "object" == typeof b && "requires" in b && (e.min.x = Math.min(e.min.x, b.x))
                        }
                        if (i >= c.max.y) {
                            c.max.y = i;
                            for (a in this.map[f]) b = this.map[f][a], "object" == typeof b && "requires" in b && (e.max.y = Math.max(e.max.y, b.y + b.h))
                        }
                        if (c.min.y >= i) {
                            c.min.y = i;
                            for (a in this.map[f]) b = this.map[f][a], "object" == typeof b && "requires" in b && (e.min.y = Math.min(e.min.y, b.y))
                        }
                    }
                return e
            }
        }, c.key = function (a) {
            a.hasOwnProperty("mbr") && (a = a.mbr());
            var c = Math.floor(a._x / b),
                d = Math.floor(a._y / b),
                e = Math.floor((a._w + a._x) / b),
                f = Math.floor((a._h + a._y) / b);
            return {
                x1: c,
                y1: d,
                x2: e,
                y2: f
            }
        }, c.hash = function (a) {
            return a.x1 + d + a.y1 + d + a.x2 + d + a.y2
        }, e.prototype = {
            update: function (a) {
                if (c.hash(c.key(a)) != c.hash(this.keys)) {
                    this.map.remove(this.keys, this.obj);
                    var b = this.map.insert(this.obj);
                    this.keys = b.keys
                }
            }
        }, a.HashMap = c
    })(Crafty), Crafty.map = new Crafty.HashMap;
    var M = Math,
        Mc = M.cos,
        Ms = M.sin,
        PI = M.PI,
        DEG_TO_RAD = PI / 180;
    Crafty.c("2D", {
            _x: 0,
            _y: 0,
            _w: 0,
            _h: 0,
            _z: 0,
            _rotation: 0,
            _alpha: 1,
            _visible: !0,
            _globalZ: null,
            _origin: null,
            _mbr: null,
            _entry: null,
            _children: null,
            _parent: null,
            _changed: !1,
            _defineGetterSetter_setter: function () {
                this.__defineSetter__("x", function (a) {
                    this._attr("_x", a)
                }), this.__defineSetter__("y", function (a) {
                    this._attr("_y", a)
                }), this.__defineSetter__("w", function (a) {
                    this._attr("_w", a)
                }), this.__defineSetter__("h", function (a) {
                    this._attr("_h", a)
                }), this.__defineSetter__("z", function (a) {
                    this._attr("_z", a)
                }), this.__defineSetter__("rotation", function (a) {
                    this._attr("_rotation", a)
                }), this.__defineSetter__("alpha", function (a) {
                    this._attr("_alpha", a)
                }), this.__defineSetter__("visible", function (a) {
                    this._attr("_visible", a)
                }), this.__defineGetter__("x", function () {
                    return this._x
                }), this.__defineGetter__("y", function () {
                    return this._y
                }), this.__defineGetter__("w", function () {
                    return this._w
                }), this.__defineGetter__("h", function () {
                    return this._h
                }), this.__defineGetter__("z", function () {
                    return this._z
                }), this.__defineGetter__("rotation", function () {
                    return this._rotation
                }), this.__defineGetter__("alpha", function () {
                    return this._alpha
                }), this.__defineGetter__("visible", function () {
                    return this._visible
                }), this.__defineGetter__("parent", function () {
                    return this._parent
                }), this.__defineGetter__("numChildren", function () {
                    return this._children.length
                })
            },
            _defineGetterSetter_defineProperty: function () {
                Object.defineProperty(this, "x", {
                        set: function (a) {
                            this._attr("_x", a)
                        },
                        get: function () {
                            return this._x
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "y", {
                        set: function (a) {
                            this._attr("_y", a)
                        },
                        get: function () {
                            return this._y
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "w", {
                        set: function (a) {
                            this._attr("_w", a)
                        },
                        get: function () {
                            return this._w
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "h", {
                        set: function (a) {
                            this._attr("_h", a)
                        },
                        get: function () {
                            return this._h
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "z", {
                        set: function (a) {
                            this._attr("_z", a)
                        },
                        get: function () {
                            return this._z
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "rotation", {
                        set: function (a) {
                            this._attr("_rotation", a)
                        },
                        get: function () {
                            return this._rotation
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "alpha", {
                        set: function (a) {
                            this._attr("_alpha", a)
                        },
                        get: function () {
                            return this._alpha
                        },
                        configurable: !0
                    }), Object.defineProperty(this, "visible", {
                        set: function (a) {
                            this._attr("_visible", a)
                        },
                        get: function () {
                            return this._visible
                        },
                        configurable: !0
                    })
            },
            _defineGetterSetter_fallback: function () {
                this.x = this._x, this.y = this._y, this.w = this._w, this.h = this._h, this.z = this._z, this.rotation = this._rotation, this.alpha = this._alpha, this.visible = this._visible, this.bind("EnterFrame", function () {
                    if (this.x !== this._x || this.y !== this._y || this.w !== this._w || this.h !== this._h || this.z !== this._z || this.rotation !== this._rotation || this.alpha !== this._alpha || this.visible !== this._visible) {
                        var a = this.mbr() || this.pos();
                        if (this.rotation !== this._rotation) this._rotate(this.rotation);
                        else {
                            var b = this._mbr,
                                c = !1;
                            b && (this.x !== this._x ? (b._x -= this.x - this._x, c = !0) : this.y !== this._y ? (b._y -= this.y - this._y, c = !0) : this.w !== this._w ? (b._w -= this.w - this._w, c = !0) : this.h !== this._h ? (b._h -= this.h - this._h, c = !0) : this.z !== this._z && (b._z -= this.z - this._z, c = !0)), c && this.trigger("Move", a)
                        }
                        this._x = this.x, this._y = this.y, this._w = this.w, this._h = this.h, this._z = this.z, this._rotation = this.rotation, this._alpha = this.alpha, this._visible = this.visible, this.trigger("Change", a), this.trigger("Move", a)
                    }
                })
            },
            init: function () {
                this._globalZ = this[0], this._origin = {
                    x: 0,
                    y: 0
                }, this._children = [], Crafty.support.setter ? this._defineGetterSetter_setter() : Crafty.support.defineProperty ? this._defineGetterSetter_defineProperty() : this._defineGetterSetter_fallback(), this._entry = Crafty.map.insert(this), this.bind("Move", function (a) {
                    var b = this._mbr || this;
                    this._entry.update(b), this._cascade(a)
                }), this.bind("Rotate", function (a) {
                    var b = this._mbr || this;
                    this._entry.update(b), this._cascade(a)
                }), this.bind("Remove", function () {
                    if (this._children) {
                        for (var a = 0; this._children.length > a; a++) this._children[a].destroy && this._children[a].destroy();
                        this._children = []
                    }
                    this._parent && this._parent.detach(this), Crafty.map.remove(this), this.detach()
                })
            },
            _rotate: function (a) {
                var b = -1 * (a % 360),
                    c = b * DEG_TO_RAD,
                    d = Math.cos(c),
                    e = Math.sin(c),
                    f = {
                        x: this._origin.x + this._x,
                        y: this._origin.y + this._y
                    };
                if (b || (this._mbr = null, !(!this._rotation % 360))) {
                    var g = f.x + (this._x - f.x) * d + (this._y - f.y) * e,
                        h = f.y - (this._x - f.x) * e + (this._y - f.y) * d,
                        i = f.x + (this._x + this._w - f.x) * d + (this._y - f.y) * e,
                        j = f.y - (this._x + this._w - f.x) * e + (this._y - f.y) * d,
                        k = f.x + (this._x + this._w - f.x) * d + (this._y + this._h - f.y) * e,
                        l = f.y - (this._x + this._w - f.x) * e + (this._y + this._h - f.y) * d,
                        m = f.x + (this._x - f.x) * d + (this._y + this._h - f.y) * e,
                        n = f.y - (this._x - f.x) * e + (this._y + this._h - f.y) * d,
                        o = Math.round(Math.min(g, i, k, m)),
                        p = Math.round(Math.min(h, j, l, n)),
                        q = Math.round(Math.max(g, i, k, m)),
                        r = Math.round(Math.max(h, j, l, n));
                    this._mbr = {
                        _x: o,
                        _y: p,
                        _w: q - o,
                        _h: r - p
                    };
                    var s = this._rotation - a,
                        t = s * DEG_TO_RAD;
                    this.trigger("Rotate", {
                            cos: Math.cos(t),
                            sin: Math.sin(t),
                            deg: s,
                            rad: t,
                            o: {
                                x: f.x,
                                y: f.y
                            },
                            matrix: {
                                M11: d,
                                M12: e,
                                M21: -e,
                                M22: d
                            }
                        })
                }
            },
            area: function () {
                return this._w * this._h
            },
            intersect: function (a, b, c, d) {
                var e, f = this._mbr || this;
                return e = "object" == typeof a ? a : {
                    x: a,
                    y: b,
                    w: c,
                    h: d
                }, f._x < e.x + e.w && f._x + f._w > e.x && f._y < e.y + e.h && f._h + f._y > e.y
            },
            within: function (a, b, c, d) {
                var e;
                return e = "object" == typeof a ? a : {
                    x: a,
                    y: b,
                    w: c,
                    h: d
                }, e.x <= this.x && e.x + e.w >= this.x + this.w && e.y <= this.y && e.y + e.h >= this.y + this.h
            },
            contains: function (a, b, c, d) {
                var e;
                return e = "object" == typeof a ? a : {
                    x: a,
                    y: b,
                    w: c,
                    h: d
                }, e.x >= this.x && e.x + e.w <= this.x + this.w && e.y >= this.y && e.y + e.h <= this.y + this.h
            },
            pos: function () {
                return {
                    _x: this._x,
                    _y: this._y,
                    _w: this._w,
                    _h: this._h
                }
            },
            mbr: function () {
                return this._mbr ? {
                    _x: this._mbr._x,
                    _y: this._mbr._y,
                    _w: this._mbr._w,
                    _h: this._mbr._h
                } : this.pos()
            },
            isAt: function (a, b) {
                return this.mapArea ? this.mapArea.containsPoint(a, b) : this.map ? this.map.containsPoint(a, b) : a >= this.x && this.x + this.w >= a && b >= this.y && this.y + this.h >= b
            },
            move: function (a, b) {
                return "n" === a.charAt(0) && (this.y -= b), "s" === a.charAt(0) && (this.y += b), ("e" === a || "e" === a.charAt(1)) && (this.x += b), ("w" === a || "w" === a.charAt(1)) && (this.x -= b), this
            },
            shift: function (a, b, c, d) {
                return a && (this.x += a), b && (this.y += b), c && (this.w += c), d && (this.h += d), this
            },
            _cascade: function (a) {
                if (a) {
                    var e, b = 0,
                        c = this._children,
                        d = c.length;
                    if (a.cos)
                        for (; d > b; ++b) e = c[b], "rotate" in e && e.rotate(a);
                    else
                        for (var f = this._mbr || this, g = f._x - a._x, h = f._y - a._y, i = f._w - a._w, j = f._h - a._h; d > b; ++b) e = c[b], e.shift(g, h, i, j)
                }
            },
            attach: function () {
                for (var d, a = 0, b = arguments, c = arguments.length; c > a; ++a) d = b[a], d._parent && d._parent.detach(d), d._parent = this, this._children.push(d);
                return this
            },
            detach: function (a) {
                if (!a) {
                    for (var b = 0; this._children.length > b; b++) this._children[b]._parent = null;
                    return this._children = [], this
                }
                for (var b = 0; this._children.length > b; b++) this._children[b] == a && this._children.splice(b, 1);
                return a._parent = null, this
            },
            origin: function (a, b) {
                if ("string" == typeof a)
                    if ("centre" === a || "center" === a || -1 === a.indexOf(" ")) a = this._w / 2, b = this._h / 2;
                    else {
                        var c = a.split(" ");
                        "top" === c[0] ? b = 0 : "bottom" === c[0] ? b = this._h : ("middle" === c[0] || "center" === c[1] || "centre" === c[1]) && (b = this._h / 2), "center" === c[1] || "centre" === c[1] || "middle" === c[1] ? a = this._w / 2 : "left" === c[1] ? a = 0 : "right" === c[1] && (a = this._w)
                    }
                return this._origin.x = a, this._origin.y = b, this
            },
            flip: function (a) {
                a = a || "X", this["_flip" + a] || (this["_flip" + a] = !0, this.trigger("Change"))
            },
            unflip: function (a) {
                a = a || "X", this["_flip" + a] && (this["_flip" + a] = !1, this.trigger("Change"))
            },
            rotate: function (a) {
                this._origin.x = a.o.x - this._x, this._origin.y = a.o.y - this._y, this.rotation -= a.deg
            },
            _attr: function (a, b) {
                var c = this.pos(),
                    d = this.mbr() || c;
                if ("_rotation" === a) this._rotate(b), this.trigger("Rotate");
                else if ("_z" === a) this._globalZ = parseInt(b + Crafty.zeroFill(this[0], 5), 10), this.trigger("reorder");
                else if ("_x" == a || "_y" === a || "_w" === a || "_h" === a) {
                    var e = this._mbr;
                    e && (e[a] -= this[a] - b), this[a] = b, this.trigger("Move", d)
                }
                this[a] = b, this.trigger("Change", d)
            }
        }), Crafty.c("Physics", {
            _gravity: .4,
            _friction: .2,
            _bounce: .5,
            gravity: function (a) {
                this._gravity = a
            }
        }), Crafty.c("Gravity", {
            _gravityConst: .2,
            _gy: 0,
            _falling: !0,
            _anti: null,
            init: function () {
                this.requires("2D")
            },
            gravity: function (a) {
                return a && (this._anti = a), this.bind("EnterFrame", this._enterFrame), this
            },
            gravityConst: function (a) {
                return this._gravityConst = a, this
            },
            _enterFrame: function () {
                this._falling ? (this._gy += this._gravityConst, this.y += this._gy) : this._gy = 0;
                var a, d, f, b = !1,
                    c = this.pos(),
                    e = 0;
                for (c._y++, c.x = c._x, c.y = c._y, c.w = c._w, c.h = c._h, d = Crafty.map.search(c), f = d.length; f > e; ++e)
                    if (a = d[e], a !== this && a.has(this._anti) && a.intersect(c)) {
                        b = a;
                        break
                    }
                b ? this._falling && this.stopFalling(b) : this._falling = !0
            },
            stopFalling: function (a) {
                a && (this.y = a._y - this._h), this._falling = !1, this._up && (this._up = !1), this.trigger("hit")
            },
            antigravity: function () {
                this.unbind("EnterFrame", this._enterFrame)
            }
        }), Crafty.polygon = function (a) {
        arguments.length > 1 && (a = Array.prototype.slice.call(arguments, 0)), this.points = a
    }, Crafty.polygon.prototype = {
        containsPoint: function (a, b) {
            var d, e, c = this.points,
                f = !1;
            for (d = 0, e = c.length - 1; c.length > d; e = d++) c[d][1] > b != c[e][1] > b && (c[e][0] - c[d][0]) * (b - c[d][1]) / (c[e][1] - c[d][1]) + c[d][0] > a && (f = !f);
            return f
        },
        shift: function (a, b) {
            for (var e, c = 0, d = this.points.length; d > c; c++) e = this.points[c], e[0] += a, e[1] += b
        },
        rotate: function (a) {
            for (var d, e, f, b = 0, c = this.points.length; c > b; b++) d = this.points[b], e = a.o.x + (d[0] - a.o.x) * a.cos + (d[1] - a.o.y) * a.sin, f = a.o.y - (d[0] - a.o.x) * a.sin + (d[1] - a.o.y) * a.cos, d[0] = e, d[1] = f
        }
    }, Crafty.circle = function (a, b, c) {
        this.x = a, this.y = b, this.radius = c, this.points = [];
        for (var d, e = 0; 8 > e; e++) d = e * Math.PI / 4, this.points[e] = [this.x + Math.sin(d) * c, this.y + Math.cos(d) * c]
    }, Crafty.circle.prototype = {
        containsPoint: function (a, b) {
            var c = this.radius,
                e = (Math.sqrt, this.x - a),
                f = this.y - b;
            return c * c > e * e + f * f
        },
        shift: function (a, b) {
            this.x += a, this.y += b;
            for (var e, c = 0, d = this.points.length; d > c; c++) e = this.points[c], e[0] += a, e[1] += b
        },
        rotate: function () {}
    }, Crafty.matrix = function (a) {
        this.mtx = a, this.width = a[0].length, this.height = a.length
    }, Crafty.matrix.prototype = {
        x: function (a) {
            if (this.width == a.height) {
                for (var b = [], c = 0; this.height > c; c++) {
                    b[c] = [];
                    for (var d = 0; a.width > d; d++) {
                        for (var e = 0, f = 0; this.width > f; f++) e += this.mtx[c][f] * a.mtx[f][d];
                        b[c][d] = e
                    }
                }
                return new Crafty.matrix(b)
            }
        },
        e: function (a, b) {
            return 1 > a || a > this.mtx.length || 1 > b || b > this.mtx[0].length ? null : this.mtx[a - 1][b - 1]
        }
    }, Crafty.c("Collision", {
            init: function () {
                this.requires("2D");
                var a = this._mbr || this;
                poly = new Crafty.polygon([0, 0], [a._w, 0], [a._w, a._h], [0, a._h]), this.map = poly, this.attach(this.map), this.map.shift(a._x, a._y)
            },
            collision: function (a) {
                var b = this._mbr || this;
                if (a || (a = new Crafty.polygon([0, 0], [b._w, 0], [b._w, b._h], [0, b._h])), arguments.length > 1) {
                    var c = Array.prototype.slice.call(arguments, 0);
                    a = new Crafty.polygon(c)
                }
                return this.map = a, this.attach(this.map), this.map.shift(b._x, b._y), this
            },
            hit: function (a) {
                var g, h, i, j, b = this._mbr || this,
                    c = Crafty.map.search(b, !1),
                    d = 0,
                    e = c.length,
                    f = {}, k = "map" in this && "containsPoint" in this.map,
                    l = [];
                if (!e) return !1;
                for (; e > d; ++d) h = c[d], i = h._mbr || h, h && (g = h[0], !f[g] && this[0] !== g && h.__c[a] && i._x < b._x + b._w && i._x + i._w > b._x && i._y < b._y + b._h && i._h + i._y > b._y && (f[g] = h));
                for (j in f)
                    if (h = f[j], k && "map" in h) {
                        var m = this._SAT(this.map, h.map);
                        m.obj = h, m.type = "SAT", m && l.push(m)
                    } else l.push({
                            obj: h,
                            type: "MBR"
                        });
                return l.length ? l : !1
            },
            onHit: function (a, b, c) {
                var d = !1;
                return this.bind("EnterFrame", function () {
                    var e = this.hit(a);
                    e ? (d = !0, b.call(this, e)) : d && ("function" == typeof c && c.call(this), d = !1)
                }), this
            },
            _SAT: function (a, b) {
                for (var g, j, k, l, m, n, o, s, t, u, c = a.points, d = b.points, e = 0, f = c.length, h = d.length, i = {
                            x: 0,
                            y: 0
                        }, p = null, q = null, r = null; f > e; e++) {
                    for (t = c[e == f - 1 ? 0 : e + 1], u = c[e], i.x = -(t[1] - u[1]), i.y = t[0] - u[0], j = Math.sqrt(i.x * i.x + i.y * i.y), i.x /= j, i.y /= j, k = l = -1, m = n = -1, g = 0; f > g; ++g) s = c[g][0] * i.x + c[g][1] * i.y, (s > m || -1 === m) && (m = s), (k > s || -1 === k) && (k = s);
                    for (g = 0; h > g; ++g) s = d[g][0] * i.x + d[g][1] * i.y, (s > n || -1 === n) && (n = s), (l > s || -1 === l) && (l = s);
                    if (l > k ? (o = l - m, i.x = -i.x, i.y = -i.y) : o = k - n, o >= 0) return !1;
                    (null === p || o > p) && (p = o, r = {
                            x: i.x,
                            y: i.y
                        })
                }
                for (e = 0; h > e; e++) {
                    for (t = d[e == h - 1 ? 0 : e + 1], u = d[e], i.x = -(t[1] - u[1]), i.y = t[0] - u[0], j = Math.sqrt(i.x * i.x + i.y * i.y), i.x /= j, i.y /= j, k = l = -1, m = n = -1, g = 0; f > g; ++g) s = c[g][0] * i.x + c[g][1] * i.y, (s > m || -1 === m) && (m = s), (k > s || -1 === k) && (k = s);
                    for (g = 0; h > g; ++g) s = d[g][0] * i.x + d[g][1] * i.y, (s > n || -1 === n) && (n = s), (l > s || -1 === l) && (l = s);
                    if (l > k ? (o = l - m, i.x = -i.x, i.y = -i.y) : o = k - n, o >= 0) return !1;
                    (null === p || o > p) && (p = o), (o > q || null === q) && (q = o, r = {
                            x: i.x,
                            y: i.y
                        })
                }
                return {
                    overlap: q,
                    normal: r
                }
            }
        }), Crafty.c("WiredHitBox", {
            init: function () {
                if (Crafty.support.canvas) {
                    var a = document.getElementById("HitBox");
                    a || (a = document.createElement("canvas"), a.id = "HitBox", a.width = Crafty.viewport.width, a.height = Crafty.viewport.height, a.style.position = "absolute", a.style.left = "0px", a.style.top = "0px", a.style.zIndex = "1000", Crafty.stage.elem.appendChild(a));
                    var b = a.getContext("2d"),
                        c = 0,
                        d = Crafty("WiredHitBox").length;
                    this.requires("Collision").bind("EnterFrame", function () {
                        c == d && (b.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height), c = 0), b.beginPath();
                        for (var a in this.map.points) b.lineTo(Crafty.viewport.x + this.map.points[a][0], Crafty.viewport.y + this.map.points[a][1]);
                        b.closePath(), b.stroke(), c++
                    })
                }
                return this
            }
        }), Crafty.c("SolidHitBox", {
            init: function () {
                if (Crafty.support.canvas) {
                    var a = document.getElementById("HitBox");
                    a || (a = document.createElement("canvas"), a.id = "HitBox", a.width = Crafty.viewport.width, a.height = Crafty.viewport.height, a.style.position = "absolute", a.style.left = "0px", a.style.top = "0px", a.style.zIndex = "1000", Crafty.stage.elem.appendChild(a));
                    var b = a.getContext("2d"),
                        c = 0,
                        d = Crafty("SolidHitBox").length;
                    this.requires("Collision").bind("EnterFrame", function () {
                        c == d && (b.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height), c = 0), b.beginPath();
                        for (var a in this.map.points) b.lineTo(Crafty.viewport.x + this.map.points[a][0], Crafty.viewport.y + this.map.points[a][1]);
                        b.closePath(), b.fill(), c++
                    })
                }
                return this
            }
        }), Crafty.c("DOM", {
            _element: null,
            _cssStyles: null,
            init: function () {
                function a() {
                    var a = 0,
                        b = this.__c,
                        c = "";
                    for (a in b) c += " " + a;
                    c = c.substr(1), this._element.className = c
                }
                this._cssStyles = {
                    visibility: "",
                    left: "",
                    top: "",
                    width: "",
                    height: "",
                    zIndex: "",
                    opacity: "",
                    transformOrigin: "",
                    transform: ""
                }, this._element = document.createElement("div"), Crafty.stage.inner.appendChild(this._element), this._element.style.position = "absolute", this._element.id = "ent" + this[0], this.bind("Change", function () {
                    this._changed || (this._changed = !0, Crafty.DrawManager.add(this))
                }), this.bind("NewComponent", a).bind("RemoveComponent", a), "ms" === Crafty.support.prefix && 9 > Crafty.support.version && (this._filters = {}, this.bind("Rotate", function (a) {
                            var b = a.matrix,
                                d = (this._element.style, b.M11.toFixed(8)),
                                e = b.M12.toFixed(8),
                                f = b.M21.toFixed(8),
                                g = b.M22.toFixed(8);
                            this._filters.rotation = "progid:DXImageTransform.Microsoft.Matrix(M11=" + d + ", M12=" + e + ", M21=" + f + ", M22=" + g + ",sizingMethod='auto expand')"
                        })), this.bind("Remove", this.undraw), this.bind("RemoveComponent", function (a) {
                        "DOM" === a && this.undraw()
                    })
            },
            getDomId: function () {
                return this._element.id
            },
            DOM: function (a) {
                return a && a.nodeType && (this.undraw(), this._element = a, this._element.style.position = "absolute"), this
            },
            draw: function () {
                var a = this._element.style,
                    b = this.__coord || [0, 0, 0, 0],
                    c = {
                        x: b[0],
                        y: b[1]
                    }, d = Crafty.support.prefix,
                    e = [];
                if (this._cssStyles.visibility != this._visible && (this._cssStyles.visibility = this._visible, a.visibility = this._visible ? "visible" : "hidden"), Crafty.support.css3dtransform ? e.push("translate3d(" + ~~this._x + "px," + ~~this._y + "px,0)") : (this._cssStyles.left != this._x && (this._cssStyles.left = this._x, a.left = ~~this._x + "px"), this._cssStyles.top != this._y && (this._cssStyles.top = this._y, a.top = ~~this._y + "px")), this._cssStyles.width != this._w && (this._cssStyles.width = this._w, a.width = ~~this._w + "px"), this._cssStyles.height != this._h && (this._cssStyles.height = this._h, a.height = ~~this._h + "px"), this._cssStyles.zIndex != this._z && (this._cssStyles.zIndex = this._z, a.zIndex = this._z), this._cssStyles.opacity != this._alpha && (this._cssStyles.opacity = this._alpha, a.opacity = this._alpha, a[d + "Opacity"] = this._alpha), "ms" === d && 9 > Crafty.support.version && (this._filters.alpha = 8 === Crafty.support.version ? "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + 100 * this._alpha + ")" : "alpha(opacity=" + 100 * this._alpha + ")"), this._mbr) {
                    var f = this._origin.x + "px " + this._origin.y + "px";
                    a.transformOrigin = f, a[d + "TransformOrigin"] = f, Crafty.support.css3dtransform ? e.push("rotateZ(" + this._rotation + "deg)") : e.push("rotate(" + this._rotation + "deg)")
                }
                return this._flipX && (e.push("scaleX(-1)"), "ms" === d && 9 > Crafty.support.version && (this._filters.flipX = "fliph")), this._flipY && (e.push("scaleY(-1)"), "ms" === d && 9 > Crafty.support.version && (this._filters.flipY = "flipv")), "ms" === d && 9 > Crafty.support.version && this.applyFilters(), this._cssStyles.transform != e.join(" ") && (this._cssStyles.transform = e.join(" "), a.transform = this._cssStyles.transform, a[d + "Transform"] = this._cssStyles.transform), this.trigger("Draw", {
                        style: a,
                        type: "DOM",
                        co: c
                    }), this
            },
            applyFilters: function () {
                this._element.style.filter = "";
                var a = "";
                for (var b in this._filters) this._filters.hasOwnProperty(b) && (a += this._filters[b] + " ");
                this._element.style.filter = a
            },
            undraw: function () {
                return this._element && Crafty.stage.inner.removeChild(this._element), this
            },
            css: function (a, b) {
                var c, e, d = this._element,
                    f = d.style;
                if ("object" == typeof a)
                    for (c in a) a.hasOwnProperty(c) && (e = a[c], "number" == typeof e && (e += "px"), f[Crafty.DOM.camelize(c)] = e);
                else {
                    if (!b) return Crafty.DOM.getStyle(d, a);
                    "number" == typeof b && (b += "px"), f[Crafty.DOM.camelize(a)] = b
                }
                return this.trigger("Change"), this
            }
        });
    try {
        document.execCommand("BackgroundImageCache", !1, !0)
    } catch (e) {}
    Crafty.extend({
            DOM: {
                window: {
                    init: function () {
                        this.width = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth, this.height = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight
                    },
                    width: 0,
                    height: 0
                },
                inner: function (a) {
                    var b = a.getBoundingClientRect(),
                        c = b.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollLeft),
                        d = b.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollTop),
                        e = parseInt(this.getStyle(a, "border-left-width") || 0, 10) || parseInt(this.getStyle(a, "borderLeftWidth") || 0, 10) || 0,
                        f = parseInt(this.getStyle(a, "border-top-width") || 0, 10) || parseInt(this.getStyle(a, "borderTopWidth") || 0, 10) || 0;
                    return c += e, d += f, {
                        x: c,
                        y: d
                    }
                },
                getStyle: function (a, b) {
                    var c;
                    return a.currentStyle ? c = a.currentStyle[this.camelize(b)] : window.getComputedStyle && (c = document.defaultView.getComputedStyle(a, null).getPropertyValue(this.csselize(b))), c
                },
                camelize: function (a) {
                    return a.replace(/-+(.)?/g, function (a, b) {
                        return b ? b.toUpperCase() : ""
                    })
                },
                csselize: function (a) {
                    return a.replace(/[A-Z]/g, function (a) {
                        return a ? "-" + a.toLowerCase() : ""
                    })
                },
                translate: function (a, b) {
                    return {
                        x: (a - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft - Crafty.viewport._x) / Crafty.viewport._zoom,
                        y: (b - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop - Crafty.viewport._y) / Crafty.viewport._zoom
                    }
                }
            }
        }), Crafty.c("FPS", {
            values: [],
            maxValues: 60,
            init: function () {
                this.bind("MessureFPS", function (a) {
                    this.values.length > this.maxValues && this.values.splice(0, 1), this.values.push(a.value)
                })
            }
        }), Crafty.c("HTML", {
            inner: "",
            init: function () {
                this.requires("2D, DOM")
            },
            replace: function (a) {
                return this.inner = a, this._element.innerHTML = a, this
            },
            append: function (a) {
                return this.inner += a, this._element.innerHTML += a, this
            },
            prepend: function (a) {
                return this.inner = a + this.inner, this._element.innerHTML = a + this.inner, this
            }
        }), Crafty.storage = function () {
        function process(a) {
            if (a.c) {
                var b = Crafty.e(a.c).attr(a.attr).trigger("LoadData", a, process);
                return b
            }
            if ("object" == typeof a)
                for (var c in a) a[c] = process(a[c]);
            return a
        }

        function unserialize(str) {
            if ("string" != typeof str) return null;
            var data = JSON ? JSON.parse(str) : eval("(" + str + ")");
            return process(data)
        }

        function prep(a) {
            if (a.__c) {
                var b = {
                    c: [],
                    attr: {}
                };
                a.trigger("SaveData", b, prep);
                for (var c in a.__c) b.c.push(c);
                b.c = b.c.join(", "), a = b
            } else if ("object" == typeof a)
                for (var d in a) a[d] = prep(a[d]);
            return a
        }

        function serialize(a) {
            if (JSON) {
                var b = prep(a);
                return JSON.stringify(b)
            }
            return alert("Crafty does not support saving on your browser. Please upgrade to a newer browser."), !1
        }

        function external(a) {
            url = a
        }

        function openExternal() {
            if (void 0 !== url) {
                var xml = new XMLHttpRequest;
                xhr.open("POST", url), xhr.onreadystatechange = function (evt) {
                    if (4 == xhr.readyState && 200 == xhr.status) {
                        var data = eval("(" + xhr.responseText + ")");
                        for (var i in data) Crafty.storage.check(data[i].key, data[i].timestamp) && loadExternal(data[i].key)
                    }
                }, xhr.send("mode=timestamps&game=" + gameName)
            }
        }

        function saveExternal(a, b, c) {
            if (void 0 !== url) {
                var d = new XMLHttpRequest;
                d.open("POST", url), d.send("mode=save&key=" + a + "&data=" + encodeURIComponent(b) + "&ts=" + c + "&game=" + gameName)
            }
        }

        function loadExternal(key) {
            if (void 0 !== url) {
                var xhr = new XMLHttpRequest;
                xhr.open("POST", url), xhr.onreadystatechange = function (evt) {
                    if (4 == xhr.readyState && 200 == xhr.status) {
                        var data = eval("(" + xhr.responseText + ")");
                        Crafty.storage.save(key, "save", data)
                    }
                }, xhr.send("mode=load&key=" + key + "&game=" + gameName)
            }
        }

        function ts() {
            var a = new Date;
            return a.getTime()
        }
        var db = null,
            url, gameName, timestamps = {}, transactionType = {
                READ: "readonly",
                READ_WRITE: "readwrite"
            };
        return "object" != typeof indexedDB && (window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB, window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction, "object" == typeof IDBTransaction && (transactionType.READ = IDBTransaction.READ || IDBTransaction.readonly || transactionType.READ, transactionType.READ_WRITE = IDBTransaction.READ_WRITE || IDBTransaction.readwrite || transactionType.READ_WRITE)), "object" == typeof indexedDB ? {
            open: function (a) {
                function d() {
                    try {
                        var a = db.transaction(["save"], transactionType.READ),
                            b = a.objectStore("save"),
                            c = b.getAll();
                        c.onsuccess = function () {
                            for (var b = 0, c = event.target.result, d = c.length; d > b; b++) timestamps[c[b].key] = c[b].timestamp
                        }
                    } catch (d) {}
                }

                function e() {
                    var a = db.setVersion("1.0");
                    a.onsuccess = function () {
                        for (var c = 0; b.length > c; c++) {
                            var d = b[c];
                            db.objectStoreNames.contains(d) || db.createObjectStore(d, {
                                    keyPath: "key"
                                })
                        }
                    }
                }
                gameName = a;
                var b = [];
                if (1 == arguments.length ? (b.push("save"), b.push("cache")) : (b = arguments, b.shift(), b.push("save"), b.push("cache")), null == db) {
                    var c = indexedDB.open(gameName);
                    c.onsuccess = function (a) {
                        db = a.target.result, e(), d(), openExternal()
                    }
                } else e(), d(), openExternal()
            },
            save: function (a, b, c) {
                if (null == db) return setTimeout(function () {
                    Crafty.storage.save(a, b, c)
                }, 1), void 0;
                var d = serialize(c),
                    e = ts();
                "save" == b && saveExternal(a, d, e);
                try {
                    var f = db.transaction([b], transactionType.READ_WRITE),
                        g = f.objectStore(b);
                    g.put({
                            data: d,
                            timestamp: e,
                            key: a
                        })
                } catch (i) {
                    console.error(i)
                }
            },
            load: function (a, b, c) {
                if (null == db) return setTimeout(function () {
                    Crafty.storage.load(a, b, c)
                }, 1), void 0;
                try {
                    var d = db.transaction([b], transactionType.READ),
                        e = d.objectStore(b),
                        f = e.get(a);
                    f.onsuccess = function (a) {
                        c(unserialize(a.target.result.data))
                    }
                } catch (g) {
                    console.error(g)
                }
            },
            getAllKeys: function (a, b) {
                null == db && setTimeout(function () {
                    Crafty.storage.getAllkeys(a, b)
                }, 1);
                try {
                    var c = db.transaction([a], transactionType.READ),
                        d = c.objectStore(a),
                        e = d.getCursor(),
                        f = [];
                    e.onsuccess = function (a) {
                        var c = a.target.result;
                        c ? (f.push(c.key), c["continue"]()) : b(f)
                    }
                } catch (g) {
                    console.error(g)
                }
            },
            check: function (a, b) {
                return timestamps[a] > b
            },
            external: external
        } : "function" == typeof openDatabase ? {
            open: function (a) {
                if (gameName = a, 1 == arguments.length) db = {
                    save: openDatabase(a + "_save", "1.0", "Saves games for " + a, 5242880),
                    cache: openDatabase(a + "_cache", "1.0", "Cache for " + a, 5242880)
                };
                else {
                    var b = arguments,
                        c = 0;
                    for (b.shift(); b.length > c; c++) db[b[c]] === void 0 && (db[b[c]] = openDatabase(gameName + "_" + b[c], "1.0", type, 5242880))
                }
                db.save.transaction(function (a) {
                    a.executeSql("SELECT key, timestamp FROM data", [], function (a, b) {
                        for (var c = 0, d = b.rows, e = d.length; e > c; c++) timestamps[d.item(c).key] = d.item(c).timestamp
                    })
                })
            },
            save: function (a, b, c) {
                db[b] === void 0 && "" != gameName && this.open(gameName, b);
                var d = serialize(c),
                    e = ts();
                "save" == b && saveExternal(a, d, e), db[b].transaction(function (b) {
                    b.executeSql("CREATE TABLE IF NOT EXISTS data (key unique, text, timestamp)"), b.executeSql("SELECT * FROM data WHERE key = ?", [a], function (b, c) {
                        c.rows.length ? b.executeSql("UPDATE data SET text = ?, timestamp = ? WHERE key = ?", [d, e, a]) : b.executeSql("INSERT INTO data VALUES (?, ?, ?)", [a, d, e])
                    })
                })
            },
            load: function (a, b, c) {
                return null == db[b] ? (setTimeout(function () {
                            Crafty.storage.load(a, b, c)
                        }, 1), void 0) : (db[b].transaction(function (b) {
                            b.executeSql("SELECT text FROM data WHERE key = ?", [a], function (a, b) {
                                b.rows.length && (res = unserialize(b.rows.item(0).text), c(res))
                            })
                        }), void 0)
            },
            getAllKeys: function (a, b) {
                return null == db[a] ? (setTimeout(function () {
                            Crafty.storage.getAllKeys(a, b)
                        }, 1), void 0) : (db[a].transaction(function (a) {
                            a.executeSql("SELECT key FROM data", [], function (a, c) {
                                b(c.rows)
                            })
                        }), void 0)
            },
            check: function (a, b) {
                return timestamps[a] > b
            },
            external: external
        } : "object" == typeof window.localStorage ? {
            open: function (a) {
                gameName = a
            },
            save: function (a, b, c) {
                var d = gameName + "." + b + "." + a,
                    e = serialize(c),
                    f = ts();
                "save" == b && saveExternal(a, e, f), window.localStorage[d] = e, "save" == b && (window.localStorage[d + ".ts"] = f)
            },
            load: function (a, b, c) {
                var d = gameName + "." + b + "." + a,
                    e = window.localStorage[d];
                c(unserialize(e))
            },
            getAllKeys: function (a, b) {
                var c = {}, d = [],
                    e = gameName + "." + a;
                for (var f in window.localStorage)
                    if (-1 != f.indexOf(e)) {
                        var g = f.replace(e, "").replace(".ts", "");
                        c[g] = !0
                    }
                for (f in c) d.push(f);
                b(d)
            },
            check: function (a, b) {
                var c = window.localStorage[gameName + ".save." + a + ".ts"];
                return parseInt(b) > parseInt(c)
            },
            external: external
        } : {
            open: function (a) {
                gameName = a
            },
            save: function (a, b, c) {
                if ("save" == b) {
                    var d = serialize(c),
                        e = ts();
                    "save" == b && saveExternal(a, d, e), document.cookie = gameName + "_" + a + "=" + d + "; " + gameName + "_" + a + "_ts=" + e + "; expires=Thur, 31 Dec 2099 23:59:59 UTC; path=/"
                }
            },
            load: function (a, b, c) {
                if ("save" == b) {
                    var d = RegExp(gameName + "_" + a + "=[^;]*"),
                        e = d.exec(document.cookie),
                        f = unserialize(e[0].replace(gameName + "_" + a + "=", ""));
                    c(f)
                }
            },
            getAllKeys: function (a, b) {
                if ("save" == a) {
                    for (var c = RegExp(gameName + "_[^_=]", "g"), d = c.exec(document.cookie), e = 0, f = d.length, g = {}, h = []; f > e; e++) {
                        var i = d[e].replace(gameName + "_", "");
                        g[i] = !0
                    }
                    for (e in g) h.push(e);
                    b(h)
                }
            },
            check: function (a, b) {
                var c = gameName + "_" + a + "_ts",
                    d = RegExp(c + "=[^;]"),
                    e = d.exec(document.cookie),
                    f = e[0].replace(c + "=", "");
                return parseInt(b) > parseInt(f)
            },
            external: external
        }
    }(),
    function testSupport() {
        var a = Crafty.support = {}, b = navigator.userAgent.toLowerCase(),
            c = /(webkit)[ \/]([\w.]+)/.exec(b) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(b) || /(ms)ie ([\w.]+)/.exec(b) || /(moz)illa(?:.*? rv:([\w.]+))?/.exec(b) || [],
            d = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(b);
        if (d && (Crafty.mobile = d[0]), a.setter = "__defineSetter__" in this && "__defineGetter__" in this, a.defineProperty = function () {
            if (false in Object) return !1;
            try {
                Object.defineProperty({}, "x", {})
            } catch (a) {
                return !1
            }
            return !0
        }(), a.audio = "Audio" in window, a.prefix = c[1] || c[0], "moz" === a.prefix && (a.prefix = "Moz"), "o" === a.prefix && (a.prefix = "O"), c[2] && (a.versionName = c[2], a.version = +c[2].split(".")[0]), a.canvas = "getContext" in document.createElement("canvas"), a.canvas) {
            var e;
            try {
                e = document.createElement("canvas").getContext("experimental-webgl"), e.viewportWidth = a.canvas.width, e.viewportHeight = a.canvas.height
            } catch (f) {}
            a.webgl = !! e
        } else a.webgl = !1;
        a.css3dtransform = document.createElement("div").style.Perspective !== void 0 || document.createElement("div").style[a.prefix + "Perspective"] !== void 0, a.deviceorientation = window.DeviceOrientationEvent !== void 0 || window.OrientationEvent !== void 0, a.devicemotion = window.DeviceMotionEvent !== void 0
    }(), Crafty.extend({
            zeroFill: function (a, b) {
                return b -= ("" + a).length, b > 0 ? Array(b + (/\./.test(a) ? 2 : 1)).join("0") + a : "" + a
            },
            sprite: function (a, b, c, d, e, f) {
                var g, h, i, j, k, l, m;
                "string" == typeof a && (f = e, e = d, d = b, c = a, a = 1, b = 1), "string" == typeof b && (f = e, e = d, d = c, c = b, b = a), !f && e && (f = e), e = parseInt(e || 0, 10), f = parseInt(f || 0, 10), m = Crafty.asset(c), m || (m = new Image, m.src = c, Crafty.asset(c, m), m.onload = function () {
                    for (g in d) Crafty(g).each(function () {
                        this.ready = !0, this.trigger("Change")
                    })
                });
                for (g in d) d.hasOwnProperty(g) && (h = d[g], i = h[0] * (a + e), j = h[1] * (b + f), k = h[2] * a || a, l = h[3] * b || b, Crafty.c(g, {
                            ready: !1,
                            __coord: [i, j, k, l],
                            init: function () {
                                this.requires("Sprite"), this.__trim = [0, 0, 0, 0], this.__image = c, this.__coord = [this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]], this.__tile = a, this.__tileh = b, this.__padding = [e, f], this.img = m, this.img.complete && this.img.width > 0 && (this.ready = !0, this.trigger("Change")), this.w = this.__coord[2], this.h = this.__coord[3]
                            }
                        }));
                return this
            },
            _events: {},
            addEvent: function (a, b, c, d) {
                3 === arguments.length && (d = c, c = b, b = window.document);
                var e = function (b) {
                    var b = b || window.event;
                    "function" == typeof d && d.call(a, b)
                }, f = a[0] || "";
                this._events[f + b + c + d] || (this._events[f + b + c + d] = e, b.attachEvent ? b.attachEvent("on" + c, e) : b.addEventListener(c, e, !1))
            },
            removeEvent: function (a, b, c, d) {
                3 === arguments.length && (d = c, c = b, b = window.document);
                var e = a[0] || "",
                    f = this._events[e + b + c + d];
                f && (b.detachEvent ? b.detachEvent("on" + c, f) : b.removeEventListener(c, f, !1), delete this._events[e + b + c + d])
            },
            background: function (a) {
                Crafty.stage.elem.style.background = a
            },
            viewport: {
                clampToEntities: !0,
                width: 0,
                height: 0,
                _x: 0,
                _y: 0,
                bounds: null,
                scroll: function (a, b) {
                    b = Math.floor(b);
                    var c = b - this[a],
                        d = Crafty.canvas.context,
                        e = Crafty.stage.inner.style;
                    this[a] = b, d && ("_x" == a ? d.translate(c, 0) : d.translate(0, c), Crafty.DrawManager.drawAll()), e["_x" == a ? "left" : "top"] = b + "px"
                },
                rect: function () {
                    return {
                        _x: -this._x,
                        _y: -this._y,
                        _w: this.width,
                        _h: this.height
                    }
                },
                pan: function () {
                    function d() {
                        var d = 0;
                        for (b in a) {
                            var e = a[b];
                            e.remTime > 0 ? (e.current += e.diff, e.remTime--, Crafty.viewport[b] = Math.floor(e.current), d++) : delete a[b]
                        }
                        d && Crafty.viewport._clamp()
                    }
                    var b, a = {}, c = !1;
                    return function (e, f, g) {
                        if (Crafty.viewport.follow(), "reset" != e) 0 == g && (g = 1), a[e] = {
                            diff: -f / g,
                            current: Crafty.viewport[e],
                            remTime: g
                        }, c || (Crafty.bind("EnterFrame", d), c = !0);
                        else
                            for (b in a) a[b].remTime = 0
                    }
                }(),
                follow: function () {
                    function d() {
                        Crafty.viewport.scroll("_x", -(this.x + this.w / 2 - Crafty.viewport.width / 2 - b)), Crafty.viewport.scroll("_y", -(this.y + this.h / 2 - Crafty.viewport.height / 2 - c)), Crafty.viewport._clamp()
                    }
                    var a, b, c;
                    return function (e, f, g) {
                        a && a.unbind("Change", d), e && e.has("2D") && (Crafty.viewport.pan("reset"), a = e, b = f !== void 0 ? f : 0, c = g !== void 0 ? g : 0, e.bind("Change", d), d.call(e))
                    }
                }(),
                centerOn: function (a, b) {
                    var c = a.x,
                        d = a.y,
                        e = a.w / 2,
                        f = a.h / 2,
                        g = Crafty.viewport.width / 2,
                        h = Crafty.viewport.height / 2,
                        i = c + e - g,
                        j = d + f - h;
                    Crafty.viewport.pan("reset"), Crafty.viewport.pan("x", i, b), Crafty.viewport.pan("y", j, b)
                },
                _zoom: 1,
                zoom: function () {
                    function h() {
                        if (c > 0) {
                            isFinite(Crafty.viewport._zoom) && (a = Crafty.viewport._zoom);
                            var e = {
                                width: f.width * a,
                                height: f.height * a
                            };
                            a += b, Crafty.viewport._zoom = a;
                            var h = {
                                width: f.width * a,
                                height: f.height * a
                            }, i = {
                                    width: h.width - e.width,
                                    height: h.height - e.height
                                };
                            if (Crafty.stage.inner.style[d] = "scale(" + a + "," + a + ")", Crafty.canvas._canvas) {
                                var j = a / (a - b);
                                Crafty.canvas.context.scale(j, j), Crafty.DrawManager.drawAll()
                            }
                            Crafty.viewport.x -= i.width * g.width, Crafty.viewport.y -= i.height * g.height, c--
                        }
                    }
                    var a = 1,
                        b = 0,
                        c = 0,
                        d = Crafty.support.prefix + "Transform",
                        e = !1,
                        f = {}, g = {};
                    return function (d, i, j, k) {
                        var l = this.bounds || Crafty.map.boundaries(),
                            m = d ? a * d : 1;
                        d || (a = 1, this._zoom = 1), f.width = l.max.x - l.min.x, f.height = l.max.y - l.min.y, g.width = i / f.width, g.height = j / f.height, 0 == k && (k = 1), b = (m - a) / k, c = k, Crafty.viewport.pan("reset"), e || (Crafty.bind("EnterFrame", h), e = !0)
                    }
                }(),
                scale: function () {
                    var a = Crafty.support.prefix + "Transform",
                        b = {};
                    return function (c) {
                        var d = this.bounds || Crafty.map.boundaries(),
                            e = c ? this._zoom * c : 1,
                            f = e / this._zoom;
                        this._zoom = e, b.width = d.max.x - d.min.x, b.height = d.max.y - d.min.y, {
                            width: b.width * e,
                            height: b.height * e
                        }, Crafty.viewport.pan("reset"), Crafty.stage.inner.style.transform = Crafty.stage.inner.style[a] = "scale(" + this._zoom + "," + this._zoom + ")", Crafty.canvas._canvas && (Crafty.canvas.context.scale(f, f), Crafty.DrawManager.drawAll())
                    }
                }(),
                mouselook: function () {
                    var a = !1,
                        b = !1,
                        c = {};
                    return old = {},
                    function (d, e) {
                        if ("boolean" == typeof d) return a = d, a ? Crafty.mouseObjs++ : Crafty.mouseObjs = Math.max(0, Crafty.mouseObjs - 1), void 0;
                        if (a) switch (d) {
                        case "move":
                        case "drag":
                            if (!b) return;
                            diff = {
                                x: e.clientX - c.x,
                                y: e.clientY - c.y
                            }, Crafty.viewport.x += diff.x, Crafty.viewport.y += diff.y, Crafty.viewport._clamp();
                        case "start":
                            c.x = e.clientX, c.y = e.clientY, b = !0;
                            break;
                        case "stop":
                            b = !1
                        }
                    }
                }(),
                _clamp: function () {
                    if (this.clampToEntities) {
                        var a = this.bounds || Crafty.map.boundaries();
                        a.max.x *= this._zoom, a.min.x *= this._zoom, a.max.y *= this._zoom, a.min.y *= this._zoom, a.max.x - a.min.x > Crafty.viewport.width ? (a.max.x -= Crafty.viewport.width, Crafty.viewport.x < -a.max.x ? Crafty.viewport.x = -a.max.x : Crafty.viewport.x > -a.min.x && (Crafty.viewport.x = -a.min.x)) : Crafty.viewport.x = -1 * (a.min.x + (a.max.x - a.min.x) / 2 - Crafty.viewport.width / 2), a.max.y - a.min.y > Crafty.viewport.height ? (a.max.y -= Crafty.viewport.height, Crafty.viewport.y < -a.max.y ? Crafty.viewport.y = -a.max.y : Crafty.viewport.y > -a.min.y && (Crafty.viewport.y = -a.min.y)) : Crafty.viewport.y = -1 * (a.min.y + (a.max.y - a.min.y) / 2 - Crafty.viewport.height / 2)
                    }
                },
                init: function (a, b) {
                    Crafty.DOM.window.init(), this.width = !a || Crafty.mobile ? Crafty.DOM.window.width : a, this.height = !b || Crafty.mobile ? Crafty.DOM.window.height : b;
                    var c = document.getElementById("cr-stage");
                    Crafty.stage = {
                        x: 0,
                        y: 0,
                        fullscreen: !1,
                        elem: c ? c : document.createElement("div"),
                        inner: document.createElement("div")
                    }, (!a && !b || Crafty.mobile) && (document.body.style.overflow = "hidden", Crafty.stage.fullscreen = !0), Crafty.addEvent(this, window, "resize", Crafty.viewport.reload), Crafty.addEvent(this, window, "blur", function () {
                        Crafty.settings.get("autoPause") && (Crafty._paused || Crafty.pause())
                    }), Crafty.addEvent(this, window, "focus", function () {
                        Crafty._paused && Crafty.settings.get("autoPause") && Crafty.pause()
                    }), Crafty.settings.register("stageSelectable", function (a) {
                        Crafty.stage.elem.onselectstart = a ? function () {
                            return !0
                        } : function () {
                            return !1
                        }
                    }), Crafty.settings.modify("stageSelectable", !1), Crafty.settings.register("stageContextMenu", function (a) {
                        Crafty.stage.elem.oncontextmenu = a ? function () {
                            return !0
                        } : function () {
                            return !1
                        }
                    }), Crafty.settings.modify("stageContextMenu", !1), Crafty.settings.register("autoPause", function () {}), Crafty.settings.modify("autoPause", !1), c || (document.body.appendChild(Crafty.stage.elem), Crafty.stage.elem.id = "cr-stage");
                    var e, d = Crafty.stage.elem.style;
                    if (Crafty.stage.elem.appendChild(Crafty.stage.inner), Crafty.stage.inner.style.position = "absolute", Crafty.stage.inner.style.zIndex = "1", d.width = this.width + "px", d.height = this.height + "px", d.overflow = "hidden", Crafty.mobile) {
                        // d.position = "absolute", d.left = "0px", d.top = "0px", void 0 != typeof d.webkitTapHighlightColor && (d.webkitTapHighlightColor = "rgba(0,0,0,0)");
                        // var f = document.createElement("meta"),
                        //     g = document.getElementsByTagName("HEAD")[0];
                        // f.setAttribute("name", "viewport"), f.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"), g.appendChild(f), f = document.createElement("meta"), f.setAttribute("name", "apple-mobile-web-app-capable"), f.setAttribute("content", "yes"), g.appendChild(f), setTimeout(function () {
                        //     window.scrollTo(0, 1)
                        // }, 0), Crafty.addEvent(this, window, "touchmove", function (a) {
                        //     a.preventDefault()
                        // }), Crafty.stage.x = 0, Crafty.stage.y = 0
                    } else d.position = "relative", e = Crafty.DOM.inner(Crafty.stage.elem), Crafty.stage.x = e.x, Crafty.stage.y = e.y;
                    Crafty.support.setter ? (this.__defineSetter__("x", function (a) {
                                this.scroll("_x", a)
                            }), this.__defineSetter__("y", function (a) {
                                this.scroll("_y", a)
                            }), this.__defineGetter__("x", function () {
                                return this._x
                            }), this.__defineGetter__("y", function () {
                                return this._y
                            })) : Crafty.support.defineProperty ? (Object.defineProperty(this, "x", {
                                set: function (a) {
                                    this.scroll("_x", a)
                                },
                                get: function () {
                                    return this._x
                                }
                            }), Object.defineProperty(this, "y", {
                                set: function (a) {
                                    this.scroll("_y", a)
                                },
                                get: function () {
                                    return this._y
                                }
                            })) : (this.x = this._x, this.y = this._y, Crafty.e("viewport"))
                },
                reload: function () {
                    Crafty.DOM.window.init();
                    var c, a = Crafty.DOM.window.width,
                        b = Crafty.DOM.window.height;
                    Crafty.stage.fullscreen && (this.width = a, this.height = b, Crafty.stage.elem.style.width = a + "px", Crafty.stage.elem.style.height = b + "px", Crafty.canvas._canvas && (Crafty.canvas._canvas.width = a, Crafty.canvas._canvas.height = b, Crafty.DrawManager.drawAll())), c = Crafty.DOM.inner(Crafty.stage.elem), Crafty.stage.x = c.x, Crafty.stage.y = c.y
                },
                reset: function () {
                    Crafty.viewport.pan("reset"), Crafty.viewport.follow(), Crafty.viewport.mouselook("stop"), Crafty.viewport.scale()
                }
            },
            keys: {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                PAUSE: 19,
                CAPS: 20,
                ESC: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                INSERT: 45,
                DELETE: 46,
                0: 48,
                1: 49,
                2: 50,
                3: 51,
                4: 52,
                5: 53,
                6: 54,
                7: 55,
                8: 56,
                9: 57,
                A: 65,
                B: 66,
                C: 67,
                D: 68,
                E: 69,
                F: 70,
                G: 71,
                H: 72,
                I: 73,
                J: 74,
                K: 75,
                L: 76,
                M: 77,
                N: 78,
                O: 79,
                P: 80,
                Q: 81,
                R: 82,
                S: 83,
                T: 84,
                U: 85,
                V: 86,
                W: 87,
                X: 88,
                Y: 89,
                Z: 90,
                NUMPAD_0: 96,
                NUMPAD_1: 97,
                NUMPAD_2: 98,
                NUMPAD_3: 99,
                NUMPAD_4: 100,
                NUMPAD_5: 101,
                NUMPAD_6: 102,
                NUMPAD_7: 103,
                NUMPAD_8: 104,
                NUMPAD_9: 105,
                MULTIPLY: 106,
                ADD: 107,
                SUBSTRACT: 109,
                DECIMAL: 110,
                DIVIDE: 111,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                PLUS: 187,
                COMMA: 188,
                MINUS: 189,
                PERIOD: 190,
                PULT_UP: 29460,
                PULT_DOWN: 29461,
                PULT_LEFT: 4,
                PULT_RIGHT: 5
            },
            mouseButtons: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            }
        }), Crafty.c("viewport", {
            init: function () {
                this.bind("EnterFrame", function () {
                    Crafty.viewport._x !== Crafty.viewport.x && Crafty.viewport.scroll("_x", Crafty.viewport.x), Crafty.viewport._y !== Crafty.viewport.y && Crafty.viewport.scroll("_y", Crafty.viewport.y)
                })
            }
        }), Crafty.extend({
            device: {
                _deviceOrientationCallback: !1,
                _deviceMotionCallback: !1,
                _normalizeDeviceOrientation: function (a) {
                    var b;
                    window.DeviceOrientationEvent ? b = {
                        tiltLR: a.gamma,
                        tiltFB: a.beta,
                        dir: a.alpha,
                        motUD: null
                    } : window.OrientationEvent && (b = {
                            tiltLR: 90 * a.x,
                            tiltFB: -90 * a.y,
                            dir: null,
                            motUD: a.z
                        }), Crafty.device._deviceOrientationCallback(b)
                },
                _normalizeDeviceMotion: function (a) {
                    var b = a.accelerationIncludingGravity,
                        c = b.z > 0 ? 1 : -1,
                        d = {
                            acceleration: b,
                            rawAcceleration: "[" + Math.round(b.x) + ", " + Math.round(b.y) + ", " + Math.round(b.z) + "]",
                            facingUp: c,
                            tiltLR: Math.round(-90 * (b.x / 9.81)),
                            tiltFB: Math.round(90 * ((b.y + 9.81) / 9.81) * c)
                        };
                    Crafty.device._deviceMotionCallback(d)
                },
                deviceOrientation: function (a) {
                    this._deviceOrientationCallback = a, Crafty.support.deviceorientation && (window.DeviceOrientationEvent ? Crafty.addEvent(this, window, "deviceorientation", this._normalizeDeviceOrientation) : window.OrientationEvent && Crafty.addEvent(this, window, "MozOrientation", this._normalizeDeviceOrientation))
                },
                deviceMotion: function (a) {
                    this._deviceMotionCallback = a, Crafty.support.devicemotion && window.DeviceMotionEvent && Crafty.addEvent(this, window, "devicemotion", this._normalizeDeviceMotion)
                }
            }
        }), Crafty.c("Sprite", {
            __image: "",
            __tile: 0,
            __tileh: 0,
            __padding: null,
            __trim: null,
            img: null,
            ready: !1,
            init: function () {
                this.__trim = [0, 0, 0, 0];
                var a = function (a) {
                    var b = a.co,
                        c = a.pos,
                        d = a.ctx;
                    "canvas" === a.type ? d.drawImage(this.img, b.x, b.y, b.w, b.h, c._x, c._y, c._w, c._h) : "DOM" === a.type && (this._element.style.background = "url('" + this.__image + "') no-repeat -" + b.x + "px -" + b.y + "px")
                };
                this.bind("Draw", a).bind("RemoveComponent", function (b) {
                    "Sprite" === b && this.unbind("Draw", a)
                })
            },
            sprite: function (a, b, c, d) {
                return this.__coord = [a * this.__tile + this.__padding[0] + this.__trim[0], b * this.__tileh + this.__padding[1] + this.__trim[1], this.__trim[2] || c * this.__tile || this.__tile, this.__trim[3] || d * this.__tileh || this.__tileh], this.trigger("Change"), this
            },
            crop: function (a, b, c, d) {
                var e = this._mbr || this.pos();
                return this.__trim = [], this.__trim[0] = a, this.__trim[1] = b, this.__trim[2] = c, this.__trim[3] = d, this.__coord[0] += a, this.__coord[1] += b, this.__coord[2] = c, this.__coord[3] = d, this._w = c, this._h = d, this.trigger("Change", e), this
            }
        }), Crafty.c("Canvas", {
            init: function () {
                Crafty.canvas.context || Crafty.canvas.init(), Crafty.DrawManager.total2D++, this.bind("Change", function (a) {
                    this._changed === !1 ? this._changed = Crafty.DrawManager.add(a || this, this) : a && (this._changed = Crafty.DrawManager.add(a, this))
                }), this.bind("Remove", function () {
                    Crafty.DrawManager.total2D--, Crafty.DrawManager.add(this, this)
                })
            },
            draw: function (a, b, c, d, e) {
                if (this.ready) {
                    4 === arguments.length && (e = d, d = c, c = b, b = a, a = Crafty.canvas.context);
                    var f = {
                        _x: this._x + (b || 0),
                        _y: this._y + (c || 0),
                        _w: d || this._w,
                        _h: e || this._h
                    }, g = a || Crafty.canvas.context,
                        h = this.__coord || [0, 0, 0, 0],
                        i = {
                            x: h[0] + (b || 0),
                            y: h[1] + (c || 0),
                            w: d || h[2],
                            h: e || h[3]
                        };
                    if (this._mbr && (g.save(), g.translate(this._origin.x + this._x, this._origin.y + this._y), f._x = -this._origin.x, f._y = -this._origin.y, g.rotate(this._rotation % 360 * (Math.PI / 180))), (this._flipX || this._flipY) && (g.save(), g.scale(this._flipX ? -1 : 1, this._flipY ? -1 : 1), this._flipX && (f._x = -(f._x + f._w)), this._flipY && (f._y = -(f._y + f._h))), 1 > this._alpha) {
                        var j = g.globalAlpha;
                        g.globalAlpha = this._alpha
                    }
                    return this.trigger("Draw", {
                            type: "canvas",
                            pos: f,
                            co: i,
                            ctx: g
                        }), (this._mbr || this._flipX || this._flipY) && g.restore(), j && (g.globalAlpha = j), this
                }
            }
        }), Crafty.extend({
            canvas: {
                context: null,
                init: function () {
                    if (!Crafty.support.canvas) return Crafty.trigger("NoCanvas"), Crafty.stop(), void 0;
                    var a;
                    a = document.createElement("canvas"), a.width = Crafty.viewport.width, a.height = Crafty.viewport.height, a.style.position = "absolute", a.style.left = "0px", a.style.top = "0px", Crafty.stage.elem.appendChild(a), Crafty.canvas.context = a.getContext("2d"), Crafty.canvas._canvas = a
                }
            }
        }), Crafty.extend({
            over: null,
            mouseObjs: 0,
            mousePos: {},
            lastEvent: null,
            keydown: {},
            selected: !1,
            detectBlur: function (a) {
                var b = a.clientX > Crafty.stage.x && a.clientX < Crafty.stage.x + Crafty.viewport.width && a.clientY > Crafty.stage.y && a.clientY < Crafty.stage.y + Crafty.viewport.height;
                !Crafty.selected && b && Crafty.trigger("CraftyFocus"), Crafty.selected && !b && Crafty.trigger("CraftyBlur"), Crafty.selected = b
            },
            mouseDispatch: function (a) {
                if (Crafty.mouseObjs) {
                    Crafty.lastEvent = a;
                    var c, d, f, h, i, b = -1,
                        e = 0,
                        g = Crafty.DOM.translate(a.clientX, a.clientY),
                        j = {}, k = a.target ? a.target : a.srcElement,
                        l = a.type;
                    if (a.mouseButton = null == a.which ? 2 > a.button ? Crafty.mouseButtons.LEFT : 4 == a.button ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT : 2 > a.which ? Crafty.mouseButtons.LEFT : 2 == a.which ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT, a.realX = h = Crafty.mousePos.x = g.x, a.realY = i = Crafty.mousePos.y = g.y, "CANVAS" != k.nodeName) {
                        for (;
                            "string" != typeof k.id && -1 == k.id.indexOf("ent");) k = k.parentNode;
                        ent = Crafty(parseInt(k.id.replace("ent", ""))), ent.has("Mouse") && ent.isAt(h, i) && (c = ent)
                    }
                    if (!c)
                        for (d = Crafty.map.search({
                                    _x: h,
                                    _y: i,
                                    _w: 1,
                                    _h: 1
                                }, !1), f = d.length; f > e; ++e)
                            if (d[e].__c.Mouse && d[e]._visible) {
                                var m = d[e],
                                    n = !1;
                                if (!j[m[0]] && (j[m[0]] = !0, m.mapArea ? m.mapArea.containsPoint(h, i) && (n = !0) : m.isAt(h, i) && (n = !0), n && (m._z >= b || -1 === b))) {
                                    if (m._z === b && m[0] < c[0]) continue;
                                    b = m._z, c = m
                                }
                            }
                    c ? "mousedown" === l ? c.trigger("MouseDown", a) : "mouseup" === l ? c.trigger("MouseUp", a) : "dblclick" == l ? c.trigger("DoubleClick", a) : "click" == l ? c.trigger("Click", a) : "mousemove" === l ? (c.trigger("MouseMove", a), this.over !== c && (this.over && (this.over.trigger("MouseOut", a), this.over = null), this.over = c, c.trigger("MouseOver", a))) : c.trigger(l, a) : ("mousemove" === l && this.over && (this.over.trigger("MouseOut", a), this.over = null), "mousedown" === l ? Crafty.viewport.mouselook("start", a) : "mousemove" === l ? Crafty.viewport.mouselook("drag", a) : "mouseup" == l && Crafty.viewport.mouselook("stop")), "mousemove" === l && (this.lastEvent = a)
                }
            },
            touchDispatch: function (a) {
                var b, c = Crafty.lastEvent;
                "touchstart" === a.type ? b = "mousedown" : "touchmove" === a.type ? b = "mousemove" : "touchend" === a.type ? b = "mouseup" : "touchcancel" === a.type ? b = "mouseup" : "touchleave" === a.type && (b = "mouseup"), a.touches && a.touches.length ? first = a.touches[0] : a.changedTouches && a.changedTouches.length && (first = a.changedTouches[0]);
                var d = document.createEvent("MouseEvent");
                if (d.initMouseEvent(b, !0, !0, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, !1, !1, !1, !1, 0, a.relatedTarget), first.target.dispatchEvent(d), null != c && "mousedown" == c.type && "mouseup" == b) {
                    b = "click";
                    var d = document.createEvent("MouseEvent");
                    d.initMouseEvent(b, !0, !0, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, !1, !1, !1, !1, 0, a.relatedTarget), first.target.dispatchEvent(d)
                }
                a.preventDefault ? a.preventDefault() : a.returnValue = !1
            },
            keyboardDispatch: function (a) {
                return a.key = a.keyCode || a.which, "keydown" === a.type ? Crafty.keydown[a.key] !== !0 && (Crafty.keydown[a.key] = !0, Crafty.trigger("KeyDown", a)) : "keyup" === a.type && (delete Crafty.keydown[a.key], Crafty.trigger("KeyUp", a)), !Crafty.selected || 8 == a.key || a.key >= 112 && 135 >= a.key ? void 0 : (a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0, a.preventDefault ? a.preventDefault() : a.returnValue = !1, !1)
            }
        }), Crafty.bind("Load", function () {
            Crafty.addEvent(this, "keydown", Crafty.keyboardDispatch), Crafty.addEvent(this, "keyup", Crafty.keyboardDispatch), Crafty.addEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch), Crafty.addEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch), Crafty.addEvent(this, document.body, "mouseup", Crafty.detectBlur), Crafty.addEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch), Crafty.addEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch), Crafty.addEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch), Crafty.addEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch), Crafty.addEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch), Crafty.addEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch), Crafty.addEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch), Crafty.addEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch)
        }), Crafty.bind("CraftyStop", function () {
            Crafty.removeEvent(this, "keydown", Crafty.keyboardDispatch), Crafty.removeEvent(this, "keyup", Crafty.keyboardDispatch), Crafty.stage && (Crafty.removeEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch), Crafty.removeEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch)), Crafty.removeEvent(this, document.body, "mouseup", Crafty.detectBlur)
        }), Crafty.c("Mouse", {
            init: function () {
                Crafty.mouseObjs++, this.bind("Remove", function () {
                    Crafty.mouseObjs--
                })
            },
            areaMap: function (a) {
                if (arguments.length > 1) {
                    var b = Array.prototype.slice.call(arguments, 0);
                    a = new Crafty.polygon(b)
                }
                return a.shift(this._x, this._y), this.mapArea = a, this.attach(this.mapArea), this
            }
        }), Crafty.c("Draggable", {
            _origMouseDOMPos: null,
            _oldX: null,
            _oldY: null,
            _dragging: !1,
            _dir: null,
            _ondrag: null,
            _ondown: null,
            _onup: null,
            init: function () {
                this.requires("Mouse"), this._ondrag = function (a) {
                    var b = Crafty.DOM.translate(a.clientX, a.clientY);
                    if (0 == b.x || 0 == b.y) return !1;
                    if (this._dir) {
                        var c = (b.x - this._origMouseDOMPos.x) * this._dir.x + (b.y - this._origMouseDOMPos.y) * this._dir.y;
                        this.x = this._oldX + c * this._dir.x, this.y = this._oldY + c * this._dir.y
                    } else this.x = this._oldX + (b.x - this._origMouseDOMPos.x), this.y = this._oldY + (b.y - this._origMouseDOMPos.y);
                    this.trigger("Dragging", a)
                }, this._ondown = function (a) {
                    a.mouseButton === Crafty.mouseButtons.LEFT && this._startDrag(a)
                }, this._onup = function (a) {
                    1 == this._dragging && (Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag), Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup), this._dragging = !1, this.trigger("StopDrag", a))
                }, this.enableDrag()
            },
            dragDirection: function (a) {
                if (a === void 0) this._dir = null;
                else if ("" + parseInt(a) == a) this._dir = {
                    x: Math.cos(a / 180 * Math.PI),
                    y: Math.sin(a / 180 * Math.PI)
                };
                else {
                    var b = Math.sqrt(a.x * a.x + a.y * a.y);
                    this._dir = {
                        x: a.x / b,
                        y: a.y / b
                    }
                }
            },
            _startDrag: function (a) {
                this._origMouseDOMPos = Crafty.DOM.translate(a.clientX, a.clientY), this._oldX = this._x, this._oldY = this._y, this._dragging = !0, Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag), Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup), this.trigger("StartDrag", a)
            },
            stopDrag: function () {
                return Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag), Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup), this._dragging = !1, this.trigger("StopDrag"), this
            },
            startDrag: function () {
                return this._dragging || this._startDrag(Crafty.lastEvent), this
            },
            enableDrag: function () {
                return this.bind("MouseDown", this._ondown), Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup), this
            },
            disableDrag: function () {
                return this.unbind("MouseDown", this._ondown), this.stopDrag(), this
            }
        }), Crafty.c("Keyboard", {
            isDown: function (a) {
                return "string" == typeof a && (a = Crafty.keys[a]), !! Crafty.keydown[a]
            }
        }), Crafty.c("Multiway", {
            _speed: 3,
            _keydown: function (a) {
                this._keys[a.key] && (this._movement.x = Math.round(1e3 * (this._movement.x + this._keys[a.key].x)) / 1e3, this._movement.y = Math.round(1e3 * (this._movement.y + this._keys[a.key].y)) / 1e3, this.trigger("NewDirection", this._movement))
            },
            _keyup: function (a) {
                this._keys[a.key] && (this._movement.x = Math.round(1e3 * (this._movement.x - this._keys[a.key].x)) / 1e3, this._movement.y = Math.round(1e3 * (this._movement.y - this._keys[a.key].y)) / 1e3, this.trigger("NewDirection", this._movement))
            },
            _enterframe: function () {
                this.disableControls || (0 !== this._movement.x && (this.x += this._movement.x, this.trigger("Moved", {
                                x: this.x - this._movement.x,
                                y: this.y
                            })), 0 !== this._movement.y && (this.y += this._movement.y, this.trigger("Moved", {
                                x: this.x,
                                y: this.y - this._movement.y
                            })))
            },
            multiway: function (a, b) {
                this._keyDirection = {}, this._keys = {}, this._movement = {
                    x: 0,
                    y: 0
                }, this._speed = {
                    x: 3,
                    y: 3
                }, b ? a.x && a.y ? (this._speed.x = a.x, this._speed.y = a.y) : (this._speed.x = a, this._speed.y = a) : b = a, this._keyDirection = b, this.speed(this._speed), this.disableControl(), this.enableControl();
                for (var c in b) Crafty.keydown[Crafty.keys[c]] && this.trigger("KeyDown", {
                        key: Crafty.keys[c]
                    });
                return this
            },
            enableControl: function () {
                return this.bind("KeyDown", this._keydown).bind("KeyUp", this._keyup).bind("EnterFrame", this._enterframe), this
            },
            disableControl: function () {
                return this.unbind("KeyDown", this._keydown).unbind("KeyUp", this._keyup).unbind("EnterFrame", this._enterframe), this
            },
            speed: function (a) {
                for (var b in this._keyDirection) {
                    var c = Crafty.keys[b] || b;
                    this._keys[c] = {
                        x: Math.round(1e3 * Math.cos(this._keyDirection[b] * (Math.PI / 180)) * a.x) / 1e3,
                        y: Math.round(1e3 * Math.sin(this._keyDirection[b] * (Math.PI / 180)) * a.y) / 1e3
                    }
                }
                return this
            }
        }), Crafty.c("Fourway", {
            init: function () {
                this.requires("Multiway")
            },
            fourway: function (a) {
                return this.multiway(a, {
                        UP_ARROW: -90,
                        DOWN_ARROW: 90,
                        RIGHT_ARROW: 0,
                        LEFT_ARROW: 180,
                        W: -90,
                        S: 90,
                        D: 0,
                        A: 180,
                        Z: -90,
                        Q: 180
                    }), this
            }
        }), Crafty.c("Twoway", {
            _speed: 3,
            _up: !1,
            init: function () {
                this.requires("Fourway, Keyboard")
            },
            twoway: function (a, b) {
                return this.multiway(a, {
                        RIGHT_ARROW: 0,
                        LEFT_ARROW: 180,
                        D: 0,
                        A: 180,
                        Q: 180
                    }), a && (this._speed = a), b = b || 2 * this._speed, this.bind("EnterFrame", function () {
                        this.disableControls || this._up && (this.y -= b, this._falling = !0)
                    }).bind("KeyDown", function () {
                        (this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("Z")) && (this._up = !0)
                    }), this
            }
        }), Crafty.c("Animation", {
            _reel: null,
            init: function () {
                this._reel = {}
            },
            addAnimation: function (a, b) {
                var c, f, g, h, i, k, l, d = 0,
                    e = 0,
                    j = {}, m = [];
                for (c in b) {
                    g = b[c], h = b[d] || this, j = {};
                    for (i in g) j[i] = "number" == typeof g[i] ? (g[i] - h[i]) / (c - d) : g[i];
                    for (e = +d + 1, f = 1; + c >= e; ++e, ++f) {
                        l = {};
                        for (k in j) l[k] = "number" == typeof j[k] ? h[k] + j[k] * f : j[k];
                        m[e] = l
                    }
                    d = c
                }
                return this._reel[a] = m, this
            },
            playAnimation: function (a) {
                var e, b = this._reel[a],
                    c = 0,
                    d = b.length;
                this.bind("EnterFrame", function f() {
                    for (e in b[c]) this[e] = b[c][e];
                    c++, c > d && (this.trigger("AnimationEnd"), this.unbind("EnterFrame", f))
                })
            }
        }), Crafty.c("SpriteAnimation", {
            _reels: null,
            _frame: null,
            _currentReelId: null,
            init: function () {
                this._reels = {}
            },
            animate: function (a, b, c, d) {
                var e, f, g, h, i, j;
                if (4 > arguments.length && "number" == typeof b) return i = b, this._currentReelId = a, currentReel = this._reels[a], this._frame = {
                    currentReel: currentReel,
                    numberOfFramesBetweenSlides: Math.ceil(i / currentReel.length),
                    currentSlideNumber: 0,
                    frameNumberBetweenSlides: 0,
                    repeat: 0
                }, 3 === arguments.length && "number" == typeof c && (-1 === c ? this._frame.repeatInfinitly = !0 : this._frame.repeat = c), j = this._frame.currentReel[0], this.__coord[0] = j[0], this.__coord[1] = j[1], this.bind("EnterFrame", this.updateSprite), this;
                if ("number" == typeof b) {
                    if (g = this.__tile + parseInt(this.__padding[0] || 0, 10), h = this.__tileh + parseInt(this.__padding[1] || 0, 10), e = [], f = b, d > b)
                        for (; d >= f; f++) e.push([f * g, c * h]);
                    else
                        for (; f >= d; f--) e.push([f * g, c * h]);
                    this._reels[a] = e
                } else if ("object" == typeof b) {
                    for (f = 0, e = [], d = b.length - 1, g = this.__tile + parseInt(this.__padding[0] || 0, 10), h = this.__tileh + parseInt(this.__padding[1] || 0, 10); d >= f; f++) j = b[f], e.push([j[0] * g, j[1] * h]);
                    this._reels[a] = e
                }
                return this
            },
            updateSprite: function () {
                var a = this._frame;
                if (a) {
                    if (this._frame.frameNumberBetweenSlides++ === a.numberOfFramesBetweenSlides) {
                        var b = a.currentReel[a.currentSlideNumber++];
                        this.__coord[0] = b[0], this.__coord[1] = b[1], this._frame.frameNumberBetweenSlides = 0
                    }
                    if (a.currentSlideNumber === a.currentReel.length)
                        if (this._frame.repeatInfinitly === !0 || this._frame.repeat > 0) this._frame.repeat && this._frame.repeat--, this._frame.frameNumberBetweenSlides = 0, this._frame.currentSlideNumber = 0;
                        else if (this._frame.frameNumberBetweenSlides === a.numberOfFramesBetweenSlides) return this.trigger("AnimationEnd", {
                            reel: a.currentReel
                        }), this.stop(), void 0;
                    this.trigger("Change")
                }
            },
            stop: function () {
                return this.unbind("EnterFrame", this.updateSprite), this.unbind("AnimationEnd"), this._currentReelId = null, this._frame = null, this
            },
            reset: function () {
                if (!this._frame) return this;
                var a = this._frame.currentReel[0];
                return this.__coord[0] = a[0], this.__coord[1] = a[1], this.stop(), this
            },
            isPlaying: function (a) {
                return a ? this._currentReelId === a : !! this._currentReelId
            }
        }), Crafty.c("Tween", {
            _step: null,
            _numProps: 0,
            tween: function (a, b) {
                return this.each(function () {
                    null == this._step && (this._step = {}, this.bind("EnterFrame", tweenEnterFrame), this.bind("RemoveComponent", function (a) {
                                "Tween" == a && this.unbind("EnterFrame", tweenEnterFrame)
                            }));
                    for (var c in a) this._step[c] = {
                        prop: a[c],
                        val: (a[c] - this[c]) / b,
                        rem: b
                    }, this._numProps++
                }), this
            }
        }), Crafty.c("Color", {
            _color: "",
            ready: !0,
            init: function () {
                this.bind("Draw", function (a) {
                    "DOM" === a.type ? (a.style.background = this._color, a.style.lineHeight = 0) : "canvas" === a.type && (this._color && (a.ctx.fillStyle = this._color), a.ctx.fillRect(a.pos._x, a.pos._y, a.pos._w, a.pos._h))
                })
            },
            color: function (a) {
                return a ? (this._color = a, this.trigger("Change"), this) : this._color
            }
        }), Crafty.c("Tint", {
            _color: null,
            _strength: 1,
            init: function () {
                var a = function (a) {
                    var b = a.ctx || Crafty.canvas.context;
                    b.fillStyle = this._color || "rgb(0,0,0)", b.fillRect(a.pos._x, a.pos._y, a.pos._w, a.pos._h)
                };
                this.bind("Draw", a).bind("RemoveComponent", function (b) {
                    "Tint" === b && this.unbind("Draw", a)
                })
            },
            tint: function (a, b) {
                return this._strength = b, this._color = Crafty.toRGB(a, this._strength), this.trigger("Change"), this
            }
        }), Crafty.c("Image", {
            _repeat: "repeat",
            ready: !1,
            init: function () {
                var a = function (a) {
                    if ("canvas" === a.type) {
                        if (!this.ready || !this._pattern) return;
                        var b = a.ctx;
                        b.fillStyle = this._pattern, b.save(), b.translate(a.pos._x, a.pos._y), b.fillRect(0, 0, this._w, this._h), b.restore()
                    } else "DOM" === a.type && this.__image && (a.style.background = "url(" + this.__image + ") " + this._repeat)
                };
                this.bind("Draw", a).bind("RemoveComponent", function (b) {
                    "Image" === b && this.unbind("Draw", a)
                })
            },
            image: function (a, b) {
                if (this.__image = a, this._repeat = b || "no-repeat", this.img = Crafty.asset(a), !this.img) {
                    this.img = new Image, Crafty.asset(a, this.img), this.img.src = a;
                    var c = this;
                    return this.img.onload = function () {
                        c.has("Canvas") && (c._pattern = Crafty.canvas.context.createPattern(c.img, c._repeat)), c.ready = !0, "no-repeat" === c._repeat && (c.w = c.img.width, c.h = c.img.height), c.trigger("Change")
                    }, this
                }
                return this.ready = !0, this.has("Canvas") && (this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat)), "no-repeat" === this._repeat && (this.w = this.img.width, this.h = this.img.height), this.trigger("Change"), this
            }
        }), Crafty.extend({
            _scenes: [],
            _current: null,
            scene: function (a, b, c) {
                if (1 === arguments.length) {
                    Crafty.viewport.reset(), Crafty("2D").each(function () {
                        this.has("Persist") || this.destroy()
                    }), null !== this._current && "uninitialize" in this._scenes[this._current] && this._scenes[this._current].uninitialize.call(this), this._scenes[a].initialize.call(this);
                    var d = this._current;
                    return this._current = a, Crafty.trigger("SceneChange", {
                            oldScene: d,
                            newScene: a
                        }), void 0
                }
                this._scenes[a] = {}, this._scenes[a].initialize = b, c !== void 0 && (this._scenes[a].uninitialize = c)
            },
            toRGB: function (a, b) {
                var d, a = "#" === a.charAt(0) ? a.substr(1) : a,
                    c = [];
                return c[0] = parseInt(a.substr(0, 2), 16), c[1] = parseInt(a.substr(2, 2), 16), c[2] = parseInt(a.substr(4, 2), 16), d = void 0 === b ? "rgb(" + c.join(",") + ")" : "rgba(" + c.join(",") + "," + b + ")"
            }
        }), Crafty.DrawManager = function () {
        var a = [],
            b = [];
        return {
            total2D: Crafty("2D").length,
            onScreen: function (a) {
                return Crafty.viewport._x + a._x + a._w > 0 && Crafty.viewport._y + a._y + a._h > 0 && Crafty.viewport._x + a._x < Crafty.viewport.width && Crafty.viewport._y + a._y < Crafty.viewport.height
            },
            merge: function (a) {
                do {
                    for (var f, g, h, b = [], c = !1, d = 0, e = a.length; e > d;) f = a[d], g = a[d + 1], e - 1 > d && f._x < g._x + g._w && f._x + f._w > g._x && f._y < g._y + g._h && f._h + f._y > g._y ? (h = {
                            _x: ~~Math.min(f._x, g._x),
                            _y: ~~Math.min(f._y, g._y),
                            _w: Math.max(f._x, g._x) + Math.max(f._w, g._w),
                            _h: Math.max(f._y, g._y) + Math.max(f._h, g._h)
                        }, h._w = h._w - h._x, h._h = h._h - h._y, h._w = h._w == ~~h._w ? h._w : 0 | h._w + 1, h._h = h._h == ~~h._h ? h._h : 0 | h._h + 1, b.push(h), d++, c = !0) : b.push(f), d++;
                    a = b.length ? Crafty.clone(b) : a, c && (d = 0)
                } while (c);
                return a
            },
            add: function (c, d) {
                if (!d) return b.push(c), void 0;
                var e, f = c._mbr || c,
                    g = d._mbr || d;
                return c === d ? e = c.mbr() || c.pos() : (e = {
                        _x: ~~Math.min(f._x, g._x),
                        _y: ~~Math.min(f._y, g._y),
                        _w: Math.max(f._w, g._w) + Math.max(f._x, g._x),
                        _h: Math.max(f._h, g._h) + Math.max(f._y, g._y)
                    }, e._w = e._w - e._x, e._h = e._h - e._y), 0 !== e._w && 0 !== e._h && this.onScreen(e) ? (e._x = ~~e._x, e._y = ~~e._y, e._w = e._w === ~~e._w ? e._w : 0 | e._w + 1, e._h = e._h === ~~e._h ? e._h : 0 | e._h + 1, a.push(e), !0) : !1
            },
            debug: function () {
                console.log(a, b)
            },
            drawAll: function (a) {
                var f, a = a || Crafty.viewport.rect(),
                    b = Crafty.map.search(a),
                    c = 0,
                    d = b.length,
                    e = Crafty.canvas.context;
                for (e.clearRect(a._x, a._y, a._w, a._h), b.sort(function (a, b) {
                            return a._globalZ - b._globalZ
                        }); d > c; c++) f = b[c], f._visible && f.__c.Canvas && (f.draw(), f._changed = !1)
            },
            boundingRect: function (a) {
                if (a && a.length) {
                    var e, g, c = 1,
                        d = a.length,
                        f = a[0];
                    for (f = [f._x, f._y, f._x + f._w, f._y + f._h]; d > c;) e = a[c], g = [e._x, e._y, e._x + e._w, e._y + e._h], g[0] < f[0] && (f[0] = g[0]), g[1] < f[1] && (f[1] = g[1]), g[2] > f[2] && (f[2] = g[2]), g[3] > f[3] && (f[3] = g[3]), c++;
                    return g = f, f = {
                        _x: g[0],
                        _y: g[1],
                        _w: g[2] - g[0],
                        _h: g[3] - g[1]
                    }
                }
            },
            draw: function () {
                if (a.length || b.length) {
                    for (var f, g, h, i, j, k, l, c = 0, d = a.length, e = b.length, m = [], n = Crafty.canvas.context; e > c; ++c) b[c].draw()._changed = !1;
                    if (b.length = 0, d) {
                        if (d / this.total2D > .6) return this.drawAll(), a.length = 0, void 0;
                        for (a = this.merge(a), c = 0; d > c; ++c)
                            if (f = a[c]) {
                                for (g = Crafty.map.search(f, !1), j = {}, h = 0, i = g.length; i > h; ++h) k = g[h], !j[k[0]] && k._visible && k.__c.Canvas && (j[k[0]] = !0, m.push({
                                            obj: k,
                                            rect: f
                                        }));
                                n.clearRect(f._x, f._y, f._w, f._h)
                            }
                        if (m.sort(function (a, b) {
                                    return a.obj._globalZ - b.obj._globalZ
                                }), m.length) {
                            for (c = 0, d = m.length; d > c; ++c) {
                                k = m[c], f = k.rect, l = k.obj;
                                var o = l._mbr || l,
                                    p = 0 >= f._x - o._x ? 0 : ~~(f._x - o._x),
                                    q = 0 > f._y - o._y ? 0 : ~~(f._y - o._y),
                                    r = ~~Math.min(o._w - p, f._w - (o._x - f._x), f._w, o._w),
                                    s = ~~Math.min(o._h - q, f._h - (o._y - f._y), f._h, o._h);
                                0 !== s && 0 !== r && (n.save(), n.beginPath(), n.moveTo(f._x, f._y), n.lineTo(f._x + f._w, f._y), n.lineTo(f._x + f._w, f._h + f._y), n.lineTo(f._x, f._h + f._y), n.lineTo(f._x, f._y), n.clip(), l.draw(), n.closePath(), n.restore(), l._changed = !1)
                            }
                            a.length = 0, merged = {}
                        }
                    }
                }
            }
        }
    }(), Crafty.extend({
            isometric: {
                _tile: {
                    width: 0,
                    height: 0
                },
                _elements: {},
                _pos: {
                    x: 0,
                    y: 0
                },
                _z: 0,
                size: function (a, b) {
                    return this._tile.width = a, this._tile.height = b > 0 ? b : a / 2, this
                },
                place: function (a, b, c, d) {
                    var e = this.pos2px(a, b);
                    return e.top -= c * (this._tile.width / 2), d.attr({
                            x: e.left + Crafty.viewport._x,
                            y: e.top + Crafty.viewport._y
                        }).z += c, this
                },
                pos2px: function (a, b) {
                    return {
                        left: a * this._tile.width + (1 & b) * (this._tile.width / 2),
                        top: b * this._tile.height / 2
                    }
                },
                px2pos: function (a, b) {
                    return {
                        x: Math.ceil(-a / this._tile.width - .5 * (1 & b)),
                        y: 2 * (-b / this._tile.height)
                    }
                },
                centerAt: function (a, b) {
                    if ("number" == typeof a && "number" == typeof b) {
                        var c = this.pos2px(a, b);
                        return Crafty.viewport._x = -c.left + Crafty.viewport.width / 2 - this._tile.width / 2, Crafty.viewport._y = -c.top + Crafty.viewport.height / 2 - this._tile.height / 2, this
                    }
                    return {
                        top: -Crafty.viewport._y + Crafty.viewport.height / 2 - this._tile.height / 2,
                        left: -Crafty.viewport._x + Crafty.viewport.width / 2 - this._tile.width / 2
                    }
                },
                area: function () {
                    var a = this.centerAt(),
                        b = this.px2pos(-a.left + Crafty.viewport.width / 2, -a.top + Crafty.viewport.height / 2),
                        c = this.px2pos(-a.left - Crafty.viewport.width / 2, -a.top - Crafty.viewport.height / 2);
                    return {
                        x: {
                            start: b.x,
                            end: c.x
                        },
                        y: {
                            start: b.y,
                            end: c.y
                        }
                    }
                }
            }
        }), Crafty.c("Particles", {
            init: function () {
                this._Particles = Crafty.clone(this._Particles)
            },
            particles: function (a) {
                if (!Crafty.support.canvas || Crafty.deactivateParticles) return this;
                var b, c, d, e, f;
                b = document.createElement("canvas"), b.width = Crafty.viewport.width, b.height = Crafty.viewport.height, b.style.position = "absolute", Crafty.stage.elem.appendChild(b), c = b.getContext("2d"), this._Particles.init(a), this.bind("Remove", function () {
                    Crafty.stage.elem.removeChild(b)
                }).bind("RemoveComponent", function (a) {
                    "particles" === a && Crafty.stage.elem.removeChild(b)
                }), d = this.x + Crafty.viewport.x, e = this.y + Crafty.viewport.y, this._Particles.position = this._Particles.vectorHelpers.create(d, e);
                var g = {
                    x: Crafty.viewport.x,
                    y: Crafty.viewport.y
                };
                return this.bind("EnterFrame", function () {
                    d = this.x + Crafty.viewport.x, e = this.y + Crafty.viewport.y, this._Particles.viewportDelta = {
                        x: Crafty.viewport.x - g.x,
                        y: Crafty.viewport.y - g.y
                    }, g = {
                        x: Crafty.viewport.x,
                        y: Crafty.viewport.y
                    }, this._Particles.position = this._Particles.vectorHelpers.create(d, e), "function" == typeof Crafty.DrawManager.boundingRect ? (f = Crafty.DrawManager.boundingRect(this._Particles.register), f && c.clearRect(f._x, f._y, f._w, f._h)) : c.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height), this._Particles.update(), this._Particles.render(c)
                }), this
            },
            _Particles: {
                presets: {
                    maxParticles: 150,
                    size: 18,
                    sizeRandom: 4,
                    speed: 1,
                    speedRandom: 1.2,
                    lifeSpan: 29,
                    lifeSpanRandom: 7,
                    angle: 65,
                    angleRandom: 34,
                    startColour: [255, 131, 0, 1],
                    startColourRandom: [48, 50, 45, 0],
                    endColour: [245, 35, 0, 0],
                    endColourRandom: [60, 60, 60, 0],
                    sharpness: 20,
                    sharpnessRandom: 10,
                    spread: 10,
                    duration: -1,
                    fastMode: !1,
                    gravity: {
                        x: 0,
                        y: .1
                    },
                    jitter: 0,
                    particles: [],
                    active: !0,
                    particleCount: 0,
                    elapsedFrames: 0,
                    emissionRate: 0,
                    emitCounter: 0,
                    particleIndex: 0
                },
                init: function (a) {
                    if (this.position = this.vectorHelpers.create(0, 0), a === void 0) var a = {};
                    for (key in this.presets) this[key] = a[key] !== void 0 ? a[key] : this.presets[key];
                    this.emissionRate = this.maxParticles / this.lifeSpan, this.positionRandom = this.vectorHelpers.create(this.spread, this.spread)
                },
                addParticle: function () {
                    if (this.particleCount == this.maxParticles) return !1;
                    var a = new this.particle(this.vectorHelpers);
                    return this.initParticle(a), this.particles[this.particleCount] = a, this.particleCount++, !0
                },
                RANDM1TO1: function () {
                    return 2 * Math.random() - 1
                },
                initParticle: function (a) {
                    a.position.x = this.position.x + this.positionRandom.x * this.RANDM1TO1(), a.position.y = this.position.y + this.positionRandom.y * this.RANDM1TO1();
                    var b = (this.angle + this.angleRandom * this.RANDM1TO1()) * (Math.PI / 180),
                        c = this.vectorHelpers.create(Math.sin(b), -Math.cos(b)),
                        d = this.speed + this.speedRandom * this.RANDM1TO1();
                    a.direction = this.vectorHelpers.multiply(c, d), a.size = this.size + this.sizeRandom * this.RANDM1TO1(), a.size = 0 > a.size ? 0 : ~~a.size, a.timeToLive = this.lifeSpan + this.lifeSpanRandom * this.RANDM1TO1(), a.sharpness = this.sharpness + this.sharpnessRandom * this.RANDM1TO1(), a.sharpness = a.sharpness > 100 ? 100 : 0 > a.sharpness ? 0 : a.sharpness, a.sizeSmall = ~~ (a.size / 200 * a.sharpness);
                    var e = [this.startColour[0] + this.startColourRandom[0] * this.RANDM1TO1(), this.startColour[1] + this.startColourRandom[1] * this.RANDM1TO1(), this.startColour[2] + this.startColourRandom[2] * this.RANDM1TO1(), this.startColour[3] + this.startColourRandom[3] * this.RANDM1TO1()],
                        f = [this.endColour[0] + this.endColourRandom[0] * this.RANDM1TO1(), this.endColour[1] + this.endColourRandom[1] * this.RANDM1TO1(), this.endColour[2] + this.endColourRandom[2] * this.RANDM1TO1(), this.endColour[3] + this.endColourRandom[3] * this.RANDM1TO1()];
                    a.colour = e, a.deltaColour[0] = (f[0] - e[0]) / a.timeToLive, a.deltaColour[1] = (f[1] - e[1]) / a.timeToLive, a.deltaColour[2] = (f[2] - e[2]) / a.timeToLive, a.deltaColour[3] = (f[3] - e[3]) / a.timeToLive
                },
                update: function () {
                    if (this.active && this.emissionRate > 0) {
                        var a = 1 / this.emissionRate;
                        for (this.emitCounter++; this.particleCount < this.maxParticles && this.emitCounter > a;) this.addParticle(), this.emitCounter -= a;
                        this.elapsedFrames++, -1 != this.duration && this.duration < this.elapsedFrames && this.stop()
                    }
                    this.particleIndex = 0, this.register = [];
                    for (var b; this.particleIndex < this.particleCount;) {
                        var c = this.particles[this.particleIndex];
                        if (c.timeToLive > 0) {
                            c.direction = this.vectorHelpers.add(c.direction, this.gravity), c.position = this.vectorHelpers.add(c.position, c.direction), c.position = this.vectorHelpers.add(c.position, this.viewportDelta), this.jitter && (c.position.x += this.jitter * this.RANDM1TO1(), c.position.y += this.jitter * this.RANDM1TO1()), c.timeToLive--;
                            var d = c.colour[0] += c.deltaColour[0],
                                e = c.colour[1] += c.deltaColour[1],
                                f = c.colour[2] += c.deltaColour[2],
                                g = c.colour[3] += c.deltaColour[3];
                            b = [], b.push("rgba(" + (d > 255 ? 255 : 0 > d ? 0 : ~~d)), b.push(e > 255 ? 255 : 0 > e ? 0 : ~~e), b.push(f > 255 ? 255 : 0 > f ? 0 : ~~f), b.push((g > 1 ? 1 : 0 > g ? 0 : g.toFixed(2)) + ")"), c.drawColour = b.join(","), this.fastMode || (b[3] = "0)", c.drawColourEnd = b.join(",")), this.particleIndex++
                        } else this.particleIndex != this.particleCount - 1 && (this.particles[this.particleIndex] = this.particles[this.particleCount - 1]), this.particleCount--;
                        var h = {};
                        h._x = ~~c.position.x, h._y = ~~c.position.y, h._w = c.size, h._h = c.size, this.register.push(h)
                    }
                },
                stop: function () {
                    this.active = !1, this.elapsedFrames = 0, this.emitCounter = 0
                },
                render: function (a) {
                    for (var b = 0, c = this.particleCount; c > b; b++) {
                        var d = this.particles[b],
                            e = d.size,
                            f = e >> 1;
                        if (!(0 > d.position.x + e || 0 > d.position.y + e || d.position.x - e > Crafty.viewport.width || d.position.y - e > Crafty.viewport.height)) {
                            var g = ~~d.position.x,
                                h = ~~d.position.y;
                            if (this.fastMode) a.fillStyle = d.drawColour;
                            else {
                                var i = a.createRadialGradient(g + f, h + f, d.sizeSmall, g + f, h + f, f);
                                i.addColorStop(0, d.drawColour), i.addColorStop(.9, d.drawColourEnd), a.fillStyle = i
                            }
                            a.fillRect(g, h, e, e)
                        }
                    }
                },
                particle: function (a) {
                    this.position = a.create(0, 0), this.direction = a.create(0, 0), this.size = 0, this.sizeSmall = 0, this.timeToLive = 0, this.colour = [], this.drawColour = "", this.deltaColour = [], this.sharpness = 0
                },
                vectorHelpers: {
                    create: function (a, b) {
                        return {
                            x: a,
                            y: b
                        }
                    },
                    multiply: function (a, b) {
                        return a.x *= b, a.y *= b, a
                    },
                    add: function (a, b) {
                        return a.x += b.x, a.y += b.y, a
                    }
                }
            }
        }), Crafty.extend({
            audio: {
                sounds: {},
                supported: {},
                codecs: {
                    ogg: 'audio/ogg; codecs="vorbis"',
                    wav: 'audio/wav; codecs="1"',
                    webma: 'audio/webm; codecs="vorbis"',
                    mp3: 'audio/mpeg; codecs="mp3"',
                    m4a: 'audio/mp4; codecs="mp4a.40.2"'
                },
                volume: 1,
                muted: !1,
                paused: !1,
                canPlay: function () {
                    var b, a = this.audioElement();
                    for (var c in this.codecs) b = a.canPlayType(this.codecs[c]), this.supported[c] = "" !== b && "no" !== b ? !0 : !1
                },
                audioElement: function () {
                    return "undefined" != typeof Audio ? new Audio("") : document.createElement("audio")
                },
                add: function (a, b) {
                    if (Crafty.support.audio = !! this.audioElement().canPlayType, Crafty.support.audio) {
                        this.canPlay();
                        var c, d, e;
                        if (1 === arguments.length && "object" == typeof a)
                            for (var f in a)
                                for (var g in a[f]) c = this.audioElement(), c.id = f, c.preload = "auto", c.volume = Crafty.audio.volume, e = a[f][g], d = e.substr(e.lastIndexOf(".") + 1).toLowerCase(), this.supported[d] && (c.src = e, Crafty.asset(e, c), this.sounds[f] = {
                                        obj: c,
                                        played: 0,
                                        volume: Crafty.audio.volume
                                    });
                        if ("string" == typeof a && (c = this.audioElement(), c.id = a, c.preload = "auto", c.volume = Crafty.audio.volume, "string" == typeof b && (d = b.substr(b.lastIndexOf(".") + 1).toLowerCase(), this.supported[d] && (c.src = b, Crafty.asset(b, c), this.sounds[a] = {
                                            obj: c,
                                            played: 0,
                                            volume: Crafty.audio.volume
                                        })), "object" == typeof b))
                            for (g in b) c = this.audioElement(), c.id = a, c.preload = "auto", c.volume = Crafty.audio.volume, e = b[g], d = e.substr(e.lastIndexOf(".") + 1).toLowerCase(), this.supported[d] && (c.src = e, Crafty.asset(e, c), this.sounds[a] = {
                                    obj: c,
                                    played: 0,
                                    volume: Crafty.audio.volume
                                })
                    }
                },
                play: function (a, b, c) {
                    if (0 != b && Crafty.support.audio && this.sounds[a]) {
                        var d = this.sounds[a];
                        d.volume = d.obj.volume = c || Crafty.audio.volume, d.obj.currentTime && (d.obj.currentTime = 0), this.muted && (d.obj.volume = 0), d.obj.play(), d.played++, d.obj.addEventListener("ended", function () {
                            (b > d.played || -1 == b) && (this.currentTime && (this.currentTime = 0), this.play(), d.played++)
                        }, !0)
                    }
                },
                stop: function (a) {
                    if (Crafty.support.audio) {
                        var b;
                        if (!a)
                            for (var c in this.sounds) b = this.sounds[c], b.obj.paused || b.obj.pause();
                        this.sounds[a] && (b = this.sounds[a], b.obj.paused || b.obj.pause())
                    }
                },
                _mute: function (a) {
                    if (Crafty.support.audio) {
                        var b;
                        for (var c in this.sounds) b = this.sounds[c], b.obj.volume = a ? 0 : b.volume;
                        this.muted = a
                    }
                },
                toggleMute: function () {
                    this.muted ? this._mute(!1) : this._mute(!0)
                },
                mute: function () {
                    this._mute(!0)
                },
                unmute: function () {
                    this._mute(!1)
                },
                pause: function (a) {
                    if (Crafty.support.audio && a && this.sounds[a]) {
                        var b = this.sounds[a];
                        b.obj.paused || b.obj.pause()
                    }
                },
                unpause: function (a) {
                    if (Crafty.support.audio && a && this.sounds[a]) {
                        var b = this.sounds[a];
                        b.obj.paused && b.obj.play()
                    }
                },
                togglePause: function (a) {
                    if (Crafty.support.audio && a && this.sounds[a]) {
                        var b = this.sounds[a];
                        b.obj.paused ? b.obj.play() : b.obj.pause()
                    }
                }
            }
        }), Crafty.c("Text", {
            _text: "",
            _textFont: {
                type: "",
                weight: "",
                size: "",
                family: ""
            },
            ready: !0,
            init: function () {
                this.requires("2D"), this.bind("Draw", function (a) {
                    var b = this._textFont.type + " " + this._textFont.weight + " " + this._textFont.size + " " + this._textFont.family;
                    if ("DOM" === a.type) {
                        var c = this._element,
                            d = c.style;
                        d.color = this._textColor, d.font = b, c.innerHTML = this._text
                    } else if ("canvas" === a.type) {
                        var e = a.ctx,
                            f = null;
                        e.save(), e.fillStyle = this._textColor || "rgb(0,0,0)", e.font = b, e.translate(this.x, this.y + this.h), e.fillText(this._text, 0, 0), f = e.measureText(this._text), this._w = f.width, e.restore()
                    }
                })
            },
            text: function (a) {
                return void 0 === a || null === a ? this._text : (this._text = "function" == typeof a ? a.call(this) : a, this.trigger("Change"), this)
            },
            textColor: function (a, b) {
                return this._strength = b, this._textColor = Crafty.toRGB(a, this._strength), this.trigger("Change"), this
            },
            textFont: function (a, b) {
                if (1 === arguments.length) {
                    if ("string" == typeof a) return this._textFont[a];
                    if ("object" == typeof a)
                        for (propertyKey in a) this._textFont[propertyKey] = a[propertyKey]
                } else this._textFont[a] = b;
                return this.trigger("Change"), this
            }
        }), Crafty.extend({
            assets: {},
            asset: function (a, b) {
                return 1 === arguments.length ? Crafty.assets[a] : (Crafty.assets[a] || (Crafty.assets[a] = b, this.trigger("NewAsset", {
                                key: a,
                                value: b
                            })), void 0)
            },
            image_whitelist: ["jpg", "jpeg", "gif", "png", "svg"],
            load: function (a, b, c, d) {
                function l() {
                    var a = this.src;
                    this.removeEventListener && this.removeEventListener("canplaythrough", l, !1), ++j, c && c({
                            loaded: j,
                            total: i,
                            percent: 100 * (j / i),
                            src: a
                        }), j === i && b && b()
                }

                function m() {
                    var a = this.src;
                    d && d({
                            loaded: j,
                            total: i,
                            percent: 100 * (j / i),
                            src: a
                        }), j++, j === i && b && b()
                }
                for (var g, h, e = 0, f = a.length, i = f, j = 0, k = ""; f > e; ++e) {
                    if (g = a[e], k = g.substr(g.lastIndexOf(".") + 1, 3).toLowerCase(), h = Crafty.asset(g) || null, Crafty.support.audio && Crafty.audio.supported[k]) {
                        if (!h) {
                            var n = g.substr(g.lastIndexOf("/") + 1).toLowerCase();
                            h = Crafty.audio.audioElement(), h.id = n, h.src = g, h.preload = "auto", h.volume = Crafty.audio.volume, Crafty.asset(g, h), Crafty.audio.sounds[n] = {
                                obj: h,
                                played: 0
                            }
                        }
                        h.addEventListener && h.addEventListener("canplaythrough", l, !1)
                    } else {
                        if (!(Crafty.image_whitelist.indexOf(k) >= 0)) {
                            i--;
                            continue
                        }
                        h || (h = new Image, Crafty.asset(g, h)), h.onload = l, h.src = g
                    }
                    h.onerror = m
                }
            },
            modules: function (a, b, c) {
                2 === arguments.length && "object" == typeof a && (c = b, b = a, a = "http://cdn.craftycomponents.com");
                var d = function () {
                    function s(a, b, c) {
                        for (c = 0, j = a.length; j > c; ++c)
                            if (!b(a[c])) return m;
                        return 1
                    }

                    function t(a, b) {
                        s(a, function (a) {
                            return !b(a)
                        })
                    }

                    function v(a, b, c) {
                        function o(a) {
                            return a.call ? a() : f[a]
                        }

                        function p() {
                            if (!--m) {
                                f[l] = 1, j && j();
                                for (var a in h) s(a.split("|"), o) && !t(h[a], o) && (h[a] = [])
                            }
                        }
                        a = a[n] ? a : [a];
                        var e = b && b.call,
                            j = e ? b : c,
                            l = e ? a.join("") : b,
                            m = a.length;
                        return setTimeout(function () {
                            t(a, function (a) {
                                return k[a] ? (l && (g[l] = 1), 2 == k[a] && p()) : (k[a] = 1, l && (g[l] = 1), w(!d.test(a) && i ? i + a + ".js" : a, p), void 0)
                            })
                        }, 0), v
                    }

                    function w(a, d) {
                        var e = b.createElement("script"),
                            f = m;
                        e.onload = e.onerror = e[r] = function () {
                            e[p] && !/^c|loade/.test(e[p]) || f || (e.onload = e[r] = null, f = 1, k[a] = 2, d())
                        }, e.async = 1, e.src = a, c.insertBefore(e, c.firstChild)
                    }
                    var i, a = this,
                        b = document,
                        c = b.getElementsByTagName("head")[0],
                        d = /^https?:\/\//,
                        e = a.$script,
                        f = {}, g = {}, h = {}, k = {}, m = !1,
                        n = "push",
                        o = "DOMContentLoaded",
                        p = "readyState",
                        q = "addEventListener",
                        r = "onreadystatechange";
                    return !b[p] && b[q] && (b[q](o, function u() {
                                b.removeEventListener(o, u, m), b[p] = "complete"
                            }, m), b[p] = "loading"), v.get = w, v.order = function (a, b, c) {
                        (function d(e) {
                            e = a.shift(), a.length ? v(e, d) : v(e, b, c)
                        })()
                    }, v.path = function (a) {
                        i = a
                    }, v.ready = function (a, b, c) {
                        a = a[n] ? a : [a];
                        var d = [];
                        return !t(a, function (a) {
                            f[a] || d[n](a)
                        }) && s(a, function (a) {
                            return f[a]
                        }) ? b() : ! function (a) {
                            h[a] = h[a] || [], h[a][n](b), c && c(d)
                        }(a.join("|")), v
                    }, v.noConflict = function () {
                        return a.$script = e, this
                    }, v
                }(),
                    e = [],
                    f = /^(https?|file):\/\//;
                for (var g in b) f.test(g) ? e.push(g) : e.push(a + "/" + g.toLowerCase() + "-" + b[g].toLowerCase() + ".js");
                d(e, function () {
                    c && c()
                })
            }
        }), Crafty.math = {
        abs: function (a) {
            return 0 > a ? -a : a
        },
        amountOf: function (a, b, c) {
            return c > b ? (a - b) / (c - b) : (a - c) / (b - c)
        },
        clamp: function (a, b, c) {
            return a > c ? c : b > a ? b : a
        },
        degToRad: function (a) {
            return a * Math.PI / 180
        },
        distance: function (a, b, c, d) {
            var e = Crafty.math.squaredDistance(a, b, c, d);
            return Math.sqrt(parseFloat(e))
        },
        lerp: function (a, b, c) {
            return a + (b - a) * c
        },
        negate: function (a) {
            return a > Math.random() ? -1 : 1
        },
        radToDeg: function (a) {
            return 180 * a / Math.PI
        },
        randomElementOfArray: function (a) {
            return a[Math.floor(a.length * Math.random())]
        },
        randomInt: function (a, b) {
            return a + Math.floor((1 + b - a) * Math.random())
        },
        randomNumber: function (a, b) {
            return a + (b - a) * Math.random()
        },
        squaredDistance: function (a, b, c, d) {
            return (a - c) * (a - c) + (b - d) * (b - d)
        },
        withinRange: function (a, b, c) {
            return a >= b && c >= a
        }
    }, Crafty.math.Vector2D = function () {
        function a(b, c) {
            if (b instanceof a) this.x = b.x, this.y = b.y;
            else if (2 === arguments.length) this.x = b, this.y = c;
            else if (arguments.length > 0) throw "Unexpected number of arguments for Vector2D()"
        }
        return a.prototype.x = 0, a.prototype.y = 0, a.prototype.add = function (a) {
            return this.x += a.x, this.y += a.y, this
        }, a.prototype.angleBetween = function (a) {
            return Math.atan2(this.x * a.y - this.y * a.x, this.x * a.x + this.y * a.y)
        }, a.prototype.angleTo = function (a) {
            return Math.atan2(a.y - this.y, a.x - this.x)
        }, a.prototype.clone = function () {
            return new a(this)
        }, a.prototype.distance = function (a) {
            return Math.sqrt((a.x - this.x) * (a.x - this.x) + (a.y - this.y) * (a.y - this.y))
        }, a.prototype.distanceSq = function (a) {
            return (a.x - this.x) * (a.x - this.x) + (a.y - this.y) * (a.y - this.y)
        }, a.prototype.divide = function (a) {
            return this.x /= a.x, this.y /= a.y, this
        }, a.prototype.dotProduct = function (a) {
            return this.x * a.x + this.y * a.y
        }, a.prototype.equals = function (b) {
            return b instanceof a && this.x == b.x && this.y == b.y
        }, a.prototype.getNormal = function (b) {
            return void 0 === b ? new a(-this.y, this.x) : new a(b.y - this.y, this.x - b.x).normalize()
        }, a.prototype.isZero = function () {
            return 0 === this.x && 0 === this.y
        }, a.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        }, a.prototype.magnitudeSq = function () {
            return this.x * this.x + this.y * this.y
        }, a.prototype.multiply = function (a) {
            return this.x *= a.x, this.y *= a.y, this
        }, a.prototype.negate = function () {
            return this.x = -this.x, this.y = -this.y, this
        }, a.prototype.normalize = function () {
            var a = Math.sqrt(this.x * this.x + this.y * this.y);
            return 0 === a ? (this.x = 1, this.y = 0) : (this.x /= a, this.y /= a), this
        }, a.prototype.scale = function (a, b) {
            return void 0 === b && (b = a), this.x *= a, this.y *= b, this
        }, a.prototype.scaleToMagnitude = function (a) {
            var b = a / this.magnitude();
            return this.x *= b, this.y *= b, this
        }, a.prototype.setValues = function (b, c) {
            return b instanceof a ? (this.x = b.x, this.y = b.y) : (this.x = b, this.y = c), this
        }, a.prototype.subtract = function (a) {
            return this.x -= a.x, this.y -= a.y, this
        }, a.prototype.toString = function () {
            return "Vector2D(" + this.x + ", " + this.y + ")"
        }, a.prototype.translate = function (a, b) {
            return void 0 === b && (b = a), this.x += a, this.y += b, this
        }, a.tripleProduct = function (a, b, c) {
            var d = a.dotProduct(c),
                e = b.dotProduct(c);
            return new Crafty.math.Vector2D(b.x * d - a.x * e, b.y * d - a.y * e)
        }, a
    }(), Crafty.math.Matrix2D = function () {
        return Matrix2D = function (a, b, c, d, e, f) {
            if (a instanceof Matrix2D) this.a = a.a, this.b = a.b, this.c = a.c, this.d = a.d, this.e = a.e, this.f = a.f;
            else if (6 === arguments.length) this.a = a, this.b = b, this.c = c, this.d = d, this.e = e, this.f = f;
            else if (arguments.length > 0) throw "Unexpected number of arguments for Matrix2D()"
        }, Matrix2D.prototype.a = 1, Matrix2D.prototype.b = 0, Matrix2D.prototype.c = 0, Matrix2D.prototype.d = 1, Matrix2D.prototype.e = 0, Matrix2D.prototype.f = 0, Matrix2D.prototype.apply = function (a) {
            var b = a.x;
            return a.x = b * this.a + a.y * this.c + this.e, a.y = b * this.b + a.y * this.d + this.f, a
        }, Matrix2D.prototype.clone = function () {
            return new Matrix2D(this)
        }, Matrix2D.prototype.combine = function (a) {
            var b = this.a;
            return this.a = b * a.a + this.b * a.c, this.b = b * a.b + this.b * a.d, b = this.c, this.c = b * a.a + this.d * a.c, this.d = b * a.b + this.d * a.d, b = this.e, this.e = b * a.a + this.f * a.c + a.e, this.f = b * a.b + this.f * a.d + a.f, this
        }, Matrix2D.prototype.equals = function (a) {
            return a instanceof Matrix2D && this.a == a.a && this.b == a.b && this.c == a.c && this.d == a.d && this.e == a.e && this.f == a.f
        }, Matrix2D.prototype.determinant = function () {
            return this.a * this.d - this.b * this.c
        }, Matrix2D.prototype.invert = function () {
            var a = this.determinant();
            if (0 !== a) {
                var b = {
                    a: this.a,
                    b: this.b,
                    c: this.c,
                    d: this.d,
                    e: this.e,
                    f: this.f
                };
                this.a = b.d / a, this.b = -b.b / a, this.c = -b.c / a, this.d = b.a / a, this.e = (b.c * b.f - b.e * b.d) / a, this.f = (b.e * b.b - b.a * b.f) / a
            }
            return this
        }, Matrix2D.prototype.isIdentity = function () {
            return 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d && 0 === this.e && 0 === this.f
        }, Matrix2D.prototype.isInvertible = function () {
            return 0 !== this.determinant()
        }, Matrix2D.prototype.preRotate = function (a) {
            var b = Math.cos(a),
                c = Math.sin(a),
                d = this.a;
            return this.a = b * d - c * this.b, this.b = c * d + b * this.b, d = this.c, this.c = b * d - c * this.d, this.d = c * d + b * this.d, this
        }, Matrix2D.prototype.preScale = function (a, b) {
            return void 0 === b && (b = a), this.a *= a, this.b *= b, this.c *= a, this.d *= b, this
        }, Matrix2D.prototype.preTranslate = function (a, b) {
            return "number" == typeof a ? (this.e += a, this.f += b) : (this.e += a.x, this.f += a.y), this
        }, Matrix2D.prototype.rotate = function (a) {
            var b = Math.cos(a),
                c = Math.sin(a),
                d = this.a;
            return this.a = b * d - c * this.b, this.b = c * d + b * this.b, d = this.c, this.c = b * d - c * this.d, this.d = c * d + b * this.d, d = this.e, this.e = b * d - c * this.f, this.f = c * d + b * this.f, this
        }, Matrix2D.prototype.scale = function (a, b) {
            return void 0 === b && (b = a), this.a *= a, this.b *= b, this.c *= a, this.d *= b, this.e *= a, this.f *= b, this
        }, Matrix2D.prototype.setValues = function (a, b, c, d, e, f) {
            return a instanceof Matrix2D ? (this.a = a.a, this.b = a.b, this.c = a.c, this.d = a.d, this.e = a.e, this.f = a.f) : (this.a = a, this.b = b, this.c = c, this.d = d, this.e = e, this.f = f), this
        }, Matrix2D.prototype.toString = function () {
            return "Matrix2D([" + this.a + ", " + this.c + ", " + this.e + "] [" + this.b + ", " + this.d + ", " + this.f + "] [0, 0, 1])"
        }, Matrix2D.prototype.translate = function (a, b) {
            return "number" == typeof a ? (this.e += this.a * a + this.c * b, this.f += this.b * a + this.d * b) : (this.e += this.a * a.x + this.c * a.y, this.f += this.b * a.x + this.d * a.y), this
        }, Matrix2D
    }(), Crafty.c("Delay", {
            init: function () {
                this._delays = [], this.bind("EnterFrame", function () {
                    var a = (new Date).getTime();
                    for (var b in this._delays) {
                        var c = this._delays[b];
                        !c.triggered && a > c.start + c.delay + c.pause && (c.triggered = !0, c.func.call(this))
                    }
                }), this.bind("Pause", function () {
                    var a = (new Date).getTime();
                    for (var b in this._delays) this._delays[b].pauseBuffer = a
                }), this.bind("Unpause", function () {
                    var a = (new Date).getTime();
                    for (var b in this._delays) {
                        var c = this._delays[b];
                        c.pause += a - c.pauseBuffer
                    }
                })
            },
            delay: function (a, b) {
                return this._delays.push({
                        start: (new Date).getTime(),
                        func: a,
                        delay: b,
                        triggered: !1,
                        pauseBuffer: 0,
                        pause: 0
                    })
            }
        })
});
var CurrentLevelNum, Achievments = {
        levels: [, {
                _scores: [0]
            }
        ],
        classic_mode: {
            _scores: [0]
        }
    };
window.onload = function () {
    if (TOOLS.isLocalStorageAvailable()) {
        var a = localStorage.getItem("Achievments");
        void 0 != a && (Achievments = JSON.parse(a))
    }
    Crafty.init(1024, 1000), Crafty.scene("loading")
}, TOOLS = {
    remove_identities: function (a) {
        for (var b = 0; a.length > b; b++)
            for (var c = a[b].i, d = a[b].j, e = b + 1; a.length > e; e++) {
                var f = a[e].i,
                    g = a[e].j;
                c == f && d == g && a.splice(e, 1)
        }
        return a
    },
    remove_identities_in_array: function (a) {
        for (var b = 0; a.length > b; b++)
            for (var c = a[b][0], d = a[b][1], e = b + 1; a.length > e; e++) {
                var f = a[e][0],
                    g = a[e][1];
                c == f && d == g && a.splice(e, 1)
        }
        return a
    },
    isLocalStorageAvailable: function () {
        try {
            return "localStorage" in window && null !== window.localStorage
        } catch (a) {
            return !1
        }
    }
};
var SETTINGS = {
    APP_URL: "https://chrome.google.com/webstore/detail/dcheokfcfjenankgnpcmcoepfnckjpdo",
    row_size: 8,
    column_size: 8,
    gem_size: 80,
    rotator_size: 80,
    back_size: 80,
    rotor_shift: 40,
    options_width: 160,
    destroy_after_ms: 400,
    double_click_time: 200,
    change_position_duration: 8,
    delay_before_destroy: 8 * Crafty.timer.getFPS(),
    delay_before_drop: 6 * Crafty.timer.getFPS(),
    drop_from_top_duration: 12,
    add_to_delay_before_destroy_when_combo: 0 * Crafty.timer.getFPS(),
    free_fall_acceleration: 1.4,
    max_velocity_y: 20,
    scores_bar_max_height: 640,
    scores_bar_bottom: 640,
    game_field_position_x: 200,
    game_field_position_y: 100,
    k: .3,
    mass: 1,
    friction: .1,
    initial_quake_velocity: 1,
    initial_quake_velocity_rand: 1,
    particles: {
        maxParticles: 50,
        size: 8,
        sizeRandom: 4,
        speed: .1,
        speedRandom: .1,
        lifeSpan: 15,
        lifeSpanRandom: 10,
        angle: 0,
        angleRandom: 360,
        startColour: [243, 139, 116, 1],
        startColourRandom: [40, 40, 40, 0],
        endColour: [129, 167, 238, 0],
        endColourRandom: [0, 0, 0, 0],
        sharpness: 0,
        sharpnessRandom: 0,
        spread: 0,
        duration: 30,
        fastMode: !0,
        gravity: {
            x: 0,
            y: 0
        },
        jitter: 0
    }
};
(function (a, b) {
    "use strict";
    var c = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
        d = function () {
            for (var a, c, d = [
                        ["fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                        ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                        ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                        ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"]
                    ], e = 0, f = d.length, g = {}; f > e; e++)
                if (a = d[e], a && a[1] in b) {
                    for (e = 0, c = a.length; c > e; e++) g[d[0][e]] = a[e];
                    return g
                }
            return !1
        }(),
        e = {
            request: function (a) {
                var e = d.requestFullscreen;
                a = a || b.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? a[e]() : a[e](c && Element.ALLOW_KEYBOARD_INPUT)
            },
            exit: function () {
                b[d.exitFullscreen]()
            },
            toggle: function (a) {
                this.isFullscreen ? this.exit() : this.request(a)
            },
            onchange: function () {},
            onerror: function () {}
        };
    return d ? (Object.defineProperties(e, {
                isFullscreen: {
                    get: function () {
                        return !!b[d.fullscreenElement]
                    }
                },
                element: {
                    enumerable: !0,
                    get: function () {
                        return b[d.fullscreenElement]
                    }
                },
                enabled: {
                    enumerable: !0,
                    get: function () {
                        return !!b[d.fullscreenEnabled]
                    }
                }
            }), b.addEventListener(d.fullscreenchange, function (a) {
                e.onchange.call(e, a)
            }), b.addEventListener(d.fullscreenerror, function (a) {
                e.onerror.call(e, a)
            }), a.screenfull = e, void 0) : a.screenfull = !1
})(window, document), Crafty.scene("loading", function () {
    var a = Crafty.e("2D, DOM, Text").attr({
            w: 1024,
            h: 40,
            y: 508,
            z: 6
        }).text("0%").css({
            "text-align": "center",
            "font-size": "40px",
            color: "#ff6463"
        });
    Crafty.sprite(445, 116, "./images/loading.png", {
            toys_loading: [0, 0],
            back_loading: [0, 1],
            border_loading: [0, 2],
            progress_loading: [0, 3]
        }), Crafty.e("2D, Canvas, toys_loading").attr({
            y: 388,
            x: 307,
            z: 2
        }), Crafty.e("2D, Canvas, back_loading").attr({
            y: 470,
            x: 307,
            z: 3
        });
    var b = Crafty.e("2D, Canvas, Color").attr({
            w: 0,
            h: 80,
            x: 347,
            y: 498,
            z: 4
        }).color("#eeff05");
    Crafty.e("2D, Canvas, border_loading").attr({
            y: 478,
            x: 307,
            z: 5
        }), Crafty.load(["./images/sprite.png", 
            "./images/background.png", 
            "./images/menu_button.png", 
            "./images/options_button.png", 
            "./images/icons.png", 
            "./images/bang.png", 
            "./images/border.png", 
            "./images/frame-pb-score.png", 
            "./images/game_over.png", 
            "./images/replay_button.png",
            "./sounds/KORDON.ogg", 
            "./sounds/favfaster.ogg", 
            "./sounds/roto1.ogg", 
            "./sounds/roto3.ogg", 
            "./sounds/roto5.ogg", 
            "./sounds/roto7.ogg", 
            "./sounds/roto9.ogg", 
            "./sounds/roto11.ogg", 
            "./sounds/roto13.ogg", 
            "./sounds/roto15.ogg", 
            "./sounds/roto17.ogg", 
            "./sounds/roto19.ogg", 
            "./sounds/play.ogg", 
            "./sounds/superbonus.ogg", 
            "./sounds/bonus6.ogg", 
            "./sounds/figuresfall8.ogg", 
            "./sounds/bombexplode26.ogg", 
            "./sounds/bombdisarm5.ogg", 
            "./sounds/100500kaskadov.ogg", 
            "./sounds/end2.ogg", 
            "./sounds/end4.ogg"], function () {
            Crafty.sprite(SETTINGS.gem_size, "./images/sprite.png", {
                    gem1: [1, 0],
                    gem2: [2, 0],
                    gem3: [1, 1],
                    gem4: [2, 1],
                    gem5: [1, 4],
                    bomb1: [1, 2],
                    bomb2: [2, 2],
                    bomb3: [1, 3],
                    bomb4: [2, 3],
                    back: [0, 0],
                    rotor: [0, 1],
                    rotor_mouse_over: [0, 2],
                    central_rotor: [0, 3],
                    gems_selector: [0, 4]
                }), Crafty.sprite(405, 139, "./images/menu_button.png", {
                    menu_button_active: [0, 0],
                    menu_button_mouse_over: [0, 1],
                    menu_button_on_click: [0, 2],
                    menu_button_disabled: [0, 3]
                }), Crafty.sprite(405, 139, "./images/replay_button.png", {
                    replay_button_active: [0, 0],
                    replay_button_mouse_over: [0, 1],
                    replay_button_on_click: [0, 2]
                }), Crafty.sprite(67, 69, "./images/options_button.png", {
                    options_button_active: [0, 0],
                    options_button_mouse_over: [0, 1],
                    options_button_on_click: [0, 2]
                }), Crafty.sprite(12, 640, "./images/border.png", {
                    field_border: [0, 0]
                }), Crafty.sprite(641, 522, "./images/game_over.png", {
                    game_over_image: [0, 0]
                }), Crafty.sprite(67, 69, "./images/icons.png", {
                    home_icon: [0, 0],
                    levels_icon: [0, 1],
                    restart_icon: [0, 2],
                    sound_icon: [0, 3],
                    next_icon: [0, 4],
                    sound_off_icon: [0, 5],
                    fullscreen_icon: [0, 6]
                }), Crafty.sprite(85, 84, "./images/bang.png", {
                    bang: [0, 0]
                }), Crafty.audio.add("favfaster", "./sounds/favfaster.ogg"), Crafty.audio.add("mouse2", "./sounds/mouse2.ogg"), Crafty.audio.add("mouse3", "./sounds/mouse3.ogg"), Crafty.audio.add("mouse", "./sounds/mouse.ogg"), Crafty.audio.add("zagadofaster", "./sounds/KORDON.ogg"), Crafty.audio.add("superbonus", "./sounds/superbonus.ogg"), Crafty.audio.add("play_button", "./sounds/play.ogg"), Crafty.audio.add("bonus", "./sounds/bonus6.ogg"), Crafty.audio.add("roto1", "./sounds/roto1.ogg"), Crafty.audio.add("roto3", "./sounds/roto3.ogg"), Crafty.audio.add("roto5", "./sounds/roto5.ogg"), Crafty.audio.add("roto7", "./sounds/roto7.ogg"), Crafty.audio.add("roto9", "./sounds/roto9.ogg"), Crafty.audio.add("roto11", "./sounds/roto11.ogg"), Crafty.audio.add("roto13", "./sounds/roto13.ogg"), Crafty.audio.add("roto15", "./sounds/roto15.ogg"), Crafty.audio.add("roto17", "./sounds/roto17.ogg"), Crafty.audio.add("roto19", "./sounds/roto19.ogg"), Crafty.audio.add("figuresfall", "./sounds/figuresfall8.ogg"), Crafty.audio.add("bombexplode", "./sounds/bombexplode26.ogg"), Crafty.audio.add("bombdisarm", "./sounds/bombdisarm5.ogg"), Crafty.audio.add("new_level", "./sounds/play.ogg"), Crafty.audio.add("100500kaskadov", "./sounds/100500kaskadov.ogg"), Crafty.audio.add("level_completed", "./sounds/end2.ogg"), Crafty.audio.add("game_over", "./sounds/end4.ogg"), Crafty.scene("main_menu")
        }, function (c) {
            a.text("" + parseInt(c.percent) + "%"), b.attr({
                    w: parseInt(380 * c.percent / 100)
                })
        })
}), Crafty.scene("main_menu", function () {
    var a = new Date;
    SETTINGS.menu_music = Crafty.audio.play("zagadofaster", -1), Crafty.e("2D, Canvas, Image, Persist").image("./images/background.png"), window.chrome && chrome.webstore && chrome.app && !chrome.app.isInstalled && Crafty.e("AddToChromeButton, Persist").attr({
            x: 420,
            y: 10
        }), Crafty.e("Button").attr({
            x: 307,
            y: 478
        }).activate("menu_button").bind("Click", function () {
            PRODUCTION && (_gaq.push(["_setCustomVar", 1, "Menu Time From Loaded State", "" + ((new Date).getTime() - a.getTime())]), _gaq.push(["_trackEvent", "Menu UI", "Menu Staying"])), Crafty.audio.play("play_button"), Crafty.scene("classic_mode")
        });
    var b = 0;

}), Crafty.scene("classic_mode", function () {
    Crafty.e("ClassicGame")
}), Crafty.scene("credits", function () {
    Crafty.e("Credits")
}), Crafty.c("ClassicGame", {
        _scores: 0,
        _level: 0,
        _drop_items_param: 0,
        init: function () {
            Crafty.e("2D, Canvas, Image").image("./images/frame-pb-score.png").attr("z", 3), Crafty.c("LevelsParams", {
                    _scores: [0, 2e3, 1e4, 2e4, 3e4, 4e4, 5e4, 6e4, 7e4, 8e4, 9e4, 1e5],
                    scores: function (a) {
                        var b = 0;
                        return 1 == a && (b = 2e3), a > 1 && (b = 1e4 * (a - 1)), b
                    },
                    _bonus_weights: [
                        [0, 0],
                        [0, 10],
                        [-10, 10],
                        [-20, 20]
                    ],
                    _bombs_weights: [
                        [],
                        [],
                        [200],
                        [200, 200],
                        [200, 200, 200],
                        [200, 200, 200, 200],
                        [50, 40, 30, 20, 10],
                        [60, 50, 40, 30, 20, 10],
                        [70, 60, 50, 40, 30, 20, 10],
                        [80, 70, 60, 50, 40, 30, 20, 10],
                        [90, 80, 70, 60, 50, 40, 30, 20, 10],
                        [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                    ],
                    init: function () {
                        return this
                    }
                }), this._levels_params = Crafty.e("LevelsParams"), Crafty.e("2D, Canvas, Color").color("#330000").attr({
                    x: 844,
                    y: 130,
                    w: 50,
                    h: 570,
                    z: 1
                }), this.$level_scores_bar = Crafty.e("2D, Canvas, Color").color("#ffcc00").attr({
                    x: 844,
                    y: 700,
                    w: 50,
                    h: 0,
                    z: 2,
                    _next_h: 0,
                    _velocity: 2
                }).bind("EnterFrame", function () {
                    if (this._h <= this._next_h) {
                        80 > this._velocity && (this._velocity += .04);
                        var a = parseInt(this._h + this._velocity);
                        a >= this._next_h ? (this._velocity = 2, this.attr({
                                    h: this._next_h,
                                    y: 700 - this._next_h
                                })) : this.attr({
                                h: a,
                                y: 700 - a
                            })
                    }
                }), Crafty.e("2D, DOM, MacText").attr({
                    x: 70,
                    y: 105
                }).text("关卡").mac_css({
                    "width": "35px",
                    "text-align": "center",
                    color: "black",
                    "font-size": "16px",
                    "font-family": "DigitalStripCyrillic"
                }), this._$level = Crafty.e("2D, DOM, MacText").attr({
                    x: 70,
                    y: 125
                }).text("1").mac_css({
                    "text-align": "center",
                    color: "black",
                    "font-size": "16px",
                    "font-family": "DigitalStripCyrillic"
                }), Crafty.e("2D, DOM, MacText").attr({
                    x: 70,
                    y: 160
                }).text("分数").mac_css({
                    "width": "35px",
                    "text-align": "center",
                    color: "black",
                    "font-size": "16px",
                    "font-family": "DigitalStripCyrillic"
                }), this._$scores = Crafty.e("2D, DOM, MacText").attr({
                    x: 70,
                    y: 180
                }).text("0").mac_css({
                    "text-align": "center",
                    color: "black",
                    "font-size": "16px",
                    "font-family": "DigitalStripCyrillic"
                });
            var a = 0;
            void 0 !== Achievments.classic_mode._scores && (a = Math.max.apply(null, Achievments.classic_mode._scores)), 

                this._$game_notifications = Crafty.e("GameNotifications"), current_level_this = this;
            var b = this;
            return this._game_field = Crafty.e("GameField").bind("CombosEnded", function () {
                if (1 == b._exit_icon_pushed) current_level_this._game_field.trigger("GameOver");
                else if (1 == b._level_completed) {
                    this.pause_game(), Crafty.audio.play("level_completed");
                    for (var a = 0; SETTINGS.row_size > a; a++)
                        for (var c = 0; SETTINGS.row_size > c; c++) this._current_collisions.push([c, a, 1]);
                    this.bind("LevelCompleted", function () {
                        this.unbind("LevelCompleted"), Crafty.e("2D, DOM, Text, Delay, Tween, FieldObject").field_attr({
                                x: 0,
                                y: 230,
                                w: 640
                            }).text("LEVEL " + b._level + "<br>COMPLETED!").css({
                                "font-size": "48px",
                                "font-family": "DigitalStripCyrillic",
                                "text-align": "center"
                            }).delay(function () {
                                this.destroy(), b.new_level()
                            }, 1580)
                    }), this.destroy_gem()
                }
            }).bind("GameOver", function () {
                this.pause_game(), void 0 !== b.$wait_label && b.$wait_label.destroy(), b._game_field.stop_all(), current_level_this.exit_game(), Crafty.e("2D, Canvas, game_over_image").attr({
                        x: 200,
                        y: 50,
                        z: 10
                    }), Crafty.e("2D, DOM, MacText, FieldObject").field_attr({
                        x: 220,
                        y: 175,
                        h: 100,
                        w: 400
                    }).text("获 得 总 分").mac_css({
                        "font-size": "32px",
                        "font-family": "DigitalStripCyrillic",
                        color: "#4b1702"
                    }), Crafty.e("2D, DOM, MacText, FieldObject").field_attr({
                        x: 280,
                        y: 220,
                        h: 100,
                        w: 200
                    }).text("" + b._scores).mac_css({
                        "font-size": "32px",
                        "font-family": "DigitalStripCyrillic",
                        color: "#4b1702"
                    });
                var a = {
                    url: "http://chrome.rotario.me",
                    hashtags: "rotario, game, html5",
                    text: "Rotario is simple yet addictive match 3 in a row game. My result is " + b._scores + "."
                }, c = [];
                for (var d in a) a.hasOwnProperty(d) && c.push(d + "=" + encodeURIComponent(a[d]));
                var e = {
                    url: "http://chrome.rotario.me",
                    title: "\u0418\u0433\u0440\u0430 Rotario",
                    description: "\u0420\u043e\u0442\u0430\u0440\u0438\u043e \u2014 \u043f\u0440\u043e\u0441\u0442\u0430\u044f \u0438 \u0437\u0430\u0445\u0432\u0430\u0442\u044b\u0432\u0430\u044e\u0449\u0430\u044f \u0438\u0433\u0440\u0430 \u0432 \u0441\u0442\u0438\u043b\u0435 \u0442\u0440\u0438-\u0432-\u0440\u044f\u0434. \u041c\u043e\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 " + b._scores + " \u043e\u0447\u043a\u043e\u0432.",
                    image: "http://chrome.rotario.me/images/social-advert_1.jpg",
                    noparse: "true"
                }, f = [];
                for (var d in e) e.hasOwnProperty(d) && f.push(d + "=" + encodeURIComponent(e[d]));
                var g = {
                    link: "http://chrome.rotario.me",
                    app_id: "509155725792420",
                    name: "Rotario",
                    caption: "HTML5 Game",
                    description: "Rotario is simple yet addictive match 3 in a row game. My result is " + b._scores + ".",
                    picture: "http://chrome.rotario.me/images/social-advert_1.jpg",
                    redirect_uri: "http://www.facebook.com"
                }, h = [];
                for (var d in g) g.hasOwnProperty(d) && h.push(d + "=" + encodeURIComponent(g[d]));
                Crafty.e("Button").attr({
                        x: 129,
                        y: 580,
                        z: 4
                    }).activate("options_button").icon("home_icon").bind("Click", function () {
                        Crafty.scene("main_menu")
                    }), Crafty.e("Button").attr({
                        x: 307,
                        y: 580,
                        z: 10
                    }).activate("replay_button").bind("Click", function () {
                        Crafty.audio.play("play_button"), PRODUCTION && (_gaq.push(["_setCustomVar", 1, "Replay Button Clicked", "Yes"]), _gaq.push(["_trackEvent", "Game Over UI", "Choice After Game Over"])), Crafty.scene("classic_mode")
                    })
            }).bind("FindScoresCollision", function (a) {
                for (var b = 0; a.collisions.length > b; b++) {
                    var c = 0;
                    3 == a.collisions[b][2] && (c = 100), 4 == a.collisions[b][2] && (c = 400), a.collisions[b][2] >= 5 && (c = 800), current_level_this.add_to_scores(c)
                }
                for (var d = 0; a.collisions.length > d; d++) {
                    var c, e, f;
                    1 == a.collisions[d][3] ? (e = (a.collisions[d][0] - a.collisions[d][2] + 1) * SETTINGS.gem_size, f = a.collisions[d][1] * SETTINGS.gem_size) : (e = a.collisions[d][0] * SETTINGS.gem_size, f = (a.collisions[d][1] - a.collisions[d][2] + 1) * SETTINGS.gem_size + 20), e += Crafty.math.randomInt(0, 7), f += Crafty.math.randomInt(0, 7), 3 == a.collisions[d][2] && (c = "100"), 4 == a.collisions[d][2] && (c = "400"), 5 == a.collisions[d][2] && (Crafty.audio.play("bonus"), Crafty.e("2D, DOM, MacText, Delay, Tween, FieldObject").field_attr({
                                x: 200,
                                y: 200,
                                h: 100,
                                w: 200
                            }).text("Five in a row!").mac_css({
                                "font-size": "24px",
                                "font-family": "DigitalStripCyrillic"
                            }).delay(function () {
                                this.tween({
                                        y: this._y - 20
                                    }, 25).bind("TweenEnd", function () {
                                        this.destroy()
                                    })
                            }, 400)), a.collisions[d][2] >= 5 && (c = "800"), 6 == a.collisions[d][2] && Crafty.audio.play("superbonus");
                    var g = 200 + Crafty.math.randomInt(0, 100);
                    if (Crafty.e("2D, DOM, MacText, Delay, Tween, FieldObject").field_attr({
                                x: e + 80,
                                y: f + 30,
                                h: 100,
                                w: 200
                            }).text(c).mac_css({
                                "font-size": "24px",
                                "font-family": "DigitalStripCyrillic",
                                "line-height": "24px"
                            }).delay(function () {
                                this.tween({
                                        y: this._y - 20
                                    }, 25).bind("TweenEnd", function () {
                                        this.destroy()
                                    })
                            }, g), a.combo > 10 ? Crafty.audio.play("roto19") : Crafty.audio.play("roto" + (2 * a.combo - 1)), a.combo > 1) {
                        var h;
                        h = 8 >= a.combo ? 30 + 6 * a.combo : 78, Crafty.e("2D, DOM, MacText, Delay, Tween, FieldObject").field_attr({
                                x: 200,
                                y: 100,
                                h: 100,
                                w: 400
                            }).text("" + a.combo + "x 连击").mac_css({
                                "font-size": "" + h + "px",
                                "font-family": "DigitalStripCyrillic"
                            }).delay(function () {
                                this.tween({
                                        y: this._y - 40
                                    }, 35).bind("TweenEnd", function () {
                                        this.destroy()
                                    })
                            }, 200)
                    }
                }
            }), this.new_level(), this.$sound_button = Crafty.e("Button").attr({
                    x: 59,
                    y: 300,
                    z: 4,
                    _sound_on: !0
                }).activate("options_button").icon("sound_icon").bind("Click", function () {
                    Crafty.audio.toggleMute(), this._sound_on ? (this.icon("sound_off_icon"), this._sound_on = !1) : (this.icon("sound_icon"), this._sound_on = !0)
                }), this.$fullscreen_button = Crafty.e("Button").attr({
                    x: 129,
                    y: 300,
                    z: 4
                }).activate("options_button").icon("fullscreen_icon").bind("Click", function () {
                    screenfull.enabled && screenfull.toggle(document.getElementById("cr-stage"))
                }), this.$exit_button = Crafty.e("Button").attr({
                    x: 129,
                    y: 390,
                    z: 4
                }).activate("options_button").icon("restart_icon").bind("Click", function () {
                    this.destroy(), b.$wait_label = Crafty.e("2D, DOM, MacText").attr({
                            x: 129,
                            y: 390
                        }).text("Please wait to exit...").mac_css({
                            "font-size": "12px",
                            "font-family": "DigitalStripCyrillic"
                        }), b._exit_icon_pushed = !0, b._game_field._in_falling || current_level_this._game_field.trigger("GameOver")
                }), this
        },
        add_to_scores: function (a) {
            return this._scores += a, this.update_scores(), this
        },
        scores: function (a) {
            return this._scores = a, this.update_scores(), this
        },
        update_scores: function () {
            this._$scores.text("" + this._scores);
            var a = (this._scores - this._levels_params.scores(this._level - 1)) / this._scores_to_new_level;
            return a > 1 && (a = 1), this.$level_scores_bar.attr({
                    _next_h: 570 * a
                }), this._scores >= this._levels_params.scores(this._level) && !this._game_stopped && (this._game_stopped = !0, this._level_completed = !0), this
        },
        new_level: function () {
            this._level += 1, this._scores_to_new_level = this._levels_params.scores(this._level) - this._levels_params.scores(this._level - 1), this.$level_scores_bar.attr({
                    h: 0,
                    _next_h: 0,
                    _velocity: 2
                }), this._$level.text("" + this._level);
            for (var a = [], b = 1; this._level > b; b++) {
                var c = 50;
                this._level >= 2 && 8 > this._level && (c = 20 + 5 * (this._level - 2)), a.push(c)
            }
            if (this._game_field._level_bombs_weights = a, this._level > 1) {
                var d = this;
                Crafty.e("2D, DOM, MacText, Delay, Tween, FieldObject").field_attr({
                        x: 0,
                        y: 280,
                        w: 640
                    }).text("LEVEL " + d._level).mac_css({
                        "font-size": "48px",
                        "font-family": "DigitalStripCyrillic",
                        "text-align": "center"
                    }).delay(function () {
                        this_new_level_text = this, d._game_field.fill_empty_positions_by_random(), d._game_field.drop_from_top(), this_new_level_text.destroy(), d._game_stopped = !1, d._level_completed = !1, d._exit_icon_pushed && current_level_this._game_field.trigger("GameOver"), d._game_field.unpause_game()
                    }, 2500)
            }
        },
        second_timer: function () {},
        exit_game: function () {
            if (Crafty.audio.play("game_over"), this._scores > 0 && Achievments.classic_mode._scores.push(this._scores), TOOLS.isLocalStorageAvailable()) try {
                localStorage.setItem("Achievments", JSON.stringify(Achievments))
            } catch (a) {
                a == QUOTA_EXCEEDED_ERR && alert("Local storage is full")
            }
            return this
        },
        end_timer: function () {},
        pause_game: function () {},
        unpause_game: function () {}
    }), Crafty.c("Button", {
        init: function () {
            return this.requires("2D"), this.requires("Canvas"), this.requires("Mouse"), this
        },
        activate: function (a) {
            return this.requires(a + "_active"), this.bind("MouseOver", function () {
                Crafty.audio.play("mouse3"), this.requires(a + "_mouse_over"), this.removeComponent(a + "_active"), this.removeComponent(a + "_on_click")
            }), this.bind("MouseOut", function () {
                this.requires(a + "_active"), this.removeComponent(a + "_mouse_over"), this.removeComponent(a + "_on_click")
            }), this.bind("MouseDown", function () {
                this.requires(a + "_on_click"), this.removeComponent(a + "_mouse_over"), this.removeComponent(a + "_active")
            }), this
        },
        disable: function (a) {
            return this.requires(a + "_disabled"), this
        },
        text: function (a) {
            var b = this._x,
                c = this._y,
                d = this._w,
                e = this._h;
            return Crafty.e("2D, DOM, Text").attr({
                    x: b,
                    y: c + (e - 48) / 2,
                    w: d
                }).text(a).css({
                    "text-align": "center",
                    "font-size": "48px",
                    "font-family": "DigitalStripCyrillic",
                    cursor: "pointer"
                }), this
        },
        icon: function (a) {
            return void 0 !== this._icon && this._icon.destroy(), this._icon = Crafty.e("2D, Canvas, " + a).attr({
                    x: this._x,
                    y: this._y,
                    z: this._z + 1
                }), this.attach(this._icon), this
        }
    }), Crafty.c("GameField", {
        _in_falling: !0,
        _click: !1,
        _double_click: !1,
        _end_level: !1,
        _drop_items_param: 0,
        _current_collisions: [],
        _combo_num: 0,
        _falling_gems_num: 0,
        _gems: Array(),
        init: function () {
            this.requires("Delay"), this.requires("2D");
            for (var a = 0; SETTINGS.row_size > a; a++) this._gems[a] = Array();
            this.create_field_background().create_random_game_field().create_rotors_field(), this.bind("RotorRotated", function () {
                this.delay(function () {
                    this.trigger("ReadyForDestroy")
                }, 140)
            }), this.bind("GemsDestroyed", function () {
                this.delay(function () {
                    this.drop_from_current_position(), this.drop_from_top()
                }, 150)
            }), this.bind("DroppedFromTop", function () {
                this.delay(function () {
                    this.trigger("ReadyForDestroy")
                }, 140)
            }), this.bind("ReadyForDestroy", function () {
                this.check_current_collisions()._current_collisions.length > 0 ? (this._combo_num += 1, this.trigger("FindScoresCollision", {
                            collisions: this._current_collisions,
                            combo: this._combo_num
                        }), this.check_field_items(), this.destroy_current_collisions()) : (this._in_falling = !1, void 0 !== this._mouse_over_rotor && this._mouse_over_rotor.trigger("MouseOver"), this._combo_num = 0, this.trigger("CombosEnded"), this.check_field_items(), this.check_bombs())
            })
        },
        create_field_background: function () {
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 0; SETTINGS.column_size > b; b++) Crafty.e("Back").field_attr({
                        x: a * SETTINGS.back_size,
                        y: b * SETTINGS.back_size
                    });
            return Crafty.e("2D, Canvas, field_border, FieldObject").field_attr({
                    x: 0,
                    y: 0,
                    z: 1
                }), Crafty.e("2D, Canvas, field_border, FieldObject").field_attr({
                    x: 628,
                    y: 0,
                    z: 1
                }).flip(), Crafty.e("2D, Canvas, field_border, FieldObject").field_attr({
                    x: 0,
                    y: 640,
                    z: 1,
                    rotation: 270
                }), Crafty.e("2D, Canvas, field_border, FieldObject").origin("bottom left").field_attr({
                    x: 0,
                    y: -640,
                    z: 1,
                    rotation: 90
                }), this
        },
        create_random_game_field: function () {
            for (; this.fill_empty_positions_by_random().check_current_collisions()._current_collisions.length > 0;) this.destroy_current_collisions();
            return this.drop_from_top(), this
        },
        fill_empty_positions_by_random: function () {
            for (var b = 0; SETTINGS.row_size > b; b++)
                for (var c = 0; SETTINGS.column_size > c; c++) void 0 === this._gems[b][c] && (this._gems[b][c] = Crafty.e("Gem").field_attr({
                            x: b * SETTINGS.gem_size,
                            y: c * SETTINGS.gem_size - 640,
                            _row: b,
                            _column: c
                        }));
            return this
        },
        create_rotors_field: function () {
            for (var a = 0; SETTINGS.row_size - 1 > a; a++)
                for (var b = 0; SETTINGS.column_size - 1 > b; b++) {
                    var c = this,
                        d = Crafty.e("Rotor").field_attr({
                                x: SETTINGS.rotor_shift + a * SETTINGS.rotator_size,
                                y: SETTINGS.rotor_shift + b * SETTINGS.rotator_size,
                                _row: a,
                                _column: b
                            }).bind("MouseOver", function () {
                                c._mouse_over_rotor = this, (!c._in_falling || c._click) && (void 0 === c._gems_selector ? c._gems_selector = Crafty.e("2D, Canvas, gems_selector").attr({
                                            x: this._x,
                                            y: this._y,
                                            z: this._z
                                        }) : c._gems_selector.attr({
                                            x: this._x,
                                            y: this._y,
                                            z: this._z
                                        }), Crafty.audio.play("mouse2"), this.sprite(0, 2), this.start_rotation_presentation(), this._rotation_on = !0)
                            }).bind("MouseOut", function () {
                                c._mouse_over_rotor = void 0, this._rotation_on && (this.sprite(0, 1), this.stop_rotation_presentation(), this._rotation_on = !1)
                            }).bind("Click", function () {
                                (!c._in_falling || c._click) && (c._in_falling = !0, c._double_click || Crafty.audio.play("favfaster"), 1 == c._click ? c._double_click = !0 : (c._click = !0, this_rotator = this, c.delay(function () {
                                                this._double_click ? this.rotate_rotor(this_rotator, -1) : this.rotate_rotor(this_rotator, 1), void 0 !== c._gems_selector && (c._gems_selector.destroy(), c._gems_selector = void 0), void 0 !== this._mouse_over_rotor && this._mouse_over_rotor._rotation_on && (this._mouse_over_rotor.sprite(0, 1), this._mouse_over_rotor.stop_rotation_presentation()), this._click = !1, this._double_click = !1
                                            }, SETTINGS.double_click_time)))
                            }).bind("TweenEnd", function () {
                                c.trigger("RotorRotated")
                            });
                    this.attach(d)
            }
            return this
        },
        check_field_items: function () {
            this._bombs_num = 0;
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 0; SETTINGS.column_size > b; b++) void 0 !== this._gems[a][b] && this._gems[a][b]._bomb && (this._bombs_num += 1);
            this._current_bonus_weight += -10 * this._bombs_num
        },
        check_bombs: function () {
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 0; SETTINGS.column_size > b; b++)
                    if (void 0 !== this._gems[a][b] && this._gems[a][b]._bomb)
                        if (void 0 === this._gems[a][b]._steps_to_explosion) this._gems[a][b].init_bomb_timer();
                        else if (this._gems[a][b]._steps_to_explosion > 1) this._gems[a][b].bomb_tick();
            else {
                for (var c = 0; 8 > c; c++)
                    for (var d = 0; 8 > d; d++) Crafty.e("Bang").attr({
                            x: this._gems[c][d]._x,
                            y: this._gems[c][d]._y,
                            z: this._gems[c][d]._z
                        }).animate("BangAnimation", 4, 0).bind("AnimationEnd", function () {
                            this.destroy()
                        }), this._gems[c][d].destroy(), this._gems[c][d] = void 0;
                this.trigger("GameOver")
            }
        },
        rotor_gems: function (a) {
            return {
                bottom_left: this._gems[a._row][a._column + 1],
                top_left: this._gems[a._row][a._column],
                top_right: this._gems[a._row + 1][a._column],
                bottom_right: this._gems[a._row + 1][a._column + 1]
            }
        },
        rotate_rotor: function (a, b) {
            var c = this.rotor_gems(a);
            return 1 == b ? (this._gems[a._row][a._column] = c.bottom_left, this._gems[a._row + 1][a._column] = c.top_left, this._gems[a._row + 1][a._column + 1] = c.top_right, this._gems[a._row][a._column + 1] = c.bottom_right) : -1 == b && (this._gems[a._row][a._column] = c.top_right, this._gems[a._row + 1][a._column] = c.bottom_right, this._gems[a._row + 1][a._column + 1] = c.bottom_left, this._gems[a._row][a._column + 1] = c.top_left), this._gems[a._row][a._column].change_position_to(a._row, a._column), this._gems[a._row + 1][a._column].change_position_to(a._row + 1, a._column), this._gems[a._row + 1][a._column + 1].change_position_to(a._row + 1, a._column + 1), this._gems[a._row][a._column + 1].change_position_to(a._row, a._column + 1), a.tween({
                    rotation: a._rotation + 90 * b
                }, SETTINGS.change_position_duration), a
        },
        check_current_collisions: function () {
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 1, c = 0; SETTINGS.column_size > c; c++) void 0 !== this._gems[a][c] && void 0 !== this._gems[a][c + 1] && this._gems[a][c]._type == this._gems[a][c + 1]._type ? b += 1 : (b >= 3 && this._current_collisions.push([a, c, b]), b = 1);
            for (var c = 0; SETTINGS.column_size > c; c++)
                for (var d = 1, a = 0; SETTINGS.row_size > a; a++) void 0 !== this._gems[a][c] && void 0 !== this._gems[a + 1] && this._gems[a][c]._type == this._gems[a + 1][c]._type ? d += 1 : (d >= 3 && this._current_collisions.push([a, c, d, !0]), d = 1);
            return this
        },
        destroy_current_collisions: function () {
            for (var a = 0; this._current_collisions.length > a; a++)
                for (var b = 0; this._current_collisions[a][2] > b; b++) {
                    var c, d;
                    1 == this._current_collisions[a][3] ? (c = this._current_collisions[a][0] - b, d = this._current_collisions[a][1]) : (c = this._current_collisions[a][0], d = this._current_collisions[a][1] - b), void 0 !== this._gems[c][d] && (this._gems[c][d]._bomb && (Crafty.audio.play("bombdisarm"), 7 > c && this._current_collisions.push([c + 1, d, 1]), 7 > c && 7 > d && this._current_collisions.push([c + 1, d + 1, 1]), 7 > c && d > 0 && this._current_collisions.push([c + 1, d - 1, 1]), c > 0 && this._current_collisions.push([c - 1, d, 1]), c > 0 && 7 > d && this._current_collisions.push([c - 1, d + 1, 1]), c > 0 && d > 0 && this._current_collisions.push([c - 1, d - 1, 1]), 7 > d && this._current_collisions.push([c, d + 1, 1]), d > 0 && this._current_collisions.push([c, d - 1, 1])), Crafty.e("Bang").attr({
                                x: this._gems[c][d]._x,
                                y: this._gems[c][d]._y,
                                z: this._gems[c][d]._z
                            }).animate("BangAnimation", 4, 0).bind("AnimationEnd", function () {
                                this.destroy()
                            }), this._gems[c][d].destroy(), this._gems[c][d] = void 0)
            }
            return this._current_collisions = [], this.trigger("GemsDestroyed"), this
        },
        drop_from_current_position: function () {
            for (var a = [0, 0, 0, 0, 0, 0, 0, 0], b = 0; SETTINGS.row_size > b; b++)
                for (var c = 0; SETTINGS.column_size > c; c++)
                    if (void 0 === this._gems[b][c]) {
                        a[b] += 1;
                        for (var d = 0; c > d; d++) this._gems[b][c - d] = this._gems[b][c - d - 1], void 0 !== this._gems[b][c - d] && this._gems[b][c - d].field_attr({
                                _column: c - d
                            }), this._gems[b][c - d - 1] = void 0
                    }
            for (var b = 0; SETTINGS.row_size > b; b++)
                for (var d = 0; a[b] > d; d++) this._gems[b][d] = Crafty.e("Gem").field_attr({
                        x: b * SETTINGS.gem_size,
                        y: (-a[b] + d) * SETTINGS.gem_size,
                        _row: b,
                        _column: d
                    }), this.check_field_items(), this._bombs_num < this._level_bombs_weights.length && (Crafty.math.randomInt(0, 1e3) <= this._level_bombs_weights[this._bombs_num] && this._gems[b][d].init_bomb(), this.check_field_items());
            return this
        },
        drop_from_top: function () {
            for (var a = this, b = 0; SETTINGS.row_size > b; b++)
                for (var c = 0; SETTINGS.column_size > c; c++) this._gems[b][c]._y < this._gems[b][c]._column * SETTINGS.gem_size + SETTINGS.game_field_position_y && (this._falling_gems_num += 1, this._gems[b][c].bind("GemFalled", function () {
                            this.unbind("GemFalled"), Crafty.audio.play("figuresfall"), a._falling_gems_num -= 1, 0 == a._falling_gems_num && a.trigger("DroppedFromTop")
                        }), this._gems[b][c].drop_from_top());
            return this
        },
        pause_game: function () {
            return this._in_falling = !0, this.stop_rotating_mouse_over_rotor(), this
        },
        stop_all: function () {
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 0; SETTINGS.column_size > b; b++) void 0 !== this._gems[a][b] && this._gems[a][b].unbind("EnterFrame");
            return this
        },
        stop_rotating_mouse_over_rotor: function () {
            return void 0 !== this._mouse_over_rotor && this._mouse_over_rotor._rotation_on && (this._mouse_over_rotor.sprite(0, 1), this._mouse_over_rotor.stop_rotation_presentation()), void 0 !== this._gems_selector && (this._gems_selector.destroy(), this._gems_selector = void 0), this
        },
        unpause_game: function () {
            return this
        },
        destroy_gem: function () {
            if (this._current_collisions.length > 0) {
                var a = this._current_collisions[0][0],
                    b = this._current_collisions[0][1];
                void 0 !== this._gems[a][b] && (Crafty.e("Bang").attr({
                            x: this._gems[a][b]._x,
                            y: this._gems[a][b]._y,
                            z: this._gems[a][b]._z
                        }).animate("BangAnimation", 4, 0).bind("AnimationEnd", function () {
                            this.destroy()
                        }), this._gems[a][b].destroy(), this._gems[a][b] = void 0), this._current_collisions.splice(0, 1), this.destroy_gem()
            } else this.trigger("LevelCompleted")
        }
    }), Crafty.c("MacText", {
        init: function () {
            return this.requires("Text"), this
        },
        mac_css: function (a) {
            if (void 0 !== a["font-size"]) {
                var b = parseInt(a["font-size"]),
                    c = b + b / 5;
                a["line-height"] = "" + c + "px"
            }
            return this.css(a), this
        }
    }), Crafty.c("Gem", {
        _velocity_y: 0,
        _velocity_x: 0,
        _dx: 0,
        _dy: 0,
        _quake_frame_num: 0,
        _stop_quake: !1,
        _shake_params_random_x: 1,
        _shake_params_random_y: 1,
        init: function () {
            return this.requires("2D"), this.requires("Canvas"), this.requires("Tween"), this.requires("Delay"), this.requires("FieldObject"), this.attr({
                    z: 3
                }), this._type = Crafty.math.randomInt(1, 4), this.requires("gem" + this._type), this
        },
        type: function (a) {
            return void 0 !== this._type && this.removeComponent("gem" + this._type), this._type = a, this.requires("gem" + this._type), this
        },
        init_bomb: function () {
            return void 0 !== this._type && this.removeComponent("gem" + this._type), this.quake(), 5 == this._type && (this._type = Crafty.math.randomInt(1, 4)), this._bomb = !0, this.requires("bomb" + this._type), this
        },
        init_bomb_timer: function () {
            this._steps_to_explosion = 7, this.$steps_counter = Crafty.e("2D, DOM, Text").attr({
                    w: 80,
                    y: this._y + 32,
                    x: this._x
                }).text("" + this._steps_to_explosion).css({
                    "text-align": "center",
                    color: "white",
                    "font-size": "16px",
                    "font-family": "DigitalStripCyrillic"
                }), this.attach(this.$steps_counter)
        },
        bomb_tick: function () {
            return this._steps_to_explosion -= 1, this.$steps_counter.text("" + this._steps_to_explosion), 5 == this._steps_to_explosion && this.shake_params(2, 2), 3 == this._steps_to_explosion && this.shake_params(3, 3), 2 == this._steps_to_explosion && this.shake_params(4, 4), 1 == this._steps_to_explosion && this.shake_params(5, 5), this
        },
        change_position_to: function (a, b) {
            return this.attr({
                    _row: a,
                    _column: b
                }), this.tween({
                    x: this._row * SETTINGS.gem_size + SETTINGS.game_field_position_x,
                    y: this._column * SETTINGS.gem_size + SETTINGS.game_field_position_y
                }, SETTINGS.change_position_duration), this
        },
        drop_from_top: function () {
            this._y_path = [], this._y_path_step = 0, this._target_position_y = this._column * SETTINGS.gem_size + SETTINGS.game_field_position_y, this.attr({
                    x: this._row * SETTINGS.gem_size + SETTINGS.game_field_position_x
                });
            for (var a = this._y; this._target_position_y > a;) this._velocity_y + SETTINGS.free_fall_acceleration < SETTINGS.max_velocity_y ? this._velocity_y += SETTINGS.free_fall_acceleration : this._velocity_y = SETTINGS.max_velocity_y, this._y_path.push(a), a += this._velocity_y;
            return this._y_path.push(this._target_position_y), this._velocity_y = 0, this._y_path_length = this._y_path.length, this.bind("EnterFrame", this.free_fall), this
        },
        free_fall: function () {
            this._y_path_step < this._y_path_length ? (this.attr({
                        y: this._y_path[this._y_path_step]
                    }), this._y_path_step += 1) : (this.unbind("EnterFrame", this.free_fall), this.trigger("GemFalled"))
        },
        quake: function () {
            return this.bind("EnterFrame", this.random_shake), this._quaking = !0, this
        },
        random_shake: function () {
            return this.attr({
                    x: this._x - this._dx,
                    y: this._y - this._dy,
                    _dx: 0,
                    _dy: 0
                }), this._dx = Crafty.math.randomInt(-this._shake_params_random_x, this._shake_params_random_x), this._dy = Crafty.math.randomInt(-this._shake_params_random_y, this._shake_params_random_y), this.attr({
                    x: this._x + this._dx,
                    y: this._y + this._dy
                }), this
        },
        shake_params: function (a, b) {
            return this._quaking ? (this.stop_quake(), this._shake_params_random_x = a, this._shake_params_random_y = b, this.quake()) : (this._shake_params_random_x = a, this._shake_params_random_y = b), this
        },
        stop_quake: function () {
            return this.unbind("EnterFrame", this.random_shake), this.attr({
                    x: this._x - this._dx,
                    y: this._y - this._dy,
                    _dx: 0,
                    _dy: 0
                }), this._quaking = !1, this
        }
    }), Crafty.c("Rotor", {
        init: function () {
            return this.requires("2D"), this.requires("Canvas"), this.requires("rotor"), this.requires("Mouse"), this.requires("Tween"), this.requires("FieldObject"), this.attr({
                    z: 2
                }), this.origin("center"), this
        },
        start_rotation_presentation: function () {
            return this.$central_rotor = Crafty.e("2D, Canvas, central_rotor").attr({
                    x: this._x,
                    y: this._y,
                    z: 5
                }).origin("center"), this.attach(this.$central_rotor), this.$central_rotor.bind("EnterFrame", this.rotation_presentation), this
        },
        rotation_presentation: function () {
            this.attr({
                    rotation: this._rotation + 1
                })
        },
        stop_rotation_presentation: function () {
            return this.$central_rotor.unbind("EnterFrame", this.rotation_presentation), this.$central_rotor.destroy(), this
        }
    }), Crafty.c("AddToChromeButton", {
        init: function () {
            return this.requires("2D"), this.requires("Canvas"), this.requires("Mouse"), this.requires("add_to_chrome_button_active"), this.bind("MouseOver", function () {
                Crafty.audio.play("mouse3"), this.sprite(0, 1)
            }), this.bind("MouseOut", function () {
                this.sprite(0, 0)
            }), this.bind("MouseDown", function () {
                this.sprite(0, 2)
            }), this.bind("Click", function () {
                var a = this;
                chrome.webstore.install(SETTINGS.APP_URL, function () {
                    a.destroy()
                })
            }), this
        }
    }), Crafty.c("Credits", {
        _game_started: !1,
        _in_falling: !1,
        _click: !1,
        _double_click: !1,
        _current_collisions: [],
        _combo_num: 0,
        _falling_gems_num: 0,
        _gems: Array(),
        init: function () {
            this.requires("Delay"), this.requires("2D"), Crafty.audio.play("credits_theme", -1);
            for (var a = 0; SETTINGS.row_size > a; a++) this._gems[a] = Array();
            this.create_field_background().create_random_game_field().create_rotors_field(), this.delay(function () {
                Crafty.e("2D, DOM, Text").attr({
                        y: 300,
                        w: 1024
                    }).text("Leonid Kovalenko").css({
                        "font-family": "DigitalStripCyrillic",
                        "text-align": "center",
                        "font-size": "28px"
                    }), Crafty.e("2D, DOM, Text").attr({
                        y: 350,
                        w: 1024
                    }).text("Alexey Volkov").css({
                        "font-family": "DigitalStripCyrillic",
                        "text-align": "center",
                        "font-size": "28px"
                    }), Crafty.e("2D, DOM, Text").attr({
                        y: 400,
                        w: 1024
                    }).text("Sergey Borodanov").css({
                        "font-family": "DigitalStripCyrillic",
                        "text-align": "center",
                        "font-size": "28px"
                    }), Crafty.e("2D, DOM, Text").attr({
                        y: 450,
                        w: 1024
                    }).text("and others").css({
                        "font-family": "DigitalStripCyrillic",
                        "text-align": "center",
                        "font-size": "28px"
                    }), this.delay(function () {
                        Crafty.e("2D, DOM, Text, Mouse").attr({
                                y: 550,
                                w: 1024,
                                z: 20,
                                h: 24
                            }).text("back to menu").css({
                                "font-family": "DigitalStripCyrillic",
                                "text-align": "center",
                                "font-size": "24px"
                            }).bind("Click", function () {
                                Crafty.audio.play("play_button"), Crafty.scene("main_menu")
                            })
                    }, 7e3)
            }, 21e3)
        },
        create_field_background: function () {
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 0; SETTINGS.column_size > b; b++) Crafty.e("Back").field_attr({
                        x: a * SETTINGS.back_size,
                        y: b * SETTINGS.back_size
                    });
            Crafty.e("2D, Canvas, field_border, FieldObject").field_attr({
                    x: 0,
                    y: 0,
                    z: 1
                }), Crafty.e("2D, Canvas, field_border, FieldObject").field_attr({
                    x: 628,
                    y: 0,
                    z: 1
                }).flip(), Crafty.e("2D, Canvas, field_border, FieldObject").field_attr({
                    x: 0,
                    y: 640,
                    z: 1,
                    rotation: 270
                }), Crafty.e("2D, Canvas, field_border, FieldObject").origin("bottom left").field_attr({
                    x: 0,
                    y: -640,
                    z: 1,
                    rotation: 90
                });
            for (var a = 0; SETTINGS.row_size > a; a++) Crafty.e("2D, Canvas, tube, FieldObject").field_attr({
                    x: 80 * a,
                    z: 4
                });
            return this
        },
        create_random_game_field: function () {
            for (; this.fill_empty_positions_by_random().check_current_collisions()._current_collisions.length > 0;) this.destroy_current_collisions();
            return this
        },
        fill_empty_positions_by_random: function () {
            for (var b = 0; SETTINGS.row_size > b; b++)
                for (var c = 0; SETTINGS.column_size > c; c++) void 0 === this._gems[b][c] && (this._gems[b][c] = Crafty.e("Gem").field_attr({
                            x: b * SETTINGS.gem_size,
                            y: c * SETTINGS.gem_size - 640,
                            _row: b,
                            _column: c
                        }).bind("EnterFrame", function () {
                            this.attr({
                                    y: this._y += 1
                                })
                        }));
            return this
        },
        create_rotors_field: function () {
            for (var a = 0; SETTINGS.row_size - 1 > a; a++)
                for (var b = 0; SETTINGS.column_size - 1 > b; b++) {
                    var c = this;
                    Crafty.e("Rotor").field_attr({
                            x: SETTINGS.rotor_shift + a * SETTINGS.rotator_size,
                            y: SETTINGS.rotor_shift + b * SETTINGS.rotator_size,
                            _row: a,
                            _column: b
                        }).bind("Click", function () {
                            1 == c._click ? c._double_click = !0 : (c._click = !0, this_rotator = this, c.delay(function () {
                                        Crafty.audio.play("favfaster"), this._double_click ? this.rotate_rotor(this_rotator, -1) : this.rotate_rotor(this_rotator, 1), this._click = !1, this._double_click = !1
                                    }, SETTINGS.double_click_time))
                        })
            }
            return this
        },
        rotate_rotor: function (a, b) {
            return void 0 === b && (b = 1), a.tween({
                    rotation: this_rotator._rotation + 90 * b
                }, SETTINGS.change_position_duration), a
        },
        check_current_collisions: function () {
            this._current_collisions = [];
            for (var a = 0; SETTINGS.row_size > a; a++)
                for (var b = 1, c = 0; SETTINGS.column_size > c; c++) void 0 !== this._gems[a][c + 1] && this._gems[a][c]._type == this._gems[a][c + 1]._type ? b += 1 : (b >= 3 && this._current_collisions.push([a, c, b]), b = 1);
            for (var c = 0; SETTINGS.column_size > c; c++)
                for (var d = 1, a = 0; SETTINGS.row_size > a; a++) void 0 !== this._gems[a + 1] && this._gems[a][c]._type == this._gems[a + 1][c]._type ? d += 1 : (d >= 3 && this._current_collisions.push([a, c, d, !0]), d = 1);
            return this
        },
        destroy_current_collisions: function () {
            for (var a = 0; this._current_collisions.length > a; a++)
                for (var b = 0; this._current_collisions[a][2] > b; b++) {
                    var c, d;
                    1 == this._current_collisions[a][3] ? (c = this._current_collisions[a][0] - b, d = this._current_collisions[a][1]) : (c = this._current_collisions[a][0], d = this._current_collisions[a][1] - b), void 0 !== this._gems[c][d] && (this._gems[c][d].destroy(), this._gems[c][d] = void 0)
            }
            return this
        }
    }), Crafty.c("Back", {
        init: function () {
            return this.requires("2D"), this.requires("Canvas"), this.requires("back"), this.requires("FieldObject"), this
        }
    }), Crafty.c("FieldObject", {
        init: function () {
            return this
        },
        field_attr: function (a) {
            return void 0 !== a.x && (a.x += SETTINGS.game_field_position_x), void 0 !== a.y && (a.y += SETTINGS.game_field_position_y), this.attr(a)
        }
    }), Crafty.c("GameNotifications", {
        init: function () {}
    }), Crafty.c("Bang", {
        init: function () {
            return this.requires("2D"), this.requires("Canvas"), this.requires("bang"), this.requires("FieldObject"), this.requires("SpriteAnimation"), this.animate("BangAnimation", 0, 0, 3), this
        }
    }), Crafty.c("CanvasText", {
        ready: !0,
        init: function () {
            this.addComponent("2D, Canvas"), this.bind("Draw", function (a) {
                var b = a.ctx,
                    c = this.x;
                "right" === this._align && (c += this.w), "center" === this._align && (c += this.w / 2), b.save(), b.font = this._font, b.fillStyle = this._fillStyle || "#000", b.translate(c, this.y + this.h), b.textAlign = this._align, b.textBaseline = "bottom", b.fillText(this._text, 0, 0), b.restore(), b.stroke()
            })
        },
        text: function (a) {
            return null === a || void 0 === a ? this._text : (this._text = a, this.trigger("Change"), this)
        },
        font: function (a) {
            return this._font = a, this.trigger("Change"), this
        },
        align: function (a) {
            return this._align = a, this.trigger("Change"), this
        },
        fillStyle: function (a) {
            return this._fillStyle = a, this.trigger("Change"), this
        }
    });