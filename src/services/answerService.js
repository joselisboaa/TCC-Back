"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerService = void 0;
const answersRepository_1 = require("../repository/answersRepository");
class AnswerService {
    repository = new answersRepository_1.AnswerRepository();
    async findById(id) {
        return this.repository.findById(id);
    }
    async findAll(req, res) {
        const answers = await this.repository.findAll(req.query);
        return answers.map(answer => ({
            id: answer.id,
            text: answer.text,
            other: answer.other,
            question: answer.question,
            orientations: answer.orientations
        }));
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(req, res) {
        const data = {
            id: res.locals.answer["id"],
            text: req.body["text"],
            other: req.body["other"],
            question_id: req.body["question_id"]
        };
        return this.repository.update(data);
    }
    async deleteById(data) {
        return this.repository.deleteById(data["id"]);
    }
    async verifyEntityDependencies(req, res) {
        return this.repository.verifyEntityDependencies(Number(req.params["id"]));
    }
    async verifyUniqueProperties(req) {
        return this.repository.verifyUniqueProperties(req.body["text"]);
    }
}
exports.AnswerService = AnswerService;
