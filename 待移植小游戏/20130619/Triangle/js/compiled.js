var game = function (b, u) {
    this.base = b;
    this.pieces = [];
    this.upper = u;
    this.playerTotal = 0;
    this.dat = new Array(b);
    this.currentTime = b * 5;
    this.timerRunning = false;
    this.init(b, u)
};
game.prototype = {
    init: function (b, u) {
        for (var a = 0; a < this.base; a++) {
            this.dat[a] = new Array(this.base);
            for (var c = 0; c < this.base; c++) {
                this.dat[a][c] = 0
            }
            for (var c = 0; c <= a; c++) {
                this.dat[a][c] = this.retRnd(this.upper);
                var x = new this.piece(this.dat[a][c], a + '-' + c, a);
                this.pieces.push(x)
            }
        }
    },
    retRnd: function (x) {
        var a = Math.floor(Math.random() * (x + 1));
        if (a == 0) {
            return 1
        } else {
            return a
        }
    },
    solve: function (t) {
        t._forEach(function (d, e, f) {
            d.forEach(function (a, b, c) {
                if (t[e][b] > t[e][b + 1]) {
                    t[e - 1][b] += t[e][b]
                } else {
                    t[e - 1][b] += t[e][b + 1]
                }
            })
        });
        return t[0][0]
    },
    solution: function () {
        this.copy = this.dat.clone();
        return this.solve(this.copy)
    },
    piece: function (a, b, c) {
        var d = ce('radio', b, a, true);
        d.setAttribute('name', c);
        return d
    },
    celebrate: function (b) {
        var c = -15;
        var y = 0;
        var d = 15;
        var e = ce("canvas", "canvas");
        document.body.appendChild(e);
        if (e.getContext) {
            ctx = e.getContext('2d');
            this.gridSize = 15;
            myInterval = setInterval(make, 15)
        };

        function make() {
            var a = _("canvas");
            if (c >= a.width) {
                c = 0;
                y += d
            } else {
                c += d
            }; if (y >= a.height) {
                ctx.clearRect(0, 0, a.width, a.height);
                y = 0
            };
            if (b) {
                ctx.fillStyle = random_color()
            } else {
                ctx.fillStyle = 'rgb(0,0,0)'
            };
            ctx.fillRect(c, y, d, d)
        };

        function random_color() {
            var a = Math.round(0xffffff * Math.random());
            return 'rgb(' + (a >> 16) + ',' + (a >> 8 & 255) + ',' + (a & 255) + ')'
        }
    }
};
var lvl = 2;
var stopWin = function () {
    var a = _('canvas');
    var b = a.getContext('2d');
    clearInterval(myInterval);
    b.clearRect(0, 0, a.width, a.height);
    document.body.removeChild(_('canvas'));
    try {
        _('win').pause();
        _('win').currentTime = 0;
        _('lose').pause();
        _('lose').currentTime = 0
    } catch (err) {}
};

function playAudio(a, b) {
    try {
        // if (!b) {
        //     _(a).volume = 0.25
        // } else {
        //     _(a).volume = b
        // }
        // _(a).currentTime = 0;
        // _(a).play()
    } catch (e) {}
};

