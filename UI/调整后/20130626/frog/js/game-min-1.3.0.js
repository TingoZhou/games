Frog = function(a) {
	Frog.superclass.constructor.call(this, a);
	this.mouseEnabled = true;
	this.mLifespan = 5;
	this.mClickMaturity = 0;
	this.mMatured = false;
	this.mType = "";
	this.mClickMe = null;
	this.mValue = 10;
	this.mClicked = false;
	return this
};
Frog.prototype = {
	Setup: function(a, e, b) {
		Frog.superclass.Setup.call(this, a, e, null);
		var d = 1;
		if (this.mGame.CurrentLevel() == 3) {
			d = 0.75
		} else {
			if (this.mGame.CurrentLevel() == 4) {
				d = 0.5
			}
		}
		this.mType = b;
		var c = "";
		switch (b) {
			case "classic":
				c = "idle_frog";
				this.mLifespan = 5 * d;
				this.mClickMaturity = 1;
				this.mValue = 10;
				this.LoadAnimation("idle", c, 2, 11, 22, 24, true);
				break;
			case "gold":
				c = "bonus_frog";
				this.mLifespan = 1 * d;
				this.mValue = 50;
				this.LoadAnimation("idle", c, 2, 10, 20, 24, true);
				break;
			case "poison":
				c = "poison_frog";
				this.mLifespan = 4 * d;
				this.mValue = -100;
				this.LoadAnimation("idle", c, 2, 11, 22, 24, true);
				break;
			case "devil":
				c = "devil_frog";
				this.mLifespan = 4 * d;
				this.mValue = -1000;
				this.LoadAnimation("idle", c, 2, 12, 24, 24, true);
				break
		}
		this.LoadAnimation("flashing", "glow_idle_frog", 1, 7, 7, 24, true);
		this.PlayAnimation("idle");
		this.rotation = Math.random() * 360;
		return this
	},
	subclassUpdate: function(a) {
		if (this.mType === "classic" && !this.mMatured && this.mAge > this.mClickMaturity) {
			this.mMatured = true;
			this.PlayAnimation("flashing");
			if (this.mGame.CurrentLevel() == 1) {
				this.mClickMe = this.mGame.CreateWorldEntity(TGE.ScreenEntity).Setup(this.x, this.y - 75);
				this.mClickMe.LoadAnimation("clickme", "clickme", 1, 7, 7, 30, true);
				this.mClickMe.PlayAnimation("clickme")
			}
		}
		if (!this.mClicked && this.mAge >= this.mLifespan) {
			this.fadeOut(a)
		} else {
			if (this.mClicked) {
				this.fadeOut(a * 4)
			}
		}
	},
	fadeOut: function(a) {
		this.alpha -= a;
		if (this.mClickMe !== null) {
			this.mClickMe.alpha = this.alpha
		}
		if (this.alpha <= 0) {
			this.alpha = 0;
			this.markForRemoval();
			if (this.mClickMe !== null) {
				this.mClickMe.markForRemoval()
			}
		}
	},
	MouseDown: function() {
		if (!this.mClicked && this.mAge >= this.mClickMaturity) {
			this.mClicked = true;
			if (this.mType === "gold") {
				this.mGame.playSound("gold_frog_sound")
			} else {
				if (this.mType === "poison") {
					this.mGame.playSound("poison_frog_sound")
				} else {
					if (this.mType === "devil") {
						this.mGame.playSound("poison_frog_sound")
					} else {
						this.mGame.playSound("green_frog_sound")
					}
				}
			}
			this.mGame.frogClicked(this)
		}
	},
	MouseUp: function() {}
};
extend(Frog, TGE.ScreenEntity);
Leaf = function(a) {
	Leaf.superclass.constructor.call(this, a);
	this.mRotationSpeed = 2 + (2 * Math.random());
	this.mRotationSpeed *= Math.random() < 0.5 ? -1 : 1;
	return this
};
Leaf.prototype = {
	Setup: function(a, c, b) {
		Leaf.superclass.Setup.call(this, a, c, "leaf");
		return this
	},
	subclassUpdate: function(a) {
		this.rotation += this.mRotationSpeed * a
	}
};
extend(Leaf, TGE.ScreenEntity);
Ripple = function(a) {
	Ripple.superclass.constructor.call(this, a);
	return this
};
Ripple.prototype = {
	Setup: function(a, c, b) {
		Ripple.superclass.Setup.call(this, a, c, "ripple");
		this.reset();
		return this
	},
	reset: function() {
		this.scaleX = this.scaleY = 0.2;
		this.mRotationSpeed = 10 + (10 * Math.random());
		this.mRotationSpeed *= Math.random() < 0.5 ? -1 : 1;
		this.mScaleSpeed = 0.2 + Math.random() * 0.1;
		this.mMaxScale = 1 + Math.random() * 0.4;
		this.mAge = 0;
		this.mDelay = Math.random() * 1
	},
	subclassUpdate: function(a) {
		if (this.mAge < this.mDelay) {
			this.visible = false;
			return
		}
		this.visible = true;
		this.rotation += this.mRotationSpeed * a;
		var b = this.mScaleSpeed * a;
		this.scaleX += b;
		this.scaleY += b;
		this.alpha = this.scaleX <= 1 ? 1 : 1 - ((this.scaleX - 1) / (this.mMaxScale - 1));
		if (this.scaleX > this.mMaxScale) {
			this.reset()
		}
	}
};
extend(Ripple, TGE.ScreenEntity);
ScorePopup = function(a) {
	ScorePopup.superclass.constructor.call(this, a);
	this.sparkle = null;
	return this
};
ScorePopup.prototype = {
	Setup: function(a, g, d) {
		ScorePopup.superclass.Setup.call(this, a, g);
		var c = new TGE.Sprite();
		c.setImage("score_background");
		this.addChild(c);
		if (d > 10) {
			this.sparkle = new TGE.Sprite();
			this.sparkle.setImage("score_sparkle");
			this.addChild(this.sparkle);
			this.sparkle.scaleX = this.sparkle.scaleY = 0.5
		}
		var f = d > 0 ? "+" : "";
		var b = d > 0 ? "#8900fd" : "#f00";
		if (d > 10) {
			b = "#fdb300"
		}
		var e = this.mGame.CreateWorldEntity(TGE.Text).Setup(0, 0, f + d.toString(), "bold 48px Arial", "center", "middle", b);
		this.addChild(e);
		return this
	},
	subclassUpdate: function(a) {
		if (this.sparkle !== null) {
			this.sparkle.scaleX = this.sparkle.scaleY = this.sparkle.scaleX + a;
			this.sparkle.rotation += a * 180
		}
		if (this.mAge > 0.5) {
			this.alpha -= a * 2;
			if (this.alpha <= 0) {
				this.markForRemoval()
			}
		}
	}
};
extend(ScorePopup, TGE.ScreenEntity);
CrazyFrog = function() {
	CrazyFrog.superclass.constructor.call(this);
	this.analytics = new TGE.GoogleAnalytics("Crazy Frog");
	this.mScreenManager.setupFadeIn("#fff", 0.3);
	this.isIOS = TGE.BrowserDetect.platform === "iPhone" || TGE.BrowserDetect.platform === "iPad";
	this.levelTimer;
	this.playerScoreText;
	this.x = 0;
	this.y = 0;
	this.timerText = null;
	this.mins;
	this.secs;
	this.spawnInterval1;
	this.spawnInterval2;
	this.spawnTimer1;
	this.spawnTimer2;
	this.frogs;
	this.score = 0;
	this.mPoisonTimer;
	this.endLevelAd = null;
	var a = [{
			id: "green_frog_sound",
			url: "audio/green_frog.ogg",
			backup_url: "audio/green_frog.mp3",
			assetType: "audio"
		}, {
			id: "gold_frog_sound",
			url: "audio/gold_frog.ogg",
			backup_url: "audio/gold_frog.mp3",
			assetType: "audio"
		}, {
			id: "poison_frog_sound",
			url: "audio/poison_frog.ogg",
			backup_url: "audio/poison_frog.mp3",
			assetType: "audio"
		}, {
			id: "button",
			url: "audio/button.ogg",
			backup_url: "audio/button.mp3",
			assetType: "audio"
		}
	];
	var c = [{
			id: "splashBgImg",
			url: "images/screens/mainmenu/background.jpg"
		}, {
			id: "loadingFrog",
			url: "images/screens/loading/loadingFrog.png"
		}
	];
	var b = [{
			id: "sound_button_on",
			url: "images/audio-on.png"
		}, {
			id: "sound_button_off",
			url: "images/audio-off.png"
		}, {
			id: "background",
			url: "images/watersprite.png"
		}, {
			id: "idle_frog",
			url: "images/idle_frog.png"
		}, {
			id: "poison_frog",
			url: "images/poison_frog.png"
		}, {
			id: "bonus_frog",
			url: "images/bonus_frog.png"
		}, {
			id: "devil_frog",
			url: "images/devil_frog.png"
		}, {
			id: "glow_idle_frog",
			url: "images/glow_idle_frog.png"
		}, {
			id: "watersplash",
			url: "images/splash.png"
		}, {
			id: "ripple",
			url: "images/ripple.png"
		}, {
			id: "leaf",
			url: "images/leafanimation.png"
		}, {
			id: "scoreBar",
			url: "images/score.png"
		}, {
			id: "timerBar",
			url: "images/timer.png"
		}, {
			id: "score_background",
			url: "images/score_background.png"
		}, {
			id: "score_sparkle",
			url: "images/score_sparkle.png"
		}, {
			id: "clickme",
			url: "images/clickme.png"
		}, {
			id: "poison",
			url: "images/poison.png"
		}, {
			id: "play",
			url: "images/screens/mainmenu/play.png"
		}, {
			id: "instruction",
			url: "images/screens/mainmenu/instructions.png"
		}, {
			id: "mainMenuBg",
			url: "images/screens/mainmenu/background.jpg"
		}, {
			id: "backBtn",
			url: "images/screens/instructions/backBtn.png"
		}, {
			id: "instructionBG",
			url: "images/screens/instructions/instructions.jpg"
		}, {
			id: "levelUpBg",
			url: "images/screens/levelup/background.jpg"
		}, {
			id: "goBtn",
			url: "images/screens/levelup/go_button.png"
		}, {
			id: "continue",
			url: "images/screens/pause/continue.png"
		}, {
			id: "gameEndBg",
			url: "images/screens/gameover/background.jpg"
		}, {
			id: "endscreen_twitter_button",
			url: "images/screens/gameover/twitter_button.png"
		}, {
			id: "endscreen_facebook_button",
			url: "images/screens/gameover/facebook_button.png"
		}, {
			id: "replay",
			url: "images/screens/gameover/replay.png"
		}, {
			id: "lb_fb_btn",
			url: "images/lb-images/facebook_icon.png"
		}, {
			id: "lb_twi_btn",
			url: "images/lb-images/twitter_icon.png"
		}, {
			id: "lb_play_again_btn",
			url: "images/lb-images/play_button.png"
		}, {
			id: "lb_challenge_btn",
			url: "images/lb-images/challenge_button.png"
		}, {
			id: "lb_close_btn",
			url: "images/lb-images/close_button.png"
		}, {
			id: "music",
			url: "audio/music.ogg",
			backup_url: "audio/music.mp3",
			assetType: "audio"
		}
	];
	if (!this.isIOS) {
		b = b.concat(a)
	}
	this.assetManager.assignImageAssetList("loading", c);
	this.assetManager.assignImageAssetList("required", b);
	this.assetManager.rootLocation = "./assets-1.3.0";
	this.mLeaderboardWidget = new LeaderBoardWidget("LeaderboardDiv");
	this.mQueryString = QueryString.lb_mode;
	window.onblur = this.onBlur.bind(this);
	window.pagehide = this.pageHide.bind(this);
	this.mAdServerURL = "";
	// this.mAdServerURL += ";key=" + getDistributionPartner();
	// this.mAdServerURL += ";kvenv=" + encodeURIComponent(TGE.BrowserDetect.platform);
};
CrazyFrog.prototype = {
	subclassPlayGame: function() {
		this.StartLevel(1)
	},
	subclassStartPlaying: function() {
		this.mCurrentLevel = 1;
		this.score = 0;
		this.mPoisonTimer = 0;
		this.mScreenManager.setupFadeIn("#fff", 0.3);
		this.playMusic()
	},
	subclassSetupLevel: function(f) {
		document.getElementById("game_canvas").onselectstart = function() {
			return false
		};
		this.frogs = [];
		switch (f) {
			case 1:
				this.levelTimer = 25;
				this.spawnTimer1 = this.spawnInterval1 = 3.2;
				this.spawnTimer2 = this.spawnInterval2 = 1.8;
				this.spawnProbabilities = [0.8, 0.9, 1, 1];
				break;
			case 2:
				this.levelTimer = 25;
				this.spawnTimer1 = this.spawnInterval1 = 1;
				this.spawnTimer2 = this.spawnInterval2 = 1.4;
				this.spawnProbabilities = [0.75, 0.85, 0.95, 1];
				break;
			case 3:
				this.levelTimer = 25;
				this.spawnTimer1 = this.spawnInterval1 = 0.8;
				this.spawnTimer2 = this.spawnInterval2 = 0.5;
				this.spawnProbabilities = [0.65, 0.75, 1, 1];
				break;
			case 4:
				this.levelTimer = 25;
				this.spawnTimer1 = this.spawnInterval1 = 0.6;
				this.spawnTimer2 = this.spawnInterval2 = 0.4;
				this.spawnProbabilities = [0.5, 0.65, 1, 1];
				break
		}
		this.ClearScene();
		var b = this.CreateWorldEntity(TGE.ScreenEntity).Setup(this.Width() / 2, this.Height() / 2, "background");
		this.CreateWorldEntity(Ripple).Setup(210, 150);
		this.CreateWorldEntity(Ripple).Setup(260, 680);
		this.CreateWorldEntity(Ripple).Setup(450, 520);
		this.CreateWorldEntity(Ripple).Setup(500, 350);
		this.CreateWorldEntity(Ripple).Setup(335, 600);
		this.CreateWorldEntity(Ripple).Setup(240, 400);
		this.CreateWorldEntity(Leaf).Setup(500, 260);
		this.CreateWorldEntity(Leaf).Setup(360, 444);
		this.CreateWorldEntity(Leaf).Setup(200, 600);
		var a = this.CreateWorldEntity(TGE.ScreenEntity).Setup(184, 42, "scoreBar");
		this.playerScoreText = this.CreateWorldEntity(TGE.Text).Setup(224, 41, "0", "bold 26px Arial", "center", "middle", "#FFFF00");
		this.playerScoreText.text = this.score.toString();
		var g = this;
		var d = this.CreateWorldEntity(TGE.ScreenEntity).Setup(464, 42, "timerBar");
		this.timerText = this.CreateWorldEntity(TGE.Text).Setup(509, 41, "00:25", "bold 26px Arial", "center", "middle", "#FFFF00");
		var e = 40;
		var c = this.Height() - 40;
		this.CreateUIEntity(TGE.Button).Setup(e, c, "sound_button_on", this.toggleMute.bind(this), 1);
		this.mSoundToggleOff = this.CreateUIEntity(TGE.ScreenEntity).Setup(e, c, "sound_button_off");
		this.updateSoundButtons();
		this.inLevelTransition = false
	},
	spawnFrog: function() {
		var c = "classic";
		var b = Math.random();
		if (b <= this.spawnProbabilities[0]) {
			c = "classic"
		} else {
			if (b <= this.spawnProbabilities[1]) {
				c = "gold"
			} else {
				if (b <= this.spawnProbabilities[2]) {
					c = "poison"
				} else {
					if (b <= this.spawnProbabilities[3]) {
						c = "devil"
					}
				}
			}
		} if (this.mGameTime < 10) {
			c = "classic"
		}
		var d = this.findFrogLocation();
		var a = this.CreateWorldEntity(Frog).Setup(d.x, d.y, c);
		this.frogs.push(a)
	},
	findFrogLocation: function() {
		var j = 0;
		var k = 25;
		var b = false;
		var h;
		var g;
		while (!b && j < k) {
			h = 96 + Math.floor(Math.random() * 460);
			g = 100 + Math.floor(Math.random() * 640);
			b = true;
			var e = this.frogs.length;
			for (var c = 0; c < e; c++) {
				var a = this.frogs[c];
				if (!a.mMarkedForRemoval) {
					var f = Math.abs(h - a.x) + Math.abs(g - a.y);
					if (f < 200) {
						b = false;
						break
					}
				}
			}
			j++
		}
		if (j >= k) {}
		return {
			x: h,
			y: g
		}
	},
	frogClicked: function(c) {
		if (this.mPoisonTimer > 0) {
			return
		}
		var b = this.CreateWorldEntity(TGE.ScreenEntity).Setup(c.x, c.y - 25);
		b.LoadAnimation("splash", "watersplash", 5, 5, 17, 30, false);
		b.scaleX = b.scaleY = 1.4;
		b.PlayAnimation("splash", TGE.ScreenEntity.prototype.markForRemoval.bind(b));
		if (c.mValue === -1000) {
			var a = this.CreateWorldEntity(TGE.ScreenEntity).Setup(c.x + 2, c.y - 10, "poison");
			this.mPoisonTimer = 2;
			return
		}
		this.CreateWorldEntity(ScorePopup).Setup(c.x, c.y, c.mValue);
		this.score += c.mValue
	},
	subclassUpdateGame: function(a) {
		this.levelTimer -= a;
		if (!this.inLevelTransition) {
			if (this.levelTimer <= 0) {
				this.inLevelTransition = true;
				this.levelTimer = 0;
				this.FinishLevel()
			} else {
				if (this.mPoisonTimer <= 0) {
					this.spawnTimer1 -= a;
					if (this.spawnTimer1 <= 0) {
						this.spawnFrog();
						this.spawnTimer1 = this.spawnInterval1
					}
					this.spawnTimer2 -= a;
					if (this.spawnTimer2 <= 0) {
						this.spawnFrog();
						this.spawnTimer2 = this.spawnInterval2
					}
				} else {
					if (this.mPoisonTimer > 0) {
						this.mPoisonTimer -= a;
						if (this.mPoisonTimer <= 0) {
							this.EndGame()
						}
					}
				}
			}
		}
		this.UpdateTimer();
		this.playerScoreText.text = this.score.toString()
	},
	advanceLevel: function() {
		if (this.endLevelAd !== null) {
			this.endLevelAd.close()
		}
		this.playSound("button");
		this.StartLevel(this.mCurrentLevel + 1)
	},
	subclassFinishLevel: function() {
		if (this.mCurrentLevel === 4) {
			this.ClearScene();
			this.EndGame();
			return
		}
		this.ClearScene();
		this.CreateWorldEntity(TGE.ScreenEntity).Setup(this.Width() / 2, this.Height() / 2, "background");
		levelUpBg = this.CreateUIEntity(TGE.ScreenEntity).Setup(this.Width() / 2, this.Height() / 2, "levelUpBg");
		levelScore = this.CreateUIEntity(TGE.Text).Setup(this.Width() / 4 + 216, this.mScreenManager.YFromPercentage(0.233), this.getScore().toString(), "bold 48px Arial", "center", "middle", "#FFF", this.mScreenManager.mLayerName);
		goBtn = this.CreateUIEntity(TGE.Button).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.52), "goBtn", CrazyFrog.prototype.advanceLevel.bind(this), 3, this.mScreenManager.mLayerName);
		var a = 14;
		var c = this.Width() / 2 - 150;
		var b = this.Height() * 0.67;
		// this.endLevelAd = TGE.Advertisement.DisplayAd({
		// 	parentDiv: this.mCanvasDiv,
		// 	adURL: this.mAdServerURL,
		// 	adWidth: 300,
		// 	adHeight: 250,
		// 	x: c,
		// 	y: b
		// })
	},
	UpdateTimer: function() {
		var e = Math.ceil(this.levelTimer);
		var d = Math.floor(e / 86400);
		e -= d * 86400;
		var c = Math.floor(e / 3600);
		e -= c * (3600);
		var a = Math.floor(e / 60);
		e -= a * (60);
		var b = ((d > 0) ? d + " days " : "") + this.LeadingZero(a) + ":" + this.LeadingZero(e);
		this.timerText.text = b
	},
	LeadingZero: function(a) {
		return (a < 10) ? "0" + a : +a
	},
	getScore: function() {
		return this.score
	},
	toggleMute: function() {
		this.audioManager.ToggleMute();
		this.updateSoundButtons()
	},
	updateSoundButtons: function() {
		this.mSoundToggleOff.visible = this.audioManager.mMuted
	},
	playSound: function(a) {
		if (!this.isIOS) {
			this.audioManager.Play({
				id: a
			})
		}
	},
	playMusic: function() {
		this.audioManager.Play({
			id: "music",
			loop: true
		})
	},
	onBlur: function() {
		if (this.mPlaying) {
			this.PauseGame(true);
			this.audioManager.Mute()
		}
	},
	pageHide: function() {
		if (this.mPlaying) {
			this.PauseGame(true);
			this.audioManager.Mute()
		}
	}
};
extend(CrazyFrog, TGE.Game, null);
GameOver.prototype = new TGE.Screen();
GameOver.prototype.constructor = GameOver;

