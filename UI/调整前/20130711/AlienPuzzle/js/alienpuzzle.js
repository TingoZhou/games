/*
 *  Alien Puzzle v1.0
 *
 *  DEVELOPER
 *  InforExper © 2013
 *  inforexper.blogspot.com
 *  inforexper@gmail.com
 *
 *  LICENSE
 *  This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/
 */
Assets = {
    background: 0,
    backplanet: 0,
    backstone: 0,
    button: 0,
    buttonnumber: 0,
    buttonplay: 0,
    intro: 0,
    menu: 0,
    planet: 0,
    title: 0,
    start: 0,
    guide: 0,
    cursor: 0,
    pieces: 0,
    highscore: 0,
    effectstar: 0,
    effectexplosion: 0,
    special: 0,
    tools: 0,
    click: 0,
    clickpiece: 0,
    talk: 0,
    equal: 0,
    diferent: 0,
    levelcomplete: 0,
    bomb: 0,
    bombexplosion: 0,
    switchs: 0,
    flipall: 0,
    revealer: 0,
    bonus10x: 0,
    bonusx: 0,
    music: 0
};
App = {
    sound: 0,
    music: 0,
    highscore: 0,
    LoadBasic: function (a) {
        Assets.intro = a.content.LoadTexture("./assets/texture/intro.png")
    },
    LoadFull: function (a) {
        Assets.background = a.content.LoadTexture("./assets/texture/background.png");
        Assets.backplanet = a.content.LoadTexture("./assets/texture/backplanet.png");
        Assets.backstone = a.content.LoadTexture("./assets/texture/backstone.png");
        Assets.button = a.content.LoadTexture("./assets/texture/button.png");
        Assets.buttonnumber = a.content.LoadTexture("./assets/texture/buttonnumber.png");
        Assets.buttonplay =
            a.content.LoadTexture("./assets/texture/buttonplay.png");
        Assets.menu = a.content.LoadTexture("./assets/texture/menu.png");
        Assets.planet = a.content.LoadTexture("./assets/texture/planet.png");
        Assets.title = a.content.LoadTexture("./assets/texture/title.png");
        Assets.star = a.content.LoadTexture("./assets/texture/star.png");
        Assets.guide = a.content.LoadTexture("./assets/texture/guide.png");
        Assets.cursor = a.content.LoadTexture("./assets/texture/cursor.png");
        Assets.pieces = a.content.LoadTexture("./assets/texture/pieces.png");
        Assets.highscore =
            a.content.LoadTexture("./assets/texture/newhighscores.png");
        Assets.effectstar = a.content.LoadTexture("./assets/texture/effectstar.png");
        Assets.effectexplosion = a.content.LoadTexture("./assets/texture/explosion.png");
        Assets.tools = a.content.LoadTexture("./assets/texture/tools.png");
        Assets.special = [];
        Assets.special[0] = a.content.LoadTexture("assets/texture/bomb.png");
        Assets.special[1] = a.content.LoadTexture("assets/texture/bonusx.png");
        Assets.special[2] = a.content.LoadTexture("assets/texture/bonus10x.png");
        Assets.special[3] =
            a.content.LoadTexture("assets/texture/switch.png");
        Assets.special[4] = a.content.LoadTexture("assets/texture/flipall.png");
        Assets.special[5] = a.content.LoadTexture("assets/texture/revealer.png");
        Assets.click = a.audio.LoadSound("");
        Assets.clickpiece = a.audio.LoadSound("");
        Assets.talk = a.audio.LoadSound("");
        Assets.equal = a.audio.LoadSound("");
        Assets.diferent = a.audio.LoadSound("");
        Assets.levelcomplete = a.audio.LoadSound("");
        Assets.bomb = a.audio.LoadSound("");
        Assets.bombexplosion = a.audio.LoadSound("");
        Assets.switchs = a.audio.LoadSound("");
        Assets.flipall = a.audio.LoadSound("");
        Assets.revealer = a.audio.LoadSound("");
        Assets.bonus10x = a.audio.LoadSound("");
        Assets.bonusx = a.audio.LoadSound("");
        Assets.music = a.audio.LoadMusic("");
    },
    LoadSettings: function (a) {
        App.sound = "false" ==
            a.storage.LoadParameter("sound") ? !1 : !0;
        App.music = "false" == a.storage.LoadParameter("music") ? !1 : !0;
        App.highscore = [];
        for (ab = 0; 30 > ab; ab++) App.highscore[ab] = void 0 == a.storage.LoadParameter("score" + ab) ? 0 : a.storage.LoadParameter("score" + ab)
    },
    LoadGame: function (a, e) {
        a.LoadScene(new SceneGame(a, e))
    },
    SaveSettings: function (a) {
        a.storage.SaveParameter("sound", App.sound);
        a.storage.SaveParameter("music", App.music);
        for (ab = 0; 30 > ab; ab++) a.storage.SaveParameter("score" + ab, App.highscore[ab])
    },
    isSoundEnable: function () {
        return App.sound
    },
    isMusicEnable: function () {
        return App.music
    },
    isLevelUnlocked: function (a, e) {
        return 0 == 10 * e + a ? !0 : 0 < App.highscore[10 * e + a - 1] ? !0 : !1
    },
    isWorldUnlocked: function (a) {
        return 0 == a ? !0 : 0 < App.highscore[10 * a - 1] ? !0 : !1
    },
    LevelScore: function (a, e) {
        return App.highscore[10 * e + a]
    },
    LevelStar: function (a, e) {
        return 0 == App.highscore[10 * e + a] ? 0 : App.highscore[10 * e + a] >= Level[10 * e + a].score2 ? 3 : App.highscore[10 * e + a] >= Level[10 * e + a].score1 ? 2 : 1
    },
    WorldStar: function (a) {
        for (ix = countx = 0; 10 > ix; ix++) countx += App.LevelStar(ix, a);
        return countx
    },
    ScoreStar: function (a,
        e) {
        return e >= a.score2 ? 3 : e >= a.score1 ? 2 : 1
    }
};
var Level = [{
    size: 4,
    score1: 1570,
    score2: 1611,
    stone: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, -1, -5]
}, {
    size: 4,
    score1: 1550,
    score2: 1570,
    stone: [7, 7, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, -2, -5]
}, {
    size: 4,
    score1: 1550,
    score2: 1582,
    stone: [7, 7, 8, 8, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, -1, -2]
}, {
    size: 4,
    score1: 1570,
    score2: 1629,
    stone: [9, 9, 7, 7, 3, 3, 8, 8, 4, 4, 5, 5, 6, 6, -1, -2]
}, {
    size: 4,
    score1: 1580,
    score2: 1628,
    stone: [0, 0, 1, 1, 2, 2, 9, 9, 8, 8, 7, 7, -2, -4, -6, -5]
}, {
    size: 4,
    score1: 1515,
    score2: 1560,
    stone: [0, 0, 1, 1, 6, 6, 3, 3, 4, 4, 5, 5, -5, -3, -6, -1]
}, {
    size: 4,
    score1: 1508,
    score2: 1540,
    stone: [8, 8, 1, 1, 2, 2, 3, 3, 4, 4, 5,
        5, 6, 6, -5, -6
    ]
}, {
    size: 4,
    score1: 1610,
    score2: 1673,
    stone: [0, 0, 9, 9, 2, 2, 7, 7, 4, 4, 5, 5, 8, 8, -5, -4]
}, {
    size: 4,
    score1: 1580,
    score2: 1620,
    stone: [0, 0, 9, 9, 7, 7, 3, 3, 1, 1, 2, 2, 6, 6, -1, -3]
}, {
    size: 4,
    score1: 1508,
    score2: 1530,
    stone: [0, 0, 1, 1, 9, 9, 3, 3, 4, 4, 7, 7, 6, 6, -3, -6]
}, {
    size: 5,
    score1: 1610,
    score2: 1657,
    stone: [0, 0, 0, 0, 1, 1, 1, 1, 4, 4, 5, 5, 6, 6, -1, -5, 9, 9, 14, 14, 12, 12, 10, 10, -1]
}, {
    size: 5,
    score1: 1600,
    score2: 1636,
    stone: [11, 11, 12, 12, 13, 13, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, -3, -1, -1]
}, {
    size: 5,
    score1: 1610,
    score2: 1664,
    stone: [14, 14, 15, 15, 11, 11, 13, 13, 4, 4, 5, 5, 6, 6, 7, 7, 9, 9,
        3, 3, 12, 12, -5, -3, -1
    ]
}, {
    size: 5,
    score1: 1550,
    score2: 1588,
    stone: [0, 0, 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12, 12, 14, 14, 9, 9, 11, 11, 12, 12, -3, -6, -1]
}, {
    size: 5,
    score1: 1690,
    score2: 1756,
    stone: [0, 0, 3, 3, 6, 6, 9, 9, 12, 12, 15, 15, 1, 1, 4, 4, 7, 7, 10, 10, 2, 2, -4, -3, -1]
}, {
    size: 5,
    score1: 1610,
    score2: 1661,
    stone: [4, 4, 2, 2, 5, 5, 7, 7, 4, 4, 15, 15, 6, 6, 8, 8, 9, 9, 14, 14, -2, -3, -2, -1, -1]
}, {
    size: 5,
    score1: 1580,
    score2: 1619,
    stone: [14, 14, 3, 3, 5, 5, 7, 7, 2, 2, 15, 15, 6, 6, 8, 8, 9, 9, 5, 5, -3, -3, -2, -1, -1]
}, {
    size: 5,
    score1: 1610,
    score2: 1673,
    stone: [1, 1, 2, 2, 3, 3, 7, 7, 4, 4, 15, 15, 6, 6, 8, 8, 9, 9, 5, 5, -3, -4, -2, -6, -1]
}, {
    size: 5,
    score1: 1580,
    score2: 1627,
    stone: [1, 1, 5, 5, 10, 10, 4, 4, 5, 5, 13, 13, 7, 7, 8, 8, 9, 9, 12, 12, -3, -4, -2, -6, -6]
}, {
    size: 5,
    score1: 1500,
    score2: 1533,
    stone: [1, 1, 5, 5, 10, 10, 4, 4, 5, 5, 13, 13, 7, 7, 8, 8, 9, 9, 12, 12, -3, -5, -3, -6, -6]
}, {
    size: 6,
    score1: 1920,
    score2: 1965,
    stone: [10, 10, 10, 10, 11, 11, 11, 11, 15, 15, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 10, 10, 12, 12, 2, 2, 3, 3, 5, 5, -1, -1, -1, -4]
}, {
    size: 6,
    score1: 1910,
    score2: 1950,
    stone: [10, 10, 10, 10, 11, 11, 11, 11, 15, 15, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 10, 10, 12, 12, 4, 4, 13, 13, -2, -2, -1, -1, -1, -4]
}, {
    size: 6,
    score1: 1900,
    score2: 1930,
    stone: [1, 1, 0, 0, 11, 11, 11, 11, 15, 15, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 10, 10, 12, 12, 4, 4, 13, 13, -2, -6, -1, -1, -1, -4]
}, {
    size: 6,
    score1: 1890,
    score2: 1910,
    stone: [0, 0, 10, 10, 1, 1, 11, 11, 5, 5, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 10, 10, 12, 12, 4, 4, 3, 3, -3, -2, -1, -1, -1, -5]
}, {
    size: 6,
    score1: 1880,
    score2: 1920,
    stone: [10, 10, 0, 0, 11, 11, 1, 1, 15, 15, 4, 4, 16, 16, 17, 17, 8, 8, 9, 9, 12, 12, 10, 10, 12, 12, 5, 5, 13, 13, -3, -2, -6, -1, -1, -4]
}, {
    size: 6,
    score1: 1850,
    score2: 1880,
    stone: [3, 3, 0, 0, 5, 5, 11, 11, 15, 15, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 10, 10, 12, 12, 4, 4, -6, -3, -2, -2, -1, -1, -1, -4]
}, {
    size: 6,
    score1: 1850,
    score2: 1880,
    stone: [5, 5, 6, 6, 7, 7, 8, 8, 15, 15, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 3, 3, 2, 2, 0, 0, -3, -3, -2, -2, -1, -1, -5, -4]
}, {
    size: 6,
    score1: 1770,
    score2: 1800,
    stone: [0, 0, 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 18, 1, 1, 3, 3, 5, 5, 7, 7, -6, -6, -2, -2, -1, -6, -1, -4]
}, {
    size: 6,
    score1: 1770,
    score2: 1800,
    stone: [19, 19, 17, 17, 15, 15, 13, 13, 11, 11, 9, 9, 7, 7, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 6, 6, 18, 18, -6, -6, -2, -3, -3, -1, -1, -4]
}, {
    size: 6,
    score1: 1690,
    score2: 1720,
    stone: [0, 0, 1, 1, 2, 2, 4, 4, 15, 15, 14, 14, 16, 16, 17, 17, 18, 18, 19, 19, 12, 12, 10, 10, 12,
        12, 19, 19, -3, -3, -3, -3, -1, -1, -6, -6
    ]
}];

