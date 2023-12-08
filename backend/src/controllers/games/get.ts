import { Request, Response } from "express";
import { generateNotFoundMessage, handleControllerErrors, lruGames } from "../utils";
import { Game } from "@prisma/client";
import { findGameById } from "../../database/game";
import type { controllerError } from "../../types";

//GET request to get the previous game state.
export const getGame = async (req: Request, res: Response): Promise<Response> => {
    const id: number =  Number(req.params.id as string);
    
    try {
        const game: Awaited<Partial<Game | null>> = await findGameById(id);
        
        if (game){
            return res.status(200).json(game);
            
        } else{
            return res.status(404).json({errors:[generateNotFoundMessage("game", id)]});

        }
            
    } catch (error: controllerError) {
        return handleControllerErrors(res, error, "game");

    }
}