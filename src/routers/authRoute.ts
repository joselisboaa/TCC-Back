import { Router } from "express";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import { answerSchema } from "../middlewares/json/schemas/answerSchema";
import * as answerErrorHandler from "../middlewares/exceptions/answerErrorHandler";
import * as questionErrorHandler from "../middlewares/exceptions/questionErrorHandler";
//checar se tá logado

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
