import { Request, Response } from "express";
import { User } from "@prisma/client";
import { handleControllerErrors } from "../utils";
import { findUsersByQuery } from "../../database/user";

//Used primarily for the search function, adding users to the game
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const search = req.query.search as string;

    try {
        const users: Awaited<Partial<User>[]>  = await findUsersByQuery(search);

        if(users.length){
            return res.status(200).json(users)

        } else{
            return res.status(404).json({errors: ["Unable to find any users"]})

        }

    } catch (error: unknown) {
        return handleControllerErrors(res, error, "users")

    }
}