import { Request, Response } from "express";
import { generateLocation, produceControllerError } from "../utils";
import { createUser } from "../../database/user";
import {hash} from 'bcrypt';

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    const {username, password} = req.body as {username: string, password: string};
    
    try {
        const SALT: number = 11;
        const hashedPassword: Awaited<string> = await hash(password, SALT); 
        const user = await createUser({username, hashedPassword})

        return res
                .status(201)
                .location(`/api/v1/users/${user.id}`)
                .json({user});

    } catch (error: unknown) {
        return produceControllerError(res, error, 'user')

    }
}

