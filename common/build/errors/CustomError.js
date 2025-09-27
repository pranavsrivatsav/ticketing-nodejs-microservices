"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message); // calls the Error constructor with the message string
        Object.setPrototypeOf(this, CustomError.prototype); // Fix prototype chain
        // - if this is not done any class extending from this abstract class will not identify itself as an instance of this class
        // - basically instanceOf CustomError would return false
    }
}
exports.CustomError = CustomError;
