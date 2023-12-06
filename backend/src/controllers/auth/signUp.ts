import { Request, Response } from "express";
import { handleControllerErrors } from "../utils";
import { createUser } from "../../database/auth";
import {User} from '@prisma/client';
import {hash} from 'bcrypt';
import { controllerError } from "../../types";

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    const {username, password} = req.body as {username: string, password: string};
    
    try {
        const SALT: Readonly<number> = 11;
        const hashedPassword: Awaited<string> = await hash(password, SALT); 
        const user: Awaited<User> = await createUser({username, hashedPassword})

        return res
                .status(201)
                .location(`/api/v1/users/${user.id}`)
                .json({user});

    } catch (error: controllerError) {
        return handleControllerErrors(res, error, 'user')

    }
}

