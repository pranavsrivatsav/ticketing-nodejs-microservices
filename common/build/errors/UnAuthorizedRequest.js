"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedRequest = void 0;
const CustomError_1 = require("./CustomError");
class UnauthorizedRequest extends CustomError_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 401;
        Object.setPrototypeOf(this, UnauthorizedRequest.prototype);
    }
    serializeErrors() {
        return [
            {
                message: "Unauthorized Request",
            },
        ];
    }
}
exports.UnauthorizedRequest = UnauthorizedRequest;
