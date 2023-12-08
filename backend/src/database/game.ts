import { Game, GameGuess, GamePlayer} from "@prisma/client";
import prisma from "./db";
import { GameConfig, gameGuessNoFK} from "../types";

// Used for initializing a game
// Creates a game, then tries to create GamePlayers
// If an undefined is passed as playerIds, at runtime it is implicitly handled as an empty array
// In the case where no player objects are sent, the game impliclty only has a single, not logged in player.

export const createGame = (
                            secretCode: string[], 
                            numGuesses: number, 
                            playerIds: number[] = [],
                            endDateTime: string = ""
                            )
: Promise<Partial<Game>> => {
    const data: any = {
        secretCode,
        numGuesses,
        players: {
            create: 
                playerIds.map((id: number) => ({
                    player: {
                        connect:{
                            id
                        }
                    }
                }))
        },
        ...(endDateTime && {endsAt: endDateTime})
    }

    return prisma.game.create({
        data: data,
        select:  {
            id: true,
            numGuesses: true,
            players: true,
        }
    })
}

//Used for getting a current game
export const findGameById = (id: number ): Promise<Partial<Game> | null> => (
    prisma.game.findUnique({
        where: {id},
        select:{
            id: true,
            numGuesses: true,
            createdAt: true,
            endsAt: true,
            players: {
                select: {
                    id: true,
                    playerId: true,
                    player:{
                        select:{
                            id: true,
                            username: true
                        }
                    }
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
                    createdAt: "asc"
                } 
            },
        }
    })
)

//Used for getting the config, which has among other things the secret code.
export const findConfigById = (id: number): Promise<GameConfig | null> =>(
    prisma.game.findUnique({
        where: {
            id
        },
        select:{
            id: true,
            secretCode: true,
            endsAt: true,
            guesses: true,
            numGuesses: true,
         
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
            createdAt: "asc"
        }
    })

) 

