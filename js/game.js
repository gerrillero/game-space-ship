import { canvas, scoreCountElements, dialog, shootSound, explosionSound, playerColor, playerSize } from './constants.js';
import { Enemy } from './enemy.js';
import { Particle } from './particle.js';
import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';
export class Game {
    constructor() {
        this.score = 0;
        this.projectiles = [];
        this.particles = [];
        this.enemies = [];
        this.gameKeys = new Set();
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        this.context = canvas.getContext('2d');
    }
    setCoordenades(event) {
        this.windowX = event.clientX;
        this.windowY = event.clientY;
        console.log('x: ', this.windowX);
        console.log('y: ', this.windowY);
    }
    init(colorPlayer, sizePlayer) {
        this.reset();
        this.createPlayer(colorPlayer, sizePlayer);
        this.animate();
        this.spawEnemies();
    }
    keyUp(event) {
        this.gameKeys.delete(event.key);
        console.log('gameskeys: ', this.gameKeys);
    }
    keyDown(event) {
        this.gameKeys.add(event.key);
        console.log('gameskeys: ', this.gameKeys);
    }
    addProjectile() {
        shootSound.stop();
        const multiplyVelocty = 5;
        const velocity = new Point(Math.cos(this.shootDirection) * multiplyVelocty, Math.sin(this.shootDirection) * multiplyVelocty);
        this.projectiles.push(new Projectile(this.context, this.player.x, this.player.y, 5, velocity, playerColor));
        shootSound.play();
    }
    reset() {
        this.score = 0;
        this.projectiles = [];
        this.particles = [];
        this.enemies = [];
        this.updateScoreElements();
    }
    createPlayer(color, size) {
        this.player = new Player(this.context, canvas.width / 2, canvas.height / 2, size, color);
        this.shootDirection = -90 * Math.PI / 180;
    }
    createEnemy() {
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const radius = Math.random() * (30 - 10) + 10;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const angle = Math.atan2(this.player.y - y, this.player.x - x);
        const velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.enemies.push(new Enemy(this.context, x, y, radius, velocity, color));
    }
    animate() {
        this.checkKeys();
        this.requestAnimateId = requestAnimationFrame(this.animate.bind(this));
        this.context.fillStyle = 'rgba(0,0,0,0.1';
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.player.update();
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            this.removeProjectiles(projectile, index);
        });
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            this.detectCollisions(enemy, index);
        });
        this.particles.forEach((particle, index) => {
            if (particle.alpha <= 0)
                this.particles.splice(index, 1);
            else
                particle.update();
        });
    }
    checkKeys() {
        const velocity = 2;
        if (this.isDown('ArrowUp') || this.isDown('w')) {
            this.player.y -= velocity;
            this.shootDirection = -90 * Math.PI / 180;
        }
        if (this.isDown('ArrowDown') || this.isDown('s')) {
            this.player.y += velocity;
            this.shootDirection = 90 * Math.PI / 180;
            ;
        }
        if (this.isDown('ArrowLeft') || this.isDown('a')) {
            this.player.x -= velocity;
            this.shootDirection = -180 * Math.PI / 180;
            ;
        }
        if (this.isDown('ArrowRight') || this.isDown('d')) {
            this.player.x += velocity;
            this.shootDirection = 0 * Math.PI / 180;
            ;
        }
        if ((this.isDown('ArrowUp') || this.isDown('w')) && (this.isDown('ArrowLeft') || this.isDown('a')))
            this.shootDirection = -135 * Math.PI / 180;
        if ((this.isDown('ArrowUp') || this.isDown('w')) && (this.isDown('ArrowRight') || this.isDown('d')))
            this.shootDirection = -45 * Math.PI / 180;
        if ((this.isDown('ArrowDown') || this.isDown('s')) && (this.isDown('ArrowLeft') || this.isDown('a')))
            this.shootDirection = 135 * Math.PI / 180;
        if ((this.isDown('ArrowDown') || this.isDown('s')) && (this.isDown('ArrowRight') || this.isDown('d')))
            this.shootDirection = 45 * Math.PI / 180;
        if (this.isDown(' '))
            this.addProjectile();
        if (this.isDown('Enter'))
            this.init(playerColor, playerSize);
        if (this.gameKeys.size === 0)
            this.player.velocity = new Point(0, 0);
    }
    isDown(key) {
        return this.gameKeys.has(key);
    }
    spawEnemies() {
        setInterval(() => {
            this.createEnemy();
        }, 1000);
    }
    removeProjectiles(projectile, index) {
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height)
            this.projectiles.splice(index, 1);
    }
    detectCollisions(enemy, index) {
        const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
        if (distance - enemy.radius - this.player.radius < 1) {
            cancelAnimationFrame(this.requestAnimateId);
            dialog.style.display = 'block';
        }
        this.projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (distance - enemy.radius - projectile.radius < 1) {
                explosionSound.stop();
                explosionSound.play();
                for (let i = 0; i < 8; i++) {
                    this.particles.push(this.createParticle(projectile, enemy));
                }
                if (enemy.radius - 10 > 5) {
                    this.score += 100;
                    this.updateScoreElements();
                    gsap.to(enemy, { radius: enemy.radius - 10 });
                    enemy.radius -= 10;
                    setTimeout(() => {
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                else {
                    this.score += 250;
                    this.updateScoreElements();
                    setTimeout(() => {
                        this.enemies.splice(index, 1);
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    }
    updateScoreElements() {
        for (const ele of scoreCountElements) {
            ele.innerHTML = this.score.toString();
        }
    }
    createParticle(projectile, enemy) {
        return new Particle(this.context, projectile.x, projectile.y, 3, new Point((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6), enemy.color);
    }
}
