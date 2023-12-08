import { ValidationChain, body, param} from "express-validator";
import { generateIdValidation } from "./utils";

const paramIdValidation = generateIdValidation(param("id"), "game id")


//Game GET validations
export const gameGetValidations: ValidationChain[] = [
    paramIdValidation    
];

//Game POST validations
const gameNumValidation: ValidationChain = 
    body("num")
        .isInt()
        .custom((num: number) => Number(num) > 0)
        .withMessage("Your code size must be a number greater than 0!");

const gamePlayerIdsValidation: ValidationChain =  
    body("playerIds")
        .isArray()
        .custom( 
                  (arr: number[]) => 
                  arr.every((num: number) => 
                  typeof num === "number")
                )
        .withMessage("Player ids must be numbers!")
        .optional();

const gameNumGuessesValidation: ValidationChain = 
    body("numGuesses")
        .custom((numGuesses: number, {req}) => (numGuesses >= req.body.num))
        .withMessage("Guess attempts must be greater than or equal to the code length!");

const gameEndsAtValidation: ValidationChain =
    body("endsAt")
        .isInt()
        .custom(endsAt => endsAt > 0)
        .withMessage(`Key "endsAt" must be a number greater than 0!`)
        .optional();

export const gamePostValidations: ValidationChain[] = [
    gameNumValidation,
    gamePlayerIdsValidation,
    gameNumGuessesValidation,
    gameEndsAtValidation
];

