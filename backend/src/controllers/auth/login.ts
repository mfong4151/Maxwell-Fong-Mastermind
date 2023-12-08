import { Request, Response } from "express";
import { findUserByUsername } from "../../database/user";
import { generateToken } from "../../utils/jwtConfig";
import { compare } from "bcrypt";
import type { User } from "@prisma/client";
import { handleControllerErrors } from "../utils";

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body as { [key: string]: string }

    try {

        const user: Awaited<User | null> = await findUserByUsername(username);

        if (user && await compare(password, user.hashedPassword)) {
            const token = generateToken(user.id);
            return res.status(200).json({ token });

        } else {
            return res.status(401).json({ errors: ["Invalid username or password"] });

        }
    } catch (error: unknown) {
        return handleControllerErrors(res, error, "user");

    }

}
