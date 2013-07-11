/**
 * ...
 * @author Danny Marcowitz
 */

 var allLevels =
 	{"levels": [
	{
		// Level 1
		"id": "1",
		"xpToUnlock": 0,
		"duration": 60,
		"scoreMultiplier":1.0,
		"powerups": [ "colorSplash"],
		"passiveChance":0.01
	},
	{
		// Level 2
		"id": "2",
		"xpToUnlock": 4500,
		"duration": 60,
		"scoreMultiplier":1.1,
		"powerups": [ "colorSplash"],
		"passiveChance":0.01
	},
	{
		// Level 3
		"id": "3",
		"xpToUnlock": 9000,
		"duration": 60,
		"scoreMultiplier":1.1,
		"powerups": [ "colorSplash", "bomb_blast"],
		"passiveChance":0.01
	},
	{
		// Level 4
		"id": "4",
		"xpToUnlock": 15500,
		"duration": 60,
		"scoreMultiplier":1.2,
		"powerups": [ "colorSplash", "bomb_blast"],
		"passiveChance":0.01
	},
	{
		// Level 5
		"id": "5",
		"xpToUnlock": 27000,
		"duration": 60,
		"scoreMultiplier":1.2,
		"powerups": [ "colorSplash", "bomb_blast","smallTimeBonus"],
		"passiveChance":0.01
	},
	{
		// Level 6
		"id": "6",
		"xpToUnlock": 40000,
		"duration": 60,
		"scoreMultiplier":1.3,
		"powerups": [ "colorSplash", "bomb_blast","smallTimeBonus"],
		"passiveChance":0.01
	},
	{
		// Level 7
		"id": "7",
		"xpToUnlock": 53000,
		"duration": 60,
		"scoreMultiplier":1.3,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight"],
		"passiveChance":0.01
	},
	{
		// Level 8
		"id": "8",
		"xpToUnlock": 75000,
		"duration": 60,
		"scoreMultiplier":1.3,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast"],
		"passiveChance":0.01
	},
	{
		// Level 9
		"id": "9",
		"xpToUnlock": 110000,
		"duration": 60,
		"scoreMultiplier":1.4,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast"],
		"passiveChance":0.02
	},
	{
		// Level 10
		"id": "10",
		"xpToUnlock": 160000,
		"duration": 60,
		"scoreMultiplier":1.5,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast"],
		"passiveChance":0.01
	},
	{
		// Level 11
		"id": "11",
		"xpToUnlock": 240000,
		"duration": 60,
		"scoreMultiplier":1.5,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt"],
		"passiveChance":0.01
	},
	{
		// Level 12
		"id": "12",
		"xpToUnlock": 340000,
		"duration": 60,
		"scoreMultiplier":1.6,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt"],
		"passiveChance":0.01
	},
	{
		// Level 13
		"id": "13",
		"xpToUnlock": 440000,
		"duration": 60,
		"scoreMultiplier":1.6,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt","bigTimeBonus"],
		"passiveChance":0.01
	},
	{
		// Level 14
		"id": "14",
		"xpToUnlock": 560000,
		"duration": 60,
		"scoreMultiplier":1.7,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt","bigTimeBonus"],
		"passiveChance":0.01
	},
	{
		// Level 15
		"id": "15",
		"xpToUnlock": 680000,
		"duration": 60,
		"scoreMultiplier":1.7,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt","bigTimeBonus"],
		"passiveChance":0.01
	},
	{
		// Level 16
		"id": "16",
		"xpToUnlock": 830000,
		"duration": 60,
		"scoreMultiplier":1.8,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt","bigTimeBonus"],
		"passiveChance":0.01
	},
	{
		// Level 17
		"id": "17",
		"xpToUnlock": 1000000,
		"duration": 60,
		"scoreMultiplier":2,
		"powerups": ["colorSplash", "bomb_blast","smallTimeBonus","specialSight","colorBlast","lightningbolt","bigTimeBonus"],
		"passiveChance":0.01
	}]

}

function LevelDB() {
}

LevelDB.prototype.getAllLevels = function() {
	return allLevels.levels;
}