function GameOver(a) {
	TGE.Screen.call(this, a);
	this.mAd = null;
	return this
}
GameOver.prototype.Setup = function() {
	this.Game().audioManager.StopAll();
	this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.5), "gameEndBg");
	this.CreateUIEntity(TGE.Text).Setup(420, this.mScreenManager.YFromPercentage(0.183), this.Game().getScore().toString(), "bold 48px Arial", "center", "middle", "#FFF", this.mScreenManager.mLayerName);
	this.CreateUIEntity(TGE.Button).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.58), "replay", GameOver.prototype.replay.bind(this), 3, this.mScreenManager.mLayerName);
	var b = 0.25;
	var c = this.mScreenManager.XFromPercentage(0.5);
	// switch (this.Game().mQueryString) {
	// 	case "twitter":
	// 		this.CreateUIEntity(TGE.Button).Setup(c, this.mScreenManager.YFromPercentage(0.35), "endscreen_twitter_button", GameOver.prototype.socialNetWorkTwitter.bind(this), 1, this.mScreenManager.mLayerName);
	// 		break;
	// 	case "facebook":
	// 		this.CreateUIEntity(TGE.Button).Setup(c, this.mScreenManager.YFromPercentage(0.35), "endscreen_facebook_button", GameOver.prototype.socialNetWorkFacebook.bind(this), 1, this.mScreenManager.mLayerName);
	// 		break;
	// 	case "none":
	// 		break;
	// 	case "both":
	// 	default:
	// 		this.CreateUIEntity(TGE.Button).Setup(c, this.mScreenManager.YFromPercentage(0.3), "endscreen_twitter_button", GameOver.prototype.socialNetWorkTwitter.bind(this), 1, this.mScreenManager.mLayerName);
	// 		this.CreateUIEntity(TGE.Button).Setup(c, this.mScreenManager.YFromPercentage(0.43), "endscreen_facebook_button", GameOver.prototype.socialNetWorkFacebook.bind(this), 1, this.mScreenManager.mLayerName);
	// 		break
	// }
	var a = 14;
	var f = this.Game().Width() / 2 - 150;
	var d = this.Game().Height() * 0.68;
	// this.mAd = TGE.Advertisement.DisplayAd({
	// 	parentDiv: this.Game().mCanvasDiv,
	// 	adURL: this.Game().mAdServerURL,
	// 	adWidth: 300,
	// 	adHeight: 250,
	// 	x: f,
	// 	y: d
	// });
	var e = this.Game().getScore();
	this.Game().AnalyticAchievementEvent("score", e);
	this.Game().mLeaderboardWidget.AutomaticScoreSubmission(e)
};
GameOver.prototype.replay = function() {
	this.Game().playSound("button");
	this.Close();
	this.Game().StartPlaying();
	this.Game().Replay()
};
GameOver.prototype.shareFacebook = function() {
	var a = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent("http://www.mobilewebarcade.com/games/crazy-frog");
	this.Game().OpenURL(a);
	this.Game().AnalyticShareEvent("facebook")
};
GameOver.prototype.shareTwitter = function() {
	var b = "";
	var a = encodeURIComponent("http://bit.ly/OBQPUg");
	var c = this.Game().getScore();
	b = "http://twitter.com/home?status=" + encodeURIComponent("I just scored " + c + " points whacking frogs playing @crazyfroggame! Can you beat my score? ") + a;
	this.Game().OpenURL(b);
	this.Game().AnalyticShareEvent("twitter")
};
GameOver.prototype.Destroy = function() {
	if (this.mAd !== null) {
		this.mAd.close()
	}
	TGE.Screen.prototype.Destroy.call(this)
};
GameOver.prototype.triggerLeaderboard = function(b) {
	this.Game().AnalyticCustomEvent("load " + b);
	var a = new LeaderBoardWidgetConfig();
	a.lbWidgetConfig.GAME.TRY_AGAIN_METHOD = this.replay.bind(this);
	a.lbWidgetConfig.GAME.LB_TYPE = b;
	a.lbWidgetConfig.GAME.GAME_SCORE = this.Game().getScore();
	this.Game().mLeaderboardWidget.ShowLeaderboard(a.lbWidgetConfig)
};
GameOver.prototype.socialNetWorkTwitter = function() {
	if (this.mAd !== null) {
		this.mAd.close()
	}
	this.triggerLeaderboard("twitter")
};
GameOver.prototype.socialNetWorkFacebook = function() {
	if (this.mAd !== null) {
		this.mAd.close()
	}
	this.triggerLeaderboard("facebook")
};
LoadingScreen.prototype = new TGE.Screen();
LoadingScreen.prototype.constructor = LoadingScreen;

