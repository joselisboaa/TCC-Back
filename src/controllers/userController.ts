import * as userService from "../services/userService"
import * as questionService from "../services/questionService"

export class UserController {
    static async findAll(req, res) {
        const queryParam = req.query

        let filter = {
            phone_number: {
                startsWith: queryParam["phone-number"]
            },
            email: {
                startsWith: queryParam["email"]
            }
        }

        const userGroupId = queryParam["user-group-id"]
        if (isNaN(userGroupId) === false) {
            filter["user_group_id"] = Number(queryParam["user-group-id"])
        }

        const query = {
            skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
            take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
            where: filter,
            include: {
                user_groups: true
            }
        }

        res.send(await userService.findAll(query));

    }
    static async create(req, res, next) {
        try {
            const user = await userService.create(req.body)
            res.status(201).send(user);
        } catch (err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }
    }

    static findById(req, res) {
        res.send(res.locals.user);
    }

    static deleteById(req, res) {
        userService.deleteById(res.locals.user).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        const data = {
            "id": res.locals.user["id"],
            "phone_number": req.body["phone_number"],
            "user_groups": req.body["user_groups"],
            "email": req.body["email"],
            "password": req.body["password"]
        }
        try {
            const user = await userService.update(data)
            res.send(user)
        } catch (err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }
    }

    static async getUserFormByUserId(req, res, next){
        try {
            const groups = res.locals.user["user_groups"]
            let formQuestions: any[] = []
            for (let group in groups) {
                let query = {
                    where: {
                        "user_group_id": groups[group]["id"]
                    },
                    include: {
                        answers: true
                    }
                }
                /* Para agrupar as questões por grupo de usuário:
                *
                * let data = {}
                * data[`${groups[group]["text"]}`] = await questService.findAll(query)
                * formQuestions.push(data)
                *
                *  Para adicionar as questões diretamente:
                * */
                let groupQuestions = await questionService.findAll(query);
                for (let question in groupQuestions) {
                    formQuestions.push(groupQuestions[question])
                }
            }
            res.send(formQuestions)
        } catch (err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }
    }
}