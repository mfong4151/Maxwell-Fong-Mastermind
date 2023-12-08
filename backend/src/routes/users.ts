import { Router } from "express";
import { authenticateJWT, validate } from "../middleware";
import { getUsersGames, getUsers, getProfile} from "../controllers/users";

const userRouter = Router();
userRouter
    .get("/games", authenticateJWT, validate, getUsersGames) 
    .get("/", authenticateJWT, validate, getUsers)
    .get("/profiles", authenticateJWT, validate, getProfile) 
    
export default userRouter;  