import { Router } from "express";
import { validate } from "../middleware";
import { postGame } from "../controllers/games";

const gameRouter: Router = Router();
gameRouter
    .post('/', validate, postGame )
    .get('/:id', validate)
    .patch('/:id', validate)

export default gameRouter;