/**
 * @tresensa
 */
var GameLeaderboardConfig = function() {
	this.lbConfig = {
		SERVER_URL : "http://prod.tresensa.com:8282",
		APP_URL : "http://games.tresensa.com/crazyfrog/",
		APP_ID : "487515757948740", //for facebook
		APP_KEY : "lESgx9VB9yadzl8KZWscw", //for twitter
		ErrorHandler : null,
		GameCode : 'crazyfrog',
		SocialNetwork : "facebook"
	}
}

GameLeaderboardConfig.prototype.getLeaderboardConfig = function() {
	return this.lbConfig;
}
/**
 *  Leaderboard Widget
 * */
var LeaderBoardWidgetConfig = function() {
	this.lbWidgetConfig = {
		FACEBOOK : {
			MESSAGE : 'I just scored #### points whacking frogs playing Crazy Frogs. See if you can beat my score.',
			APP_IMAGE : 'http://games.tresensa.com/crazyfrog/web-image.jpg',
			CHALLENGE_MESSAGE : 'I just scored #### points whacking frogs playing Crazy Frogs. See if you can beat my score.',
			CAPTION : 'Crazy Frog Game'
		},
		TWITTER : {
			MESSAGE : 'Just scored %%%% points whacking frogs playing @crazyfroggame! Can you beat my score?',
			FOLLOW : 'https://twitter.com/crazyfroggame',
			CHALLENGE_MESSAGE : '@%%%% I just scored #### points whacking frogs playing @crazyfroggame! Can you beat my score? '

		},
		GAME : {
			TRY_AGAIN_METHOD : null,
			LB_TYPE : '',
			GAME_SCORE : '999',
			SESSION_BEST_SCORE : '478989',
			APP_URL : 'http://games.tresensa.com/crazyfrog/',
			URL_FOR_LB_IMAGES : 'social_leaderboard/'
		}

	}
	return this;
}

