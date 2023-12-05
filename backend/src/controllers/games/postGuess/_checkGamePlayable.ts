import { Game } from "@prisma/client";

//Called at the top level of the postGame route to make sure the game is playable, i.e. if it has not been won.
export const _checkGamePlayable = (gameConfig: Partial<Game> | any, incomingGuesses: string[]): string[] =>{
    const errors: string [] = []
    
    const {numGuesses, secretCode, guesses} = gameConfig;

    if (guesses.length && guesses.at(-1).isGameWon){
        errors.push('This game has already been won!')

    } else if (guesses.length >= numGuesses!) {
        errors.push('This game is already over and you have lost!')
    
    } else if (secretCode!.length !== incomingGuesses.length){
        errors.push(`The code entered is not as long as the original code (${secretCode.length} characters long)!`)

    }

    return errors;
}