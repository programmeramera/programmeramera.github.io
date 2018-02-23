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
/// <reference path="../phaser-ce/typescript/phaser.d.ts"/>
var FlappyBird;
(function (FlappyBird) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 288, 505, Phaser.AUTO, "content", null) || this;
            _this.state.add("play", FlappyBird.PlayState, false);
            _this.state.add("preload", FlappyBird.PreloadState, false);
            _this.state.add("boot", FlappyBird.BootState, false);
            _this.state.add("menu", FlappyBird.MenuState, false);
            _this.state.start("boot");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    FlappyBird.Game = Game;
})(FlappyBird || (FlappyBird = {}));
window.onload = function () {
    var game = new FlappyBird.Game();
};
var FlappyBird;
(function (FlappyBird) {
    var Bird = /** @class */ (function (_super) {
        __extends(Bird, _super);
        function Bird(game, x, y, frame) {
            var _this = _super.call(this, game, x, y, "bird", frame) || this;
            _this.anchor.setTo(0.5, 0.5);
            _this.animations.add("flap");
            _this.animations.play("flap", 12, true);
            _this.flapSound = _this.game.add.audio('flap');
            _this.alive = false;
            _this.onGround = false;
            // enable physics on the bird
            // and disable gravity on the bird
            // until the game is started
            // also make sure the collisions are using circular body
            _this.game.physics.arcade.enableBody(_this);
            _this.body.setCircle(13, 5, -2);
            _this.body.allowGravity = false;
            _this.body.collideWorldBounds = true;
            _this.events.onKilled.add(_this.onKilled, _this);
            return _this;
        }
        Bird.prototype.flap = function () {
            if (this.alive) {
                this.onGround = false;
                this.flapSound.play();
                //cause our bird to "jump" upward
                this.body.velocity.y = -400;
                // rotate the bird to -40 degrees
                this.game.add.tween(this).to({ angle: -40 }, 100).start();
            }
        };
        Bird.prototype.update = function () {
            // check to see if our angle is less than 90
            // if it is rotate the bird towards the ground by 2.5 degrees
            if (this.angle < 90 && this.alive) {
                this.angle += 2.5;
            }
            if (!this.alive) {
                this.body.velocity.x = 0;
            }
        };
        Bird.prototype.onKilled = function () {
            this.exists = true;
            this.visible = true;
            this.animations.stop();
            var duration = 90 / this.y * 300;
            this.game.add.tween(this).to({ angle: 90 }, duration).start();
        };
        return Bird;
    }(Phaser.Sprite));
    FlappyBird.Bird = Bird;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var Ground = /** @class */ (function (_super) {
        __extends(Ground, _super);
        function Ground(game, x, y, width, height) {
            var _this = _super.call(this, game, x, y, width, height, "ground") || this;
            // start scrolling our ground
            _this.autoScroll(-200, 0);
            // enable physics on the ground sprite
            // this is needed for collision detection
            _this.game.physics.arcade.enableBody(_this);
            // we don't want the ground's body
            // to be affected by gravity or external forces
            _this.body.allowGravity = false;
            _this.body.immovable = true;
            return _this;
        }
        return Ground;
    }(Phaser.TileSprite));
    FlappyBird.Ground = Ground;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var Panorama = /** @class */ (function (_super) {
        __extends(Panorama, _super);
        function Panorama(game) {
            var _this = _super.call(this, game) || this;
            var clouds = _this.game.add.tileSprite(0, 300, 352, 100, "clouds");
            clouds.autoScroll(-20, 0);
            _this.add(clouds);
            var cityscape = _this.game.add.tileSprite(0, 330, 300, 43, "cityscape");
            cityscape.autoScroll(-30, 0);
            _this.add(cityscape);
            var trees = _this.game.add.tileSprite(0, 360, 415, 144, "trees");
            trees.autoScroll(-60, 0);
            _this.add(trees);
            return _this;
        }
        Panorama.prototype.stop = function () {
            this.callAll("stopScroll", null);
        };
        return Panorama;
    }(Phaser.Group));
    FlappyBird.Panorama = Panorama;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var Pipe = /** @class */ (function (_super) {
        __extends(Pipe, _super);
        function Pipe(game, x, y, frame) {
            var _this = _super.call(this, game, x, y, "pipe", frame) || this;
            _this.anchor.setTo(0.5, 0.5);
            _this.game.physics.arcade.enableBody(_this);
            _this.body.allowGravity = false;
            _this.body.immovable = true;
            return _this;
        }
        return Pipe;
    }(Phaser.Sprite));
    FlappyBird.Pipe = Pipe;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var PipeGroup = /** @class */ (function (_super) {
        __extends(PipeGroup, _super);
        function PipeGroup(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.topPipe = new FlappyBird.Pipe(_this.game, 0, 0, 0);
            _this.bottomPipe = new FlappyBird.Pipe(_this.game, 0, 440, 1);
            _this.add(_this.topPipe);
            _this.add(_this.bottomPipe);
            _this.setAll("body.velocity.x", -200);
            _this.hasScored = false;
            return _this;
        }
        PipeGroup.prototype.update = function () {
            if (!this.topPipe.inWorld) {
                this.exists = false;
            }
        };
        ;
        PipeGroup.prototype.reset = function (x, y) {
            this.topPipe.reset(0, 0);
            this.bottomPipe.reset(0, 440);
            this.x = x + 20;
            this.y = y;
            this.setAll("body.velocity.x", -200);
            this.hasScored = false;
            this.exists = true;
        };
        ;
        PipeGroup.prototype.stop = function () {
            this.setAll("body.velocity.x", 0);
        };
        ;
        return PipeGroup;
    }(Phaser.Group));
    FlappyBird.PipeGroup = PipeGroup;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var ScoreBoard = /** @class */ (function (_super) {
        __extends(ScoreBoard, _super);
        function ScoreBoard(game) {
            var _this = _super.call(this, game) || this;
            var gameover = _this.create(_this.game.width / 2, 100, "gameover");
            gameover.anchor.setTo(0.5, 0.5);
            _this.scoreboard = _this.create(_this.game.width / 2, 200, "scoreboard");
            _this.scoreboard.anchor.setTo(0.5, 0.5);
            _this.scoreText = _this.game.add.bitmapText(_this.scoreboard.width, 180, "flappyfont", "", 18);
            _this.add(_this.scoreText);
            _this.bestText = _this.game.add.bitmapText(_this.scoreboard.width, 230, "flappyfont", "", 18);
            _this.add(_this.bestText);
            // add our start button with a callback
            _this.startButton = _this.game.add.button(_this.game.width / 2, 300, "startButton", _this.startClick, _this);
            _this.startButton.anchor.setTo(0.5, 0.5);
            _this.add(_this.startButton);
            _this.y = _this.game.height;
            _this.x = 0;
            return _this;
        }
        ScoreBoard.prototype.show = function (score) {
            var coin, bestScore;
            this.scoreText.setText(score.toString());
            if (localStorage) {
                bestScore = localStorage.getItem("bestScore");
                if (!bestScore || bestScore < score) {
                    bestScore = score;
                    localStorage.setItem("bestScore", bestScore);
                }
            }
            else {
                bestScore = "N/A";
            }
            this.bestText.setText(bestScore.toString());
            if (score >= 10 && score < 20) {
                coin = this.game.add.sprite(-65, 7, "medals", 1);
            }
            else if (score >= 20) {
                coin = this.game.add.sprite(-65, 7, "medals", 0);
            }
            this.game.add.tween(this).to({ y: 0 }, 1000, Phaser.Easing.Bounce.Out, true);
            if (coin) {
                coin.anchor.setTo(0.5, 0.5);
                this.scoreboard.addChild(coin);
            }
        };
        ScoreBoard.prototype.startClick = function () {
            this.game.state.start("play");
        };
        return ScoreBoard;
    }(Phaser.Group));
    FlappyBird.ScoreBoard = ScoreBoard;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var BootState = /** @class */ (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BootState.prototype.preload = function () {
            this.load.baseURL = "http://programmeramera.se/pages/flappybird";
            this.load.image("preloader", "assets/preloader.gif");
        };
        BootState.prototype.create = function () {
            this.game.input.maxPointers = 1;
            this.game.state.start("preload");
        };
        return BootState;
    }(Phaser.State));
    FlappyBird.BootState = BootState;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var MenuState = /** @class */ (function (_super) {
        __extends(MenuState, _super);
        function MenuState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MenuState.prototype.create = function () {
            this.game.add.sprite(0, 0, "sky");
            var panorama = new FlappyBird.Panorama(this.game);
            this.add.existing(panorama);
            var ground = this.game.add.tileSprite(0, 400, 335, 112, "ground");
            ground.autoScroll(-200, 0);
            var titleGroup = this.game.add.group();
            var title = this.add.sprite(0, 0, "title");
            titleGroup.add(title);
            var bird = this.add.sprite(200, 5, "bird");
            titleGroup.add(bird);
            bird.animations.add("flap");
            bird.animations.play("flap", 12, true);
            titleGroup.x = 30;
            titleGroup.y = 100;
            this.game.add.tween(titleGroup).to({ y: 115 }, 350, Phaser.Easing.Linear.None, true, 0, 1000, true);
            var startButton = this.game.add.button(this.game.width / 2, 300, "startButton", this.startClick, this);
            startButton.anchor.setTo(0.5, 0.5);
        };
        MenuState.prototype.startClick = function () {
            this.game.state.start("play");
        };
        return MenuState;
    }(Phaser.State));
    FlappyBird.MenuState = MenuState;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var PlayState = /** @class */ (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlayState.prototype.create = function () {
            // start the phaser arcade physics engine
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // give our world an initial gravity of 1200
            this.game.physics.arcade.gravity.y = 1200;
            this.background = this.game.add.sprite(0, 0, "sky");
            this.panorama = new FlappyBird.Panorama(this.game);
            this.game.add.existing(this.panorama);
            // create and add a group to hold our pipeGroup prefabs
            this.pipes = this.game.add.group();
            this.pipeGenerator = null;
            this.bird = new FlappyBird.Bird(this.game, 100, this.game.height / 2, 0);
            this.game.add.existing(this.bird);
            this.ground = new FlappyBird.Ground(this.game, 0, 400, 335, 112);
            this.game.add.existing(this.ground);
            // add mouse/touch controls
            this.game.input.onDown.addOnce(this.startGame, this);
            this.game.input.onDown.add(this.bird.flap, this.bird);
            this.score = 0;
            this.scoreText = this.game.add.bitmapText(this.game.width / 2, 10, "flappyfont", this.score.toString(), 24);
            this.groundHitSound = this.game.add.audio("groundHit");
            this.pipeHitSound = this.game.add.audio("pipeHit");
            this.scoreSound = this.game.add.audio("score");
            this.instructionsGroup = this.game.add.group();
            this.instructionsGroup.add(this.game.add.sprite(this.game.width / 2, 100, "getReady"));
            this.instructionsGroup.add(this.game.add.sprite(this.game.width / 2, 325, "instructions"));
            this.instructionsGroup.setAll("anchor.x", 0.5);
            this.instructionsGroup.setAll("anchor.y", 0.5);
            this.gameover = false;
        };
        PlayState.prototype.startGame = function () {
            if (!this.bird.alive && !this.gameover) {
                this.bird.body.allowGravity = true;
                this.bird.alive = true;
                // add a timer
                this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
                this.pipeGenerator.timer.start();
                this.instructionsGroup.destroy();
            }
        };
        PlayState.prototype.checkScore = function (pipeGroup) {
            if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
                pipeGroup.hasScored = true;
                this.score++;
                this.scoreText.setText(this.score.toString());
                this.scoreSound.play();
            }
        };
        PlayState.prototype.update = function () {
            // enable collisions between the bird and the ground
            this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
            if (!this.gameover) {
                // enable collisions between the bird and each group in the pipes group
                this.pipes.forEach(function (pipeGroup) {
                    this.checkScore(pipeGroup);
                    this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
                }, this);
            }
        };
        PlayState.prototype.deathHandler = function (bird, enemy) {
            if (enemy instanceof FlappyBird.Ground && !this.bird.onGround) {
                this.groundHitSound.play();
                this.bird.onGround = true;
                this.scoreboard = new FlappyBird.ScoreBoard(this.game);
                this.game.add.existing(this.scoreboard);
                this.scoreboard.show(this.score);
            }
            else if (enemy instanceof FlappyBird.Pipe) {
                this.pipeHitSound.play();
            }
            if (!this.gameover) {
                this.gameover = true;
                this.bird.kill();
                this.pipes.callAll("stop", null);
                this.pipeGenerator.timer.stop();
                this.ground.stopScroll();
                this.panorama.stop();
            }
        };
        PlayState.prototype.generatePipes = function () {
            var pipeY = this.game.rnd.integerInRange(-100, 100);
            var pipeGroup = this.pipes.getFirstExists(false);
            if (!pipeGroup) {
                pipeGroup = new FlappyBird.PipeGroup(this.game, this.pipes);
            }
            pipeGroup.reset(this.game.width, pipeY);
        };
        PlayState.prototype.render = function () {
            //this.game.debug.body(this.bird);
        };
        return PlayState;
    }(Phaser.State));
    FlappyBird.PlayState = PlayState;
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var PreloadState = /** @class */ (function (_super) {
        __extends(PreloadState, _super);
        function PreloadState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreloadState.prototype.preload = function () {
            var preloadBar = this.add.sprite(this.stage.width / 2, this.stage.height / 2, "preloader");
            preloadBar.anchor.setTo(0.5, 0.5);
            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.load.setPreloadSprite(preloadBar);
            // images
            this.load.image("sky", "assets/sky.png");
            this.load.image("ground", "assets/ground.png");
            this.load.image("title", "assets/title.png");
            this.load.image("startButton", "assets/start-button.png");
            this.load.image("instructions", "assets/instructions.png");
            this.load.image("getReady", "assets/get-ready.png");
            this.load.image("scoreboard", "assets/scoreboard.png");
            this.load.image("gameover", "assets/gameover.png");
            this.load.image("particle", "assets/particle.png");
            this.load.image("trees", "assets/trees.png");
            this.load.image("clouds", "assets/clouds.png");
            this.load.image("cityscape", "assets/cityscape.png");
            // sprite sheets
            this.load.spritesheet("medals", "assets/medals.png", 44, 46, 2);
            this.load.spritesheet("bird", "assets/bird.png", 34, 24, 3);
            this.load.spritesheet("pipe", "assets/pipes.png", 54, 320, 2);
            // sound effects
            this.load.audio("flap", "assets/flap.wav");
            this.load.audio("pipeHit", "assets/pipe-hit.wav");
            this.load.audio("groundHit", "assets/ground-hit.wav");
            this.load.audio("score", "assets/score.wav");
            this.load.audio("ouch", "assets/ouch.wav");
            // fonts
            this.load.bitmapFont("flappyfont", "assets/fonts/flappyfont/flappyfont.png", "assets/fonts/flappyfont/flappyfont.fnt");
        };
        PreloadState.prototype.update = function () {
            if (this.ready) {
                this.game.state.start("menu");
            }
        };
        PreloadState.prototype.onLoadComplete = function () {
            this.ready = true;
        };
        return PreloadState;
    }(Phaser.State));
    FlappyBird.PreloadState = PreloadState;
})(FlappyBird || (FlappyBird = {}));
