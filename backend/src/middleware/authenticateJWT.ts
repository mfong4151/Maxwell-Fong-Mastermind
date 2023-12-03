import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwtConfig';

interface Token{
    userId: number, 
    iat: number, 
    exp: number
};

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res
                .status(401)
                .json({errors:['You are not logged in! Please log in before proceeding']});
    } 

    const user = verifyToken(token) as Token 
    if (!user){
        return res
                .send(403)
                .json({errors:['You are not permitted to access this account!']});

    } 

    req.userId = user.userId;

    next();

};

//Used primarily if someone wants to play games without being logged in.
export const optionallizeJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return next()
    } 

    const user = verifyToken(token) as Token;

    req.userId = user.userId;

    next();

};

