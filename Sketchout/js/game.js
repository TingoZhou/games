/**
 * Sketch out Game World Class
 * 
 * @author Paul Lewis, Hakim El Hattab
 * @version 1.0
 */
var GameWorld = new function()
{
	// Game Constants
	var DEFAULT_WIDTH 				= 1000;
	var DEFAULT_HEIGHT 				= 1100;
	var FRAMERATE 					= 60;
	var CCD_QUALITY 				= 8;
	var DIRTY_PADDING 				= 40;
	var SHIELD_REGION_PADDING 		= 20;
	var SHIELD_PROXIMITY_THRESHOLD	= 2;
	var BOSS_RADIUS					= 350;
	var PLAYER_RADIUS				= 270;
	var MISSILE_FLICKER_LOWER		= 0.5;
	var MISSILE_FLICKER_UPPER		= 1;
	var EXPLOSION_BIG 				= 0;
	var EXPLOSION_SMALL 			= 1;
	
	// The different states that the game can be in
	var STATE_HOME 					= 'home';
	var STATE_INSTRUCTIONS 			= 'instructions';
	var STATE_PLAYING 				= 'playing';
	var STATE_GAMEOVER 				= 'gameover';
	var isMac						= (navigator.userAgent.match(/Mac/) == "Mac");
	
	// Game Variables
	var world = { 
		x: 		0, 
		y: 		0, 
		width: 	UserProfile.isTouchDevice() ? window.innerWidth : DEFAULT_WIDTH, 
		height: UserProfile.isTouchDevice() ? window.innerHeight : DEFAULT_HEIGHT 
	};

	var lastWorldHeight				= 0;
	var worldYOffset				= 0;
	var time 						= new Date().getTime();
	var delta 						= 0;
	var dirtyRegion 				= new Region();
	var mouse 						= { x: 0, y: 0, down: false };
	var soundAvailable				= false;
	var playing						= false;
	var paused						= false;
	var bossActive					= false;
	var state						= STATE_HOME;
	var level						= 0;
	var score 						= 0;
	var assetCount					= 0;
	var blastRadius					= 0;
	var assets						= [{id:'background', src:'./media/images/gameBackground.jpg'},
	                				   {id:'boss', src:'./media/images/gameBoss.png'},
	                				   {id:'player', src:'./media/images/gamePlayer.png'},
	                				   {id:'sprite', src:'./media/images/gameSprite.png'}];
	
	var gameStatus = "stop";
	var gameTimeoutId;

	// Contains settings that are saved and restored between game sessions
	var settings = {
		hasPlayedBefore: false,
		soundEnabled: true,
		unlockedLevels: 0,
		selectedLevel: 0,
		highScore: 0
	};
	
	// The levels
	var levels = [{
		aggression: 	0.0002,
		ringCount:		3,
		fireRate: 		3,
		blastRadius: 	30
	},
	{
		aggression: 	0.0012,
		ringCount:		3,
		fireRate: 		1.5,
		blastRadius: 	25
	},
	{
		aggression: 	0.0020,
		ringCount:		4,
		fireRate: 		1,
		blastRadius: 	20
	},
	{
		aggression: 	0.0025,
		ringCount:		5,
		fireRate: 		.7,
		blastRadius: 	20
	}];
	
	var player;
	var boss;
	var sprite;
	var canvas;
	var context;
	var particles;
	var explosions;
	var lastDefense;
	var gameDiv;
	var playerDiv;
	var bossDiv;
	var backgroundDiv;
	
	/**
	 * Preloads all the images
	 */
	this.preload = function() {
		
		assetCount = assets.length;
		
		for(var i = 0; i < assets.length; i++)
		{
			// create a new image
			var assetImage 	= $(new Image());
			assetImage.id	= assets[i].id;
			
			// set up its callback and src/id attributes
			assetImage
			.load(function()
			{
				assetCount--;
				if(assetCount==0)
					GameWorld.initialize();
			})
			.attr('src', assets[i].src)
			.attr('id', assets[i].id);
			
			// add it to the reference div
			assets[assets[i].id] = assetImage;
		}
	}
	
	/**
	 * Initializes the game world and rendering.
	 */
	this.initialize = function(){

		// Collect references to all DOM elements being used
		canvas = document.getElementById('world');
		// Make sure that the Canvas element is available before continuing
		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			
			// get the key DOM items
			gameDiv 		= document.getElementById('game');
			backgroundDiv 	= document.getElementById('background');
			bossDiv			= document.getElementById('boss');
			playerDiv		= document.getElementById('player');
			
			// set the background images
			sprite			= new Image();
			sprite.src		= $(assets["sprite"]).attr('src');
			
			backgroundDiv.style.backgroundImage		 = "url("+$(assets["background"]).attr('src')+")";
			bossDiv.style.backgroundImage	 		= "url("+$(assets["boss"]).attr('src')+")";
			playerDiv.style.backgroundImage	 		= "url("+$(assets["player"]).attr('src')+")";
			
			// Register event listeners
			document.addEventListener('mousemove', documentMouseMoveHandler, false);
			document.addEventListener('mousedown', documentMouseDownHandler, false);
			document.addEventListener('mouseup', documentMouseUpHandler, false);
			document.addEventListener('touchstart', documentMouseDownHandler, false);
			document.addEventListener('touchmove', documentTouchMoveHandler, false);
			document.addEventListener('touchend', documentMouseUpHandler, false);
			window.addEventListener('resize', windowResizeHandler, false);
			
			// Attempts to restore the game settings from saved data if there is any
			restoreSettings();
			
			// Hide the loading text now that the game is ready
			$("#preloader").fadeOut( 200, function() {
				$(this).hide();
			} );
			
			GameUI.initialize();
			
			// Make sure our player is defined, this should only happen once
			player = new Player(world.width *.5 + 5, world.height + worldYOffset + 90);
			
			// Force an initial resize to make sure the UI is sized correctly
			windowResizeHandler();
			
			// Work out where our last defensive shield is
			lastDefense = new LastDefense(world.width * .5 + 5, world.height + worldYOffset + 90);
			
			// If we are on a touch device, certain elements need to be configured differently
			if( UserProfile.isTouchDevice() ) {
				// TODO: Hide excess UI that does not work on small screens
			}
			
			// Activate offline mode if applicable
			if( !UserProfile.isOnline ) {
				activateOfflineMode();
			}
			
			explosions = [];
			particles = [];
			
			//showLevelPicker();
			
			changeState(STATE_HOME);

		}
	};
	
	/**
	 * 
	 */
	function changeState( newState ) {

		state = newState;
		
		// Items will be queued to either/show or hide
		// in the switch statement below
		var elementsToHide = [];
		var elementsToShow = [];
		
		switch (state) {
			case STATE_HOME:
				if (settings.soundEnabled) {
					GameWorld.sound(GameSound.STARTSCREEN);
				}
				
				elementsToShow.push(
					GameUI.elements.levelSelector,
					GameUI.elements.startButton
				);
				
				if( settings.highScore > 0 ) {
					elementsToShow.push( GameUI.elements.highScore );
				}
				
				break;
				
			case STATE_INSTRUCTIONS:
			case STATE_PLAYING:
				elementsToHide.push(
					GameUI.elements.levelSelector,
					GameUI.elements.highScore,
					GameUI.elements.startButton,
					GameUI.elements.logo,
					GameUI.elements.scoreOutcome
				);
				
				elementsToShow.push(
					GameUI.elements.levelIndicator,
					GameUI.elements.pauseButton,
					GameUI.elements.scoreOngoing
				);
				break;
				
			case STATE_GAMEOVER:
				elementsToHide.push(
					GameUI.elements.levelIndicator,
					GameUI.elements.pauseButton,
					GameUI.elements.scoreOngoing
				);
				
				elementsToShow.push(
					GameUI.elements.levelSelector,
					GameUI.elements.highScore,
					GameUI.elements.startButton,
					GameUI.elements.logo,
					GameUI.elements.scoreOutcome
				);
				
				break;
		}
		
		// Two perfectly symetrical lines! At last, my lifes work is complete.
		while( elementsToHide.length > 0 ) GameUI.hideElement( elementsToHide.pop() );
		while( elementsToShow.length > 0 ) GameUI.showElement( elementsToShow.pop() );
		
		// Set the body class to be the current state
		$( document.body ).attr( "class", state );
		
	}
	
	/**
	 * Callback when the sound has loaded
	 */
	this.soundLoaded = function()
	{
		soundAvailable = true;
		
		if(assetCount == 0)
			GameWorld.initialize();
	};
	
	/**
	 * Calls the GameSound
	 */
	this.sound = function(event)
	{
		if(soundAvailable && settings.soundEnabled)
			GameSound.send(event);
	};
	
	/**
	 * Activates the boss when it has
	 * animated its missiles in
	 */
	this.activateBoss = function()
	{
		bossActive = true;
	};
	
	/**
	 * Goes to the next level
	 */
	this.nextLevel = function()
	{
		level++;
		
		// Move to next levle if we have one
		if(level < levels.length)
		{
			blastRadius = levels[level].blastRadius;
			
			createBoss();
			player.resetShield();
	
			GameWorld.playCurrentLevelTrack();
			
			saveSettings();
			
			GameUI.updateHighScore();
			GameUI.updateLevelSelector();
			GameUI.updateLevelIndicator();
		}
		else
		{
			level = 0;
			score += 50000;
			gameOver();
		}
	};
	
	/**
	 * 
	 */
	this.playCurrentLevelTrack = function() {
		var track;
		switch(level)
		{
			case 0: track = GameSound.LEVEL_1; break;
			case 1: track = GameSound.LEVEL_2; break;
			case 2: track = GameSound.LEVEL_3; break;
			case 3: track = GameSound.LEVEL_4; break;
		}
		GameWorld.sound(track);
	}
	
	
	/**
	 * Subclass of GameWorld used to control and manipulate
	 * the UI depending on the current state of the game.
	 */
	var GameUI = new function(){
		
		this.container = null;
		this.panels = null;
		this.elements = {};
		
		this.initialize = function(){
			
			this.container = $('#ui');
			this.panels = $('#ui .panels');
			
	    	this.elements.logo = $('#logo');
			
	    	this.elements.levelIndicator = $('#level-indicator');
			this.elements.startButton = $('#start-button');
			this.elements.muteButton = $('#mute-button');
	    	this.elements.pauseButton = $('#pause-button');
			
	    	this.elements.levelSelector = $('#level-selector');
	    	this.elements.levelSelectorList = $('#level-selector-list');
			
	    	this.elements.scoreOngoing = $('#score-ongoing');
	    	this.elements.scoreOutcome = $('#score-outcome');
	    	this.elements.highScore = $('#high-score');
	    	
	    	this.elements.cursor = $('#cursor');
			
			// Listen for interaction with the mute button
			// this.elements.startButton.click( function() { 
			// 	startGame(); 
			// 	return false; 
			// });
			
			// Listen for interaction with the mute button
			this.elements.muteButton.click( function() { 
				GameUI.toggleMuteState(); 
				return false; 
			});
			
			// Listen for interaction with the pause button
			this.elements.pauseButton.click( function() { 
				GameUI.togglePauseState(); 
				return false; 
			} );
			
			// Initialize the level selector
			// this.createLevelSelector();
			// this.updateLevelSelector();
			
			// Show the high score, if there is one
			this.updateHighScore();
			
			// Make sure the mute button is reflecting the internal flag
			this.updateMuteState();
			
			this.showElement( this.elements.muteButton );
			
//			$(document).focusout(function(){
//				pauseGame();
//			});
		}
		
		/**
		 * 
		 */
		this.showElement = function( element, time ) {
			if( element && !element.shown ) {
				element.shown = true;
				element.css({ display: "block" }).fadeIn( time || 400 );
			}
		}
		this.hideElement = function( element, time ) {
			if( element && element.shown ) {
				element.shown = false;
				element.fadeOut( time || 0, function() {
					if ($(this).css("opacity") == 0) {
						$(this).hide();
					}
				} );
			}
		}
		
		/**
		 * Updates the positioning and size of the UI.
		 */
		this.updateLayout = function( x, y, width, height ) {
			this.container.css( {
				position: 'relative',
				left: x,
				top: y + ( height - this.container.height() ) * 0.5,
				width: width,
				height: height
			} );
			
			this.panels.css( {
				position: 'relative',
				left: ( width - this.panels.width() ) * 0.5,
				top: ( height - this.panels.height() ) * 0.5
			} );
			
			this.elements.levelIndicator.css( {
				position: 'fixed',
				top: y + height - 70
			} );
		}
		
		this.toggleMuteState = function() {
			settings.soundEnabled = !settings.soundEnabled;
			
			this.updateMuteState();
			
			saveSettings();
		}
		
		this.togglePauseState = function() {
			if( this.elements.pauseButton.hasClass( 'resume' ) ) {
				paused = false;
			}
			else {
				paused = true;
			}
			
			this.elements.pauseButton.toggleClass('resume');
		}
		
		/**
		 * game is paused
		 */
		this.pauseButtonStateOn = function() {
			this.elements.pauseButton.addClass('resume');
		}
		
		/**
		 * game is playing
		 */
		this.pauseButtonStateOff = function() {
			this.elements.pauseButton.removeClass('resume');
		}
		
		/**
		 * Called once when the UI is initialized to create
		 * the level listing.
		 */
		this.createLevelSelector = function() {
			var totalLevels = levels.length;
			
			this.elements.levelSelectorList.html('');
			
			for( var i = 0; i < totalLevels; i++ ) {
				this.elements.levelSelectorList.append( $( "<li><span>"+(i+1)+"</span></li>" ) );
			}
			
			$( "li", this.elements.levelSelectorList ).click( function() {
				if (!$(this).hasClass("disabled")) {
					GameUI.onLevelClicked($(this));
				}
			} );
		}
		
		/**
		 * Updates the level selector to reflect the current
		 * user progression and selection.
		 */
		this.updateLevelSelector = function(){
			$( "li", this.elements.levelSelectorList ).attr("class","enabled");
			$( "li", this.elements.levelSelectorList ).each( function( i ) {
				if( i > settings.unlockedLevels ) {
					$(this).attr("class", "disabled");
				}
				
				if( i == settings.selectedLevel ) {
					$(this).attr("class", "current");
				}
			} );
		}
		
		/**
		 * Called every time a level is clicked in the
		 * level selector component.
		 */
		this.onLevelClicked = function( element ) {
			level = element.index();
			settings.selectedLevel = element.index();
			
			this.updateLevelSelector();
			
			saveSettings();
			
			startGame();
		}
		
		/**
		 * Updates the displayed score.
		 */
		this.updateScore = function(){
			$( "span", this.elements.scoreOngoing ).html( this.padNumber( score, 7 ) );
		}
		
		/**
		 * Updates the displayed high score.
		 */
		this.updateHighScore = function(){
			$( "span", this.elements.highScore ).html( this.padNumber( settings.highScore, 7 ) );
			$( "span", this.elements.scoreOutcome ).html( this.padNumber( score, 7 ) );
		}
		
		/**
		 * Updates the level indication (visible during gameplay).
		 */
		this.updateLevelIndicator = function (){
			$( "span", this.elements.levelIndicator ).html( 'Level ' + ( level + 1 ) );
		}
		
		/**
		 * Updates the state of the mute button to match the 
		 * current settings.
		 */
		this.updateMuteState = function(){
			if( settings.soundEnabled ) {
				this.elements.muteButton.removeClass( "sound-is-off" );
				GameSound.send( GameSound.UNMUTE );
			}
			else {
				this.elements.muteButton.addClass( "sound-is-off" );
				GameSound.send( GameSound.MUTE );
			}
			
			this.elements.muteButton.fadeIn(300);
		}
		
		/**
		 * Pads a number with preceeding zero's until it matches
		 * the specified length.
		 */
		this.padNumber = function( number, length ) {
			var padded = number.toString();
			
			// Pad with zeros until the desired length is reached
			while( padded.length < length ) 
				padded = '0' + padded;
			
			return padded;
		}
		
		/**
		 * Used to determine if a click area is valid, used to
		 * make sure no constellations are drawn while trying
		 * interact with UI elements.
		 */
		this.isValidClickArea = function( x, y ) {
			
			var forbiddenZones = [
				{ x: world.width - 150, y: world.height - 40, width: 150, height: 40 }
			];
			
			while( forbiddenZones.length > 0 ) {
				var zone = forbiddenZones.pop();
				
				if( x > zone.x && x < zone.x + zone.width && y > zone.y && zone.y < zone.y + zone.height ) {
					return false;
				}
			}
			
			// If we made it to the end - the click was not 
			// in any of the forbidden zones
			return true;
			
		}
		
		this.updateCursorPosition = function( x, y ) {
			this.elements.cursor.css({left: x, top: y});
		}
	}
	
	/**
     * Restores settings from local storage if there are
     * any historical records.
     */
    function restoreSettings(){
        if (UserProfile.suportsLocalStorage()) {
            var hasPlayedBefore = localStorage['hasPlayedBefore'];
            var selectedLevel = parseInt( localStorage['selectedLevel'] );
            var unlockedLevels = parseInt( localStorage['unlockedLevels'] );
            var highScore = parseInt( localStorage['highScore'] );
            
			settings.soundEnabled = localStorage['soundEnabled'] != 'false';
			
            if (hasPlayedBefore) {
                settings.hasPlayedBefore = hasPlayedBefore;
            }
            
            if (selectedLevel) {
                settings.selectedLevel = selectedLevel;
                level = selectedLevel;
            }
			
            if (unlockedLevels) {
                settings.unlockedLevels = unlockedLevels;
            }
			
            if (highScore) {
                settings.highScore = highScore;
            }
        }
    }
    
    /**
     * Pushes the current settings to local history.
     */
    function saveSettings() {
		settings.unlockedLevels = Math.max( settings.unlockedLevels, level );
		settings.highScore = Math.max( settings.highScore, score );
		
        if (UserProfile.suportsLocalStorage()) {
            localStorage['hasPlayedBefore'] = settings.hasPlayedBefore;
            localStorage['soundEnabled'] = settings.soundEnabled;
            localStorage['selectedLevel'] = settings.selectedLevel;
            localStorage['unlockedLevels'] = settings.unlockedLevels
            localStorage['highScore'] = settings.highScore;
        }
		
		GameUI.updateLevelSelector();
		GameUI.updateHighScore();
    }
	
	/**
	 * Activates the offline version of the game. Any UI or 
	 * functionality that relies on server side communication
	 * should be disabled here.
	 */
	function activateOfflineMode()
	{
		
	}
	
	/**
	 * TODO Replace with proper UI
	 */
	function showLevelPicker()
	{
		GameWorld.sound(GameSound.STARTSCREEN);
		startGame();
	}
	
	/**
	 * Starts the game going
	 */
	function startGame( fromLevel )
	{  
		if(gameTimeoutId) {
			clearTimeout(gameTimeoutId);
		}
		
		changeState( STATE_PLAYING );
		
		// create the boss character
		createBoss();
		
		// set the blast radius
		blastRadius = levels[level].blastRadius;
		
		// Initiate the main render loop of the game
		gameTimeoutId = setTimeout(function() {
			loop();
			gameTimeoutId = setTimeout(arguments.callee, 1000 / FRAMERATE);
		}, 1000 / FRAMERATE);

		// Make sure the time is correct from get go
		time = new Date().getTime();
		
		score = 0;
		
		playing = true;
		
		player.resetShield();
		
		GameWorld.playCurrentLevelTrack();
		
		GameUI.updateHighScore();
		GameUI.updateLevelSelector();
		GameUI.updateLevelIndicator();
	}
	
	/**
	 * 
	 */
	function gameOver() {
		
		saveSettings();
		
		GameUI.updateHighScore();
		GameUI.updateLevelSelector();
		GameUI.updateLevelIndicator();
		
		GameWorld.sound(  GameSound.GAME_OVER );
		
		playing = false;
		bossActive = false;
		
		player.resetShield();
		boss.resetRings();
		
		changeState( STATE_GAMEOVER );
		gameStatus = "stop";
	}
	
	/**
	 * Helper method for checking if the current
	 * state of the game allows for drawing new
	 * constellations.
	 */
	function isDrawingEnabled() {
		return playing && !paused && GameUI.isValidClickArea( mouse.x, mouse.y );
	}
	
	/**
	 * Event handler for document.onmousemove.
	 */
	function documentMouseMoveHandler(event)
	{
		mouse.x = event.clientX - (window.innerWidth - world.width) * 0.5;
		mouse.y = event.clientY - (window.innerHeight - world.height) * 0.5;
		
		if ( mouse.down && isDrawingEnabled() )
		{
			player.updateDrawing( mouse, world );
		}
		
		if( playing && mouse.y > world.height * .5 && mouse.x > 0 && mouse.x < world.width)
		{
			if(isMac)
			{
				gameDiv.style.cursor = 'none';
				GameUI.showElement(GameUI.elements.cursor);
				GameUI.updateCursorPosition(event.clientX-11, Math.min(event.clientY - 19, world.height - 30));
			}
			else
				gameDiv.style.cursor = 'crosshair';
		}
		else
		{
			gameDiv.style.cursor = 'default';
			
			if(isMac)
				GameUI.hideElement(GameUI.elements.cursor, 100);
		}
	}
	
	/**
	 * Event handler for document.onmousedown.
	 */
	function documentMouseDownHandler(event)
	{
		if (gameStatus == "stop") {
			gameStatus = "playing";
			startGame();
			return ;
		}

		mouse.down = true;
		
		if (isDrawingEnabled()) {
			GameUI.elements.cursor.addClass('active');
			player.startDrawing(mouse, world);
			event.preventDefault();
		}
	}
	
	/**
	 * Event handler for document.onmouseup.
	 */
	function documentMouseUpHandler(event)
	{
		mouse.down = false;
		
		if( isDrawingEnabled() )
		{
			player.finishDrawing( mouse, world );
			player.simplifyShield();
			GameUI.elements.cursor.removeClass('active');
		}
	}
	
	/**
	 * Event handler for document.ontouchstart.
	 */
	function documentTouchStartHandler(event)
	{
		if(event.touches.length == 1) {
			event.preventDefault();

			mouse.x = event.touches[0].pageX - (window.innerWidth - world.width) * 0.5;
			mouse.y = event.touches[0].pageY - (window.innerHeight - world.height) * 0.5;
			
			mouse.down = true;
		}
	}
	
	/**
	 * Event handler for document.ontouchmove.
	 */
	function documentTouchMoveHandler(event)
	{  
		// if(event.touches.length == 1) {
		// 	event.preventDefault();

		// 	mouseX = event.touches[0].pageX - (window.innerWidth - world.width) * 0.5 - 60;
		// 	mouseY = event.touches[0].pageY - (window.innerHeight - world.height) * 0.5 - 30;
		// }

		// mouse.x = event.clientX - (window.innerWidth - world.width) * 0.5;
		// mouse.y = event.clientY - (window.innerHeight - world.height) * 0.5;
		
		event.preventDefault();

		mouse.x = event.touches[0].pageX - (window.innerWidth - world.width) * 0.5;
		mouse.y = event.touches[0].pageY - (window.innerHeight - world.height) * 0.5;

		if ( mouse.down && isDrawingEnabled() )
		{
			player.updateDrawing( mouse, world );
		}
		
		if( playing && mouse.y > world.height * .5 && mouse.x > 0 && mouse.x < world.width)
		{
			if(isMac)
			{
				gameDiv.style.cursor = 'none';
				GameUI.showElement(GameUI.elements.cursor);
				GameUI.updateCursorPosition(event.touches[0].pageX-11, Math.min(event.touches[0].pageY - 19, world.height - 30));
			}
			else
				gameDiv.style.cursor = 'crosshair';
		}
		else
		{
			gameDiv.style.cursor = 'default';
			
			if(isMac)
				GameUI.hideElement(GameUI.elements.cursor, 100);
		}
	}
	
	/**
	 * Event handler for document.ontouchend.
	 */
	function documentTouchEndHandler(event)
	{
		mouse.down = false;
	}
	
	/**
	 * Event handler for window.onresize.
	 */
	function windowResizeHandler()
	{
		// Update the game size
		world.width 				= UserProfile.isTouchDevice() ? window.innerWidth : DEFAULT_WIDTH;
		world.height 				= UserProfile.isTouchDevice() ? window.innerHeight : DEFAULT_HEIGHT;
		
		if(gameDiv.offsetHeight < world.height)
			world.height			= gameDiv.offsetHeight;
		
		worldYOffset				= (DEFAULT_HEIGHT - world.height) * .15;
		
		// Resize the canvas
		canvas.width 				= world.width;
		canvas.height 				= world.height;
		
		// Determine the centered x/y position of the canvas
		var cvx 					= (window.innerWidth - world.width) * 0.5;
		var cvy 					= (window.innerHeight - world.height) * 0.5;
		
		// Move the canvas
		canvas.style.position 		= 'absolute';
		canvas.style.left 			= cvx + 'px';
		canvas.style.top 			= cvy + 'px';

		backgroundDiv.style.position = 'absolute';
		backgroundDiv.style.left 	= cvx + 'px';
		backgroundDiv.style.top 	= cvy + 'px';
		backgroundDiv.style.width	= world.width + 'px';
		backgroundDiv.style.height	= world.height + 'px';
		
		GameUI.updateLayout( cvx, cvy, world.width, world.height );
		
		bossDiv.style.top			= cvy - worldYOffset + 'px';
		playerDiv.style.bottom		= cvy - worldYOffset + 'px';
		
		if(boss)
			boss.position.y			= -(worldYOffset + 80);
		player.position.y			= world.height + worldYOffset + 90;
		
		// Work out where our last defensive shield is
		lastDefense = new LastDefense(world.width * .5 + 5, world.height + worldYOffset + 90);
		updateLastDefense(true);
		
		// finally reposition any of the shield points
		for(var i = 0; i < player.shieldPoints.length; i++)
			player.shieldPoints[i].position.y = (player.shieldPoints[i].position.y / lastWorldHeight) * world.height;

		// keep a track on the last world height
		lastWorldHeight				= world.height;
	}
	
	/**
	 * Creates the boss character
	 */
	function createBoss()
	{
		delete boss;
		boss = new Boss(world.width  * .5,	// x
				-(worldYOffset + 80),		// y
				levels[level].aggression,	// aggression level
				levels[level].fireRate,		// fire rate
				levels[level].ringCount);	// ring count
	}
	
	/**
	 * Called on every frame to update the game properties
	 * and render the current state to the canvas.
	 */
	function loop()
	{
		
		// Only update and render the game if we are
		// NOT paused
		if ( !paused ) {
			delta = new Date().getTime() - time;
			
			// set the dirty region for the whole canvas
			dirtyRegion.inflate(0, 0);
			dirtyRegion.inflate(world.width, world.height);
			
			// Clear all pixels in the dirty region
			context.clearRect(dirtyRegion.left - DIRTY_PADDING, dirtyRegion.top - DIRTY_PADDING, dirtyRegion.right - dirtyRegion.left + (DIRTY_PADDING * 2), dirtyRegion.bottom - dirtyRegion.top + (DIRTY_PADDING * 2));
			
			// update and render
			update();
			render();
			
			if (playing) {
				score += delta;
			}
			
			// Display the up to date score in the UI
			GameUI.updateScore();
		}
		
		// set the time for the next
		// loop round
		time = new Date().getTime();
	}
	
	/**
	 * Updates the game by stepping forward one frame. Updated
	 * properties, especially movement, should be scaled by the
	 * 'delta'.
	 */
	function update()
	{
		TWEEN_MANAGER.update();
		
		updateLastDefense();
		updateMissiles();
		updateBoss();
	}
	
	/**
	 * Sets a new angle for the last defense
	 */
	function updateLastDefense(force)
	{
		// work out the angle the mouse makes with the bottom middle
		var ang 				= Math.atan2(mouse.y - world.height, mouse.x - world.width * .5) + (Math.PI*.5);
		var currentAngle		= lastDefense.angle;
		lastDefense.targetAngle = Math.min(Math.max(-90,ang), 90);
		lastDefense.angle		+= (lastDefense.targetAngle - lastDefense.angle) / 5;
		
		if(force)
			lastDefense.angle = lastDefense.targetAngle;
		
		// now we need to update the shield points
		var points				= lastDefense.shieldPoints.length;
		while(points--)
			lastDefense.shieldPoints[points].rotate(lastDefense.angle - currentAngle, lastDefense.position);
	}
	
	/**
	 * Updates the boss's missile rings based
	 * on its aggression level
	 */
	function updateBoss()
	{
		// assuming there is no
		// aggression spin the outer rings
		if(boss.aggression != 0)
		{
			for(var i = 0; i < boss.rings.length; i++)
				boss.rings[i].rotation += boss.aggression;
		}
		
		// check if the boss should fire
		// a missile now
		var now = new Date().getTime();
		if(bossActive && now - boss.lastFired > boss.fireRate)
			boss.chooseMissileAndFire();
	}
	
	/**
	 * Runs an update against the missiles
	 */
	function updateMissiles()
	{
		// go through each missile
		for( var i = 0; i < boss.missiles.length; i++ )
		{
			var missile = boss.missiles[i];
			var distanceToPlayer = missile.distanceTo({x:player.position.x, y:player.position.y});
			
			// update the missile position
			missile.update( world );
			
			// if this missile is dead remove
			// it from the canvas
			if (missile.dead) {
				boss.missiles.splice(i--, 1);
			}
			// Only check for line collisions if this missile is floating
			else if (missile.floating)
			{
				// check for proximity to boss
				if(missile.distanceTo({x:boss.position.x, y:boss.position.y}) < BOSS_RADIUS && missile.velocity.y < 0)
				{
					checkForRingIntersectionAndExplode(i);		
				}
				
				// check for proximity to player
				else if(distanceToPlayer < (PLAYER_RADIUS + 50) && missile.velocity.y > 0)
				{
					if(playing)
						checkForShieldIntersection(lastDefense.shieldPoints, missile, GameSound.PADDLE_BOUNCE);
					
					if(distanceToPlayer < PLAYER_RADIUS)
					{
						createExplosion(missile);	
						missile.dead = true;
						if( playing )
						{
							GameWorld.sound(GameSound.MY_PLANET_HIT);
							gameOver();
						}
					}
				}
				
				// check for proximity to constellation shields
				else if(missile.position.y > (world.height * .5) - 10)
				{
					checkForShieldIntersection(player.shieldPoints, missile, GameSound.LINE_BOUNCE);
				}
			}
		}
	}
	
	/**
	 * Checks if a missile is intersecting with a shield
	 * and, if so, bounces the missile away
	 */
	function checkForShieldIntersection(points, missile, sound)
	{
		shieldLoop:
		for (var j = 0, len = points.length; j < len - 1; j++)
		{
			var nodeA = points[j];
			var nodeB = points[j + 1];
			
			if(nodeB.lineStart)
				continue;
			
			// check that the line segment is active
			if(!(nodeA.activated || nodeB.activated))
				continue;
			
			// get all the position info on the line
			// segment ends and the missile
			var x1 = nodeA.position.x;
			var x2 = nodeB.position.x;
			var x3 = missile.position.x;
			
			var y1 = nodeA.position.y;
			var y2 = nodeB.position.y;
			var y3 = missile.position.y;
			
			// work out the length of the line and whether
			// or not the missile is potentially intersecting
			// the line
			var d  = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
			var u  = (((x3 - x1) * (x2 - x1)) + ((y3 - y1) * (y2 - y1))) / (d * d);
			
			// if we know we are in the right segment
			if(u > 0 && u < 1)
			{
				// work out where the intersection
				// point exactly should be
				var ix = x1 + (u*(x2-x1));
				var iy = y1 + (u*(y2-y1));
										
				// Detail of movement simulation
				var iter = Math.max(CCD_QUALITY, missile.angularVelocity);
				
				// do the CCD loop
				while (iter--)
				{
					// work out the position for this iteration
					var point = {
						x: missile.previousPosition.x + (missile.position.x - missile.previousPosition.x) * (iter / CCD_QUALITY),
						y: missile.previousPosition.y + (missile.position.y - missile.previousPosition.y) * (iter / CCD_QUALITY)
					};
					
					// check for proximity
					if(Math.sqrt((point.x - ix) * (point.x - ix) + (point.y - iy) * (point.y - iy)) < SHIELD_PROXIMITY_THRESHOLD)
					{
						score += 400;
						
						// work out our angles
						var missileToLineAngle			= Math.atan2(missile.velocity.y, missile.velocity.x);
						var normal 						= Math.atan2((y1 - y2), (x1 - x2)) - Math.PI/2;
						var missileToNormalAngle		= normal - missileToLineAngle;
						
						// now work out the exit angle
						// for the missile after the collision
						var newMissileToNormalAngle 	= normal + missileToNormalAngle;
						
						// update the missile's velocity and position
						missile.velocity.x				= -Math.cos(newMissileToNormalAngle) * 5;
						missile.velocity.y 				= -Math.sin(newMissileToNormalAngle) * 5;
						
						missile.position.x				= ix - Math.cos(newMissileToNormalAngle) * 5;
						missile.position.y				= iy - Math.sin(newMissileToNormalAngle) * 5;
						
						// reset the missile tail length
						missile.tailSize				= 0;
						
						// set the angular velocity
						missile.angularVelocity			= Math.ceil(Math.sqrt(missile.velocity.x * missile.velocity.x + missile.velocity.y * missile.velocity.y))
						
						// update the line ends and starts
						// so that we break this line segment
						// but only if the line does not have
						// an invincible point
						if(!nodeA.invincible)
							nodeA.life--;
						
						if(sound)
							GameWorld.sound(sound);
						
						// we don't need to do
						// anything else so quit
						break shieldLoop;
					}
				}
			}
		}
	}
	
	/**
	 * Handles the returning missile's collision with the
	 * boss's rings and then kills off a squad of missiles
	 * that are in the blast radius
	 */
	function checkForRingIntersectionAndExplode(missileIndex)
	{
		// get the missile and work out its
		// proximity to the boss
		var missile					= boss.missiles[missileIndex];
		var distanceToBoss 			= missile.distanceTo({x:boss.position.x, y:boss.position.y});
		
		if(distanceToBoss >= 290 && boss.rings.length)
		{
			// work out which ring the collision
			// should take place in
			var targetRing 				= Math.round((distanceToBoss - 290) / 15);
			var ring 					= boss.rings[targetRing];
			
			if(!ring)
				return;
			
			var distanceToMissile		= Number.POSITIVE_INFINITY;
			var ringRadius				= 290 + (targetRing * 15);
			var ringStep				= Math.PI * 2 / ring.missiles.length;
			
			// now go through each missile in the ring
			for(var r = 0; r < ring.missiles.length; r++)
			{
				// calculate the missile's position
				var xPos = boss.position.x + Math.cos(r * ringStep + ring.rotation) * ringRadius;
				var yPos = boss.position.y + Math.sin(r * ringStep + ring.rotation) * ringRadius;
				
				// if it's off the top of the screen
				// or the missile has been fired
				// skip it
				if(yPos < -5 || ring.missiles[r])
					continue;
				
				var thisDistanceToMissile = missile.distanceTo({x:xPos, y:yPos});
				if(thisDistanceToMissile < 10)
				{
					// we found the missile that we collided with
					// so now we need to do the splash damage
					// and take out a few other missiles
					for(var ir = 0; ir < boss.rings.length; ir++)
					{
						// work round from the exploded missile's
						// index back and forth removing any that
						// are within range
						var innerRing			= boss.rings[ir];
						var innerRingRadius		= 290 + (ir * 15);
						var startIndex 			= r - 5;
						var endIndex 			= r + 5;
						
						while(endIndex > startIndex)
						{
							// calculate the proximity of this missile to
							// the exploded one
							var innerRingXPos = boss.position.x + Math.cos(endIndex * ringStep + innerRing.rotation) * innerRingRadius;
							var innerRingYPos = boss.position.y + Math.sin(endIndex * ringStep + innerRing.rotation) * innerRingRadius;
							var distanceToInnerMissile = missile.distanceTo({x:innerRingXPos,y:innerRingYPos});
							
							// if it's close enough to our exploded missile
							// the kill it off as well!
							if(distanceToInnerMissile < blastRadius)
							{
								var indexToRemove = (endIndex + innerRing.missiles.length)%innerRing.missiles.length;
								innerRing.missiles[indexToRemove] = true;
								
								score += 1000;
							}
							endIndex--;
						}
					}

					score += 5000;

					ring.missiles[r] = true;
					missile.dead = true;
					
					GameWorld.sound(GameSound.ENEMY_SHIELD_HIT);
					
					createExplosion(missile);
				}
			}
		}
		else if(distanceToBoss < 240 && playing)
		{
			missile.dead = true;
			createExplosion(missile);

			score += 10000;
			
			GameWorld.nextLevel();
			GameWorld.sound(GameSound.ENEMY_PLANET_HIT);
		}
	}
	
	function createExplosion(missile)
	{
		var explosion = new Explosion(missile.position.x, missile.position.y, EXPLOSION_BIG);
		
		// add a major explosion
		explosions.push(explosion);
		
		/// tween the animation of the explosion
		var explosionTween = new TWEEN.Tween({e:explosion, life:0});
		explosionTween.to(1.2, {life:1});
		explosionTween.easing(TWEEN.Easing.Exponential.EaseOut);
		explosionTween.onUpdate(updateExplosion);
		explosionTween.onComplete(removeExplosion);
		explosionTween.start();
	}
	
	/**
	 * Renders the current state of the game world.
	 */
	function render()
	{
		renderLastDefense();
		renderPlayer();
		renderMissiles();
		renderBoss();
		renderExplosions();
		renderUI();
	}
	
	/**
	 * TODO Replace with proper UI work
	 */
	function renderUI()
	{
		if (playing) {
			context.drawImage(sprite, 0, 330, 1000, 25, 0, Math.round(world.height * .5) - 20, 1000, 25);
		}
	}
	
	/**
	 * Renders the last defense paddle
	 */
	function renderLastDefense()
	{
		if ( playing )
		{
			// we need to move and orientate the
			// graphic to the missile position
			// and angle
			context.save();
			context.translate(lastDefense.position.x, lastDefense.position.y);
			context.rotate(lastDefense.angle);
			
			// draw the missile
			context.drawImage(sprite,242,168,135,150,-67,-(PLAYER_RADIUS+50),135,150);
			
			context.restore();
		}
	}
	
	/**
	 * Render the boss's rings
	 */
	function renderBoss()
	{
		context.save();
		
		// go through each ring
		for(var i = 0, len = boss.rings.length; i < len; i++)
		{
			// get the ring and set up the
			// variables for this ring
			var ring 				= boss.rings[i];
			var ringRadius			= ring.radius;
			var ringStep			= Math.PI * 2 / ring.missiles.length;
			context.globalAlpha		= .2 + (i/boss.rings.length) * .8;
			
			// now go through each missile in the ring
			for(var r = 0; r < ring.missiles.length; r++)
			{
				// calculate the missile's position
				var xPos = boss.position.x + Math.cos(r * ringStep + ring.rotation) * ringRadius;
				var yPos = boss.position.y + Math.sin(r * ringStep + ring.rotation) * ringRadius;
				
				// if it's off the top of the screen
				// or the missile has been fired
				// skip it
				if(yPos < -5 || ring.missiles[r])
					continue;
				
				// draw the missile
				context.beginPath();
				context.fillStyle = "#FFFFFF";
				context.arc(xPos - 5, yPos - 5, 5, 0, Math.PI * 2, true);
				//context.shadowColor = "#FFFFFF";
				//context.shadowBlur = 5;
				context.fill();
				context.closePath();
			
			
				//context.drawImage(sprite,0,0,21,21,xPos-11,yPos-11,21,21);
			}
		}
		context.restore();
	}
	
	/**
	 * Render the player or, more accurately, its shield
	 */
	function renderPlayer()
	{
		// work through the shield
		for( var i = 0, len = player.shieldPoints.length; i < len; i++ )
		{
			// get the node
			var prevNode	= player.shieldPoints[i-1];
			var node 		= player.shieldPoints[i];
			var nextNode 	= player.shieldPoints[i+1];
			
			if(node.lineEnd && node.activated)
			{
				// draw a star
				context.drawImage(sprite,	// sprite
						0,					// sx
						24,					// sy
						18,					// sw
						18,					// sh
						node.position.x-9,	// dx
						node.position.y-8,	// dy
						18,					// dw
						18);				// dh
				
				continue;
			}
			
			// if this node is the start and the end
			// it's an orphan so remove it
			if(node.life == 0)
			{
				
				if(node)
					node.lineEnd = true;
				if(nextNode)
					nextNode.lineStart = true;
				
				if(node.lineStart && node.lineEnd)
				{
					player.shieldPoints.splice(i, 1);
					len--;
				}

				i--;
				continue;
			}
			
			// if this node is activated
			if(node.activated)
			{
				// set up the line as thin
				// and white
				context.lineWidth 	= 1;

				context.strokeStyle = 'rgba(255,255,255,'+(node.life * .2)+')';
				
				lastNodeLife = node.life;
				
				// draw the star
				context.drawImage(sprite,	// sprite
						0,					// sx
						24,					// sy
						18,					// sw
						18,					// sh
						node.position.x-9,	// dx
						node.position.y-8,	// dy
						18,					// dw
						18);				// dh
									
			}
			else
			{
				// the thicker 'holding' line
				context.lineCap 	= "round";
				context.lineWidth 	= 8;
				context.strokeStyle = 'rgba(240,240,240,0.2)';
			}
			
			if(node.activated || (node.lineStart || i == 0))
			{
				context.beginPath();
				context.moveTo( node.position.x, node.position.y );
			}

			if(nextNode)
				context.lineTo( nextNode.position.x, nextNode.position.y );
			
			if(node.activated || (node.lineEnd || i == len-1))
			{
				context.stroke();
				context.closePath();
			}
		}
	}
	
	/**
	 * Renders the 'active' missiles
	 */
	function renderMissiles()
	{
		// go through the missiles
		for(var i = 0; i < boss.missiles.length; i++)
		{
			var m 		= boss.missiles[i];
			var mAngle 	= Math.atan2(m.velocity.y , m.velocity.x);
			var mVel	= Math.sqrt(m.velocity.x * m.velocity.x + m.velocity.y * m.velocity.y) / 7;
			
			// update the missile's flicker value
			m.flicker 	= 1-m.flicker;
			m.tailSize	+= (1 - m.tailSize) * .15;
			var scale	= 1;
			
			// we need to move and orientate the
			// graphic to the missile position
			// and angle
			context.save();
			context.translate(m.position.x, m.position.y);
			context.rotate(mAngle - Math.PI * .5);
			
			context.drawImage(sprite,					// sprite
							  390,						// sx
							  0,						// sy
							  22,						// sw
							  160,						// sh
							  -11 * mVel,				// dx
							  -85 * mVel * m.tailSize,	// dy
							  22 * mVel,				// dw
							  160 * mVel * m.tailSize);	// dh
			
			context.globalAlpha = m.flicker ? MISSILE_FLICKER_LOWER : MISSILE_FLICKER_UPPER;
			
			// now actually draw the missile graphic
			context.drawImage(sprite,					// sprite
							  60,						// sx
							  15 + (m.color*80),		// sy
							  50,						// sw
							  50,						// sh
							  -25 * scale,				// dx
							  -25 * scale,				// dy
							  50 * scale,				// dw
							  50 * scale);				// dh
			
			// undo all the translations
			context.restore();
		}
	}
	
	/**
	 * Handles the rendering of all collision explosions
	 */
	function renderExplosions()
	{
		for(var e = 0; e < explosions.length; e++)
		{
			var explosion 	= explosions[e];
			var size		= explosion.size * explosion.radius;
			var sizeInner	= explosion.size * explosion.radius;
			
			// now actually draw the missile graphic
			context.globalAlpha = 1-explosion.size;
			context.drawImage(sprite,						// sprite
							  242,							// sx
							  0,							// sy
							  135,							// sw
							  135,							// sh
							  explosion.position.x-(size * .5),	// dx
							  explosion.position.y-(size * .5),	// dy
							  size,							// dw
							  size);						// dh
			
			context.globalAlpha = 1;
		}
	}
	
	/**
	 * Updates the explosion size and alpha
	 */
	function updateExplosion()
	{
		if(this.e)
		{
			this.e.size = this.life;
			
			if(this.e.size > 0 && typeof(this.ringIndex) != "undefined")
				boss.rings[this.ringIndex].missiles[this.indexToRemove] = true;
		}
	}
	
	/**
	 * Locates the expired explosion
	 * and removes it from the array 
	 * because we don't need to track it
	 */
	function removeExplosion()
	{
		var i = explosions.length;
		while(i--)
		{
			if(explosions[i] == this.e)
			{
				explosions.splice(i, 1);
				break;
			}
		}
	}
};


