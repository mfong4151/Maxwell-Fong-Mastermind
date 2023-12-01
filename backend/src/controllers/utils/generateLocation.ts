import { Request } from "express"

export const generateLocation = (req: Request, resourceId: string): string => (
    `${req.originalUrl}/${resourceId}`
)
