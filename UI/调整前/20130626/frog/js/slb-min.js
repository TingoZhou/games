/* Copyright (c) 2013 TreSensa, Inc. All Rights Reserved. */
var QueryString = function() {
	var d = {};
	var c = window.location.search.substring(1);
	var e = c.split("&");
	for (var b = 0; b < e.length; b++) {
		var f = e[b].split("=");
		if (typeof d[f[0]] === "undefined") {
			d[f[0]] = f[1]
		} else {
			if (typeof d[f[0]] === "string") {
				var a = [d[f[0]], f[1]];
				d[f[0]] = a
			} else {
				d[f[0]].push(f[1])
			}
		}
	}
	return d
}();

function ParseTweet(c) {
	var d = "";
	for (var b = 0; b < c.length; b++) {
		var e = c[b].text;
		var f = parseDate(c[b].created_at);
		var a = f.getDate() + "-" + (f.getMonth() + 1) + "-" + f.getFullYear() + " at " + f.getHours() + ":" + f.getMinutes();
		e = e.parseURL().parseUsername().parseHashtag();
		d += e
	}
	return d
}
String.prototype.parseURL = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(a) {
		return a.link(a)
	})
};
String.prototype.parseUsername = function() {
	return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(a) {
		var b = a.replace("@", "");
		return a.link("http://twitter.com/" + b)
	})
};
String.prototype.parseHashtag = function() {
	return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(b) {
		var a = b.replace("#", "%23");
		return b.link("http://search.twitter.com/search?q=" + a)
	})
};

function parseDate(b) {
	var a = b.split(" ");
	return new Date(Date.parse(a[1] + " " + a[2] + ", " + a[5] + " " + a[3] + " UTC"))
}
function TresensaSocialLeaderBoard() {}
var twitterObj = null;
twttr.anywhere({
	window: document.getElementById("myFrame")
}, function(a) {
	twitterObj = a
});
var ObjTRESENSA;

