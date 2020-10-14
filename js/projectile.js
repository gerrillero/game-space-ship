import { BaseElement } from './baseElement.js';
export class Projectile extends BaseElement {
    constructor(context, x, y, radius, velocity, color) {
        super(context, x, y, radius, color);
        this.context = context;
        this.velocity = velocity;
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
