import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const verifyUserAuth = function () {
    return async function (req, res, next) {
        const authHeaderToken = req.headers["authorization"];

        let jwtToken = authHeaderToken;

        if (jwtToken === null || jwtToken === undefined || jwtToken === "") {
            return res.status(401).json({ message: "Não há usuário autenticado." });
        }
        
        if(authHeaderToken.includes("Bearer")) {
            jwtToken = authHeaderToken.split(" ")[1]
        }

        jwt.verify(jwtToken, jwtSecret, (error, user) => {
            console.log(jwtToken);

            if (error) {
                return res.status(403).json({ message: "Token inválido ou expirado." });
            }

            next();
        });
    }
}