function TresensaSocialLeaderBoard(a) {
	// this.fbIds;
	// this.twitterIds;
	// this.userDtls;
	// this.FBFriendsObjectArray = new Array();
	// this.TwitterFriendsObjectArray = new Array();
	// this.socialnetwork;
	// this.loggedInTwitterId;
	// this.loginDetails = [{
	// 		social_network: "facebook",
	// 		id: ""
	// 	}, {
	// 		social_network: "twitter",
	// 		id: ""
	// 	}
	// ];
	// this.userCallBack = null;
	// this.userConfiguration = {
	// 	SERVER_URL: a.SERVER_URL,
	// 	APP_URL: a.APP_URL,
	// 	APP_KEY: a.APP_KEY,
	// 	APP_ID: a.APP_ID,
	// 	GameCode: a.GameCode,
	// 	ErrorHandler: a.ErrorHandler,
	// 	SocialNetwork: String(a.SocialNetwork).toLowerCase()
	// };
	// if (this.userConfiguration.SocialNetwork == "facebook") {
	// 	FB.init({
	// 		appId: this.userConfiguration.APP_ID,
	// 		oauth: true
	// 	}, function(c) {})
	// }
	// this.xdr;
	// this.RegisterCallBack = null;
	// var b = this;
	// FB.Event.subscribe("auth.authResponseChange", function(c) {
	// 	if (c.status == "unknown") {
	// 		b.userConfiguration.ErrorHandler("social-network-error")
	// 	}
	// });
	// return this
}
// TresensaSocialLeaderBoard.prototype = {
// 	GetUserDetails: function(d) {
// 		this.RegisterCallBack = d;
// 		var b = this;
// 		switch (this.userConfiguration.SocialNetwork) {
// 			case "facebook":
// 				FB.getLoginStatus(function(e) {
// 					if (e.status !== "connected") {
// 						FB.login(function(f) {
// 							if (f.authResponse) {
// 								FB.api("/me", function(g) {
// 									FB.api("/me/picture?type=small", function(i) {
// 										var h = {
// 											id: g.id,
// 											name: g.name,
// 										};
// 										if (i.data != null) {
// 											h.picture_url = i.data.url
// 										}
// 										d(h)
// 									})
// 								})
// 							} else {
// 								b.userConfiguration.ErrorHandler("social-network-error")
// 							}
// 						}, {
// 							scope: "email,status_update,publish_stream"
// 						})
// 					} else {
// 						FB.api("/me", function(f) {
// 							FB.api("/me/picture?type=small", function(h) {
// 								var g = {
// 									id: f.id,
// 									name: f.name,
// 								};
// 								if (h.data != null) {
// 									g.picture_url = h.data.url
// 								}
// 								d(g)
// 							})
// 						})
// 					}
// 				});
// 				break;
// 			case "twitter":
// 				if (!twitterObj.isConnected()) {
// 					twitterObj.signIn();
// 					twitterObj.bind("authComplete", function(h, f) {
// 						var i = twitterObj.currentUser;
// 						b.loggedInTwitterId = i.data("id");
// 						var g = {
// 							id: "" + i.data("id"),
// 							handle: "" + i.data("screen_name"),
// 							picture_url: "" + i.data("profile_image_url"),
// 							name: "" + i.data("name"),
// 							description: "" + i.data("description")
// 						};
// 						d(g)
// 					})
// 				} else {
// 					var c = twitterObj.currentUser;
// 					b.loggedInTwitterId = c.data("id");
// 					var a = {
// 						id: "" + c.data("id"),
// 						handle: "" + c.data("screen_name"),
// 						picture_url: "" + c.data("profile_image_url"),
// 						name: "" + c.data("name"),
// 						description: "" + c.data("description")
// 					};
// 					d(a)
// 				}
// 				break
// 		}
// 	},
// 	LoginUser: function(a) {},
// 	RegisterUser: function(b) {
// 		if (b.id != "undefined" && b.id != undefined) {
// 			var a = {};
// 			a.sParams = "";
// 			a.sParams += "social_id=" + b.id;
// 			a.sParams += "&social_handle=" + b.handle;
// 			a.sParams += "&picture_url=" + b.picture_url;
// 			a.sParams += "&name=" + b.name;
// 			a.sParams += "&description=" + b.description;
// 			a.sParams += "&social_network=" + this.userConfiguration.SocialNetwork;
// 			a.sParams += "&game_code=" + this.userConfiguration.GameCode;
// 			a.callback = b.callback;
// 			a.sURL = this.userConfiguration.SERVER_URL + "/TresensaSocialApp/RegisterUser", a.requestType = "POST";
// 			this.sendMessage(a, 1)
// 		} else {
// 			this.userConfiguration.ErrorHandler("social-network-error")
// 		}
// 	},
// 	SubmitScore: function(b) {
// 		if (b.id != "undefined" && b.id != undefined) {
// 			var a = {};
// 			a.sParams = "";
// 			a.sParams += "player_id=" + b.id;
// 			a.sParams += "&game_name=" + this.userConfiguration.GameCode;
// 			a.sParams += "&score=" + b.score;
// 			var c = document.location.href;
// 			a.sParams += "&challenge_id=" + b.challengeId;
// 			a.sParams += "&social_network=" + this.userConfiguration.SocialNetwork;
// 			a.sParams += "&game_code=" + this.userConfiguration.GameCode;
// 			a.sURL = this.userConfiguration.SERVER_URL + "/TresensaSocialApp/LeaderBoard", a.requestType = "POST";
// 			a.callback = b.callback;
// 			this.sendMessage(a)
// 		} else {
// 			this.userConfiguration.ErrorHandler("backend-error")
// 		}
// 	},
// 	GetLeaderboard: function(c) {
// 		if (c.id != "undefined" && c.id != undefined) {
// 			var a = {};
// 			var b = "player_id=" + c.id;
// 			b += "&game_name=" + this.userConfiguration.GameCode;
// 			b += "&list_type=" + c.list_type;
// 			b = b + "&social_network=" + this.userConfiguration.SocialNetwork + "&game_code=" + this.userConfiguration.GameCode + "&time_stamp_for_ie=" + (new Date().getTime());
// 			a.sURL = this.userConfiguration.SERVER_URL + "/TresensaSocialApp/LeaderBoard?" + b, a.requestType = "GET";
// 			a.callback = c.callback;
// 			this.sendMessage(a)
// 		} else {
// 			this.userConfiguration.ErrorHandler("backend-error")
// 		}
// 	},
// 	CreateChallenge: function(b) {
// 		if (b.challenger_social_id != "undefined" && b.challenger_social_id != undefined) {
// 			var a = {};
// 			a.sParams = "";
// 			a.sParams += "challenger_social_id=" + b.challenger_social_id;
// 			a.sParams += "&game_name=" + this.userConfiguration.GameCode;
// 			a.sParams += "&challenger_score=" + b.score;
// 			a.sParams += "&challengee_social_id=" + b.challengee_social_id;
// 			a.sParams += "&social_network=" + this.userConfiguration.SocialNetwork;
// 			a.sParams += "&game_code=" + this.userConfiguration.GameCode;
// 			a.sURL = this.userConfiguration.SERVER_URL + "/TresensaSocialApp/CreateChallenge", a.requestType = "POST";
// 			a.callback = b.callback;
// 			this.sendMessage(a)
// 		} else {
// 			this.userConfiguration.ErrorHandler("backend-error")
// 		}
// 	},
// 	updateLoginDetails: function(a) {
// 		for (var b = 0; b < this.loginDetails.length; b++) {
// 			if (this.loginDetails[b].social_network == this.userConfiguration.SocialNetwork) {
// 				this.loginDetails[b].id = a.player_id
// 			}
// 		}
// 	},
// 	AutoSubmitScore: function(b) {
// 		for (var c = 0; c < this.loginDetails.length; c++) {
// 			var a = {};
// 			if (this.loginDetails[c].id != "") {
// 				a.sParams = "";
// 				a.sParams += "player_id=" + this.loginDetails[c].id;
// 				a.sParams += "&game_name=" + this.userConfiguration.GameCode;
// 				a.sParams += "&score=" + b;
// 				a.sParams += "&challenge_id=-1";
// 				a.sParams += "&social_network=" + this.loginDetails[c].social_network;
// 				a.sParams += "&game_code=" + this.userConfiguration.GameCode;
// 				a.sURL = this.userConfiguration.SERVER_URL + "/TresensaSocialApp/LeaderBoard", a.requestType = "POST";
// 				a.callback = function() {};
// 				this.sendMessage(a)
// 			}
// 		}
// 	},
// 	UpdateConfig: function(a) {
// 		this.userConfiguration.ErrorHandler = a.ErrorHandler, this.userConfiguration.SocialNetwork = String(a.SocialNetwork).toLowerCase()
// 	},
// 	sendMessage: function(d, c) {
// 		var f;
// 		var g = this;
// 		var b = d;
// 		var a = c;
// 		if (window.XDomainRequest) {
// 			this.xdr = new XDomainRequest();
// 			if (this.xdr) {
// 				this.xdr.onerror = this.err.bind(this);
// 				this.xdr.ontimeout = this.timeo.bind(this);
// 				this.xdr.onprogress = this.progres.bind(this);
// 				this.xdr.onload = function() {
// 					var e = g.xdr.responseText;
// 					var i = JSON.parse(e);
// 					if (i.Error == undefined && i.Error == null) {
// 						b.callback(i);
// 						if (a != undefined) {
// 							g.updateLoginDetails(i)
// 						}
// 					} else {
// 						g.userConfiguration.ErrorHandler("backend-error")
// 					}
// 				};
// 				this.xdr.timeout = "2000";
// 				this.xdr.open(b.requestType, b.sURL + "?" + b.sParams);
// 				this.xdr.send()
// 			} else {
// 				this.userConfiguration.ErrorHandler("backend-error")
// 			}
// 		} else {
// 			if (window.XMLHttpRequest) {
// 				f = new XMLHttpRequest()
// 			} else {
// 				f = new ActiveXObject("Microsoft.XMLHTTP")
// 			}
// 			try {
// 				f.onreadystatechange = function() {
// 					if (f.readyState == 4) {
// 						if (f.status != 200) {
// 							g.userConfiguration.ErrorHandler("backend-error")
// 						} else {
// 							if (d.callback != null) {
// 								var e = JSON.parse(f.responseText);
// 								if (e.Error == undefined && e.Error == null) {
// 									d.callback(e);
// 									if (a != undefined) {
// 										g.updateLoginDetails(e)
// 									}
// 								} else {
// 									g.userConfiguration.ErrorHandler("backend-error")
// 								}
// 							}
// 						}
// 					}
// 				}
// 			} catch (h) {
// 				this.userConfiguration.ErrorHandler("backend-error")
// 			}
// 			try {
// 				f.open(d.requestType, d.sURL, true);
// 				f.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 				f.send(d.sParams)
// 			} catch (h) {
// 				this.userConfiguration.ErrorHandler("backend-error")
// 			}
// 		}
// 	},
// 	err: function() {
// 		this.userConfiguration.ErrorHandler("backend-error")
// 	},
// 	timeo: function() {
// 		this.userConfiguration.ErrorHandler("backend-error")
// 	},
// 	progres: function() {},
// 	stopdata: function() {
// 		this.abort()
// 	},
// 	showFriendDiv: function(a, e, b, d) {
// 		this.socialnetwork = d;
// 		this.userDtls = b;
// 		var c;
// 		this.fbIds = new Array();
// 		if (!document.getElementById("tresensa_friendListDivParent")) {
// 			mydivParent = document.createElement("div");
// 			mydivParent.setAttribute("id", "tresensa_friendListDivParent");
// 			mydivParent.setAttribute("class", "tresensa_friendListDivStyleParent");
// 			c = document.createElement("div");
// 			c.setAttribute("id", "tresensa_friendListDiv");
// 			c.setAttribute("class", "tresensa_friendListDivStyle");
// 			c.setAttribute("style", "display:block;");
// 			mydivParent.appendChild(c);
// 			a.appendChild(mydivParent)
// 		} else {
// 			c = document.getElementById("tresensa_friendListDivParent");
// 			c.style.display = "block";
// 			mydivParent.removeChild(document.getElementById("doneButtonObject"))
// 		}
// 		document.getElementById("tresensa_friendListDiv").innerHTML = "";
// 		if (this.socialnetwork == "facebook") {
// 			this.getFBFriends(e)
// 		} else {
// 			if (this.socialnetwork == "twitter") {
// 				this.getTwitterFriends(e)
// 			}
// 		}
// 	},
// 	hideFriendDiv: function() {
// 		mydiv = document.getElementById("tresensa_friendListDivParent");
// 		mydiv.style.display = "none"
// 	},
// 	getSelectedUsers: function() {
// 		return this.fbIds
// 	},
// 	setUnsetValues: function(b) {
// 		var c = {};
// 		c.id = b.value;
// 		c.name = b.name;
// 		if (b.checked) {
// 			this.fbIds.push(c)
// 		} else {
// 			var a = this.fbIds.indexOf(c);
// 			this.fbIds.splice(a, 1)
// 		}
// 	},
// 	setCheckBoxClickHandler: function() {},
// 	formatResultTable: function(c, a) {
// 		var d = '<td style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:5px;">';
// 		d += "<table cellpadding='0' cellspacing='0'>";
// 		d += '<tr><td colspan=2><span class="tresensa_friendNamespanStyle">' + a[c].name + "</span></td></tr>";
// 		if (this.socialnetwork == "twitter") {
// 			d += '<tr><td width="20px"><input name=' + a[c].id + " id='checkbox" + a[c].screenname + "' type='checkbox' value=" + a[c].screenname + '></input></td><td><img  class="pictureStyle" src=' + a[c].picture + "></td></tr>"
// 		} else {
// 			d += '<tr><td width="20px"><input id=\'checkbox' + a[c].id + "' type='checkbox' value=" + a[c].id + '></input></td><td><img  class="pictureStyle" src=' + a[c].picture + "></td></tr>"
// 		}
// 		d += "</table>";
// 		d += "</td>";
// 		var b = this;
// 		return d
// 	},
// 	displayUsers: function(f, e) {
// 		if (e == "facebook") {
// 			var g = this.FBFriendsObjectArray
// 		} else {
// 			if (e == "twitter") {
// 				var g = this.TwitterFriendsObjectArray
// 			}
// 		}
// 		var b = document.getElementById("tresensa_friendListDivParent");
// 		var k = document.getElementById("tresensa_friendListDiv");
// 		b.style.display = "block";
// 		k.style.display = "block";
// 		var a = "<table border='0' cellpadding='0' cellspacing='0'>";
// 		var o = g.length;
// 		for (var l = 0; l < o; l++) {
// 			a += "<tr>";
// 			a += this.formatResultTable(l, g);
// 			for (var m = 0; m < f - 1; m++) {
// 				if (l < o - 1) {
// 					l++;
// 					a += this.formatResultTable(l, g)
// 				}
// 			}
// 			a += "</tr>"
// 		}
// 		a += "</table>";
// 		k.innerHTML = a;
// 		b.innerHTML += "<div style=\"padding-top:20px\" id='multiChallengeText'></div>";
// 		b.innerHTML += "<div id='doneButtonObject' style='text-align:center; padding:10px'><input type='button' value='done'/><div>";
// 		var n = this;
// 		for (var h = 0; h < o; h++) {
// 			var d;
// 			if (n.socialnetwork == "twitter") {
// 				d = "checkbox" + g[h].screenname
// 			} else {
// 				d = "checkbox" + g[h].id
// 			}
// 			var c = document.getElementById(d);
// 			c.onclick = function() {
// 				n.setUnsetValues(this)
// 			}
// 		}
// 		document.getElementById("doneButtonObject").onclick = function() {
// 			for (var p = 0; p < n.fbIds.length; p++) {
// 				var j = {};
// 				j.challenger_social_id = n.userDtls.id;
// 				j.score = n.userDtls.score;
// 				if (n.socialnetwork == "twitter") {
// 					j.challengee_social_id = n.fbIds[p].name;
// 					j.screen_name = n.fbIds[p].id
// 				} else {
// 					j.challengee_social_id = n.fbIds[p].id;
// 					j.screen_name = n.fbIds[p].id
// 				}
// 				n.createAndPostChallenge(j)
// 			}
// 			n.hideFriendDiv()
// 		};
// 		document.getElementById("multiChallengeText").innerHTML = "i just scored " + this.userDtls.score + " playing the tresensa paddle game see if you can beat my score."
// 	},
// 	getFBFriends: function(a) {
// 		var b = this;
// 		if (b.FBFriendsObjectArray.length == 0) {
// 			parent.FB.api("/me/friends?fields=id,name,picture", function(d) {
// 				for (var e = 0; e < d.data.length; e++) {
// 					var c = {};
// 					c.id = d.data[e].id;
// 					c.name = d.data[e].name;
// 					c.picture = d.data[e].picture.data.url;
// 					b.FBFriendsObjectArray.push(c)
// 				}
// 				b.displayUsers(a, "facebook")
// 			})
// 		} else {
// 			b.displayUsers(a, "facebook")
// 		}
// 	},
// 	getTwitterFriends: function(b) {
// 		var a = this;
// 		if (a.TwitterFriendsObjectArray.length == 0) {
// 			a.TwitterFriendsObjectArray = new Array();
// 			$.getJSON("http://api.twitter.com/1/friends/ids.json?cursor=-1&id=" + a.loggedInTwitterId + "&callback=?", function(e) {
// 				var c = new Array();
// 				c = e.ids;
// 				a.twitterIds = a.splitArray(c, 100);
// 				for (var d = 0; d < a.twitterIds.length; d++) {
// 					$.getJSON("https://api.twitter.com/1/users/lookup.json?user_id=" + a.twitterIds[d].toString() + "&callback=?", function(g) {
// 						for (var f = 0; f < g.length; f++) {
// 							var h = {};
// 							h.id = g[f].id;
// 							h.name = g[f].name;
// 							h.picture = g[f].profile_image_url;
// 							h.screenname = g[f].screen_name;
// 							a.TwitterFriendsObjectArray.push(h)
// 						}
// 						a.displayUsers(b, "twitter")
// 					})
// 				}
// 			})
// 		} else {
// 			a.displayUsers(b, "twitter")
// 		}
// 	},
// 	splitArray: function(a, c) {
// 		var b = a;
// 		return [].concat.apply([], b.map(function(e, d) {
// 			return d % c ? [] : [b.slice(d, d + c)]
// 		}))
// 	},
// 	createAndPostChallenge: function(b) {
// 		if (b.challenger_social_id != "undefined") {
// 			var a = {};
// 			a.sParams = "";
// 			a.sParams += "challenger_social_id=" + b.challenger_social_id;
// 			a.sParams += "&game_name=" + this.userConfiguration.GameCode;
// 			a.sParams += "&challenger_score=" + b.score;
// 			a.sParams += "&challengee_social_id=" + b.challengee_social_id;
// 			a.sParams += "&social_network=" + this.userConfiguration.SocialNetwork;
// 			a.sParams += "&game_code=" + this.userConfiguration.GameCode;
// 			a.sURL = this.userConfiguration.SERVER_URL + "/TresensaSocialApp/CreateChallenge", a.requestType = "POST";
// 			a.callback = this.challengePostRcvd.bind(this, b.challengee_social_id, b.score, b.screen_name);
// 			this.sendMessage(a)
// 		} else {
// 			this.userConfiguration.ErrorHandler()
// 		}
// 	},
// 	challengePostRcvd: function(b, f, c, a) {
// 		console.log("screenname   " + c);
// 		var e = a.challengeId;
// 		if (this.socialnetwork == "facebook") {
// 			var d = {};
// 			d.description = "i just scored " + f + " playing the tresensa paddle game see if you can beat my score.";
// 			d.link = this.userConfiguration.APP_URL + "?c=" + f;
// 			d.picture = "http://www.tresensa.com/wordpress/wp-content/themes/tresensa/images/logo_140.png";
// 			d.caption = "Paddle Game";
// 			FB.api("/" + b + "/feed", "POST", d, function(g) {})
// 		} else {
// 			if (this.socialnetwork == "twitter") {
// 				twitterObj.Status.update("@" + c + " i just scored " + f + " playing the tresensa paddle game see if you can beat my score.\n" + this.userConfiguration.APP_URL + "?c=" + f)
// 			}
// 		}
// 	}
// };

