import { BaseElement } from "./baseElement.js";
import { Point } from "./point.js";

export class Player extends BaseElement {

    velocity: Point = new Point(0, 0)

    constructor(protected context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
        super(context, x, y, radius, color);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}