function LoadingScreen(a) {
	TGE.Screen.call(this, a);
	this.mLoadingText = null;
	return this
}
LoadingScreen.prototype.Setup = function() {
	this.FillBackground("#4E9258");
	this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.5), "splashBgImg", this.mScreenManager.mLayerName);
	this.mLoadingText = this.CreateUIEntity(TGE.Text).Setup(this.mScreenManager.XFromPercentage(0.6), this.mScreenManager.YFromPercentage(0.5), "加载中 0%", "bold italic 38px Arial", "center", "middle", "green", this.mScreenManager.mLayerName);
	this.frogAnimation = this.CreateUIEntity(TGE.ScreenEntity).Setup(385, 350, "loadingFrog");
	this.frogAnimation.LoadAnimation("loadingFrog", "loadingFrog", 1, 4, 4, 5, true);
	this.frogAnimation.PlayAnimation("loadingFrog")
};
LoadingScreen.prototype.UpdateProgress = function(b) {
	var a = "加载中 " + Math.round(b * 100).toString() + "%";
	this.mLoadingText.text = a
};
MainMenu.prototype = new TGE.Screen();
MainMenu.prototype.constructor = MainMenu;

function MainMenu(a) {
	TGE.Screen.call(this, a);
	return this
}
MainMenu.prototype.Setup = function() {
	this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.5), "mainMenuBg", this.mScreenManager.mLayerName);
	this.CreateUIEntity(TGE.Button).Setup(460, 358, "play", MainMenu.prototype.playGame.bind(this), 3, this.mScreenManager.mLayerName);
	this.CreateUIEntity(TGE.Button).Setup(460, 445, "instruction", MainMenu.prototype.displayHelp.bind(this), 3, this.mScreenManager.mLayerName)
};
MainMenu.prototype.playGame = function() {
	this.Game().playSound("button");
	this.Close();
	this.Game().PlayGame()
};
MainMenu.prototype.displayHelp = function() {
	this.Game().playSound("button");
	this.mScreenManager.ShowScreen(InstructionScreen)
};
InstructionScreen.prototype = new TGE.Screen();
InstructionScreen.prototype.constructor = InstructionScreen;

