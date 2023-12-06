import { Request, Response } from "express";
import { Game, GamePlayer } from "@prisma/client";
import { findGameById } from "../../database/game";
import { findUserProfileById } from "../../database/user";
import { UserProfile, controllerError } from "../../types";
import { handleControllerErrors } from "../utils";
import { createGamePlayer } from "../../database/game";

//Used for adding players to a game
export const postGamePlayer  = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number = Number(req.params.gameId as string);
    const playerId: number = req.body.playerId as number ;
    
    try {
        const game: Awaited<Partial<Game>| null>  = await findGameById(gameId);
        const user: Awaited< UserProfile | null> = await findUserProfileById(playerId); 
        
        if(!game || !user){
            const notFoundResource: string = `${game && 'game'}, ${user && 'user'}`

            return res
                    .status(404)
                    .json({errors: [`The following resources were not found ${notFoundResource}`]})

        }
        const gamePlayer: Awaited<GamePlayer> = await createGamePlayer(gameId, playerId);
        
        return res.status(200).json(gamePlayer)

    } catch (error: controllerError){
        return handleControllerErrors(res, error, 'game player')

    }
}