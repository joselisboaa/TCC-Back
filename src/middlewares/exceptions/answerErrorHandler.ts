import { AnswerService } from "../../services/answerService";
import { HttpsError } from "../errors/httpError";

export const exists = function(isAttribute, isManyToMany) {
    return async function (req, res, next) {
        const bodyHashKey = isManyToMany === true ? req.body["answers"] : req.body["answer_id"];
        const answerIdentifier = isAttribute === true ? bodyHashKey : Number(req.params["id"])
        const answerInstance = new AnswerService()

        if (isNaN(answerIdentifier) === false) {
            
            const answer = await answerInstance.findById(answerIdentifier)

            if (answer == null) {
                let error = new HttpsError(`required answer with id="${answerIdentifier}" doesn't exists.`)
                error.cause = `required answer with id="${answerIdentifier}" doesn't exists.`

                error.statusCode = 404
                next(error)
            }
            res.locals.answer = answer
        }

        for (let i = 0; i < Object.keys(answerIdentifier).length; i++) {
            let answer = await answerInstance.findById(answerIdentifier[i]["id"])
            if (answer == null) {
                let error = new HttpsError(`required answer "${answerIdentifier[i]["text"]}" doesn't exists.`)
                error.cause = `required answer "${answerIdentifier[i]["text"]}" doesn't exists.`
                error.statusCode = 404
                next(error)
            }
        }

        next()
    }
}

export const verifyRepeatedData = function () {
    return async function (req, res, next) {
        const answerInstance = new AnswerService();
        const asnwerResponse = await answerInstance.verifyUniqueProperties(req);

        if (asnwerResponse !== null) {
            const error = new HttpsError(`A resposta '${req.body["text"]}' já existe.`);
            error.statusCode = 400;
            next(error)
        }

        next()
    };
}

export const verifyEntityDependencies = function () {
    return async function (req, res, next) {
        const answerInstance = new AnswerService();
        const asnwerResponse = await answerInstance.verifyEntityDependencies(req, res);
        
        const answerHasOrientations = asnwerResponse !== null && asnwerResponse["orientations"].length > 0;

        if (answerHasOrientations) {
            const error = new HttpsError(`A resposta tem uma ou mais orientações associadas.`);
            error.statusCode = 400;
            next(error)
        }

        next()
    };
}
