import { ValidationChain, body} from "express-validator";
import { capitalize } from "../utils";

const generateAuthFieldsValidation = (property: string): ValidationChain=>(
    body(property)
        .isString()
        .isLength({min: 6, max:12})
        .withMessage(`${capitalize(property)} must be between 6 and 12 characters long!`)
        .custom(s => /^[!-~]+$/.test(s))
        .withMessage(
            `${capitalize(property)} can only contain characters that are uppercase or lowercase a-z, 0-9, or punctuation.\n
            No whitespace is allowed!`
        )

)

export const authValidations: ValidationChain[] = [
    generateAuthFieldsValidation("username"),
    generateAuthFieldsValidation("password")    
    
];