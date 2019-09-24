/// <reference path="../typedefinitions/kontra.d.ts"/>
var ANIMATION_FRAME_RATE = 60.0;
var DELTA_MOVEMENT_FRAME_RATE = 10.0;
var TileType;
(function (TileType) {
    TileType[TileType["Nothing"] = 0] = "Nothing";
    TileType[TileType["Ground"] = 1] = "Ground";
    TileType[TileType["Start"] = 2] = "Start";
    TileType[TileType["Win"] = 3] = "Win";
    TileType[TileType["Button"] = 4] = "Button";
    TileType[TileType["Bridge"] = 5] = "Bridge";
})(TileType || (TileType = {}));
var Tile = /** @class */ (function () {
    function Tile(x, y, type, sprite) {
        if (x === void 0) { x = 0; }
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = sprite;
    }
    return Tile;
}());
var Ground = /** @class */ (function () {
    function Ground() {
        // width: number = 5;
        // height: number = 5;
        // level: number[][] = [
        //     [0,0,2,0,0],
        //     [1,1,1,0,0],
        //     [1,1,1,1,1],
        //     [0,0,1,1,1],
        //     [0,0,3,0,0]
        // ];
        // width: number = 8;
        // height: number = 3;
        // level: number[][] = [
        //     [0,1,2,1,0,0,0,0],
        //     [1,1,1,1,1,1,1,1],
        //     [1,1,1,1,1,1,1,3],
        // ];
        this.width = 5;
        this.height = 5;
        this.level = [
            [0, 1, 2, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 5],
            [0, 6, 0, 0, 0],
            [1, 1, 1, 1, 3],
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 0],
        ];
        this.tiles = new Array();
    }
    Ground.prototype.afterMove = function (positions) {
        var result = false;
        if (positions.length == 1) { // check for exact position (standing up)
            var row = positions[0][0];
            var col = positions[0][1];
            switch (this.level[row][col]) {
                case 3: // win
                    break;
                case 5: // button
                    this.pressButton(this.level[row][col]);
                    break;
            }
            result = this.level[row][col] == 3;
        }
        return result;
    };
    Ground.prototype.pressButton = function (button) {
        this.tiles.forEach(function (tile) {
            if (tile.type == (button + 1)) {
                tile.sprite.playAnimation('rise');
                tile.type = TileType.Ground;
            }
        });
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                if (this.level[row][col] == button + 1) {
                    this.level[row][col] = 1;
                }
            }
        }
    };
    Ground.prototype.isValidMove = function (positions) {
        var _this = this;
        var result = true;
        positions.forEach(function (position) {
            if (position[0] < 0 || position[0] >= _this.height ||
                position[1] < 0 || position[1] >= _this.width ||
                _this.level[position[0]][position[1]] == 0 ||
                _this.level[position[0]][position[1]] == 6) {
                result = false;
            }
        });
        return result;
    };
    Ground.prototype.init = function () {
        var startx = 0;
        var starty = 0;
        var startPosition;
        for (var row = 0; row < this.height; row++) {
            var x = 200 - row * 28;
            var y = 241 + row * 11;
            for (var col = 0; col < this.width; col++) {
                var colx = x + 28 * col;
                var coly = y + 11 * col;
                if (this.level[row][col] != 0) {
                    var tileImage = 'ground';
                    var tile = null;
                    switch (this.level[row][col]) {
                        case 2: // start
                            // start tile, need to save this position for centering the player
                            startx = colx - 200;
                            starty = coly - 241;
                            startPosition = [row, col];
                            break;
                        case 3:
                            tileImage = 'win';
                            break;
                        case 5:
                            tileImage = 'button';
                            break;
                        case 6:
                            var spriteSheet = new kontra.SpriteSheet({
                                image: kontra.imageAssets['bridge_sprite'],
                                frameWidth: 200,
                                frameHeight: 200,
                                animations: {
                                    idle: {
                                        frames: [0],
                                        frameRate: ANIMATION_FRAME_RATE,
                                        loop: false
                                    },
                                    rise: {
                                        frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                        frameRate: ANIMATION_FRAME_RATE,
                                        loop: false
                                    }
                                }
                            });
                            var tileSprite = new kontra.Sprite({
                                width: 200,
                                height: 200,
                                anchor: {
                                    x: 0.5,
                                    y: 0.5
                                },
                                x: colx,
                                y: coly
                            });
                            tileSprite.animations = spriteSheet.animations;
                            tileSprite.playAnimation('idle');
                            tile = new Tile(col, row, this.level[row][col], tileSprite);
                            break;
                    }
                    if (tile == null) {
                        tile = new Tile(col, row, this.level[row][col], new kontra.Sprite({
                            width: 200,
                            height: 200,
                            anchor: {
                                x: 0.5,
                                y: 0.5
                            },
                            x: colx,
                            y: coly,
                            image: kontra.imageAssets[tileImage]
                        }));
                    }
                    this.tiles.push(tile);
                }
            }
        }
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            tile.sprite.x -= startx;
            tile.sprite.y -= starty;
        }
        return startPosition;
    };
    Ground.prototype.update = function () {
        var _this = this;
        this.tiles.forEach(function (tile) {
            tile.sprite.dx = _this.dx;
            tile.sprite.dy = _this.dy;
            tile.sprite.update();
        });
    };
    Ground.prototype.render = function () {
        this.tiles.forEach(function (tile) {
            tile.sprite.render();
        });
    };
    return Ground;
}());
var Player = /** @class */ (function () {
    function Player(callback) {
        this.nextAnim = 'idle0';
        this.currentpositions = new Array();
        this.callback = callback;
    }
    Player.prototype.init = function () {
        this.sprite = new kontra.Sprite({
            width: 200,
            height: 200,
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
        this.reset();
    };
    Player.prototype.reset = function () {
        this.moving = false;
        this.sprite.x = this.sprite.y = 200;
        this.sprite.dx = this.sprite.dy = 0;
    };
    Player.prototype.nextMove = function (anim) {
        var nextPositions = new Array();
        if (this.nextAnim == 'idle0') { // standing up
            var currentposition = this.currentpositions[0];
            switch (anim) {
                case 'up':
                    nextPositions.push([currentposition[0] - 1, currentposition[1]]);
                    nextPositions.push([currentposition[0] - 2, currentposition[1]]);
                    break;
                case 'down':
                    nextPositions.push([currentposition[0] + 1, currentposition[1]]);
                    nextPositions.push([currentposition[0] + 2, currentposition[1]]);
                    break;
                case 'right':
                    nextPositions.push([currentposition[0], currentposition[1] + 1]);
                    nextPositions.push([currentposition[0], currentposition[1] + 2]);
                    break;
                case 'left':
                    nextPositions.push([currentposition[0], currentposition[1] - 1]);
                    nextPositions.push([currentposition[0], currentposition[1] - 2]);
                    break;
            }
        }
        else if (this.nextAnim == 'idle1') {
            var currentposition1 = this.currentpositions[0];
            var currentposition2 = this.currentpositions[1];
            switch (anim) {
                case 'right':
                    nextPositions.push([currentposition1[0], currentposition1[1] + 1]);
                    nextPositions.push([currentposition2[0], currentposition2[1] + 1]);
                    break;
                case 'left':
                    nextPositions.push([currentposition1[0], currentposition1[1] - 1]);
                    nextPositions.push([currentposition2[0], currentposition2[1] - 1]);
                    break;
                case 'up':
                    var newPosition1 = [currentposition1[0] - 1, currentposition1[1]];
                    var newPosition2 = [currentposition2[0] - 1, currentposition2[1]];
                    if (newPosition1[0] == currentposition2[0] && newPosition1[1] == currentposition2[1]) {
                        nextPositions.push([newPosition2[0], newPosition2[1]]);
                    }
                    else if (newPosition2[0] == currentposition1[0] && newPosition2[1] == currentposition1[1]) {
                        nextPositions.push([newPosition1[0], newPosition1[1]]);
                    }
                    break;
                case 'down':
                    newPosition1 = [currentposition1[0] + 1, currentposition1[1]];
                    newPosition2 = [currentposition2[0] + 1, currentposition2[1]];
                    if (newPosition1[0] == currentposition2[0] && newPosition1[1] == currentposition2[1]) {
                        nextPositions.push([newPosition2[0], newPosition2[1]]);
                    }
                    else if (newPosition2[0] == currentposition1[0] && newPosition2[1] == currentposition1[1]) {
                        nextPositions.push([newPosition1[0], newPosition1[1]]);
                    }
                    break;
            }
        }
        else if (this.nextAnim == 'idle2') {
            var currentposition1 = this.currentpositions[0];
            var currentposition2 = this.currentpositions[1];
            switch (anim) {
                case 'up':
                    nextPositions.push([currentposition1[0] - 1, currentposition1[1]]);
                    nextPositions.push([currentposition2[0] - 1, currentposition2[1]]);
                    break;
                case 'down':
                    nextPositions.push([currentposition1[0] + 1, currentposition1[1]]);
                    nextPositions.push([currentposition2[0] + 1, currentposition2[1]]);
                    break;
                case 'left':
                    var newPosition1 = [currentposition1[0], currentposition1[1] - 1];
                    var newPosition2 = [currentposition2[0], currentposition2[1] - 1];
                    if (newPosition1[0] == currentposition2[0] && newPosition1[1] == currentposition2[1]) {
                        nextPositions.push([newPosition2[0], newPosition2[1]]);
                    }
                    else if (newPosition2[0] == currentposition1[0] && newPosition2[1] == currentposition1[1]) {
                        nextPositions.push([newPosition1[0], newPosition1[1]]);
                    }
                    break;
                case 'right':
                    newPosition1 = [currentposition1[0], currentposition1[1] + 1];
                    newPosition2 = [currentposition2[0], currentposition2[1] + 1];
                    if (newPosition1[0] == currentposition2[0] && newPosition1[1] == currentposition2[1]) {
                        nextPositions.push([newPosition2[0], newPosition2[1]]);
                    }
                    else if (newPosition2[0] == currentposition1[0] && newPosition2[1] == currentposition1[1]) {
                        nextPositions.push([newPosition1[0], newPosition1[1]]);
                    }
                    break;
            }
        }
        return nextPositions;
    };
    Player.prototype.move = function (anim) {
        if (this.moving)
            return;
        var currentAnim = '';
        var nextAnim = '';
        var deltax = 0.0;
        var deltay = 0.0;
        var x = this.sprite.x;
        var y = this.sprite.y;
        if (this.nextAnim == 'idle0') {
            deltax = 42.0 / DELTA_MOVEMENT_FRAME_RATE;
            deltay = 16.5 / DELTA_MOVEMENT_FRAME_RATE;
            nextAnim = 'idle1';
            switch (anim) {
                case 'up':
                    deltax = -deltax;
                    currentAnim = 'walk1';
                    break;
                case 'down':
                    deltay = -deltay;
                    currentAnim = 'walk2';
                    break;
                case 'right':
                    deltax = -deltax;
                    deltay = -deltay;
                    currentAnim = 'walk3';
                    nextAnim = 'idle2';
                    break;
                case 'left':
                    currentAnim = 'walk4';
                    nextAnim = 'idle2';
                    break;
            }
        }
        else if (this.nextAnim == 'idle1') {
            deltax = 28.0 / DELTA_MOVEMENT_FRAME_RATE;
            deltay = 11.0 / DELTA_MOVEMENT_FRAME_RATE;
            switch (anim) {
                case 'right':
                    deltax = -deltax;
                    deltay = -deltay;
                    currentAnim = 'walk5';
                    nextAnim = 'idle1';
                    break;
                case 'left':
                    x -= 28.0;
                    y -= 11.0;
                    currentAnim = 'walk6';
                    nextAnim = 'idle1';
                    break;
                case 'up':
                    deltax = -42.0 / DELTA_MOVEMENT_FRAME_RATE;
                    deltay = 16.5 / DELTA_MOVEMENT_FRAME_RATE;
                    x += 42.0;
                    y -= 16.5;
                    currentAnim = 'walk2inv';
                    nextAnim = 'idle0';
                    break;
                case 'down':
                    deltax = 42.0 / DELTA_MOVEMENT_FRAME_RATE;
                    deltay = -16.5 / DELTA_MOVEMENT_FRAME_RATE;
                    x -= 42.0;
                    y += 16.5;
                    currentAnim = 'walk1inv';
                    nextAnim = 'idle0';
                    break;
            }
        }
        else if (this.nextAnim == 'idle2') {
            deltax = 28.0 / DELTA_MOVEMENT_FRAME_RATE;
            deltay = 11.0 / DELTA_MOVEMENT_FRAME_RATE;
            nextAnim = 'idle2';
            switch (anim) {
                case 'up':
                    deltax = -deltax;
                    currentAnim = 'walk7';
                    break;
                case 'down':
                    deltay = -deltay;
                    x -= 28.0;
                    y += 11.0;
                    currentAnim = 'walk8';
                    break;
                case 'left':
                    deltax = 42.0 / DELTA_MOVEMENT_FRAME_RATE;
                    deltay = 16.5 / DELTA_MOVEMENT_FRAME_RATE;
                    x -= 42.0;
                    y -= 16.5;
                    currentAnim = 'walk4inv';
                    nextAnim = 'idle0';
                    break;
                case 'right':
                    deltax = -42.0 / DELTA_MOVEMENT_FRAME_RATE;
                    deltay = -16.5 / DELTA_MOVEMENT_FRAME_RATE;
                    x += 42.0;
                    y += 16.5;
                    currentAnim = 'walk3inv';
                    nextAnim = 'idle0';
                    break;
            }
        }
        this.nextAnim = nextAnim;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.dx = deltax;
        this.sprite.dy = deltay;
        this.sprite.playAnimation(currentAnim);
        this.moving = true;
    };
    Player.prototype.update = function () {
        if (this.sprite.currentAnimation.frames.length > 1 && this.sprite.currentAnimation._f == this.sprite.currentAnimation.frames.length - 1)
            this.stop();
        this.sprite.advance();
    };
    Player.prototype.stop = function () {
        if (this.moving == true) {
            this.sprite.playAnimation(this.nextAnim);
            this.reset();
            this.callback();
        }
    };
    return Player;
}());
var Game = /** @class */ (function () {
    function Game() {
    }
    Game.prototype.run = function () {
        this.init();
        this.loop = new kontra.GameLoop({
            update: this.update.bind(this),
            render: this.render.bind(this),
            fps: 30
        });
        this.loop.start();
    };
    Game.prototype.init = function () {
        kontra.init();
        kontra.initKeys();
        // prevent default key behavior
        kontra.bindKeys(['up', 'down', 'left', 'right'], function (e) {
            e.preventDefault();
        });
        // set image path so we don't have to reference the sprite sheet by it's path
        kontra.setImagePath('../assets/');
        // load the sprite sheet
        kontra.load('spritesheet.png', 'start.png', 'win.png', 'ground.png', 'button.png', 'bridge_sprite.png').then(function () {
            // create the spritesheet
            var spriteSheet = new kontra.SpriteSheet({
                image: kontra.imageAssets['spritesheet'],
                frameWidth: 200,
                frameHeight: 200,
                animations: {
                    idle0: {
                        frames: [0],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    idle1: {
                        frames: [1],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    idle2: {
                        frames: [2],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    ground: {
                        frames: [3],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk1: {
                        frames: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk2: {
                        frames: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk3: {
                        frames: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk4: {
                        frames: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk5: {
                        frames: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk6: {
                        frames: [58, 57, 56, 55, 54, 53, 52, 51, 50, 1],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk7: {
                        frames: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk8: {
                        frames: [68, 67, 66, 65, 64, 63, 62, 61, 60, 2],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk1inv: {
                        frames: [18, 17, 16, 15, 14, 13, 12, 11, 10, 0],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk2inv: {
                        frames: [28, 27, 26, 25, 24, 23, 22, 21, 20, 0],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk3inv: {
                        frames: [48, 47, 46, 45, 44, 43, 42, 41, 40, 0],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    },
                    walk4inv: {
                        frames: [38, 37, 36, 35, 34, 33, 32, 31, 30, 0],
                        frameRate: ANIMATION_FRAME_RATE,
                        loop: false
                    }
                }
            });
            var player = new Player(this.game.afterMoveCallback.bind(this.game));
            player.init();
            player.sprite.animations = spriteSheet.animations;
            var ground = new Ground();
            player.currentpositions.push(ground.init());
            this.game.ground = ground;
            this.game.player = player;
            this.game.loaded = true;
        });
    };
    Game.prototype.afterMoveCallback = function () {
        this.ground.afterMove(this.player.currentpositions);
    };
    Game.prototype.handleInput = function () {
        if (this.player.moving)
            return;
        if (kontra.keyPressed('up')) {
            this.tryMovePlayer('up');
        }
        else if (kontra.keyPressed('down')) {
            this.tryMovePlayer('down');
        }
        else if (kontra.keyPressed('left')) {
            this.tryMovePlayer('left');
        }
        else if (kontra.keyPressed('right')) {
            this.tryMovePlayer('right');
        }
    };
    Game.prototype.tryMovePlayer = function (anim) {
        var nextPositions = this.player.nextMove(anim);
        if (this.ground.isValidMove(nextPositions)) {
            // nextPositions.forEach(tile  => {
            //     console.log("x: {0} y :{1}", tile[0], tile[1]);
            // });
            this.player.move(anim);
            this.player.currentpositions = nextPositions;
        }
    };
    Game.prototype.update = function () {
        if (!this.loaded)
            return;
        this.handleInput();
        this.ground.dx = this.player.sprite.dx;
        this.ground.dy = this.player.sprite.dy;
        this.ground.update();
        this.player.update();
    };
    Game.prototype.render = function () {
        if (!this.loaded)
            return;
        this.ground.render();
        this.player.sprite.render();
    };
    return Game;
}());
var game = new Game();
game.run();
