import { Game } from "@prisma/client";
import prisma from "./db";
import { GameConfig } from "../types";

//The first LEFT JOIN: grabs the count of gameGuesses: gg.id
//The second LEFT JOIN: grabs the winning condition of gamesGuesses, this is given by the latest guess for that game
//The third LEFT JOIN: grabs the count of the number of players
//The fourth LEFT JOIN is used to filter the games where the player is a player in them

export const findGamesByUserId = (playerId: number): Promise<Partial<Game>[]> => (
    prisma.$queryRaw`
        SELECT 
            g.id, 
            g."numGuesses", 
            g."createdAt",
            g."endsAt",
            cp."numPlayers",
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
        LEFT JOIN (
            SELECT "gameId", CAST(COUNT("playerId") AS INTEGER) AS "numPlayers"
            FROM "gamePlayers"
            GROUP BY "gameId"
        ) cp
        ON cp."gameId" = g.id
        LEFT JOIN "gamePlayers" gp on gp."gameId" = g.id
        WHERE gp."playerId" = ${playerId}
        AND (g."endsAt" > CURRENT_DATE OR g."endsAt" IS NULL)
        GROUP BY g.id, lg."isGameWon", cp."numPlayers"
        HAVING COUNT(gg.id) < g."numGuesses" AND (lg."isGameWon" IS NULL OR lg."isGameWon" = false) 
        ORDER BY g."createdAt" desc;
        ` as Promise<Partial<Game>[]>
)

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
    : Promise<Partial<Game>> => (
    prisma.game.create({
        data: {
            secretCode,
            numGuesses,
            players: {
                create:
                    playerIds.map((id: number) => ({
                        player: {
                            connect: {
                                id
                            }
                        }
                    }))
            },
            ...(endDateTime && { endsAt: endDateTime })


        },
        select: {
            id: true,
            numGuesses: true,
            players: true,
        }
    })
);

//Used for getting a current game
export const findGameById = (id: number): Promise<Partial<Game> | null> => (
    prisma.game.findUnique({
        where: { id },
        select: {
            id: true,
            numGuesses: true,
            createdAt: true,
            endsAt: true,
            players: {
                select: {
                    id: true,
                    playerId: true,
                    player: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            },
            guesses: {
                select: {
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
export const findConfigById = (id: number): Promise<GameConfig | null> => (
    prisma.game.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            secretCode: true,
            endsAt: true,
            guesses: true,
            numGuesses: true,
        }
    })

)
