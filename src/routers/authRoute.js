"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
exports.authRouter = new express_1.Router();
exports.authRouter.get("/login", authController_1.AuthController.generateAuthUrl);
exports.authRouter.get("/login/callback", authController_1.AuthController.callback);
exports.authRouter.get("/login/verify", authController_1.AuthController.verifyIfUserWasLoggedIn);
