import { User, Prisma} from "@prisma/client";
import prisma from "./db";
import type { UserProfile } from "../types";

export const findUserByUsername = (username: string): Promise<User | null> => (
    prisma.user.findUnique({
        where: {
            username
        }
    })
)

export const createUser = (data: Prisma.UserCreateInput): Promise<User> =>(
    prisma.user.create({
        data    
    }))

 
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
