import express, { Request, Response } from "express";
import { register, signin, signout } from "../controllers/authController";
import { body } from "express-validator";
import signUpValidator from "../middlewares/signUpValidator";

const router = express.Router();

// Register route
router.post("/register", signUpValidator, register);

// Sign in route
router.post("/signin", signin);

// Sign out route
router.post("/signout", signout);

export { router as authRouter };
