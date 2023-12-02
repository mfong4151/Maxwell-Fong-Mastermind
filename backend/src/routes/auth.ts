import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
import { validate } from "../middleware";
import { login } from "../controllers/auth";

const authRouter = Router();
authRouter
    .post('/signup', validate, signUp)
    .post('/login', validate, login)

export default authRouter;