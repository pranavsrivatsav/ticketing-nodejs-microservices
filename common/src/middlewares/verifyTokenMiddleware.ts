import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedRequest } from "../errors/UnAuthorizedRequest";
import SignInTokenPayload from "../types/SignInTokenPayload";

const verifyTokenMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  let user: SignInTokenPayload;

  try {
    const signInToken = req.session?.jwt;
    user = jwt.verify(signInToken, process.env.JWT_KEY!) as SignInTokenPayload;
  } catch (error) {
    throw new UnauthorizedRequest("Invalid token");
  }

  req.currentUser = user;
  next();
};

export default verifyTokenMiddleware;
