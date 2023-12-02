import { ValidationChain, param} from "express-validator";


export const generateIdValidation = (id: ValidationChain, plainName: string) => (
    id
        .isInt()
        .withMessage("Id must be an integer number") 
        .custom((id: string | number) => Number(id) > 0)
        .withMessage("Id must be greater than 0")
)

