import { BaseElement } from "./baseElement.js";
export class Particle extends BaseElement {
    constructor(context, x, y, radius, velocity, color) {
        super(context, x, y, radius, color);
        this.context = context;
        this.friction = 0.98;
        this.alpha = 1;
        this.velocity = velocity;
    }
    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        super.draw();
        this.context.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}
