import { Game, User } from "@prisma/client";
import prisma from "./db";
import type { UserProfile } from "../types";
//Depreciated in favor of raw query
export const _findGamesByUserIdPrisma = (userId: number): Promise<Partial<Game>[]> => (
    prisma.game.findMany({
        where: {
            players:{
                some:{
                    playerId: userId
                }
            }
        },
        select: {
            id: true,
            numGuesses: true,
            _count: {
                select:{
                    players: true
                }
            },
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
)

//Might break in multiplayer
//The first LEFT JOIN: grabs the count of gameGuesses: gg.id
//The second LEFT JOIN: grabs the winning condition of gamesGuesses, this is given by the latest guess for that game
//The third LEFT JOIN is used to filter the games where the player is a player in them
export const findGamesByUserId  = (playerId: number): Promise<Partial<Game>[]> =>(
    prisma.$queryRaw`
    SELECT 
        g.id, 
        g."numGuesses", 
        g."createdAt",
        CAST(COUNT(DISTINCT gp."playerId") AS INTEGER) AS "numPlayers" ,
        CAST(g."numGuesses" - COUNT(gg.id) AS INTEGER) AS "currGuesses",
        CAST(COUNT(gg.id) AS INTEGER) AS "roundNo"
    FROM games g
    LEFT JOIN "gameGuesses" gg ON gg."gameId" = g.id
    LEFT JOIN (
        SELECT "gameId", "isGameWon", MAX("createdAt") AS "latestDate"
        FROM "gameGuesses"
        GROUP BY "gameId", "isGameWon"
    ) lg
    ON lg."gameId" = g.id
    LEFT JOIN "gamePlayers" gp on gp."gameId" = g.id
    WHERE gp."playerId" = ${playerId}
    GROUP BY g.id, lg."isGameWon"
    HAVING COUNT(gg.id) < g."numGuesses" AND (lg."isGameWon" IS NULL OR lg."isGameWon" = false) 
    ORDER BY g."createdAt" desc;
    ` as Promise<Partial<Game>[]>
)
 
export const findUsersByQuery = (query: string): Promise<Partial< User>[]> => (
    prisma.user.findMany({
        where: {
            username:{
                contains: query
            }
        },
        select:{
            id: true,
            username: true,
        }
    })
)


export const findUserProfileById = async (id: number) : Promise<UserProfile| null>=> {

    const user: Awaited< any | null> = await prisma.user.findUnique({
        where: {id},
        select: {
            username: true,
            _count: {
                select:{
                    games:{
                        where: {
                            playerId: id
                        },
                    },
                    guesses:{
                        where:{
                            AND: [
                                {
                                    playerId:id,
                                },
                                {isGameWon: true }
                            ]
                        }
                    }
                }
            }
        }
    });

    if(user){
        const count = user._count;
        user.gamesWon = count.guesses;
        user.totalGames = count.games;
        delete user._count
    }

    return user;
}

//Get the number of games, get the gamesGuess where the user has won,