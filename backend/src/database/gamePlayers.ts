import { GamePlayer } from "@prisma/client";
import prisma from "./db"

export const findPlayersByGameId = (gameId: number): Promise<GamePlayer[]> =>(
    prisma.gamePlayer.findMany({
        where: {
            gameId 
        }
    })
);

export const createGamePlayer = ( gameId: number, playerId: number): Promise<GamePlayer> => (
    prisma.gamePlayer.create({
        data: {

            game:{
                connect:{
                    id: gameId
                }
            },
            player:{
                connect:{
                    id: playerId
                }
            }
            
        }
    })
)
    