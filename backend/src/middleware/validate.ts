import { NextFunction, Request, Response } from "express";
import { Result, validationResult, ValidationError} from "express-validator";


export const validate = (req: Request, res: Response, next: NextFunction): Response | void => {

    const errors: Result<ValidationError> = validationResult(req)

    if (errors.isEmpty()){
        return next()
    }

    const errorMsgs: string[] = errors.array().map((err: ValidationError) => err.msg)

    return res.status(422).json({errors: errorMsgs})
}