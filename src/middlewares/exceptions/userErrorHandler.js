"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEntityDependencies = exports.verifyRepeatedData = exports.exists = void 0;
const httpError_1 = require("../errors/httpError");
const userService_1 = require("../../services/userService");
const exists = function (isAttribute) {
    const userService = new userService_1.UserService();
    return async function (req, res, next) {
        const id = isAttribute === true ? Number(req.body["user_id"]) : Number(req.params["id"]);
        if (isNaN(id) === false) {
            const user = await userService.findById(id);
            if (user == null) {
                let error = new httpError_1.HttpsError("required user doesn't exists.");
                error.cause = "required user doesn't exists.";
                error.statusCode = 404;
                next(error);
            }
            res.locals.user = user;
        }
        next();
    };
};
exports.exists = exists;
const verifyRepeatedData = function () {
    return async function (req, res, next) {
        const userInstance = new userService_1.UserService();
        const userResponse = await userInstance.verifyUniqueProperties(req);
        const reqEmailExists = userResponse !== null && userResponse["email"] === req.body["email"];
        const reqPhoneExists = userResponse !== null && userResponse["phone_number"] === req.body["phone_number"];
        if (reqPhoneExists && !reqEmailExists) {
            const error = new httpError_1.HttpsError(`O telefone '${req.body["phone_number"]}' já foi cadastrado.`);
            error.statusCode = 400;
            next(error);
        }
        if (reqEmailExists && !reqPhoneExists) {
            const error = new httpError_1.HttpsError(`O email '${req.body["email"]}' já foi cadastrado.`);
            error.statusCode = 400;
            next(error);
        }
        if (reqEmailExists && reqPhoneExists) {
            const error = new httpError_1.HttpsError(`O email e telefone inseridos já foram cadastrados.`);
            error.statusCode = 400;
            next(error);
        }
        next();
    };
};
exports.verifyRepeatedData = verifyRepeatedData;
const verifyEntityDependencies = function () {
    return async function (req, res, next) {
        const userService = new userService_1.UserService();
        const userResponse = await userService.verifyEntityDependencies(req, res);
        const userHasSomeResponse = userResponse !== null && userResponse["responses"].length > 0;
        if (userHasSomeResponse) {
            const error = new httpError_1.HttpsError(`O usuário tem uma ou mais Respostas associadas.`);
            error.statusCode = 400;
            next(error);
        }
        next();
    };
};
exports.verifyEntityDependencies = verifyEntityDependencies;
