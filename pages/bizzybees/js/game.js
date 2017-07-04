var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bee = (function (_super) {
    __extends(Bee, _super);
    function Bee(game, x, y, key, frame) {
        var _this = _super.call(this, game, x, y, key, frame) || this;
        _this.color = frame;
        _this.isSelected = false;
        return _this;
    }
    Bee.prototype.update = function () {
        this.frame = this.color;
        this.alpha = this.isSelected ? 0.5 : 1.0;
    };
    return Bee;
}(Phaser.Sprite));
var BeePicker = (function (_super) {
    __extends(BeePicker, _super);
    function BeePicker(game) {
        var _this = _super.call(this, game) || this;
        game.add.existing(_this);
        _this.classType = Bee;
        _this.reset();
        return _this;
    }
    BeePicker.prototype.reset = function () {
        this.removeAll();
        for (var i = 0; i < 5; i++) {
            this.create(BEE_START_X + i * BEE_DELTA_X, BEE_START_Y, TEXTURE_BEE_MAP, Math.floor(Math.random() * (NUMBER_OF_BEE_COLORS + 1)));
        }
        this.alive = true;
    };
    BeePicker.prototype.update = function () {
        if (this.alive) {
            if (this.game.input.activePointer.justPressed()) {
                var position = this.game.input.activePointer.position;
                if (position.y > 700) {
                    var selectedBeeIndex = Math.floor(position.x / BEE_DELTA_X);
                    for (var index = 0; index < this.children.length; index++) {
                        var bee = this.children[index];
                        bee.isSelected = index == selectedBeeIndex;
                    }
                }
            }
        }
        _super.prototype.update.call(this);
    };
    BeePicker.prototype.getSelectedBee = function () {
        var selectedBee = undefined;
        this.children.some(function (element) {
            var bee = element;
            if (bee.isSelected) {
                selectedBee = bee;
                return true;
            }
            else {
                return false;
            }
        });
        return selectedBee;
    };
    BeePicker.prototype.removeAndReplaceSelectedBee = function (availableFlowers) {
        var selectedBee = this.getSelectedBee();
        if (selectedBee == undefined)
            return;
        var beeIndex = this.children.indexOf(selectedBee);
        //check if we already have a bee that matches the available flowers 
        //remember to skip over the selectedBee since it will be removed in a moment
        var match = false;
        var rainbowColor = 6;
        //if there is a rainbow flower it will always match
        if (rainbowColor in availableFlowers)
            match = true;
        else {
            for (var i = 0; i < this.length; i++) {
                var bee = this.children[i];
                if (i != beeIndex && bee.color in availableFlowers) {
                    match = true;
                    break;
                }
            }
        }
        var color;
        if (match) {
            //we already have a match, just add a random colored bee
            color = Math.floor(Math.random() * (NUMBER_OF_BEE_COLORS + 1));
        }
        else {
            //we have no match so we must pick a color from the available colors
            color = availableFlowers[Math.floor(Math.random() * (availableFlowers.length + 1))];
        }
        selectedBee.color = color;
        selectedBee.isSelected = false;
    };
    BeePicker.prototype.deselectAll = function () {
        this.children.forEach(function (element) {
            var bee = element;
            bee.isSelected = false;
        });
    };
    return BeePicker;
}(Phaser.Group));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        this.load.baseURL = "http://www.programmeramera.se/pages/bizzybees/";
        this.load.image(TEXTURE_PRELOADBAR, "assets/flowermap.png");
    };
    BootState.prototype.create = function () {
        this.game.state.start(STATE_PRELOADER, true, false);
    };
    return BootState;
}(Phaser.State));
var Column = (function (_super) {
    __extends(Column, _super);
    function Column(game, col) {
        var _this = _super.call(this, game) || this;
        _this.velocity = INITAL_VELOCITY;
        game.add.existing(_this);
        _this.x = col * FLOWER_COLUMN_WIDTH + FLOWER_COLUMN_MARGIN;
        _this.classType = Flower;
        _this.reset();
        var mask = game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        mask.drawRect(_this.x, 170, 100, 650);
        _this.mask = mask;
        return _this;
    }
    Column.prototype.reset = function () {
        this.removeAll();
        //add 3 flowers
        this.addRandomFlower(COLUMN_TOP + 2 * FLOWER_DELTA_Y);
        this.addRandomFlower(COLUMN_TOP + FLOWER_DELTA_Y);
        this.addRandomFlower(COLUMN_TOP);
        this.velocity = INITAL_VELOCITY;
        this.alive = true;
    };
    Object.defineProperty(Column.prototype, "reachedBottom", {
        get: function () {
            return (this.length != 0 && this.children[0].y >= COLUMN_BOTTOM);
        },
        enumerable: true,
        configurable: true
    });
    Column.prototype.addRandomFlower = function (y) {
        var color = Math.floor(Math.random() * (NUMBER_OF_FLOWER_COLORS + 1));
        this.create(0, y, TEXTURE_FLOWER_MAP, color);
    };
    Column.prototype.update = function () {
        var _this = this;
        if (this.alive) {
            this.children.forEach(function (element) {
                element.y += _this.velocity;
            });
            if (this.children.length == 0 || this.children[this.length - 1].y > COLUMN_TOP)
                this.addRandomFlower(COLUMN_TOP - FLOWER_DELTA_Y);
        }
    };
    Column.prototype.getBottomFlower = function () {
        if (this.length > 0)
            return this.getChildAt(0);
        else
            return null;
    };
    Column.prototype.removeBottomFlower = function () {
        if (this.length > 0) {
            this.removeChildAt(0);
        }
    };
    return Column;
}(Phaser.Group));
var COLUMN_TOP = 150;
var NUMBER_OF_FLOWER_COLORS = 6;
var RAINBOW_FLOWER_COLOR = 6;
var FLOWER_DELTA_Y = 80;
var FLOWER_WIDTH = 72;
var FLOWER_HEIGHT = 72;
var COLUMN_BOTTOM = 620;
var INITAL_VELOCITY = 0.4;
var FLOWER_COLUMN_WIDTH = 92;
var FLOWER_COLUMN_MARGIN = 22;
var TEXTURE_BACKGROUND = "backgroundTexture";
var TEXTURE_FOREGROUND = "foregroundTexture";
var TEXTURE_FLOWER_MAP = "flowerMap";
var TEXTURE_BEE_MAP = "beeMap";
var TEXTURE_HUD = "hudBackground";
var TEXTURE_PRELOADBAR = "preloadBar";
var BEE_DELTA_X = 96;
var BEE_START_X = 5;
var BEE_START_Y = 700;
var NUMBER_OF_BEE_COLORS = NUMBER_OF_FLOWER_COLORS - 1;
var FONT_SMALL = { font: "24px Arial", fill: "#000" };
var FONT_MEDIUM = { font: "30px Arial", fill: "#000" };
var FONT_LARGE = { font: "36px Arial", fill: "#000" };
var FONT_HUGE = { font: "46px Arial", fill: "#000", fontWeight: "bold" };
var STATE_GAME = "GameState";
var STATE_PRELOADER = "PreloaderState";
var STATE_BOOT = "BootState";
var STATE_GAME_OVER = "GameOverState";
var Flower = (function (_super) {
    __extends(Flower, _super);
    function Flower(game, x, y, key, frame) {
        var _this = _super.call(this, game, x, y, key, frame) || this;
        _this.color = frame;
        return _this;
    }
    return Flower;
}(Phaser.Sprite));
var BizzyBeesGame = (function (_super) {
    __extends(BizzyBeesGame, _super);
    function BizzyBeesGame() {
        var _this = _super.call(this, 480, 800, Phaser.AUTO, 'content', null) || this;
        _this.state.add(STATE_BOOT, BootState, null);
        _this.state.add(STATE_PRELOADER, PreloaderState, null);
        _this.state.add(STATE_GAME_OVER, GameOverState, null);
        _this.state.add(STATE_GAME, GameState, null);
        _this.state.start(STATE_BOOT);
        return _this;
    }
    return BizzyBeesGame;
}(Phaser.Game));
// when the page has finished loading, create our game
window.onload = function () {
    var game = new BizzyBeesGame();
};
var GameOverState = (function (_super) {
    __extends(GameOverState, _super);
    function GameOverState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameOverState.prototype.init = function (isGameOver, score) {
        this.isGameOver = isGameOver;
        this.score = score;
    };
    GameOverState.prototype.create = function () {
        this.add.sprite(0, 0, TEXTURE_BACKGROUND);
        if (this.isGameOver) {
            this.add.text(240, 300, "GAME OVER", FONT_HUGE).anchor.set(0.5, 0.5);
            this.add.text(240, 400, this.score + " points", FONT_HUGE).anchor.set(0.5, 0.5);
        }
        else {
            this.add.text(240, 300, "TAP TO PLAY", FONT_HUGE).anchor.set(0.5, 0.5);
        }
    };
    GameOverState.prototype.update = function () {
        this.input.onTap.addOnce(this.startGame, this);
    };
    GameOverState.prototype.startGame = function () {
        this.game.state.start(STATE_GAME, true, false);
    };
    return GameOverState;
}(Phaser.State));
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameState.prototype.create = function () {
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.backgroundTexture = this.add.sprite(0, 0, TEXTURE_BACKGROUND);
        this.foregroundTexture = this.add.sprite(0, 0, TEXTURE_FOREGROUND);
        this.hudTexture = this.add.sprite(7, 7, TEXTURE_HUD);
        this.add.text(100, 28, "Marathon", FONT_MEDIUM).anchor.set(0.5, 0.5);
        //Print out instructions
        this.add.text(340, 28, "Match flowers and bees", FONT_SMALL).anchor.set(0.5, 0.5);
        this.add.text(340, 55, "Rainbow flowers match", FONT_SMALL).anchor.set(0.5, 0.5);
        this.add.text(340, 80, "with all bees", FONT_SMALL).anchor.set(0.5, 0.5);
        //Print out goal message
        this.add.text(240, 130, "Collect Rainbow Flowers", FONT_LARGE).anchor.set(0.5, 0.5);
        this.scoreText = this.add.text(140, 65, "0", { font: "34px Arial" });
        this.scoreText.visible = true;
        this.scoreText.anchor.set(0.5, 0.5);
        this.levelText = this.add.text(55, 65, "1", { font: "34px Arial" });
        this.levelText.visible = true;
        this.levelText.anchor.set(0.5, 0.5);
        this.columns = new Array();
        for (var i = 0; i < 5; i++) {
            this.columns.push(new Column(this.game, i));
        }
        this.beePicker = new BeePicker(this.game);
        this.gameOverText = this.add.text(240, 400, "GAME OVER", FONT_HUGE);
        this.gameOverText.anchor.set(0.5, 0.5);
        this.gameOverText.visible = false;
    };
    GameState.prototype.update = function () {
        if (!this.gameOver) {
            if (this.input.activePointer.justPressed()) {
                var position = this.game.input.activePointer.position;
                var selectedBee = this.beePicker.getSelectedBee();
                if (selectedBee != undefined) {
                    //verify that we are tapping inside a column
                    if (position.x > 10 && position.x < 470 && position.y > 100 && position.y < 700) {
                        var rainbowColor = 6;
                        var selectedColumnIndex = Math.floor((position.x - 10) / FLOWER_COLUMN_WIDTH);
                        var selectedColumn = this.columns[selectedColumnIndex];
                        var selectedFlower = selectedColumn.getBottomFlower();
                        //check if we have a match or if it was a rainbow flower
                        if (selectedFlower != null && (selectedFlower.color == selectedBee.color || selectedFlower.color == rainbowColor)) {
                            //remove the bottom flower
                            selectedColumn.removeBottomFlower();
                            //replace the bee - making sure that there is always a match by passing in a list of all the bottom flower colors
                            var flowerColors_1 = new Array();
                            this.columns.forEach(function (element) {
                                var f = element.getBottomFlower();
                                if (f != null)
                                    flowerColors_1.push(f.color);
                            });
                            this.beePicker.removeAndReplaceSelectedBee(flowerColors_1);
                            //deselect the bee
                            this.beePicker.deselectAll();
                            //if it was a rainbow flower - add points
                            if (selectedFlower.color == rainbowColor) {
                                this.score += 1;
                                this.scoreText.text = "" + this.score;
                                //if we reached 10, 20, 30... points, increase the velocity to make the game harder as we go along
                                if ((this.score % 10) == 0) {
                                    this.level += 1;
                                    this.levelText.text = "" + this.level;
                                    this.columns.forEach(function (element) {
                                        element.velocity += 0.1;
                                    });
                                }
                            }
                        }
                    }
                }
            }
            var hasAnyFlowerReachedBottom = false;
            this.columns.forEach(function (element) {
                if (element.reachedBottom) {
                    hasAnyFlowerReachedBottom = true;
                }
            });
            if (hasAnyFlowerReachedBottom) {
                // this.gameOver = true;
                // this.beePicker.alive = false;
                // this.gameOverText.visible = true;
                // this.columns.forEach(element => {
                //     element.alive = false;
                // });
                this.game.state.start(STATE_GAME_OVER, true, false, true, this.score);
            }
        }
    };
    return GameState;
}(Phaser.State));
var PreloaderState = (function (_super) {
    __extends(PreloaderState, _super);
    function PreloaderState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloaderState.prototype.preload = function () {
        this.preloadBar = this.add.sprite(240, 250, TEXTURE_PRELOADBAR);
        this.preloadBar.anchor.set(0.5, 0.5);
        this.preloadBar.width = 430;
        this.preloadBar.height = 72;
        this.load.setPreloadSprite(this.preloadBar);
        this.load.image(TEXTURE_BACKGROUND, "assets/GameScreenBackground.png");
        this.load.image(TEXTURE_FOREGROUND, "assets/GameScreenForeground.png");
        this.load.image(TEXTURE_HUD, "assets/HUDBackground.png");
        this.load.spritesheet(TEXTURE_FLOWER_MAP, "assets/flowermap.png", 72, 72, 7);
        this.load.spritesheet(TEXTURE_BEE_MAP, "assets/beemap.png", 91, 91, 6);
    };
    PreloaderState.prototype.create = function () {
        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startGame, this);
    };
    PreloaderState.prototype.startGame = function () {
        this.game.state.start(STATE_GAME_OVER, true, false);
    };
    return PreloaderState;
}(Phaser.State));
