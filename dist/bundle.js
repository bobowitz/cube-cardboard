/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var box_1 = __webpack_require__(1);
var obstacle_1 = __webpack_require__(2);
var GameState;
(function (GameState) {
    GameState[GameState["PLAYING"] = 0] = "PLAYING";
    GameState[GameState["GAME_OVER"] = 1] = "GAME_OVER";
})(GameState || (GameState = {}));
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.FPS = 60;
        this.fullscreen = false;
        this.x = 0;
        this.targetX = 0;
        this.state = GameState.PLAYING;
        this.handleTouchStart = function (evt) {
            var x = evt.clientX;
            var y = evt.clientY;
            if (_this.state == GameState.GAME_OVER) {
                _this.state = GameState.PLAYING;
            }
            if (x >= Game.canvas.width - 100 && y >= Game.canvas.height - 100) {
                _this.toggleFullscreen();
            }
            else {
                _this.targetX++;
                if (_this.targetX > 1)
                    _this.targetX = -1;
                _this.backgroundColor =
                    "rgb(" +
                        Game.rand(200, 255) +
                        ", " +
                        Game.rand(200, 255) +
                        ", " +
                        Game.rand(200, 255) +
                        ")";
            }
        };
        this.toggleFullscreen = function () {
            if (!_this.fullscreen)
                document.documentElement.requestFullscreen();
            else
                document.exitFullscreen();
            _this.fullscreen = !_this.fullscreen;
        };
        this.run = function () {
            _this.update();
            _this.draw();
        };
        this.update = function () {
            if (_this.state == GameState.PLAYING) {
                for (var _i = 0, _a = _this.boxes; _i < _a.length; _i++) {
                    var b = _a[_i];
                    b.update();
                }
                for (var _b = 0, _c = _this.obstacles; _b < _c.length; _b++) {
                    var o = _c[_b];
                    o.update();
                    if (o.x == _this.targetX * 300 && o.z < 50)
                        _this.state = GameState.GAME_OVER;
                }
            }
            _this.x += 0.1 * (_this.targetX - _this.x);
        };
        this.lerp = function (a, b, t) {
            return (1 - t) * a + t * b;
        };
        this.drawRect = function (x, y, z, w, h) {
            var FOV = 100;
            var SCREEN_DIST = 50;
            var EYE_DIST = 100;
            // left eye rect
            var fov = (z / SCREEN_DIST) * FOV;
            var scale = FOV / fov;
            //z = infinity -> dist = 0
            //z = 0 -> dist = EYE_DIST / 2
            var wS = w * scale;
            Game.ctx.fillRect((x + EYE_DIST) * scale + Game.canvas.width * 0.25 - wS / 2, (y - h / 2) * scale + Game.canvas.height * 0.5, wS, h * scale);
            Game.ctx.fillRect((x - EYE_DIST) * scale + Game.canvas.width * 0.75 - wS / 2, (y - h / 2) * scale + Game.canvas.height * 0.5, wS, h * scale);
        };
        this.draw = function () {
            Game.canvas.width = window.innerWidth;
            Game.canvas.height = window.innerHeight;
            Game.ctx.fillStyle = _this.backgroundColor;
            Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
            _this.boxes.sort(function (a, b) { return b.z - a.z; });
            for (var _i = 0, _a = _this.boxes; _i < _a.length; _i++) {
                var b = _a[_i];
                b.draw(_this.x * 300);
            }
            _this.obstacles.sort(function (a, b) { return b.z - a.z; });
            for (var _b = 0, _c = _this.obstacles; _b < _c.length; _b++) {
                var o = _c[_b];
                o.draw(_this.x * 300);
            }
            if (!_this.fullscreen) {
                Game.ctx.fillStyle = "blue";
                Game.ctx.fillRect(Game.canvas.width - 100, Game.canvas.height - 100, 100, 100);
            }
            if (_this.state == GameState.GAME_OVER) {
                Game.ctx.fillStyle = "black";
                Game.ctx.globalAlpha = 0.5;
                Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
            }
        };
        window.addEventListener("load", function () {
            Game.canvas = document.getElementById("gameCanvas");
            Game.ctx = Game.canvas.getContext("2d", {
                alpha: true,
            });
            Game.ctx.textBaseline = "top";
            _this.backgroundColor = "white";
            Game.canvas.addEventListener("click", _this.handleTouchStart, false);
            _this.boxes = new Array();
            for (var x = -200; x <= 200; x += 50) {
                for (var y = -200; y <= 200; y += 50) {
                    _this.boxes.push(new box_1.Box(x, y, Game.rand(1000, 1200), 50, 50));
                }
            }
            _this.obstacles = new Array();
            for (var i = 0; i < 100; i++) {
                _this.obstacles.push(new obstacle_1.Obstacle(Game.rand(-1, 1) * 300, 0, i * 250 + 1000, 100, 100));
            }
            setInterval(_this.run, 1000.0 / _this.FPS);
        });
    }
    // [min, max] inclusive
    Game.rand = function (min, max) {
        if (max < min)
            return min;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Game.randTable = function (table) {
        return table[Game.rand(0, table.length - 1)];
    };
    Game.fillText = function (text, x, y, maxWidth) {
        Game.ctx.fillText(text, Math.round(x), Math.round(y), maxWidth);
    };
    return Game;
}());
exports.Game = Game;
var game = new Game();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var Box = /** @class */ (function () {
    function Box(x, y, z, w, h) {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.dx = 0;
        this.dy = 0;
        this.dz = 1;
        this.w = 0;
        this.h = 0;
        this.update = function () {
            _this.x += _this.dx;
            _this.y += _this.dy;
            _this.z += _this.dz;
            _this.dz += 0.5;
            if (_this.z > 1200) {
                _this.z = 1200;
                _this.dz *= -0.9;
            }
        };
        this.drawRect = function (x, y, z, w, h) {
            var FOV = 100.0;
            var SCREEN_DIST = 50.0;
            var EYE_DIST = 10.0;
            // left eye rect
            var fov = (z / SCREEN_DIST) * FOV;
            var scale = FOV / fov;
            //z = infinity -> dist = 0
            //z = 0 -> dist = EYE_DIST / 2
            var wS = w * scale;
            if ((x + EYE_DIST) * scale + game_1.Game.canvas.width * 0.25 - wS / 2 + Math.round(wS) <
                game_1.Game.canvas.width * 0.5) {
                game_1.Game.ctx.fillRect(Math.round((x + EYE_DIST) * scale + game_1.Game.canvas.width * 0.25 - wS / 2), Math.round((y - h / 2) * scale + game_1.Game.canvas.height * 0.5), Math.round(wS), Math.round(h * scale));
            }
            if (Math.round((x - EYE_DIST) * scale + game_1.Game.canvas.width * 0.75 - wS / 2) >
                game_1.Game.canvas.width * 0.5) {
                game_1.Game.ctx.fillRect(Math.round((x - EYE_DIST) * scale + game_1.Game.canvas.width * 0.75 - wS / 2), Math.round((y - h / 2) * scale + game_1.Game.canvas.height * 0.5), Math.round(wS), Math.round(h * scale));
            }
        };
        this.draw = function (camX) {
            game_1.Game.ctx.fillStyle = _this.color;
            _this.drawRect(_this.x - camX, _this.y, _this.z, _this.w, _this.h);
        };
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.color =
            "rgb(" + game_1.Game.rand(0, 255) + ", " + game_1.Game.rand(0, 255) + ", " + game_1.Game.rand(0, 255) + ")";
    }
    return Box;
}());
exports.Box = Box;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var box_1 = __webpack_require__(1);
var Obstacle = /** @class */ (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle(x, y, z, w, h) {
        var _this = _super.call(this, x, y, z, w, h) || this;
        _this.update = function () {
            _this.z -= 10;
            if (_this.z <= 0)
                _this.z += 25000;
        };
        _this.drawRect = function (x, y, z, w, h) {
            var FOV = 100.0;
            var SCREEN_DIST = 50.0;
            var EYE_DIST = 10.0;
            // left eye rect
            var fov = (z / SCREEN_DIST) * FOV;
            var scale = FOV / fov;
            //z = infinity -> dist = 0
            //z = 0 -> dist = EYE_DIST / 2
            var wS = w * scale;
            if ((x + EYE_DIST) * scale + game_1.Game.canvas.width * 0.25 - wS / 2 + Math.round(wS) <
                game_1.Game.canvas.width * 0.5) {
                game_1.Game.ctx.fillRect(Math.round((x + EYE_DIST) * scale + game_1.Game.canvas.width * 0.25 - wS / 2), Math.round((y - h / 2) * scale + game_1.Game.canvas.height * 0.5), Math.round(wS), Math.round(h * scale));
            }
            if (Math.round((x - EYE_DIST) * scale + game_1.Game.canvas.width * 0.75 - wS / 2) >
                game_1.Game.canvas.width * 0.5) {
                game_1.Game.ctx.fillRect(Math.round((x - EYE_DIST) * scale + game_1.Game.canvas.width * 0.75 - wS / 2), Math.round((y - h / 2) * scale + game_1.Game.canvas.height * 0.5), Math.round(wS), Math.round(h * scale));
            }
        };
        _this.draw = function (camX) {
            for (var i = 40; i >= 0; i--) {
                game_1.Game.ctx.fillStyle = "rgb(" + (40 - i) * 10 + ", 0, 0)";
                _this.drawRect(_this.x - camX, _this.y, _this.z + i, _this.w, _this.h);
            }
            game_1.Game.ctx.fillStyle = "red";
            _this.drawRect(_this.x - camX, _this.y, _this.z, _this.w, _this.h);
        };
        return _this;
    }
    return Obstacle;
}(box_1.Box));
exports.Obstacle = Obstacle;


/***/ })
/******/ ]);