function trace(a) {}
function FacebookBoardUI() {
	this.objSocial = null;
	this.userDetails = {};
	this.arrProfile = new Array();
	this.bRegistered = false;
	this.gameOverInstance = null;
	this.leaderboardType = 1
}
FacebookBoardUI.prototype.init = function(d) {
	trace(" FacebookBoardUI - init ");
	var c = document.getElementById("lb_rest");
	while (c.hasChildNodes()) {
		c.removeChild(c.lastChild)
	}
	document.getElementById("self_UserName").innerHTML = "<font color='white'size='4px' > Loading Data... </font>";
	document.getElementById("single_profile").style.display = "none";
	trace(" FacebookBoardUI - init--2 ");
	this.gameOverInstance = d;
	if (QueryString.error == undefined) {
		var b = {};
		b.SocialNetwork = "facebook";
		b.ErrorHandler = this.errorHandler.bind(this);
		this.objSocial = this.gameOverInstance.mSocialLB;
		this.objSocial.UpdateConfig(b);
		this.objSocial.GetUserDetails(this.userLoggedInCallBack.bind(this));
		var a = (new GameLeaderboardConfig()).getLeaderboardConfig();
		_gaq.push(["_trackPageview", "/" + a.GameCode + "/zuckerboard"])
	} else {
		this.errorHandler()
	}
};
FacebookBoardUI.prototype.errorHandler = function(a) {
	this.gameOverInstance.bClickAllowed = true;
	if (a == "backend-error") {
		this.gameOverInstance.showAllLeaderboardContent();
		document.getElementById("leaderboard_only_user").innerHTML = "<font color='black'size='4px' > Leaderboard Currently Unavailable </font>";
		this.showFooter()
	}
};
FacebookBoardUI.prototype.userLoggedInCallBack = function(b) {
	trace(" [userLoggedInCallBack] " + b);
	if (b != null) {
		this.userDetails = {};
		var a = {
			id: "" + b.id,
			handle: "" + b.name,
			picture_url: "" + b.picture_url,
			name: "" + b.name,
			description: "",
			callback: this.onRegisterCallBack.bind(this)
		};
		this.gameOverInstance.bFacebookRegistered = true;
		trace("Facebook Data    " + JSON.stringify(b));
		this.userDetails = a;
		this.objSocial.RegisterUser(a)
	} else {
		if (!this.gameOverInstance.bFacebookRegistered) {
			this.objSocial.LoginUser(this.gameOverInstance.getScore().toString() + "-" + this.gameOverInstance.getSessionBestScore() + "-" + this.leaderboardType)
		} else {
			this.userDetails.callback = this.onRegisterCallBack.bind(this);
			this.objSocial.RegisterUser(this.userDetails)
		}
	}
};
FacebookBoardUI.prototype.onRegisterCallBack = function(a) {
	trace(" [ onRegisterCallBack ] :: " + a.player_id);
	this.gameOverInstance.bRegistered = true;
	this.userDetails.player_id = a.player_id;
	this.submitScore()
};
FacebookBoardUI.prototype.submitScore = function() {
	trace(" [ submitScore ] :: ");
	this.userDetails.score = this.gameOverInstance.getScore().toString();
	var a = {
		id: this.userDetails.player_id,
		name: "",
		score: this.userDetails.score,
		challengeId: (!QueryString.c ? -1 : QueryString.c),
		callback: this.onSubmitScoreCallback.bind(this)
	};
	this.objSocial.SubmitScore(a)
};
FacebookBoardUI.prototype.onSubmitScoreCallback = function() {
	trace("Score Submitted now fetching LB");
	var a = {
		id: this.userDetails.player_id,
		callback: this.onLBDataRcvd.bind(this),
		list_type: "weekly"
	};
	this.objSocial.GetLeaderboard(a)
};
FacebookBoardUI.prototype.onLBDataRcvd = function(h) {
	trace(" onLBDataRcvd ");
	trace(h);
	this.gameOverInstance.showAllLeaderboardContent();
	this.gameOverInstance.bClickAllowed = true;
	this.showFooter();
	if (h != null) {
		document.getElementById("single_profile").style.display = "none";
		var f = "";
		var a = h;
		document.getElementById("self_Score").innerHTML = "" + a[0].score;
		document.getElementById("self_Pic").innerHTML = '<img src="' + a[0].pictureURL + '" style="height: 100%;">';
		document.getElementById("self_UserName").innerHTML = '<p><span class="cellUserName">' + a[0].userName + '</span><br><span class="cellUserScore">score:' + a[0].score + "</span></p>";
		var g = document.getElementById("lb_rest");
		while (g.hasChildNodes()) {
			g.removeChild(g.lastChild)
		}
		for (var e = 1; e < a.length; e++) {
			var d = document.createElement("tr");
			d.setAttribute("id", "row_" + e);
			d.setAttribute("valign", "top");
			var c = document.createElement("td");
			var b = '<div class="cellContainer">';
			b += '<div class="cellScore">';
			b += "" + e;
			b += "</div>";
			b += '<div class="cellPicContainer">';
			b += '<img src="' + a[e].pictureURL + '" style="width:100%;height:100%; " >';
			b += "</div>";
			b += '<div class="cellUserNameContainer">';
			b += '	<span class="cellUserName">' + a[e].userName + "</span>";
			b += "<br>";
			b += '<span class="cellUserScore">score:' + a[e].score + "</span>";
			b += "</div>";
			b += "</div>";
			c.innerHTML = b;
			d.appendChild(c);
			document.getElementById("lb_rest").appendChild(d);
			if (this.userDetails.handle != a[e].userName) {} else {
				document.getElementById("self_Score").innerHTML = "" + e
			}
		}
		document.getElementById("leaderboard_rest").style.display = "block";
		if (this.gameOverInstance.myScroll1 != null) {
			this.gameOverInstance.myScroll1.refresh()
		}
		this.arrProfile = a
	}
};
FacebookBoardUI.prototype.showFooter = function() {
	document.getElementById("FooterElement").innerHTML = "";
	var b = "";
	b += '<div id="facebookInvite" class="cellfacebookIconContainer">';
	b += '<img src="images/lb-images/facebook_invite_icon.png" class="cellfacebookIcon">';
	b += "</div>";
	b += '<div id="facebookIcon" class="cellfacebookIconContainer"></div>';
	b += '<div id="playAgainIcon" class="cellPlayAgainContainer">';
	b += '<img src="images/lb-images/play_button.png"  >';
	b += "</div>";
	document.getElementById("FooterElement").innerHTML = b;
	var a = this;
	document.getElementById("playAgainIcon").onclick = function() {
		if (a.gameOverInstance.bClickAllowed) {
			a.gameOverInstance.bTryAgain = true;
			a.gameOverInstance.playAgain()
		}
	};
	document.getElementById("facebookInvite").onclick = function() {
		var c = a.gameOverInstance.mFacebookConfig.CHALLENGE_MESSAGE;
		c = c.replace("####", a.gameOverInstance.getScore());
		var d = "popup";
		if (TGE.BrowserDetect.platform !== "Windows" && TGE.BrowserDetect.platform !== "Mac") {
			d = "touch"
		}
		_gaq.push(["_trackSocial", "facebook", "request dialog"]);
		FB.ui({
			show_error: true,
			display: d,
			method: "apprequests",
			title: a.gameOverInstance.mFacebookConfig.CAPTION,
			message: c
		}, function(e) {
			if (e) {
				_gaq.push(["_trackSocial", "facebook", "request sent"])
			}
		})
	}
};
FacebookBoardUI.prototype.profileClicked = function(a) {
	this.userDetails.opponentId = this.arrProfile[a].facebookId;
	this.createChallenge()
};
FacebookBoardUI.prototype.createChallenge = function() {
	trace("profileClicked : createChallenge");
	var a = {
		challenger_social_id: this.userDetails.id,
		name: "",
		score: this.userDetails.score,
		challengee_social_id: this.userDetails.opponentId,
		callback: this.createChallengeResponseRcvd.bind(this)
	};
	this.objSocial.CreateChallenge(a)
};
FacebookBoardUI.prototype.createChallengeResponseRcvd = function(d) {
	this.userDetails.challengeId = d.challengeId;
	document.getElementById("challenge-box").style.display = "block";
	var b = this.gameOverInstance.mFacebookConfig.CHALLENGE_MESSAGE;
	b = b.replace(this.gameOverInstance.getMacroSubstitution("score"), this.userDetails.score);
	var c = '<h1> SEND A CHALLENGE </h1><textarea id="publishText" cols="45" rows="15" wrap="hard" >' + b + '</textarea><br><button id="sendChallenge" class="btn_fb" > Publish </button></div>';
	document.getElementById("challengeBoxContent").innerHTML = c;
	var a = this;
	document.getElementById("sendChallenge").onclick = function() {
		var f = {};
		f.description = document.getElementById("publishText").value;
		f.link = a.gameOverInstance.mGameConfig.APP_URL + "/index.html?c=" + a.userDetails.challengeId;
		f.picture = a.gameOverInstance.mFacebookConfig.APP_IMAGE;
		f.caption = a.gameOverInstance.mFacebookConfig.CAPTION;
		var e = a.userDetails.opponentId;
		FB.api("/" + e + "/feed", "POST", f, function(g) {
			trace("Challenge Response :  " + JSON.stringify(g));
			document.getElementById("challenge-box").style.display = "none"
		})
	}
};

