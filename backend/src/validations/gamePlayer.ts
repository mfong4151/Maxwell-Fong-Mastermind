import { ValidationChain, body, param } from "express-validator";
import { generateIdValidation } from "./utils";

const gameIdNumeric: ValidationChain = generateIdValidation(param('gameId'), 'game id');
const playerIdNumeric: ValidationChain = generateIdValidation(body('playerId'), 'player id');

export const gamePlayerPostValidations: ValidationChain[] = [
    gameIdNumeric,
    playerIdNumeric
];