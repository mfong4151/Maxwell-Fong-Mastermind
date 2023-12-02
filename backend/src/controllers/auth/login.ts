import { Request, Response } from "express";
import { findUserByUsername } from "../../database/user";
import { generateToken } from "../../jwtConfig";
import {compare} from 'bcrypt';
import type {User} from '@prisma/client';

export const login = async (req: Request, res: Response): Promise<Response> => {

    const { username, password } = req.body;
    const user: Awaited<User | null >  = await findUserByUsername(username)

    if (user && await compare(password, user.hashedPassword)) {
        const token = generateToken(user.id);
        return res.status(200).json({ token });

    } else {
        return res.status(401).send('Invalid username or password');
    }

}