function SceneStart(a) {
    var e = !1,
        m = 0;
    this.Inicialize = function () {
        m = new Bug.Animation(0, 0, 1200, 800, 3, 50);
    };
    this.Update = function () {
        e && (m.isComplete() ? (a.LoadScene(new SceneMenu(a))) : m.Next())
    };
    this.Draw = function () {
        e && (a.graphics.Clear("#fff"), a.graphics.DrawTexture(Assets.intro, m.X(), m.Y(), m.Width(), m.Height(), 0, 0, 900, 600))
    };
    this.Dispose = function () {};
    this.Resume = function () {
        e = !0
    };
    this.Pause = function () {
        e = !1
    }
}

function SceneMenu(a) {
    var e = !1,
        m, z, y, k, g, l, d, v, j;
    this.Inicialize = function () {
        z = m = 0;
        y = 1;
        k = 0;
        d = new Bug.Animation(0, 0, 240, 240, 8, 3);
        g = new Bug.Animation(0, 240, 240, 240, 8, 3);
        l = new Bug.Animation(0, 480, 240, 240, 8, 3);
        j = v = 0
    };
    this.Update = function () {
        if (e) switch (App.isMusicEnable() && (a.audio.isPlaying() || a.audio.PlayMusic(Assets.music)), z += y, 0 >= z && (y = 1), 1200 <= z && (y = -1), m) {
        case 0:
            switch (j) {
            case 0:
                d.Reset();
                j = 1;
                v = 0;
                break;
            case 1:
                d.isComplete() ? j = 6 : d.Next();
                break;
            case 6:
                g.Reset();
                j = 7;
                v = 1;
                break;
            case 7:
                g.isComplete() ?
                    j = 8 : g.Next();
                break;
            case 8:
                d.Reset();
                j = 9;
                v = 0;
                break;
            case 9:
                d.isComplete() ? j = 10 : d.Next();
                break;
            case 10:
                d.Reset();
                j = 11;
                v = 0;
                break;
            case 11:
                d.isComplete() ? j = 12 : d.Next();
                break;
            case 12:
                d.Reset();
                j = 13;
                v = 0;
                break;
            case 13:
                d.isComplete() ? j = 6 : d.Next()
            }
            a.input.mouse.isMouseUp() && (a.input.mouse.inBound(337, 243, 225, 112) ? (App.isSoundEnable() && a.audio.PlaySound(Assets.click), m = 1) : a.input.mouse.inBound(7, 518, 75, 75) ? App.isMusicEnable() ? (a.audio.StopMusic(), a.audio.PlaySound(Assets.click), App.music = !1, App.SaveSettings(a)) :
                App.isSoundEnable() ? (App.sound = !1, App.SaveSettings(a)) : (App.music = !0, App.sound = !0, App.SaveSettings(a), a.audio.PlaySound(Assets.click)) : a.input.mouse.inBound(818, 518, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), j = 0, m = 3));
            a.input.mouse.Clear();
            break;
        case 1:
            a.input.mouse.isMouseUp() && (a.input.mouse.inBound(300, 150, 300, 300) ? App.isWorldUnlocked(k) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), m = 2) : a.input.mouse.inBound(225, 262, 75, 75) ? 0 < k && (App.isSoundEnable() && a.audio.PlaySound(Assets.click),
                k--) : a.input.mouse.inBound(600, 262, 75, 75) ? 2 > k && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), k++) : a.input.mouse.inBound(7, 518, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), m = 0));
            a.input.mouse.Clear();
            break;
        case 2:
            if (a.input.mouse.isMouseUp()) {
                for (ii = 0; 10 > ii; ii++)
                    if (a.input.mouse.inBound(162 * Math.floor(ii % 5) + 87, 225 * Math.floor(ii / 5) + 150, 75, 75) && App.isLevelUnlocked(ii, k)) {
                        App.isSoundEnable() && a.audio.PlaySound(Assets.click);
                        App.LoadGame(a, 10 * k + ii);
                        break
                    }
                a.input.mouse.inBound(7,
                    518, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), m = 1)
            }
            a.input.mouse.Clear();
            break;
        case 3:
            switch (j) {
            case 0:
                d.Reset();
                j = 1;
                v = 0;
                break;
            case 1:
                d.isComplete() ? j = 2 : d.Next();
                break;
            case 2:
                App.isSoundEnable() && a.audio.PlaySound(Assets.talk);
                l.Reset();
                j = 3;
                v = 2;
                break;
            case 3:
                l.isComplete() ? j = 4 : l.Next();
                break;
            case 4:
                l.Reset();
                j = 5;
                v = 2;
                break;
            case 5:
                l.isComplete() ? j = 6 : l.Next();
                break;
            case 6:
                g.Reset();
                j = 7;
                v = 1;
                break;
            case 7:
                g.isComplete() ? j = 8 : g.Next();
                break;
            case 8:
                d.Reset();
                j = 9;
                v = 0;
                break;
            case 9:
                d.isComplete() ?
                    j = 10 : d.Next();
                break;
            case 10:
                d.Reset();
                j = 11;
                v = 0;
                break;
            case 11:
                d.isComplete() ? j = 12 : d.Next();
                break;
            case 12:
                d.Reset();
                j = 13;
                v = 0;
                break;
            case 13:
                d.isComplete() ? j = 6 : d.Next()
            }
            a.input.mouse.isMouseUp() && a.input.mouse.inBound(7, 518, 75, 75) && (App.isSoundEnable() && (a.audio.StopSound(), a.audio.PlaySound(Assets.click)), j = m = 0);
            a.input.mouse.Clear()
        }
    };
    this.Draw = function () {
        if (e) switch (a.graphics.Clear("#fff"), a.graphics.DrawTexture(Assets.background, 0 + z, 0, 1200, 800, 0, 0, 900, 600), m) {
        case 0:
            a.graphics.DrawTexture(Assets.title,
                75, 75, 750, 150);
            a.graphics.DrawTexture(Assets.buttonplay, 337, 243, 225, 112);
            // App.isMusicEnable() ? a.graphics.DrawTexture(Assets.button, 1100, 0, 100, 100, 7, 518, 75, 75) : App.isSoundEnable() ? a.graphics.DrawTexture(Assets.button, 0, 0, 100, 100, 7, 518, 75, 75) : a.graphics.DrawTexture(Assets.button, 100, 0, 100, 100, 7, 518, 75, 75);
            // a.graphics.DrawTexture(Assets.button, 800, 0, 100, 100, 818, 518, 75, 75);
            0 == v ? a.graphics.DrawTexture(Assets.guide, d.X(), d.Y(), d.Width(), d.Height(), 360, 420, 180, 180) : 1 == v ? a.graphics.DrawTexture(Assets.guide,
                g.X(), g.Y(), g.Width(), g.Height(), 360, 420, 180, 180) : 2 == v && a.graphics.DrawTexture(Assets.guide, l.X(), l.Y(), l.Width(), l.Height(), 360, 420, 180, 180);
            break;
        case 1:
            a.graphics.DrawTexture(Assets.backplanet, 300, 150, 300, 300);
            a.graphics.DrawTexture(Assets.planet, 400 * k, 0, 400, 400, 300, 150, 300, 300);
            App.isWorldUnlocked(k) ? (a.graphics.DrawText(App.WorldStar(k) + "/30", "24px Calibri", "#fff", 450, 400, "center", "middle"), a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 485, 388, 22, 22)) : a.graphics.DrawTexture(Assets.buttonnumber,
                1100, 0, 100, 100, 412, 262, 75, 75);
            0 < k && a.graphics.DrawTexture(Assets.button, 600, 0, 100, 100, 225, 262, 75, 75);
            2 > k && a.graphics.DrawTexture(Assets.button, 700, 0, 100, 100, 600, 262, 75, 75);
            for (hh = 0; 3 > hh; hh++) a.graphics.DrawTexture(Assets.cursor, hh == k ? 0 : 30, 0, 30, 30, 405 + 29 * hh, 544, 22, 22);
            a.graphics.DrawTexture(Assets.button, 300, 0, 100, 100, 7, 518, 75, 75);
            break;
        case 2:
            for (ii = 0; 10 > ii; ii++) a.graphics.DrawTexture(Assets.buttonnumber, App.isLevelUnlocked(ii, k) ? 100 * ii : 1E3, 0, 100, 100, 162 * Math.floor(ii % 5) + 87, 225 * Math.floor(ii / 5) + 150,
                75, 75), 0 < App.LevelStar(ii, k) && (a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 162 * Math.floor(ii % 5) + 87, 225 * Math.floor(ii / 5) + 230, 22, 22), 1 < App.LevelStar(ii, k) ? a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 162 * Math.floor(ii % 5) + 113, 225 * Math.floor(ii / 5) + 230, 22, 22) : a.graphics.DrawTexture(Assets.star, 30, 0, 30, 30, 162 * Math.floor(ii % 5) + 113, 225 * Math.floor(ii / 5) + 230, 22, 22), 2 < App.LevelStar(ii, k) ? a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 162 * Math.floor(ii % 5) + 139, 225 * Math.floor(ii / 5) + 230, 22, 22) : a.graphics.DrawTexture(Assets.star,
                30, 0, 30, 30, 162 * Math.floor(ii % 5) + 139, 225 * Math.floor(ii / 5) + 230, 22, 22));
            a.graphics.DrawTexture(Assets.button, 300, 0, 100, 100, 7, 518, 75, 75);
            break;
        case 3:
            a.graphics.DrawTexture(Assets.menu, 2400, 0, 800, 600, 150, 75, 600, 450), a.graphics.DrawText("Alien Puzzle", "28px Calibri", "#801DFF", 450, 130, "center", "middle"), a.graphics.DrawText("InforExper \u00a9 2013", "18px Calibri", "#000", 450, 160, "center", "middle"), a.graphics.DrawText("ART & GAME DESIGN", "18px Calibri", "#801DFF", 450, 200, "center", "middle"), a.graphics.DrawText("Axel Ferreira",
                "18px Calibri", "#000", 450, 220, "center", "middle"), a.graphics.DrawText("PROGRAMMING", "18px Calibri", "#801DFF", 450, 260, "center", "middle"), a.graphics.DrawText("Adelcides Ferreira", "18px Calibri", "#000", 450, 280, "center", "middle"), a.graphics.DrawText("MUSIC", "18px Calibri", "#801DFF", 450, 320, "center", "middle"), a.graphics.DrawText("Music used under a Creative Commons License from UniqueTracks Inc.", "18px Calibri", "#000", 450, 340, "center", "middle"), a.graphics.DrawText("TOOLS", "18px Calibri", "#801DFF", 450, 380,
                "center", "middle"), a.graphics.DrawTexture(Assets.tools, 335, 380, 229, 63), 0 == v ? a.graphics.DrawTexture(Assets.guide, d.X(), d.Y(), d.Width(), d.Height(), 360, 420, 180, 180) : 1 == v ? a.graphics.DrawTexture(Assets.guide, g.X(), g.Y(), g.Width(), g.Height(), 360, 420, 180, 180) : 2 == v && a.graphics.DrawTexture(Assets.guide, l.X(), l.Y(), l.Width(), l.Height(), 360, 420, 180, 180), a.graphics.DrawTexture(Assets.button, 300, 0, 100, 100, 7, 518, 75, 75)
        }
    };
    this.Dispose = function () {};
    this.Resume = function () {
        e = !0
    };
    this.Pause = function () {
        e = !1
    }
}

