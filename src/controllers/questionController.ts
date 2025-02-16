import * as questService from "../services/questionService"


export class QuestionController {
    static async findAll(req, res) {
        const queryParam = req.query

        let filter = {
            text: {
                startsWith: queryParam["text"]
            }
        }

        const userGroupId = queryParam["user-group-id"]
        if (isNaN(userGroupId) === false) {
            filter["user_group_id"] = Number(queryParam["user-group-id"])
        }

        const query = {
            skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
            take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
            where: filter
        }
        res.send(await questService.findAll(query));

    }

    static async create(req, res, next) {
        try {
            const question = await questService.create(req.body)
            res.status(201).send(question)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            //serviceError.statusCode = 400
            next(serviceError)
        }
    }

    static findById(req, res) {
        res.send(res.locals.question);
    }

    static deleteById(req, res) {
        questService.deleteById(res.locals.question).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        const data = {
            "id": res.locals.question["id"],
            "text": req.body["text"],
            "user_group_id": req.body["user_group_id"]
        }
        try {
            const question = await questService.update(data)
            res.send(question)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            //serviceError.statusCode = 400
            next(serviceError)
        }
    }

}
