"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrientationService = void 0;
const orientationRepository_1 = require("../repository/orientationRepository");
class OrientationService {
    repository = new orientationRepository_1.OrientationRepository();
    async findAll(req, res) {
        return this.repository.findAll(req.query);
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async findByAnswer(answerId) {
        return this.repository.findByAnswer(answerId);
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(req, res) {
        const data = {
            "id": res.locals.orientation["id"],
            "text": req.body["text"],
            "value": req.body["value"],
            "answer_id": req.body["answer_id"]
        };
        return this.repository.update(data);
    }
    async deleteById(data) {
        return this.repository.deleteById(data["id"]);
    }
}
exports.OrientationService = OrientationService;
