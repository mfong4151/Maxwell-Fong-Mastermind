import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwtConfig';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.sendStatus(401);
    } 

    const user = verifyToken(token) as {userId: number, iat: number, exp: number};
    if (!user){
        return res.sendStatus(403);

    } 

    req.userId = user.userId;

    next();

};
