import { Enemy } from './enemy.js';
import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';
export class Game {
    constructor(canvas) {
        this.projectiles = [];
        this.enemies = [];
        this.canvas = canvas;
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.context = canvas.getContext('2d');
    }
    createPlayer(color, size) {
        this.player = new Player(this.context, this.canvas.width / 2, this.canvas.height / 2, size, color);
    }
    createProjectile(event, color) {
        const multiplyVelocty = 5;
        const angle = Math.atan2(event.clientY - this.canvas.height / 2, event.clientX - this.canvas.width / 2);
        const velocity = new Point(Math.cos(angle) * multiplyVelocty, Math.sin(angle) * multiplyVelocty);
        this.projectiles.push(new Projectile(this.context, this.player.x, this.player.y, 5, velocity, color));
    }
    createEnemy() {
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const radius = Math.random() * (30 - 10) + 10;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius;
            y = Math.random() * this.canvas.height;
        }
        else {
            x = Math.random() * this.canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : this.canvas.height + radius;
        }
        const angle = Math.atan2(this.canvas.height / 2 - y, this.canvas.width / 2 - x);
        const velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.enemies.push(new Enemy(this.context, x, y, radius, velocity, color));
    }
    animate() {
        this.requestAnimateId = requestAnimationFrame(this.animate.bind(this));
        this.context.fillStyle = 'rgba(0,0,0,0.1';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            this.removeProjectiles(projectile, index);
        });
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            this.detectCollisions(enemy, index);
        });
    }
    spawEnemies() {
        setInterval(() => {
            this.createEnemy();
        }, 1000);
    }
    removeProjectiles(projectile, index) {
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > this.canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > this.canvas.height)
            this.projectiles.splice(index, 1);
    }
    detectCollisions(enemy, index) {
        const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
        if (distance - enemy.radius - this.player.radius < 1) {
            cancelAnimationFrame(this.requestAnimateId);
        }
        this.projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (distance - enemy.radius - projectile.radius < 1) {
                if (enemy.radius - 10 > 5) {
                    gsap.to(enemy, { radius: enemy.radius - 10 });
                    enemy.radius -= 10;
                    setTimeout(() => {
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                else {
                    setTimeout(() => {
                        this.enemies.splice(index, 1);
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    }
}
