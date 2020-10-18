import { BaseElement } from "./baseElement.js";
import { Point } from "./point.js";

export class Particle extends BaseElement {
    private friction: number = 0.98;
    velocity: Point;
    alpha: number = 1;

    constructor(protected context: CanvasRenderingContext2D, x: number, y: number, radius: number, velocity: Point, color?: string) {
        super(context, x, y, radius, color);

        this.velocity = velocity;
    }

    /**
     * override draw
     */
    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        super.draw();
        this.context.restore();
    }

    update() {
        this.draw()
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}