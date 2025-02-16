"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
class DataManager {
    strategyService;
    setStrategyService(strategyService) {
        this.strategyService = strategyService;
    }
    async findAll(req, res) {
        return this.strategyService.findAll(req, res);
    }
    async findById(id) {
        return this.strategyService.findById(id);
    }
    async create(data) {
        return this.strategyService.create(data);
    }
    async update(req, res) {
        return this.strategyService.update(req, res);
    }
    async deleteById(data) {
        return this.strategyService.deleteById(data);
    }
    async getUserFormByUserId(groups) {
        return this.strategyService.getUserFormByUserId(groups);
    }
    async sendReport(responseReport) {
        return this.strategyService.sendReport(responseReport);
    }
}
exports.DataManager = DataManager;
