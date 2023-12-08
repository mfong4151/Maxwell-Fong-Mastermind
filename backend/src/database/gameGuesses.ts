import prisma from "./db";
import type { GameGuess } from "@prisma/client";
import type { gameGuessNoFK } from "../types";

export const findGuessesByGameId = (gameId: number): Promise<Partial<GameGuess>[]> => (
    prisma.gameGuess.findMany({
        where: {
            gameId
        },
        select:{
          id: true,
          gameId: true,
          numCorrectLoc: true,
          numCorrectNum: true,
          isGameWon: true,
          createdAt: true,
        },
        orderBy:{
            createdAt: "asc"
        }
    })

) 

//Used for creating a game guess
export const createGameGuess = (
    data: gameGuessNoFK, 
    gameId: number, 
    playerId: number | undefined
): Promise<GameGuess> => 
(
    prisma.gameGuess.create({
        data: {
            ...data,
            game: {
                connect:{
                    id: gameId
                }
            },
            ...(playerId && { connect:{id: playerId}})
        }
    })
    
)
