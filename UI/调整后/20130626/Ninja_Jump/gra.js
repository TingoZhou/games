var MB_elements = [],
    MB_mainCanvas, MB_mainContext, MB_mainCanvasWidth, MB_mainCanvasHeight, MB_addedLoops = [],
    MB_drawIntervalSpeed = 20,
    MB_drawLoop, MB_fpsMeasure = !1;
Array.prototype.remove = function (a) {
    this.splice(this.indexOf(a), 1);
    return !0
};
var MB_addToLoop = function (a) {
    a in MB_addedLoops || MB_addedLoops.push(a)
};
MB_removeFromLoops = function (a) {
    MB_addedLoops.remove(a)
};
var frameCount = 0,
    fps = 0,
    MeasureFPS = function () {
        var a = new Date;
        Math.ceil(a.getTime() - MB_lastTime.getTime()) >= 1E3 && (fps = frameCount, frameCount = 0, MB_lastTime = a);
        MB_fpsMeasure.innerHTML = "FPS: " + fps + "/" + 1 / (MB_drawIntervalSpeed / 1E3);
        frameCount++
    },
    DrawAll = function () {
        MB_fpsMeasure && MeasureFPS();
        MB_elements.forEach(function (a) {
            a.draw()
        });
        MB_drawLoop = setTimeout(DrawAll, MB_drawIntervalSpeed);
        MB_addedLoops.forEach(function (a) {
            a()
        })
    },
    MB_Start = function () {
        MB_fpsMeasure && (MB_lastTime = new Date);
        MB_mainCanvasWidth = parseInt(MB_mainCanvas.style.width, 10);
        MB_mainCanvasHeight = parseInt(MB_mainCanvas.style.height, 10);
        DrawAll()
    },
    MB_Stop = function () {
        clearTimeout(MB_drawLoop)
    },
    MB_Background = function () {
        var a = this;
        a.div = document.createElement("div");
        a.image = new Image;
        a.speed = 0;
        a.directionX = 0;
        a.directionY = 0;
        a.posX = 0;
        a.posY = 0;
        a.zOrder = 0;
        a.moving = 0;
        a.create = function (c, f, e, h, b, l, m) {
            a.div.style.backgroundImage = "url(" + c + ")";
            a.image.src = c;
            a.speed = f || a.speed;
            a.directionX = e || a.directionX;
            a.directionY = h || a.directionY;
            a.posX = b || a.posX;
            a.posY = l || a.posY;
            a.zOrder = m || a.zOrder;
            a.div.style.zIndex = a.zOrder;
            a.div.style.position = "absolute";
            a.div.style.top = 0;
            a.div.style.left = 0;
            a.div.style.width = 480;
            a.div.style.height = 760;
            MB_mainCanvas.appendChild(a.div);
            MB_elements.push(a)
        };
        a.draw = function () {
            a.posX += a.speed * a.directionX * a.moving;
            a.posY += a.speed * a.directionY * a.moving;
            a.div.style.backgroundPosition = a.posX + "px " + a.posY + "px"
        }
    },
    MB_BackgroundGroup = function () {
        var a = this;
        a.backgrounds = [];
        a.isMoving = !1;
        a.addBackground = function (c) {
            a.backgrounds.push(c)
        };
        a.removeBackground = function (c) {
            a.backgrounds.remove(c)
        };
        a.create = function () {
            for (var c = 0, f = arguments.length; c < f; c++) a.addBackground(arguments[c])
        };
        a.changeDirection = function (c) {
            a.backgrounds.forEach(function (a) {
                a.direction = c
            })
        };
        a.stop = function () {
            a.isMoving = !1;
            a.backgrounds.forEach(function (a) {
                a.moving = 0
            })
        };
        a.start = function () {
            a.isMoving = !0;
            a.backgrounds.forEach(function (a) {
                a.moving = 1
            })
        };
        a.toggle = function () {
            a.backgrounds.forEach(function (a) {
                a.moving == 0 ? moving = 1 : moving = 0
            });
            a.isMoving == !1 ? a.isMoving = !0 : a.isMoving = !1
        }
    },
    MB_collides = [],
    MB_Sprite = function () {
        var a = this;
        a.image = new Image;
        a.div = document.createElement("div");
        a.speed = 1;
        a.width = 0;
        a.height = 0;
        a.colllides = !1;
        a.hitEvents = {};
        a.frames = 0;
        a.actualFrame = 0;
        a.animations = 0;
        a.actualAnimation = 0;
        a.animationSpeed = 0;
        a.animationInterval = 0;
        a.posX = 0;
        a.posY = 0;
        a.centerX = 0;
        a.centerY = 0;
        a.zOrder = 0;
        a.create = function (c, f, e, h, b) {
            a.image.src = c;
            a.div.style.backgroundImage = "url(" + c + ")";
            a.width = f;
            a.height = e;
            a.frames = h;
            a.animations = b;
            a.div.style.width = f;
            a.div.style.height = e;
            a.div.style.zIndex = a.zOrder;
            a.div.style.position = "absolute";
            MB_mainCanvas.appendChild(a.div);
            MB_elements.push(a)
        };
        a.setPosition = function (c, f, e) {
            a.posX = c;
            a.posY = f;
            a.zOrder = e || a.zOrder;
            a.centerX = c + a.width / 2;
            a.centerY = f + a.height / 2;
            a.div.style.left = c;
            a.div.style.top = f;
            a.div.style.zIndex = e
        };
        a.draw = function () {
            if (a.frames > 0) {
                a.div.style.backgroundPosition = a.width * a.actualAnimation + "px " + a.height * a.actualFrame + "px";
                if (a.animationInterval == a.animationSpeed && a.animationSpeed !== 0) a.actualFrame == a.frames ? a.actualFrame = 0 : a.actualFrame++, a.animationInterval = 0;
                a.animationSpeed !== 0 && a.animationInterval++
            }
        };
        a.setCollide = function (c) {
            c && MB_collides.indexOf(a) == -1 ? MB_collides.push(a) : !c && MB_collides.indexOf(a) != -1 && MB_collides.remove(a)
        };
        a.onHit = function (c, f) {
            a.hitEvents[c] = f
        };
        a.destroy = function () {
            delete a.image;
            MB_collides.remove(a);
            MB_elements.remove(a);
            MB_mainCanvas.removeChild(a.div)
        };
        a.hide = function () {
            a.div.style.visibility = "hidden"
        };
        a.show = function () {
            a.div.style.visibility = "visible"
        }
    },
    MB_checkCollides = function () {
        MB_collides.forEach(function (a) {
            MB_collides.forEach(function (c) {
                if (a != c && !(a.posY + a.height < c.posY || a.posY > c.posY + c.height || a.posX + a.width < c.posX || a.posX > c.posX + c.width) && c in a.hitEvents) a.hitEvents[c](a, c)
            })
        })
    },
    RunCollisions = function () {
        MB_addToLoop(MB_checkCollides)
    },
    MainStart = function () {
        function a() {
            if (b.jumping == 0 && b.falling == 0) {
                if (b.actualAnimation == 0) b.actualAnimation = 2;
                if (b.actualAnimation == 1) b.actualAnimation = 3;
                b.actualFrame = 0;
                b.falling = 0;
                b.fallingSpeed = 0;
                b.jumping = 1;
                b.jumpSpeed = 22
            }
        }
        function c() {}
        MB_mainCanvas.style.backgroundImage = "url(img/tlo1.jpg)";
        MB_Start();
        document.getElementById("title").style.visibility = "hidden";
        var f = 0,
            e = 0,
            h = document.getElementById("punkty");
        i = 0;
        h.innerHTML = '<img src="img/interface/0.png" height=50/>';
        var b = new MB_Sprite;
        b.create("img/ninja.png", 60, 126, 2, 2);
        b.setPosition(240, 750, 100);
        b.animationSpeed = 3;
        b.actualAnimation = 1;
        b.jumping = 0;
        b.falling = 0;
        b.jumpSpeed = 0;
        b.fallingSpeed = 0;
        b.kierunek = "";
        a();
        MB_addToLoop(function () {
            if (b.jumping == 1) {
                var a = b.jumpSpeed;
                if (b.posY > 400) b.setPosition(b.posX, b.posY - a);
                else {
                    if (a > 10) {
                        e += 1;
                        var g = e + "",
                            i = "";
                        k = 0;
                        for (j = g.length; k < j; k++) i += '<img src="img/interface/' + g[k] + '.png" height=50/>';
                        h.innerHTML = i
                    }
                    f += a;
                    MB_mainCanvas.style.backgroundPosition = "0 " + f + "px";
                    for (g = d.length; g--;) if (d[g].setPosition(d[g].posX, d[g].posY + a), d[g].posY > MB_mainCanvasHeight) i = d[g].posY, d[g].destroy(), d[g] = new n, d[g].setPosition(Math.round(52 + Math.random() * 236), i - MB_mainCanvasHeight, 10), d[g].setCollide(!0)
                }
                b.jumpSpeed--;
                if (b.jumpSpeed == 0) b.jumping = 0, b.falling = 1, b.fallingSpeed = 1
            }
            if (b.falling == 1) {
                for (a = d.length; a--;) d[a].coll && b.posX < d[a].posX + d[a].width && b.posX + b.width > d[a].posX && b.posY + b.height > d[a].posY && b.posY + b.height < d[a].posY + d[a].height && d[a].action(d[a]);
                if (b.posY < 760 - b.height) b.setPosition(b.posX, b.posY + b.fallingSpeed), b.fallingSpeed++;
                else if (e == 0) l();
                else {
                    MB_Stop();
                    a = 0;
                    for (g = MB_elements.length; a < g; a++) MB_mainCanvas.removeChild(MB_elements[a].div);
                    MB_mainCanvas.style.backgroundPosition = "0 0";
                    MB_collides = [];
                    MB_elements = [];
                    MB_addedLoops = [];
                    d = [];
                    b.setPosition(0, 0);
                    document.getElementById("result").style.visibility = "visible";
                    h.style.top = 370;
                    h.style.left = 200;
                    document.getElementById("controlPanel").removeEventListener("click", c, !1);
                    document.getElementById("controlPanel").addEventListener("click", o, !1)
                }
            }
            for (a = d.length; a--;) if (d[a].sliding) {
                if (d[a].posX < 52) d[a].moveFactor = 1;
                else if (d[a].posX > 428 - d[a].width) d[a].moveFactor = -1;
                d[a].setPosition(d[a].posX + d[a].moveFactor * (a / 2) + d[a].moveFactor * d[a].speed, d[a].posY)
            }
        });
        var l = function () {
            b.falling = 0;
            b.fallingSpeed = 0;
            a();
            i = 0;
            b.actualAnimation = b.actualAnimation === 2 ? 0 : 1
        },
        m = function () {
            if (b.posX > 52) {
                if (i === 0) b.actualAnimation = 0;
                b.setPosition(b.posX - 5, b.posY)
            }
        };
        document.getElementById("controlPanel").addEventListener("click", c, !1);
        document.onmousemove = function (a) {
            if (b.posX > a.pageX) m();
            else if (b.posX < a.pageX && b.posX + b.width < 428) {
                if (i === 0) b.actualAnimation = 2;
                b.setPosition(b.posX + 5, b.posY)
            }
        };

        var intervalId;

        document.addEventListener("touchstart", function(a) {
            a.preventDefault();
            if (MB_mainCanvasWidth / 2 >= a.touches[0].pageX) {
                intervalId = setInterval(m, 1000 / 60);
            }
            else if (a.touches[0].pageX > MB_mainCanvasWidth / 2) {
                intervalId = setInterval(function() {
                    if (i === 0) b.actualAnimation = 2;
                    b.setPosition(b.posX + 5, b.posY);
                }, 1000 / 60);
            }
        });

        document.addEventListener("touchend", function(a) {
            clearInterval(intervalId);
        });

        m();
        for (var o = function () {
            e = 0;
            document.getElementById("result").style.visibility = "hidden";
            h.style.top = 10;
            h.style.left = 60;
            document.getElementById("title").style.visibility = "visible";
            document.getElementById("controlPanel").removeEventListener("click", o, !1);
            document.getElementById("controlPanel").addEventListener("click", c, !1)
        }, d = [], q = function () {
            l()
        }, i = 0, r = function (a) {
            a.actualFrame = 1;
            l();
            b.jumpSpeed = 30;
            setTimeout(function () {
                a.actualFrame = 0
            }, 100)
        }, s = function (a) {
            a.actualFrame = 1;
            l();
            i = 1;
            b.actualAnimation = 1;
            b.jumpSpeed = 50
        }, t = function (a) {
            a.actualFrame = 1;
            a.coll = !1;
            setTimeout(function () {
                a.hide()
            }, 100);
            l()
        }, n = function () {
            var a = new MB_Sprite;
            a.moveFactor = ~~ (Math.random() * 2) ? -1 : 1;
            a.speed = ~~ (e / 200);
            a.sliding = 0;
            var b;
            e < 200 ? b = ~~ (Math.random() * 2) ? 2 : 15 : e > 400 && e < 650 ? (b = 6, a.sliding = 0) : e > 650 && e < 990 ? (b = 2, a.sliding = 1, a.speed = ~~ (Math.random() * 3) + 2) : e > 1050 && e < 1150 ? (b = 15, a.sliding = 0) : (b = e > 1250 && e < 1350 ? 15 : e > 1500 && e < 1800 ? ~~ (Math.random() * 2) ? 2 : 6 : Math.round(Math.random() * 20), a.sliding = 1);
            b < 3 ? (a.create("img/platform2.png", 80, 25, 1, 0), a.action = r) : b == 4 ? (a.create("img/platform4.png", 70, 49, 1, 0), a.action = s) : b > 4 && b < 7 ? (a.create("img/platform3.png", 70, 50, 1, 0), a.action = t) : (a.create("img/platform1.png", 70, 25, 0, 0), a.action = q);
            a.sliding = a.sliding == 1 && ~~ (Math.random() * 2) ? 1 : 0;
            a.coll = !0;
            a.setPosition(Math.round(52 + Math.random() * 236), 0 - Math.round(Math.random() * 20), 10);
            return a
        }, k = 0, p = 0; k < 8; k++) d[k] = new n, d[k].setPosition(Math.round(52 + Math.random() * 236), p, 10), p += MB_mainCanvasHeight / 8
    };