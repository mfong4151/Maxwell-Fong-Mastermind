import { ValidationChain, param} from "express-validator";
import { generateIdValidation } from "./utils";

const paramGameValidation = generateIdValidation(param("gameId"), "game id")

export const gameHintGetValidations: ValidationChain[] =[
    paramGameValidation
];
