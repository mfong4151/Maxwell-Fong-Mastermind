import { Game, Prisma } from "@prisma/client";
import prisma from "./db";
import { PrismaQueryOptions } from "../types";


const gameSelectFields: PrismaQueryOptions = {
            id: true,
            remainingGuesses: true,
            numCorrectLoc: true,
            numCorrectNum: true,
            isGameWon: true
        }

const scoreSelectFields:  PrismaQueryOptions = {
    ...gameSelectFields,
    secretCode: true
}

//Used for initializing a game
export const createGame = (data: Prisma.GameCreateInput): Promise<Partial<Game>> => (
    prisma.game.create({
        data,
        select: gameSelectFields
    })

)

//Used for getting a current game
export const findGameById = (id: number, isCheckingScore: boolean = false): Promise<Partial<Game> | null> => (
    prisma.game.findUnique({
        where: {id},
        select: isCheckingScore ? scoreSelectFields : gameSelectFields 
    })
)


//Used to play the game, make guesses
export const updateGame = (data: Prisma.GameUpdateInput, id: number)
    : Promise<Partial<Game>| null> =>
(
    prisma.game.update({
        where: { id },
        data,
        select: gameSelectFields
    })
)