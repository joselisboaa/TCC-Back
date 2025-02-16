import * as orientationService from "../services/orientationService"


export class OrientationController {
    static async findAll(req, res) {
        const queryParam = req.query

        let filter = {
            text: {
                startsWith: queryParam["text"]
            }
        }

        const answerId = queryParam["answer-id"]
        if (isNaN(answerId) === false) {
            filter["answer_id"] = Number(queryParam["answer-id"])
        }

        const query = {
            skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
            take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
            where: filter
        }
        res.send(await orientationService.findAll(query));

    }

    static async create(req, res, next) {
        try {
            const orientation = await orientationService.create(req.body)
            res.status(201).send(orientation)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            //serviceError.statusCode = 400
            next(serviceError)
        }
    }

    static findById(req, res) {
        res.send(res.locals.orientation);
    }

    static deleteById(req, res) {
        orientationService.deleteById(res.locals.orientation).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        const data = {
            "id": res.locals.orientation["id"],
            "text": req.body["text"],
            "value": req.body["value"],
            "answer_id": req.body["answer_id"]
        }
        try {
            const orientation = await orientationService.update(data)
            res.send(orientation)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            //serviceError.statusCode = 400
            next(serviceError)
        }
    }

}
