"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    YELLOW_THRESHOLD: 20,
    RED_THRESHOLD: 30,
    CORS: process.env.FRONTEND_URL || '*',
    PORT: 8000
};
