import { Request, Response } from "express";
import { generateNotFoundMessage, handleControllerErrors } from "../utils";
import { Game } from "@prisma/client";
import { findGameById } from "../../database/game";

export const getGame = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id as string;

    try {
        const game: Awaited<Partial<Game | null>> = await findGameById(Number(id))

        if (game){
            return res.status(200).json(game)
            
        } else{
            return res.status(404).json({errors:[generateNotFoundMessage('game', id)]})

        }
            
    } catch (error: unknown) {
        return handleControllerErrors(res, error, 'game')

    }
}