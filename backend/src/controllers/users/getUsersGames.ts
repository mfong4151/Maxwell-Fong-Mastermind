import { Request, Response } from "express";
import { handleControllerErrors } from "../utils";
import { Game } from "@prisma/client";
import { findGamesByUserId } from "../../database/user";

export const getUsersGames = async (req: Request, res: Response): Promise<Response> => {
    const userId: number = req.userId!;

    try {
        const games: Awaited<Partial<Game>[]> = await findGamesByUserId(userId);
        
        if(games.length){
            return res.status(200).json(games)

        } else{
            return res
                    .status(404)
                    .json({errors: ['This user does not have any games! Go start one to fix this issue!']})

        }


    } catch (error: unknown) {
        return handleControllerErrors(res, error, "user's games")

    }
}