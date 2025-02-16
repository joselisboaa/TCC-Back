"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const url_1 = require("url");
const userService_1 = require("./userService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const redirectURI = process.env.redirect_url;
const frontendURL = process.env.FRONTEND_URL;
const jwtSecret = process.env.JWT_SECRET;
const oauthclient = new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirectURI);
const authorizeUrl = oauthclient.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
});
const validateIdToken = async (id_token) => {
    const ticket = await oauthclient.verifyIdToken({
        idToken: id_token,
        audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
};
const generateJwtFromIdToken = async (id_token) => {
    const payload = await validateIdToken(id_token);
    if (!payload) {
        return "token inválido.";
    }
    const jwtPayload = {
        email: payload['email']
    };
    await verifyIfUserAlreadyExists(payload["email"]);
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn: '3h' });
    return jwtToken;
};
const verifyIfUserAlreadyExists = async (email) => {
    const userService = new userService_1.UserService();
    const loggedUser = await userService.findByEmail(email);
    const newUser = {
        "email": email,
        "user_groups": [
            {
                "id": 1,
                "text": "Usuário Padrão"
            }
        ],
        "password": "default123",
        //Depois permitir que seja null
        "phone_number": "(99)99999-9999",
    };
    if (loggedUser) {
        return;
    }
    return await userService.create(newUser);
};
class AuthService {
    async generateAuthUrl() {
        return authorizeUrl;
    }
    ;
    async verifyIfUserWasLoggedIn(req) {
        const queryParam = req.query;
        const jwt_token = queryParam["jwt"];
        const redirectData = {};
        const verification = jsonwebtoken_1.default.verify(jwt_token, jwtSecret, (error) => {
            if (error) {
                console.error('Erro na autenticação: ');
                redirectData["redirectURL"] = frontendURL;
                redirectData["message"] = "Sessão expirada!";
                return redirectData;
            }
            redirectData["redirectURL"] = frontendURL + "/home";
            redirectData["message"] = "Usuário já autenticado!";
            return redirectData;
        });
        return redirectData;
    }
    async callback(req, res) {
        try {
            const qs = new url_1.URL(req.url, 'http://localhost:3000').searchParams;
            const code = qs.get('code');
            if (!code)
                return res.status(400).send('Código de autorização não encontrado.');
            const { tokens } = await oauthclient.getToken(code);
            oauthclient.setCredentials(tokens);
            return await generateJwtFromIdToken(tokens.id_token);
        }
        catch (error) {
            console.error('Erro na autenticação: ', error);
            res.status(500).send('Erro ao autenticar usuário.');
        }
    }
}
exports.AuthService = AuthService;
