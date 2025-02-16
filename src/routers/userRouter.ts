import { Router } from "express";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import * as userSchema  from "../middlewares/json/schemas/userSchema";
import * as userErrorHandler from "../middlewares/exceptions/userErrorHandler";
import * as userGroupErrorHandler from "../middlewares/exceptions/userGroupErrorHandler";

import { MainController } from "../controllers/mainController";
import { verifyUserAuth } from "../middlewares/exceptions/authError";

export const userRouter = new Router();

userRouter.get("/",
    verifyUserAuth(),
    MainController.findAll
)

userRouter.post("/",
    verifyUserAuth(),
    requestBodyValidator(userSchema.post),
    userErrorHandler.verifyRepeatedData(),
    userGroupErrorHandler.exists(true, true),
    MainController.create
)

userRouter.get("/:id",
    verifyUserAuth(),
    userErrorHandler.exists(false),
    MainController.findById
)

userRouter.delete("/:id",
    verifyUserAuth(),
    userErrorHandler.exists(false),
    userErrorHandler.verifyEntityDependencies(),
    MainController.deleteById
)

userRouter.put("/:id",
    verifyUserAuth(),
    requestBodyValidator(userSchema.put),
    userErrorHandler.verifyRepeatedData(),
    userErrorHandler.exists(false),
    userGroupErrorHandler.exists(true, true),
    MainController.update
)

userRouter.get("/:id/form",
    verifyUserAuth(),
    userErrorHandler.exists(false),
    MainController.getUserFormByUserId
)