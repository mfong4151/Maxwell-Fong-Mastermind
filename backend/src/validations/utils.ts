import { ValidationChain, param} from "express-validator";
import { capitalize } from "../utils";

export const generateIdValidation = (id: ValidationChain, plainName: string) => (
    id
        .isInt()
        .withMessage(`${capitalize(plainName)} must be an integer number`) 
        .custom((id: string | number) => Number(id) > 0)
        .withMessage(`${capitalize(plainName)} must be greater than 0`)
)

