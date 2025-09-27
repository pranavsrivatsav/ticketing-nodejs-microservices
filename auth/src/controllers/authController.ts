import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "@psctickets/common/errors";
import { registerUser, signInUser } from "../services/authServices";
import createSignInTokenAndSetCookie from "../utils/createSignInTokenAndSetCookie";

// Register a new user
export const register = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }

  const newUser = await registerUser(req.body);

  createSignInTokenAndSetCookie(newUser, req);

  res.status(201).send({
    user: newUser,
    status: "Success",
    message: "User registered successfully",
  });
};

// Sign in existing user
export const signin = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }

  const user = await signInUser(req.body);

  createSignInTokenAndSetCookie(user, req);

  res.status(200).send({
    user,
    status: "Success",
    message: "User signed in successfully",
  });
};

//get the current user details - based on token info
export const currentUser = async (req: Request, res: Response) => {
  console.log("inside current user");
  res.status(200).send(req.currentUser);
};

// Sign out current user
export const signout = async (req: Request, res: Response) => {
  req.session = null;
  res.status(200).send({ message: "User signed out successfully" });
};
