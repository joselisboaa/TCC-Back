"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEntityDependencies = exports.verifyRepeatedData = exports.exists = void 0;
const httpError_1 = require("../errors/httpError");
const questionService_1 = require("../../services/questionService");
const exists = function (isAttribute) {
    const questionService = new questionService_1.QuestionService();
    return async function (req, res, next) {
        const id = isAttribute === true ? Number(req.body["question_id"]) : Number(req.params["id"]);
        if (isNaN(id) === false) {
            const question = await questionService.findById(id);
            if (question == null) {
                let error = new httpError_1.HttpsError("required question doesn't exists.");
                error.cause = "required question doesn't exists.";
                error.statusCode = 404;
                next(error);
            }
            res.locals.question = question;
        }
        next();
    };
};
exports.exists = exists;
const verifyRepeatedData = function () {
    return async function (req, res, next) {
        const questionInstance = new questionService_1.QuestionService();
        const questionResponse = await questionInstance.verifyUniqueProperties(req);
        if (questionResponse !== null) {
            const error = new httpError_1.HttpsError(`A questão '${req.body["text"]}' já existe.`);
            error.statusCode = 400;
            next(error);
        }
        next();
    };
};
exports.verifyRepeatedData = verifyRepeatedData;
const verifyEntityDependencies = function () {
    return async function (req, res, next) {
        const questionService = new questionService_1.QuestionService();
        const questionResponse = await questionService.verifyEntityDependencies(req, res);
        const questionHasAnswer = questionResponse !== null && questionResponse["answers"].length > 0;
        if (questionHasAnswer) {
            const error = new httpError_1.HttpsError(`A questão tem uma ou mais respostas associadas.`);
            error.statusCode = 400;
            next(error);
        }
        next();
    };
};
exports.verifyEntityDependencies = verifyEntityDependencies;
