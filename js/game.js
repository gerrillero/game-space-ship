import { Enemy } from './enemy.js';
import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';
var Game = (function () {
    function Game(canvas) {
        this.projectiles = [];
        this.enemies = [];
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
    Game.prototype.createEnemy = function () {
        var color = 'green';
        var radius = Math.random() * (30 - 10) + 10;
        var x;
        var y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius;
            y = Math.random() * this.canvas.height;
        }
        else {
            x = Math.random() * this.canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : this.canvas.height + radius;
        }
        var angle = Math.atan2(this.canvas.height / 2 - y, this.canvas.width / 2 - x);
        var velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.enemies.push(new Enemy(this.context, x, y, radius, velocity, color));
    };
    Game.prototype.animate = function () {
        requestAnimationFrame(this.animate.bind(this));
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();
        this.projectiles.forEach(function (projectile) {
            projectile.update();
        });
        this.enemies.forEach(function (enemy) {
            enemy.update();
        });
    };
    Game.prototype.spawEnemies = function () {
        var _this = this;
        setInterval(function () {
            _this.createEnemy();
        }, 1000);
    };
    return Game;
}());
export { Game };
