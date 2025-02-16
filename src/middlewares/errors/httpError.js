"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsError = void 0;
class HttpsError extends Error {
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpsError.prototype);
    }
}
exports.HttpsError = HttpsError;
