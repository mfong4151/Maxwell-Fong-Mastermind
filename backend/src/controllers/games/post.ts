import { Game, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { createGame } from "../../database/game";
import { controllerError } from "../../types";
import { generateLocation, produceControllerError } from "../utils";
import { generateRandomCode } from "./utils";
import { CodeOptions } from "../../types/interface";

//After recieving a request, does the following:
//1. Fire api call to random api to create game.
//2. Adds it to the original data from the body.
//3. Creates the game row.
//4. Returns the game data.

export const postGame = async (req: Request, res: Response): Promise<Response> => {
    const {num} = req.body as CodeOptions
    const data: Prisma.GameCreateInput = {}
    
    try {
        const secretCode: string[] = await generateRandomCode({num})

        if (secretCode.length){   
            data.secretCode = secretCode;
            const game: Awaited<Partial<Game>> = await createGame(data);
            
            return res
                    .status(201)
                    .location(generateLocation(req, game.id!))
                    .json(game)

        }else{
            return res
                    .status(500)
                    .json({errors: ['The game could not be created due to an internal service issue.']})
        }            
    } catch (error: controllerError) {
        return produceControllerError(res, error, "game")

    }
}