/**
 * Represents the player
 */ 
function Player( x, y )
{
	this.dead 				= false;
	this.drawing 			= false;
	this.position			= { x: x || 0, y: y || 0 };
	this.shield 			= [];
	this.shieldPoints 		= [];
	this.startIndex 		= 0;
	this.endIndex 			= 0;
	this.SHIELD_MAX_POINTS	= 14;
}

Player.prototype = new Point();

Player.prototype.resetShield = function()
{
	this.shieldPoints = [];
}

/**
 * Handler for when the user starts drawing a new constellation
 */
Player.prototype.startDrawing = function(p, world)
{
	this.drawing 		= true;
	this.startIndex 	= this.shieldPoints.length;
	
	p.y = Math.max(p.y, world.height * .5);
	this.shieldPoints.push(new ShieldNode(p.x, p.y, true, false));
	
	GameWorld.sound(GameSound.START_DRAW);
}

/**
 * Handler for when the user moves the mouse while
 * drawing a new constellation
 */
Player.prototype.updateDrawing = function(p, world)
{
	// if we have exceeded the shield length
	if(this.shieldPoints.length > this.SHIELD_MAX_POINTS)
	{
		// stop drawing and ensure
		// the last point is marked
		// as the line end
		this.shieldPoints.shift();

		GameWorld.sound(GameSound.REMOVE_LINE);
		
		if(this.shieldPoints.length)
		{
			this.startIndex--;
			this.startIndex = Math.max(0, this.startIndex);
			this.shieldPoints[0].lineStart = true;
		}
	}
	
	p.y = Math.max(p.y, world.height * .5);
	this.shieldPoints.push(new ShieldNode(p.x, p.y, false, false));
}

