import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction): void => {
    const {body, params, query} = req;
    
    if (Object.values(body).length)
    console.log("BODY", body)

    if (Object.values(params).length)
    console.log("PARAMS", params)
    
    if (Object.values(query).length)
    console.log("QUERY", query)

    return next();
};