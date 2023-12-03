import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
import { validate } from "../middleware";
import { login } from "../controllers/auth";
import { authValidations } from "../validations/auth";

const authRouter = Router();
authRouter
    .post('/signup', authValidations, validate, signUp)
    .post('/login', authValidations, validate, login)

export default authRouter;