import { Request, Response } from "express";
import { generateLocation, generateNotFoundMessage, produceControllerError } from "../utils";
import { createGameGuess, findGameById } from "../../database/game";
import { Game, GameGuess } from "@prisma/client";
import { gameGuessNoFK } from "../../types";

/*
TODO: 
1. Test helper functions
2. Improve response logic status codes
3. Double check logic for optional playerId
4. Fix scoreGame loop logic, you might need a two pass here in order to make sure theres no double accounting
    --Potential solution, if they match, then add the score immediately, if they dont, add them to the count hash
    --Then we only diff the count hash and the remaining members of the secret code
*/

export const postGameGuess = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number =  Number(req.params.id);
    const {guesses, playerId} = req.body as { guesses: string[], playerId: number | undefined};

    try {
        //Load previous gamestate
        const prevGameState: Awaited<Partial<Game | null>> = await findGameById(gameId, true);
        
        if (!prevGameState){
            return res.status(404).json(generateNotFoundMessage('game', gameId))
        }

        const errors: string[] = _checkGamePlayable(prevGameState, guesses);
        
        if (errors.length){
            return res.status(409).json({errors})
        }

        //Check against previous game state, recieve a Partial<GameGuess> object which tracks score.
        //Add on the user's id and game's id to the object.
        const data: gameGuessNoFK = _scoreGame(
                                            prevGameState.secretCode!,
                                            guesses
                                        );
        

        //Create a record of the game guess.
        const gameGuess : Awaited<GameGuess> = await createGameGuess(data, gameId, playerId);
        const location: string = generateLocation(req, gameGuess.id);

        return res
                .status(200)
                .location(location)
                .json(gameGuess)

    } catch (error: unknown) {
        return produceControllerError(res, error, 'game') 
    }
}

const _checkGamePlayable = (prevGameState: Partial<Game> | any, incomingGuesses: string[]): string[] =>{
    const errors: string [] = []
    
    const {numGuesses, secretCode, guesses} = prevGameState;

    if (guesses.length && guesses.at(-1).isGameWon){
        errors.push('This game has already been won!')

    } else if (guesses.length >= numGuesses!) {
        errors.push('This game is already over and you have lost!')
    
    } else if (secretCode!.length !== incomingGuesses.length){
        errors.push('The code entered is not as long as the original code!')

    }

    return errors;
}

const _scoreGame = (secretCode: string[], incomingGuesses: string[]): gameGuessNoFK => {
    let numCorrectLoc: number = 0, numCorrectNum: number = 0, isGameWon: boolean = false;
    const codeCount = _countCodeMembers(secretCode);

    //Check for correct locations and correct numbers
    for(let i: number = 0; i < incomingGuesses.length; i++ ){
        const code: string = secretCode[i];
        const guess: string = incomingGuesses[i];

        if (code === guess){
            numCorrectLoc ++
            numCorrectNum ++
            codeCount[code] --
        
        } else if(codeCount[code] > 0){
            numCorrectNum ++
            codeCount[code] --

        } 
    }

    //If the game is won, then we return it on the latest guess
    if (numCorrectLoc === numCorrectNum && numCorrectLoc === incomingGuesses.length){
        isGameWon = true;
    }
    
    //Return the new game state
    return {numCorrectLoc, numCorrectNum, isGameWon}
}

const _countCodeMembers = (secretCode: string[]) =>{
    const codeCount: {[key:string]: number} = {};
    
    for (const code of secretCode){
        codeCount[code] = codeCount[code] ?? 0  + 1
    }

    return codeCount;
}