import * as responseService from "../services/responseService"
import * as orientationService from "../services/orientationService"
import { AnswerService } from "../services/answerService"
import * as questionService from "../services/questionService"
import * as userGroupService from "../services/userGroupService"
import { config } from "../../config"

// objeto de response está sendo chamado de responeReport devido ao express usar o nome response
const answerService = new AnswerService();
export class ResponseController {

    static async findAll(req, res) {
        const queryParam = req.query

        let filter = {}

        const orientationId = queryParam["orientation-id"]
        if (isNaN(orientationId) === false) {
            filter["orientation_id"] = Number(queryParam["orientation-id"])
        }

        const userId = queryParam["user-id"]
        if (isNaN(userId) === false) {
            filter["user_id"] = Number(queryParam["user-id"])
        }

        const query = {
            skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
            take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
            where: filter,
            include: {
                orientations: true
            }
        }

        res.send(await responseService.findAll(query));

    }
    static async create(req, res, next) {
        try {
            const answers = req.body["answers"]
            let orientations: any[] = []
            for (let i = 0; i < answers.length; i++) {
                if (answers[i]["other"] === true) {
                    let currentAnswer = req.body["other_answers"][`content_${answers[i]["id"]}`]
                    let newOrientation =
                        await orientationService.create({
                        "text": currentAnswer["text"],
                        "value": 0,
                        "answer_id": answers[i]["id"]
                    })
                    orientations.push({"id": newOrientation["id"]})
                }
                if(answers[i]["other"] === false) {
                    let orientation = await orientationService.findByAnswer(answers[i]["id"])
                    if (orientation) {
                        orientations.push({"id": orientation["id"]})
                    }
                }
            }
            const data = {
                "user_id": req.body["user_id"],
                "orientations": orientations
            }
            const responseReport = await responseService.create(data)
            res.status(201).send(responseReport);
        } catch (err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }
    }

    static async findById(req, res) {
        const responseReport = res.locals.responseReport
        res.send(responseReport);
    }

    static deleteById(req, res) {
        responseService.deleteById(res.locals.responseReport).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        const answers = req.body["answers"]
        let orientations: any = []
        for (let i = 0; i < answers.length; i++) {
            if (answers[i]["other"] === true) {
                let currentAnswer = req.body["other_answers"][`content_${answers[i]["id"]}`]
                let otherOrientation =
                    await orientationService.findByAnswer(answers[i]["id"])
                // Verificar se o texto na "Outra resposta" foi modificado, para criar ou não uma nova orientação
                if (otherOrientation && currentAnswer["text"] !== otherOrientation["text"]) {
                    let newOrientation =
                        await orientationService.create({
                            "text": currentAnswer["text"],
                            "value": 0,
                            "answer_id": answers[i]["id"]
                        })
                    orientations.push({"id": newOrientation["id"]})
                    await orientationService.deleteById({"id": Number(otherOrientation["id"])})
                }
                if (otherOrientation && currentAnswer["text"] === otherOrientation["text"]) {
                    orientations.push({"id": otherOrientation["id"]})
                }
            }
            if(answers[i]["other"] === false) {
                let orientation = await orientationService.findByAnswer(answers[i]["id"])
                if(orientation) {
                    orientations.push({"id": orientation["id"]})
                }
            }
        }
        const data = {
            "id": res.locals.responseReport["id"],
            "user_id": req.body["user_id"],
            "orientations": orientations
        }

        try {
            const responseReport = await responseService.update(data)
            res.send(responseReport)
        } catch (err) {
            let serviceError = new Error(err.message);
            serviceError.cause = err.meta
            ////serviceError.statusCode = 400
            next(serviceError)
        }

    }
    static async sendReport(req, res) {

        const responseReport = res.locals.responseReport
        let jsonData = {
            id: responseReport["id"],
            timestamp: responseReport["timestamp"],
            orientations:{}
        }
        for (let i = 0; i < responseReport.orientations.length; i++) {
            let currentAnswer =
                await answerService.findById(responseReport.orientations[i].answer_id)
            let currentQuestion;
            if (currentAnswer) {
                currentQuestion = await questionService.findById(currentAnswer["question_id"])
            }
            let currentGroup: any =
                await userGroupService.findById(currentQuestion["user_group_id"])

            if (!(currentGroup["text"] in jsonData.orientations)) {
                jsonData.orientations[`${currentGroup["text"]}`] = {
                    "questions":[],
                    "value": 0,
                }
            }
            if (currentAnswer) {
                jsonData.orientations[`${currentGroup["text"]}`]["questions"].push({
                    "text": currentQuestion["text"],
                    "answer": currentAnswer["text"],
                    "orientation": responseReport.orientations[i].text
                })
            }
            jsonData.orientations[`${currentGroup["text"]}`]["value"] += responseReport.orientations[i]["value"]
        }

        res.render('index', { jsonData: jsonData, config: config })
    }


}