import { AnswerService } from "../services/answerService"

const answerService = new AnswerService();

export class AnswerController {
    static async findAll(req, res) {
        res.send(await answerService.findAll(req, res));
    }

    static async create(req, res, next) {
        try {
            const answer = await answerService.create(req.body)
            res.status(201).send(answer)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            //serviceError.statusCode = 400
            next(serviceError)
        }
    }
    
    static findById(req, res) {
        res.send(res.locals.answer);
    }

    static deleteById(req, res) {
        answerService.deleteById(res.locals.answer).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        const data = {
            "id": res.locals.answer["id"],
            "text": req.body["text"],
            "other": req.body["other"],
            "question_id": req.body["question_id"]
        }
        
        try {
            const answer = await answerService.update(data)
            res.send(answer)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            //serviceError.statusCode = 400
            next(serviceError)
        }
    }

}
