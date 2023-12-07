import { Router } from "express";
import { authenticateJWT, optionallizeJWT, validate } from "../middleware";
import { getGame, getGameGuesses, postGame, postGameGuess, postGamePlayer } from "../controllers/games";
import { gameGetValidations, gamePostValidations, gameGuessPostValidations, gamePlayerPostValidations, gameHintGetValidations  } from "../validations/game";
import { gameGuessPostSanitzations } from "../sanitizations/game";
import { getHint } from "../controllers/games/getHint";

/*
    GET: Used to retrieve previous game state. Used for resuming a previously started game. 
    POST: Used for creating a new game resource.
    PATCH: Called by player to play the game.
*/

const gameRouter = Router();
gameRouter
    .get('/:gameId/guesses', validate, getGameGuesses)
    .get('/:gameId/hints/', gameHintGetValidations, validate, getHint)
    .get('/:id', gameGetValidations, validate, getGame)
    .post('/', gamePostValidations, optionallizeJWT ,validate, postGame )
    .post('/:gameId/guesses', gameGuessPostValidations, optionallizeJWT, validate, gameGuessPostSanitzations, postGameGuess  )
    .post('/:gameId/players', gamePlayerPostValidations, authenticateJWT, validate, postGamePlayer)

export default gameRouter;