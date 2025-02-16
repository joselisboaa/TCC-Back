import { PrismaClient } from '@prisma/client';
import { UserService } from '../services/userService';

const prisma = new PrismaClient();
const userService = new UserService();

export class AuthRepository {
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
            "phone_number":  "(99)99999-9999",
        };
        
        return await userService.create(newUser);
    }
}
