import { Router } from "express";
import { validate } from "../middleware";
import { getGame, postGame, patchGame } from "../controllers/games";
import { gameGetValidations, gamePostValidations, gamePatchValidations  } from "../validations/game";

/*
    GET: Used to retrieve previous game state. Used for 
    POST: Used for creating a new game resource.
    PATCH: Called by player to play the game.
*/

const gameRouter: Router = Router();
gameRouter
    .get('/:id', gameGetValidations, validate, getGame)
    .post('/', gamePostValidations, validate, postGame )
    .patch('/:id', gamePatchValidations, validate, patchGame)

export default gameRouter;