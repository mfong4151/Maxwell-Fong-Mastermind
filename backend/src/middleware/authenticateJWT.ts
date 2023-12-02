import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwtConfig';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.sendStatus(401);
    } 

    const user = verifyToken(token);
    if (!user){
        return res.sendStatus(403);    
    } 

    next();

};
