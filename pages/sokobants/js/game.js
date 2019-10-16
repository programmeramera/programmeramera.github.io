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
var Sokoban;
(function (Sokoban) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 1000, 600, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', Sokoban.Boot, false);
            _this.state.add('Preloader', Sokoban.Preloader, false);
            // this.state.add('MainMenu', MainMenu, false);
            _this.state.add('GamePlay', Sokoban.GamePlay, false);
            _this.state.add('Win', Sokoban.Win, false);
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Sokoban.Game = Game;
})(Sokoban || (Sokoban = {}));
// when the page has finished loading, create our game
window.onload = function () {
    var game = new Sokoban.Game();
};
var Sokoban;
(function (Sokoban) {
    var Helpers;
    (function (Helpers) {
        var EMPTY = 0;
        var WALL = 1;
        var SPOT = 2;
        var CRATE = 3;
        var PLAYER = 4;
        var TILESIZE = 40;
        // need a recursive function to copy arrays, no need to reinvent the wheel so I got it here
        // http://stackoverflow.com/questions/10941695/copy-an-arbitrary-n-dimensional-array-in-javascript 
        function copyArray(a) {
            var newArray = a.slice(0);
            for (var i = newArray.length; i > 0; i--) {
                if (newArray[i] instanceof Array) {
                    newArray[i] = copyArray(newArray[i]);
                }
            }
            return newArray;
        }
        Helpers.copyArray = copyArray;
        function parse(input) {
            var result = [];
            var row = 0;
            result[row] = [];
            for (var i = 0, col = 0; i <= input.length - 1; i++, col++) {
                switch (input[i]) {
                    case '|':
                        result[++row] = [];
                        col = -1;
                        break;
                    case '#':
                        result[row][col] = 1;
                        break;
                    case '$':
                        result[row][col] = 3;
                        break;
                    case '@':
                        result[row][col] = 4;
                        break;
                    case '.':
                        result[row][col] = 2;
                        break;
                    default:
                        result[row][col] = 0;
                        break;
                }
            }
            return result;
        }
        Helpers.parse = parse;
    })(Helpers = Sokoban.Helpers || (Sokoban.Helpers = {}));
})(Sokoban || (Sokoban = {}));
var Sokoban;
(function (Sokoban) {
    var MoveableObject = /** @class */ (function (_super) {
        __extends(MoveableObject, _super);
        function MoveableObject(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.game.add.existing(_this);
            return _this;
        }
        MoveableObject.prototype.move = function (deltaX, deltaY, tileSize, callback, listenerContext) {
            // move with a 1/10s tween
            var tween = this.game.add.tween(this);
            tween.to({
                x: this.x + deltaX * tileSize,
                y: this.y + deltaY * tileSize
            }, 100, Phaser.Easing.Linear.None, true);
            // setting an eventual tween callback 
            if (callback != null) {
                tween.onComplete.add(callback, listenerContext);
            }
        };
        return MoveableObject;
    }(Phaser.Sprite));
    Sokoban.MoveableObject = MoveableObject;
})(Sokoban || (Sokoban = {}));
/// <reference path="MoveableObject.ts" />
var Sokoban;
(function (Sokoban) {
    var Crate = /** @class */ (function (_super) {
        __extends(Crate, _super);
        function Crate(game, x, y) {
            return _super.call(this, game, x, y, 'tiles', 4) || this;
        }
        return Crate;
    }(Sokoban.MoveableObject));
    Sokoban.Crate = Crate;
})(Sokoban || (Sokoban = {}));
var Sokoban;
(function (Sokoban) {
    var Map = /** @class */ (function (_super) {
        __extends(Map, _super);
        function Map() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Map;
    }(Phaser.Group));
    Sokoban.Map = Map;
})(Sokoban || (Sokoban = {}));
var Sokoban;
(function (Sokoban) {
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            var _this = _super.call(this, game, x, y, 'tiles', 3) || this;
            _this.isMoving = false;
            return _this;
        }
        Player.prototype.move = function (deltaX, deltaY, tileSize) {
            // now the player is moving
            this.isMoving = true;
            // moving with a 1/10s tween
            _super.prototype.move.call(this, deltaX, deltaY, tileSize, function () {
                // now the player is not moving anymore
                this.isMoving = false;
            }, this);
            // updating player custom posX and posY attributes
            this.posX += deltaX;
            this.posY += deltaY;
        };
        return Player;
    }(Sokoban.MoveableObject));
    Sokoban.Player = Player;
})(Sokoban || (Sokoban = {}));
var Sokoban;
(function (Sokoban) {
    var Boot = /** @class */ (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.init = function () {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            // Enable physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.scale.pageAlignHorizontally = true;
            }
            else {
                //  Same goes for mobile settings.
                //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(480, 260, 1024, 768);
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
            }
        };
        Boot.prototype.create = function () {
            //  By this point the preloader assets have loaded to the cache, we've set the game settings
            //  So now let's start the real preloader going
            this.game.state.start('Preloader');
        };
        return Boot;
    }(Phaser.State));
    Sokoban.Boot = Boot;
})(Sokoban || (Sokoban = {}));
/// <reference path="../Objects/Crate.ts" />
/// <reference path="../Objects/Player.ts" />
/// <reference path="../Helpers.ts" />
var Helpers = Sokoban.Helpers;
var Sokoban;
(function (Sokoban) {
    var EMPTY = 0;
    var WALL = 1;
    var SPOT = 2;
    var CRATE = 3;
    var PLAYER = 4;
    var TILESIZE = 40;
    var GamePlay = /** @class */ (function (_super) {
        __extends(GamePlay, _super);
        function GamePlay() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // init(level: number[][]){
        //     this.level = level;
        //     this.undoArray = new Array<number[][]>();
        // }
        GamePlay.prototype.init = function (level) {
            this.level = Sokoban.Helpers.parse(level);
        };
        GamePlay.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 10, 20);
        };
        GamePlay.prototype.goFullScreen = function () {
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        };
        GamePlay.prototype.create = function () {
            this.game.input.keyboard.addCallbacks(this, this.onDown);
            this.game.time.advancedTiming = true;
            this.undoArray = new Array();
            this.crates = [];
            this.player = new Sokoban.Player(this.game, 0, 0);
            this.goFullScreen();
            this.drawLevel();
        };
        // a tile is walkable when it's an empty tile or a spot tile
        GamePlay.prototype.isWalkable = function (posX, posY) {
            return this.level[posY][posX] == EMPTY || this.level[posY][posX] == SPOT;
        };
        // a tile is a crate when it's a... guess what? crate, or it's a crate on its spot
        GamePlay.prototype.isCrate = function (posX, posY) {
            return this.level[posY][posX] == CRATE || this.level[posY][posX] == CRATE + SPOT;
        };
        // function to move the player
        GamePlay.prototype.move = function (deltaX, deltaY) {
            // if destination tile is walkable...
            if (this.isWalkable(this.player.posX + deltaX, this.player.posY + deltaY)) {
                // push current situation in the undo array
                this.undoArray.push(Sokoban.Helpers.copyArray(this.level));
                this.movePlayer(deltaX, deltaY);
            }
            // if the destination tile is a crate... 
            else if (this.isCrate(this.player.posX + deltaX, this.player.posY + deltaY)) {
                // ...if  after the create there's a walkable tils...
                if (this.isWalkable(this.player.posX + 2 * deltaX, this.player.posY + 2 * deltaY)) {
                    // push current situation in the undo array
                    this.undoArray.push(Sokoban.Helpers.copyArray(this.level));
                    // move the crate
                    this.moveCrate(deltaX, deltaY);
                    // move the player	
                    this.movePlayer(deltaX, deltaY);
                }
            }
        };
        // function to move the player
        GamePlay.prototype.movePlayer = function (deltaX, deltaY) {
            // updating player old position in level array   
            this.level[this.player.posY][this.player.posX] -= PLAYER;
            // let the player move with tweening
            this.player.move(deltaX, deltaY, TILESIZE);
            // updating player new position in level array 
            this.level[this.player.posY][this.player.posX] += PLAYER;
            // changing player frame accordingly  
            this.player.frame = this.level[this.player.posY][this.player.posX];
        };
        // function to move the crate
        GamePlay.prototype.moveCrate = function (deltaX, deltaY) {
            var oldCratePosX = this.player.posX + deltaX;
            var oldCratePosY = this.player.posY + deltaY;
            var newCratePosX = this.player.posX + 2 * deltaX;
            var newCratePosY = this.player.posY + 2 * deltaY;
            var crate = this.crates[oldCratePosY][oldCratePosX];
            crate.move(deltaX, deltaY, TILESIZE, function () {
                var haveWon = this.checkWin();
                if (haveWon) {
                    this.game.state.start('Win');
                }
            }, this);
            // updating crates array   
            this.crates[newCratePosY][newCratePosX] = crate;
            this.crates[oldCratePosY][oldCratePosX] = null;
            // updating crate positions in level array  
            this.level[oldCratePosY][oldCratePosX] -= CRATE;
            this.level[newCratePosY][newCratePosX] += CRATE;
            // changing crate frame accordingly  
            crate.frame = this.level[newCratePosY][newCratePosX];
        };
        GamePlay.prototype.checkWin = function () {
            for (var i = 0; i < this.level.length; i++) {
                for (var j = 0; j < this.level[i].length; j++) {
                    // not positioned a box on every spot
                    if (this.level[i][j] == SPOT) {
                        return false;
                    }
                }
            }
            return true;
        };
        GamePlay.prototype.onDown = function (e) {
            // if the player is not moving...
            if (!this.player.isMoving) {
                switch (e.keyCode) {
                    // left
                    case 37:
                        this.move(-1, 0);
                        break;
                    // up
                    case 38:
                        this.move(0, -1);
                        break;
                    // right
                    case 39:
                        this.move(1, 0);
                        break;
                    // down
                    case 40:
                        this.move(0, 1);
                        break;
                    // undo
                    case 46:
                        // if there's something to undo...
                        if (this.undoArray.length > 0) {
                            // then undo! and remove the latest move from undoArray
                            var undoLevel = this.undoArray.pop();
                            this.fixedGroup.destroy();
                            this.movingGroup.destroy();
                            this.level = [];
                            this.level = Sokoban.Helpers.copyArray(undoLevel);
                            this.drawLevel();
                        }
                        break;
                }
            }
        };
        GamePlay.prototype.drawLevel = function () {
            // empty crates array. Don't use crates = [] or it could mess with pointers
            this.crates.length = 0;
            // adding the two groups to the game
            this.fixedGroup = this.game.add.group();
            this.movingGroup = this.game.add.group();
            // variable used for tile creation
            var tile;
            // looping trough all level rows
            for (var i = 0; i < this.level.length; i++) {
                // creation of 2nd dimension of crates array
                this.crates[i] = [];
                // looping through all level columns
                for (var j = 0; j < this.level[i].length; j++) {
                    // by default, there are no crates at current level position, so we set to null its
                    // array entry
                    this.crates[i][j] = null;
                    // what do we have at row j, col i?
                    switch (this.level[i][j]) {
                        case PLAYER:
                        case PLAYER + SPOT:
                            // player creation
                            this.player.x = TILESIZE * j;
                            this.player.y = TILESIZE * i;
                            // assigning the player the proper frame
                            this.player.frame = this.level[i][j];
                            // creation of two custom attributes to store player x and y position
                            this.player.posX = j;
                            this.player.posY = i;
                            // adding the player to movingGroup
                            this.movingGroup.add(this.player);
                            // since the player is on the floor, I am also creating the floor tile
                            tile = this.game.add.sprite(TILESIZE * j, TILESIZE * i, "tiles");
                            tile.frame = this.level[i][j] - PLAYER;
                            // floor does not move so I am adding it to fixedGroup
                            this.fixedGroup.add(tile);
                            break;
                        case CRATE:
                        case CRATE + SPOT:
                            // crate creation, both as a sprite and as a crates array item
                            this.crates[i][j] = new Sokoban.Crate(this.game, TILESIZE * j, TILESIZE * i);
                            // assigning the crate the proper frame
                            this.crates[i][j].frame = this.level[i][j];
                            // adding the crate to movingGroup
                            this.movingGroup.add(this.crates[i][j]);
                            // since the create is on the floor, I am also creating the floor tile
                            tile = this.game.add.sprite(TILESIZE * j, TILESIZE * i, "tiles");
                            tile.frame = this.level[i][j] - CRATE;
                            // floor does not move so I am adding it to fixedGroup
                            this.fixedGroup.add(tile);
                            break;
                        default:
                            // creation of a simple tile
                            tile = this.game.add.sprite(TILESIZE * j, TILESIZE * i, "tiles");
                            tile.frame = this.level[i][j];
                            this.fixedGroup.add(tile);
                    }
                }
            }
        };
        return GamePlay;
    }(Phaser.State));
    Sokoban.GamePlay = GamePlay;
})(Sokoban || (Sokoban = {}));
var Sokoban;
(function (Sokoban) {
    var Preloader = /** @class */ (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ready = false;
            return _this;
        }
        Preloader.prototype.preload = function () {
            this.load.spritesheet('tiles', 'assets/tiles.png', 40, 40, 7);
        };
        Preloader.prototype.create = function () {
            var level = [[1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 1, 1, 1, 1, 1],
                [1, 0, 0, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 4, 2, 1, 3, 0, 1],
                [1, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 0, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]];
            var newLevel = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
                [1, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 2, 2, 2, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 1, 0, 0, 1],
                [1, 0, 1, 2, 2, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 1, 2, 0, 3, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 2, 1, 0, 1, 0, 0, 1],
                [1, 0, 1, 2, 2, 2, 1, 0, 1, 0, 2, 2, 2, 2, 2, 1, 0, 0, 0, 2, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 1],
                [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];
            var simpleLevel = [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 2, 0, 3, 0, 2, 1],
                [1, 0, 3, 4, 3, 0, 1],
                [1, 2, 0, 3, 0, 2, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ];
            var level4String = "#######|#.   .#|# $@$ #|# ### #|# $ $ #|#.   .#|#######";
            this.game.state.start('GamePlay', true, false, level4String);
        };
        return Preloader;
    }(Phaser.State));
    Sokoban.Preloader = Preloader;
})(Sokoban || (Sokoban = {}));
var Sokoban;
(function (Sokoban) {
    var Win = /** @class */ (function (_super) {
        __extends(Win, _super);
        function Win() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Win.prototype.create = function () {
            var winLabel = this.game.add.text(100, 100, 'You won!', { font: '50px Arial', fill: '#FFFFFF' });
            this.game.input.keyboard.addCallbacks(this, function () {
                var level5String = "#######|#. $ .#|# $@$ #|#. $ .#|#######";
                this.game.state.start('GamePlay', true, false, level5String);
            });
        };
        return Win;
    }(Phaser.State));
    Sokoban.Win = Win;
})(Sokoban || (Sokoban = {}));