function SceneGame(a, e) {
    function m(a) {
        if (void 0 === a) {
            x = u = -1;
            for (oo = 0; oo < q.length; oo++)
                if (0 <= q[oo] && 3 != b[oo]) {
                    u = oo;
                    break
                }
            if (-1 != u)
                for (oo = u + 1; oo < q.length; oo++)
                    if (q[oo] == q[u] && 3 != b[oo]) {
                        x = oo;
                        break
                    }
        } else {
            u = a;
            x = -1;
            for (oo = 0; oo < q.length; oo++)
                if (u != oo && q[oo] == q[u] && 3 != b[oo]) {
                    x = oo;
                    break
                }
        }
    }

    function z() {
        for (nn = 0; nn < b.length; nn++) 0 == b[nn] && (b[nn] = 1)
    }

    function y() {
        for (nn = 0; nn < b.length; nn++) 1 == b[nn] && (b[nn] = 2)
    }

    function k() {
        for (nn = 0; nn < b.length; nn++) 2 == b[nn] && (b[nn] = 4)
    }

    function g() {
        for (nn = 0; nn < b.length; nn++) 4 == b[nn] &&
            (b[nn] = 0)
    }

    function l() {
        for (nn = 0; nn < b.length; nn++) 0 == b[nn] && (b[nn] = 8)
    }

    function d() {
        for (nn = 0; nn < b.length; nn++) 8 == b[nn] && (b[nn] = 0)
    }

    function v() {
        var a, c, d, e = Math.floor(10 * Math.random());
        for (io = 0; io <= 40 + e; io++) a = Math.floor(Math.random() * f.size * f.size), c = Math.floor(Math.random() * f.size * f.size), a != c && (0 == b[a] && 0 == b[c]) && (d = q[a], q[a] = q[c], q[c] = d)
    }
    var j = !1,
        f = Level[e],
        G, n, I, J, b = [],
        q = [],
        c, r, A, p, t, u, x, s, K, L, M, H, w, B, D, h, C, E, F;
    this.Inicialize = function () {
        I = 0;
        J = 1;
        n = 0;
        s = 1E3;
        M = !1;
        r = new Bug.Animation(0, 0, 175, 175, 8,
            1);
        A = new Bug.Animation(0, 0, 175, 175, 8, 1);
        t = p = 0;
        w = new Bug.Timer(12);
        B = new Bug.Animation(0, 0, 175, 175, 8, 1);
        D = new Bug.Animation(0, 0, 175, 175, 8, 1);
        h = new Bug.Animation(0, 0, 175, 175, 8, 2);
        H = new Bug.Animation(0, 0, 150, 150, 8, 2);
        L = K = 0;
        c = Math.floor(0.75 * ((800 - 20 * (f.size + 1)) / f.size));
        G = 1;
        for (jj = 0; jj < f.size * f.size; jj++) b[jj] = 0;
        q = f.stone;
        var a, d, e, g = Math.floor(10 * Math.random());
        for (io = 0; io <= 40 + g; io++) a = Math.floor(Math.random() * f.size * f.size), d = Math.floor(Math.random() * f.size * f.size), a != d && (e = q[a], q[a] = q[d], q[d] = e)
    };
    this.Update = function () {
        if (j) switch (App.isMusicEnable() && (a.audio.isPlaying() || a.audio.PlayMusic(Assets.music)), I += J, 0 >= I && (J = 1), 1200 <= I && (J = -1), G) {
        case 1:
            L += 1;
            switch (n) {
            case 0:
                if (a.input.mouse.isMouseUp()) {
                    for (kk = 0; kk < b.length; kk++)
                        if (0 == b[kk] && a.input.mouse.inBound(Math.floor(kk % f.size) * (c + 15) + 150, Math.floor(kk / f.size) * (c + 15) + 15, c, c)) {
                            App.isSoundEnable() && a.audio.PlaySound(Assets.clickpiece);
                            r.Reset();
                            p = kk;
                            n = b[p] = 1;
                            break
                        }
                    a.input.mouse.inBound(37, 15, 75, 75) ? (App.isSoundEnable() && a.audio.PlaySound(Assets.click),
                        G = 2) : a.input.mouse.inBound(37, 97, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), a.LoadScene(new SceneGame(a, e)))
                }
                a.input.mouse.Clear();
                break;
            case 1:
                r.isComplete() ? (b[p] = 2, w.Reset(), r.Reset(), h.Reset(), D.Reset(), B.Reset(), A.Reset(), n = 2, F = E = C = !0) : r.Next();
                break;
            case 2:
                if (0 <= q[p]) n = 3;
                else {
                    switch (q[p]) {
                    case -1:
                        App.isSoundEnable() && C && a.audio.PlaySound(Assets.revealer);
                        z();
                        r.isComplete() ? (y(), b[p] = 6, h.isComplete() ? (k(), A.isComplete() ? (g(), b[p] = 3, n = 9) : A.Next()) : h.Next()) : r.Next();
                        break;
                    case -2:
                        b[p] =
                            6;
                        m(); - 1 != u ? (b[u] = 1, b[x] = 1, r.isComplete() ? (b[x] = 2, b[u] = 2, w.isComplete() ? (App.isSoundEnable() && E && a.audio.PlaySound(Assets.flipall), h.isComplete() ? (App.isSoundEnable() && F && a.audio.PlaySound(Assets.equal), b[x] = 5, b[u] = 5, b[p] = 3, B.isComplete() ? (s += 50, b[x] = 3, b[u] = 3, n = 9) : B.Next(), F = !1) : h.Next(), E = !1) : w.Tick()) : r.Next()) : w.isComplete() ? (b[p] = 3, n = 9) : w.Tick();
                        break;
                    case -3:
                        App.isSoundEnable() && C && a.audio.PlaySound(Assets.switchs);
                        l();
                        b[p] = 6;
                        h.isComplete() ? (d(), b[p] = 3, v(), n = 9) : h.Next();
                        break;
                    case -4:
                        App.isSoundEnable() &&
                            C && a.audio.PlaySound(Assets.bonus10x);
                        b[p] = 6;
                        h.isComplete() ? (s += 100, b[p] = 3, n = 9) : h.Next();
                        break;
                    case -5:
                        App.isSoundEnable() && C && a.audio.PlaySound(Assets.bonusx);
                        b[p] = 6;
                        h.isComplete() ? (s += 10, b[p] = 3, n = 9) : h.Next();
                        break;
                    case -6:
                        b[p] = 6, m(), -1 != u ? (b[u] = 1, b[x] = 1, r.isComplete() ? (b[x] = 2, b[u] = 2, w.isComplete() ? (App.isSoundEnable() && E && a.audio.PlaySound(Assets.bomb), h.isComplete() ? (App.isSoundEnable() && F && a.audio.PlaySound(Assets.bombexplosion), b[x] = 7, b[u] = 7, b[p] = 7, D.isComplete() ? (b[x] = 3, b[u] = 3, b[p] = 3, n = 9) : D.Next(),
                            F = !1) : h.Next(), E = !1) : w.Tick()) : r.Next()) : w.isComplete() ? (b[p] = 3, n = 9) : w.Tick()
                    }
                    C = !1
                }
                break;
            case 3:
                if (a.input.mouse.isMouseUp()) {
                    for (mm = 0; mm < b.length; mm++)
                        if (0 == b[mm] && a.input.mouse.inBound(Math.floor(mm % f.size) * (c + 15) + 150, Math.floor(mm / f.size) * (c + 15) + 15, c, c)) {
                            App.isSoundEnable() && a.audio.PlaySound(Assets.clickpiece);
                            r.Reset();
                            t = mm;
                            b[t] = 1;
                            n = 4;
                            break
                        }
                    a.input.mouse.inBound(37, 15, 75, 75) ? (App.isSoundEnable() && a.audio.PlaySound(Assets.click), G = 2) : a.input.mouse.inBound(37, 97, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click),
                        a.LoadScene(new SceneGame(a, e)))
                }
                a.input.mouse.Clear();
                break;
            case 4:
                r.isComplete() ? (b[t] = 2, w.Reset(), r.Reset(), h.Reset(), D.Reset(), A.Reset(), n = 5, F = E = C = !0) : r.Next();
                break;
            case 5:
                w.isComplete() ? (w.Reset(), n = 6) : w.Tick();
                break;
            case 6:
                if (0 <= q[t]) q[p] == q[t] ? (App.isSoundEnable() && a.audio.PlaySound(Assets.equal), B.Reset(), b[p] = 5, b[t] = 5, n = 8) : (App.isSoundEnable() && a.audio.PlaySound(Assets.diferent), K += 1, r.Reset(), b[p] = 4, b[t] = 4, n = 7);
                else {
                    switch (q[t]) {
                    case -1:
                        App.isSoundEnable() && C && a.audio.PlaySound(Assets.revealer);
                        z();
                        r.isComplete() ? (y(), b[t] = 6, h.isComplete() ? (k(), A.isComplete() ? (g(), b[t] = 3, n = 9) : A.Next()) : h.Next()) : r.Next();
                        break;
                    case -2:
                        b[t] = 6;
                        m(p); - 1 != u ? (b[x] = 1, r.isComplete() ? (b[x] = 2, w.isComplete() ? (App.isSoundEnable() && E && a.audio.PlaySound(Assets.flipall), h.isComplete() ? (App.isSoundEnable() && F && a.audio.PlaySound(Assets.equal), b[x] = 5, b[u] = 5, b[t] = 3, B.isComplete() ? (s += 50, b[x] = 3, b[u] = 3, n = 9) : B.Next(), F = !1) : h.Next(), E = !1) : w.Tick()) : r.Next()) : w.isComplete() ? (b[p] = 3, n = 9) : w.Tick();
                        break;
                    case -3:
                        App.isSoundEnable() &&
                            C && a.audio.PlaySound(Assets.switchs);
                        l();
                        b[t] = 6;
                        h.isComplete() ? (d(), b[t] = 3, v(), n = 3) : h.Next();
                        break;
                    case -4:
                        App.isSoundEnable() && C && a.audio.PlaySound(Assets.bonus10x);
                        b[t] = 6;
                        h.isComplete() ? (s += 100, n = b[t] = 3) : h.Next();
                        break;
                    case -5:
                        App.isSoundEnable() && C && a.audio.PlaySound(Assets.bonusx);
                        b[t] = 6;
                        h.isComplete() ? (s += 10, n = b[t] = 3) : h.Next();
                        break;
                    case -6:
                        b[t] = 6, m(p), -1 != u ? (b[x] = 1, r.isComplete() ? (b[x] = 2, w.isComplete() ? (App.isSoundEnable() && E && a.audio.PlaySound(Assets.bomb), h.isComplete() ? (App.isSoundEnable() &&
                            F && a.audio.PlaySound(Assets.bombexplosion), b[x] = 7, b[u] = 7, b[t] = 7, D.isComplete() ? (b[x] = 3, b[u] = 3, b[t] = 3, n = 9) : D.Next(), F = !1) : h.Next(), E = !1) : w.Tick()) : r.Next()) : w.isComplete() ? (b[t] = 3, n = 9) : w.Tick()
                    }
                    C = !1
                }
                break;
            case 7:
                A.isComplete() ? (b[p] = 0, n = b[t] = 0) : A.Next();
                break;
            case 8:
                B.isComplete() ? (s += 50, b[p] = 3, b[t] = 3, n = 9) : B.Next();
                break;
            case 9:
                var N = !0;
                for (nn = 0; nn < b.length; nn++)
                    if (3 != b[nn]) {
                        N = !1;
                        break
                    }
                N ? (App.isSoundEnable() && a.audio.PlaySound(Assets.levelcomplete), h.Reset(), s -= K, s += 10 * Math.floor(600 / (L / 25)), s += Math.floor(10 *
                    Math.random()), s > App.highscore[e] && (M = !0, App.highscore[e] = s, App.SaveSettings(a)), G = 3) : n = 0
            }
            break;
        case 2:
            a.input.mouse.isMouseUp() && (a.input.mouse.inBound(225, 375, 75, 75) ? (App.isSoundEnable() && a.audio.PlaySound(Assets.click), a.LoadScene(new SceneMenu(a))) : a.input.mouse.inBound(600, 375, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), G = 1));
            a.input.mouse.Clear();
            break;
        case 3:
            H.isComplete() || H.Next(), a.input.mouse.isMouseUp() && (a.input.mouse.inBound(225, 375, 75, 75) ? (App.isSoundEnable() && a.audio.PlaySound(Assets.click),
                a.LoadScene(new SceneMenu(a))) : a.input.mouse.inBound(412, 375, 75, 75) ? (App.isSoundEnable() && a.audio.PlaySound(Assets.click), App.LoadGame(a, e)) : a.input.mouse.inBound(600, 375, 75, 75) && (App.isSoundEnable() && a.audio.PlaySound(Assets.click), 29 > e ? App.LoadGame(a, e + 1) : a.LoadScene(new SceneFinal(a)))), a.input.mouse.Clear()
        }
    };
    this.Draw = function () {
        if (j) switch (a.graphics.Clear("#fff"), a.graphics.DrawTexture(Assets.background, 0 + I, 0, 1200, 800, 0, 0, 900, 600), a.graphics.DrawText("Level " + (Math.floor(e / 10) + 1) + " - " + (Math.floor(e %
            10) + 1), "22px Calibri", "#fff", 810, 15, "center", "top"), 0 < App.highscore[e] && a.graphics.DrawText("Highscore : " + App.highscore[e], "22px Calibri", "#fff", 810, 35, "center", "top"), G) {
        case 1:
            a.graphics.DrawTexture(Assets.button, 300, 0, 100, 100, 37, 15, 75, 75);
            a.graphics.DrawTexture(Assets.button, 500, 0, 100, 100, 37, 97, 75, 75);
            for (ii = 0; ii < b.length; ii++) 0 == b[ii] ? a.graphics.DrawTexture(Assets.backstone, 0, 0, 175, 175, Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c) : 1 == b[ii] ? a.graphics.DrawTexture(Assets.backstone,
                r.X(), r.Y(), r.Width(), r.Height(), Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c) : 2 == b[ii] ? (a.graphics.DrawTexture(Assets.backstone, 1225, 0, 175, 175, Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c), 0 <= q[ii] ? a.graphics.DrawTexture(Assets.pieces, 175 * q[ii], 0, 175, 175, Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c) : a.graphics.DrawTexture(Assets.special[6 + q[ii]], 0, 0, 175, 175, Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c)) :
                4 == b[ii] ? a.graphics.DrawTexture(Assets.backstone, 1225 - A.X(), A.Y(), A.Width(), A.Height(), Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c) : 5 == b[ii] ? a.graphics.DrawTexture(Assets.effectstar, B.X(), B.Y(), B.Width(), B.Height(), Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c) : 6 == b[ii] ? (a.graphics.DrawTexture(Assets.backstone, 1225, 0, 175, 175, Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c), a.graphics.DrawTexture(Assets.special[6 + q[ii]], h.X(), h.Y(),
                    h.Width(), h.Height(), Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c)) : 7 == b[ii] ? a.graphics.DrawTexture(Assets.effectexplosion, D.X(), D.Y(), D.Width(), D.Height(), Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c) : 8 == b[ii] && (a.graphics.DrawTexture(Assets.backstone, 0, 0, 175, 175, Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii / f.size) * (c + 15) + 15, c, c), a.graphics.DrawTexture(Assets.special[3], h.X(), h.Y(), h.Width(), h.Height(), Math.floor(ii % f.size) * (c + 15) + 150, Math.floor(ii /
                    f.size) * (c + 15) + 15, c, c));
            break;
        case 2:
            a.graphics.DrawTexture(Assets.menu, 800, 0, 800, 600, 150, 75, 600, 450);
            a.graphics.DrawTexture(Assets.button, 900, 0, 100, 100, 225, 375, 75, 75);
            a.graphics.DrawTexture(Assets.button, 1E3, 0, 100, 100, 600, 375, 75, 75);
            break;
        case 3:
            a.graphics.DrawTexture(Assets.menu, 1600, 0, 800, 600, 150, 75, 600, 450), a.graphics.DrawTexture(Assets.button, 300, 0, 100, 100, 225, 375, 75, 75), a.graphics.DrawTexture(Assets.button, 500, 0, 100, 100, 412, 375, 75, 75), a.graphics.DrawTexture(Assets.button, 400, 0, 100, 100, 600, 375,
                75, 75), a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 408, 288, 22, 22), 1 < App.ScoreStar(f, s) ? a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 435, 288, 22, 22) : a.graphics.DrawTexture(Assets.star, 30, 0, 30, 30, 435, 288, 22, 22), 2 < App.ScoreStar(f, s) ? a.graphics.DrawTexture(Assets.star, 0, 0, 30, 30, 462, 288, 22, 22) : a.graphics.DrawTexture(Assets.star, 30, 0, 30, 30, 462, 288, 22, 22), a.graphics.DrawText("" + s, "22px Calibri", "#FFF", 450, 337, "center", "middle"), M && a.graphics.DrawTexture(Assets.highscore, H.X(), H.Y(), H.Width(), H.Height(),
                487, 262, 112, 112)
        }
    };
    this.Dispose = function () {};
    this.Resume = function () {
        j = !0
    };
    this.Pause = function () {
        j = !1
    }
}