function TweeterBoardUI() {
	this.objSocial = null;
	this.userDetails = {
		"null": "no-data"
	};
	this.arrProfile = new Array();
	this.bRegistered = false;
	this.gameOverInstance = null;
	this.leaderboardType = 2
}
TweeterBoardUI.prototype.init = function(e) {
	trace(" TweeterBoardUI - init ");
	var c = document.getElementById("lb_rest");
	while (c.hasChildNodes()) {
		c.removeChild(c.lastChild)
	}
	var d = document.createElement("div");
	c.appendChild(d);
	document.getElementById("self_UserName").innerHTML = "<font color='white'size='4px' > Loading Data... </font>";
	this.gameOverInstance = e;
	var b = {};
	b.SocialNetwork = "twitter";
	b.ErrorHandler = this.errorHandler.bind(this);
	this.objSocial = this.gameOverInstance.mSocialLB;
	this.objSocial.UpdateConfig(b);
	this.objSocial.GetUserDetails(this.userLoggedInCallBack.bind(this));
	var a = (new GameLeaderboardConfig()).getLeaderboardConfig();
	_gaq.push(["_trackPageview", "/" + a.GameCode + "/tweeterboard"])
};
TweeterBoardUI.prototype.errorHandler = function(a) {
	this.gameOverInstance.bClickAllowed = true;
	if (a == "backend-error") {
		this.gameOverInstance.showAllLeaderboardContent();
		document.getElementById("leaderboard_only_user").innerHTML = "<font color='black'size='4px' > Leaderboard Currently Unavailable </font>";
		this.showFooter()
	}
};
TweeterBoardUI.prototype.userLoggedInCallBack = function(b) {
	trace(" [userLoggedInCallBack] " + b);
	if (b != null) {
		this.userDetails = {
			"null": "no-data"
		};
		var a = {
			id: "" + b.id,
			handle: "" + b.handle,
			picture_url: "" + b.picture_url,
			name: "" + b.name,
			description: "" + b.description,
			callback: this.onRegisterCallBack.bind(this)
		};
		this.gameOverInstance.bTwitterRegistered = true;
		trace("Twitter Data    " + JSON.stringify(b));
		this.userDetails = a;
		this.objSocial.RegisterUser(a)
	} else {
		trace("Twitter Data    " + JSON.stringify(this.userDetails));
		if (!this.gameOverInstance.bTwitterRegistered) {
			trace(" login the user - ");
			this.objSocial.LoginUser(this.gameOverInstance.getScore().toString() + "-" + this.gameOverInstance.getSessionBestScore() + "-" + this.leaderboardType)
		} else {
			trace(" direct to register the user - ");
			this.userDetails.callback = this.onRegisterCallBack.bind(this);
			this.objSocial.RegisterUser(this.userDetails)
		}
	}
};
TweeterBoardUI.prototype.onRegisterCallBack = function(a) {
	trace(" [ onRegisterCallBack ] :: " + a.player_id);
	this.gameOverInstance.bRegistered = true;
	this.userDetails.player_id = a.player_id;
	this.submitScore()
};
TweeterBoardUI.prototype.submitScore = function() {
	trace(" [ submitScore ] :: ");
	this.userDetails.score = this.gameOverInstance.getScore().toString();
	var a = {
		id: this.userDetails.player_id,
		name: "",
		score: this.userDetails.score,
		challengeId: (!QueryString.c ? -1 : QueryString.c),
		callback: this.onSubmitScoreCallback.bind(this)
	};
	this.objSocial.SubmitScore(a)
};
TweeterBoardUI.prototype.onSubmitScoreCallback = function() {
	trace("Score Submitted now fetching LB");
	var a = {
		id: this.userDetails.player_id,
		callback: this.onLBDataRcvd.bind(this),
		list_type: "weekly"
	};
	this.objSocial.GetLeaderboard(a)
};
TweeterBoardUI.prototype.onLBDataRcvd = function(h) {
	trace(" onLBDataRcvd ");
	trace(h);
	this.gameOverInstance.showAllLeaderboardContent();
	this.gameOverInstance.bClickAllowed = true;
	if (h != null) {
		var a = h;
		document.getElementById("single_profile").style.display = "none";
		document.getElementById("self_Score").innerHTML = "" + a[0].score;
		document.getElementById("self_Pic").innerHTML = '<img src="' + a[0].pictureURL + '" style="height: 100%;">';
		document.getElementById("self_UserName").innerHTML = '<p><span class="cellUserName">@' + a[0].screenName + '</span><br><span class="cellUserScore">score:' + a[0].score + "</span></p>";
		var f = "";
		f = "";
		var g = document.getElementById("lb_rest");
		while (g.hasChildNodes()) {
			g.removeChild(g.lastChild)
		}
		for (var e = 1; e < a.length; e++) {
			var d = document.createElement("tr");
			d.setAttribute("id", "row_" + e);
			d.setAttribute("valign", "top");
			var c = document.createElement("td");
			var b = '<div class="cellContainer">';
			b += '<div class="cellScore">';
			b += "" + e;
			b += "</div>";
			b += '<div class="cellPicContainer">';
			b += '<img src="' + a[e].pictureURL + '" style="width:100%;height:100%; " >';
			b += "</div>";
			b += '<div class="cellUserNameContainer">';
			b += '	<span class="cellUserName">@' + a[e].screenName + "</span>";
			b += "<br>";
			b += '<span class="cellUserScore">score:' + a[e].score + "</span>";
			b += "</div>";
			b += "</div>";
			c.innerHTML = b;
			d.appendChild(c);
			document.getElementById("lb_rest").appendChild(d);
			if (this.userDetails.handle != a[e].screenName) {
				document.getElementById("row_" + e).onclick = (function(i, j) {
					return function() {
						j.profileClicked(i)
					}
				})(e, this)
			} else {
				document.getElementById("self_Score").innerHTML = "" + e
			}
		}
		document.getElementById("leaderboard_rest").style.display = "block";
		if (this.gameOverInstance.myScroll1 != null) {
			this.gameOverInstance.myScroll1.refresh()
		}
		this.arrProfile = a;
		this.showFooter()
	}
};
TweeterBoardUI.prototype.profileClicked = function(a) {
	trace("profileClicked " + a);
	var b = this.arrProfile[a].screenName;
	this.userDetails.opponentId = this.arrProfile[a].twitterId;
	this.FetchSocialDetail(this.profileDataFetched.bind(this), b)
};
TweeterBoardUI.prototype.profileDataFetched = function(c) {
	document.getElementById("leaderboard").style.display = "block";
	document.getElementById("single_profile").style.display = "block";
	document.getElementById("FooterElement").style.display = "block";
	this.userDetails.opponent_screen_name = c.screen_name;
	document.getElementById("twitterSingleProfileHandle").innerHTML = "@" + c.screen_name;
	document.getElementById("twitterSingleProfilePic").innerHTML = '<img src="' + c.profile_image_url + '" style="width: 100%;height: 100%;" class="twitterProfilePic"  >';
	document.getElementById("tweetsData").innerHTML = "" + c.statuses_count;
	document.getElementById("followersData").innerHTML = "" + c.followers_count;
	document.getElementById("followingData").innerHTML = "" + c.friends_count;
	var a = this.gameOverInstance.mTwitterConfig.CHALLENGE_MESSAGE;
	a = a.replace(this.gameOverInstance.getMacroSubstitution("screen_name"), this.userDetails.opponent_screen_name);
	a = a.replace(this.gameOverInstance.getMacroSubstitution("score"), this.userDetails.score);
	a = a + "" + this.gameOverInstance.mGameConfig.APP_URL;
	document.getElementById("previewTweetContainer").innerHTML = "Challenge Tweet preview : <br/>" + a;
	document.getElementById("closeButton").onclick = function() {
		document.getElementById("leaderboard").style.display = "block";
		document.getElementById("single_profile").style.display = "none";
		document.getElementById("FooterElement").style.display = "block"
	};
	var b = this;
	document.getElementById("twitterSingleProfileChallenge").onclick = function() {
		var d = {
			challenger_social_id: b.userDetails.id,
			name: "",
			score: b.userDetails.score,
			challengee_social_id: b.userDetails.opponentId,
			callback: b.createChallengeResponseRcvd.bind(b)
		};
		b.objSocial.CreateChallenge(d)
	}
};
TweeterBoardUI.prototype.createChallengeResponseRcvd = function(b) {
	document.getElementById("challenge-box").style.display = "block";
	document.getElementById("challengeBoxContent").innerHTML = "";
	var a = this.gameOverInstance.mTwitterConfig.CHALLENGE_MESSAGE;
	a = a.replace(this.gameOverInstance.getMacroSubstitution("screen_name"), this.userDetails.opponent_screen_name);
	a = a.replace(this.gameOverInstance.getMacroSubstitution("score"), this.userDetails.score);
	a = a + "" + this.gameOverInstance.mGameConfig.APP_URL + "?c=" + b.challengeId;
	twttr.anywhere(function(c) {
		c("#challengeBoxContent").tweetBox({
			height: 600,
			width: 500,
			label: "<h1> TWEET A CHALLENGE </h1>",
			defaultContent: "" + a,
			onTweet: function(e, d) {
				document.getElementById("single_profile").style.display = "none";
				document.getElementById("challenge-box").style.display = "none"
			}
		})
	})
};
TweeterBoardUI.prototype.showFooter = function() {
	document.getElementById("FooterElement").innerHTML = "";
	var b = "";
	b += '<div id="textContent" class="cellShareText">';
	b += "Share your score";
	b += "</div>";
	b += '<div id="twitterIcon" class="celltwitterIconContainer">';
	b += '<img src="' + document.getElementById("twIcon_lb").src + '" class="celltwitterIcon">';
	b += "</div>";
	b += '<div id="playAgainIcon" class="cellPlayAgainContainer">';
	b += '<img src="' + document.getElementById("playBtn_lb").src + '"  >';
	b += "</div>";
	document.getElementById("FooterElement").innerHTML = b;
	document.getElementById("closeButton").innerHTML = '<img src="' + this.gameOverInstance.getLBImagesPath() + 'lb-images/close_button.png" class="celltwitterIcon">';
	document.getElementById("twitterSingleProfileChallenge").innerHTML = '<img src="' + this.gameOverInstance.getLBImagesPath() + 'lb-images/challenge_button.png" class="celltwitterIcon">';
	var a = this;
	document.getElementById("playAgainIcon").onclick = function() {
		if (a.gameOverInstance.bClickAllowed) {
			a.gameOverInstance.bTryAgain = true;
			a.gameOverInstance.playAgain()
		}
	};
	document.getElementById("twitterIcon").onclick = function() {
		a.gameOverInstance.twitterShareScore()
	}
};
TweeterBoardUI.prototype.FetchSocialDetail = function(a, b) {
	$.getJSON("http://api.twitter.com/1/users/show.json?callback=?&screen_name=" + b, function(c) {
		a(c)
	})
};

