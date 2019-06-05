"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = (function () {
    function Game() {
        var _this = this;
        this.handleTouchStart = function (evt) {
            // tap
        };
        this.run = function () {
            _this.update();
            _this.draw();
        };
        this.update = function () { };
        this.lerp = function (a, b, t) {
            return (1 - t) * a + t * b;
        };
        this.draw = function () {
            Game.ctx.fillStyle = "white";
            Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
            Game.ctx.fillStyle = "black";
            Game.ctx.fillRect(Game.canvas.width / 2 - 10, Game.canvas.height / 2 - 10, 20, 20);
        };
        window.addEventListener("load", function () {
            Game.canvas = document.getElementById("gameCanvas");
            Game.ctx = Game.canvas.getContext("2d", {
                alpha: true,
            });
            Game.ctx.textBaseline = "top";
            document.addEventListener("touchstart", _this.handleTouchStart, { passive: false });
            setInterval(_this.run, 1000.0 / _this.FPS);
        });
    }
    return Game;
}());
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
exports.Game = Game;
var game = new Game();
//# sourceMappingURL=game.js.map