"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseService = void 0;
const responseRepository_1 = require("../repository/responseRepository");
const _1 = require(".");
const userGroupService_1 = require("./userGroupService");
const orientationService_1 = require("./orientationService");
const questionService = new _1.QuestionService();
const answerService = new _1.AnswerService();
const groupService = new userGroupService_1.UserGroupService();
const orientationService = new orientationService_1.OrientationService();
class ResponseService {
    repository = new responseRepository_1.ResponseRepository();
    async findAll(req, res) {
        return this.repository.findAll(req.query);
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async create(reqData) {
        const answers = reqData["answers"];
        let orientations = [];
        for (let i = 0; i < answers.length; i++) {
            if (answers[i]["other"] === true) {
                let currentAnswer = reqData["other_answers"][`content_${answers[i]["id"]}`];
                let newOrientation = await orientationService.create({
                    text: currentAnswer["text"],
                    value: 0,
                    answer_id: answers[i]["id"],
                });
                orientations.push({ id: newOrientation["id"] });
            }
            else {
                let orientation = await orientationService.findByAnswer(answers[i]["id"]);
                if (orientation) {
                    orientations.push({ id: orientation["id"] });
                }
            }
        }
        return this.repository.create({
            user_id: reqData["user_id"],
            orientations,
        });
    }
    async update(req, res) {
        const answers = req.body["answers"];
        let orientations = [];
        for (let i = 0; i < answers.length; i++) {
            if (answers[i]["other"] === true) {
                let currentAnswer = req.body["other_answers"][`content_${answers[i]["id"]}`];
                let otherOrientation = await orientationService.findByAnswer(answers[i]["id"]);
                if (otherOrientation && currentAnswer["text"] !== otherOrientation["text"]) {
                    let newOrientation = await orientationService.create({
                        text: currentAnswer["text"],
                        value: 0,
                        answer_id: answers[i]["id"],
                    });
                    orientations.push({ id: newOrientation["id"] });
                    await orientationService.deleteById({ id: Number(otherOrientation["id"]) });
                }
                else if (otherOrientation) {
                    orientations.push({ id: otherOrientation["id"] });
                }
            }
            else {
                let orientation = await orientationService.findByAnswer(answers[i]["id"]);
                if (orientation) {
                    orientations.push({ id: orientation["id"] });
                }
            }
        }
        return this.repository.update({
            id: res.locals.responseReport["id"],
            user_id: req.body["user_id"],
            orientations,
        });
    }
    async deleteById(data) {
        return this.repository.deleteById(data["id"]);
    }
    async sendReport(responseReport) {
        let jsonData = {
            id: responseReport["id"],
            timestamp: responseReport["timestamp"],
            orientations: {},
        };
        for (let i = 0; i < responseReport.orientations.length; i++) {
            let currentAnswer = await answerService.findById(responseReport.orientations[i].answer_id);
            let currentQuestion;
            if (currentAnswer) {
                currentQuestion = await questionService.findById(currentAnswer["question_id"]);
            }
            let currentGroup = await groupService.findById(currentQuestion["user_group_id"]);
            if (!(currentGroup && currentGroup["text"] in jsonData.orientations)) {
                jsonData.orientations[currentGroup["text"]] = {
                    questions: [],
                    value: 0,
                };
            }
            if (currentAnswer) {
                jsonData.orientations[currentGroup["text"]]["questions"].push({
                    text: currentQuestion["text"],
                    answer: currentAnswer["text"],
                    orientation: responseReport.orientations[i].text,
                });
            }
            jsonData.orientations[currentGroup["text"]]["value"] += responseReport.orientations[i]["value"];
        }
        return jsonData;
    }
}
exports.ResponseService = ResponseService;
