/* Built with Hydra */
(function () {
    var a = this;

    function b(g, h) {
        for (var i = 0, u = String(g).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), v = String(h).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), D = Math.max(u.length, v.length), j = 0; i == 0 && j < D; j++) {
            var E = u[j] || "",
                F = v[j] || "",
                G = RegExp("(\\d*)(\\D*)", "g"),
                H = RegExp("(\\d*)(\\D*)", "g");
            do {
                var c = G.exec(E) || ["", "", ""],
                    d = H.exec(F) || ["", "", ""];
                if (c[0].length == 0 && d[0].length == 0) break;
                i = e(c[1].length == 0 ? 0 : parseInt(c[1], 10), d[1].length == 0 ? 0 : parseInt(d[1], 10)) || e(c[2].length == 0, d[2].length == 0) || e(c[2], d[2])
            } while (i ==
                0)
        }
        return i
    }

    function e(g, h) {
        if (g < h) return -1;
        else if (g > h) return 1;
        return 0
    };
    var f, k, l, m;

    function n() {
        return a.navigator ? a.navigator.userAgent : null
    }
    m = l = k = f = false;
    var o;
    if (o = n()) {
        var p = a.navigator;
        f = o.indexOf("Opera") == 0;
        k = !f && o.indexOf("MSIE") != -1;
        l = !f && o.indexOf("WebKit") != -1;
        m = !f && !l && p.product == "Gecko"
    }
    var q = f,
        r = k,
        s = m,
        t = l,
        w;
    a: {
        var x = "",
            y;
        if (q && a.opera) {
            var z = a.opera.version;
            x = typeof z == "function" ? z() : z
        } else {
            if (s) y = /rv\:([^\);]+)(\)|;)/;
            else if (r) y = /MSIE\s+([^\);]+)(\)|;)/;
            else if (t) y = /WebKit\/(\S+)/;
            if (y) {
                var A = y.exec(n());
                x = A ? A[1] : ""
            }
        } if (r) {
            var B, C = a.document;
            B = C ? C.documentMode : undefined;
            if (B > parseFloat(x)) {
                w = String(B);
                break a
            }
        }
        w = x
    };

    var img = new Image();
    img.src = "./static/chrome.jpg";
    img.onload = function () {
        startGame();
    }

    function startGame() {
        var I = document.createElement("script");
        I.src = "static/app-" + function () {
            if (t) return "webkit";
            else if (s)
                if (b(w, "2.0b") >= 0) return "ff4";
                else {
                    if (b(w, "1.8") >= 0) return "ff3"
                } else if (r && b(w, "9") >= 0) return "ie9";
            else if (q) return "opera";
            return "unsupported"
        }() + ".js";
        document.body.appendChild(I);
    }
})()