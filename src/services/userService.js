"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userRepository_1 = require("../repository/userRepository");
const questionService_1 = require("./questionService");
class UserService {
    repository = new userRepository_1.UserRepository();
    questionService = new questionService_1.QuestionService();
    async verifyEntityDependencies(req, res) {
        const userId = Number(req.params["id"]);
        return this.repository.verifyEntityDependencies(userId);
    }
    async verifyUniqueProperties(req) {
        const { email, phone_number } = req.body;
        return this.repository.verifyUniqueProperties(email, phone_number);
    }
    async findByEmail(email) {
        return this.repository.findByEmail(email);
    }
    async findAll(req) {
        return this.repository.findAll(req.query);
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(req, res) {
        const userId = res.locals.user["id"];
        return this.repository.update(userId, req.body);
    }
    async deleteById(data) {
        return this.repository.deleteById(data["id"]);
    }
    async getUserFormByUserId(groups) {
        const formQuestions = [];
        for (const group of groups) {
            const query = {
                where: { user_group_id: group.id },
                include: {
                    answers: {
                        include: {
                            answer: {
                                select: { id: true, text: true, other: true },
                            },
                        },
                    },
                },
            };
            const groupQuestions = await this.questionService.getExecuteQuery(query);
            const formattedQuestions = groupQuestions.map((question) => ({
                id: question.id,
                text: question.text,
                user_group_id: question.user_group_id,
                answers: question.answers.map((qoa) => ({
                    id: qoa.answer.id,
                    text: qoa.answer.text,
                    other: qoa.answer.other,
                })),
            }));
            formQuestions.push(...formattedQuestions);
        }
        return formQuestions;
    }
}
exports.UserService = UserService;
