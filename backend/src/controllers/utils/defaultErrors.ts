import { Response } from "express"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { controllerError } from "../../types"

//Catch all functions for dealing with errors

const genererateErrorMessage = (resourceName: string) =>(
    `Unable to handle request for the resource ${resourceName} to the database, internal service error`
)


export const produceControllerError = (res: Response, error: controllerError, resourceName: string): Response => {

    if (error instanceof PrismaClientKnownRequestError){
        return res.status(500).json({errors: [genererateErrorMessage(resourceName)]})   
    }
    else{
        return res.status(500).json({errors: [genererateErrorMessage(resourceName)]})
    }

}