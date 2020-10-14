import { BaseElement } from './baseElement.js';
import { Point } from './point.js';

export class Projectile extends BaseElement {
    velocity: Point;

    constructor(protected context: CanvasRenderingContext2D, x: number, y: number, radius: number, velocity: Point, color?: string) {
        super(context, x, y, radius, color);

        this.velocity = velocity;
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}