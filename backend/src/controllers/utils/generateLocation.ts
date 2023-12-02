import { Request } from "express"

export const generateLocation = (req: Request, resourceId: number): string => (
    `${req.originalUrl}/${resourceId}`
)
