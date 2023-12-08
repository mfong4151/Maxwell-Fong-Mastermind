import { Request, Response } from "express";
import { generateNotFoundMessage, handleControllerErrors } from "../utils";
import { findUserProfileById } from "../../database/user";
import { User } from "@prisma/client";
import { UserProfile } from "../../types";

//Used for populating the user"s information (at this point only the username)
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.userId as number;

    try {
        const user: Awaited<UserProfile | null> =  await findUserProfileById(userId);
        if (user) {
            return res.status(200).json(user)

        } else {
            return res.status(404).json({errors: [generateNotFoundMessage("user", userId)]})            
        }

    } catch (error: unknown) {
        return handleControllerErrors(res, error, "user profile")

    }
}