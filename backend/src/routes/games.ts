import { Router } from "express";
import { authenticateJWT, optionallizeJWT, validate } from "../middleware";
import { getGame, getGameGuesses, postGame, postGameGuess, postGamePlayer, getHint } from "../controllers/games";
import { gameGuessPostSanitzations } from "../sanitizations/game";
import { gamePostValidations, gameGuessPostValidations, gameGetValidations,
         gameHintGetValidations, gamePlayerPostValidations
        }from "../validations";

/*
    GET: Used to retrieve previous game state. Used for resuming a previously started game. 
    POST: Used for creating a new game resource.
    PATCH: Called by player to play the game.
*/

const gameRouter = Router();
gameRouter
    .get("/:gameId/guesses", validate, getGameGuesses)
    .get("/:gameId/hints/", gameHintGetValidations, validate, getHint)
    .get("/:id", gameGetValidations, validate, getGame)
    .post("/", gamePostValidations, optionallizeJWT ,validate, postGame )
    .post("/:gameId/players", gamePlayerPostValidations, authenticateJWT, validate, postGamePlayer)
    .post(
            "/:gameId/guesses", 
            gameGuessPostValidations,
            optionallizeJWT,
            validate,
            gameGuessPostSanitzations,
            postGameGuess
        )

export default gameRouter;