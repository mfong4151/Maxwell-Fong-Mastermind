import { ValidationChain, body, param} from "express-validator";
import { generateIdValidation } from "./utils";

const paramIdValidation = generateIdValidation(param('id'), "game id")

export const gameGetValidations: ValidationChain[] = [
    paramIdValidation    
]

export const gamePostValidations: ValidationChain[] = [
    body('num')
        .isInt()
        .custom((num: number) => Number(num) > 0)
        .withMessage("Your code size must be a number greater than 0!"),
]

export const gamePatchValidations: ValidationChain[] = [
   paramIdValidation,

]