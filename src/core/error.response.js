'use strict'

const { ReasonPhrases } = require("../ultils/httpStatusCode")

const StatusCode={
    FORBITDDEN:403,
    CONFLICT:409
}
const ReasonStatusCode={
    FORBITDDEN:'bad request',
    CONFLICT:'conflix error'
}
class ErrorResponse extends Error{
    constructor(message,status){
        super(message)
        this.status=status
    }
}
class ConflictRequestError extends ErrorResponse{
    constructor(message=ReasonStatusCode.CONFLICT,statusCode=StatusCode.FORBITDDEN){
        super(message,statusCode)
    }
    
}
class BadRequestError extends ErrorResponse{
    constructor(message=ReasonStatusCode.CONFLICT,statusCode=StatusCode.FORBITDDEN){
        super(message,statusCode)
    }
    
}
class AuthFailureError extends ErrorResponse{
    constructor(message=ReasonPhrases.UNAUTHORIZED,statusCode=StatusCode.UNAUTHORIZED){
        super(message,statusCode)
    }
}
class NotFoundError extends ErrorResponse{
    constructor(message=ReasonPhrases.NOT_FOUND,statusCode=StatusCode.NOT_FOUND){
        super(message,statusCode)
    }
}
class ForbiddenError extends ErrorResponse{
    constructor(message=ReasonPhrases.FORBIDDEN,statusCode=StatusCode.FORBITDDEN){
        super(message,statusCode)
    }
}
module.exports={
    ConflictRequestError,
    AuthFailureError,
    NotFoundError,
    BadRequestError,
    ForbiddenError
}