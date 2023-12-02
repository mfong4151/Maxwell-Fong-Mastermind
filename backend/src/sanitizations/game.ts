import { ValidationChain, body } from 'express-validator';

export const gamePatchSanitizations: ValidationChain[] = [
    body("guesses")
        .customSanitizer((arr: any[]) =>
                arr.map((num: string | number) => 
                String(num)
            ))
]