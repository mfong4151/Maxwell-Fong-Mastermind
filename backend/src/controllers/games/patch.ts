import { Request, Response } from "express";
import { generateNotFoundMessage, produceControllerError } from "../utils";
import { findGameById, updateGame } from "../../database/game";
import { Game } from "@prisma/client";

export const patchGame = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const {guesses} = req.body as { guesses: string[]}

    try {
        //Load previous gamestate

        const prevGameState: Awaited<Partial<Game | null>> = await findGameById(Number(id), true)
        
        if (!prevGameState){
            return res.status(404).json(generateNotFoundMessage('game', id))
        }

        const errors: string[] = _checkGameUpdateable(prevGameState, guesses)
        
        if (errors.length){
            return res.status(404).json({errors})
        }
        

        //Check against previous game state
        const newGameState = _compareGameState(prevGameState, guesses)

        if(!newGameState){
            return res
                    .status(400)
                    .json({errors: ['The length of the guess is not equal to the length of the original code']})
        }

        const updatedGame: Awaited<Partial<Game> | null> = await updateGame(newGameState, Number(id))

        if(updatedGame){
            return res.status(200).json(updatedGame)

        }else{
            return res.status(404).json({errors: [generateNotFoundMessage('game', id)]})
            
        }
    } catch (error: unknown) {
        return produceControllerError(res, error, 'game') 
    }
}

const _checkGameUpdateable = (prevGameState: Partial<Game>, guesses: string[]): string[] =>{
    const errors: string [] = []
    const {isGameWon, secretCode, remainingGuesses} = prevGameState;

    if (isGameWon){
        errors.push('This game has already been won!')

    } else if (!isGameWon && remainingGuesses! <= 0) {
        errors.push('This game is already over and you have lost!')
    
    } else if (secretCode!.length !== guesses.length){
        errors.push('The code entered is not as long as the original code!')

    }

    return errors;
}


const _compareGameState = (prevGameState: Partial<Game>, guesses: string[]): Partial<Game> => {
    let numCorrectLoc: number = 0, numCorrectNum: number = 0, isGameWon: boolean = false;
    const secretCode = prevGameState.secretCode!
    const codeCount = _countCodeMembers(secretCode)
    const remainingGuesses = prevGameState.remainingGuesses! --;
    
    for(let i: number = 0; i < guesses.length; i++ ){
        const code: string = secretCode[i];
        const guess: string = guesses[i];

        if (code === guess){
            numCorrectLoc ++
            numCorrectNum ++
            codeCount[code] --
        
        } else if(codeCount[code]){
            numCorrectNum ++
            codeCount[code] --
        } 

    }
    //Return the new game state


    if (numCorrectLoc === numCorrectNum && numCorrectLoc === guesses.length){
        isGameWon = true;
    }


    return {numCorrectLoc, numCorrectNum, isGameWon, remainingGuesses}
}

const _countCodeMembers = (secretCode: string[]) =>{
    const codeCount: {[key:string]: number} = {};
    
    for (const code of secretCode){
        codeCount[code] ??= codeCount[code] + 1
    }

    return codeCount;
}