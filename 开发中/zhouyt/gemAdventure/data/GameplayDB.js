/**
 * ...
 * @author Danny Marcowitz
 */

 var powerup_blocks_spritesheet = {"loc": "images/gems/powerup_blocks.png", "frameWidth": 47, "frameHeight": 47};
 var powerup_spritesheet = {"loc": "images/gems/powerups.png", "frameWidth": 59, "frameHeight": 59};

 var allPowerups =
 	{"powerups": [
	{
		"id": "1",
		"name": "bomb_blast",
		"blockFrame": 5,
		"powerupFrame": 0,
		"isActive": "false",
		"menuImage": "images/menu/bomb_blast.png"
	},
	{
		"id": "2",
		"name": "lightningbolt",
		"blockFrame": 0,
		"powerupFrame": 1,
		"isActive": "true",
		"spreeToActivate": 65,
		"menuImage": "images/menu/lightning_bolt.png"
	},
	{
		"id": "3",
		"name": "smallTimeBonus",
		"blockFrame": 6,
		"powerupFrame": 2,
		"isActive": "false",
		"seconds": 2,
		"menuImage": "images/menu/time_bonus.png"
	},
	{
		"id": "4",
		"name": "specialSight",
		"blockFrame": 1,
		"powerupFrame": 3,
		"isActive": "true",
		"spreeToActivate": 65,
		"menuImage": "images/menu/special_sight.png"
	},
	{
		"id": "5",
		"name": "colorSplash",
		"blockFrame": 2,
		"powerupFrame": 4,
		"isActive": "true",
		"spreeToActivate": 59,
		"menuImage": "images/menu/color_splash.png"
	},
	{
		"id": "6",
		"name": "bigTimeBonus",
		"blockFrame": 3,
		"powerupFrame": 5,
		"isActive": "true",
		"seconds": 10,
		"spreeToActivate": 70,
		"menuImage": "images/menu/big_time_bonus.png"
	},
	{
		"id": "7",
		"name": "colorBlast",
		"blockFrame": 4,
		"powerupFrame": 6,
		"isActive": "true",
		"spreeToActivate": 68,
		"menuImage": "images/menu/color_blast.png"
	}]
}

function GameplayDB() {
}

GameplayDB.prototype.getAllPowerups = function() {
	return allPowerups.powerups;
}


GameplayDB.prototype.getBlockSpritesheet = function() {
	return powerup_blocks_spritesheet;
}

GameplayDB.prototype.getPowerupSpritesheet = function() {
	return powerup_spritesheet;
}
