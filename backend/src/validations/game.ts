import { ValidationChain, body, param} from 'express-validator';
import { generateIdValidation } from './utils';

const paramIdValidation = generateIdValidation(param('id'), 'game id')

//Game GET validations
export const gameGuessGetValidations: ValidationChain[] = [
    generateIdValidation(param('gameId'), 'game id') 

];

export const gameGetValidations: ValidationChain[] = [
    paramIdValidation    
];

//Game post validations
const gameNumValidation: ValidationChain = 
    body('num')
        .isInt()
        .custom((num: number) => Number(num) > 0)
        .withMessage('Your code size must be a number greater than 0!')

const gamePlayerIdsValidation: ValidationChain =  
    body('playerIds')
        .isArray()
        .custom( 
                  (arr: number[]) => 
                  arr.every((num: number) => 
                  typeof num === 'number')
                )
        .withMessage('Player ids must be numbers!')
        .optional()

const gameNumGuessesValidation: ValidationChain = 
    body('numGuesses')
        .custom((numGuesses: number, {req}) => (numGuesses >= req.body.num))
        .withMessage('Guess attempts must be greater than or equal to the code length!')

export const gamePostValidations: ValidationChain[] = [
    gameNumValidation,
    gamePlayerIdsValidation,
    gameNumGuessesValidation,
        
];

//Guess POST validatons
//In the case that any guess is given as a number, we handle it in santizations
const supportedTypes: string[] =  ['string', 'number'];
const paramGameIdValidation = generateIdValidation(param('gameId'), ' game id');
const playerIdValidation = generateIdValidation(body('playerId').optional(), 'player id');

export const gameGuessPostValidations: ValidationChain[] = [
    paramGameIdValidation, 
    playerIdValidation,
    body('guesses')
        .isLength({min: 1})
        .withMessage('Guesses cannot be empty!')
        .custom((arr: any[])=>arr.every((num: any) => supportedTypes.includes(typeof num)))
        .withMessage(
            `You have entered a data type that we cannot support, we currently only support the following types: ${supportedTypes.join(', ')}`
        ),
    
    
];