import { Request, Response } from "express";
import { handleControllerErrors } from "../utils";
import { GameGuess } from "@prisma/client";
import { findGuessesByGameId } from "../../database/gameGuesses";
import type { controllerError } from "../../types";

export const getGameGuesses = async (req: Request, res: Response): Promise<Response> => {
    const gameId = Number(req.params.gameId as string); 

    try {
        const guesses: Awaited<Partial<GameGuess>[]> = await findGuessesByGameId(gameId);   

        if (guesses.length){
            return res.status(200).json(guesses);

        } else{
            return res
                    .status(404)
                    .json({errors: ["This game has no guesses! Go ahead and try one for yourself"]});
        }


    } catch (error: controllerError) {
        return handleControllerErrors(res, error, "game guesses");
    }
}