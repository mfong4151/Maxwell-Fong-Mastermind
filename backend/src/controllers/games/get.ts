import { Request, Response } from "express";
import { generateNotFoundMessage, handleControllerErrors, lruGames } from "../utils";
import { Game } from "@prisma/client";
import { findGameById, findConfigById } from "../../database/game";
import type { GameConfig, controllerError } from "../../types";

//When a GET request is made to get the game, we cache the players and the games.
//We do this because we assume that attempts to play the game are made later on after a game is accessed.
export const getGame = async (req: Request, res: Response): Promise<Response> => {
    const id: number =  Number(req.params.id as string);
    
    try {
        const game: Awaited<Partial<Game | null>> = await findGameById(id);
        const gameConfig: Awaited<GameConfig | null> = await findConfigById(id);   
        
        //In the case that the game exists, we cache the secretCode, end date for use in postGuess
        //We also cache the game player players
        if (gameConfig){
            lruGames.set(gameConfig.id!, gameConfig)
        }

        if (game){
            return res.status(200).json(game);
            
        } else{
            return res.status(404).json({errors:[generateNotFoundMessage("game", id)]});

        }
            
    } catch (error: controllerError) {
        return handleControllerErrors(res, error, "game");

    }
}