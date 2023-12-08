import { ValidationChain, param } from "express-validator";
import { generateIdValidation } from "./utils";

const gameIdNumeric: ValidationChain = generateIdValidation(param('gameId'), 'game id');
const playerIdNumeric: ValidationChain = generateIdValidation(param('playerId'), 'player id');

export const gamePlayerValidation: ValidationChain[] = [
    gameIdNumeric,
    playerIdNumeric
];