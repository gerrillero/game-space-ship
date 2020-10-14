import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';
var Game = (function () {
    function Game(canvas) {
        this.projectiles = [];
        this.canvas = canvas;
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.context = canvas.getContext('2d');
    }
    Game.prototype.createPlayer = function (color) {
        this.player = new Player(this.context, this.canvas.width / 2, this.canvas.height / 2, 30, color);
    };
    Game.prototype.createProjectile = function (event) {
        var angle = Math.atan2(event.clientY - this.canvas.height / 2, event.clientX - this.canvas.width / 2);
        var velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.projectiles.push(new Projectile(this.context, this.player.x, this.player.y, 5, velocity, 'red'));
    };
    Game.prototype.animate = function () {
        requestAnimationFrame(this.animate.bind(this));
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();
        this.projectiles.forEach(function (projectile) {
            projectile.update();
        });
    };
    return Game;
}());
export { Game };