/**
 * Handler for when the user ends drawing the constellation
 */
Player.prototype.finishDrawing = function(p, world)
{
	this.drawing 	= false;
	this.endIndex 	= this.shieldPoints.length;
	
	p.y = Math.max(p.y, world.height * .5);
	this.shieldPoints.push(new ShieldNode(p.x, p.y, false, true));
	
	while(this.shieldPoints.length > this.SHIELD_MAX_POINTS)
	{
		this.shieldPoints.shift();
		this.shieldPoints[0].lineStart = true;
	}
	
	GameWorld.sound(GameSound.STOP_DRAW);
}

/**
 * Simplify the shield once the user
 * has drawn their shape for it
 */
Player.prototype.simplifyShield = function()
{
	var lastShieldPoint;
	
	// go through each point
	for(var i = 0; i < this.shieldPoints.length; i++)
	{
		var shieldPoint = this.shieldPoints[i];
		if((!lastShieldPoint) || shieldPoint.lineStart || shieldPoint.lineEnd)
		{
			lastShieldPoint = shieldPoint;
			shieldPoint.activated = true;
			continue;
		}
		
		// if it's too close to the last point
		// remove it from the array
		var distToLastPoint = shieldPoint.distanceTo(lastShieldPoint.position);
		if(distToLastPoint < 40)
		{
			this.shieldPoints.splice(i--, 1);
		}
		else
		{
			if(distToLastPoint > 200)
			{
				lastShieldPoint.lineEnd = true;
				shieldPoint.lineStart = true;
				
				if(lastShieldPoint.lineStart && lastShieldPoint.lineEnd)
					lastShieldPoint.life = 0;
				
				if(shieldPoint.lineStart && shieldPoint.lineEnd)
					shieldPoint.life = 0;
			}
			
			shieldPoint.activated = true;
			lastShieldPoint = shieldPoint;		
		}
	}
}

