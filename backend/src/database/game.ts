import { Game, Prisma } from "@prisma/client";
import prisma from "./db";

//Used for initializing a game
export const createGame = (data: Prisma.GameCreateInput): Promise<Game> => (
    prisma.game.create({
        data        
    })
)

//Used for getting a current game
export const findGameById = (id: string): Promise<Game | null> => (
    prisma.game.findUnique({
        where: {id}
    })
)

//Used to play the game, make guesses
export const updateGame = (data: Prisma.GameUpdateInput, id: string)
    : Promise<Partial<Game>| null> =>
(
    prisma.game.update({
        where: { id },
        data,
        select: {
            remainingGuesses: true,
            numCorrectLoc: true,
            numCorrectNum: true,
        }
    })
)