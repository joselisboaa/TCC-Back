import { HttpsError } from "../errors/httpError";
import { UserService } from "../../services/userService";

export const exists = function(isAttribute) {
    const userService = new UserService();
    
    return async function (req, res, next) {
        const id = isAttribute === true? Number(req.body["user_id"]) : Number(req.params["id"])
        if (isNaN(id) === false) {
            const user = await userService.findById(id)
            if (user == null) {
                let error = new HttpsError("required user doesn't exists.")
                error.cause = "required user doesn't exists."
                error.statusCode = 404
                next(error)
            }
            res.locals.user = user
        }

        next()
    }
}


export const verifyRepeatedData = function () {
    return async function (req, res, next) {
        const userInstance = new UserService();
        const userResponse = await userInstance.verifyUniqueProperties(req);
        const reqEmailExists = userResponse !== null && userResponse["email"] === req.body["email"];
        const reqPhoneExists = userResponse !== null && userResponse["phone_number"] === req.body["phone_number"];

        if (reqPhoneExists && !reqEmailExists) {
            const error = new HttpsError(`O telefone '${req.body["phone_number"]}' já foi cadastrado.`);
            error.statusCode = 400;
            next(error)
        }

        if (reqEmailExists && !reqPhoneExists) {
            const error = new HttpsError(`O email '${req.body["email"]}' já foi cadastrado.`);
            error.statusCode = 400;
            next(error)
        }

        if (reqEmailExists && reqPhoneExists) {
            const error = new HttpsError(`O email e telefone inseridos já foram cadastrados.`);
            error.statusCode = 400;
            next(error)
        }

        next()
    };
}

export const verifyEntityDependencies = function() {
    return async function (req, res, next) {
        const userService = new UserService();
        const userResponse = await userService.verifyEntityDependencies(req, res);

        const userHasSomeResponse = userResponse !== null && userResponse["responses"].length > 0;

        if (userHasSomeResponse) {
            const error = new HttpsError(`O usuário tem uma ou mais Respostas associadas.`);
            error.statusCode = 400;
            next(error);
        }

        next()
    }
}
