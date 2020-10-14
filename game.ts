import { Enemy } from './enemy.js';
import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';

export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    player: Player;
    projectiles: Projectile[] = [];
    enemies: Enemy[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight
        this.context = canvas.getContext('2d');
    }

    createPlayer(color: string) {
        this.player = new Player(this.context, this.canvas.width / 2, this.canvas.height / 2, 30, color)
    }

    createProjectile(event: MouseEvent) {
        const angle = Math.atan2(event.clientY - this.canvas.height / 2, event.clientX - this.canvas.width / 2);
        const velocity = new Point(Math.cos(angle), Math.sin(angle));
        this.projectiles.push(new Projectile(this.context, this.player.x, this.player.y, 5, velocity, 'red'));
    }

    createEnemy() {
        const color = 'green'
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

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();

        this.projectiles.forEach(projectile => {
            projectile.update();
        });

        this.enemies.forEach(enemy => {
            enemy.update();
        });
    }

    spawEnemies() {
        setInterval(() => {
            this.createEnemy();
        }, 1000)
    }
}