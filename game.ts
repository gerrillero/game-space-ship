
import { Enemy } from './enemy.js';
import { Particle } from './particle.js';
import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';

declare var gsap: any;

export class Game {
    private score: number = 0;
    context: CanvasRenderingContext2D;
    requestAnimateId: number;
    player: Player;
    projectiles: Projectile[] = [];
    particles: Particle[] = [];
    enemies: Enemy[] = [];

    constructor(private canvas: HTMLCanvasElement, private scoreCountElement: Element) {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight
        this.context = canvas.getContext('2d');
    }

    createPlayer(color: string, size: number) {
        this.player = new Player(this.context, this.canvas.width / 2, this.canvas.height / 2, size, color)
    }

    createEnemy() {
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`; // randomize enemies color.
        const radius = Math.random() * (30 - 10) + 10;

        let x: number;
        let y: number;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius;
            y = Math.random() * this.canvas.height;
        } else {
            x = Math.random() * this.canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : this.canvas.height + radius;
        }
        const angle = Math.atan2(this.canvas.height / 2 - y, this.canvas.width / 2 - x);
        const velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.enemies.push(new Enemy(this.context, x, y, radius, velocity, color));
    }

    addProjectile(event: MouseEvent, color: string) {
        const multiplyVelocty: number = 5;
        const angle = Math.atan2(event.clientY - this.canvas.height / 2, event.clientX - this.canvas.width / 2);
        const velocity = new Point(Math.cos(angle) * multiplyVelocty, Math.sin(angle) * multiplyVelocty);
        this.projectiles.push(new Projectile(this.context, this.player.x, this.player.y, 5, velocity, color));
    }

    animate() {
        this.requestAnimateId = requestAnimationFrame(this.animate.bind(this));

        // clearRect make a white background
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // So, we do with fillRect and fillStyle with opacity to get a moving/speed efect.
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

        this.particles.forEach((particle, index) => {
            if (particle.alpha <= 0)
                this.particles.splice(index, 1);
            else
                particle.update();
        });
    }

    spawEnemies() {
        setInterval(() => {
            this.createEnemy();
        }, 1000)
    }

    private removeProjectiles(projectile: Projectile, index: number) {
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > this.canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > this.canvas.height)
            this.projectiles.splice(index, 1);
    }

    private detectCollisions(enemy: Enemy, index: number) {

        // detect collision with the player
        const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
        if (distance - enemy.radius - this.player.radius < 1) {
            cancelAnimationFrame(this.requestAnimateId);
        }

        // detect collision with the projectiles
        this.projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            if (distance - enemy.radius - projectile.radius < 1) {

                for (let i = 0; i < 8; i++) {
                    this.particles.push(this.createParticle(projectile, enemy))
                }

                if (enemy.radius - 10 > 5) {
                    this.score += 100;
                    this.scoreCountElement.innerHTML = this.score.toString();;
                    gsap.to(enemy, { radius: enemy.radius - 10 });
                    enemy.radius -= 10;
                    setTimeout(() => {
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
                    this.score += 250;
                    this.scoreCountElement.innerHTML = this.score.toString();;
                    setTimeout(() => {
                        this.enemies.splice(index, 1);
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    }

    private createParticle(projectile: Projectile, enemy: Enemy): Particle {
        return new Particle(
            this.context,
            projectile.x,
            projectile.y,
            3,
            new Point((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6),
            enemy.color);
    }
}