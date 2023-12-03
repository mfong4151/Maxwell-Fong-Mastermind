import { Game, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { createGame } from "../../database/game";
import { controllerError } from "../../types";
import { NON_EXISTANT_RELATION, UNIQUE_CONSTRAINT_VIOLATION, generateLocation, produceControllerError } from "../utils";
import { generateRandomCode } from "./utils";
import { CodeOptions } from "../../types/interface";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

//TODOS:
// 1. Fix the players array options, im not sure if its better practice to ask for an empty array, or imply theres won

//After recieving a request, does the following:
//1. Fire api call to random api to create game.
//2. Adds it to the original data from the body.
//3. Creates the game row.
//4. Returns the game data.

export const postGame = async (req: Request, res: Response): Promise<Response> => {
    const {num} = req.body as CodeOptions
    let playerIds = req.body.playerIds as number[];
    const userId: number | undefined = req.userId;

    //Handles the addition of users to a game if they don't 
    if (userId){ 
        if (playerIds){
            playerIds.push(userId)
        } else{
            playerIds = [userId]
        }
    }

    try {
        const secretCode: string[] = await generateRandomCode({num})

        if (secretCode.length){               
            const game: Awaited<Partial<Game>> = await createGame(secretCode, playerIds);
            
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
        
        if(error instanceof PrismaClientKnownRequestError 
            && error.code === NON_EXISTANT_RELATION){
            return res.status(404).json({
                errors: ['One of the users added does not exist, please re evaluate your game creation request']
            })

        } else {
            return produceControllerError(res, error, "game")

        }


    }
}


