import { Game, User } from "@prisma/client";
import prisma from "./db";

export const findGamesByUserId = (userId: number): Promise<Partial<Game>[]> => (
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

export const findUsersByQuery = (query: string): Promise<Partial< User>[]> => (
    prisma.user.findMany({
        where: {
            username:{
                contains: query
            }
        },
        select:{
            id: true,
            username: true
        }
    })
)

export const findUserProfileById = (id: number) : Promise<Partial<User> | null>=> (
    prisma.user.findUnique({
        where: {id},
        select: {
            username: true
        }
    })

)