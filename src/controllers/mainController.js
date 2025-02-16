"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const services_1 = require("../services");
const questionService_1 = require("../services/questionService");
const dataManager_1 = require("../strategy/dataManager");
const httpError_1 = require("../middlewares/errors/httpError");
const userGroupService_1 = require("../services/userGroupService");
const config_1 = require("../../config");
const client_1 = require("@prisma/client");
const dataManager = new dataManager_1.DataManager();
const exceptionTreatment = (error) => {
    const fields = [];
    console.log(error);
    if (client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return `O(s) campo(s) teste deve ser único`;
        }
    }
};
const pathResolution = (baseUrl) => {
    switch (baseUrl) {
        case "/user-groups":
            dataManager.setStrategyService(new userGroupService_1.UserGroupService());
            break;
        case "/users":
            dataManager.setStrategyService(new services_1.UserService());
            break;
        case "/questions":
            dataManager.setStrategyService(new questionService_1.QuestionService());
            break;
        case "/answers":
            dataManager.setStrategyService(new services_1.AnswerService());
            break;
        case "/orientations":
            dataManager.setStrategyService(new services_1.OrientationService());
            break;
        case "/responses":
            dataManager.setStrategyService(new services_1.ResponseService());
            break;
    }
};
class MainController {
    static async findAll(req, res) {
        pathResolution(req.baseUrl);
        res.send(await dataManager.findAll(req, res));
    }
    static async create(req, res, next) {
        pathResolution(req.baseUrl);
        try {
            const queryResponse = await dataManager.create(req.body);
            res.status(201).send(queryResponse);
        }
        catch (err) {
            let createError = new httpError_1.HttpsError(err.message);
            createError.cause = err.meta;
            createError.statusCode = 400;
            next(createError);
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
        };
        dataManager.deleteById(data).then(res.sendStatus(204));
    }
    static async update(req, res, next) {
        pathResolution(req.baseUrl);
        try {
            const answer = await dataManager.update(req, res);
            res.send(answer);
        }
        catch (err) {
            let updateError = new httpError_1.HttpsError(err.message);
            updateError.cause = err.meta;
            updateError.statusCode = 400;
            next(updateError);
        }
    }
    static async getUserFormByUserId(req, res, next) {
        pathResolution(req.baseUrl);
        const user_groups = res.locals.user["user_groups"];
        try {
            const groupQuestions = await dataManager.getUserFormByUserId(user_groups);
            res.send(groupQuestions);
        }
        catch (err) {
            let userFormError = new httpError_1.HttpsError(err.message);
            userFormError.cause = err.meta;
            userFormError.statusCode = 400;
            next(userFormError);
        }
    }
    static async sendReport(req, res, next) {
        pathResolution(req.baseUrl);
        const responseReport = res.locals.responseReport;
        try {
            const jsonData = await dataManager.sendReport(responseReport);
            res.render('index', { jsonData: jsonData, config: config_1.config });
        }
        catch (err) {
            let reportError = new httpError_1.HttpsError(err.message);
            reportError.cause = err.meta;
            reportError.statusCode = 400;
            next(reportError);
        }
    }
}
exports.MainController = MainController;
