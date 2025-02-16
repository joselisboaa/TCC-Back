import { Router } from "express";
import { QuestionController } from "../controllers/questionController";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import { questionSchema } from "../middlewares/json/schemas/questionSchema";
import * as questionErrorHandler from "../middlewares/exceptions/questionErrorHandler";
import * as userGroupErrorHandler from "../middlewares/exceptions/userGroupErrorHandler";
export const questionRouter = new Router();

import { MainController } from "../controllers/mainController";
import { verifyUserAuth } from "../middlewares/exceptions/authError";

questionRouter.get("/",
    verifyUserAuth(),
    MainController.findAll
)

questionRouter.post("/",
    verifyUserAuth(),
    requestBodyValidator(questionSchema),
    questionErrorHandler.verifyRepeatedData(),
    userGroupErrorHandler.exists(true, false),
    MainController.create
)

questionRouter.get("/:id",
    verifyUserAuth(),
    questionErrorHandler.exists(false),
    MainController.findById
)

questionRouter.delete("/:id",
    verifyUserAuth(),
    questionErrorHandler.exists(false),
    questionErrorHandler.verifyEntityDependencies(),
    MainController.deleteById
)

questionRouter.put("/:id",
    verifyUserAuth(),
    requestBodyValidator(questionSchema),
    questionErrorHandler.verifyRepeatedData(),
    questionErrorHandler.exists(false),
    userGroupErrorHandler.exists(true, false),
    MainController.update
)
