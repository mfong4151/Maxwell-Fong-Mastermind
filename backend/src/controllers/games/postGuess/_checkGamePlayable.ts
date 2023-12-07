import { Game, GameGuess } from "@prisma/client";
import { GameConfig } from "../../../types";

//Called at the top level of the postGame route to make sure the game is playable, i.e. if it has not been won.
export const _checkGamePlayable = (gameConfig: GameConfig, pastGuesses: any[], incomingGuesses: string[]): string[] =>{
    const errors: string [] = []
    
    const { secretCode, numGuesses, endsAt} = gameConfig;

    const isOver = endsAt ? new Date() >= new Date(endsAt) : false;

    if (pastGuesses.length && pastGuesses.at(-1)!.isGameWon){
        errors.push('This game has already been won!')

    } else if (pastGuesses.length >= numGuesses! || isOver ) {
        errors.push('This game is already over and you have lost!')
    
    } else if (secretCode!.length !== incomingGuesses.length){
        errors.push(`The code entered is not as long as the original code (${secretCode.length} characters long)!`)

    }

    return errors;
}