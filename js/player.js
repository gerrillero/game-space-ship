import { BaseElement } from "./baseElement.js";
import { Point } from "./point.js";
export class Player extends BaseElement {
    constructor(context, x, y, radius, color) {
        super(context, x, y, radius, color);
        this.context = context;
        this.velocity = new Point(0, 0);
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
