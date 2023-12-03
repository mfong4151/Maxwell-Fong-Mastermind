import { Router } from "express";
import { optionallizeJWT, validate } from "../middleware";
import { getGame, getGameGuesses, postGame, postGameGuess } from "../controllers/games";
import { gameGetValidations, gamePostValidations, gameGuessPostValidations  } from "../validations/game";
import { gameGuessPostSanitzations } from "../sanitizations/game";

/*
    GET: Used to retrieve previous game state. Used for resuming a previously started game. 
    POST: Used for creating a new game resource.
    PATCH: Called by player to play the game.
*/

const gameRouter = Router();
gameRouter
    .get('/:gameId/guesses', validate, getGameGuesses)
    .get('/:id', gameGetValidations, validate, getGame)
    .post('/', gamePostValidations, optionallizeJWT ,validate, postGame )
    .post('/:gameId/guesses', gameGuessPostValidations, validate, gameGuessPostSanitzations, postGameGuess  )

export default gameRouter;