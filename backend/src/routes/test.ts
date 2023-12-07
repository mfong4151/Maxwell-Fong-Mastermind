import { Request, Response } from "express";
import { Router } from "express";
import { findGuessesByGameId } from "../database/game";

const testRouter = Router()
//TODO: add P010 error in handler
//  code: 'P2010',
//   clientVersion: '5.6.0',
//   meta: {
//     code: '42601',
//     message: 'ERROR: syntax error at or near "game_guesses"'
//   }
// }
const test = async (req: Request, res: Response): Promise<Response> => {
    
    try {
        const test = await findGuessesByGameId(27)
        console.log(test)
        
        return res.status(200).json(test)
    } catch (error: unknown) {
        console.log(error)
        return res.status(500).json({errors:[':(']})
        
    }
    
}

testRouter
        .get('/', test)

export default testRouter;