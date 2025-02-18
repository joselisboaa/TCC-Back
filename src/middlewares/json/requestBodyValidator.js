"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestBodyValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const httpError_1 = require("../errors/httpError");
const ajv = new ajv_1.default();
(0, ajv_formats_1.default)(ajv);
const requestBodyValidator = function (schema) {
    const validate = ajv.compile(schema);
    return function (req, res, next) {
        const data = req.body;
        const valid = validate(data);
        if (!valid) {
            if (validate.errors) {
                const resBody = validate.errors[0];
                let error = new httpError_1.HttpsError(resBody["message"] || "Ocorreu um erro na formatação");
                error.cause = resBody["instancePath"];
                error.statusCode = 400;
                next(error);
            }
        }
        next();
    };
};
exports.requestBodyValidator = requestBodyValidator;
