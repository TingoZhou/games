XWUZ.game = 'bubble';
			
XWUZ.games.bubble = function () {
	return {
		init: function () {
			XWUZ.flow = XWUZ.games[XWUZ.game].flow; //bubble flow controls remapped
			XWUZ.games.bubble.engine.start();
			XWUZ.say.alert('<h1>消除方块</h1><p style="margin: 0 20px 0 20px; text-align:left;"><img src="./i/icon.png" alt="Bubble Trouble" style="width:64px; height:64px;float:left; margin-right:5px;"/>点击至少3块以上相同颜色的方块，方块会自动消除，消除的方块数越多，获取的分数也越高。</p>' + '<div style="width:110px; margin:30px auto -30px auto;"></div>');
			if(document.body.addEventListener) {
				document.body.addEventListener("touchmove", function(e) {
					e.preventDefault();
				}, false);
			}
		},
		flow: function () {
			var status = 'splash';
			return {
				getstatus: function () {
					return status;
				}, 
				restart: function () {
					if (status === 'splash') {
						status = 'running';
						XWUZ.games.bubble.flow.resume();
					} else {
						status = 'running';
						XWUZ.games.bubble.engine.start();
					}
				},
				pause: function () {
					if (status === 'running') {
						status = 'paused';
					}
				},
				resume: function () {
					if (status === 'paused') {
						status = 'running';
					}
				}
			};
		}(),
		engine: function () {
			var gamevars = {
				tablew: 9,
				tableh: 8,
				bubblew: 33,
				bubbleh: 33
			};
			
			var getbubble = function (coords) {
				if (coords.x >= 0 && coords.y >= 0 && coords.x < gamevars.tablew && coords.y < gamevars.tableh) {
					if (document.getElementById('bubble_elem_' + coords.x + '_' + coords.y)) {
						return document.getElementById('bubble_elem_' + coords.x + '_' + coords.y);
					}
				}
			};

			var bubbleconstructor = function (spec) {
				var that = document.createElement("span");
				that.className = 'bubble';
				that.style.marginLeft = spec.x * gamevars.bubblew + 'px';
				that.style.marginTop = spec.y * gamevars.bubbleh + 'px';
				that.style.backgroundPosition = '0 -' + spec.type * gamevars.bubbleh + 'px';
				that.id = 'bubble_elem_' + spec.x + '_' + spec.y;
				that.x = spec.x;
				that.y = spec.y;
				that.type = spec.type;
				that.append = function () {
					document.getElementById('bt_realarea').appendChild(this);
				};
				that.show = function () {
					this.style.opacity = 1;
					this.style.cursor = 'pointer';
				};
				
				that.remove = function (coords) {
					document.getElementById('bt_realarea').removeChild(this);
				};
				
				that.fall = function (where) {
					this.id = 'bubble_elem_' + this.x + '_' + where.y;
					this.y = where.y;
				};

				that.onmousedown = function () {
					var filled = {};
					var ourcolor = getbubble({x: this.x, y: this.y}).type;

					if (XWUZ.games.bubble.engine.floodcheck({x: this.x, y: this.y, type: this.type})) {
						gamevars.points[gamevars.cycle] = 0;
						XWUZ.games.bubble.engine.floodrem({x: this.x, y: this.y});
						XWUZ.games.bubble.engine.setscore();
						gamevars.cycle += 1;
					}
					return false;
				};
				that.ontouchstart = that.onmousedown;
				return that;
			};
			
			return {
				cleanup: function () {
					var x, y;
					gamevars.level = 0;
					gamevars.scoreperlevel = [0];
					gamevars.score = 0;
					gamevars.cycle = 0;
					gamevars.points = [0];
					gamevars.evil = 0.8;
					gamevars.colors = 3;
					for (x = 0; x < gamevars.tablew; x += 1) {
						for (y = 0; y < gamevars.tableh; y += 1) {
							if (getbubble({x: x, y: y})) {
								getbubble({x: x, y: y}).remove();
							}
						}
					}
					document.getElementById('score').className = '';
					document.getElementById('score').innerHTML = gamevars.score;
					document.getElementById('level').innerHTML = gamevars.level;
					document.getElementById('combo').innerHTML = gamevars.points[gamevars.cycle];
				},
				start: function () {
					gamevars.gamesplayed = parseInt(XWUZ.cookie.get('bubble_gamesplayed'), 10) || 0;
					gamevars.yourbest = heightScore;
					XWUZ.games.bubble.engine.cleanup();
					XWUZ.games.bubble.engine.newlevel();
				},
				newlevel: function () {
					if (gamevars.level === 5) {
						gamevars.colors = 4;
						gamevars.evil = 0.7;
					} else if (gamevars.level === 10) {
						gamevars.colors = 5;
						gamevars.evil = 0.6;
					} else if (gamevars.level === 15) {
						gamevars.colors = 6;
						gamevars.evil = 0.5;
					}
					
					gamevars.level += 1;

					XWUZ.games.bubble.engine.setlevel();

					var x, y, newbubble, newbubbles;
					newbubbles = [];
					for (x = 0; x < gamevars.tablew; x += 1) {
						for (y = 0; y < gamevars.tableh; y += 1) {
							if (!getbubble({x: x, y: y})) {
								newbubble = bubbleconstructor({
									x: x,
									y: y,
									type: Math.random() > gamevars.evil ? (x + y * 2) % 4 : Math.floor(Math.random() * gamevars.colors)
								});
								newbubble.append();
								newbubbles.push({x: x, y: y});
							}
						}
					}
					XWUZ.games.bubble.engine.bulkshow(newbubbles);
					
					if (XWUZ.games.bubble.engine.levelendcheck()) {
						setTimeout(XWUZ.games.bubble.engine.gameover, 600);
					}
				},
				setscore: function () {
					gamevars.score += Math.floor((gamevars.points[gamevars.cycle] * (gamevars.points[gamevars.cycle] - 1)) / 2 * (Math.log(gamevars.level) + 1));
					gamevars.scoreperlevel[gamevars.level] = gamevars.score;
					document.getElementById('score').innerHTML = gamevars.score;
					if (gamevars.score > gamevars.yourbest) {
						document.getElementById('score').className = 'highscore';
					}
					document.getElementById('combo').innerHTML = gamevars.points[gamevars.cycle];
				},
				setlevel: function () {
					document.getElementById('level').innerHTML = gamevars.level;
				},
				floodcheck: function (coords) {
					var dir = {};
					var rv = 0;
					if (getbubble({x: coords.x - 1, y: coords.y}) && getbubble({x: coords.x - 1, y: coords.y}).type === coords.type) {
						rv += 1;
						dir = {x: coords.x - 1, y: coords.y};
					}
					if (getbubble({x: coords.x, y: coords.y - 1}) && getbubble({x: coords.x, y: coords.y - 1}).type === coords.type) {
						rv += 1;
						dir = {x: coords.x, y: coords.y - 1};
					}
					if (getbubble({x: coords.x + 1, y: coords.y}) && getbubble({x: coords.x + 1, y: coords.y}).type === coords.type) {
						rv += 1;
						dir = {x: coords.x + 1, y: coords.y};
					}
					if (getbubble({x: coords.x, y: coords.y + 1}) && getbubble({x: coords.x, y: coords.y + 1}).type === coords.type) {
						rv += 1;
						dir = {x: coords.x, y: coords.y + 1};
					}
					
					if (rv === 0) {
						return false;
					} else if (rv >= 2) {
						return true;
					} else {
						if (coords.tried) {
							return false;
						} else {
							dir.type = coords.type;
							dir.tried = true;
							return XWUZ.games.bubble.engine.floodcheck(dir);
						}
					}
				},
				bulkshow: function (bubbles) {
					var i;
					var nphase = 5;
					var phases = [];
					for (i = 0; i < nphase ; i += 1) {
						phases[i] = [];
					}
					for (i = 0; i < bubbles.length; i += 1) {
						phases[Math.floor(Math.random() * nphase)].push(getbubble({x:  bubbles[i].x, y: bubbles[i].y}));
					}
					var step = function () {
						var i, toshownow, over;
						over = 0;
						if (phases.length > 0) {
							do {
								toshownow = phases.pop();
							} while (toshownow && toshownow.length === 0);
							if (toshownow) {
								for (i = 0; i < toshownow.length; i += 1) {
									toshownow[i].show();
								}
								setTimeout(step, 50);
							}
						}
					};
					step();
				},
				bulkfall: function (bubbles) {
					var i = 0;
					var step = function () {
						var j;
						if (i < bubbles.length + 3) {
							if (bubbles[i]) {
								for (j = 0; j < bubbles[i].length; j += 1) {
									bubbles[i][j].style.marginTop = Math.floor(bubbles[i][j].y * gamevars.bubbleh - gamevars.bubbleh / 2) + 'px';
								}
							}
							
							if (bubbles[i - 1]) {
								for (j = 0; j < bubbles[i - 1].length; j += 1) {
									bubbles[i - 1][j].style.marginTop = bubbles[i - 1][j].y * gamevars.bubbleh - 1 + 'px';
								}
							}
							
							if (bubbles[i - 2]) {
								for (j = 0; j < bubbles[i - 2].length; j += 1) {
									bubbles[i - 2][j].style.marginTop = bubbles[i - 2][j].y * gamevars.bubbleh - 2 + 'px';
								}
							}

							if (bubbles[i - 3]) {
								for (j = 0; j < bubbles[i - 3].length; j += 1) {
									bubbles[i - 3][j].style.marginTop = bubbles[i - 3][j].y * gamevars.bubbleh + 'px';
								}
							}
							i += 1;
							setTimeout(step, 50);
						}
					};
					step();
				},
				floodrem: function (coords) {
					var ourcolor = getbubble({x: coords.x, y: coords.y}).type;
					var step = function (coordsin) {
						var gb;
						gb = getbubble({x: coordsin.x, y: coordsin.y});
						if (gb && gb.type === ourcolor) {
							gamevars.points[gamevars.cycle] += 1;
							getbubble({x: coordsin.x, y: coordsin.y}).remove();
							step({x: coordsin.x - 1, y: coordsin.y});
							step({x: coordsin.x, y: coordsin.y - 1});
							step({x: coordsin.x + 1, y: coordsin.y});
							step({x: coordsin.x, y: coordsin.y + 1});
						}
					};
					step(coords);
					XWUZ.games.bubble.engine.fall();

					if (XWUZ.games.bubble.engine.levelendcheck()) {
						setTimeout(XWUZ.games.bubble.engine.newlevel, 200);
					}
				},
				fall: function () {
					var x, y, bubble, bubbles, bubblescol, lastgoody;
					bubbles = [];
					for (x = 0; x < gamevars.tablew; x += 1) {
						bubblescol = [];
						lastgoody = gamevars.tableh - 1;
						for (y = gamevars.tableh - 1; y >= 0 ; y -= 1) {
							bubble = getbubble({x: x, y: y});
							if (bubble) {
								if (lastgoody > y) {
									bubble.fall({y: lastgoody});
									bubblescol.push(bubble);
								}
								lastgoody -= 1;
							}
						}
						if (bubblescol.length > 0) {
							bubbles.push(bubblescol);
						}
					}
					XWUZ.games.bubble.engine.bulkfall(bubbles);
				},
				levelendcheck: function () {
					var i;
					var bubbles = document.getElementById('bt_realarea').getElementsByTagName('span');
					for (i = 0; i < bubbles.length; i += 1) {
						if (XWUZ.games.bubble.engine.floodcheck({x: bubbles[i].x, y: bubbles[i].y, type: bubbles[i].type})) {
							return false;
						}
					}
					return true;
				},
				gameover: function () {
					gamevars.gamesplayed += 1;
					XWUZ.cookie.set('bubble_gamesplayed', gamevars.gamesplayed);
					if (gamevars.score > gamevars.yourbest) {
						XWUZ.say.alert('<h1>游戏结束</h1>重新开始?');
						gamevars.yourbest = gamevars.score;
						heightScore = gamevars.score;
					} else {
						XWUZ.say.alert('<h1>游戏结束</h1>重新开始?');
					}
				}
			};			
		}()
	};
}();