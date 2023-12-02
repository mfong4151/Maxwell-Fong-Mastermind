import { Game, Prisma, GameGuess} from "@prisma/client";
import prisma from "./db";
import { gameGuessNoFK } from "../types";

//Used for initializing a game
export const createGame = (data: Prisma.GameCreateInput): Promise<Partial<Game>> => (
    prisma.game.create({
        data,
        select:  {
            id: true,
            numGuesses: true,
        }
    })
)

//Used for getting a current game
export const findGameById = (id: number, isCheckingScore: boolean = false): Promise<Partial<Game> | null> => (
    prisma.game.findUnique({
        where: {id},
        select:{
            id: true,
            numGuesses: true,
            createdAt: true,
            secretCode: isCheckingScore,
            guesses: {
                select:{
                    numCorrectLoc: true,
                    numCorrectNum: true,   
                    isGameWon: true
                },
                orderBy: {
                    createdAt: 'asc'
                } 
            },
        }
    })
)

//Used for creating a game guess
export const createGameGuess = 
    (data: gameGuessNoFK, gameId: number, playerId: number | undefined)
    : Promise<GameGuess> => 
        {
            const query: any = {
                ...data,
                game: {
                    connect:{
                       id: gameId
                    }
                },

            }

            //Gives the flexibility for having accountless games
            if (playerId) {
                query.player = {
                    connect:{
                        id: playerId
                        }
                    }
            }

            return prisma.gameGuess.create({
                data: query
            })
        }