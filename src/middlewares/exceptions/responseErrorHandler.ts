import * as responseService from "../../services/responseService";
import { HttpsError } from "../errors/httpError";
import { ResponseService } from "../../services/responseService";


export const exists = function(isAttribute) {
    const responseService = new ResponseService();
    
    return async function (req, res, next) {
        const id = isAttribute === true? Number(req.body["response_id"]) : Number(req.params["id"])
        if (isNaN(id) === false) {
            const response = await responseService.findById(id)
            if (response == null) {
                let error = new HttpsError("required response doesn't exists.")
                error.cause = "required response doesn't exists."
                error.statusCode = 404
                next(error)
            }
            res.locals.responseReport = response
        }

        next()
    }
}