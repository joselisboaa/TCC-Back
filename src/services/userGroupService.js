"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGroupService = void 0;
const userGroupRepository_1 = require("../repository/userGroupRepository");
class UserGroupService {
    repository = new userGroupRepository_1.UserGroupRepository();
    async verifyEntityDependencies(req, res) {
        const userId = Number(req.params["id"]);
        return this.repository.verifyEntityDependencies(userId);
    }
    async findAll(req, res) {
        return this.repository.findAll(req.query);
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(req, res) {
        const id = res.locals.userGroup["id"];
        const text = req.body["text"];
        return this.repository.update(id, text);
    }
    async deleteById(data) {
        return this.repository.deleteById(data["id"]);
    }
}
exports.UserGroupService = UserGroupService;
