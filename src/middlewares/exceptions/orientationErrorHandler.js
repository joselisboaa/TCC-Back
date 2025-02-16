"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const httpError_1 = require("../errors/httpError");
const orientationService_1 = require("../../services/orientationService");
const exists = function (isAttribute, isManyToMany) {
    const orientationService = new orientationService_1.OrientationService();
    return async function (req, res, next) {
        const bodyHashKey = isManyToMany === true ? req.body["orientations"] : req.body["orientation_id"];
        const orientationIdentifier = isAttribute === true ? bodyHashKey : Number(req.params["id"]);
        if (isNaN(orientationIdentifier) === false) {
            const orientation = await orientationService.findById(orientationIdentifier);
            if (orientation == null) {
                let error = new httpError_1.HttpsError(`required orientation with id="${orientationIdentifier}" doesn't exists.`);
                error.cause = `required orientation with id="${orientationIdentifier}" doesn't exists.`;
                error.statusCode = 404;
                next(error);
            }
            res.locals.orientation = orientation;
        }
        for (let i = 0; i < Object.keys(orientationIdentifier).length; i++) {
            let orientation = await orientationService
                .findById(orientationIdentifier[i]["id"]);
            if (orientation == null) {
                let error = new httpError_1.HttpsError(`required orientation "${orientationIdentifier[i]["text"]}" doesn't exists.`);
                error.cause = `required orientation "${orientationIdentifier[i]["text"]}" doesn't exists.`;
                error.statusCode = 404;
                next(error);
            }
        }
        next();
    };
};
exports.exists = exists;
