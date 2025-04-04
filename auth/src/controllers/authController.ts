import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/RequestValidationError";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError";

// Register a new user
export const register = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }

  res
    .status(201)
    .send({ success: true, message: "User registered successfully" });
};

// Sign in existing user
export const signin = async (req: Request, res: Response) => {
  throw new DatabaseConnectionError();
};

// Sign out current user
export const signout = async (req: Request, res: Response) => {
  res
    .status(200)
    .send({ success: true, message: "User signed out successfully" });
};
