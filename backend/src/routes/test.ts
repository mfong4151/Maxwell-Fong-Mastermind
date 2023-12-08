import { Request, Response } from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { findUserProfileById } from "../database/user";

const prisma = new PrismaClient()


export const testQuery = async (id: number) => (
    prisma.$queryRaw`
        SELECT 
            u.username,
            CAST(COUNT(DISTINCT gp."gameId") AS INTEGER) AS "totalGames",
            CAST(COUNT(DISTINCT gg.id) FILTER (WHERE gg."isGameWon" = true) AS INTEGER) AS "gamesWon"
        FROM 
            users u
        LEFT JOIN 
            "gamePlayers" gp ON gp."playerId" = u.id
        LEFT JOIN 
            "gameGuesses" gg ON gg."playerId" = u.id
        WHERE 
            u.id = ${id}
        GROUP BY 
            u.username;
    ;`
)


const testRouter = Router()

const test = async (req: Request, res: Response): Promise<Response> => {

    try {
        const test = await testQuery(1)
        return res.status(200).json(test)
    } catch (error: unknown) {
        console.log(error)
        return res.status(500).json({ errors: [":("] })

    }

}

testRouter
    .get("/", test)

export default testRouter;

