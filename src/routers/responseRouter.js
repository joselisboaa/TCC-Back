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
exports.responseRouter = void 0;
const express_1 = require("express");
const requestBodyValidator_1 = require("../middlewares/json/requestBodyValidator");
const responseSchema_1 = require("../middlewares/json/schemas/responseSchema");
const responseErrorHandler = __importStar(require("../middlewares/exceptions/responseErrorHandler"));
const answerErrorHandler = __importStar(require("../middlewares/exceptions/answerErrorHandler"));
const userErrorHandler = __importStar(require("../middlewares/exceptions/userErrorHandler"));
const mainController_1 = require("../controllers/mainController");
const authError_1 = require("../middlewares/exceptions/authError");
exports.responseRouter = new express_1.Router();
exports.responseRouter.get("/", (0, authError_1.verifyUserAuth)(), mainController_1.MainController.findAll);
exports.responseRouter.post("/", (0, authError_1.verifyUserAuth)(), (0, requestBodyValidator_1.requestBodyValidator)(responseSchema_1.responseSchema), answerErrorHandler.exists(true, true), userErrorHandler.exists(true), mainController_1.MainController.create);
exports.responseRouter.get("/:id", (0, authError_1.verifyUserAuth)(), responseErrorHandler.exists(false), mainController_1.MainController.findById);
exports.responseRouter.delete("/:id", (0, authError_1.verifyUserAuth)(), responseErrorHandler.exists(false), mainController_1.MainController.deleteById);
exports.responseRouter.put("/:id", (0, authError_1.verifyUserAuth)(), (0, requestBodyValidator_1.requestBodyValidator)(responseSchema_1.responseSchema), responseErrorHandler.exists(false), answerErrorHandler.exists(true, true), userErrorHandler.exists(true), mainController_1.MainController.update);
exports.responseRouter.get("/:id/report", (0, authError_1.verifyUserAuth)(), responseErrorHandler.exists(false), mainController_1.MainController.sendReport);
