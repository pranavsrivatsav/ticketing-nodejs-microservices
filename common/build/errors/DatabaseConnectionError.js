"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const CustomError_1 = require("./CustomError");
const defaultReason = "Error connecting to database";
class DatabaseConnectionError extends CustomError_1.CustomError {
    constructor(reason = "") {
        reason = reason || defaultReason;
        super(reason);
        this.reason = reason;
        this.statusCode = 500;
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
