import { Request, Response } from "express";
import { generateNotFoundMessage, handleControllerErrors } from "../utils";
import { retrieveGameConfig } from "./utils";
import type { GameConfig, controllerError } from "../../types";

export const getHint = async (req: Request, res: Response): Promise<Response> => {
    const gameId: number = Number(req.params.gameId as string);
    const userId: number | undefined = req.userId;

    //Shy away users who are logged in. Hints are only allowed for casual play.
    if (userId){
        return res.status(401).json({errors: ["You are not permitted to access hints!"]})
    }

    try {
        const gameConfig: Awaited<GameConfig | null> = await retrieveGameConfig(gameId);
        
        if (gameConfig) {
            const {numEvens, numOdds} = _countCodeEntries(gameConfig.secretCode)

            return res
                    .status(200)
                    .json({hint: `This code has ${numEvens} even numbers, and ${numOdds} odds.`})
            
        } else {
           return res.status(404).json(generateNotFoundMessage("game", gameId)) 
        }


    } catch (error: controllerError) {
        return handleControllerErrors(res, error, "game")

    }
}

const _countCodeEntries = (secretCode: string[]) =>{
    let numEvens: number = 0; let numOdds: number = 0;

    for(const num of secretCode){
        if (Number(num) % 2){
            numOdds ++
        } else{
            numEvens ++
        }
    }
    return {numEvens, numOdds}
}