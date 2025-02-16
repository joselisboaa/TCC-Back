import { OAuth2Client } from 'google-auth-library';
import { URL } from 'url';
import { UserService } from './userService';
import jwt from 'jsonwebtoken';

const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const redirectURI = process.env.redirect_url;
const frontendURL = process.env.FRONTEND_URL;
const jwtSecret = process.env.JWT_SECRET;

const oauthclient = new OAuth2Client(
    clientId,
    clientSecret,
    redirectURI
);

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
}

const generateJwtFromIdToken = async (id_token) => {
    const payload = await validateIdToken(id_token);

    if (!payload) {
        return "token inválido.";
    }

    const jwtPayload = {
        email: payload['email']
    };

    await verifyIfUserAlreadyExists(payload["email"]);

    const jwtToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '3h' });
    return jwtToken;
}

const verifyIfUserAlreadyExists = async (email) => {
    const userService = new UserService();
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
        "phone_number":  "(99)99999-9999",
    }

    if (loggedUser) {
        return;
    }
    
    return await userService.create(newUser);
}

export class AuthService {
    async generateAuthUrl() {
        return authorizeUrl;
    };


    async verifyIfUserWasLoggedIn(req) {
        const queryParam = req.query

        const jwt_token = queryParam["jwt"];

        const redirectData = {};

        const verification = jwt.verify(jwt_token, jwtSecret, (error) => {
            if (error) {
                console.error('Erro na autenticação: ');

                redirectData["redirectURL"] = frontendURL
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
            const qs = new URL(req.url, 'http://localhost:3000').searchParams;
            const code = qs.get('code');
            
            if (!code) return res.status(400).send('Código de autorização não encontrado.');
            
            const { tokens } = await oauthclient.getToken(code);

            oauthclient.setCredentials(tokens);
    
            return await generateJwtFromIdToken(tokens.id_token);
        } catch (error) {
            console.error('Erro na autenticação: ', error);
            res.status(500).send('Erro ao autenticar usuário.');
        }
    }
}