function SceneFinal(a) {
    var e = !1,
        m, z, y, k, g, l, d;
    this.Inicialize = function () {
        m = 0;
        z = 1;
        g = new Bug.Animation(0, 0, 240, 240, 8, 3);
        y = new Bug.Animation(0, 240, 240, 240, 8, 3);
        k = new Bug.Animation(0, 480, 240, 240, 8, 3);
        d = l = 0
    };
    this.Update = function () {
        if (e) {
            App.isMusicEnable() && (a.audio.isPlaying() || a.audio.PlayMusic(Assets.music));
            m += z;
            0 >= m && (z = 1);
            1200 <= m && (z = -1);
            switch (d) {
            case 0:
                g.Reset();
                d = 1;
                l = 0;
                break;
            case 1:
                g.isComplete() ? d = 2 : g.Next();
                break;
            case 2:
                App.isSoundEnable() && a.audio.PlaySound(Assets.talk);
                k.Reset();
                d = 3;
                l = 2;
                break;
            case 3:
                k.isComplete() ? d = 4 : k.Next();
                break;
            case 4:
                k.Reset();
                d = 5;
                l = 2;
                break;
            case 5:
                k.isComplete() ? d = 6 : k.Next();
                break;
            case 6:
                y.Reset();
                d = 7;
                l = 1;
                break;
            case 7:
                y.isComplete() ? d = 8 : y.Next();
                break;
            case 8:
                g.Reset();
                d = 9;
                l = 0;
                break;
            case 9:
                g.isComplete() ? d = 10 : g.Next();
                break;
            case 10:
                g.Reset();
                d = 11;
                l = 0;
                break;
            case 11:
                g.isComplete() ? d = 12 : g.Next();
                break;
            case 12:
                g.Reset();
                d = 13;
                l = 0;
                break;
            case 13:
                g.isComplete() ? d = 6 : g.Next()
            }
            a.input.mouse.isMouseUp() && a.input.mouse.inBound(7, 518, 75, 75) && (App.isSoundEnable() && (a.audio.StopSound(),
                a.audio.PlaySound(Assets.click)), a.LoadScene(new SceneMenu(a)));
            a.input.mouse.Clear()
        }
    };
    this.Draw = function () {
        e && (a.graphics.Clear("#fff"), a.graphics.DrawTexture(Assets.background, 0 + m, 0, 1200, 800, 0, 0, 900, 600), a.graphics.DrawTexture(Assets.menu, 2400, 0, 800, 600, 150, 75, 600, 450), a.graphics.DrawText("Thank you for playing", "28px Calibri", "#801DFF", 450, 130, "center", "middle"), a.graphics.DrawText("InforExper \u00a9 2013", "18px Calibri", "#000", 450, 160, "center", "middle"), a.graphics.DrawText("ART & GAME DESIGN",
            "18px Calibri", "#801DFF", 450, 200, "center", "middle"), a.graphics.DrawText("Axel Ferreira", "18px Calibri", "#000", 450, 220, "center", "middle"), a.graphics.DrawText("PROGRAMMING", "18px Calibri", "#801DFF", 450, 260, "center", "middle"), a.graphics.DrawText("Adelcides Ferreira", "18px Calibri", "#000", 450, 280, "center", "middle"), a.graphics.DrawText("MUSIC", "18px Calibri", "#801DFF", 450, 320, "center", "middle"), a.graphics.DrawText("Music used under a Creative Commons License from UniqueTracks Inc.", "18px Calibri", "#000",
            450, 340, "center", "middle"), a.graphics.DrawText("TOOLS", "18px Calibri", "#801DFF", 450, 380, "center", "middle"), a.graphics.DrawTexture(Assets.tools, 335, 380, 229, 63), 0 == l ? a.graphics.DrawTexture(Assets.guide, g.X(), g.Y(), g.Width(), g.Height(), 360, 420, 180, 180) : 1 == l ? a.graphics.DrawTexture(Assets.guide, y.X(), y.Y(), y.Width(), y.Height(), 360, 420, 180, 180) : 2 == l && a.graphics.DrawTexture(Assets.guide, k.X(), k.Y(), k.Width(), k.Height(), 360, 420, 180, 180), a.graphics.DrawTexture(Assets.button, 300, 0, 100, 100, 7, 518, 75, 75))
    };
    this.Dispose =
        function () {};
    this.Resume = function () {
        e = !0
    };
    this.Pause = function () {
        e = !1
    }
}
game = new Bug.Game;
game.LoadScene(new SceneStart(game));
App.LoadBasic(game);
App.LoadFull(game);
App.LoadSettings(game);
window.onload = function () {
    document.getElementById('loading').style.visibility = 'hidden';
    game.Run();
}