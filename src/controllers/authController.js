"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
class AuthController {
    static async generateAuthUrl(req, res) {
        res.send({ redirectUrl: await authService.generateAuthUrl() });
    }
    static async callback(req, res) {
        const response = await authService.callback(req, res);
        res.redirect(process.env.FRONTEND_URL + "?code=" + response);
    }
    static async verifyIfUserWasLoggedIn(req, res) {
        const response = await authService.verifyIfUserWasLoggedIn(req);
        res.send(response);
    }
}
exports.AuthController = AuthController;
