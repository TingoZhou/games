(function (aZ, u) {
    var ak=aZ.Math, i=aZ.JSON, L=aZ.Date, X=aZ.document, aG=aZ.location.href.replace(/[^\/]*$/, "").toLowerCase();
    var a=aZ.navigator.userAgent.toLowerCase(), aq=a.indexOf("webkit") > -1, G=a.indexOf("gecko") > -1, ac=a.indexOf("presto") > -1, q=a.indexOf("msie") > -1, ab=a.indexOf("ipad") > -1, t=a.indexOf("ipod") > -1, aw=a.indexOf("iphone") > -1, e=a.indexOf("android") > -1, aT=ab || t || aw || e, x=aZ.location.hash.toLowerCase() === "#debug", bd=(aq ? " -webkit-$2" : (G ? " -moz-$2" : (ac ? " -o-$2" : " -ms-$2"))), a0=(aq ? "webkit" : (G ? "moz" : (ac ? "o" : "ms")));
    var P=/\s+/g, aU=/\?/g, ai=/(\.png|\.jpg)/ig, E=/(^| )-([^0-9])/g;
    var W=0, ad={}, d=0, o=0, m=1, aS=1, A="$1";
    var a3=L.now, bc=aZ.parseInt, B=Array.prototype.slice, am=function (bi) {
        var bg=arguments.length;
        while (--bg) {
            var bh=arguments[bg];
            for (var bf in bh) {
                bi[bf]=bh[bf];
            }
        }
    };
    am(Array.prototype, {bsearch:function (bi) {
        var bh=0, bf=this.length, bg;
        while (bh <= bf) {
            bg=bc((bh + bf) / 2);
            switch (bi(this[bg])) {
                case 1:
                    bf=bg - 1;
                    break;
                case -1:
                    bh=bg + 1;
                    break;
                default:
                    return bg;
            }
        }
        return bf;
    }, randomSort:function () {
        this.sort(function () {
            return ak.random() > 0.5 ? -1 : 1;
        });
    }, random:function () {
        return this[bc(ak.random() * this.length)];
    }});
    am(String.prototype, {tpl:function () {
        var bf=0, bg=arguments;
        return this.replace(aU, function () {
            return bg[bf++];
        });
    }});
    var aP=0, aQ=0, ao=0, ba=0, aA=0, T=1, w=function () {
        return aA;
    }, K=function () {
        return aA=be() - aP;
    }, ax=function () {
        ba=0;
    }, V=function () {
        if (ba === 0) {
            ba=w();
        }
    }, h=function () {
        if (ba !== 0) {
            aP+=K() - ba;
            ax();
        }
    }, z=function (bf) {
        T=bf;
    }, be=function () {
        var bf=a3();
        ao+=(bf - aQ) * T;
        aQ=bf;
        return ao;
    };
    var aa=[], aO=function (bg) {
        var bf=aa.length;
        while (bf--) {
            if (aa[bf][0] <= bg) {
                aa[bf][1]();
                aa.splice(bf, 1);
            } else {
                break;
            }
        }
    }, aD=function (bg, bf) {
        aa[aa.length]=[w() + bf, bg];
        aa.sort(function (bh, bi) {
            return bi[0] - bh[0];
        });
    }, aJ=function (bg) {
        var bf=aa.length;
        while (bf--) {
            aa[bf][1] === bg && aa.splice(bf, 1);
        }
    }, ar=function () {
        aa.length=0;
    };
    var av=function (bf, bg) {
        bg=bg || 0;
        return bc(ak.random() * (bf - bg) + bg);
    }, v=function () {
        var bg=ak.random(), bf=arguments.length;
        while (bf--) {
            if ((bg-=arguments[bf]) < 0) {
                break;
            }
        }
        return bf;
    }, aV=function (bk, bj, bi, bm, bh, bl, bg, bf) {
        return{left:bi * bk + bh * bj + bg, top:bm * bk + bl * bj + bf};
    }, aI=function (bk, bj, bi, bm, bh, bl, bg, bf) {
        return aV(bk, bj, bl, -bm, -bh, bi, bh * bf - bl * bg, -bi * bf + bm * bg);
    }, an=function (bm, bk, bh, bj, bf, bp, bo) {
        var bq=[], bl=0, bg=bm.length;
        while (bl < bg) {
            var bi=bm[bl++], bn=bm[bl++];
            bq[bq.length]=bk * bi + bj * bn + bp;
            bq[bq.length]=bh * bi + bf * bn + bo;
        }
        return bq;
    }, U=function (bg, bi, bf, bh) {
        return ak.sqrt((bg-=bf) * bg + (bi-=bh) * bi);
    }, aE=function (bg, bi, bf, bh) {
        return(bg-=bf) * bg + (bi-=bh) * bi;
    }, J=function (bg, bh) {
        for (var bf in bh) {
            bg[bf]=bh[bf] * m;
        }
        return bh;
    }, aC=function (bk) {
        var bj=0, bh=bk.length, bg, bm, bf, bn, bi, bl;
        while (bj < bh) {
            bi=bk[bj];
            bl=bk[bj + 1];
            bg=bg < bi ? bg : bi;
            bm=bm < bl ? bm : bl;
            bf=bf > bi ? bf : bi;
            bn=bn > bl ? bn : bl;
            bj+=2;
        }
        return{left:bg, top:bm, right:bf, bottom:bn, width:bf - bg, height:bn - bm};
    }, a4=function (bl, bm, bj) {
        bl=bl.split("|");
        var bo=aZ.parseFloat, bg=bj ? [] : {};
        bm=bm || function (bp, bq) {
            bg[bp]=bq;
        };
        for (var bk=0, bf=bl.length; bk < bf; bk++) {
            var bn=bl[bk].split(":"), bi=bn[1].split(","), bh=bi.length;
            while (bh--) {
                bi[bh]=bo(bi[bh]);
            }
            bm(bn[0], bi, bg);
        }
        return bg;
    };
    var a7=function () {
        ad.global=i.parse(aZ.localStorage.getItem(aG) || "{}");
    }, ae=function () {
        aZ.localStorage.setItem(aG, i.stringify(ad.global || {}));
    }, aW=function () {
        ad.global={};
        ae();
    };
    var k, C={}, au={}, a9=function (bg) {
        var bf=arguments.length;
        while (--bf) {
            var bh=arguments[bf];
            if (bh === "scene") {
                au[bg.name]=bg;
                if (bg.parent !== ad.root) {
                    bg.addClass("animation");
                    bg.setStyle("opacity: 0;");
                }
            } else {
                (C[bh] || (C[bh]=[])).push(bg);
            }
        }
    }, I=function (bi) {
        var bh=C[bi];
        if (bh !== u) {
            var bg=bh.length, bj=B.call(arguments, 1);
            bj[bj.length]=(this === aZ);
            while (bg--) {
                var bf=bh[bg];
                bf[bi].apply(bf, bj);
            }
        }
    }, n=function (bf) {
        var bi=[true].concat(B.call(arguments, 1)), bg=k, bh=k=au[bf];
        ad.eventMask.setVisible(true);
        bh.prescene && bh.prescene.apply(bh, bi);
        if (bg) {
            bi[0]=false;
            bg.scene.apply(bg, bi);
            bi[0]=true;
            if (bg.parent !== bh.parent) {
                if (bh.parent === bg) {
                    bh.setVisible(true);
                    aZ.setTimeout(function () {
                        bh.setStyle("opacity: 1;");
                        aZ.setTimeout(function () {
                            bh.scene.apply(bh, bi);
                            ad.eventMask.setVisible(false);
                        }, 250);
                    }, 0);
                } else {
                    if (bg.parent === bh) {
                        bg.setStyle("opacity: 0;");
                        aZ.setTimeout(function () {
                            bg.setVisible(false);
                            bh.scene.apply(bh, bi);
                            ad.eventMask.setVisible(false);
                        }, 250);
                    } else {
                        ad.root.setStyle("opacity: 0");
                        aZ.setTimeout(function () {
                            bg.parent.setVisible(false);
                            bg.setVisible(false);
                            bg.setStyle("opacity: 0;");
                            bh.setVisible(true);
                            ad.root.setStyle("opacity: 1");
                            aZ.setTimeout(function () {
                                bh.scene.apply(bh, bi);
                                ad.eventMask.setVisible(false);
                            }, 250);
                        }, 250);
                    }
                }
            } else {
                ad.root.setStyle("opacity: 0");
                aZ.setTimeout(function () {
                    bg.setVisible(false);
                    bh.setVisible(true);
                    ad.root.setStyle("opacity: 1");
                    aZ.setTimeout(function () {
                        bh.scene.apply(bh, bi);
                        ad.eventMask.setVisible(false);
                    }, 250);
                }, 250);
            }
        } else {
            bh.setVisible(true);
            ad.root.setStyle("opacity: 1");
            aZ.setTimeout(function () {
                bh.scene.apply(bh, bi);
                ad.eventMask.setVisible(false);
            }, 250);
        }
    };
    var p=function (bj, bh) {
        var bn, bk, bf, bg, bi=bc(1000 / bh), bm=bi * 2, bl=function () {
            var bo=a3() - bf;
            if (bo > bm) {
                aP+=((bo - bi) * T) << 0;
            }
            var bp=K();
            aO(bp);
            bj(bg, bp);
            !bn && (bk=aZ.setTimeout(bl, bi));
            bf=a3();
        };
        return{reset:function () {
            ax();
            ar();
            bg=K();
            aZ.clearTimeout(bk);
            bn=false;
        }, resume:function () {
            bf=a3();
            bn=false;
            bl();
        }, pause:function () {
            bn=true;
            aZ.clearTimeout(bk);
        }};
    };
    var ap={}, aM=0, H=0, r={audio:function (bg, bf) {
        var bh=new Audio(bf);
        bh.addEventListener("ended", function () {
            this.play();
        }, false);
        return bh;
    }, image:function (bg, bf) {
        var bh=new Image();
        bh.addEventListener("load", function () {
            this.width/=m;
            this.height/=m;
            a6();
        }, false);
        bh.src=F(bf);
        ap[bg]=bh;
        ++H;
        return bh;
    }, dynamic:function (bg, bf) {
        var bh=new Image();
        bh.loader=function (bi) {
            this.addEventListener("load", function () {
                this.width/=m;
                this.height/=m;
                bi();
                delete this.loader;
            }, false);
            this.src=F(bf);
        };
        ap[bg]=bh;
        return bh;
    }, frame:function (bf, bh) {
        var bg=bh[0]=ap[bh[0]];
        if (bg.loader) {
            at(bf, bh);
        } else {
            bg.addEventListener("load", function () {
                at(bf, bh);
            }, false);
        }
        return bf;
    }, UTCTime:function (bg, bf) {
        var bh=new XMLHttpRequest(), bi=0;
        bh.open("GET", bf + "?" + a3(), false);
        bh.addEventListener("readystatechange", function () {
            if (bh.readyState === 4 && bh.status === 200) {
                a6();
                var bj=bh.getResponseHeader("Date"), bk=a3();
                bj=bj === null ? bk : new L(bj).getTime();
                bi=bk - bj;
            }
        }, false);
        bh.send(null);
        ++H;
        return function () {
            return a3() - bi;
        };
    }, text:function (bg, bf) {
        var bh=new XMLHttpRequest();
        bh.open("GET", bf, false);
        bh.addEventListener("readystatechange", function () {
            bh.readyState === 4 && bh.status === 200 && a6();
        }, false);
        bh.send(null);
        ++H;
        return bh;
    }, fonts:function (bg, bh) {
        var bf=X.head.appendChild(X.createElement("LINK"));
        bf.type="text/css";
        bf.rel="sheetstyle";
        bf.href="http://fonts.googleapis.com/css?family=" + bh.replace(P, "+");
        return bh;
    }}, F=function (bf) {
        return bf.replace(ai, A);
    }, a6=function () {
        aZ.setTimeout(function () {
            I("progress", ++aM, H);
            if (aM >= H) {
                I("complete");
            }
        }, 10);
    };
    var j={linear:function (bg, bh, bf, bi) {
        return bh * bi / bf + bg;
    }};
    var az=function (bf, bg) {
        this.x=bf || 0;
        this.y=bg || 0;
    }, R=function (bf, bg) {
        return new az(bf, bg);
    };
    am(az.prototype, {add:function (bf) {
        return new az(this.x + bf.x, this.y + bf.y);
    }, sub:function (bf) {
        return new az(this.x - bf.x, this.y - bf.y);
    }, scale:function (bf) {
        return new az(this.x * bf, this.y * bf);
    }, dot:function (bf) {
        return this.x * bf.x + this.y * bf.y;
    }, cross:function (bf) {
        return this.x * bf.y - this.y * bf.x;
    }, mul:function (bf) {
        return new az(this.x * bf.x, this.y * bf.y);
    }, div:function (bf) {
        return new az(this.x / bf.x, this.y / bf.y);
    }, squal:function (bf) {
        return this.x === bf.x && this.y === bf.y;
    }, clone:function () {
        return new az(this.x, this.y);
    }, normalize:function () {
        return this.scale(1 / this.length());
    }, sqLength:function () {
        return this.x * this.x + this.y * this.y;
    }, length:function () {
        return ak.sqrt(this.sqLength());
    }});
    var aR={}, ay={}, aL=function (bj, bh, bk) {
        var bl=function () {
        }, bi=aR[bh] || function () {
        }, bg=bl.prototype=new bi();
        bl.prototype.constructor=bl;
        for (var bf in bk) {
            bg[bf]=bk[bf];
        }
        bg.className=bj;
        bg.superClass=bi.prototype;
        aR[bj]=bl;
        ay[bj]=[];
    }, a5=function (bg) {
        console.log(bg);
        var bf=(ay[bg].length > 0 ? ay[bg].pop() : new aR[bg]());
        !bf.guid && (bf.guid= ++W);
        bf.__init__.apply(bf, B.call(arguments, 1));
        return bf;
    }, D=function (bf) {
        ay[bf.className].push(bf);
        bf.free.apply(bf, B.call(arguments, 1));
    };
    aL("Unknown", u, {__init__:function () {
        this.init && this.init();
    }, free:function () {
    }});
    aL("LengthCounter", "Unknown", {__init__:function () {
        this.reset();
    }, reset:function () {
        this.lastTime=w();
        this.restLength=0;
    }, getLength:function (bi, bf) {
        var bj=w();
        bf=(bf || (bj - this.lastTime)) / 1000;
        var bh=bf * bi + this.restLength, bg=bh << 0;
        this.restLength=bh - bg;
        this.lastTime=bj;
        return bg;
    }});
    aL("MotionPath", "Unknown", {PATH_MOVE:0, PATH_LINE:1, PATH_CUBIC:2, __init__:function () {
        this.pathList=[];
        this.length=0;
        this.lastPoint={finish:true};
        this.moveTo(0, 0);
    }, parse:function (bg) {
        var bf=this;
        this.length=0;
        a4(bg, function (bh, bi) {
            switch (bc(bh)) {
                case bf.PATH_MOVE:
                    bf.moveTo.apply(bf, bi);
                    break;
                case bf.PATH_LINE:
                    bf.lineTo.apply(bf, bi);
                    break;
                case bf.PATH_CUBIC:
                    bf.bezierCurveTo.apply(bf, bi);
                    break;
            }
        });
    }, moveTo:function (bf, bg) {
        this.lastPoint.left=this.touchLeft=bf;
        this.lastPoint.top=this.touchTop=bg;
    }, lineTo:function (bf, bh) {
        var bg=this.pathList[this.pathList.length]={type:this.PATH_LINE, origin:this.length, x1:this.touchLeft, y1:this.touchTop, x2:bf - this.touchLeft, y2:bh - this.touchTop};
        this.length+=(bg.length=this.getLineLength(bg));
        bg.distance=this.length;
        this.moveTo(bf, bh);
    }, getLine:function (bg, bf) {
        return{left:bg.x1 + bg.x2 * bf, top:bg.y1 + bg.y2 * bf};
    }, getLineLength:function (bf) {
        return U(bf.x1, bf.y1, bf.x1 + bf.x2, bf.y1 + bf.y2);
    }, bezierCurveTo:function (bi, bk, bg, bj, bf, bh) {
        var bl=this.pathList[this.pathList.length]={type:this.PATH_CUBIC, origin:this.length, x1:this.touchLeft, y1:this.touchTop, x2:bi, y2:bk, x3:bg, y3:bj, x4:bf, y4:bh};
        this.length+=(bl.length=this.getBezierCurveLength(bl));
        bl.distance=this.length;
        this.moveTo(bf, bh);
    }, getBezierCurve:function (bj, bg) {
        var bf=1 - bg, bl=bf * bf * bf, bk=3 * bg * bf * bf, bi=3 * bg * bg * bf, bh=bg * bg * bg;
        return{left:bj.x1 * bl + bj.x2 * bk + bj.x3 * bi + bj.x4 * bh, top:bj.y1 * bl + bj.y2 * bk + bj.y3 * bi + bj.y4 * bh};
    }, getBezierCurveLength:function (bi) {
        var bj, bf, bg=0, bh=0, bj=this.getBezierCurve(bi, bg);
        while ((bg+=0.1) <= 1) {
            bf=this.getBezierCurve(bi, bg);
            bh+=U(bj.left, bj.top, bf.left, bf.top);
            bj=bf;
        }
        return bh;
    }, getPosition:function (bi) {
        var bj, bg;
        if (this.length < bi) {
            return this.lastPoint;
        } else {
            if (bi >= 0) {
                var bh=0, bf=this.pathList.length;
                while (bh <= bf) {
                    bg=((bh + bf) / 2) << 0;
                    bj=this.pathList[bg];
                    if (bj.origin > bi) {
                        bf=bg - 1;
                    } else {
                        if (bj.distance < bi) {
                            bh=bg + 1;
                        } else {
                            bf=bg;
                            break;
                        }
                    }
                }
                bg=(bi - bj.origin) / bj.length;
            } else {
                bj=this.pathList[0];
                bg=0;
            }
        }
        switch (bj.type) {
            case this.PATH_LINE:
                return this.getLine(bj, bg);
            case this.PATH_CUBIC:
                return this.getBezierCurve(bj, bg);
        }
        return this.lastPoint;
    }});
    aL("ImpactTest", "Unknown", {ENTITY_LINE:1, ENTITY_CIRCLE:2, __init__:function () {
        this.indexList=[];
        this.entityList=[];
        this.dynamicList=[];
        this.clear();
    }, clear:function () {
        this.widgetTree={};
        this.indexList.length=0;
        this.entityList.length=0;
        this.dynamicList.length=0;
    }, parse:function (bg) {
        var bf=this;
        a4(bg, function (bh, bi) {
            switch (bc(bh)) {
                case bf.ENTITY_LINE:
                    bf.appendChild(bf.allocLine.apply(bf, bi));
                    break;
                case bf.ENTITY_CIRCLE:
                    bf.appendChild(bf.allocCircle.apply(bf, bi));
                    break;
            }
        });
    }, appendChild:function (bh) {
        if (typeof bh !== "function") {
            var bg=bh.left, bf=this.widgetTree[bg] || (this.widgetTree[bg]=[]);
            bf[bf.length]=bh;
            this.indexList.indexOf(bg) === -1 && (this.indexList[this.indexList.length]=bg);
            this.indexSort=true;
        } else {
            this.dynamicList[this.dynamicList.length]=bh;
        }
    }, appendEntity:function (bj) {
        var bg=bj.length, bh=[], bm, bf, bi, bk;
        while (bg--) {
            var bl=bj[bg];
            switch (bl.type) {
                case this.ENTITY_LINE:
                    bl=bh[bh.length]=this.allocLine(bl.x1, bl.y1, bl.x2, bl.y2);
                    bm=bm < bl.left ? bm : bl.left;
                    bf=bf < bl.top ? bf : bl.top;
                    bi=bi > bl.right ? bi : bl.right;
                    bk=bk > bl.bottom ? bk : bl.bottom;
                    break;
                case this.ENTITY_CIRCLE:
                    bl=bh[bh.length]=this.allocCircle(bl.x, bl.y, bl.radius);
                    bm=bm < bl.left ? bm : bl.left;
                    bf=bf < bl.top ? bf : bl.top;
                    bi=bi > bl.right ? bi : bl.right;
                    bk=bk > bl.bottom ? bk : bl.bottom;
                    break;
            }
        }
        this.entityList[this.entityList.length]={rect:{left:bm, top:bf, right:bi, bottom:bk}, children:bh};
    }, allocLine:function (bh, bj, bg, bi) {
        var bf={type:this.ENTITY_LINE, x1:bh, y1:bj, sqX1:bh * bh, sqY1:bj * bj, x2:bg, y2:bi, width:bg - bh, height:bi - bj};
        if (bh <= bg) {
            bf.left=bh - 0.5;
            bf.right=bg + 0.5;
        } else {
            bf.left=bg - 0.5;
            bf.right=bh + 0.5;
        }
        if (bj <= bi) {
            bf.top=bj - 0.5;
            bf.bottom=bi + 0.5;
        } else {
            bf.top=bi - 0.5;
            bf.bottom=bj + 0.5;
        }
        if (bh === bg) {
            bf.k=1;
            bf.c=0;
            bf.b= -bh;
        } else {
            if (bj === bi) {
                bf.k=0;
                bf.c=1;
                bf.b=bj;
            } else {
                bf.k=(bi - bj) / (bg - bh);
                bf.c=1;
                bf.b=bj - bf.k * bh;
            }
        }
        return bf;
    }, allocCircle:function (bg, bh, bf) {
        return{type:this.ENTITY_CIRCLE, left:bg - bf, top:bh - bf, right:bg + bf, bottom:bh + bf, x:bg, y:bh, sqX:bg * bg, sqY:bh * bh, radius:bf, sqRadius:bf * bf};
    }, isLineInRect:function (bg, bi) {
        var bh=(bg.x1 < bi.left ? 1 : 0) << 3 | (bg.x1 > bi.right ? 1 : 0) << 2 | (bg.y1 < bi.top ? 1 : 0) << 1 | (bg.y1 > bi.bottom ? 1 : 0), bf=(bg.x2 < bi.left ? 1 : 0) << 3 | (bg.x2 > bi.right ? 1 : 0) << 2 | (bg.y2 < bi.top ? 1 : 0) << 1 | (bg.y2 > bi.bottom ? 1 : 0);
        return(bh & bf) === 0;
    }, checkSegment:function (bg, bf) {
        var bi, bh;
        if (bg.c === 0) {
            bi=-bg.b / bg.k;
            bh=(bf.k * bi + bf.b) * bf.c;
        } else {
            if (bf.c === 0) {
                bi=-bf.b / bf.k;
                bh=(bg.k * bi + bg.b) * bg.c;
            } else {
                bi=(bf.b - bg.b) / (bg.k - bf.k);
                bh=(bg.k * bi + bg.b) * bg.c;
            }
        }
        return(bi >= bg.left && bi <= bg.right && bi >= bf.left && bi <= bf.right && bh >= bg.top && bh <= bg.bottom && bh >= bf.top && bh <= bf.bottom && {left:bi, top:bh});
    }, checkCircle:function (bk, bg) {
        if (bg.sqRadius >= aE(bg.x, bg.y, bk.x1, bk.y1)) {
            return{left:bk.x1, top:bk.y1};
        } else {
            if (bg.sqRadius >= aE(bg.x, bg.y, bk.x2, bk.y2)) {
                return{left:bk.x2, top:bk.y2};
            } else {
                var bi=bk.width * bk.width + bk.height * bk.height, bh=2 * (bk.width * (bk.x1 - bg.x) + bk.height * (bk.y1 - bg.y)), bf=bg.sqX + bg.sqY + bk.sqX1 + bk.sqY1 - 2 * (bg.x * bk.x1 + bg.y * bk.y1) - bg.sqRadius, bn=bh * bh - 4 * bi * bf, bm;
                if (bn > 0) {
                    bn=ak.sqrt(bn);
                    var bl=(-bh + bn) / (2 * bi), bj=(-bh - bn) / (2 * bi);
                    if (bl >= 0 && bl <= 1 && bj >= 0 && bj <= 1) {
                        bm=(bl + bj) / 2;
                        return{left:bk.x1 + bk.width * bm, top:bk.y1 + bk.height * bm};
                    }
                }
            }
        }
        return false;
    }, getImpact:function (bo) {
        var bf=aC(bo), bt=bo.length - 2, bw=this.indexList, bu=this.widgetTree, bq=this.entityList, bx=[], bm=[], bv=[], bp, bj, bi, bg, bn;
        if (this.indexSort === true) {
            bw.sort(function (by, bz) {
                return by - bz;
            });
        }
        bp=0;
        while (bp < bt) {
            bv[bv.length]=this.allocLine(bo[bp], bo[bp + 1], bo[bp + 2], bo[bp + 3]);
            bp+=2;
        }
        bv[bv.length]=this.allocLine(bo[bp - 2], bo[bp - 1], bo[0], bo[1]);
        bp=0;
        bi=bw.length;
        while (bp < bi) {
            var bs=bw[bp++];
            if (bs > bf.right) {
                break;
            } else {
                var bh=bu[bs], bl=bh.length;
                while (bl--) {
                    bj=bh[bl];
                    if (!(bj.right < bf.left || bj.top > bf.bottom || bj.bottom < bf.top) && (bj.type === this.ENTITY_CIRCLE || this.isLineInRect(bj, bf))) {
                        bg=bv.length;
                        while (bg--) {
                            switch (bj.type) {
                                case this.ENTITY_LINE:
                                    bn=this.checkSegment(bv[bg], bj);
                                    break;
                                case this.ENTITY_CIRCLE:
                                    bn=this.checkCircle(bv[bg], bj);
                                    break;
                            }
                            if (bn) {
                                return bn;
                            }
                        }
                    }
                }
            }
        }
        bp=bq.length;
        while (bp--) {
            var br=bq[bp].rect;
            if (!(bf.left > br.right || bf.right < br.left || bf.top > br.bottom || bf.bottom < br.top)) {
                var bj=bq[bp], bk=bj.children, bl=bk.length;
                while (bl--) {
                    bj=bk[bl];
                    if (!(bj.right < bf.left || bj.top > bf.bottom || bj.bottom < bf.top) && (bj.type === this.ENTITY_CIRCLE || this.isLineInRect(bj, bf))) {
                        bg=bv.length;
                        while (bg--) {
                            switch (bj.type) {
                                case this.ENTITY_LINE:
                                    bn=this.checkSegment(bv[bg], bj);
                                    break;
                                case this.ENTITY_CIRCLE:
                                    bn=this.checkCircle(bv[bg], bj);
                                    break;
                            }
                            if (bn) {
                                return bn;
                            }
                        }
                    }
                }
            }
        }
        if (this.dynamicList.length > 0) {
            bp=this.dynamicList.length;
            while (bp--) {
                bj=this.dynamicList[bp]();
                bg=bv.length;
                while (bg--) {
                    switch (bj.type) {
                        case this.ENTITY_LINE:
                            bj=this.allocLine(bj.x1, bj.y1, bj.x2, bj.y2);
                            bn=this.checkSegment(bv[bg], bj);
                            break;
                        case this.ENTITY_CIRCLE:
                            bj=this.allocCircle(bj.x, bj.y, bj.radius);
                            bn=this.checkCircle(bv[bg], bj);
                            break;
                    }
                    if (bn) {
                        bn.dynamic=this.dynamicList[bp];
                        return bn;
                    }
                }
            }
        }
        return false;
    }, getImpactList:function (bq) {
        var bs=aC(bq), bl=this.indexList, bk=this.widgetTree, bt=[], bi=[], bo, bp, bh;
        if (this.indexSort === true) {
            bl.sort(function (bu, bv) {
                return bu - bv;
            });
        }
        bp=0;
        bh=bl.length;
        while (bp < bh) {
            var bf=bl[bp++];
            if (bf > bs.right) {
                break;
            } else {
                var bn=bk[bf], bj=bn.length;
                while (bj--) {
                    bo=bn[bj];
                    if (!(bo.right < bs.left || bo.top > bs.bottom || bo.bottom < bs.top) && (bo.type === this.ENTITY_CIRCLE || this.isLineInRect(bo, bs))) {
                        bt[bt.length]=bo;
                    }
                }
            }
        }
        bp=bt.length;
        if (bp !== 0) {
            var bm=[], bj=0, br, bg;
            bh=bq.length - 2;
            while (bj < bh) {
                bm[bm.length]=this.allocLine(bq[bj], bq[bj + 1], bq[bj + 2], bq[bj + 3]);
                bj+=2;
            }
            bm[bm.length]=this.allocLine(bq[bj - 2], bq[bj - 1], bq[0], bq[1]);
            while (bp--) {
                bo=bt[bp];
                switch (bo.type) {
                    case this.ENTITY_LINE:
                        bg=this.checkSegment;
                        break;
                    case this.ENTITY_CIRCLE:
                        bg=this.checkCircle;
                        break;
                }
                bj=bm.length;
                while (bj--) {
                    br=bg.call(this, bm[bj], bo);
                    br && (bi[bi.length]=br);
                }
            }
        }
        return bi;
    }});
    var f={}, O=function (bf) {
        return bf.replace(E, bd).replace(ai, A);
    };
    aL("DOM", "Unknown", {useCanvas:false, __init__:function (bg, bi, bh) {
        var bf=this;
        bh=this.useCanvas ? "CANVAS" : bh;
        bi=f[bi];
        this.name=bg;
        this.parent=bi;
        if (bi) {
            this.path=bi.path + "." + bg;
            this.__view__=bi.__view__.appendChild(X.createElement(bh || "DIV"));
        } else {
            this.path=bg;
            this.__view__=X.body.appendChild(X.createElement(bh || "DIV"));
        }
        this.__view__.__model__=this;
        this.__text__=this.__view__.appendChild(X.createElement("DIV"));
        f[this.path]=this;
        this.setStyle("position: absolute;");
        this.init && aZ.setTimeout(function () {
            bf.init();
        }, 0);
    }, findChild:function (bf) {
        return f[this.path + "." + bf];
    }, filterChild:function (bi) {
        var bh=[];
        for (var bg in f) {
            var bf=f[bg];
            if (bg.indexOf(this.path) === 0 && bi(bg, bf)) {
                bh[bh.length]=bf;
            }
        }
        return bh;
    }, getContext:function (bg, bf) {
        this.setStyle("width: ?px; height: ?px", bg, bf);
        this.__view__.width=bg * m;
        this.__view__.height=bf * m;
        return this.__view__.getContext("2d").__init__();
    }, getText:function () {
        return this.__text.innerHTML;
    }, setText:function (bf) {
        this.__text__.innerHTML=bf;
    }, getRect:function () {
        var bf=this.__view__.getBoundingClientRect();
        return{left:(bf.left - o) / aS, top:bf.top / aS, right:(bf.right - o) / aS, bottom:bf.bottom / aS, width:bf.width / aS, height:bf.height / aS};
    }, setStyle:function (bg) {
        if (arguments.length > 1) {
            var bf=0, bh=arguments;
            bg=bg.replace(aU, function () {
                return bh[++bf];
            });
        }
        this.__view__.style.cssText+=O(bg);
    }, setStyleAttr:function (bg) {
        var bh=this.__view__.style;
        for (var bf in bg) {
            if (bg.hasOwnProperty(bf)) {
                bh[bf[0].toUpperCase() === bf[0] ? a0 + bf : bf]=bg[bf];
            }
        }
    }, setVisible:function (bf) {
        this.__view__.style.visibility=(bf === true ? "inherit" : "hidden");
    }, addClass:function (bj) {
        var bi=bj.split(P), bg=bi.length, bh=this.__view__.className.split(P);
        while (bg--) {
            var bf=bi[bg];
            if (bh.indexOf(bf) === -1) {
                bh[bh.length]=bf;
            }
        }
        this.__view__.className=bh.join(" ");
    }, delClass:function (bj) {
        var bi=bj.split(P), bf=bi.length, bg=this.__view__.className.split(P);
        while (bf--) {
            var bh=bg.indexOf(bi[bf]);
            if (bh > -1) {
                bg.splice(bh, 1);
            }
        }
        this.__view__.className=bg.join(" ");
    }, hasClass:function (bf) {
        return(" " + this.__view__.className + " ").indexOf(" " + bf + " ") > -1;
    }, getTouchPoint:function () {
        var bf=ah[0];
        return{guid:bf.identifier, left:((bf.pageX - o) / aS) << 0, top:((bf.pageY - d) / aS) << 0};
    }, getLastTouchPoint:function () {
        var bf=s.length;
        while (bf--) {
            var bg=s[bf];
            if (!S[bg.identifier]) {
                return{guid:bg.identifier, left:((bg.pageX - o) / aS) << 0, top:((bg.pageY - d) / aS) << 0};
            }
        }
    }, getTouchList:function () {
        var bf=s.length, bg={};
        while (bf--) {
            var bh=s[bf];
            bg[bh.identifier]={left:((bh.pageX - o) / aS) << 0, top:((bh.pageY - d) / aS) << 0};
        }
        return bg;
    }});
    var c=CanvasRenderingContext2D.prototype;
    am(c, {SORT_REAL_TIME:1, SORT_TIME_SHARING:2, TEXT_LEFT:0, TEXT_CENTER:1, TEXT_RIGHT:2, __sort__:false, __schedule__:false, __init__:function () {
        this.flushRect={};
        this.flushIndex={};
        this.childNodes=[];
        this.lineWidth=1 * m;
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.setFont(14, "Courier New");
        this.setSortSchedule(this.SORT_REAL_TIME);
        return this;
    }, fixScale:function () {
        if (m === 1) {
            c.drawImageScale=c.drawImage;
            c.transformScale=c.transform;
            c.setTransformScale=c.setTransform;
            c.moveToScale=c.moveTo;
            c.lineToScale=c.lineTo;
            c.arcScale=c.arc;
            c.strokeRectScale=c.strokeRect;
            c.fillRectScale=c.fillRect;
            c.fillTextScale=c.fillText;
        } else {
            am(c, {drawImageScale:function () {
                var bf=arguments.length;
                while (--bf) {
                    arguments[bf]*=m;
                }
                this.drawImage.apply(this, arguments);
            }, transformScale:function (bi, bk, bh, bj, bg, bf) {
                this.transform(bi, bk, bh, bj, bg * m, bf * m);
            }, setTransformScale:function (bi, bk, bh, bj, bg, bf) {
                this.setTransform(bi, bk, bh, bj, bg * m, bf * m);
            }, moveToScale:function (bg, bf) {
                this.moveTo(bg * m, bf * m);
            }, lineToScale:function (bg, bf) {
                this.lineTo(bg * m, bf * m);
            }, arcScale:function (bi, bh, bf, bj, bg) {
                this.arc(bi * m, bh * m, bf * m, bj, bg, false);
            }, strokeRectScale:function (bi, bh, bg, bf) {
                this.strokeRect(bi * m, bh * m, bg * m, bf * m);
            }, fillRectScale:function (bi, bh, bg, bf) {
                this.fillRect(bi * m, bh * m, bg * m, bf * m);
            }, fillTextScale:function (bh, bg, bf) {
                this.fillText(bh, bg * m, bf * m);
            }});
        }
    }, appendChild:function (bg) {
        var bf=a5(bg, this);
        this.childNodes.push(bf);
        return bf;
    }, setLineWidth:function (bf) {
        this.lineWidth=bf * m;
    }, setFont:function (bh, bg, bf) {
        this.font=(bf === true ? "bold " : "") + bh * m + "px '" + bg + "'";
    }, drawText:function (bs, bj, bp, bf, bg, bq) {
        var br=this.measureText(bs).width, bl=bq * m, bo=bf * m;
        if (br > bo) {
            var bh=bs.length, bk=bj * m, bi=bp * m, bn=0;
            br=0;
            for (var bm=0; bm < bh; bm++) {
                br+=this.measureText(bs[bm]).width;
                if (br < bo) {
                    continue;
                }
                this.fillText(bs.substring(bn, bm), bk, bi);
                bi+=bl;
                bp+=bq;
                br=0;
                bn=bm;
            }
            bs=bs.substr(bn);
        }
        switch (bg) {
            case this.TEXT_CENTER:
                bj=bj + bf / 2 - br / 2;
                break;
            case this.TEXT_RIGHT:
                bj=bj + bf - br;
                break;
        }
        this.fillText(bs, bj * m, bp * m);
    }, clear:function () {
        this.clearRect(0, 0, this.width, this.height);
    }, ascsort:function (bg, bf) {
        return bg.__layer__ - bf.__layer__;
    }, descsort:function (bg, bf) {
        return bf.__layer__ - bg.__layer__;
    }, layer:function () {
        this.childNodes.sort(this.ascsort);
        this.__sort__=false;
    }, setSortSchedule:function (bf) {
        this.__schedule__=bf;
    }, flush:function () {
        var bk=this.flushRect, bp=this.childNodes, bi=this.flushIndex, bg=w(), bj=[], bo, bm;
        if (this.__schedule__ === this.SORT_TIME_SHARING && this.__sort__) {
            this.layer();
        }
        for (bm in bi) {
            bi[bm].flushRect();
        }
        if (bk.left === u) {
            return;
        }
        var br=bk.left < 0 ? 0 : bk.left << 0, bq=bk.top < 0 ? 0 : bk.top << 0, bl=bk.right > this.width ? this.width : ak.ceil(bk.right), bh=bk.bottom > this.height ? this.height : ak.ceil(bk.bottom), bn=bl - br, bf=bh - bq;
        this.flushRect={};
        this.flushIndex={};
        if (bn <= 0 || bf <= 0) {
            return;
        }
        bm=bp.length;
        while (bm--) {
            bo=bp[bm];
            if (bo.__visible__) {
                if (bo.__update__) {
                    bj[bj.length]=bo;
                } else {
                    if (bo.__left__ >= bl || bo.__top__ >= bh || bo.__right__ <= br || bo.__bottom__ <= bq) {
                        continue;
                    }
                    bj[bj.length]=bo;
                }
            }
        }
        this.clearRect(br, bq, bn, bf);
        bm=bj.length;
        if (bm > 0) {
            if (this.__schedule__ === this.SORT_REAL_TIME) {
                bj.sort(this.descsort);
            }
            this.save();
            this.beginPath();
            this.rect(br, bq, bn, bf);
            this.clip();
            while (bm--) {
                bo=bj[bm];
                if (bo.__alpha__ !== this.globalAlpha) {
                    this.globalAlpha=bo.__alpha__;
                }
                bo.drawSprite(this, bg);
                bo.__update__=false;
            }
            this.closePath();
            this.restore();
        }
    }});
    var g=0, aK=1, aH=2, a8=3, aF={}, af=function (bn) {
        var bf=bn[0], bk=0, bj=0, bg=false, bm;
        switch (bn.length) {
            case 3:
                bk=bn[1];
                bj=bn[2];
                bg=true;
            case 1:
                bm={type:g, source:bf, width:bf.width, height:bf.height, centerLeft:bk, centerTop:bj, center:bg};
                break;
            case 6:
                bk=bn[4];
                bj=bn[5];
                bg=true;
            case 4:
                var bh=bn[1], bq=bn[2], bl=bc(bf.width / bh), bp=bn[3];
                bm={type:aH, source:bf, left:bp % bl * bh * m, top:bc(bp / bl) * bq * m, width:bh, height:bq, centerLeft:bk, centerTop:bj, center:bg};
                break;
            case 7:
                bk=bn[5];
                bj=bn[6];
                bg=true;
            case 5:
                bm=bn[3];
                var bh=bn[1], bq=bn[2], bi=bn[4], bl=bc(bf.width / bh), bp=bm.length;
                while (bp--) {
                    var bo=bm[bp];
                    bm[bp]={left:bo % bl * bh * m, top:bc(bo / bl) * bq * m};
                }
                bm.type=a8;
                bm.source=bf;
                bm.width=bh;
                bm.height=bq;
                bm.interval=bi;
                bm.centerLeft=bk;
                bm.centerTop=bj;
                bm.center=bg;
                break;
            default:
                bm={};
                break;
        }
        return bm;
    }, at=function (bf, bj) {
        var bh=bj[0], bi=0, bg=0;
        if (bh.loader) {
            aF[bf]={type:aK, loader:function (bk) {
                bh.loader(function () {
                    aF[bf]=af(bj);
                    bk.setFrame(bf);
                    bk.setPosition(bk.vectorLeft, bk.vectorTop);
                });
            }};
        } else {
            aF[bf]=af(bj);
        }
    };
    aL("Sprite", "Unknown", {RADIAN:ak.PI / 180, POSITION_NONE:0, POSITION_LEFT:1, POSITION_CENTER:2, POSITION_RIGHT:4, POSITION_TOP:16, POSITION_MIDDLE:32, POSITION_BOTTOM:64, TRANSFORM_NONE:1, TRANSFORM_MIRROR:2, TRANSFORM_ROTATE:3, __visible__:false, __update__:false, __alpha__:1, __layer__:0, __centerLeft__:0, __centerTop__:0, __init__:function (bf) {
        this.parent=bf;
        this.__transform__=this.TRANSFORM_NONE;
        this.init && this.init();
    }, remove:function (bf) {
        if (this.parent) {
            bf === u && D(this);
            this.setVisible(false);
            delete this.parent.flushIndex[this.guid];
            this.parent.childNodes.splice(this.parent.childNodes.indexOf(this), 1);
            this.parent=this.frameName=this.vectorLeft=this.__rectLeft__=u;
        }
    }, update:function () {
        this.parent.flushIndex[this.guid]=this;
    }, flush:function () {
        this.parent.flushIndex[this.guid]=this;
        this.__update__=true;
    }, flushRect:function () {
        var bi=this.parent.flushRect;
        if (this.__rectLeft__ !== u) {
            bi.left=bi.left < this.__rectLeft__ ? bi.left : this.__rectLeft__;
            bi.top=bi.top < this.__rectTop__ ? bi.top : this.__rectTop__;
            bi.right=bi.right > this.__rectRight__ ? bi.right : this.__rectRight__;
            bi.bottom=bi.bottom > this.__rectBottom__ ? bi.bottom : this.__rectBottom__;
        }
        if (this.__update__ === true && this.vectorLeft !== u) {
            var bh=(this.vectorLeft * m) << 0, bg=(this.vectorTop * m) << 0;
            switch (this.__transform__) {
                case this.TRANSFORM_MIRROR:
                    var bf=aV(this.__centerLeft__, this.__centerTop__, this.__m11__, this.__m21__, this.__m12__, this.__m22__, bh, bg);
                    this.__targetLeft__= -bf.left;
                    this.__targetTop__=bf.top;
                    this.__rectRight__=bh - this.__centerLeft__;
                    this.__rectTop__=bg + this.__centerTop__;
                    this.__rectLeft__=this.__rectRight__ - this.__targetWidth__;
                    this.__rectBottom__=this.__rectTop__ + this.__targetHeight__;
                    break;
                case this.TRANSFORM_ROTATE:
                    this.__targetLeft__=bh;
                    this.__targetTop__=bg;
                    var bf=aC(an([this.__centerLeft__, this.__centerTop__, this.__centerLeft__ + this.__targetWidth__, this.__centerTop__, this.__centerLeft__ + this.__targetWidth__, this.__centerTop__ + this.__targetHeight__, this.__centerLeft__, this.__centerTop__ + this.__targetHeight__], this.__m11__, this.__m21__, this.__m12__, this.__m22__, bh, bg));
                    this.__rectLeft__=bf.left;
                    this.__rectTop__=bf.top;
                    this.__rectRight__=bf.right;
                    this.__rectBottom__=bf.bottom;
                    break;
                default:
                    this.__targetLeft__=this.__centerLeft__ + bh;
                    this.__targetTop__=this.__centerTop__ + bg;
                    this.__rectLeft__=this.__targetLeft__;
                    this.__rectTop__=this.__targetTop__;
                    this.__rectRight__=this.__targetLeft__ + this.__targetWidth__;
                    this.__rectBottom__=this.__targetTop__ + this.__targetHeight__;
                    break;
            }
            bi.left=bi.left < this.__rectLeft__ ? bi.left : this.__rectLeft__;
            bi.top=bi.top < this.__rectTop__ ? bi.top : this.__rectTop__;
            bi.right=bi.right > this.__rectRight__ ? bi.right : this.__rectRight__;
            bi.bottom=bi.bottom > this.__rectBottom__ ? bi.bottom : this.__rectBottom__;
        } else {
            this.__update__=true;
        }
    }, setVisible:function (bf) {
        if (this.__visible__ !== bf) {
            this.__visible__=bf;
            if (!bf) {
                this.flushRect();
                delete this.parent.flushIndex[this.guid];
            } else {
                this.update();
            }
        }
    }, setAlpha:function (bf) {
        this.__alpha__=bf;
        this.update();
    }, setLayer:function (bf) {
        if (this.__layer__ !== bf) {
            this.__layer__=bf;
            this.parent.__sort__=true;
        }
        this.update();
    }, setCenter:function () {
        switch (arguments.length) {
            case 1:
                var bf=arguments[0];
                switch (bf & 15) {
                    case this.POSITION_LEFT:
                        this.__centerLeft__=0;
                        break;
                    case this.POSITION_CENTER:
                        this.__centerLeft__= -ak.round(this.__targetWidth__ / 2);
                        break;
                    case this.POSITION_RIGHT:
                        this.__centerLeft__= -ak.round(this.__targetWidth__);
                        break;
                }
                switch (bf & 240) {
                    case this.POSITION_TOP:
                        this.__centerTop__=0;
                        break;
                    case this.POSITION_MIDDLE:
                        this.__centerTop__= -ak.round(this.__targetHeight__ / 2);
                        break;
                    case this.POSITION_BOTTOM:
                        this.__centerTop__= -ak.round(this.__targetHeight__);
                        break;
                }
                break;
            case 2:
                this.__centerLeft__=-arguments[0] * m;
                this.__centerTop__=-arguments[1] * m;
                break;
        }
        this.flush();
    }, resetRotate:function () {
        this.__transform__=this.TRANSFORM_NONE;
        this.flush();
    }, setRotate:function (bf) {
        bf*=this.RADIAN;
        this.__transform__=this.TRANSFORM_ROTATE;
        this.__m22__=this.__m11__=ak.cos(bf);
        this.__m12__= -(this.__m21__=ak.sin(bf));
        this.flush();
    }, setRadian:function (bf) {
        this.__transform__=this.TRANSFORM_ROTATE;
        this.__m22__=this.__m11__=ak.cos(bf);
        this.__m12__= -(this.__m21__=ak.sin(bf));
        this.flush();
    }, setMirror:function (bf) {
        this.__transform__=bf ? this.TRANSFORM_MIRROR : this.TRANSFORM_NONE;
        this.__m11__= -(this.__m22__=1);
        this.__m12__=this.__m21__=0;
        this.flush();
    }, setSize:function (bg, bf) {
        this.vectorWidth=bg;
        this.vectorHeight=bf;
        this.__targetWidth__=bg * m;
        this.__targetHeight__=bf * m;
        this.flush();
    }, setPosition:function (bg, bf) {
        this.vectorLeft=bg;
        this.vectorTop=bf;
        this.flush();
    }, drawSelf:function (bf, bh) {
        switch (this.__frame__.type) {
            case a8:
                var bg=((bh - this.__startTime__) / this.__interval__) << 0, bj=this.__frame__[bg % this.__length__];
                this.__sourceLeft__=bj.left;
                this.__sourceTop__=bj.top;
                if (this.trigger) {
                    var bi=(bg / this.__length__) << 0;
                    if (this.__times__ !== bi) {
                        this.__times__=bi;
                        if (this.trigger() === false) {
                            return;
                        }
                    }
                }
                break;
        }
        switch (this.__transform__) {
            case this.TRANSFORM_NONE:
                bf.drawImage(this.__source__, this.__sourceLeft__, this.__sourceTop__, this.__targetWidth__, this.__targetHeight__, this.__targetLeft__, this.__targetTop__, this.__targetWidth__, this.__targetHeight__);
                break;
            case this.TRANSFORM_ROTATE:
                bf.transform(this.__m11__, this.__m21__, this.__m12__, this.__m22__, this.__targetLeft__, this.__targetTop__);
                bf.drawImage(this.__source__, this.__sourceLeft__, this.__sourceTop__, this.__targetWidth__, this.__targetHeight__, this.__centerLeft__, this.__centerTop__, this.__targetWidth__, this.__targetHeight__);
                bf.setTransform(1, 0, 0, 1, 0, 0);
                break;
            default:
                bf.transform(this.__m11__, this.__m21__, this.__m12__, this.__m22__, 0, 0);
                bf.drawImage(this.__source__, this.__sourceLeft__, this.__sourceTop__, this.__targetWidth__, this.__targetHeight__, this.__targetLeft__, this.__targetTop__, this.__targetWidth__, this.__targetHeight__);
                bf.transform(this.__m11__, -this.__m21__, -this.__m12__, this.__m22__, 0, 0);
                break;
        }
    }, setFrame:function (bf) {
        if (this.frameName === bf) {
            return;
        }
        var bg=aF[bf];
        switch (bg.type) {
            case g:
                this.__sourceLeft__=0;
                this.__sourceTop__=0;
                break;
            case aK:
                bg.loader(this);
                this.drawSprite=function () {
                };
                return;
            case aH:
                this.__sourceLeft__=bg.left;
                this.__sourceTop__=bg.top;
                break;
            case a8:
                this.__times__=0;
                this.__length__=bg.length;
                this.__interval__=bg.interval;
                this.__startTime__=w();
                break;
            default:
                return;
        }
        this.frameName=bf;
        this.drawSprite=this.drawSelf;
        this.vectorWidth=bg.width;
        this.vectorHeight=bg.height;
        this.__frame__=bg;
        this.__source__=bg.source;
        this.setSize(bg.width, bg.height);
        bg.center && this.setCenter(bg.centerLeft, bg.centerTop);
        this.flush();
    }});
    var ah, s, aB, S={}, N=0, aY=function (bf) {
        while (bf && !bf.__model__) {
            bf=bf.parentNode;
        }
        return bf;
    }, aj=function (bi) {
        var bg=bi.type, bl=aY(bi.target);
        bi.stopPropagation();
        if (!bl) {
            return;
        }
        bi.touches.length > 0 && (ah=bi.touches);
        s=bi.touches;
        bl=bl.__model__;
        switch (bg) {
            case"touchstart":
                aB=bl;
                bl.mouseover && bl.mouseover();
                bl.mousedown && bl.mousedown();
                var bf=s.length;
                while (bf--) {
                    S[s[bf].identifier]=true;
                }
                break;
            case"touchmove":
                bl.mousemove && bl.mousemove();
                break;
            case"touchend":
                aB=u;
                if (bl.click) {
                    var bh=bl.__view__.getBoundingClientRect(), bk=ah[0].pageX, bj=ah[0].pageY - d;
                    if (bh.left < bk && bh.right > bk && bh.top < bj && bh.bottom > bj) {
                        bl.click();
                    }
                }
                bl.mouseup && bl.mouseup();
                bl.mouseout && bl.mouseout();
                bi.touches.length === 0 && (S={});
                return;
        }
    }, bb=function (bg) {
        var bf=bg.type;
        bg.stopPropagation();
        switch (bf) {
            case"mousedown":
                arguments.callee.target=bg.target;
                arguments.callee.touchstart=true;
                bf="touchstart";
                N= ++W;
                break;
            case"mouseup":
                arguments.callee.touchstart=false;
                bf="touchend";
                N=u;
                break;
            case"mousemove":
                if (arguments.callee.touchstart !== true) {
                    return;
                }
                bf="touchmove";
                break;
        }
        aj({type:bf, target:arguments.callee.target, stopPropagation:function () {
        }, touches:[
            {identifier:N, pageX:bg.pageX, pageY:bg.pageY}
        ]});
    };
    var aN=function (bf) {
        ad.HAS_PUBLIC_API && SpilGames.Highscores.insert({score:bf});
        if (!(ad.global.highScore > bf)) {
            ad.global.highScore=bf;
            ae();
        }
    }, al=function () {
        return ad.global.highScore;
    }, b=function (bf) {
        if (ad.HAS_PUBLIC_API) {
            SpilGames.Highscores.showScoreboard();
        } else {
            alert(SpilGames._("HighScore: %s", ad.global.highScore || 0));
        }
    }, Y=function () {
        return(ad.HAS_PUBLIC_API && SpilGames.Settings.get("currentGameInfo").splashScreen) || "./system/Logo.png";
    }, a1=function () {
        if (ad.orientation === 0) {
            return(ad.HAS_PUBLIC_API && SpilGames.Settings.get("currentGameInfo").rotationLockSreen.portrait) || "./system/Portrait.png";
        } else {
            return(ad.HAS_PUBLIC_API && SpilGames.Settings.get("currentGameInfo").rotationLockSreen.landscape) || "./system/Landscape.png";
        }
    };
    am(ad, {IS_MOBILE:aT, IS_COMPUTER:!aT, IS_IOS:ab || t || aw, IS_IPAD:ab, IS_IPOD:t, IS_IPHONE:aw, IS_ANDROID:e, getScore:al, submitScore:aN, showScoreboard:b, getTime:w, resetTime:ax, flushTime:K, pauseTime:V, resumeTime:h, setTimeRatio:z, setTimeout:aD, clearTimeout:aJ, getUrl:F, random:av, randomChoise:v, transform:aV, transformShape:an, transformInverse:aI, parseArray:a4, distance:U, distanceSquare:aE, setScaleRatio:J, getBoundingRect:aC, getVector:R, loadSetting:a7, saveSetting:ae, clearSetting:aW, connect:a9, message:I, setScene:n, mainLoop:p, tween:j, allocClass:aL, allocObject:a5, freeObject:D});
    var l={resize:function (bf) {
        switch (bf) {
            case"portrait":
                ad.orientation=0;
                ad.width=320;
                ad.naturalWidth=320;
                ad.height=416;
                ad.naturalHeight=480;
                return true;
            case"landscape":
                ad.orientation=90;
                ad.width=480;
                ad.naturalWidth=480;
                ad.height=268;
                ad.naturalHeight=320;
                return true;
            default:
                return false;
        }
    }, screen:function () {
        aS=ak.min(2, bc(ak.min(aZ.innerWidth / ad.width, aZ.innerHeight / ad.height) * 100) / 100);
        if (aS >= 2 || ((t || aw) && aZ.devicePixelRatio === 2)) {
            m=2;
        }
        A=(m === 1 ? "$1" : "x" + m + "$1");
        o=bc((aZ.innerWidth - ad.naturalWidth * aS) / 2);
        d=bc((aZ.innerHeight - ad.naturalHeight * aS) / 2);
        ad.clientWidth=bc(ak.min(aZ.innerWidth / aS, ad.naturalWidth));
        ad.clientHeight=bc(ak.min(aZ.innerHeight / aS, ad.naturalHeight));
        ad.root.setStyle("left: ?px; top: 0px; width: ?px; height: ?px; -transform: scale(?); -transform-origin: 0px 0px;", o, ad.naturalWidth, ad.naturalHeight, aS);
        ad.offsetLeft=bc(-ak.min(0, o / aS));
        ad.offsetTop=bc(-ak.min(0, d / aS));
        o=ak.max(0, o);
        d=ak.max(0, -d);
        K();
        c.fixScale();
    }, preload:function (bk) {
        var bj=aZ.cacheManifest;
        if (bj && bj.length > 0) {
            var bg=0, bf=bj.length, bi=aZ.devicePixelRatio >= 2 || ab ? "x2$1" : "$1";
            while (bf--) {
                var bh=new Image();
                bh.onload=function () {
                    if (++bg === bj.length) {
                        bk();
                    }
                };
                bh.src=bj[bf].replace(ai, bi);
            }
        } else {
            bk();
        }
    }, eventAssign:function () {
        if (aT) {
            X.addEventListener("touchstart", aj, false);
            X.addEventListener("touchmove", aj, false);
            X.addEventListener("touchend", aj, false);
        } else {
            X.addEventListener("mousedown", bb, false);
            X.addEventListener("mousemove", bb, false);
            X.addEventListener("mouseup", bb, false);
        }
    }, decorator:function () {
        var bf=X.head.appendChild(X.createElement("STYLE"));
        bf.type="text/css";
        bf.textContent=O(["body			{ font: 16px/20px 'Courier New'; padding: 0px; margin: 0px; cursor: default; -user-select: none; -text-size-adjust: none; overflow: hidden; }", "div			{ padding: 0px; margin: 0px; -box-sizing: border-box; background-repeat: no-repeat; -background-size: 100% 100%; }", ".mask			{ left: 0px; top: 0px; -transition: opacity 500ms linear; z-index: 999; }", ".eventmask		{ left: 0px; top: 0px; width: 100%; height: 100%; z-index: 10; }", ".progress		{ visibility: hidden; color: #FFF; font: bold 24px/24px 'Helvetica Neue'; text-align: center; -border-radius: 12px; -background-size: auto; z-index: 998; }", ".animation		{ -transition: opacity 200ms linear; }", ".fullScreen	{ height: 4096px; }"].join("\n"));
        ad.root=a5("DOM", "root");
        ad.root.addClass("animation");
        ad.root.setStyle("opacity: 0;");
        ad.progress=a5("DOM", "progress", "root");
        ad.progress.addClass("progress");
        ad.progress.setStyle("left: 50%; top: 50%; width: 156px; height: 124px; margin: -62px 0 0 -78px; padding-top: 76px; background: rgba(0,0,0,.76) url(?) 50% 26px no-repeat;", "./system/Progress.gif");
        ad.progress.setText("Loading");
        ad.eventMask=a5("DOM", "mask", "root");
        ad.eventMask.addClass("eventmask");
        ad.mask=a5("DOM", "mask");
        ad.mask.addClass("mask");
        ad.mask.setStyle("opacity: 0;");
    }, viewport:function () {
        var bf=X.head.appendChild(X.createElement("META"));
        bf.name="viewport";
        bf.content=(e ? "width=device-width, user-scalable=no, target-densitydpi=device-dpi;" : "width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0;");
        X.body.appendChild(X.createElement("DIV")).className="fullScreen";
    }, publicAPI:function () {
        ad.HAS_PUBLIC_API= !!aZ.SpilGames;
        if (!ad.HAS_PUBLIC_API) {
            aZ.SpilGames={_:function (bh) {
                var bf=0, bg=arguments;
                return bh.replace(/%s/g, function () {
                    return bg[++bf];
                });
            }};
        }
    }}, a2={config:function (bf) {
        this.parseStyle(bf.style);
        this.parseStorage(bf.storage);
        this.parseClass(bf["class"]);
        this.parseObject(bf.object);
        x && I("debug");
    }, parseStyle:function (bg) {
        if (bg && bg.length) {
            var bf=X.head.appendChild(X.createElement("STYLE"));
            bf.type="text/css";
            bf.textContent=O(bg.join("\n"));
        }
    }, parseStorage:function (bk) {
        for (var bi in bk) {
            var bf=r[bi];
            if (bf === u) {
                ad[bi]=bk[bi];
            } else {
                var bh=bk[bi];
                switch (typeof bh) {
                    case"string":
                        ad[bi]=bf(bi, bh);
                        break;
                    case"object":
                        if (bh.constructor === Array) {
                            var bj=ad[bi]=[];
                            bh.forEach(function (bm, bl) {
                                bj[bl]=bf(bl, bm);
                            });
                        } else {
                            var bj=ad[bi]={};
                            for (var bg in bh) {
                                bj[bg]=bf(bg, bh[bg]);
                            }
                        }
                        break;
                }
            }
        }
    }, parseClass:function (bh) {
        var bi=/^(:){0,2}/, bf;
        for (var bg in bh) {
            switch (bi.exec(bg)[0]) {
                case":":
                    bf="DOM";
                    break;
                case"::":
                    bf="Sprite";
                    break;
                default:
                    bf="Unknown";
                    break;
            }
            aL(bg, bf, bh[bg]);
        }
    }, parseObject:function (bg) {
        var bi=/^(.*)\.(.*)(:.*)$/;
        for (var bh in bg) {
            var bf=bi.exec(bh);
            a5(bf[3], bf[2], bf[1]).setStyle(bg[bh]);
        }
    }}, Z=function (bf) {
        console.log(bf);
        aZ.setTimeout(function () {
            aZ.scrollTo(0, d + (e ? 1 : 0));
        }, 200);
        typeof bf === "function" && aZ.setTimeout(bf, 400);
    }, M=function () {
        return aZ.innerWidth > aZ.innerHeight ? 90 : 0;
    }, aX=function (bg) {
        var bf=arguments.callee;
        Z(function () {
            if (bf.orientation === M()) {
                delete bf.orientation;
                bf.callback();
            }
            if (ad.orientation === M()) {
                ad.mask.setVisible(false);
                I("resume");
            } else {
                ad.mask.setVisible(true);
                I("pause");
            }
            typeof bg === "function" && aZ.setTimeout(bg, 0);
        });
    }, y=function (bf) {
        ad.mask.setStyle("width: ?px; height: ?px; background: #FFF url(?) no-repeat center; background-size: contain;", aZ.innerWidth, aZ.innerHeight, Y());
        if (true) {
            aZ.setTimeout(bf, 0);
        } else {
            aZ.setTimeout(function () {
                ad.mask.setStyle("opacity: 1;");
                aZ.setTimeout(function () {
                    ad.mask.setStyle("opacity: 0;");
                    aZ.setTimeout(bf, 500);
                }, 1500);
            }, 200);
        }
    }, Q=function () {
        Z(function () {
            y(function () {
                //ad.mask.setStyle("visibility: hidden; opacity: 1; -transition: none; background: #FFF url(?) no-repeat center; background-size: contain;", a1());
                aX();
                //aZ.addEventListener("resize", aX, false);
                //aZ.addEventListener("orientationchange", aX, false);
                aX(function () {
                    var orientation = typeof customOrientation != 'undefined' ? customOrientation : window.orientation;
                    orientation = 0;
                    ad.orientation = orientation;
                    if (ad.orientation === M()) {
                        l.screen();
                        Z(function () {
                            a2.config(aZ.onstartup(ad));
                        });
                        aX.orientation=ad.orientation ? 0 : 90;
                        aX.callback=function () {
                            ad.mask.setStyle("top: ?px; width: ?px; height: ?px;", d, aZ.innerWidth, aZ.innerHeight);
                        };
                    } else {
                        ad.mask.setStyle("width: ?px; height: ?px;", aZ.innerWidth, aZ.innerHeight);
                        aX.orientation=ad.orientation;
                        aX.callback=function () {
                            l.screen();
                            ad.mask.setStyle("top: ?px;", d);
                            Z(function () {
                                a2.config(aZ.onstartup(ad));
                            });
                        };
                    }
                });
            });
        });
    }, ag=function (bf) {
        if (aZ.onstartup && !l.resize(aZ.config)) {
            aZ.System=ad;
            return;
        }
        a7();
        l.preload(function () {
            l.decorator();
            if (aT) {
                l.viewport();
                aZ.addEventListener("scroll", Z, false);
                aZ.addEventListener("pageshow", function () {
                    I("resume");
                }, false);
                aZ.addEventListener("pagehide", function () {
                    I("pause");
                    if (aB) {
                        aB.mouseup && aB.mouseup();
                        aB.mouseout && aB.mouseout();
                        S={};
                    }
                }, false);
                X.addEventListener("touchstart", function (bg) {
                    if (bg.target.value === u) {
                        bg.preventDefault();
                    }
                }, false);
            }
            l.eventAssign();
            if (bf && bf.type === "DOMContentLoaded") {
                aZ.addEventListener("load", Q, false);
            } else {
                Q();
            }
        });
    };
    l.publicAPI();
    X.addEventListener("DOMContentLoaded", ag, false);
})(window);
window.profile=(function (h, d) {
    var n=1, l=2, j=3;
    var m=8, i=8, k=40, a=k * k, g=k / 2, e=4, c=0.1, f=3 * 1000, b=h.Math;
    return{WAVE_GOLD_RATIO:c, SLOW_MAX_TIME:f, maps:[
        {title:SpilGames._("简单"), life:15, gold:20, thumb:"./image/map/map_1.jpg", layout:"0S00000001110111000101000001010001110110010000100111111000000000", enter:{x:60, y:30, angle:0}, make:[
            [1, 1, 10, [13, 25, 1]],
            [2, 1, 10, [26, 30, 2]],
            [3, 1, 10, [40, 40, 3]],
            [4, 1, 10, [72, 20, 4]],
            [2, 1, 10, [74, 30, 5]],
            [1, 1, 10, [88, 25, 6]],
            [3, 1, 10, [116, 40, 7]],
            [4, 1, 10, [172, 20, 8]],
            [2, 1, 10, [166, 30, 9]],
            [5, 1, 1, [1600, 15, 100]],
            [3, 1, 10, [281, 40, 11]],
            [1, 1, 10, [312, 25, 12]],
            [4, 1, 10, [422, 20, 13]],
            [2, 1, 10, [419, 30, 14]],
            [1, 1, 10, [441, 25, 15]],
            [4, 1, 10, [590, 20, 16]],
            [3, 1, 10, [584, 40, 17]],
            [2, 1, 10, [645, 30, 18]],
            [3, 1, 10, [709, 40, 19]],
            [5, 1, 2, [4576, 15, 100]],
            [1, 1, 10, [825, 25, 21]],
            [2, 1, 10, [916, 30, 22]],
            [4, 1, 10, [1081, 20, 23]],
            [3, 1, 10, [1065, 40, 24]],
            [3, 1, 10, [1144, 40, 25]],
            [5, 1, 10, [1330, 20, 26]],
            [1, 1, 10, [1284, 25, 27]],
            [3, 1, 10, [1399, 40, 28]],
            [2, 1, 10, [1490, 30, 29]],
            [5, 1, 3, [7284, 15, 100]],
        ]},
        {title:SpilGames._("中等"), life:10, gold:40, thumb:"./image/map/map_2.jpg", layout:"000100000001000000011110000000100000001001110010010111100S000000", enter:{x:55, y:290, angle:180}, make:[
            [1, 1, 10, [15, 25, 1]],
            [2, 1, 10, [29, 30, 2]],
            [3, 1, 10, [45, 40, 3]],
            [4, 1, 10, [80, 20, 4]],
            [2, 1, 10, [86, 30, 5]],
            [1, 1, 10, [105, 25, 6]],
            [3, 1, 10, [139, 40, 7]],
            [4, 1, 10, [202, 20, 8]],
            [2, 1, 10, [204, 30, 9]],
            [5, 1, 1, [1500, 15, 100]],
            [3, 1, 10, [300, 40, 11]],
            [1, 1, 10, [380, 25, 12]],
            [4, 1, 10, [502, 20, 13]],
            [2, 1, 10, [512, 30, 14]],
            [1, 1, 10, [548, 25, 15]],
            [4, 1, 10, [712, 20, 16]],
            [3, 1, 10, [700, 40, 17]],
            [2, 1, 10, [800, 30, 18]],
            [3, 1, 10, [842, 40, 19]],
            [5, 1, 2, [4768, 15, 100]],
            [1, 1, 10, [1037, 25, 21]],
            [2, 1, 10, [1148, 30, 22]],
            [4, 1, 10, [1334, 20, 23]],
            [3, 1, 10, [1340, 40, 24]],
            [3, 1, 10, [1442, 40, 25]],
            [4, 1, 10, [1652, 20, 26]],
            [1, 1, 10, [1631, 25, 27]],
            [3, 1, 10, [1772, 40, 28]],
            [2, 1, 10, [1890, 30, 29]],
            [5, 1, 3, [7712, 15, 100]],
            [4, 1, 10, [2266, 20, 31]],
            [3, 1, 10, [2256, 40, 32]],
            [1, 1, 10, [2381, 25, 33]],
            [2, 1, 10, [2556, 30, 34]],
            [3, 1, 10, [2552, 40, 35]],
            [4, 1, 10, [2996, 20, 36]],
            [1, 1, 10, [2969, 25, 37]],
            [3, 1, 10, [3064, 40, 38]],
            [4, 1, 10, [3482, 20, 39]],
            [5, 1, 4, [11092, 15, 100]],
        ]},
        {title:SpilGames._("困难"), life:5, gold:60, thumb:"./image/map/map_3.jpg", layout:"00S0000000100000001111000000010000000100000111000001000000010000", enter:{x:98, y:30, angle:0}, make:[
            [1, 1, 10, [17, 25, 1]],
            [2, 1, 10, [32, 30, 2]],
            [3, 1, 10, [45, 35, 3]],
            [4, 1, 10, [88, 20, 4]],
            [2, 1, 10, [98, 30, 5]],
            [1, 1, 10, [122, 25, 6]],
            [3, 1, 10, [130, 35, 7]],
            [4, 1, 10, [232, 20, 8]],
            [2, 1, 10, [242, 30, 9]],
            [5, 1, 1, [1750, 15, 100]],
            [3, 1, 10, [305, 35, 11]],
            [1, 1, 10, [410, 25, 12]],
            [4, 1, 10, [582, 20, 13]],
            [2, 1, 10, [540, 30, 14]],
            [1, 1, 10, [595, 25, 15]],
            [4, 1, 10, [624, 20, 16]],
            [3, 1, 10, [630, 35, 17]],
            [2, 1, 10, [700, 30, 18]],
            [3, 1, 10, [740, 35, 19]],
            [5, 1, 2, [2860, 15, 120]],
            [1, 1, 10, [749, 25, 21]],
            [2, 1, 10, [820, 30, 22]],
            [4, 1, 10, [987, 20, 23]],
            [3, 1, 10, [1015, 35, 24]],
            [3, 1, 10, [1140, 35, 25]],
            [4, 1, 10, [1174, 20, 26]],
            [1, 1, 10, [1278, 25, 27]],
            [3, 1, 10, [1345, 35, 28]],
            [2, 1, 10, [1490, 30, 29]],
            [5, 1, 3, [4840, 15, 100]],
            [4, 1, 10, [1624, 20, 31]],
            [3, 1, 10, [1765, 35, 32]],
            [1, 1, 10, [1802, 25, 33]],
            [2, 1, 10, [1870, 30, 34]],
            [3, 1, 10, [1960, 35, 35]],
            [4, 1, 10, [2119, 20, 36]],
            [1, 1, 10, [2328, 25, 37]],
            [3, 1, 10, [2460, 35, 38]],
            [4, 1, 10, [2506, 20, 39]],
            [5, 1, 4, [9065, 15, 100]],
            [2, 1, 10, [2775, 30, 41]],
            [1, 1, 10, [2848, 25, 42]],
            [3, 1, 10, [2960, 35, 43]],
            [4, 1, 10, [3011, 20, 44]],
            [2, 1, 10, [3265, 30, 45]],
            [1, 1, 10, [3454, 25, 46]],
            [3, 1, 10, [3640, 35, 47]],
            [4, 1, 10, [3877, 20, 48]],
            [2, 1, 10, [4235, 30, 49]],
            [5, 1, 4, [15090, 15, 100]],
            [4, 1, 10, [4324, 20, 51]],
            [3, 1, 10, [4465, 35, 52]],
            [1, 1, 10, [4502, 25, 53]],
            [2, 1, 10, [4770, 30, 54]],
            [3, 1, 10, [4860, 35, 55]],
            [4, 1, 10, [4919, 20, 56]],
            [1, 1, 10, [5028, 25, 57]],
            [3, 1, 10, [5460, 35, 58]],
            [4, 1, 10, [5706, 20, 59]],
            [5, 1, 5, [18065, 15, 100]],
        ]}
    ], tower:{tower_1:{name:"Tower 1", buyGold:10, upgrade:function (o, p) {
        switch (p) {
            case 1:
                this.speed=1428;
                this.bulletSpeed=200;
                this.bulletRange=d;
                this.range=70;
                this.minRange=0;
                this.damage=8;
                this.attack="attack_1";
                this.attackEffect=d;
                this.direct=j;
                this.sellGold=5;
                this.upgradeGold=60;
                this.slow=d;
                break;
            case 2:
                this.speed=1111;
                this.bulletSpeed=220;
                this.bulletRange=d;
                this.range=85;
                this.minRange=0;
                this.damage=20;
                this.attack="attack_1";
                this.attackEffect=d;
                this.direct=j;
                this.sellGold=30;
                this.upgradeGold=240;
                this.slow=d;
                break;
            case 3:
                this.speed=909;
                this.bulletSpeed=240;
                this.bulletRange=d;
                this.range=100;
                this.minRange=0;
                this.damage=45;
                this.attack="attack_1";
                this.attackEffect=d;
                this.direct=j;
                this.sellGold=120;
                this.upgradeGold=480;
                this.slow=d;
                break;
            case 4:
                this.speed=769;
                this.bulletSpeed=260;
                this.bulletRange=d;
                this.range=120;
                this.minRange=0;
                this.damage=80;
                this.attack="attack_1";
                this.attackEffect=d;
                this.direct=j;
                this.sellGold=240;
                this.upgradeGold=1000;
                this.slow=d;
                break;
            case 5:
                this.speed=666;
                this.bulletSpeed=300;
                this.bulletRange=d;
                this.range=150;
                this.minRange=0;
                this.damage=160;
                this.attack="attack_1";
                this.attackEffect=d;
                this.direct=j;
                this.sellGold=500;
                this.upgradeGold=0;
                this.slow=d;
                break;
        }
    }}, tower_2:{name:"Tower 2", buyGold:20, upgrade:function (o, p) {
        switch (p) {
            case 1:
                this.speed=2000;
                this.bulletSpeed=150;
                this.bulletRange=65;
                this.range=55;
                this.minRange=0;
                this.damage=10;
                this.attack="attack_2";
                this.attackEffect="attack_2_1";
                this.direct=l;
                this.sellGold=10;
                this.upgradeGold=70;
                this.slow=d;
                break;
            case 2:
                this.speed=1666;
                this.bulletSpeed=160;
                this.bulletRange=65;
                this.range=65;
                this.minRange=0;
                this.damage=20;
                this.attack="attack_2";
                this.attackEffect="attack_2_1";
                this.direct=l;
                this.sellGold=30;
                this.upgradeGold=300;
                this.slow=d;
                break;
            case 3:
                this.speed=1428;
                this.bulletSpeed=170;
                this.bulletRange=65;
                this.range=75;
                this.minRange=0;
                this.damage=40;
                this.attack="attack_2";
                this.attackEffect="attack_2_1";
                this.direct=l;
                this.sellGold=240;
                this.upgradeGold=480;
                this.slow=d;
                break;
            case 4:
                this.speed=1111;
                this.bulletSpeed=180;
                this.bulletRange=65;
                this.range=85;
                this.minRange=0;
                this.damage=60;
                this.attack="attack_2";
                this.attackEffect="attack_2_1";
                this.direct=l;
                this.sellGold=500;
                this.upgradeGold=1000;
                this.slow=d;
                break;
            case 5:
                this.speed=909;
                this.bulletSpeed=200;
                this.bulletRange=70;
                this.range=95;
                this.minRange=0;
                this.damage=105;
                this.attack="attack_2";
                this.attackEffect="attack_2_1";
                this.direct=l;
                this.sellGold=100;
                this.upgradeGold=0;
                this.slow=d;
                break;
        }
    }}, tower_3:{name:"Tower 3", buyGold:15, upgrade:function (o, p) {
        switch (p) {
            case 1:
                this.speed=1666;
                this.bulletSpeed=150;
                this.bulletRange=35;
                this.range=55;
                this.minRange=0;
                this.damage=6;
                this.attack="attack_3";
                this.attackEffect="attack_3_1";
                this.direct=j;
                this.sellGold=10;
                this.upgradeGold=45;
                this.slow=0.7;
                break;
            case 2:
                this.speed=1250;
                this.bulletSpeed=160;
                this.bulletRange=35;
                this.range=60;
                this.minRange=0;
                this.damage=12;
                this.attack="attack_3";
                this.attackEffect="attack_3_1";
                this.direct=j;
                this.sellGold=22;
                this.upgradeGold=220;
                this.slow=0.65;
                break;
            case 3:
                this.speed=1000;
                this.bulletSpeed=170;
                this.bulletRange=40;
                this.range=65;
                this.minRange=0;
                this.damage=20;
                this.attack="attack_3";
                this.attackEffect="attack_3_1";
                this.direct=j;
                this.sellGold=110;
                this.upgradeGold=420;
                this.slow=0.6;
                break;
            case 4:
                this.speed=833;
                this.bulletSpeed=180;
                this.bulletRange=40;
                this.range=70;
                this.minRange=0;
                this.damage=40;
                this.attack="attack_3";
                this.attackEffect="attack_3_1";
                this.direct=j;
                this.sellGold=210;
                this.upgradeGold=640;
                this.slow=0.55;
                break;
            case 5:
                this.speed=714;
                this.bulletSpeed=200;
                this.bulletRange=45;
                this.range=75;
                this.minRange=0;
                this.damage=80;
                this.attack="attack_3";
                this.attackEffect="attack_3_1";
                this.direct=j;
                this.sellGold=320;
                this.upgradeGold=0;
                this.slow=0.5;
                break;
        }
    }}, tower_4:{name:"Tower 4", buyGold:60, upgrade:function (o, p) {
        switch (p) {
            case 1:
                this.speed=1500;
                this.bulletSpeed=200;
                this.bulletRange=d;
                this.range=100;
                this.minRange=0;
                this.damage=30;
                this.attack="attack_4";
                this.attackEffect="attack_4_1";
                this.direct=n;
                this.sellGold=30;
                this.upgradeGold=400;
                this.slow=d;
                break;
            case 2:
                this.speed=1400;
                this.bulletSpeed=220;
                this.bulletRange=d;
                this.range=110;
                this.minRange=0;
                this.damage=70;
                this.attack="attack_4";
                this.attackEffect="attack_4_1";
                this.direct=n;
                this.sellGold=200;
                this.upgradeGold=800;
                this.slow=d;
                break;
            case 3:
                this.speed=1300;
                this.bulletSpeed=240;
                this.bulletRange=d;
                this.range=130;
                this.minRange=0;
                this.damage=110;
                this.attack="attack_4";
                this.attackEffect="attack_4_1";
                this.direct=n;
                this.sellGold=400;
                this.upgradeGold=1600;
                this.slow=d;
                break;
            case 4:
                this.speed=1200;
                this.bulletSpeed=260;
                this.bulletRange=d;
                this.range=150;
                this.minRange=0;
                this.damage=160;
                this.attack="attack_4";
                this.attackEffect="attack_4_1";
                this.direct=n;
                this.sellGold=800;
                this.upgradeGold=2400;
                this.slow=d;
                break;
            case 5:
                this.speed=1000;
                this.bulletSpeed=300;
                this.bulletRange=d;
                this.range=180;
                this.minRange=0;
                this.damage=220;
                this.attack="attack_4";
                this.attackEffect="attack_4_1";
                this.direct=n;
                this.sellGold=1200;
                this.upgradeGold=0;
                this.slow=d;
                break;
        }
    }}}};
})(window);
(function (a, b) {
    a.config="portrait";
    a.cacheManifest=["./image/menu.jpg", "./image/load_background.png", "./image/load_bar.png", "./image/load_vista.png"];
    a.onstartup=function (d) {
        var i=a.profile || {};
        var h=1, B=2, n=3;
        var e=8, g=8, G=40, k=G * G, p=G / 2, E=5, H=i.WAVE_GOLD_RATIO || 0.2, C=i.SLOW_MAX_TIME || 1000, r=a.Math, w=a.parseInt;
        var y=[], v=[], o=[], c=[], F, u, m, t, z, x, s, l, q, D, f, j, A;
        return{storage:{audio:"./MonsterTD.mp3", image:{button:"./image/button/button.png", map_1:"./image/map/map_1.jpg", map_2:"./image/map/map_2.jpg", map_3:"./image/map/map_3.jpg", tower_1:"./image/tower/tower_1.png", tower_2:"./image/tower/tower_2.png", tower_3:"./image/tower/tower_3.png", tower_4:"./image/tower/tower_4.png", attack_1:"./image/attack/attack_1.png", attack_2:"./image/attack/attack_2.png", attack_3:"./image/attack/attack_3.png", attack_4:"./image/attack/attack_4.png", ice:"./image/attack/ice.png", effect:"./image/attack/effect.png", monster_1:"./image/monster/monster_1.png", monster_2:"./image/monster/monster_2.png", monster_3:"./image/monster/monster_3.png", monster_4:"./image/monster/monster_4.png", monster_5:"./image/monster/monster_5.png", enter:"./image/enter.png"}, frame:{ICE:["ice", 40, 40, 0], effect:["effect", 67, 48, [0, 1, 2, 3, 4, 5], 40], tower_1_1:["tower_1", 40, 60, 4, 20, 40], tower_1_2:["tower_1", 40, 60, 3, 20, 40], tower_1_3:["tower_1", 40, 60, 2, 20, 40], tower_1_4:["tower_1", 40, 60, 1, 20, 40], tower_1_5:["tower_1", 40, 60, 0, 20, 40], tower_2_1:["tower_2", 40, 60, 4, 20, 35], tower_2_2:["tower_2", 40, 60, 3, 20, 35], tower_2_3:["tower_2", 40, 60, 2, 20, 35], tower_2_4:["tower_2", 40, 60, 1, 20, 35], tower_2_5:["tower_2", 40, 60, 0, 20, 35], tower_3_1:["tower_3", 40, 60, 4, 20, 40], tower_3_2:["tower_3", 40, 60, 3, 20, 40], tower_3_3:["tower_3", 40, 60, 2, 20, 40], tower_3_4:["tower_3", 40, 60, 1, 20, 40], tower_3_5:["tower_3", 40, 60, 0, 20, 40], tower_4_1:["tower_4", 40, 60, 4, 20, 40], tower_4_2:["tower_4", 40, 60, 3, 20, 40], tower_4_3:["tower_4", 40, 60, 2, 20, 40], tower_4_4:["tower_4", 40, 60, 1, 20, 40], tower_4_5:["tower_4", 40, 60, 0, 20, 40], attack_1:["attack_1", 47, 45, [0], 30, 23.5, 22.5], attack_1_1:["attack_1", 47, 45, [0], 30, 23.5, 22.5], attack_2:["attack_2", 47, 45, [0], 30, 23.5, 22.5], attack_2_1:["attack_2", 47, 45, [1], 200, 23.5, 22.5], attack_3:["attack_3", 47, 45, [0], 30, 23.5, 22.5], attack_3_1:["attack_3", 47, 45, [1], 200, 23.5, 22.5], attack_4:["attack_4", 40, 60, [0, 1, 2, 3], 50, 20, 35], attack_4_1:["attack_4", 40, 60, [4, 5, 6, 7], 50, 20, 35], monster_1:["monster_1", 35, 35, [0, 1, 2], 100], monster_2:["monster_2", 33, 41, [0, 1], 100], monster_3:["monster_3", 50, 47, [0, 1], 100], monster_4:["monster_4", 33, 43, [0, 1], 100], monster_5:["monster_5", 58, 49, [0, 1], 100], enter:["enter", 40, 40, [0, 1, 2], 140]}, maps:i.maps, tower:i.tower}, object:{"root.load:Load":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%; background-image: url('./image/menu.jpg');", "root.load.background:U":"left: 50%; top: 300px; width: 216px; margin-left: -108px; height: 16px; background-image: url('./image/load_background.png');", "root.load.bar:Unknown":"left: 50%; top: 300px; width: 0px; margin-left: -108px; height: 16px; background-image: url('./image/load_bar.png');", "root.load.vista:Unknown":"left: 50%; top: 285px; width: 235px; margin-left: -124px; height: 43px; background-image: url('./image/load_vista.png');", "root.menu:Menu":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%;", "root.menu.play:Button":"left: 50%; top: 270px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.menu.continue:Button":"left: 50%; top: 320px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.menu.high:Button":"left: 50%; top: 370px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.level:Level":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%;", "root.level.title:Unknown":"color: #ffcc00; left: 0px; top: 78px; width: 100%; text-align: center; font: bold 18px/20px Arial; text-shadow: 0px 0px 6px #330000;", "root.level.thumb:Unknown":"left: 50%; top: 140px; width: 190px; margin-left: -95px; height: 200px;", "root.level.frame:Unknown":"left: 50%; top: 124px; width: 235px; margin-left: -117.5px; height: 243px; background-image: url('./image/frame.png');", "root.level.prev:Button":"left: 10px; top: 218px; width: 27px; height: 41px;", "root.level.next:Button":"right: 10px; top: 218px; width: 27px; height: 41px;", "root.level.play:Button":"right: 30px; top: 374px; width: 130px; text-align: center; line-height: 46px; height: 50px;", "root.level.back:Button":"left: 30px; top: 374px; width: 130px; text-align: center; line-height: 46px; height: 50px;", "root.level.descript:Unknown":"left: 50%; top: 308px; width: 220px; margin-left: -110px; text-align: center; line-height: 24px; color: #fff; font: bold 16px/20px Arial;", "root.tutorial:Tutorial":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%; color: #fff; font: 13px/20px Arial;", "root.tutorial.scene1:U":"width: 100%;", "root.tutorial.scene1.t1:E":"font-weight: bold; left: 0px; width: 100%; text-align: center; top: 276px; white-space: nowrap;", "root.tutorial.scene1.t2:E":"left: 12px; top: 144px; white-space: nowrap;", "root.tutorial.scene1.t3:E":"left: 90px; top: 110px; white-space: nowrap;", "root.tutorial.scene1.t4:E":"left: 186px; top: 110px; white-space: nowrap;", "root.tutorial.scene1.t5:E":"left: 272px; top: 152px; white-space: nowrap;", "root.tutorial.scene1.t6:E":"left: 10px; top: 312px; white-space: nowrap;", "root.tutorial.scene2:U":"width: 100%;", "root.tutorial.scene2.t1:E":"font-weight: bold; left: 0px; width: 100%; text-align: center; top: 276px; white-space: nowrap;", "root.tutorial.scene2.t2:E":"left: 20px; top: 116px; white-space: nowrap;", "root.tutorial.scene2.t3:E":"left: 20px; top: 130px; white-space: nowrap;", "root.tutorial.scene2.t4:E":"left: 20px; top: 144px; white-space: nowrap;", "root.tutorial.scene2.t5:E":"left: 10px; top: 170px; white-space: nowrap;", "root.tutorial.scene2.t6:E":"left: 159px; top: 200px; white-space: nowrap;", "root.tutorial.scene2.t7:E":"left: 26px; top: 336px; white-space: nowrap;", "root.tutorial.scene2.t8:E":"left: 122px; top: 304px; white-space: nowrap;", "root.tutorial.scene2.t9:E":"left: 174px; top: 336px; white-space: nowrap;", "root.main:Main":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%; background-image: url('./image/main.jpg');", "root.main.infoBar:Unknown":"left: 0px; top: 38px; width: 100%; height: 30px;", "root.main.infoBar.wave:U":"left: 35px; top: 0px; height: 24px; line-height: 24px; color: #fff; font-size: 16px; font-weight: bold;", "root.main.infoBar.life:U":"left: 124px; top: 0px; height: 24px; line-height: 24px; color: #fff; font-size: 16px; font-weight: bold;", "root.main.infoBar.gold:U":"left: 214px; top: 0px; height: 24px; line-height: 24px; color: #fff; font-size: 16px; font-weight: bold;", "root.main.pause:Button":"right: 4px; top: 34px; width: 32px; height: 32px; background-image: url('./image/button/pause.png'); -background-size: 200% 100%;", "root.main.canvas:Canvas":"left: 0px; top: 68px; width: 320px; height: 320px;", "root.main.interest:Unknown":"left: 0px; top: 68px; padding-left: 6px; color: #fff; font-size: 18px; background: rgba(0, 0, 0, 0.6); padding: 2px 6px; -border-radius: 0px 0px 6px 0px;", "root.main.btn1:TButton":"visibility: hidden; font-weight: bold; left: 20px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/tower_1.png'); -background-size: 300% 100%;", "root.main.btn2:TButton":"visibility: hidden; font-weight: bold; left: 95px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/tower_2.png'); -background-size: 300% 100%;", "root.main.btn3:TButton":"visibility: hidden; font-weight: bold; left: 170px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/tower_3.png'); -background-size: 300% 100%;", "root.main.btn4:TButton":"visibility: hidden; font-weight: bold; left: 245px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/tower_4.png'); -background-size: 300% 100%;", "root.main.sell:OButton":"visibility: hidden; font-weight: bold; left: 50px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/sell.png'); -background-size: 300% 100%;", "root.main.upgrade:OButton":"visibility: hidden; font-weight: bold; left: 133px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/upgrade.png'); -background-size: 300% 100%;", "root.main.cancel:OButton":"visibility: hidden; font-weight: bold; left: 215px; bottom: 35px; width: 55px; height: 53px; padding-top: 32px; text-align: center; background-image: url('./image/button/cancel.png'); -background-size: 200% 100%;", "root.pause:Pause":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%;", "root.pause.title:Unknown":"color: #ffcc00; left: 0px; top: 108px; width: 100%; text-align: center; font: bold 18px/20px Arial; text-shadow: 0px 0px 6px #330000;", "root.pause.continue:Button":"left: 50%; top: 200px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.pause.restart:Button":"left: 50%; top: 250px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.pause.help:Button":"left: 50%; top: 300px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.pause.menu:Button":"left: 50%; top: 350px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.result:Result":"visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%;", "root.result.title:Unknown":"color: #ffcc00; left: 0px; top: 174px; width: 100%; text-align: center; font: bold 18px/20px Arial; text-shadow: 0px 0px 6px #330000;", "root.result.total:Unknown":"left: 0px; top: 239px; font-weight: bold; width: 100%; text-align: center; line-height: 30px; color: #cccc66; font-size: 16px;", "root.result.time:Unknown":"left: 0px; top: 267px; font-weight: bold; width: 100%; text-align: center; line-height: 30px; color: #cccc66; font-size: 16px;", "root.result.restart:Button":"left: 50%; top: 290px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.result.menu:Button":"left: 50%; top: 380px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.result.high:Button":"left: 50%; top: 380px; width: 130px; margin-left: -65px; text-align: center; line-height: 46px; height: 50px;", "root.audio:Audio":"right: 10px; top: 43px; width: 32px; height: 32px; background-image: url('./image/button/music.png'); background-position: right; background-size: 200% 100%;"}, "class":{":Unknown":{}, ":U":{}, ":E":{click:function () {
            this.parent.parent.click();
        }}, ":Audio":{init:function () {
            if (d.IS_ANDROID) {
                this.setStyle("visibility: hidden;");
                return;
            }
            d.connect(this, "pause", "resume", "showAudio", "hideAudio");
            this.isPlay=false;
            this.audio=d.audio;
        }, showAudio:function () {
            this.setStyle("visibility: inherit;");
        }, hideAudio:function () {
            this.setStyle("visibility: hidden;");
        }, click:function () {
            this.isPlay= !this.isPlay;
            this.resume();
        }, pause:function () {
            this.audio.pause();
        }, resume:function () {
            if (this.isPlay) {
                this.audio.play();
                this.setStyle("background-position: left;");
            } else {
                this.audio.pause();
                this.setStyle("background-position: right;");
            }
        }}, ":Button":{init:function () {
            this.enable=true;
            switch (this.name) {
                case"play":
                    this.setText(SpilGames._("开始游戏"));
                    break;
                case"help":
                    this.setText(SpilGames._("帮助"));
                    break;
                case"pause":
                    return;
                case"back":
                    this.setText(SpilGames._("返回"));
                    break;
                case"high":
                    this.setText(SpilGames._("排行榜"));
                    break;
                case"restart":
                    this.setText(SpilGames._("重新开始"));
                    break;
                case"menu":
                    this.setText(SpilGames._("开始菜单"));
                    break;
                case"continue":
                    this.setText(SpilGames._("继续游戏"));
                    break;
                case"prev":
                    this.setStyle("background-image: url('./image/button/prev.png'); -background-size: 200% 100%;");
                    return;
                case"next":
                    this.setStyle("background-image: url('./image/button/next.png'); -background-size: 200% 100%;");
                    return;
            }
            this.setStyle("background-image: url('./image/button/button.png'); font-weight: bold; -background-size: 200% 100%; color: yellow; text-shadow: 0px 0px 4px rgba( 0, 0, 0, 0.4 );");
        }, mouseover:function () {
            if (this.enable === true) {
                this.setStyle("background-position: right;");
            }
        }, mouseout:function () {
            if (this.enable === true) {
                this.setStyle("background-position: left;");
            }
        }, setDisabled:function (I) {
            this.enable= !I;
            this.setStyle("opacity: ?;", I ? 0.5 : 1);
        }, click:function () {
            if (this.enable === false) {
                return;
            }
            this.onclick && this.onclick();
            switch (this.name) {
                case"play":
                    switch (this.parent.name) {
                        case"menu":
                            d.setScene("level");
                            break;
                        case"level":
                            d.message("selectMap");
                            break;
                    }
                    break;
                case"restart":
                    d.setScene("main", q);
                    break;
                case"help":
                    d.setScene("tutorial");
                    break;
                case"back":
                    d.setScene("menu");
                    break;
                case"high":
                    d.showScoreboard();
                    break;
                case"pause":
                    d.setScene("pause");
                    break;
                case"menu":
                    d.setScene("menu");
                    break;
                case"continue":
                    if (this.parent.name === "menu") {
                        d.message("loadGame");
                    } else {
                        d.setScene("main");
                    }
                    break;
                case"prev":
                    d.message("prevMap");
                    break;
                case"next":
                    d.message("nextMap");
                    break;
            }
        }}, ":OButton":{init:function () {
            switch (this.name) {
                case"sell":
                    this.enable=true;
                    this.click=function () {
                        this.parent.curTower.sell();
                        this.parent.select(-1, 0);
                    };
                    break;
                case"upgrade":
                    this.click=function () {
                        if (this.enable) {
                            this.parent.curTower.upgrade();
                            this.parent.select();
                        }
                    };
                    break;
                case"cancel":
                    this.enable=true;
                    this.click=function () {
                        this.parent.select(-1, 0);
                    };
                    break;
            }
            this.setStyle("color: #fff; background-position: left;");
        }, mousedown:function () {
            if (!this.enable) {
                return;
            }
            if (this.name === "cancel") {
                this.setStyle("background-position: right;");
            } else {
                this.setStyle("background-position: center;");
            }
        }, mouseup:function () {
            if (!this.enable) {
                return;
            }
            this.setStyle("background-position: left;");
        }, setEnable:function (I) {
            if (I) {
                this.enable=true;
                this.setStyle("background-position: left; color: #fff;");
            } else {
                this.enable=false;
                this.setStyle("background-position: right; color: #bbb;");
            }
        }}, ":TButton":{init:function () {
            this.index=w(/[0-9]+/.exec(this.name)[0]);
            this.setStyle("color: #fff; background-position: left;");
        }, mousedown:function () {
            if (!this.enable) {
                return;
            }
            d.message("pause");
            this.parent.setBuildTower(this.index);
            this.setStyle("background-position: center;");
        }, mousemove:function () {
            if (!this.enable) {
                return;
            }
            var I=this.getTouchPoint();
            this.canBuild=this.parent.towerBuildAt(~~((I.left - f) / G), ~~((I.top - D) / G));
        }, mouseup:function () {
            if (!this.enable) {
                return;
            }
            if (this.canBuild) {
                var I=this.getTouchPoint();
                this.parent.makeTower("tower_" + this.index, ~~((I.left - f) / G), ~~((I.top - D) / G));
            }
            this.parent.selectCell.setVisible(false);
            this.parent.selectCircle.setVisible(false);
            d.message("resume");
            this.canBuild=false;
            this.setEnable(this.enable);
        }, setEnable:function (I) {
            if (I) {
                this.enable=true;
                this.setStyle("background-position: left; color: #fff;");
            } else {
                this.enable=false;
                this.setStyle("background-position: right; color: #bbb;");
            }
        }}, ":Load":{init:function () {
            d.connect(this, "scene", "progress", "complete");
            d.setScene("load");
            this.bar=this.findChild("bar");
        }, progress:function (I, J) {
            this.bar.setStyle("width: ?px;", 216 * I / J);
        }, complete:function () {
            d.setScene("menu");
        }, scene:function () {
        }}, ":Menu":{init:function () {
            d.connect(this, "scene");
            var I=d.allocObject("DOM", this.name + "_tmp", this.path, "IMG");
            I.setStyle("position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: -1;");
            I.__view__.src=d.getUrl("./image/menu.jpg");
        }, prescene:function () {
            if (d.global.saveScene) {
                this.findChild("continue").setDisabled(false);
            } else {
                this.findChild("continue").setDisabled(true);
            }
        }, scene:function () {
        }}, ":Level":{init:function () {
            d.connect(this, "scene", "nextMap", "prevMap", "selectMap");
            this.findChild("title").setText(SpilGames._("选择关卡"));
            this.descript=this.findChild("descript");
            this.thumb=this.findChild("thumb");
            var I=d.allocObject("DOM", this.name + "_tmp", this.path, "IMG");
            I.__view__.src=d.getUrl("./image/level.jpg");
            I.setStyle("left: 0px; top: 0px; width: 100%; height: 100%; z-index: -1;");
        }, nextMap:function () {
            if (++this.id >= d.maps.length) {
                this.id=0;
            }
            this.setMap();
        }, prevMap:function () {
            if (--this.id < 0) {
                this.id=d.maps.length - 1;
            }
            this.setMap();
        }, setMap:function () {
            this.descript.setText(d.maps[this.id].title);
            this.thumb.setStyle("background-image: url('?');", d.maps[this.id].thumb);
        }, selectMap:function () {
            if (d.global.firstPlay === b) {
                d.setScene("tutorial", this.id);
            } else {
                d.setScene("main", this.id);
            }
        }, prescene:function (I) {
            if (I) {
                this.id=0;
                this.setMap();
            }
        }, scene:function () {
        }}, ":Tutorial":{init:function () {
            d.connect(this, "scene");
            this.findChild("scene1").setStyle("visibility: hidden;");
            this.findChild("scene1.t1").setText(SpilGames._("点击继续"));
            this.findChild("scene1.t2").setText(SpilGames._("怪物袭击团"));
            this.findChild("scene1.t3").setText(SpilGames._("你的生命"));
            this.findChild("scene1.t4").setText(SpilGames._("你的金钱"));
            this.findChild("scene1.t5").setText(SpilGames._("暂停"));
            this.findChild("scene1.t6").setText(SpilGames._("把一个防守塔拖到地图上进行搭建"));
            this.findChild("scene2").setStyle("visibility: hidden;");
            this.findChild("scene2.t1").setText(SpilGames._("点击继续"));
            this.findChild("scene2.t2").setText(SpilGames._("在每一个波袭击后"));
            this.findChild("scene2.t3").setText(SpilGames._("你会获得一些现金奖励"));
            this.findChild("scene2.t4").setText(SpilGames._("现金奖励 = 你的现金 * 10%"));
            this.findChild("scene2.t5").setText(SpilGames._("如果你想升级或卖掉建筑"));
            this.findChild("scene2.t6").setText(SpilGames._("点击建筑"));
            this.findChild("scene2.t7").setText(SpilGames._("卖掉建筑"));
            this.findChild("scene2.t8").setText(SpilGames._("升级建筑"));
            this.findChild("scene2.t9").setText(SpilGames._("返回建筑菜单"));
        }, click:function () {
            this.num=~~this.num + 1;
            switch (this.num) {
                case 1:
                    this.drawTutorial2();
                    break;
                case 2:
                    if (this.id === b) {
                        d.setScene("pause");
                    } else {
                        d.global.firstPlay=true;
                        d.saveSetting();
                        d.setScene("main", this.id);
                    }
                    break;
            }
        }, drawTutorial1:function () {
            this.setStyle("background-image: url('./image/tutorial1.jpg'); -background-size: 100%;");
            this.findChild("scene1").setStyle("visibility: inherit;");
            this.findChild("scene2").setStyle("visibility: hidden;");
        }, drawTutorial2:function () {
            this.setStyle("background-image: url('./image/tutorial2.jpg'); -background-size: 100%;");
            this.findChild("scene1").setStyle("visibility: hidden;");
            this.findChild("scene2").setStyle("visibility: inherit;");
        }, prescene:function (I, J) {
            this.num=0;
            if (I === true && J !== b) {
                this.id=J;
            } else {
                this.id=b;
            }
            this.drawTutorial1();
            I && d.message("hideAudio");
        }, scene:function (I, J) {
            (!I) && J === b && d.message("showAudio");
        }}, ":Main":{init:function () {
            d.connect(this, "scene", "nextWave", "restart", "pause", "resume", "updateInfo", "loadGame");
            this.bitmap=this.findChild("canvas");
            this.canvas=this.bitmap.getContext(d.width, d.width);
            this.selectCircle=this.canvas.appendChild("::SelectCircle");
            this.selectCell=this.canvas.appendChild("::SelectCell");
            this.enter=this.canvas.appendChild("::Enter");
            this.infoBar=this.findChild("infoBar");
            this.waveBar=this.findChild("infoBar.wave");
            this.lifeBar=this.findChild("infoBar.life");
            this.goldBar=this.findChild("infoBar.gold");
            this.btn=[this.findChild("btn1"), this.findChild("btn2"), this.findChild("btn3"), this.findChild("btn4")];
            this.sellBtn=this.findChild("sell");
            this.upgradeBtn=this.findChild("upgrade");
            this.cancelBtn=this.findChild("cancel");
            this.interest=this.findChild("interest");
            var J=this.btn.length + 1;
            while (--J) {
                var K=d.tower["tower_" + J];
                this.btn[J - 1].setText(K.buyGold);
            }
            var I=this;
            this.loop=a.Loop=d.mainLoop(function (M, N) {
                var L;
                L=v.length;
                while (L--) {
                    v[L].auto(N);
                }
                v.sort(function (P, O) {
                    return P.length - O.length;
                });
                L=y.length;
                while (L--) {
                    y[L].auto(N);
                }
                L=o.length;
                while (L--) {
                    o[L].auto(N);
                }
                L=c.length;
                while (L--) {
                    c[L].update();
                }
                I.enter.__visible__ === true && I.enter.flush();
                I.canvas.flush();
            }, 40);
        }, nextWave:function () {
            var I=this;
            this.saveGame();
            if (u) {
                var J=~~(t * H);
                t=t + J;
                this.interest.setText(SpilGames._("现金数: %s (%s%)", J + "", H * 100));
                this.interest.setStyle("visibility: inherit;");
                d.submitScore(A);
            } else {
                A=0;
            }
            if (++u > m) {
                d.setScene("result", true, t, ~~((+new Date - s) / 1000));
                return;
            }
            u === 1 && this.enter.setInfo(d.maps[q].enter);
            d.message("updateInfo");
            this.nextWaveHandle=a.setTimeout(function () {
                u === 1 && I.enter.setVisible(false);
                var K=d.maps[q].make[u - 1];
                I.interest.setStyle("visibility: hidden;");
                I.makeMonster("monster_" + K[0], K[2], K[3]);
            }, 5000);
        }, pause:function () {
            d.pauseTime();
            this.loop.pause();
        }, resume:function () {
            d.resumeTime();
            this.loop.resume();
        }, updateInfo:function () {
            this.waveBar.setText(u + "/" + m);
            this.lifeBar.setText(z);
            this.goldBar.setText(t);
            this.onupdateInfo();
        }, initMap:function (K) {
            var P=d.maps[K], R=P.layout.indexOf("S"), I=R % e, Q=~~(R / e), L=[];
            F=[];
            P.layout.replace(new RegExp(".{" + e + "}", "ig"), function (S) {
                L[L.length]=S.split("");
                F[F.length]=S.split("");
            });
            q=K;
            u=0;
            m=P.make.length;
            t=P.gold;
            z=x=P.life;
            s= +new Date();
            d.message("updateInfo");
            l=P.path;
            if (!l) {
                var M=false;
                l=[];
                while (true) {
                    !M && (L[Q][I]="P");
                    l.push([Q * G + p, I * G + p]);
                    if (M) {
                        break;
                    }
                    if (L[Q][I + 1] === "1") {
                        I++;
                    } else {
                        if (L[Q][I - 1] === "1") {
                            I--;
                        } else {
                            if (L[Q + 1] && L[Q + 1][I] === "1") {
                                Q++;
                            } else {
                                if (L[Q - 1] && L[Q - 1][I] === "1") {
                                    Q--;
                                } else {
                                    M=true;
                                    var O=l[l.length - 2], J=(O[0] - p) / G, N=(O[1] - p) / G;
                                    if (J > Q) {
                                        Q--;
                                    } else {
                                        if (J < Q) {
                                            Q++;
                                        } else {
                                            if (N > I) {
                                                I--;
                                            } else {
                                                I++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                P.path=l;
            }
            this.mapPath=l;
            this.bitmap.setStyle("background-image: url('?'); -background-size: 100%;", P.thumb);
        }, clearLast:function () {
            var I, J;
            I=v.length;
            while (I--) {
                J=v[I];
                J.slowEffect && J.slowEffect.remove();
                J.slowEffect=b;
                J.remove(false);
            }
            v.length=0;
            I=y.length;
            while (I--) {
                y[I].remove(false);
            }
            y.length=0;
            I=o.length;
            while (I--) {
                o[I].remove(false);
            }
            o.length=0;
            I=c.length;
            while (I--) {
                c[I].remove(false);
            }
            c.length=0;
            this.selectCell.setVisible(false);
            this.selectCircle.setVisible(false);
            this.interest.setStyle("visibility: hidden;");
            a.clearTimeout(this.nextWaveHandle);
        }, restart:function (I) {
            this.canvas.flush();
            this.loop.reset();
            this.loop.resume();
            d.message("nextWave");
        }, prescene:function (I, J) {
            if (I === true) {
                d.message("hideAudio");
            }
            if (I === true && J !== b) {
                this.select(false);
                this.clearLast();
                this.canvas.flush();
                this.initMap(J);
            }
        }, saveGame:function () {
            if (this.isLoad === true) {
                return;
            }
            var K=d.global.saveScene={}, I=K.tower=[];
            K.mapid=q;
            K.wave=u;
            K.life=z;
            K.gold=t;
            K.time=s;
            K.score=A;
            var J=y.length;
            while (J--) {
                var L=y[J];
                I[I.length]={L:L.level, T:L.type, C:L.curCol, R:L.curRow};
            }
            d.saveSetting();
        }, loadGame:function () {
            var K=d.global.saveScene, I=K.tower;
            this.select(false);
            this.clearLast();
            this.canvas.flush();
            this.initMap(K.mapid);
            u=K.wave;
            z=K.life;
            t=K.gold;
            s=K.time;
            var J=I.length;
            while (J--) {
                var L=this.canvas.appendChild("::Tower"), M=I[J];
                L.setInfo(M.T, M.C, M.R);
                L.setLevel(M.L);
            }
            A=K.score;
            this.canvas.flush();
            d.message("updateInfo");
            d.setScene("main");
            this.isLoad=true;
        }, scene:function (I, K) {
            if (I === false) {
                d.message("showAudio");
            }
            if (I === true && K !== b) {
                var J=this.bitmap.getRect();
                f=J.left;
                D=J.top;
                d.message("restart", K);
            } else {
                if (I === true && K === b) {
                    if (this.isLoad) {
                        var J=this.bitmap.getRect();
                        f=J.left;
                        D=J.top;
                        this.nextWave();
                        this.isLoad=false;
                    }
                    d.message("resume");
                } else {
                    if (I === false) {
                        d.message("pause");
                    }
                }
            }
        }, makeMonster:function (K, L, I) {
            var M=d.getTime();
            while (L--) {
                var J=this.canvas.appendChild("::Monster");
                J.setInfo(K, M + L * 1800, I);
            }
        }, makeTower:function (J, L, I) {
            t-=d.tower[J].buyGold;
            d.message("updateInfo");
            var K=this.canvas.appendChild("::Tower");
            K.setInfo(J, L, I);
        }, setBuildTower:function (I) {
            var J=this.selectCell;
            this.buildTowerBase={};
            d.tower["tower_" + I].upgrade.call(this.buildTowerBase, q, 1);
            J.setFrame("tower_" + I + "_1");
        }, towerBuildAt:function (M, J) {
            var I=F[J] && F[J][M], L=M * G + p, K=J * G + p;
            this.selectCell.setInfo(L, K);
            this.selectCircle.setInfo(L, K, this.buildTowerBase.range, this.buildTowerBase.minRange, I !== "0");
            this.canvas.flush();
            return I === "0";
        }, showTowerList:function (M, L) {
            var I=this, J=this.btn.length + 1, K;
            this.selectCircle.setVisible(false);
            while (--J) {
                K=this.btn[J - 1];
                (function (N) {
                    var O=d.tower["tower_" + N];
                    if (t >= O.buyGold) {
                        if (K.enable !== true) {
                            K.setEnable(true);
                            K.setStyle("visibility: inherit;");
                        }
                    } else {
                        if (K.enable !== false) {
                            K.setEnable(false);
                            K.setStyle("visibility: inherit;");
                        }
                    }
                })(J);
            }
        }, selectTower:function (J) {
            var I=this;
            this.selectCircle.setInfo(J.vectorLeft, J.vectorTop, J.range, J.minRange);
            this.sellBtn.setText(J.sellGold);
            this.sellBtn.setStyle("visibility: inherit;");
            this.cancelBtn.setStyle("visibility: inherit;");
            this.upgradeBtn.setStyle("visibility: inherit;");
            if (J.level < E) {
                this.upgradeBtn.setEnable(t >= J.upgradeGold);
                this.upgradeBtn.setText(J.upgradeGold);
            } else {
                this.upgradeBtn.setEnable(false);
                this.upgradeBtn.setText(SpilGames._("最大"));
            }
        }, onupdateInfo:function () {
            switch (this.selectState) {
                case 1:
                    this.selectTower(this.curTower);
                    break;
                default:
                    this.showTowerList();
                    break;
            }
        }, select:function (L, K) {
            var J=(L === false ? b : (L !== b ? F[K][L] : this.curTower)), I, M;
            if (typeof J === "object") {
                M="visibility: hidden;";
                this.selectState=1;
                this.selectTower(this.curTower=J);
            } else {
                M="visibility: inherit;";
                this.sellBtn.setStyle("visibility: hidden;");
                this.upgradeBtn.setStyle("visibility: hidden;");
                this.cancelBtn.setStyle("visibility: hidden;");
                this.selectState=0;
                this.curTower=b;
                this.showTowerList();
            }
            I=this.btn.length;
            while (I--) {
                this.btn[I].setStyle(M);
            }
        }}, "::SelectCell":{init:function () {
            this.setLayer(100000);
        }, setInfo:function (J, I) {
            this.setPosition(J, I);
            this.setVisible(true);
        }}, "::SelectCircle":{CIRCLE:r.PI * 2, init:function () {
            this.setLayer(99999);
        }, setInfo:function (N, M, I, L, J) {
            var K=I * 2;
            d.setScaleRatio(this, {maxRange:I, minRange:L});
            this.setPosition(N - I, M - I);
            this.setSize(K, K);
            this.setVisible(true);
            this.isRed=J;
        }, drawSprite:function () {
            var I=this.parent;
            I.save();
            I.beginPath();
            I.fillStyle=this.isRed ? "rgba( 255, 0, 0, 0.3 )" : "rgba( 0, 0, 0, 0.3 )";
            I.arc(this.__targetLeft__ + this.maxRange, this.__targetTop__ + this.maxRange, this.minRange, 0, this.CIRCLE, false);
            I.arc(this.__targetLeft__ + this.maxRange, this.__targetTop__ + this.maxRange, this.maxRange, 0, this.CIRCLE, true);
            I.fill();
            I.closePath();
            I.restore();
        }}, "::Enter":{setInfo:function (I) {
            this.setFrame("enter");
            this.setCenter(this.POSITION_CENTER | this.POSITION_MIDDLE);
            this.setPosition(I.x, I.y);
            this.setRotate(I.angle);
            this.setVisible(true);
        }}, "::Tower":{init:function () {
            y[y.length]=this;
        }, free:function () {
            y.splice(y.indexOf(this), 1);
            F[this.curRow][this.curCol]="0";
        }, setInfo:function (J, K, I) {
            F[I][K]=this;
            this.showTime=0;
            this.curCol=K;
            this.curRow=I;
            this.level=1;
            this.attackState=false;
            this.type=J;
            this.setFrame(J + "_" + this.level);
            this.setPosition(K * G + p, I * G + p);
            this.setLayer(I + 1);
            this.setVisible(true);
            this.bulletRange=b;
            d.tower[J].upgrade.call(this, q, this.level);
            this.sqRange=this.range * this.range;
            this.sqMinRange=this.minRange * this.minRange;
        }, setLevel:function (I) {
            this.level=I;
            this.setFrame(this.type + "_" + this.level);
            d.tower[this.type].upgrade.call(this, q, this.level);
            this.sqRange=this.range * this.range;
            this.sqMinRange=this.minRange * this.minRange;
        }, upgrade:function () {
            if (t >= this.upgradeGold) {
                t-=this.upgradeGold;
                d.message("updateInfo");
                this.setFrame(this.type + "_" + (++this.level));
                d.tower[this.type].upgrade.call(this, q, this.level);
                this.sqRange=this.range * this.range;
                this.sqMinRange=this.minRange * this.minRange;
            }
        }, sell:function () {
            t+=this.sellGold;
            d.message("updateInfo");
            this.remove();
        }, fire:function () {
            var L, O, P, K, J=this.range * this.range, N=this.minRange * this.minRange, M;
            K=v.length;
            while (K--) {
                L=v[K];
                if (!L.__visible__) {
                    continue;
                }
                O=r.abs(this.vectorTop - L.vectorTop);
                P=r.abs(this.vectorLeft - L.vectorLeft);
                M=O * O + P * P;
                if (M <= J && M >= N) {
                    var I=this.parent.appendChild("::Bullet");
                    I.setInfo(this.attack, this.direct, this, L);
                    return true;
                }
            }
            return false;
        }, auto:function (N) {
            var S, T, J, P, O=this.sqRange, M=this.sqMinRange, K, L=this.vectorTop, Q=this.vectorLeft, R=false;
            P=v.length;
            while (P--) {
                S=v[P];
                if (!S.__visible__) {
                    continue;
                }
                T=L - S.vectorTop;
                J=Q - S.vectorLeft;
                K=T * T + J * J - 800;
                if (K <= O && K >= M) {
                    R=true;
                    if (N - this.showTime > this.speed) {
                        if (this.attackState !== true) {
                            this.showTime=N;
                        } else {
                            this.showTime+=this.speed;
                        }
                        var I=this.parent.appendChild("::Bullet");
                        I.setInfo(this.attack, this.direct, this, S);
                        this.attackState=true;
                    } else {
                        break;
                    }
                }
            }
            if (!R) {
                this.attackState=false;
            }
        }}, "::Bullet":{init:function () {
            o[o.length]=this;
        }, free:function () {
            o.splice(o.indexOf(this), 1);
        }, setInfo:function (K, J, L, I) {
            this.setFrame(K);
            this.monster=I;
            this.monsterLength=I.length;
            this.tower=L;
            this.damage=J;
            this.showTime=d.getTime();
            this.trigger=b;
            this.attackEffect=L.attackEffect;
            switch (this.damage) {
                case h:
                    this.trigger=function () {
                        this.curState++;
                        return false;
                    };
                    this.curState=1;
                    break;
                case B:
                    this.curState=1;
                    this.monsterLeft=I.vectorLeft;
                    this.monsterTop=I.vectorTop;
                    this.towerLeft=L.vectorLeft;
                    this.towerTop=L.vectorTop;
                    this.directLeft=this.monsterLeft < this.towerLeft ? 1 : -1;
                    this.directTop=this.monsterTop < this.towerTop ? 1 : -1;
                    this.adjSide=r.abs(this.monsterLeft - this.towerLeft);
                    this.oppSide=r.abs(this.monsterTop - this.towerTop);
                    this.towerToMonster= ~~r.sqrt(this.oppSide * this.oppSide + this.adjSide * this.adjSide);
                    this.speed=this.tower.bulletSpeed;
                    this.fixedRadian=r.atan2(this.monsterTop - this.towerTop, this.monsterLeft - this.towerLeft);
                    break;
                case n:
                    this.curState=1;
                    this.speed=this.tower.bulletSpeed;
                    this.setPosition(L.vectorLeft, L.vectorTop);
                    break;
            }
            this.setLayer(4000);
            this.setVisible(true);
        }, doAttack:function () {
            this.remove();
            if (this.tower.bulletRange) {
                var M=(this.damage === B ? this.monsterLength : this.monster.length), N=[], J=M - this.tower.bulletRange, I=M + this.tower.bulletRange, K=v.length;
                while (K--) {
                    var L=v[K];
                    if (L.length > J && L.length < I && L.__visible__) {
                        N[N.length]=L;
                    }
                }
                K=N.length;
                while (K--) {
                    N[K].impact(this.tower);
                }
            } else {
                this.monster && this.monster.impact(this.tower);
            }
        }, auto:function (N) {
            var R=this.monster;
            if (!R) {
                this.remove();
                return;
            }
            switch (this.damage) {
                case h:
                    switch (this.curState) {
                        case 1:
                            this.setPosition(this.tower.vectorLeft, this.tower.vectorTop);
                            break;
                        case 2:
                            this.attackEffect && this.setFrame(this.attackEffect);
                            this.setPosition(R.vectorLeft, R.vectorTop);
                            break;
                        case 3:
                            this.doAttack();
                            return;
                    }
                    break;
                case B:
                    switch (this.curState) {
                        case 1:
                            var K=(N - this.showTime) / 1000 * this.speed, M=(K << 0) / (this.towerToMonster << 0);
                            if (M >= 1) {
                                if (this.attackEffect) {
                                    this.resetRotate();
                                    this.setFrame(this.attackEffect);
                                    this.curState++;
                                    this.trigger=function () {
                                        this.curState++;
                                        return false;
                                    };
                                } else {
                                    this.doAttack();
                                }
                                return;
                            } else {
                                this.setRadian(this.fixedRadian);
                                this.setPosition((this.towerLeft - this.adjSide * M * this.directLeft) << 0, (this.towerTop - this.oppSide * M * this.directTop) << 0);
                            }
                            break;
                        case 2:
                            this.update();
                            break;
                        case 3:
                            this.doAttack();
                            break;
                    }
                    break;
                case n:
                    switch (this.curState) {
                        case 1:
                            var K=(N - this.showTime) / 1000 * this.speed, O=R.vectorLeft, J=R.vectorTop, P=this.vectorLeft, V=this.vectorTop, I=r.abs(P - O), T=r.abs(V - J), U=r.sqrt(T * T + I * I);
                            this.showTime=N;
                            if (U < K + 12) {
                                if (this.attackEffect) {
                                    this.resetRotate();
                                    this.setPosition(O, J);
                                    this.setFrame(this.attackEffect);
                                    this.curState++;
                                    this.trigger=function () {
                                        this.curState++;
                                        return false;
                                    };
                                } else {
                                    this.doAttack();
                                }
                                return;
                            } else {
                                var S=r.abs(U - K), M=S / U, L=r.abs(M * I + (P > O ? O : -O)), Q=r.abs(M * T + (V > J ? J : -J));
                                this.setRadian(r.atan2(J - V, O - P));
                                this.setPosition(L, Q);
                            }
                            break;
                        case 2:
                            this.update();
                            break;
                        case 3:
                            this.doAttack();
                            break;
                    }
                    break;
            }
        }}, "::Ice":{init:function () {
        }, setInfo:function (I) {
            this.setFrame("ICE");
            this.setCenter(this.vectorWidth / 2, this.vectorHeight - I.vectorHeight / 2);
            this.setPosition(I.vectorLeft, I.vectorTop);
            this.setVisible(true);
            this.setLayer(1001);
        }}, "::Effect":{init:function () {
        }, free:function () {
            c.splice(c.indexOf(this), 1);
        }, setInfo:function (I) {
            c[c.length]=this;
            this.setFrame("effect");
            this.setCenter(this.POSITION_CENTER | this.POSITION_MIDDLE);
            this.setPosition(I.vectorLeft, I.vectorTop);
            this.setVisible(true);
        }, trigger:function () {
            this.remove();
            return false;
        }}, "::Monster":{init:function () {
            v[v.length]=this;
            d.setScaleRatio(this, {TopRatio:2});
            this.TopRatio+=0.5;
        }, free:function () {
            v.splice(v.indexOf(this), 1);
            var I=o.length;
            while (I--) {
                var J=o[I];
                if (J.monster === this) {
                    switch (J.damage) {
                        case h:
                            J.monster=b;
                            break;
                        case n:
                            J.monster={impact:function () {
                            }, vectorLeft:this.vectorLeft, vectorTop:this.vectorTop};
                            break;
                    }
                }
            }
            if (this.blood > 0) {
                --z;
            } else {
                t+=this.gold;
                A+=this.gold;
                this.parent.appendChild("::Effect").setInfo(this);
            }
            if (z <= 0) {
                d.setScene("result", false, t, ~~((+new Date - s) / 1000));
                return;
            }
            d.message("updateInfo");
            if (v.length === 0) {
                d.message("nextWave");
            }
        }, setInfo:function (K, J, I) {
            this.showTime=J;
            this.setFrame(K);
            this.setCenter(this.POSITION_CENTER | this.POSITION_MIDDLE);
            this.setVisible(false);
            this.length=0;
            this.slow=1;
            this.allBlood=this.blood=I[0];
            this.speed=I[1];
            this.gold=I[2];
            this.drawSprite=function (L, O) {
                this.drawSelf(L, O);
                var Q=this.__rectLeft__ + 1.5, P=this.__rectTop__ + this.TopRatio, M=this.__rectRight__ - 1.5, N=this.__targetWidth__ - 3;
                if (this.allBlood === this.blood) {
                    return;
                }
                L.save();
                L.setLineWidth(2);
                L.strokeStyle="#000";
                L.beginPath();
                L.moveTo(Q, P);
                L.lineTo(M, P);
                L.closePath();
                L.stroke();
                L.strokeStyle="red";
                L.beginPath();
                L.moveTo(Q, P);
                L.lineTo(Q + N / this.allBlood * this.blood, P);
                L.closePath();
                L.stroke();
                L.restore();
            };
        }, impact:function (I) {
            this.blood-=I.damage;
            this.slow=I.slow || this.slow || 1;
            this.slowEnd=d.getTime() + C;
            if (this.slow !== 1 && this.slowEffect === b) {
                this.slowEffect=this.parent.appendChild("::Ice");
                this.slowEffect.setInfo(this);
            }
            if (this.blood <= 0) {
                this.slowEffect && this.slowEffect.remove();
                this.slowEffect=b;
                this.remove();
            }
        }, auto:function (N) {
            if (N > this.showTime) {
                if (this.slow !== 1) {
                    if (this.slowEnd < N) {
                        this.slow=1;
                        this.slowEffect.remove();
                        this.slowEffect=b;
                    }
                    this.length+=(N - this.showTime) * (this.speed * this.slow) / 1000;
                } else {
                    this.length+=(N - this.showTime) * this.speed / 1000;
                }
                var L=this.length << 0, I=(L / G) << 0, O=L % G, P=l[I], K=l[I + 1], M=0, J=0;
                this.showTime=N;
                if (K === b) {
                    this.remove();
                    return;
                }
                if (P[0] > K[0]) {
                    J-=O;
                } else {
                    if (P[0] < K[0]) {
                        J+=O;
                    } else {
                        if (P[1] > K[1]) {
                            M-=O;
                            this.setMirror(false);
                        } else {
                            M+=O;
                            this.setMirror(true);
                        }
                    }
                }
                this.setPosition(P[1] + M, P[0] + J);
                if (this.slowEffect) {
                    this.slowEffect.setPosition(this.vectorLeft, this.vectorTop);
                    this.slowEffect.setLayer(this.vectorTop * 10 + 1);
                }
                this.setLayer(this.vectorTop * 10);
                this.setVisible(true);
            } else {
                return;
            }
        }}, ":Canvas":{useCanvas:true, click:function () {
            var I=this.getTouchPoint();
            this.parent.select(~~((I.left - f) / G), ~~((I.top - D) / G));
        }}, ":Pause":{init:function () {
            d.connect(this, "scene");
            this.findChild("title").setText(SpilGames._("游戏暂停"));
            var I=d.allocObject("DOM", this.name + "_tmp", this.path, "IMG");
            I.__view__.src=d.getUrl("./image/pause.jpg");
            I.setStyle("left: 0px; top: 0px; width: 100%; height: 100%; z-index: -1;");
        }, scene:function () {
        }}, ":Result":{init:function () {
            d.connect(this, "scene");
            this.title=this.findChild("title");
            this.total=this.findChild("total");
            this.time=this.findChild("time");
            this.restart=this.findChild("restart");
            this.menu=this.findChild("menu");
            this.high=this.findChild("high");
        }, prescene:function (J, I, K, L) {
            if (J === true) {
                if (I) {
                    this.title.setText(SpilGames._("胜利了！"));
                    this.title.setStyle("top: 174px;");
                    this.setStyle("background-image: url('./image/victory.jpg');");
                    this.restart.setStyle("visibility: hidden;");
                    this.total.setStyle("visibility: inherit;");
                    this.time.setStyle("visibility: inherit;");
                    this.total.setText(SpilGames._("总分: %s", A + ""));
                    this.time.setText(SpilGames._("游戏时间: %s:%s", ~~(L / 60) + "", L % 60 + ""));
                    this.menu.setStyle("top: 330px;");
                    this.high.setStyle("top: 380px;");
                } else {
                    this.title.setText(SpilGames._("失败了!"));
                    this.title.setStyle("top: 170px;");
                    this.setStyle("background-image: url('./image/lose.jpg');");
                    this.restart.setStyle("visibility: inherit; top: 270px;");
                    this.menu.setStyle("top: 320px;");
                    this.high.setStyle("top: 370px;");
                    this.total.setText(SpilGames._("总分: %s", A + ""));
                    this.time.setStyle("visibility: hidden;");
                }
                d.submitScore(A);
                delete d.global.saveScene;
                d.saveSetting();
            }
        }, scene:function () {
        }}}};
    };
})(window);