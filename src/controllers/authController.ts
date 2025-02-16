import { AuthService } from "../services/authService"

const authService = new AuthService();

export class AuthController {
    static async generateAuthUrl(req, res) {
        res.send({redirectUrl: await authService.generateAuthUrl()});
    }

    static async callback(req, res) {
        const response = await authService.callback(req, res)
        
        res.redirect(process.env.FRONTEND_URL + "?code=" + response);
    }

    static async verifyIfUserWasLoggedIn(req, res) {
        const response = await authService.verifyIfUserWasLoggedIn(req);

        res.send(response);
    }
}