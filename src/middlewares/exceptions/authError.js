"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
const verifyUserAuth = function () {
    return async function (req, res, next) {
        const authHeaderToken = req.headers["authorization"];
        let jwtToken = authHeaderToken;
        if (jwtToken === null || jwtToken === undefined || jwtToken === "") {
            return res.status(401).json({ message: "Não há usuário autenticado." });
        }
        if (authHeaderToken.includes("Bearer")) {
            jwtToken = authHeaderToken.split(" ")[1];
        }
        jsonwebtoken_1.default.verify(jwtToken, jwtSecret, (error, user) => {
            console.log(jwtToken);
            if (error) {
                return res.status(403).json({ message: "Token inválido ou expirado." });
            }
            next();
        });
    };
};
exports.verifyUserAuth = verifyUserAuth;