/**
 * Represents one node in the line of which a shield
 * is built up.
 */
function ShieldNode(x, y, lineStart, lineEnd)
{
	this.activated 	= false;
	this.invincible = false;
	this.life		= 2;
	this.position 	= { x: x || 0, y: y || 0 };
	this.birthTime 	= new Date().getTime();
	this.lineStart 	= lineStart || false;
	this.lineEnd 	= lineEnd || false;
}
ShieldNode.prototype = new Point();

/**
 * Represents the big boss
 */
function Boss(x, y, aggression, fireRate, ringCount)
{
	this.fireRate 	= fireRate * 1000;
	this.lastFired 	= new Date().getTime();
	this.dead 		= false;
	this.position 	= {x: x || 0, y: y || 0 };
	this.rings 		= [];
	this.missiles	= [];
	var i = 0, q = 0;
	
	if(fireRate)
	{
		// push the rings on
		while(i < ringCount)
		{
			this.rings.push(new BossRing(290 + i * 15));
			i++;
		}
		
		// now do a second pass
		while(q < ringCount)
		{
			// tween the rings in
			var ringTween = new TWEEN.Tween({rings:this.rings, ring:q, size:0});
			ringTween.to(.4, {size:1});
			ringTween.onUpdate(function()
			{
				var rings = this.rings;
				
				for(var i = this.ring; i < this.rings.length; i++)
				{
					rings[i].radius 		= rings[this.ring].startRadius + (rings[this.ring].diffRadius * this.size);
					rings[i].startRadius 	= rings[i].radius;
					rings[i].diffRadius 	= rings[i].targetRadius - rings[i].startRadius;
				}
			});
			
			// if this is the last ring
			// activate the boss
			if(q == ringCount-1)
			{
				ringTween.onComplete(function()
				{
					GameWorld.activateBoss();
				});
			}
			
			ringTween.easing(TWEEN.Easing.Exponential.EaseInOut);
			ringTween.delay(q * .2);
			ringTween.start();
			q++;
		}
		
	}
	
	this.aggression = aggression;
}

