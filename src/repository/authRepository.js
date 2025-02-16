"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
const userService_1 = require("../services/userService");
const prisma = new client_1.PrismaClient();
const userService = new userService_1.UserService();
class AuthRepository {
    async verifyIfUserAlreadyExists(email) {
        const loggedUser = await userService.findByEmail(email);
        if (loggedUser) {
            return loggedUser;
        }
        const newUser = {
            "email": email,
            "user_groups": [
                {
                    "id": 1,
                    "text": "Usuário Padrão"
                }
            ],
            "password": "default123",
            // Depois permitir que seja null
            "phone_number": "(99)99999-9999",
        };
        return await userService.create(newUser);
    }
}
exports.AuthRepository = AuthRepository;
