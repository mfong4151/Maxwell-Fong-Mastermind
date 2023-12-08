import {body, param, ValidationChain} from "express-validator";
import { generateIdValidation } from "./utils";

//Guess POST validatons
//In the case that any guess is given as a number, we handle it in santizations
const supportedTypes: string[] =  ["string", "number"];
const paramGameIdValidation = generateIdValidation(param("gameId"), " game id");
const playerIdValidation = generateIdValidation(body("playerId").optional(), "player id");
const guessesValidation = body("guesses")
                            .isLength({min: 0})
                            .withMessage("Guesses cannot be empty!")
                            .custom((arr: any[])=>arr.every((num: any) => supportedTypes.includes(typeof num)))
                            .withMessage(
                                 `You have entered a data type that we cannot support, we currently only support the\
                                  following types: ${supportedTypes.join(", ")}`
                            );

export const gameGuessPostValidations: ValidationChain[] = [
    paramGameIdValidation, 
    playerIdValidation,
    guessesValidation
    
];

//Game GET validations

const paramGameValidation = generateIdValidation(param("gameId"), "game id")
export const gameGuessGetValidations: ValidationChain[] = [
    paramGameValidation
];