Boss.prototype = new Boss();

Boss.prototype.resetRings = function()
{
	this.rings = [];
}

/**
 * Picks out the nearest missile to the bottom
 * and fires it out at the player
 */
Boss.prototype.chooseMissileAndFire = function()
{
	// update the last time the boss fired
	this.lastFired = new Date().getTime();
	
	// check that we should have a missile to fire
	if(this.missiles.length < this.rings.length * this.rings[0].missiles.length)
	{
		var ringCount	= this.rings.length;
		var launched	= false;
		
		// start with the outer ring
		ringLoop:
		while(ringCount--)
		{
			// attempt to locate the missile
			var ring			= this.rings[ringCount];
			var ringPosition 	= Math.ceil(ring.missiles.length/4) - (Math.ceil((ring.rotation%(Math.PI*2)) / (Math.PI*2) * ring.missiles.length));
			
			// make sure it hasn't gone outside
			// of the bounds of the ring
			if(ringPosition < 0)
				ringPosition = ring.missiles.length + ringPosition;
			
			// if a missile already exists then
			// we need to find a new missile
			if(ring.missiles[ringPosition])
			{
				// we need to try a new position
				var distFromPosition = 1;
				
				// keep going to five either side
				alternativeMissileLoop:
				while(distFromPosition < 5)
				{
					var posLeft 	= (ringPosition + distFromPosition)%ring.missiles.length;
					var posRight 	= ringPosition - distFromPosition;
					
					if(posRight < 0)
						posRight 	= ring.missiles.length + posRight;
					
					if(!ring.missiles[posLeft])
					{
						ringPosition = posLeft;
						break alternativeMissileLoop;
					}
					else if(!ring.missiles[posRight])
					{
						ringPosition = posRight;
						break alternativeMissileLoop;
					}
					distFromPosition++;
				}
			}
			
			// if we haven't got a missile at the current
			// position (which may have been updated)
			if(!ring.missiles[ringPosition])
			{
				// work out where to fire the missile from
				var ringRadius		= 290 + (ringCount * 15);
				var ringStep		= Math.PI * 2 / ring.missiles.length;
				var misslePos		= (ringPosition * ringStep + ring.rotation);
				var missileX 		= this.position.x + Math.cos(misslePos) * ringRadius;
				var missileY 		= this.position.y + Math.sin(misslePos) * ringRadius;
				
				// create it
				var missile 		= new Missile( missileX, missileY );
				
				// set it up and fire it!
				missile.floating 	= true;
				missile.velocity.x 	= 3 - (Math.random()*6);
				missile.velocity.y 	= 2 + (Math.random()*2);
				
				missile.angularVelocity	= Math.ceil(Math.sqrt(missile.velocity.x * missile.velocity.x + missile.velocity.y * missile.velocity.y))
				
				// update the marker so we know this got fired
				ring.missiles[ringPosition] = true;
				
				// store it so we can keep a track on it
				this.missiles.push(missile);
				
				GameWorld.sound(GameSound.NEW_ENEMY);
				
				launched = true;
				
				break ringLoop;	
			}
		}
		
		if(!launched)
		{
			GameWorld.nextLevel();
		}
	}
}

