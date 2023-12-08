import prisma from "./db";
import {User, Prisma} from "@prisma/client";

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