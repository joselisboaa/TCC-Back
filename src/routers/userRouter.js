"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const requestBodyValidator_1 = require("../middlewares/json/requestBodyValidator");
const userSchema = __importStar(require("../middlewares/json/schemas/userSchema"));
const userErrorHandler = __importStar(require("../middlewares/exceptions/userErrorHandler"));
const userGroupErrorHandler = __importStar(require("../middlewares/exceptions/userGroupErrorHandler"));
const mainController_1 = require("../controllers/mainController");
const authError_1 = require("../middlewares/exceptions/authError");
exports.userRouter = new express_1.Router();
exports.userRouter.get("/", (0, authError_1.verifyUserAuth)(), mainController_1.MainController.findAll);
exports.userRouter.post("/", (0, authError_1.verifyUserAuth)(), (0, requestBodyValidator_1.requestBodyValidator)(userSchema.post), userErrorHandler.verifyRepeatedData(), userGroupErrorHandler.exists(true, true), mainController_1.MainController.create);
exports.userRouter.get("/:id", (0, authError_1.verifyUserAuth)(), userErrorHandler.exists(false), mainController_1.MainController.findById);
exports.userRouter.delete("/:id", (0, authError_1.verifyUserAuth)(), userErrorHandler.exists(false), userErrorHandler.verifyEntityDependencies(), mainController_1.MainController.deleteById);
exports.userRouter.put("/:id", (0, authError_1.verifyUserAuth)(), (0, requestBodyValidator_1.requestBodyValidator)(userSchema.put), userErrorHandler.verifyRepeatedData(), userErrorHandler.exists(false), userGroupErrorHandler.exists(true, true), mainController_1.MainController.update);
exports.userRouter.get("/:id/form", (0, authError_1.verifyUserAuth)(), userErrorHandler.exists(false), mainController_1.MainController.getUserFormByUserId);
