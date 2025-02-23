import * as questionService from "../../services/questionService";
import { HttpsError } from "../errors/httpError";
import { QuestionService } from "../../services/questionService";

export const exists = function(isAttribute) {
    const questionService = new QuestionService();
    
    return async function (req, res, next) {
        const id = isAttribute === true? Number(req.body["question_id"]) : Number(req.params["id"])
        if (isNaN(id) === false) {
            const question = await questionService.findById(id)
            if (question == null) {
                let error = new HttpsError("required question doesn't exists.")
                error.cause = "required question doesn't exists."
                error.statusCode = 404
                next(error)
            }
            res.locals.question = question
        }

        next()
    }
}

export const verifyRepeatedData = function () {
    return async function (req, res, next) {
        const questionInstance = new QuestionService();
        
        let currentQuestion;

        if (req.method === 'PUT' && req.params.id) {
            const question_id = Number(req.params.id);
            currentQuestion = await questionInstance.findById(question_id);
        }

        const questionResponse = await questionInstance.verifyUniqueProperties(req);

        if (currentQuestion !== null && questionResponse !== null && (!currentQuestion || currentQuestion.text !== req.body.text)) {
            const error = new HttpsError(`A questão '${req.body["text"]}' já existe.`);
            error.statusCode = 400;
            next(error);
        }

        next();
    };
}

export const verifyEntityDependencies = function() {
    return async function (req, res, next) {
        const questionService = new QuestionService();
        const questionResponse = await questionService.verifyEntityDependencies(req, res);

        const questionHasAnswer = questionResponse !== null && questionResponse["answers"].length > 0;

        if (questionHasAnswer) {
            const error = new HttpsError(`A questão tem uma ou mais respostas associadas.`);
            error.statusCode = 400;
            next(error);
        }

        next()
    }
}