function start(h) {
    _('timer').style.display = '';
    _('lvl').innerHTML = '第 ' + (h - 1).toString() + ' 关';
    _('ans').innerHTML = '';
    _('panel').innerHTML = '';
    _('results').innerHTML = '';
    _('results').style.display = 'none';
    setClass('lvl', 'slideIn');
    setClass('cur', 'slideIn');
    setClass('ans', 'slideIn');
    setClass('getRules', 'slideIn');
    _('cur').innerHTML = '当前数值: 0';
    var g = new game(h, 9);
    var j = g.solution();
    _('ans').innerHTML = '目标数值:  ' + j;
    _('timer').innerHTML = g.currentTime;
    decTimer();

    function checkWin() {
        var a = [];
        var b = 1;
        var c = 0;
        for (i = 0; i < h; i++) {
            b += i
        };
        var d = g.pieces.length;
        for (i = 0; i < d; i++) {
            if (_(g.pieces[i].id).checked) {
                c += 1;
                a.push(g.pieces[i].id.split("-")[1])
            }
        };
        if (!c == h) {
            return false
        };
        var e = 0;
        var f = true;
        for (i = 0; i < a.length; i++) {
            if (parseInt(a[i], 10) == e || parseInt(a[i], 10) == (e + 1)) {
                e = parseInt(a[i])
            } else {
                f = false;
                break
            }
        };
        return f
    };
    icon = function (a, b) {
        var c = 'n';
        switch (true) {
        case (h < 11):
            c = 'n';
            break;
        case (h < 16):
            c = 'Bn';
            break;
        default:
            c = 'Cn';
            break
        };
        var d = '<div class="val ' + c + b + '">&nbsp;</div>';
        var e = ce('span', 'icon-' + a, d);
        e.setAttribute("class", "piece");
        e.addEventListener('click', function (e) {
            _(a).checked = true;
            playAudio('click', 1);
            tally()
        });
        return e
    };

    function decTimer() {
        timerInterval = setInterval(function () {
            _('timer').innerHTML -= 1;
            if (_('timer').innerHTML == 0) {
                lose()
            }
        }, 1000)
    };

    function clearBoard() {
        clearInterval(timerInterval);
        _('lvl').setAttribute('class', 'slideOut');
        _('cur').setAttribute('class', 'slideOut');
        _('ans').setAttribute('class', 'slideOut');
        if (_('rules').className == 'slideIn') {
            setClass('rules', 'slideOut')
        } else {
            setClass('getRules', 'slideOut')
        }
    };

    function lose() {
        clearBoard();
        playAudio('lose');
        g.celebrate(false);
        _('results').style.display = 'block';
        _('results').innerHTML = '失败!<br /><sub>Hint: The "Answer" is the highest possible value from the top to the bottom of the pyramid</sub>';
        _('results').innerHTML += '<br /><button onClick="stopWin();start(lvl)">重新挑战</button>'
    };

    function tally() {
        g.playerTotal = 0;
        g.pieces.forEach(function (x, a) {
            if (_(x.id).checked) {
                g.playerTotal += parseInt(x.value);
                _('icon-' + x.id).setAttribute("class", "pieceSelected")
            } else {
                _('icon-' + x.id).setAttribute("class", "piece")
            }
        });
        _('cur').innerHTML = '当前数值: ' + g.playerTotal;
        if (g.playerTotal == j && checkWin()) {
            clearBoard();
            playAudio('win');
            g.celebrate(true);
            _('results').style.display = 'block';
            _('results').innerHTML = '胜利!';
            _('results').innerHTML += '<br /><button onClick="stopWin();start(lvl+=1)">下一关</button>'
        } else {
            _('results').innerHTML = ''
        }
    }
    for (i = 0; i < h; i++) {
        _('panel').appendChild(ce("div", 'row-' + i, ''));
        _('row-' + i).setAttribute('class', 'row')
    };
    g.pieces.forEach(function (x, a) {
        x.addEvent('click', function() {
            tally();
        }, false);
        x.style.display = 'none';
        _('row-' + x.name).appendChild(x);
        _('row-' + x.name).appendChild(new icon(x.id, x.value))
    })
}(function () {
    _('hideRules').onclick = function () {
        setClass('rules', 'slideOut');
        setClass('getRules', 'slideIn')
    };
    _('getRules').onclick = function () {
        setClass('rules', 'slideIn');
        setClass('getRules', 'slideOut')
    }
})();

document.addEventListener("click", function(e) {
    e.preventDefault();
}, false);

document.addEventListener("touchmove", function(e) {
    e.preventDefault();
}, false);

document.addEventListener("touchend", function(e) {
    e.preventDefault();
}, false);