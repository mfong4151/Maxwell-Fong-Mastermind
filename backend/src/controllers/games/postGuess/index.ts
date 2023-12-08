import { Request, Response } from "express";
import { generateLocation, generateNotFoundMessage, handleControllerErrors} from "../../utils";
import { createGameGuess, findGuessesByGameId } from "../../../database/gameGuesses";
import { GameGuess } from "@prisma/client";
import { GameConfig, controllerError, gameGuessNoFK} from "../../../types";
import { _checkGamePlayable } from "./_checkGamePlayable";
import { _scoreRound } from "./_scoreRound";
import {  _isPlayerPermitted } from "./_checkPlayerPermission";
import { retrieveGameConfig, retrievePlayers } from "../utils";

export const postGameGuess = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number =  Number(req.params.gameId);
    const {guesses} = req.body as { guesses: string[]};
    const playerId = req.userId as number | undefined;

    try {
        //1. Load previous gamestate, first check cache, then check db
        //Only apply the check to playerId if this is a logged in game.
        const gameConfig: Awaited<GameConfig | null> = await retrieveGameConfig(gameId);
        const playerIds: Awaited<Set<number> | null> = await retrievePlayers(gameId);
    
        if (!gameConfig || (playerId && !playerIds)){
            return res.status(404).json(generateNotFoundMessage("game", gameId));
        }
    
        //2. Check if the player is permitted to play. 
        //If playerId is undefined, then we assume this is a loginless game
        if(playerId && !( !!playerIds!.size && playerIds!.has(playerId))){
            return res
                    .status(401)
                    .json({errors: ["You are not allowed to play this game!"]});
        }

        const pastGuesses: any = await findGuessesByGameId(gameId)
        const errors: string[] = _checkGamePlayable(gameConfig, pastGuesses, guesses);
        
        if (errors.length){
            return res.status(422).json({errors});
        }

        //3. Check against previous game state, recieve a Partial<GameGuess> object which tracks score.
        //Add on the user"s id and game"s id to the object.
        const data: gameGuessNoFK = _scoreRound(gameConfig.secretCode!, guesses);

        //Create a record of the game guess, POST operation.
        const gameGuess : Awaited<GameGuess> = await createGameGuess(data, gameId, playerId);
        const location: string = generateLocation(req, gameGuess.id);

        return res
                .status(201)
                .location(location)
                .json(gameGuess);

    } catch (error: controllerError) {
        return handleControllerErrors(res, error, "game");
        
    }
}