/**
 * Represents a ring outside of the boss
 */
function BossRing(radius)
{
	this.startRadius		= 250;
	this.radius				= 250;
	this.targetRadius		= radius;
	this.diffRadius			= this.targetRadius - this.startRadius;
	this.rotation 			= 0;
	this.missiles 			= new Array(120);
}

BossRing.prototype = new BossRing();


/**
 * Represents an explosion
 */
function Explosion(x,y,type)
{
	this.position 	= {x: x || 0, y: y || 0 };
	this.size 		= 0;
	this.alpha 		= 0;
	this.type		= type;
	this.radius		= Math.round((type==0 ? 150 : 50) - Math.random() * 10);
}

Explosion.prototype = new Point();


/**
 * Represents a missile being launched
 */
function Missile(x, y)
{
	// pick a random color (from the sprite set)
	// and set up the other variables
	this.color 				= Math.floor(Math.random() * 4);
	this.flicker 			= 1;
	this.dead 				= false;
	this.floating 			= false;
	this.tailSize			= 0;
	this.position 			= {x: x || 0, y: y || 0};
	this.previousPosition 	= {x: x || 0, y: y || 0};
	this.velocity 			= {x: 0, y: 0};
	this.angularVelocity	= 0;
	this.size 				= {width: 4, height: 4};
}

