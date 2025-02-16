import { Router } from "express";

import { AuthController } from "../controllers/authController";

export const authRouter = new Router();


authRouter.get("/login",
    AuthController.generateAuthUrl
)

authRouter.get("/login/callback",
    AuthController.callback
)

authRouter.get("/login/verify",
    AuthController.verifyIfUserWasLoggedIn
)
