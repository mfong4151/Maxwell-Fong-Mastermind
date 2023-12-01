import { Router } from "express";
import gameRouter from "./games";

const v1Router: Router = Router();
v1Router
    .use('/games', gameRouter)

const apiRouter: Router = Router();
apiRouter
    .use('/v1', v1Router)

export default apiRouter;