import { Game, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { createGame } from "../../../database/game";
import { controllerError } from "../../../types";
import { NON_EXISTANT_RELATION, generateLocation, handleControllerErrors } from "../../utils";
import { _generateRandomCode} from "./_generateRandomCode";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { _convertToEndDate } from "./_convertToEndDate";

//After recieving a request, does the following:
//1. Fire api call to random api to create game.
//2. Adds it to the original data from the body.
//3. Creates the game row.
//4. Returns the game data.

interface ReqBody{
    num: number;
    numGuesses:number;
    endsAt?: number //expected to be the length of time in unix timestamp
}

export const postGame = async (req: Request, res: Response): Promise<Response> => {
    const {num, numGuesses} = req.body as ReqBody;
    const userId: number | undefined = req.userId;
    let endsAt: number| undefined = req.body.endsAt;
    let playerIds = _handleUserId(userId, req.body.playerIds as number[]);
    
    try {
        const secretCode: string[] = await _generateRandomCode({num});
        
        //We assume that the creation failed if an empty array is returned.
        if (secretCode.length){
            const endDateTime: string = endsAt ? _convertToEndDate(endsAt) : "";
            const game: Awaited<Partial<Game>> = await createGame(
                                                        secretCode, 
                                                        numGuesses, 
                                                        playerIds,
                                                        endDateTime
                                                       );            
                                        
            return res
                    .status(201)
                    .location(generateLocation(req, game.id!))
                    .json(game);

        }else{
            return res
                    .status(500)
                    .json({errors: ["The game could not be created due to a third party API issue."]});
        }           

    } catch (error: controllerError) {
        
        if(error instanceof PrismaClientKnownRequestError && error.code === NON_EXISTANT_RELATION){
            return res.status(404).json({
                errors: ["One of the users added does not exist, please re-evaluate your game creation request"]
            });

        } else {
            return handleControllerErrors(res, error, "game")

        }
    }
}

//Handles the addition of users to a game if its not specified immediately
const _handleUserId = (userId: number | undefined, playerIds: number[]): number[] => {
    if (userId){ 
        if (playerIds && !playerIds.includes(userId)){
            playerIds.push(userId)
        } else{
            playerIds = [userId]
        }
    }

    return playerIds;
}