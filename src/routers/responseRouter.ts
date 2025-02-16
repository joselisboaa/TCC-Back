import { Router } from "express";
import { ResponseController } from "../controllers/responseController";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import { responseSchema } from "../middlewares/json/schemas/responseSchema";
import * as responseErrorHandler from "../middlewares/exceptions/responseErrorHandler";
import * as answerErrorHandler from "../middlewares/exceptions/answerErrorHandler";
import * as userErrorHandler from "../middlewares/exceptions/userErrorHandler"

import { MainController } from "../controllers/mainController";
import { verifyUserAuth } from "../middlewares/exceptions/authError";

export const responseRouter = new Router();

responseRouter.get("/",
    verifyUserAuth(),
    MainController.findAll
)

responseRouter.post("/",
    verifyUserAuth(),
    requestBodyValidator(responseSchema),
    answerErrorHandler.exists(true, true),
    userErrorHandler.exists(true),
    MainController.create
)

responseRouter.get("/:id",
    verifyUserAuth(),
    responseErrorHandler.exists(false),
    MainController.findById
)

responseRouter.delete("/:id",
    verifyUserAuth(),
    responseErrorHandler.exists(false),
    MainController.deleteById
)

responseRouter.put("/:id",
    verifyUserAuth(),
    requestBodyValidator(responseSchema),
    responseErrorHandler.exists(false),
    answerErrorHandler.exists(true, true),
    userErrorHandler.exists(true),
    MainController.update
)

responseRouter.get("/:id/report",
    verifyUserAuth(),
    responseErrorHandler.exists(false),
    MainController.sendReport,
)