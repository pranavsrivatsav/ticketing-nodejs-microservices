"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("../errors/CustomError");
const errorMiddleware = (err, _req, res, _next) => {
    if (err instanceof CustomError_1.CustomError) {
        res.status(err.statusCode).send(err.serializeErrors());
        return;
    }
    res.status(500).send({
        status: "Failure",
        message: [{ message: err.message }],
    });
};
exports.default = errorMiddleware;
