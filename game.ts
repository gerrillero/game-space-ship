import { Player } from './player.js';
import { Point } from './point.js';
import { Projectile } from './projectile.js';

export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    player: Player;
    projectiles: Projectile[] = [];

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

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();

        this.projectiles.forEach(projectile => {
            projectile.update();
        });
    }

}