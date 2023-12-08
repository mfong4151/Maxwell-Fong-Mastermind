import { ValidationChain, body } from "express-validator";

const stringifyGuesses: ValidationChain = body("guesses")
    .customSanitizer((arr: any[]) =>
        arr.map((num: string | number) => 
        String(num)
    ));

export const gameGuessPostSanitzations: ValidationChain[] = [
    stringifyGuesses   
];