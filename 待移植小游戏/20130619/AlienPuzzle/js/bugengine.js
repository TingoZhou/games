/*
 *  Bug Engine v0.1.1
 *
 *  DEVELOPER
 *  InforExper © 2013
 *  inforexper.blogspot.com
 *  inforexper@gmail.com
 *
 *  LICENSE
 *  This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/
 */
var Bug = {
    Game: function () {
        this.render = new Bug.Render(this);
        this.graphics = new Bug.Graphics;
        this.content = new Bug.Content;
        this.input = new Bug.Input;
        this.storage = new Bug.Storage;
        this.audio = new Bug.Audio;
        this.scene = 0;
        this.Run = function () {
            this.render.Run()
        };
        this.Resume = function () {
            this.render.Resume()
        };
        this.Pause = function () {
            this.render.Pause()
        };
        this.LoadScene = function (a) {
            0 != this.scene && (this.scene.Pause(), this.scene.Dispose());
            this.scene = a;
            this.scene.Inicialize();
            this.scene.Resume()
        }
    },
    Render: function (a) {
        function b() {
            d &&
                (f = Date.now(), c = f - g, e += c, a.scene.Update(c), a.scene.Draw(c), g = f)
        }
        var c, d, e, h, f, g;
        this.Run = function () {
            f = 0;
            g = Date.now();
            e = c = 0;
            d = !0;
            h = setInterval(b, 40)
        };
        this.Resume = function () {
            d = !0;
            h = setInterval(b, 40)
        };
        this.Pause = function () {
            d = !1;
            clearInterval(h)
        };
        this.Time = function () {
            return e
        }
    },
    Graphics: function () {
        var a = document.createElement("canvas"),
            b = a.getContext("2d");
        a.width = 900;
        a.height = 600;
        a.id = "canvas";
        document.body.appendChild(a);
        this.Clear = function (c) {
            b.fillStyle = c;
            b.fillRect(0, 0, a.width, a.height)
        };
        this.DrawTexture =
            function (a, d, e, h, f, g, j, k, l) {
                void 0 === h ? b.drawImage(a.Source(), d, e) : void 0 === g ? b.drawImage(a.Source(), d, e, h, f) : b.drawImage(a.Source(), d, e, h, f, g, j, k, l)
        };
        this.DrawText = function (a, d, e, h, f, g, j) {
            b.textAlign = void 0 === g ? "left" : g;
            b.textBaseline = void 0 === j ? "top" : j;
            b.font = d;
            b.fillStyle = e;
            b.fillText(a, h, f)
        }
    },
    Input: function () {
        this.keyboard = new Bug.Keyboard;
        this.mouse = new Bug.Mouse
    },
    Mouse: function () {
        function a(a) {
            "mousedown" == a.type ? (d = "mousedown", b = a.clientX - e.offsetLeft, c = a.clientY - e.offsetTop) : "mouseup" == a.type ?
                (d = "mouseup", b = a.clientX - e.offsetLeft, c = a.clientY - e.offsetTop) : (d = "none", c = b = 0)
        }
        var b = 0,
            c = 0,
            d = 0,
            e = document.getElementById("canvas");
        e.onmousedown = a;
        e.onmouseup = a;
        this.isMouseDown = function () {
            return "mousedown" == d ? !0 : !1
        };
        this.isMouseUp = function () {
            return "mouseup" == d ? !0 : !1
        };
        this.inBound = function (a, d, e, j) {
            return b >= a && b <= a + e && c >= d && c <= d + j ? !0 : !1
        };
        this.X = function () {
            return b
        };
        this.Y = function () {
            return c
        };
        this.Clear = function () {
            d = "none";
            c = b = 0
        }
    },
    Keyboard: function () {
        function a(a) {
            "keydown" == a.type ? (b = "keydown",
                c = a.keyCode) : "keyup" == a.type ? (b = "keyup", c = a.keyCode) : (b = "none", c = 0)
        }
        var b = 0,
            c = 0;
        document.onkeydown = a;
        document.onkeyup = a;
        this.isKeyDown = function (a) {
            return "keydown" == b && a == c ? !0 : !1
        };
        this.isKeyUp = function (a) {
            return "keyup" == b && a == c ? !0 : !1
        };
        this.Clear = function () {
            b = "none";
            c = 0
        }
    },
    Storage: function () {
        this.SaveParameter = function (a, b) {
            localStorage.setItem(a, b)
        };
        this.LoadParameter = function (a) {
            return localStorage.getItem(a)
        };
        this.DeleteParameter = function (a) {
            localStorage.removeItem(a)
        }
    },
    Content: function () {
        this.LoadTexture =
            function (a) {
                return new Bug.Texture(a)
        }
    },
    Audio: function () {
        var a = 0,
            b = 0;
        this.LoadSound = function (a, b) {
            return new Bug.Sound(a, b)
        };
        this.PlaySound = function (b) {
            a = b.Source().cloneNode(!0);
            a.play()
        };
        this.StopSound = function () {
            a.pause()
        };
        this.LoadMusic = function (a, b) {
            return new Bug.Music(a, b)
        };
        this.PlayMusic = function (a) {
            b = a.Source();
            b.play()
        };
        this.StopMusic = function () {
            try {
                b.pause()
            } catch (a) {}
        };
        this.isPlaying = function () {
            return 0 < b.duration && !b.paused ? !0 : !1
        }
    },
    Sound: function (a, z) {
        var b = new Audio;
        b.src = b.canPlayType("audio/mpeg;") ?
            a : z;
        b.autoplay = !1;
        b.preload = "auto";
        b.load();
        this.Dipose = function () {
            b.dispose()
        };
        this.Source = function () {
            return b
        }
    },
    Music: function (a, z) {
        var b = new Audio;
        b.src = b.canPlayType("audio/mpeg;") ? a : z;
        b.autoplay = !1;
        b.preload = "auto";
        b.loop = !0;
        b.load();
        this.Dipose = function () {
            b.dispose()
        };
        this.Source = function () {
            return b
        }
    },
    Animation: function (a, b, c, d, e, h) {
        var f = 0,
            g = 0;
        this.isComplete = function () {
            return e - 1 == g ? !0 : !1
        };
        this.Reset = function () {
            g = f = 0
        };
        this.Next = function () {
            g < e - 1 && f < h && (f++, f == h && (f =
                0, g++))
        };
        this.X = function () {
            return a + g * c
        };
        this.Y = function () {
            return b
        };
        this.Width = function () {
            return c
        };
        this.Height = function () {
            return d
        }
    },
    Timer: function (a) {
        var b = 0;
        this.isComplete = function () {
            return b == a ? !0 : !1
        };
        this.Reset = function () {
            b = 0
        };
        this.Tick = function () {
            b < a && b++
        }
    },
    Texture: function (a) {
        var b = new Image;
        b.src = a;
        this.Dipose = function () {
            b.dispose()
        };
        this.Source = function () {
            return b
        }
    }
};