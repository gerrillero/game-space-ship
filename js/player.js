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
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(context, x, y, radius, color) {
        var _this = _super.call(this, context, x, y, radius, color) || this;
        _this.context = context;
        return _this;
    }
    return Player;
}(BaseElement));
export { Player };
