import { Router } from "express";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import { orientationSchema } from "../middlewares/json/schemas/orientationSchema";
import * as orientationErrorHandler from "../middlewares/exceptions/orientationErrorHandler";
import * as answerErrorHandler from "../middlewares/exceptions/answerErrorHandler";

import { MainController } from "../controllers/mainController";
import { verifyUserAuth } from "../middlewares/exceptions/authError";

export const orientationRouter = new Router();

orientationRouter.get("/",
    verifyUserAuth(),
    MainController.findAll
)

orientationRouter.post("/",
    verifyUserAuth(),
    requestBodyValidator(orientationSchema),
    answerErrorHandler.exists(true, false),
    MainController.create
)

orientationRouter.get("/:id",
    verifyUserAuth(),
    orientationErrorHandler.exists(false, false),
    MainController.findById
)

orientationRouter.delete("/:id",
    verifyUserAuth(),
    orientationErrorHandler.exists(false, false),
    MainController.deleteById
)

orientationRouter.put("/:id",
    verifyUserAuth(),
    requestBodyValidator(orientationSchema),
    orientationErrorHandler.exists(false, false),
    answerErrorHandler.exists(true, false),
    MainController.update
)
