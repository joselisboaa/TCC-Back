import { UserGroupService } from "../../services/userGroupService";
import { HttpsError } from "../errors/httpError";

export const exists = function(isAttribute, isManyToMany) {
    const userGroupService = new UserGroupService();

    return async function (req, res, next) {
        const bodyHashKey = isManyToMany === true ? req.body["user_groups"] : req.body["user_group_id"];
        const groupIdentifier = isAttribute === true? bodyHashKey : Number(req.params["id"])

        if (isNaN(groupIdentifier) === false) {
            const userGroup = await userGroupService.findById(groupIdentifier)
            if (userGroup == null) {
                let error = new HttpsError(`required user group with id="${groupIdentifier}" doesn't exists.`)
                error.cause = `required user group with id="${groupIdentifier}" doesn't exists.`
                error.statusCode = 404
                next(error)
            }
            res.locals.userGroup = userGroup
        }

        for (let i = 0; i < Object.keys(groupIdentifier).length; i++) {
            let userGroup = await userGroupService
                .findById(groupIdentifier[i]["id"])
            if (userGroup == null) {
                let error = new HttpsError(`required user group "${groupIdentifier[i]["text"]}" doesn't exists.`)
                error.cause = `required user group "${groupIdentifier[i]["text"]}" doesn't exists.`
                error.statusCode = 404
                next(error)
            }
        }

        next()
    }
}

export const verifyEntityDependencies = function() {
    return async function (req, res, next) {
        const userGroupService = new UserGroupService();
        const userGroupResponse = await userGroupService.verifyEntityDependencies(req, res);

        const userGroupHasSomeUser = userGroupResponse !== null && 
                                    userGroupResponse["users"].length > 0 &&
                                    userGroupResponse["questions"].length === 0;
        const userGroupHasSomeQuestion = userGroupResponse !== null && 
                                        userGroupResponse["questions"].length > 0 &&
                                        userGroupResponse["users"].length === 0;
        const userGroupHasQuestionAndUser = userGroupResponse !== null &&
                                            userGroupResponse["users"].length > 0 && 
                                            userGroupResponse["questions"].length > 0;

        if (userGroupHasSomeUser) {
            const error = new HttpsError(`O Grupo de usuários tem um ou mais Usuários associados.`);
            error.statusCode = 400;
            next(error);
        }

        if (userGroupHasSomeQuestion) {
            const error = new HttpsError(`O Grupo de usuários tem uma ou mais Questões associadas.`);
            error.statusCode = 400;
            next(error);
        }

        if (userGroupHasQuestionAndUser) {
            const error = new HttpsError(`O Grupo de usuários tem um ou mais Usuários e Questões associados.`);
            error.statusCode = 400;
            next(error);
        }

        next()
    }
}