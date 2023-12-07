import { Request, Response } from "express";
import { generateLocation, generateNotFoundMessage, handleCachePlayers, handleControllerErrors, lruGames, lruPlayers } from "../../utils";
import { createGameGuess, findConfigById, findGuessesByGameId } from "../../../database/game";
import { GameGuess } from "@prisma/client";
import { GameConfig, controllerError, gameGuessNoFK} from "../../../types";
import { _checkGamePlayable } from "./_checkGamePlayable";
import { _scoreRound } from "./_scoreRound";
import {  _isPlayerPermitted } from "./_checkPlayerPermission";

/*
TODO: 
3. Double check logic for optional playerId (NOT IMPLEMENTED)
4. Check logic for ends at
*/

export const postGameGuess = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number =  Number(req.params.gameId);
    const {guesses} = req.body as { guesses: string[]};
    const currPlayerId = req.userId as number | undefined;
    let gameConfig: GameConfig | null, playerIds: Set<number>;

    try {
        //Load previous gamestate, first check cache, then check db
        gameConfig = lruGames.get(gameId);
        playerIds = lruPlayers.get(gameId);

        if (!gameConfig){
            gameConfig = await findConfigById(gameId);

            if (gameConfig){
                lruGames.set(gameConfig.id, gameConfig)
                playerIds = handleCachePlayers(gameConfig)
                
            }

        }
    
        if (!gameConfig){
            return res.status(404).json(generateNotFoundMessage('game', gameId))

        }
    
        //Check if the player is permitted to play. 
        //If gameConfig.players is undefined, then we assume this is a loginless game
        if  (currPlayerId && !( !!playerIds.size && playerIds.has(currPlayerId))){
            return res
                    .status(401)
                    .json({errors: ['You are not allowed to play this game!']})
        }

        const pastGuesses = await findGuessesByGameId(gameId)
        const errors: string[] = _checkGamePlayable(gameConfig, pastGuesses, guesses);
        
        if (errors.length){
            return res.status(422).json({errors})
        }



        //Check against previous game state, recieve a Partial<GameGuess> object which tracks score.
        //Add on the user's id and game's id to the object.
        const data: gameGuessNoFK = _scoreRound(gameConfig.secretCode!, guesses);

        //Create a record of the game guess, POST operation.
        const gameGuess : Awaited<GameGuess> = await createGameGuess(data, gameId, currPlayerId);
        const location: string = generateLocation(req, gameGuess.id);

        return res
                .status(200)
                .location(location)
                .json(gameGuess)

    } catch (error: controllerError) {
        return handleControllerErrors(res, error, 'game') 
        
    }
}