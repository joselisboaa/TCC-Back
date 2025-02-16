import Ajv from "ajv"
import addFormats from "ajv-formats"
import { HttpsError } from "../errors/httpError";

const ajv = new Ajv();
addFormats(ajv)

export const requestBodyValidator = function(schema) {
    const validate = ajv.compile(schema)
    return function(req, res, next) {
        const data = req.body

        console.log(req.body)
        
        const valid = validate(data)

        if (!valid) {
            if (validate.errors) {
                const resBody = validate.errors[0]
    
                let error = new HttpsError(resBody["message"] || "Ocorreu um erro na formatação")
                error.cause = resBody["instancePath"]
                error.statusCode = 400
     
                next(error)
            }
        }
        next()
    }
}