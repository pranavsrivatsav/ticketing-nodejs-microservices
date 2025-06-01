import express from "express";
import { currentUser, register, signin, signout } from "../controllers/authController";
import signUpValidator from "../middlewares/signUpValidator";
import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware";

const router = express.Router();

// Register route
router.post("/register", signUpValidator, register);

// Sign in route
router.post("/signin", signUpValidator, signin);

// Current user route
router.get("/current-user", verifyTokenMiddleware, currentUser);

// Sign out route
router.post("/signout", verifyTokenMiddleware, signout);

export { router as authRouter };
