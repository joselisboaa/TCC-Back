import { AnswerService, OrientationService, 
    ResponseService, UserService } from "../services"
import { QuestionService } from "../services/questionService";
import { DataManager } from "../strategy/dataManager";
import { HttpsError } from "../middlewares/errors/httpError";
import { UserGroupService } from "../services/userGroupService";

import { config } from "../../config";
import { Prisma } from "@prisma/client";

const dataManager = new DataManager();

const exceptionTreatment = (error) => {
    const fields: string[] = []

    console.log(error)

    if (Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return `O(s) campo(s) teste deve ser único`
        }
    }
}

const pathResolution = (baseUrl: string) => {
    switch (baseUrl) {
        case "/user-groups":
            dataManager.setStrategyService(new UserGroupService());    
            break;
        case "/users":
            dataManager.setStrategyService(new UserService());    
            break;
        case "/questions":
            dataManager.setStrategyService(new QuestionService())
            break;
        case "/answers":
            dataManager.setStrategyService(new AnswerService());    
            break;
        case "/orientations":
            dataManager.setStrategyService(new OrientationService());    
            break;
        case "/responses":
            dataManager.setStrategyService(new ResponseService());    
            break;
    }
}

export class MainController {

    static async findAll(req, res) {
        pathResolution(req.baseUrl);

        res.send(await dataManager.findAll(req, res));
    }

    static async create(req, res, next) {
        pathResolution(req.baseUrl);

        try {
            const queryResponse = await dataManager.create(req.body)
            res.status(201).send(queryResponse)
        } catch(err) {
            let createError = new HttpsError(err.message);
            createError.cause = err.meta
            createError.statusCode = 400
            next(createError)
        }
    }

    static async findById(req, res) {
        pathResolution(req.baseUrl);

        res.send(await dataManager.findById(Number(req.params.id)));
    }

    static deleteById(req, res) {
        pathResolution(req.baseUrl);

        const data = {
            id: Number(req.params.id)
        }

        dataManager.deleteById(data).then(res.sendStatus(204))
    }

    static async update(req, res, next) {
        pathResolution(req.baseUrl);
        
        try {
            const answer = await dataManager.update(req, res)
            res.send(answer)
        } catch(err) {
            let updateError = new HttpsError(err.message);
            updateError.cause = err.meta
            updateError.statusCode = 400
            next(updateError)
        }
    }

    static async getUserFormByUserId(req, res, next) {
        pathResolution(req.baseUrl)
        
        const user_groups = res.locals.user["user_groups"]

        try {
            const groupQuestions = await dataManager.getUserFormByUserId(user_groups);
        
            res.send(groupQuestions);
        } catch (err) {
            let userFormError = new HttpsError(err.message);
            userFormError.cause = err.meta;
            userFormError.statusCode = 400;
            next(userFormError);
        }
    }

    static async sendReport(req, res, next) {
        pathResolution(req.baseUrl)
        
        const responseReport = res.locals.responseReport
        
        try {
            const jsonData = await dataManager.sendReport(responseReport);

            res.render('index', { jsonData: jsonData, config: config })
        } catch (err) {
            let reportError = new HttpsError(err.message);
            reportError.cause = err.meta;
            reportError.statusCode = 400;
            next(reportError);
        }
    }
}