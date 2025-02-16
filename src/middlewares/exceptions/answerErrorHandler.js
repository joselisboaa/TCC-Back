"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEntityDependencies = exports.verifyRepeatedData = exports.exists = void 0;
const answerService_1 = require("../../services/answerService");
const httpError_1 = require("../errors/httpError");
const exists = function (isAttribute, isManyToMany) {
    return async function (req, res, next) {
        const bodyHashKey = isManyToMany === true ? req.body["answers"] : req.body["answer_id"];
        const answerIdentifier = isAttribute === true ? bodyHashKey : Number(req.params["id"]);
        const answerInstance = new answerService_1.AnswerService();
        if (isNaN(answerIdentifier) === false) {
            const answer = await answerInstance.findById(answerIdentifier);
            if (answer == null) {
                let error = new httpError_1.HttpsError(`required answer with id="${answerIdentifier}" doesn't exists.`);
                error.cause = `required answer with id="${answerIdentifier}" doesn't exists.`;
                error.statusCode = 404;
                next(error);
            }
            res.locals.answer = answer;
        }
        for (let i = 0; i < Object.keys(answerIdentifier).length; i++) {
            let answer = await answerInstance.findById(answerIdentifier[i]["id"]);
            if (answer == null) {
                let error = new httpError_1.HttpsError(`required answer "${answerIdentifier[i]["text"]}" doesn't exists.`);
                error.cause = `required answer "${answerIdentifier[i]["text"]}" doesn't exists.`;
                error.statusCode = 404;
                next(error);
            }
        }
        next();
    };
};
exports.exists = exists;
const verifyRepeatedData = function () {
    return async function (req, res, next) {
        const answerInstance = new answerService_1.AnswerService();
        const asnwerResponse = await answerInstance.verifyUniqueProperties(req);
        if (asnwerResponse !== null) {
            const error = new httpError_1.HttpsError(`A resposta '${req.body["text"]}' já existe.`);
            error.statusCode = 400;
            next(error);
        }
        next();
    };
};
exports.verifyRepeatedData = verifyRepeatedData;
const verifyEntityDependencies = function () {
    return async function (req, res, next) {
        const answerInstance = new answerService_1.AnswerService();
        const asnwerResponse = await answerInstance.verifyEntityDependencies(req, res);
        const answerHasOrientations = asnwerResponse !== null && asnwerResponse["orientations"].length > 0;
        if (answerHasOrientations) {
            const error = new httpError_1.HttpsError(`A resposta tem uma ou mais orientações associadas.`);
            error.statusCode = 400;
            next(error);
        }
        next();
    };
};
exports.verifyEntityDependencies = verifyEntityDependencies;
