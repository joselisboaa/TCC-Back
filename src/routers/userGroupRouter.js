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
exports.userGroupRouter = void 0;
const express_1 = require("express");
const requestBodyValidator_1 = require("../middlewares/json/requestBodyValidator");
const userGroupSchema_1 = require("../middlewares/json/schemas/userGroupSchema");
const userGroupErrorHandler = __importStar(require("../middlewares/exceptions/userGroupErrorHandler"));
exports.userGroupRouter = new express_1.Router();
const mainController_1 = require("../controllers/mainController");
exports.userGroupRouter.get("/", mainController_1.MainController.findAll);
exports.userGroupRouter.post("/", (0, requestBodyValidator_1.requestBodyValidator)(userGroupSchema_1.userGroupSchema), mainController_1.MainController.create);
exports.userGroupRouter.get("/:id", userGroupErrorHandler.exists(false, false), mainController_1.MainController.findById);
exports.userGroupRouter.delete("/:id", userGroupErrorHandler.exists(false, false), userGroupErrorHandler.verifyEntityDependencies(), mainController_1.MainController.deleteById);
exports.userGroupRouter.put("/:id", (0, requestBodyValidator_1.requestBodyValidator)(userGroupSchema_1.userGroupSchema), userGroupErrorHandler.exists(false, false), mainController_1.MainController.update);
