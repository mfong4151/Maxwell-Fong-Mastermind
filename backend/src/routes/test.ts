import { Request, Response } from "express";
import { Router } from "express";
import { lruGames, lruPlayers } from "../controllers/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const testQuery = async() => (
    prisma.$queryRaw`
       SELECT * FROM games
       WHERE  ("endsAt" > CURRENT_DATE OR "endsAt" IS NULL)
    ;`    
)


const testRouter = Router()
//TODO: add P010 error in handler
//  code: "P2010",
//   clientVersion: "5.6.0",
//   meta: {
//     code: "42601",
//     message: "ERROR: syntax error at or near "game_guesses""
//   }
// }
const test = async (req: Request, res: Response): Promise<Response> => {
    
    try {
        console.log(lruGames.get(40))
        console.log(lruPlayers.get(40))
        
        return res.status(200).json(test)
    } catch (error: unknown) {
        console.log(error)
        return res.status(500).json({errors:[":("]})
        
    }
    
}

testRouter
        .get("/", test)

export default testRouter;

