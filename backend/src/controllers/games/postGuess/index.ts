import { Request, Response } from "express";
import { generateLocation, generateNotFoundMessage, handleControllerErrors } from "../../utils";
import { createGameGuess, findGameById } from "../../../database/game";
import { GameGuess } from "@prisma/client";
import { gameGuessNoFK, GameWithPlayers} from "../../../types";
import { _checkGamePlayable } from "./_checkGamePlayable";
import { _scoreRound } from "./_scoreRound";
import {  _isPlayerPermitted } from "./_checkPlayerPermission";

/*
TODO: 
3. Double check logic for optional playerId (NOT IMPLEMENTED)
*/

export const postGameGuess = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number =  Number(req.params.gameId);
    const {guesses} = req.body as { guesses: string[]};
    const currPlayerId = req.userId as number | undefined;

    try {
        //Load previous gamestate
        const gameConfig: Awaited<Partial<GameWithPlayers> | null> = await findGameById(gameId, true);
        if (!gameConfig){
            return res.status(404).json(generateNotFoundMessage('game', gameId))

        }
    
        //Check if the player is permitted to play. 
        //If gameConfig.players is undefined, then we assume this is a loginless game
        if  (currPlayerId && !_isPlayerPermitted(gameConfig.players, currPlayerId)){
            return res
                    .status(401)
                    .json({errors: ['You are not allowed to play this game!']})
        }


        const errors: string[] = _checkGamePlayable(gameConfig, guesses);
        
        if (errors.length){
            return res.status(422).json({errors})

        }

        //Check against previous game state, recieve a Partial<GameGuess> object which tracks score.
        //Add on the user's id and game's id to the object.
        const data: gameGuessNoFK = _scoreRound(gameConfig.secretCode!,guesses);

        //Create a record of the game guess, POST operation.
        const gameGuess : Awaited<GameGuess> = await createGameGuess(data, gameId, currPlayerId);
        const location: string = generateLocation(req, gameGuess.id);

        return res
                .status(200)
                .location(location)
                .json(gameGuess)

    } catch (error: unknown) {
        return handleControllerErrors(res, error, 'game') 
        
    }
}