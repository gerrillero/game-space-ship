var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseElement } from "./baseElement.js";
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(context, x, y, radius, velocity, color) {
        var _this = _super.call(this, context, x, y, radius, color) || this;
        _this.context = context;
        _this.velocity = velocity;
        return _this;
    }
    Enemy.prototype.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    };
    return Enemy;
}(BaseElement));
export { Enemy };
