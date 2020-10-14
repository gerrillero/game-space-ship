import { BaseElement } from "./baseElement.js";

export class Player extends BaseElement {

    constructor(protected context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
        super(context, x, y, radius, color);
    }
}