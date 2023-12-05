import { Router } from "express";
import { authenticateJWT, validate } from "../middleware";
import { getUsersGames, getUsers, getProfile} from "../controllers/users";

const userRouter = Router();
userRouter
    .get('/games', authenticateJWT, validate, getUsersGames) //Used for current games feature
    .get('/', authenticateJWT, validate, getUsers)
    .get('/profiles', authenticateJWT, validate, getProfile) 
    // .get('/gameHistory', authenticateJWT, validate) //do a groupBy gameId on the GameGuess table 
    
export default userRouter;  