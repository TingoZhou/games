var gapi=window.gapi=window.gapi||{};gapi._bs=new Date().getTime();(function(){var aa=encodeURIComponent,m=window,ba=Object,r=document,s=String,t=decodeURIComponent;function ca(a,b){return a.type=b}
var da="appendChild",u="push",v="test",ea="shift",fa="exec",ga="width",x="replace",ha="getElementById",y="concat",ia="JSON",z="indexOf",ja="match",ka="readyState",A="createElement",B="setAttribute",C="getTime",la="getElementsByTagName",ma="substr",E="length",na="prototype",F="split",H="location",I="style",oa="removeChild",pa="call",J="getAttribute",K="charCodeAt",L="href",qa="substring",ra="action",M="apply",sa="attributes",O="parentNode",ta="update",ua="height",P="join",va="toLowerCase";var Q=m,R=r,wa=Q[H],xa=function(){},ya=/\[native code\]/,S=function(a,b,c){return a[b]=a[b]||c},za=function(a){for(var b=0;b<this[E];b++)if(this[b]===a)return b;return-1},Aa=function(a){a=a.sort();for(var b=[],c=void 0,d=0;d<a[E];d++){var e=a[d];e!=c&&b[u](e);c=e}return b},Ba=/&/g,Ca=/</g,Da=/>/g,Ea=/"/g,Fa=/'/g,Ga=function(a){return s(a)[x](Ba,"&amp;")[x](Ca,"&lt;")[x](Da,"&gt;")[x](Ea,"&quot;")[x](Fa,"&#39;")},T=function(){var a;if((a=ba.create)&&ya[v](a))a=a(null);else{a={};for(var b in a)a[b]=
void 0}return a},U=function(a,b){return ba[na].hasOwnProperty[pa](a,b)},Ha=function(a){if(ya[v](ba.keys))return ba.keys(a);var b=[],c;for(c in a)U(a,c)&&b[u](c);return b},V=function(a,b){a=a||{};for(var c in a)U(a,c)&&(b[c]=a[c])},Ia=function(a){return function(){Q.setTimeout(a,0)}},Ja=function(a,b){if(!a)throw Error(b||"");},W=S(Q,"gapi",{});var X=function(a,b,c){var d=RegExp("([#].*&|[#])"+b+"=([^&#]*)","g");b=RegExp("([?#].*&|[?#])"+b+"=([^&#]*)","g");if(a=a&&(d[fa](a)||b[fa](a)))try{c=t(a[2])}catch(e){}return c},Ka=/^([^?#]*)(\?([^#]*))?(\#(.*))?$/,La=function(a){a=a[ja](Ka);var b=T();b.t=a[1];b.c=a[3]?[a[3]]:[];b.i=a[5]?[a[5]]:[];return b},Ma=function(a){return a.t+(0<a.c[E]?"?"+a.c[P]("&"):"")+(0<a.i[E]?"#"+a.i[P]("&"):"")},Na=function(a,b){var c=[];if(a)for(var d in a)if(U(a,d)&&null!=a[d]){var e=b?b(a[d]):a[d];c[u](aa(d)+"="+aa(e))}return c},
Oa=function(a,b,c,d){a=La(a);a.c[u][M](a.c,Na(b,d));a.i[u][M](a.i,Na(c,d));return Ma(a)},Pa=function(a,b){var c="";2E3<b[E]&&(c=b[qa](2E3),b=b[qa](0,2E3));var d=a[A]("div"),e=a[A]("a");e.href=b;d[da](e);d.innerHTML=d.innerHTML;b=s(d.firstChild[L]);d[O]&&d[O][oa](d);return b+c},Qa=/^https?:\/\/[^\/%\\?#\s]+\/[^\s]*$/i;var Ra=function(a,b,c,d){if(Q[c+"EventListener"])Q[c+"EventListener"](a,b,!1);else if(Q[d+"tachEvent"])Q[d+"tachEvent"]("on"+a,b)},Ua=function(a){var b=Sa;if("complete"!==R[ka])try{b()}catch(c){}Ta(a)},Ta=function(a){if("complete"===R[ka])a();else{var b=!1,c=function(){if(!b)return b=!0,a[M](this,arguments)};Q.addEventListener?(Q.addEventListener("load",c,!1),Q.addEventListener("DOMContentLoaded",c,!1)):Q.attachEvent&&(Q.attachEvent("onreadystatechange",function(){"complete"===R[ka]&&c[M](this,arguments)}),
Q.attachEvent("onload",c))}},Va=function(a){for(;a.firstChild;)a[oa](a.firstChild)},Wa={button:!0,div:!0,span:!0};var Y;Y=S(Q,"___jsl",T());S(Y,"I",0);S(Y,"hel",10);var Xa=function(a){return Y.dpo?Y.h:X(a,"jsh",Y.h)},Ya=function(a){var b=S(Y,"sws",[]);b[u][M](b,a)},Za=function(a){var b=S(Y,"PQ",[]);Y.PQ=[];var c=b[E];if(0===c)a();else for(var d=0,e=function(){++d===c&&a()},f=0;f<c;f++)b[f](e)},$a=function(a){return S(S(Y,"H",T()),a,T())};var ab=S(Y,"perf",T()),bb=S(ab,"g",T()),cb=S(ab,"i",T());S(ab,"r",[]);T();T();var db=function(a,b,c){var d=ab.r;"function"===typeof d?d(a,b,c):d[u]([a,b,c])},eb=function(a,b,c){bb[a]=!b&&bb[a]||c||(new Date)[C]();db(a)},gb=function(a,b,c){b&&0<b[E]&&(b=fb(b),c&&0<c[E]&&(b+="___"+fb(c)),28<b[E]&&(b=b[ma](0,28)+(b[E]-28)),c=b,b=S(cb,"_p",T()),S(b,c,T())[a]=(new Date)[C](),db(a,"_p",c))},fb=function(a){return a[P]("__")[x](/\./g,"_")[x](/\-/g,"_")[x](/\,/g,"_")};var hb=T(),ib=[],Z=function(a){throw Error("Bad hint"+(a?": "+a:""));};ib[u](["jsl",function(a){for(var b in a)if(U(a,b)){var c=a[b];"object"==typeof c?Y[b]=S(Y,b,[])[y](c):S(Y,b,c)}if(b=a.u)a=S(Y,"us",[]),a[u](b),(b=/^https:(.*)$/[fa](b))&&a[u]("http:"+b[1])}]);var jb=/^(\/[a-zA-Z0-9_\-]+)+$/,kb=/^[a-zA-Z0-9\-_\.!]+$/,lb=/^gapi\.loaded_[0-9]+$/,mb=/^[a-zA-Z0-9,._-]+$/,qb=function(a,b,c,d){var e=a[F](";"),f=hb[e[ea]()],g=null;f&&(g=f(e,b,c,d));if(b=g)b=g,c=b[ja](nb),d=b[ja](ob),b=!!d&&1===d[E]&&pb[v](b)&&!!c&&1===c[E];b||Z(a);return g},tb=function(a,b,c,d){a=rb(a);lb[v](c)||Z("invalid_callback");b=sb(b);d=d&&d[E]?sb(d):null;var e=function(a){return aa(a)[x](/%2C/g,",")};return[aa(a.v)[x](/%2C/g,",")[x](/%2F/g,"/"),"/k=",e(a.version),"/m=",e(b),d?"/exm="+
e(d):"","/rt=j/sv=1/d=1/ed=1",a.n?"/am="+e(a.n):"",a.o?"/rs="+e(a.o):"","/cb=",e(c)][P]("")},rb=function(a){"/"!==a.charAt(0)&&Z("relative path");for(var b=a[qa](1)[F]("/"),c=[];b[E];){a=b[ea]();if(!a[E]||0==a[z]("."))Z("empty/relative directory");else if(0<a[z]("=")){b.unshift(a);break}c[u](a)}a={};for(var d=0,e=b[E];d<e;++d){var f=b[d][F]("="),g=t(f[0]),k=t(f[1]);2==f[E]&&(g&&k)&&(a[g]=a[g]||k)}b="/"+c[P]("/");jb[v](b)||Z("invalid_prefix");c=ub(a,"k",!0);d=ub(a,"am");a=ub(a,"rs");return{v:b,version:c,
n:d,o:a}},sb=function(a){for(var b=[],c=0,d=a[E];c<d;++c){var e=a[c][x](/\./g,"_")[x](/-/g,"_");mb[v](e)&&b[u](e)}return b[P](",")},ub=function(a,b,c){a=a[b];!a&&c&&Z("missing: "+b);if(a){if(kb[v](a))return a;Z("invalid: "+b)}return null},pb=/^https?:\/\/[a-z0-9_.-]+\.google\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,ob=/\/cb=/g,nb=/\/\//g,vb=function(){var a=Xa(wa[L]);if(!a)throw Error("Bad hint");return a};hb.m=function(a,b,c,d){(a=a[0])||Z("missing_hint");return"https://apis.google.com"+tb(a,b,c,d)};var wb=decodeURI("%73cript"),xb=function(a,b){for(var c=[],d=0;d<a[E];++d){var e=a[d];e&&0>za[pa](b,e)&&c[u](e)}return c},zb=function(a){"loading"!=R[ka]?yb(a):R.write("<"+wb+' src="'+encodeURI(a)+'"></'+wb+">")},yb=function(a){var b=R[A](wb);b[B]("src",a);b.async="true";(a=R[la](wb)[0])?a[O].insertBefore(b,a):(R.head||R.body||R.documentElement)[da](b)},Ab=function(a,b){var c=b&&b._c;if(c)for(var d=0;d<ib[E];d++){var e=ib[d][0],f=ib[d][1];f&&U(c,e)&&f(c[e],a,b)}},Db=function(a,b){Cb(function(){var c;
c=b===Xa(wa[L])?S(W,"_",T()):T();c=S($a(b),"_",c);a(c)})},Fb=function(a,b){var c=b||{};"function"==typeof b&&(c={},c.callback=b);Ab(a,c);var d=a?a[F](":"):[],e=c.h||vb(),f=S(Y,"ah",T());if(f["::"]&&d[E]){for(var g=[],k=null;k=d[ea]();){var n=k[F]("."),n=f[k]||f[n[1]&&"ns:"+n[0]||""]||e,h=g[E]&&g[g[E]-1]||null,l=h;h&&h.hint==n||(l={hint:n,p:[]},g[u](l));l.p[u](k)}var p=g[E];if(1<p){var w=c.callback;w&&(c.callback=function(){0==--p&&w()})}for(;d=g[ea]();)Eb(d.p,c,d.hint)}else Eb(d||[],c,e)},Eb=function(a,
b,c){a=Aa(a)||[];var d=b.callback,e=b.config,f=b.timeout,g=b.ontimeout,k=null,n=!1;if(f&&!g||!f&&g)throw"Timeout requires both the timeout parameter and ontimeout parameter to be set";var h=S($a(c),"r",[]).sort(),l=S($a(c),"L",[]).sort(),p=[][y](h),w=function(a,b){if(n)return 0;Q.clearTimeout(k);l[u][M](l,q);var d=((W||{}).config||{})[ta];d?d(e):e&&S(Y,"cu",[])[u](e);if(b){gb("me0",a,p);try{Db(b,c)}finally{gb("me1",a,p)}}return 1};0<f&&(k=Q.setTimeout(function(){n=!0;g()},f));var q=xb(a,l);if(q[E]){var q=
xb(a,h),D=S(Y,"CP",[]),G=D[E];D[G]=function(a){if(!a)return 0;gb("ml1",q,p);var b=function(b){D[G]=null;w(q,a)&&Za(function(){d&&d();b()})},c=function(){var a=D[G+1];a&&a()};0<G&&D[G-1]?D[G]=function(){b(c)}:b(c)};if(q[E]){var N="loaded_"+Y.I++;W[N]=function(a){D[G](a);W[N]=null};a=qb(c,q,"gapi."+N,h);h[u][M](h,q);gb("ml0",q,p);b.sync||Q.___gapisync?zb(a):yb(a)}else D[G](xa)}else w(q)&&d&&d()};var Cb=function(a){if(Y.hee&&0<Y.hel)try{return a()}catch(b){Y.hel--,Fb("debug_error",function(){m.___jsl.hefn(b)})}else return a()};W.load=function(a,b){return Cb(function(){return Fb(a,b)})};var Gb=function(a){var b=m.___jsl=m.___jsl||{};b[a]=b[a]||[];return b[a]},Hb=function(a){var b=m.___jsl=m.___jsl||{};b.cfg=!a&&b.cfg||{};return b.cfg},Ib=function(a){return"object"===typeof a&&/\[native code\]/[v](a[u])},Jb=function(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]&&b[c]&&"object"===typeof a[c]&&"object"===typeof b[c]&&!Ib(a[c])&&!Ib(b[c])?Jb(a[c],b[c]):b[c]&&"object"===typeof b[c]?(a[c]=Ib(b[c])?[]:{},Jb(a[c],b[c])):a[c]=b[c])},Kb=function(a){if(a&&!/^\s+$/[v](a)){for(;0==a[K](a[E]-
1);)a=a[qa](0,a[E]-1);var b;try{b=m[ia].parse(a)}catch(c){}if("object"===typeof b)return b;try{b=(new Function("return ("+a+"\n)"))()}catch(d){}if("object"===typeof b)return b;try{b=(new Function("return ({"+a+"\n})"))()}catch(e){}return"object"===typeof b?b:{}}},$=function(a){if(!a)return Hb();a=a[F]("/");for(var b=Hb(),c=0,d=a[E];b&&"object"===typeof b&&c<d;++c)b=b[a[c]];return c===a[E]&&void 0!==b?b:void 0},Lb=function(){Hb(!0);var a=m.___gcfg,b=Gb("cu");if(a&&a!==m.___gu){var c={};Jb(c,a);b[u](c);
m.___gu=a}var a=Gb("cu"),d=r.scripts||r[la]("script")||[],c=[],e=[];e[u][M](e,Gb("us"));for(var f=0;f<d[E];++f)for(var g=d[f],k=0;k<e[E];++k)g.src&&0==g.src[z](e[k])&&c[u](g);0==c[E]&&(0<d[E]&&d[d[E]-1].src)&&c[u](d[d[E]-1]);for(d=0;d<c[E];++d)c[d][J]("gapi_processed")||(c[d][B]("gapi_processed",!0),(e=c[d])?(f=e.nodeType,e=3==f||4==f?e.nodeValue:e.textContent||e.innerText||e.innerHTML||""):e=void 0,(e=Kb(e))&&a[u](e));d=Gb("cd");a=0;for(c=d[E];a<c;++a)Jb(Hb(),d[a]);d=Gb("ci");a=0;for(c=d[E];a<c;++a)Jb(Hb(),
d[a]);a=0;for(c=b[E];a<c;++a)Jb(Hb(),b[a])};var Mb=function(){var a=m.__GOOGLEAPIS;a&&(a.googleapis&&!a["googleapis.config"]&&(a["googleapis.config"]=a.googleapis),S(Y,"ci",[])[u](a),m.__GOOGLEAPIS=void 0)};var Nb=m.console,Ob=function(a){Nb&&Nb.log&&Nb.log(a)};var Pb=S(Y,"rw",T()),Qb=function(a,b){var c=Pb[a];c&&c.state<b&&(c.state=b)};var Rb=function(a){var b;a[ja](/^https?%3A/i)&&(b=t(a));return Pa(r,b?b:a)},Sb=function(a){a=a||"canonical";for(var b=r[la]("link"),c=0,d=b[E];c<d;c++){var e=b[c],f=e[J]("rel");if(f&&f[va]()==a&&(e=e[J]("href"))&&(e=Rb(e))&&null!=e[ja](/^https?:\/\/[\w\-\_\.]+/i))return e}return m[H][L]};var Tb;var Ub=function(a){var b=$("googleapis.config/sessionIndex");null==b&&(b=m.__X_GOOG_AUTHUSER);if(null==b){var c=m.google;c&&(b=c.authuser)}null==b&&(null==a&&(a=m[H][L]),b=a?X(a,"authuser")||null:null);return null==b?null:s(b)},Vb=function(){var a=$("googleapis.config/sessionDelegate");return null==a?null:s(a)};var Wb=function(){};var Xb=function(){this.b=[];this.j=[];this.q=[];this.g=[];this.g[0]=128;for(var a=1;64>a;++a)this.g[a]=0;this.reset()};(function(){function a(){}a.prototype=Wb[na];Xb.w=Wb[na];Xb.prototype=new a})();Xb[na].reset=function(){this.b[0]=1732584193;this.b[1]=4023233417;this.b[2]=2562383102;this.b[3]=271733878;this.b[4]=3285377520;this.k=this.d=0};
var Yb=function(a,b,c){c||(c=0);var d=a.q;if("string"==typeof b)for(var e=0;16>e;e++)d[e]=b[K](c)<<24|b[K](c+1)<<16|b[K](c+2)<<8|b[K](c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.b[0];c=a.b[1];for(var g=a.b[2],k=a.b[3],n=a.b[4],h,e=0;80>e;e++)40>e?20>e?(f=k^c&(g^k),h=1518500249):(f=c^g^k,h=1859775393):60>e?(f=c&g|k&(c|g),h=2400959708):(f=c^g^k,h=3395469782),f=(b<<5|b>>>27)+f+
n+h+d[e]&4294967295,n=k,k=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.b[0]=a.b[0]+b&4294967295;a.b[1]=a.b[1]+c&4294967295;a.b[2]=a.b[2]+g&4294967295;a.b[3]=a.b[3]+k&4294967295;a.b[4]=a.b[4]+n&4294967295};Xb[na].update=function(a,b){void 0===b&&(b=a[E]);for(var c=b-64,d=0,e=this.j,f=this.d;d<b;){if(0==f)for(;d<=c;)Yb(this,a,d),d+=64;if("string"==typeof a)for(;d<b;){if(e[f]=a[K](d),++f,++d,64==f){Yb(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,64==f){Yb(this,e);f=0;break}}this.d=f;this.k+=b};var Zb=function(){this.l=new Xb};Zb[na].reset=function(){this.l.reset()};var fc=function(){var a;$b?(a=new Q.Uint32Array(1),ac.getRandomValues(a),a=Number("0."+a[0])):(a=bc,a+=parseInt(cc[ma](0,20),16),cc=dc(cc),a/=ec+Math.pow(16,20));return a},ac=Q.crypto,$b=!1,gc=0,hc=0,bc=1,ec=0,cc="",ic=function(a){a=a||Q.event;var b=a.screenX+a.clientX<<16,b=b+(a.screenY+a.clientY),b=b*((new Date)[C]()%1E6);bc=bc*b%ec;0<gc&&++hc==gc&&Ra("mousemove",ic,"remove","de")},dc=function(a){var b=new Zb;a=unescape(aa(a));for(var c=[],d=0,e=a[E];d<e;++d)c[u](a[K](d));b.l[ta](c);a=b.l;b=[];
d=8*a.k;56>a.d?a[ta](a.g,56-a.d):a[ta](a.g,64-(a.d-56));for(c=63;56<=c;c--)a.j[c]=d&255,d/=256;Yb(a,a.j);for(c=d=0;5>c;c++)for(e=24;0<=e;e-=8)b[d]=a.b[c]>>e&255,++d;a="";for(c=0;c<b[E];c++)a+="0123456789ABCDEF".charAt(Math.floor(b[c]/16))+"0123456789ABCDEF".charAt(b[c]%16);return a},$b=!!ac&&"function"==typeof ac.getRandomValues;
$b||(ec=1E6*(screen[ga]*screen[ga]+screen[ua]),cc=dc(R.cookie+"|"+R[H]+"|"+(new Date)[C]()+"|"+Math.random()),gc=$("random/maxObserveMousemove")||0,0!=gc&&Ra("mousemove",ic,"add","at"));var jc=function(){var a=Y.onl;if(!a){a=T();Y.onl=a;var b=T();a.e=function(a){var d=b[a];d&&(delete b[a],d())};a.a=function(a,d){b[a]=d};a.r=function(a){delete b[a]}}return a},kc=function(a,b){var c=b.onload;return"function"===typeof c?(jc().a(a,c),c):null},lc=function(a){Ja(/^\w+$/[v](a),"Unsupported id - "+a);jc();return'onload="window.___jsl.onl.e(&#34;'+a+'&#34;)"'},mc=function(a){jc().r(a)};var nc={allowtransparency:"true",frameborder:"0",hspace:"0",marginheight:"0",marginwidth:"0",scrolling:"no",style:"",tabindex:"0",vspace:"0",width:"100%"},oc={allowtransparency:!0,onload:!0},pc=0,qc=function(a){Ja(!a||Qa[v](a),"Illegal url for new iframe - "+a)},rc=function(a,b,c,d,e){qc(c.src);var f,g=kc(d,c),k=g?lc(d):"";try{f=a[A]('<iframe frameborder="'+Ga(s(c.frameborder))+'" scrolling="'+Ga(s(c.scrolling))+'" '+k+' name="'+Ga(s(c.name))+'"/>')}catch(n){f=a[A]("iframe"),g&&(f.onload=function(){f.onload=
null;g[pa](this)},mc(d))}for(var h in c)a=c[h],"style"===h&&"object"===typeof a?V(a,f[I]):oc[h]||f[B](h,s(a));(h=e&&e.beforeNode||null)||e&&e.dontclear||Va(b);b.insertBefore(f,h);f=h?h.previousSibling:b.lastChild;c.allowtransparency&&(f.allowTransparency=!0);return f};var sc=/^:[\w]+$/,tc=/:([a-zA-Z_]+):/g,uc=function(a,b){if(!Tb){var c=Ub(),d=Vb(),e;e=Ub(void 0);var f=Vb(),g="";e&&(g+="u/"+e+"/");f&&(g+="b/"+f+"/");e=g||null;(f=!1===$("googleapis.config/signedIn")?"_/im/":"")&&(e="");Tb={socialhost:$("iframes/:socialhost:"),session_index:c||"0",session_delegate:d,session_prefix:e,im_prefix:f}}return Tb[b]||""};var vc={style:"position:absolute;top:-10000px;width:450px;margin:0px;borderStyle:none"},wc="onPlusOne _ready _close,_open _resizeMe _renderstart oncircled".split(" "),xc=S(Y,"WI",T()),yc=["style","data-gapiscan"],zc=function(a){var b=void 0;"number"===typeof a?b=a:"string"===typeof a&&(b=parseInt(a,10));return b},Ac=function(){};var Bc,Cc,Dc,Ec,Fc,Gc=/(?:^|\s)g-((\S)*)(?:$|\s)/;Bc=S(Y,"SW",T());Cc=S(Y,"SA",T());Dc=S(Y,"SM",T());Ec=S(Y,"FW",[]);Fc=null;
var Ic=function(a,b){Hc(void 0,!1,a,b)},Hc=function(a,b,c,d){eb("ps0",!0);c=("string"===typeof c?r[ha](c):c)||R;var e;e=R.documentMode;if(c.querySelectorAll&&(!e||8<e)){e=d?[d]:Ha(Bc)[y](Ha(Cc))[y](Ha(Dc));for(var f=[],g=0;g<e[E];g++){var k=e[g];f[u](".g-"+k,"g\\:"+k)}e=c.querySelectorAll(f[P](","))}else e=c[la]("*");c=T();for(f=0;f<e[E];f++){g=e[f];var n=g,k=d,h=n.nodeName[va](),l=void 0;n[J]("data-gapiscan")?k=null:(0==h[z]("g:")?l=h[ma](2):(n=(n=s(n.className||n[J]("class")))&&Gc[fa](n))&&(l=n[1]),
k=!l||!(Bc[l]||Cc[l]||Dc[l])||k&&l!==k?null:l);k&&(g[B]("data-gapiscan",!0),S(c,k,[])[u](g))}if(b)for(var p in c)for(b=c[p],d=0;d<b[E];d++)b[d][B]("data-onload",!0);for(var w in c)Ec[u](w);eb("ps1",!0);if((p=Ec[P](":"))||a)try{W.load(p,a)}catch(q){Ob(q);return}if(Jc(Fc||{}))for(var D in c){a=c[D];w=0;for(b=a[E];w<b;w++)a[w].removeAttribute("data-gapiscan");Kc(D)}else{d=[];for(D in c)for(a=c[D],w=0,b=a[E];w<b;w++){g=a[w];e=D;k=f=g;g=T();l=0!=k.nodeName[va]()[z]("g:");n=0;for(h=k[sa][E];n<h;n++){var G=
k[sa][n],N=G.name,Bb=G.value;0<=za[pa](yc,N)||(l&&0!=N[z]("data-")||"null"===Bb||"specified"in G&&!G.specified)||(l&&(N=N[ma](5)),g[N[va]()]=Bb)}l=g;k=k[I];(n=zc(k&&k[ua]))&&(l.height=s(n));(k=zc(k&&k[ga]))&&(l.width=s(k));Lc(e,f,g,d,b)}Mc(p,d)}},Nc=function(a){var b=S(W,a,{});b.go||(b.go=function(b){return Ic(b,a)},b.render=function(b,d){var e=d||{};ca(e,a);var f=e.type;delete e.type;var g=("string"===typeof b?r[ha](b):b)||void 0;if(g){var k={},n;for(n in e)U(e,n)&&(k[n[va]()]=e[n]);k.rd=1;e=[];
Lc(f,g,k,e,0);Mc(f,e)}else Ob("string"==="gapi."+f+".render: missing element "+typeof b?b:"")})},Oc=function(a){Bc[a]=!0},Pc=function(a){Cc[a]=!0},Qc=function(a){Dc[a]=!0};var Kc=function(a,b){var c=S(Y,"watt",T())[a];b&&c?(c(b),(c=b.iframeNode)&&c[B]("data-gapiattached",!0)):W.load(a,function(){var c=S(Y,"watt",T())[a],e=b&&b.iframeNode;e&&c?(c(b),e[B]("data-gapiattached",!0)):(0,W[a].go)(e&&e[O])})},Jc=function(){return!1},Mc=function(){},Lc=function(a,b,c,d,e){switch(Rc(b,a)){case 0:a=Dc[a]?a+"_annotation":a;d={};d.iframeNode=b;d.userParams=c;Kc(a,d);break;case 1:var f;if(b[O]){var g=!0;c.dontclear&&(g=!1);delete c.dontclear;var k,n,h;n=h=a;"plus"==a&&c[ra]&&(h=
a+"_"+c[ra],n=a+"/"+c[ra]);(h=$("iframes/"+h+"/url"))||(h=":socialhost:/_/widget/render/"+n);n=Pa(R,h[x](tc,uc));h={};V(c,h);h.hl=$("lang")||$("gwidget/lang")||"en-US";h.origin=m[H].origin||m[H].protocol+"//"+m[H].host;h.exp=$("iframes/"+a+"/params/exp");var l=$("iframes/"+a+"/params/location");if(l)for(var p=0;p<l[E];p++){var w=l[p];h[w]=Q[H][w]}switch(a){case "plus":case "follow":l=h[L];p=c[ra]?void 0:"publisher";l=(l="string"==typeof l?l:void 0)?Rb(l):Sb(p);h.url=l;delete h[L];break;case "plusone":case "recobox":h.url=
c[L]?Rb(c[L]):Sb();l=c.db;p=$();null==l&&p&&(l=p.db,null==l&&(l=p.gwidget&&p.gwidget.db));h.db=l||void 0;l=c.ecp;p=$();null==l&&p&&(l=p.ecp,null==l&&(l=p.gwidget&&p.gwidget.ecp));h.ecp=l||void 0;delete h[L];break;case "signin":h.url=Sb()}Y.ILI&&(h.iloader="1");delete h["data-onload"];delete h.rd;h.gsrc=$("iframes/:source:");l=$("inline/css");"undefined"!==typeof l&&(0<e&&l>=e)&&(h.ic="1");l=/^#|^fr-/;e={};for(k in h)U(h,k)&&l[v](k)&&(e[k[x](l,"")]=h[k],delete h[k]);k=[][y](wc);(l=$("iframes/"+a+"/methods"))&&
("object"===typeof l&&ya[v](l[u]))&&(k=k[y](l));for(var q in c)U(c,q)&&(/^on/[v](q)&&("plus"!=a||"onconnect"!=q))&&(k[u](q),delete h[q]);delete h.callback;e._methods=k[P](",");k=Oa(n,h,e);q={allowPost:1,attributes:vc};q.dontclear=!g;g={};g.userParams=c;g.url=k;ca(g,a);c.rd?h=b:(h=r[A]("div"),b[B]("data-gapistub",!0),h[I].cssText="position:absolute;width:450px;left:-10000px;",b[O].insertBefore(h,b));g.siteElement=h;h.id||(b=h,S(xc,a,0),n="___"+a+"_"+xc[a]++,b.id=n);b=T();b[">type"]=a;V(c,b);n=k;c=
h;k=q||{};b=k[sa]||{};Ja(!k.allowPost||!b.onload,"onload is not supported by post iframe");q=b=n;sc[v](b)&&(q=$("iframes/"+q[qa](1)+"/url"),Ja(!!q,"Unknown iframe url config for - "+b));n=Pa(R,q[x](tc,uc));b=c.ownerDocument||R;h=0;do q=k.id||["I",pc++,"_",(new Date)[C]()][P]("");while(b[ha](q)&&5>++h);Ja(5>h,"Error creating iframe id");h={};e={};V(k.queryParams||{},h);V(k.fragmentParams||{},e);l=T();l.id=q;l.parent=b[H].protocol+"//"+b[H].host;p=X(b[H][L],"id","");w=X(b[H][L],"pfname","");(p=p?w+
"/"+p:"")&&(l.pfname=p);V(l,e);(l=X(n,"rpctoken")||h.rpctoken||e.rpctoken)||(l=e.rpctoken=k.rpctoken||s(Math.round(1E8*fc())));k.rpctoken=l;p=b[H][L];l=T();(w=X(p,"_bsh",Y.bsh))&&(l._bsh=w);(p=Xa(p))&&(l.jsh=p);k.hintInFragment?V(l,e):V(l,h);n=Oa(n,h,e,k.paramsSerializer);e=T();V(nc,e);V(k[sa],e);e.name=e.id=q;e.src=n;k.eurl=n;if((k||{}).allowPost&&2E3<n[E]){h=La(n);e.src="";e["data-postorigin"]=n;n=rc(b,c,e,q);-1!=navigator.userAgent[z]("WebKit")&&(f=n.contentWindow.document,f.open(),e=f[A]("div"),
l={},p=q+"_inner",l.name=p,l.src="",l.style="display:none",rc(b,e,l,p,k));e=(k=h.c[0])?k[F]("&"):[];k=[];for(l=0;l<e[E];l++)p=e[l][F]("=",2),k[u]([t(p[0]),t(p[1])]);h.c=[];e=Ma(h);h=b[A]("form");h.action=e;h.method="POST";h.target=q;h[I].display="none";for(q=0;q<k[E];q++)e=b[A]("input"),ca(e,"hidden"),e.name=k[q][0],e.value=k[q][1],h[da](e);c[da](h);h.submit();h[O][oa](h);f&&f.close();f=n}else f=rc(b,c,e,q,k);g.iframeNode=f;g.id=f[J]("id");f=g.id;c=T();c.id=f;c.userParams=g.userParams;c.url=g.url;
ca(c,g.type);c.state=1;Pb[f]=c;f=g}else f=null;f&&((g=f.id)&&d[u](g),Kc(a,f))}},Rc=function(a,b){if(a&&1===a.nodeType&&b)if(Dc[b]){if(Wa[a.nodeName[va]()]){var c=a.innerHTML;return c&&c[x](/^[\s\xa0]+|[\s\xa0]+$/g,"")?0:1}}else{if(Cc[b])return 0;if(Bc[b])return 1}return null};S(W,"platform",{}).go=Ic;var Jc=function(a){for(var b=["_c","jsl","h"],c=0;c<b[E]&&a;c++)a=a[b[c]];b=Xa(wa[L]);return!a||0!=a[z]("n;")&&0!=b[z]("n;")&&a!==b},Mc=function(a,b){Sc(a,b)},Sa=function(a){Hc(a,!0)},Tc=function(a,b){for(var c=b||[],d=0;d<c[E];++d)a(c[d]);for(d=0;d<c[E];d++)Nc(c[d])};ib[u](["platform",function(a,b,c){Fc=c;b&&Ec[u](b);Tc(Oc,a);Tc(Pc,c._c.annotation);Tc(Qc,c._c.bimodal);Mb();Lb();if("explicit"!=$("parsetags")){Ya(a);var d;c&&(a=c.callback)&&(d=Ia(a),delete c.callback);Ua(function(){Sa(d)})}}]);var Uc=function(a){a=(a=Pb[a])?a.oid:void 0;if(a){var b=R[ha](a);b&&b[O][oa](b);delete Pb[a];Uc(a)}},Ac=function(a,b,c){if(c[ga]&&c[ua]){n:{c=c||{};var d=Y.ssfn;if(d&&d(void 0)){if("number"===typeof Y.ucs)break n;var e=b.id;if(e){d=(d=Pb[e])?d.state:void 0;if(1===d||4===d)break n;Uc(e)}}(d=a.nextSibling)&&(d[J]&&d[J]("data-gapistub"))&&(a[O][oa](d),a[I].cssText="");var d=c[ga],f=c[ua],g=a[I];g.textIndent="0";g.margin="0";g.padding="0";g.background="transparent";g.borderStyle="none";g.cssFloat="none";
g.styleFloat="none";g.lineHeight="normal";g.fontSize="1px";g.verticalAlign="baseline";a=a[I];a.display="inline-block";g=b[I];g.position="static";g.left=0;g.top=0;g.visibility="visible";d&&(a.width=g.width=d+"px");f&&(a.height=g.height=f+"px");c.verticalAlign&&(a.verticalAlign=c.verticalAlign);e&&Qb(e,3)}b["data-csi-wdt"]=(new Date)[C]()}};var Vc=/^\{h\:'/,Wc=/^!_/,Xc="",Sc=function(a,b){function c(){Ra("message",d,"remove","de")}function d(d){var g=d.data,k=d.origin;if(Yc(g,b)){var n=e;e=!1;n&&eb("rqe");Zc(a,function(){n&&eb("rqd");c();for(var a=S(Y,"RPMQ",[]),b=0;b<a[E];b++)a[b]({data:g,origin:k})})}}if(0!==b[E]&&m[ia]&&m[ia].parse){Xc=X(wa[L],"pfname","");var e=!0;Ra("message",d,"add","at");Fb(a,c)}},Yc=function(a,b){a=s(a);if(Vc[v](a))return!0;var c=!1;Wc[v](a)&&(c=!0,a=a[ma](2));if(!/^\{/[v](a))return!1;try{var d=m[ia].parse(a)}catch(e){return!1}if(!d)return!1;
var f=d.f;if(d.s&&f&&-1!=za[pa](b,f)){if("_renderstart"===d.s||d.s===Xc+"/"+f+"::_renderstart")c=d.a&&d.a[c?0:1],d=R[ha](f),Qb(f,2),(f=Pb[f])&&(f.args=c),c&&d&&Ac(d[O],d,c);return!0}return!1},Zc=function(a,b){Fb(a,b)};eb("bs0",!0,m.gapi._bs);eb("bs1",!0);delete m.gapi._bs;})();
gapi.load("plusone",{callback:window["gapi_onload"],_c:{"jsl":{"ci":{"services":{},"client":{},"plus_layer":{"isEnabled":false},"isLoggedIn":true,"iframes":{"additnow":{"methods":["launchurl"],"url":"https://apis.google.com/additnow/additnow.html?bsv"},"recobox":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/recobox?bsv"},"plus_followers":{"params":{"url":""},"url":":socialhost:/_/im/_/widget/render/plus/followers?bsv"},"signin":{"methods":["onauth"],"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/signin?bsv"},"commentcount":{"url":":socialhost:/:session_prefix:_/widget/render/commentcount?bsv"},"plus_circle":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/plus/circle?bsv"},"hangout":{"url":"https://talkgadget.google.com/:session_prefix:talkgadget/_/widget?bsv"},"evwidget":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/events/widget?bsv"},"zoomableimage":{"url":"https://ssl.gstatic.com/microscope/embed/?bsv"},"card":{"url":":socialhost:/:session_prefix:_/hovercard/card?bsv"},"shortlists":{"url":"?bsv"},"plus":{"methods":["onauth"],"url":":socialhost:/u/:session_index:/_/pages/badge?bsv"},":socialhost:":"https://apis.google.com","rbr_t":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/recobartray?bsv"},"autocomplete":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/autocomplete?bsv"},"plus_share":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/+1/sharebutton?plusShare\u003dtrue\u0026bsv"},"rbr_i":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/recobarinvitation?bsv"},"panoembed":{"url":"https://ssl.gstatic.com/pano/embed/?bsv"},"savetowallet":{"url":"https://clients5.google.com/s2w/o/savetowallet?bsv"},"appcirclepicker":{"url":":socialhost:/:session_prefix:_/widget/render/appcirclepicker?bsv"},"savetodrive":{"methods":["save"],"url":"https://drive.google.com/savetodrivebutton?usegapi\u003d1\u0026bsv"},":signuphost:":"https://plus.google.com","plusone":{"preloadUrl":["https://ssl.gstatic.com/s2/oz/images/stars/po/Publisher/sprite4-a67f741843ffc4220554c34bd01bb0bb.png"],"params":{"count":"","size":"","url":""},"url":":socialhost:/:session_prefix:_/+1/fastbutton?bsv"},"comments":{"methods":["scroll","openwindow"],"params":{"location":["search","hash"]},"url":":socialhost:/:session_prefix:_/widget/render/comments?bsv"},"ytsubscribe":{"url":"https://www.youtube.com/subscribe_embed?bsv\u0026usegapi\u003d1"}},"isPlusUser":true,"debug":{"host":"https://plusone.google.com","reportExceptionRate":0.05,"rethrowException":true},"deviceType":"desktop","inline":{"css":1},"lexps":[102,103,100,71,98,96,110,79,107,105,45,17,86,81,112,61,30],"report":{},"oauth-flow":{"disableOpt":true,"authUrl":"https://accounts.google.com/o/oauth2/auth","proxyUrl":"https://accounts.google.com/o/oauth2/postmessageRelay","persist":true,"toastCfg":"1000:3000:1000"},"csi":{"rate":0.01},"googleapis.config":{"mobilesignupurl":"https://m.google.com/app/plus/oob?"}},"h":"m;/_/scs/apps-static/_/js/k\u003doz.gapi.zh_CN.0_4A1H1N2Vw.O/m\u003d__features__/am\u003dEQ/rt\u003dj/d\u003d1/rs\u003dAItRSTP1tI835cBYyxob77-ZXhUci7gdcQ","u":"https://apis.google.com/js/plusone.js","hee":true,"fp":"66e1608471e9b3f31f63519f1ed7e7305087b0ed","dpo":false},"platform":["additnow","comments","commentcount","follow","identity","panoembed","plus","plusone","savetodrive","shortlists","ytsubscribe","zoomableimage","page","person","community","savetowallet","notifications","hangout","recobox"],"fp":"66e1608471e9b3f31f63519f1ed7e7305087b0ed","annotation":["interactivepost","recobar","autocomplete","profile"],"bimodal":["signin"]}});