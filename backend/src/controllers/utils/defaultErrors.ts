import { Response } from "express"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { controllerError } from "../../types"
import { NON_EXISTANT_RELATION, UNIQUE_CONSTRAINT_VIOLATION } from "./constants"

//Catch all functions for dealing with errors
const genererateErrorMessage = (resourceName: string) =>(
    `Unable to handle request for the resource ${resourceName} to the database, internal service error`
)

export const handleControllerErrors = (res: Response, error: controllerError, resourceName: string): Response => {

    if (error instanceof PrismaClientKnownRequestError){
        return _delegatePrismaError(res, error, resourceName)
           
    }else{
        return res.status(500).json({errors: [genererateErrorMessage(resourceName)]})

    }

}

const _delegatePrismaError = (res: Response, error: PrismaClientKnownRequestError, resourceName: string) => {
    switch(error.code){
        case UNIQUE_CONSTRAINT_VIOLATION:
            return res
                    .status(409)
                    .json({errors: [`A ${resourceName} with the same ${error.meta!.target} already exists.`]})

        case NON_EXISTANT_RELATION:
            return res
                    .status(404)
                    .json({errors: [`A relation on the ${resourceName} field does not exist`]})

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