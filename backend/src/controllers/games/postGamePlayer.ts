import { Request, Response } from "express";
import { Game, GamePlayer } from "@prisma/client";
import { findGameById } from "../../database/game";
import { createGamePlayer } from "../../database/gamePlayers";
import { findUserProfileById } from "../../database/user";
import { handleControllerErrors, lruPlayers } from "../utils";
import type { UserProfile, controllerError } from "../../types";

//Used for adding players to a game
export const postGamePlayer  = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number = Number(req.params.gameId as string);
    const playerId  = req.body.playerId as number;
    
    try {
        const game: Awaited<Partial<Game>| null>  = await findGameById(gameId);
        const user: Awaited< UserProfile | null> = await findUserProfileById(playerId); 
        
        if(!game || !user){
            const notFoundResource: string = `${game && "game"}, ${user && "user"}`;
            
            return res
                    .status(404)
                    .json({errors: [`The following resources were not found ${notFoundResource}`]});

        }
        const gamePlayer: Awaited<GamePlayer> = await createGamePlayer(gameId, playerId);

        //Update the cache if it exists, else it will update automatically on next guess
        const playersCachedSet: Set<number> = lruPlayers.get(game.id!)
        if (playersCachedSet){
            playersCachedSet.add(playerId)
        }

        return res.status(200).json(gamePlayer);

    } catch (error: controllerError){
        return handleControllerErrors(res, error, "game player");

    }
}