Missile.prototype = new Point();

/**
 * Updates the missile's position
 */
Missile.prototype.update = function(bounds)
{
	this.previousPosition = this.clonePosition();
	
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	
	var hw = this.size.width * 0.5;
	var hh = this.size.height * 0.5;
	
	var outline = {
		top: this.position.y - hh,
		right: this.position.x + hw,
		bottom: this.position.y + hh,
		left: this.position.x - hw
	};
	
	// Left
	if( outline.left < bounds.x )
	{
		this.velocity.x = Math.abs( this.velocity.x );
		GameWorld.sound(GameSound.WALL_LEFT_BOUNCE);
	}
	
	// Right
	if( outline.right > bounds.x + bounds.width )
	{
		this.velocity.x = -Math.abs( this.velocity.x );
		GameWorld.sound(GameSound.WALL_RIGHT_BOUNCE);
	}
	
	// Top
	if( outline.top < bounds.y - 20)
		this.dead = true;
	
	// Bottom
	if( outline.bottom > bounds.y + bounds.height + 20)
		this.dead = true;
}

/**
 * Represents the last defense
 */
function LastDefense(x,y)
{
	this.angle			= 0;
	this.targetAngle	= 0;
	this.position 		= {x: x || 0, y: y || 0};
	this.shieldPoints	= [];
	
	var radius			= 5 * (Math.PI / 180);
	
	for(var i = -2; i < 3; i++)
	{
		var p = (i * radius) - Math.PI * .5;
		var s = new ShieldNode(x + Math.cos(p) * 315, y + Math.sin(p) * 315, false, false);
		s.activated = true;
		s.invincible = true;
		this.shieldPoints.push(s);
	}
}

LastDefense.prototype = new Point();
