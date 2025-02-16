"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = function (err, req, res, next) {
    res.status(err.statusCode).send({ "message": err.message, "cause": err.cause });
};
exports.errorHandler = errorHandler;
