import { BaseElement } from "./baseElement.js";
export class Player extends BaseElement {
    constructor(context, x, y, radius, color) {
        super(context, x, y, radius, color);
        this.context = context;
    }
}
