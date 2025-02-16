import * as userGroupService from "../services/userGroupService"


export class UserGroupController {
    static async findAll(req, res) {
        const queryParam = req.query

        let filter = {
            text: {
                startsWith: queryParam["text"]
            }
        }
        const query = {
            skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
            take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
            where: filter
        }
        res.send(await userGroupService.findAll(query));

    }
    static async create(req, res, next) {
        try {
            const userGroup = await userGroupService.create(req.body)
            res.status(201).send(userGroup)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }
    }

    static findById(req, res) {
        res.send(res.locals.userGroup);
    }

    static deleteById(req, res) {
        userGroupService.deleteById(res.locals.userGroup).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        const data = {
            "id": res.locals.userGroup["id"],
            "text": req.body["text"]
        }
        try {
            const userGroup = await userGroupService.update(data)
            res.send(userGroup)
        } catch(err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }
    }

}
