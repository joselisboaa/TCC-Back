export const errorHandler = function (err, req, res, next) {
   
    res.status(err.statusCode).send({"message": err.message, "cause": err.cause})
}