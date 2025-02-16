"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const httpError_1 = require("../errors/httpError");
const responseService_1 = require("../../services/responseService");
const exists = function (isAttribute) {
    const responseService = new responseService_1.ResponseService();
    return async function (req, res, next) {
        const id = isAttribute === true ? Number(req.body["response_id"]) : Number(req.params["id"]);
        if (isNaN(id) === false) {
            const response = await responseService.findById(id);
            if (response == null) {
                let error = new httpError_1.HttpsError("required response doesn't exists.");
                error.cause = "required response doesn't exists.";
                error.statusCode = 404;
                next(error);
            }
            res.locals.responseReport = response;
        }
        next();
    };
};
exports.exists = exists;
