
/**
 * 
 */
var GameSound = {
	
	// The available sound events that are sent to the 
	// Flash sound player
	STARTSCREEN: 'StartScreen',
	LEVEL_1: 'Level_1',
	LEVEL_2: 'Level_2',
	LEVEL_3: 'Level_3',
	MUTE: 'Mute',
	UNMUTE: 'UnMute',
	NEW_ENEMY: 'NewEnemy',
	PADDLE_BOUNCE: 'PaddleBounce',
	WALL_LEFT_BOUNCE: 'WallLeftBounce',
	WALL_RIGHT_BOUNCE: 'WallRightBounce',
	LINE_BOUNCE: 'LineBounce',
	ENEMY_SHIELD_HIT: 'EnemyShieldHit',
	ENEMY_PLANET_HIT: 'EnemyPlanetHit',
	START_DRAW: 'StartDraw',
	STOP_DRAW: 'StopDraw',
	REMOVE_LINE: 'RemoveLine',
	MY_PLANET_HIT: 'MyPlanetHit',
	GAME_OVER: 'GameOver',
	GAME_COMPLETE: 'GameComplete',
	
	// Flags if we are ready to play sound (i.e. not in the 
	// startup process of loading or embedding)
	isReady: false,
	
	loadedCallback: null,
	
	/**
	 * 
	 */
	initialize: function() {
		
		// Create a div that to embed the player in
		var soundDIV = document.createElement('div');
		soundDIV.setAttribute('id','sound');
		document.body.appendChild( soundDIV );
		
		if ( UserProfile.supportsAudio() ) {
			
			// The sound flashvars
			var flashvars = {
  				scDeployPath: "./media/swf/plan8/SCDeploy.swf",
 				configXmlPath: "./media/swf/plan8/config.xml",
 				soundFolderPath: "./media/swf/plan8/"
			};
			
			var params = { allowScriptAccess: "always" };
			var attributes = { id: "soundSWF" };
			
			// Embed the player and await the SWFObject embed 
			// status event
			if (swfobject.hasFlashPlayerVersion("9")) {
				swfobject.embedSWF("./media/swf/sound.swf", "sound", "1", "1", "9.0.0", "", flashvars, params, attributes, function(event){
					// Embed status event handler
					GameSound.flashEmbeddedHandler(event.success);
				});
			}
			else {
				GameSound.flashEmbeddedHandler(false);
			}
			
			
		}
	},
	
	/**
	 * 
	 */
	setLoadedCallback: function( callback ) {
		this.loadedCallback = callback;
	},
	
	/**
	 * Called by SWFObject when our sound SWF has finished
	 * embedding, or failed to embed.
	 * 
	 * @param success {Boolean} true if the sound SWF was
	 * embedded successfully, false if not 
	 */
	flashEmbeddedHandler: function( success ) {
		
		this.isReady = true;
		
		if (!success && this.loadedCallback) {
			this.loadedCallback();
		}
	},
	
	/**
	 * Sends an event to Flash, usually to initiate playback
	 * of audio but may also be used for functional calls 
	 * such as toggling mute or changing volume.
	 * 
	 *  @param value {String} The event type to send to Flash.
	 */
	send: function( value ) {
		var swf = document.getElementById('soundSWF');
		
		if ( UserProfile.supportsAudio() && swf && swf.sendToActionScript ) {
			swf.sendToActionScript( value );
		}
	},
	
	/**
	 * Called whenever an event is sent from Flash to
	 * JavaScript.
	 * 
	 * @param value {String} The event type that was 
	 * dispatched from Flash.
	 */
	receive: function( value, percentLoaded, swfName ) {	
		if (value == "SoundController ready and loaded!") {
	    	if( this.loadedCallback ) this.loadedCallback();
	    }
	    else if (value == "beat_1") {
			//Do something in time
		}
		//SoundController loading progress.
		//percentLoaded, 0-100
		//swfName, name of swf loading.
		else if (value == "Sounds loaded") {
			
		}
		//console.log( 'GameSound.receive: ' + value );
	}
	
};

/**
 * Proxy method used to forward events from Flash
 * to the GameSound class.
 */
function sendToJavaScript( value, percentLoaded, swfName ) {
    GameSound.receive( value, percentLoaded, swfName );
}
