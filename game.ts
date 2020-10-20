import { canvas, scoreCountElements, dialog, shootSound, explosionSound, playerColor, playerSize } from './constants.js';
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
    windowX: number;
    windowY: number;

    constructor() {
        canvas.width = innerWidth;
        canvas.height = innerHeight
        this.context = canvas.getContext('2d');
    }

    setCoordenades(event: MouseEvent) {
        this.windowX = event.clientX;
        this.windowY = event.clientY;
        console.log(this.windowX);
    }

    init(colorPlayer: string, sizePlayer: number) {
        this.reset();
        this.createPlayer(colorPlayer, sizePlayer);
        this.animate();
        this.spawEnemies();
    }

    // keyDown(event: KeyboardEvent) {
    //     console.log('key: ', event.key);
    //     console.log('event', event)
    //     switch (event.key) {
    //         case ' ': // Space key.
    //             this.addProjectile();
    //             break;
    //         case 'Enter':
    //             this.init(playerColor, playerSize);
    //             break;
    //         case 'ArrowUp':
    //             this.player.velocity = new Point(0, -2);
    //             break;
    //         case 'ArrowDown':
    //             this.player.velocity = new Point(0, 2);
    //             break;
    //         case 'ArrowLeft':
    //             this.player.velocity = new Point(-2, 0);
    //             break;
    //         case 'ArrowRight':
    //             this.player.velocity = new Point(2, 0);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    addProjectile() {
        shootSound.stop();
        const multiplyVelocty: number = 5;
        const angle = Math.atan2(this.windowY - canvas.height / 2, this.windowX - canvas.width / 2);
        const velocity = new Point(Math.cos(angle) * multiplyVelocty, Math.sin(angle) * multiplyVelocty);
        this.projectiles.push(new Projectile(this.context, this.player.x, this.player.y, 5, velocity, playerColor));
        shootSound.play();
    }

    private reset() {
        this.score = 0;
        this.projectiles = [];
        this.particles = [];
        this.enemies = [];
        this.updateScoreElements();
    }

    private createPlayer(color: string, size: number) {
        this.player = new Player(this.context, canvas.width / 2, canvas.height / 2, size, color)
    }

    private createEnemy() {
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`; // randomize enemies color.
        const radius = Math.random() * (30 - 10) + 10;

        let x: number;
        let y: number;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.enemies.push(new Enemy(this.context, x, y, radius, velocity, color));
    }

    private animate() {
        this.requestAnimateId = requestAnimationFrame(this.animate.bind(this));

        // clearRect make a white background
        //this.context.clearRect(0, 0, canvas.width, canvas.height);

        // So, we do with fillRect and fillStyle with opacity to get a moving/speed efect.
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

    private spawEnemies() {
        setInterval(() => {
            this.createEnemy();
        }, 1000)
    }

    private removeProjectiles(projectile: Projectile, index: number) {
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height)
            this.projectiles.splice(index, 1);
    }

    private detectCollisions(enemy: Enemy, index: number) {

        // detect collision with the player
        const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
        if (distance - enemy.radius - this.player.radius < 1) {
            cancelAnimationFrame(this.requestAnimateId);

            dialog.style.display = 'block';
        }

        // detect collision with the projectiles
        this.projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            if (distance - enemy.radius - projectile.radius < 1) {

                explosionSound.stop();
                explosionSound.play();

                for (let i = 0; i < 8; i++) {
                    this.particles.push(this.createParticle(projectile, enemy))
                }

                if (enemy.radius - 10 > 5) {
                    this.score += 100;
                    this.updateScoreElements();
                    gsap.to(enemy, { radius: enemy.radius - 10 });
                    enemy.radius -= 10;
                    setTimeout(() => {
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
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

    private updateScoreElements() {
        for (const ele of scoreCountElements) {
            ele.innerHTML = this.score.toString();
        }
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