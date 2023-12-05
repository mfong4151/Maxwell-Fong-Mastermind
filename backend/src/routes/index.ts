import { Router } from "express";
import gameRouter from "./games";
import authRouter from "./auth";
import userRouter from "./users";
import { logger } from "../middleware";

const v1Router: Router = Router();
v1Router
    .use('/auth', authRouter)
    .use('/games', gameRouter)
    .use('/users', userRouter)

const apiRouter: Router = Router();
apiRouter
    .use('/v1', logger ,v1Router)

export default apiRouter;