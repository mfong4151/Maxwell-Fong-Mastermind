import { Response } from "express"
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { NON_EXISTANT_RELATION, UNIQUE_CONSTRAINT_VIOLATION, MALFORMED_SQL_ERROR } from "./constants"
import { controllerError } from "../../types"

//Catch all functions for dealing with errors
const genererateErrorMessage = (resourceName: string) =>(
    `Unable to handle request for the resource ${resourceName} to the database, internal service error`
)

export const handleControllerErrors = (res: Response, error: controllerError, resourceName: string): Response => {

    if ( error instanceof PrismaClientKnownRequestError ){
        return _delegatePrismaQueryError(res, error, resourceName)
           
    } else if (error instanceof PrismaClientInitializationError){
        return res.status(500).json({errors: ["Server failed to connect to database."]})

    } else{
        return res.status(500).json({errors: [genererateErrorMessage(resourceName)]})

    }

}

const _delegatePrismaQueryError = (res: Response, error: PrismaClientKnownRequestError, resourceName: string) => {
    switch(error.code){
        case UNIQUE_CONSTRAINT_VIOLATION:
            return res
                    .status(409)
                    .json({errors: [`A ${resourceName} with the same ${error.meta!.target} already exists.`]})

        case NON_EXISTANT_RELATION:
            return res
                    .status(404)
                    .json({errors: [`A relation on the ${resourceName} field does not exist`]})
        case MALFORMED_SQL_ERROR:
            return res
                    .status(500)
                    .json({error: [`A query for the related resource is incorrect, please come again later.`]})

        default:
            return res
                    .status(500)
                    .json({errors: [genererateErrorMessage(resourceName)]})
    }    
}

export const generateNotFoundMessage = (resourceName: string, id: number | string) =>{
    const capitalizedResource = `${resourceName[0].toLocaleUpperCase()}${resourceName.slice(1)}`
    return `${capitalizedResource} of id ${id} not found.`
}