
export abstract class BaseElement {
    x: number;
    y: number;
    radius: number;
    color: string;

    constructor(protected context: CanvasRenderingContext2D, x: number, y: number, radius: number, color?: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color || 'black';
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
}