function InstructionScreen(a) {
	TGE.Screen.call(this, a);
	return this
}
InstructionScreen.prototype.Setup = function() {
	var a = this.CreateUIEntity(TGE.ScreenEntity).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.5), "instructionBG", this.mScreenManager.mLayerName);
	a.mouseEnabled = true;
	this.CreateUIEntity(TGE.Button).Setup(320, 600, "backBtn", InstructionScreen.prototype.displayMenu.bind(this), 3, this.mScreenManager.mLayerName)
};
InstructionScreen.prototype.displayMenu = function() {
	this.Game().playSound("button");
	this.Close()
};
PauseScreen.prototype = new TGE.Screen();
PauseScreen.prototype.constructor = PauseScreen;

function PauseScreen(a) {
	TGE.Screen.call(this, a);
	return this
}
PauseScreen.prototype.Setup = function() {
	this.resumeBtn = this.CreateUIEntity(TGE.Button).Setup(this.mScreenManager.XFromPercentage(0.5), this.mScreenManager.YFromPercentage(0.5), "continue", PauseScreen.prototype.resumeGame.bind(this), 1, this.mScreenManager.mLayerName);
	this.wasMuted = this.Game().audioManager.mMuted;
	this.Game().audioManager.Mute()
};
PauseScreen.prototype.resumeGame = function() {
	this.Game().PauseGame(false);
	if (!this.wasMuted) {
		this.Game().audioManager.Unmute()
	}
};