function LeaderBoardWidget(a) {
	this.mTweeterUI = null;
	this.mFacebookUI = null;
	this.bTwitterRegistered = false;
	this.bFacebookRegistered = false;
	this.mGameConfig = {};
	this.mFacebookConfig = {};
	this.mTwitterConfig = {};
	this.bTryAgain = false;
	this.LEADERBOARD_DIV_NAME = a;
	this.myScroll1 = null;
	this.mSocialLB = null;
	this.init();
	this.setUp();
	this.bClickAllowed = false;
	return this
}
LeaderBoardWidget.prototype = {
	init: function() {
		document.getElementById(this.LEADERBOARD_DIV_NAME).style.display = "none";
		var a = '<div id="challenge-box" class="facebookChallenge">';
		a += '<div id="disableScreenForFBChallenge"></div>';
		a += '<div id="challengeBoxContent"></div>';
		a += "</div>";
		a += '<div id="single_profile" class="twitterSingleProfile" >';
		a += '<div class="twitterProfileOpacityBG"></div>';
		a += '<div class="twitterProfileBG"></div>';
		a += '<div class="twitterProfileMainWrapper">';
		a += '<div class="twitterProfileContainer">';
		a += '<div id="closeButton" class="twitterProfileCloseButton">';
		a += "close";
		a += "</div>";
		a += '<div id="twitterSingleProfileHandle" class="twitterProfileNameContainer">';
		a += "	@HandleName";
		a += "</div>";
		a += '<div  class ="twitterPicAndStatsConatiner">';
		a += '<div id="twitterSingleProfilePic" class="twitterProfilePicContainer">';
		a += '<img src="http://a0.twimg.com/profile_images/258323784/DSC00323_bigger.JPG" class="twitterProfilePic">';
		a += "</div>";
		a += '<div class="twitterProfileStatsContainer">';
		a += '<div class="twitterStatsLeft">';
		a += '<div id="tweetsData" class="twitterValue">';
		a += "206";
		a += "</div>";
		a += '<div class="twitterCategory">';
		a += "Tweets";
		a += "</div>";
		a += "</div>";
		a += '<div class="twitterStatsMiddle">';
		a += '<div id ="followersData" class="twitterValue">';
		a += "206";
		a += "</div>";
		a += '<div  class="twitterCategory">';
		a += "Followers";
		a += "</div>";
		a += "</div>";
		a += '<div class="twitterStatsRight">';
		a += '<div id="followingData" class="twitterValue">';
		a += "206";
		a += "</div>";
		a += '<div class="twitterCategory">';
		a += "Following";
		a += "</div>";
		a += "</div>";
		a += "</div>";
		a += "</div>";
		a += '<div id= "previewTweetContainer" class="twitterTweetContainer">';
		a += "Content would be what i said the most so no Content would be what i said the most so noContent would be what i said the most so noContent would be what i said the most so no";
		a += "</div>";
		a += '<div id="twitterSingleProfileChallenge"  class="twitterChallengeButton">';
		a += "</div>";
		a += "</div>";
		a += "</div>";
		a += "</div>";
		a += '<div id="leaderboard" class="main_container" style="display: block; ">';
		a += '<div id="leaderboard_only_user" >';
		a += '<div class="leaderboardLabel">';
		a += "YOUR RANKING THIS WEEK";
		a += "</div>";
		a += '<div class="cellContainer_self">';
		a += '<div id="self_Score" class="cellScore">';
		a += "</div>";
		a += '<div id="self_Pic" class="cellPicContainer">';
		a += "</div>";
		a += '<div id="self_UserName"  class="cellUserNameContainer">';
		a += "</div>";
		a += '<div style="clear: both;"></div>';
		a += "</div>";
		a += "</div>";
		a += '<div id="FooterElement" class="cellShareAndPlayAgainContainer">';
		a += "</div>";
		a += '<div id="weeklyLB" class="weeklyLeaderLabel">WEEKLY LEADERS</div>';
		a += '<div id="leaderboard_rest"  class="weeklyLeaderContainer">';
		a += '<table id="lb_rest" class="lb_rest_table_css" cellpadding="5" >';
		a += "</table>";
		a += "</div>";
		a += "</div>";
		document.getElementById(this.LEADERBOARD_DIV_NAME).innerHTML = a;
		document.getElementById("leaderboard_rest").style.display = "block";
		this.myScroll1 = new iScroll("leaderboard_rest");
		document.getElementById("leaderboard").style.display = "none"
	},
	setUp: function() {
		var a = (new GameLeaderboardConfig()).getLeaderboardConfig();
		if (a.WidgetHeight != undefined && a.WidgetHeight != 0) {
			document.getElementById(this.LEADERBOARD_DIV_NAME).style.height = a.WidgetHeight
		}
		a.SocialNetwork = "facebook";
		this.mSocialLB = new TresensaSocialLeaderBoard(a);
		this.mTweeterUI = new TweeterBoardUI();
		this.mFacebookUI = new FacebookBoardUI();
		var b = Number(String(QueryString.data).split("-")[2]);
		if (b == 1) {
			this.bFacebookRegistered = true
		} else {
			if (b == 2) {
				this.bTwitterRegistered = true
			}
		}
	},
	showFooter: function() {
		document.getElementById("FooterElement").innerHTML = "";
		var a = "";
		a += '<div id="textContent" class="cellShareText">';
		a += "Share your score";
		a += "</div>";
		a += '<div id="facebookIcon" class="cellfacebookIconContainer">';
		a += '<img src="' + this.getLBImagesPath() + 'lb-images/facebook_icon.jpg" class="cellfacebookIcon">';
		a += "</div>";
		a += '<div id="playAgainIcon" class="cellPlayAgainContainer">';
		a += '<img src="' + this.getLBImagesPath() + 'lb-images/play_button.jpg"  >';
		a += "</div>";
		document.getElementById("FooterElement").innerHTML = a
	},
	ShowLeaderboard: function(a) {
		this.mGameConfig = a.GAME;
		this.mFacebookConfig = a.FACEBOOK;
		this.mTwitterConfig = a.TWITTER;
		switch (this.mGameConfig.LB_TYPE) {
			case "facebook":
				this.mFacebookUI.init(this);
				break;
			case "twitter":
				this.mTweeterUI.init(this);
				break;
			default:
				this.showTheRedirectedLB();
				break
		}
	},
	AutomaticScoreSubmission: function(a) {
		// this.mSocialLB.AutoSubmitScore(a)
	},
	showAllLeaderboardContent: function() {
		// document.getElementById(this.LEADERBOARD_DIV_NAME).style.display = "block";
		// document.getElementById("leaderboard").style.display = "block";
		// document.getElementById("challenge-box").style.display = "none";
		// document.getElementById("FooterElement").style.display = "block";
		// document.getElementById("leaderboard").style.display = "block";
		// document.getElementById("single_profile").style.display = "none"
	},
	showTheRedirectedLB: function() {
		var a = Number(String(QueryString.data).split("-")[2]);
		document.getElementById(this.LEADERBOARD_DIV_NAME).style.display = "block";
		switch (a) {
			case 1:
				if (QueryString.error == undefined) {
					this.mFacebookUI.init(this)
				} else {
					this.bTryAgain = true;
					document.getElementById(this.LEADERBOARD_DIV_NAME).style.display = "none"
				}
				break;
			case 2:
				this.mTweeterUI.init(this);
				break
		}
	},
	playAgain: function() {
		document.getElementById("LeaderboardDiv").style.display = "none";
		document.getElementById("challenge-box").style.display = "none";
		document.getElementById("leaderboard").style.display = "none";
		document.getElementById("leaderboard").style.display = "none";
		document.getElementById("single_profile").style.display = "none";
		document.getElementById("FooterElement").style.display = "none";
		document.getElementById("FooterElement").innerHTML = "";
		if (this.mGameConfig.TRY_AGAIN_METHOD != null) {
			this.mGameConfig.TRY_AGAIN_METHOD()
		}
	},
	getScore: function() {
		return this.mGameConfig.GAME_SCORE
	},
	getSessionBestScore: function() {
		return this.mGameConfig.SESSION_BEST_SCORE
	},
	twitterFollow: function() {
		// window.open(this.mTwitterConfig.FOLLOW, "_blank")
	},
	twitterShareScore: function() {
		// var b = this.mTwitterConfig.MESSAGE;
		// b = b.replace(this.getMacroSubstitution("score"), this.getScore().toString());
		// var c = encodeURI(b);
		// var d = encodeURI(this.mGameConfig.APP_URL);
		// var e = encodeURI("tresensa:Built on TreSensa");
		// var a = "http://twitter.com/intent/tweet?text=" + c + "&url=" + d + "&related=" + e;
		// window.open(a, "_blank")
	},
	getMacroSubstitution: function(a) {
		switch (a) {
			case "score":
				return "####";
				break;
			case "screen_name":
				return "%%%%";
				break
		}
	},
	getLBImagesPath: function() {
		return this.mGameConfig.URL_FOR_LB_IMAGES
	}
};