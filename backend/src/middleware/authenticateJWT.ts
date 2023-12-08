import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtConfig";

interface Token{
    userId: number, 
    iat: number, 
    exp: number
};

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        return res
                .status(401)
                .json({errors:["You are not logged in! Please log in before proceeding"]});
    } 

    const user = verifyToken(token) as Token;
    if (!user){
        return res
                .status(403)
                .json({errors:["You are not permitted to access this account!"]});

    } 

    req.userId = user.userId;
    return next();

};

//Used primarily if someone wants to play games without being logged in.
//Provides resources to produce optional authentication.
export const optionallizeJWT = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token){
        const user = verifyToken(token) as Token;

        if (!user){
            return res
            .status(401)
            .json({errors: ["Please refresh your login session to proceed."]});

        }

        req.userId = user.userId;

    } else{
        req.userId = 0; //Because an id NEVER === 0, we can use this to indicate no login
        
     }

    return next();

};

