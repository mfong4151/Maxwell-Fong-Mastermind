import { Game, Prisma, GameGuess} from "@prisma/client";
import prisma from "./db";
import { gameGuessNoFK, GameWithPlayers} from "../types";

// Used for initializing a game
// Creates a game, then tries to create GamePlayers
// If an undefined is passed as playerIds, at runtime it is implicitly handled as an empty array
// In the case where no player objects are sent, the game impliclty only has a single, not logged in player.

export const createGame = (secretCode: string[], numGuesses: number, playerIds: number[] = [])
: Promise<Partial<Game>> => (

    prisma.game.create({
        data:{
            secretCode,
            numGuesses,
            players: {
                create: 
                    playerIds.map((id: number) => (
                    {
                        player: {
                            connect:{
                                id
                            }
                        }
                    }
                ))
            }
        },
        select:  {
            id: true,
            numGuesses: true,
            players: true,
        }
    })
)

//Used for getting a current game
//TODO: figure out why the typing is weird here
export const findGameById = (id: number, isCheckingScore: boolean = false): Promise<Partial<Game> | null> => (
    prisma.game.findUnique({
        where: {id},
        select:{
            id: true,
            numGuesses: true,
            createdAt: true,
            secretCode: isCheckingScore,
            players: {
                select: {
                    id: true,
                    playerId: true,

                }
            },
            guesses: {
                select:{
                    id: true,
                    numCorrectLoc: true,
                    numCorrectNum: true,
                    guesses: true,
                    isGameWon: true,
                    createdAt: true,
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

export const findGuessesByGameId  = (gameId: number): Promise<Partial<GameGuess>[]> => (
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
            createdAt: 'asc'
        }
    })

) 