import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedRequest } from "../errors/UnAuthorizedRequest";
import User from "../models/User";
import SignInTokenPayload from "../types/SignInTokenPayload";

const verifyTokenMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  let tokenPayload: SignInTokenPayload;

  try {
    const signInToken = req.session?.jwt;
    tokenPayload = jwt.verify(signInToken, process.env.JWT_KEY!) as SignInTokenPayload;
  } catch (error) {
    throw new UnauthorizedRequest("Invalid token");
  }

  const user = await User.findById(tokenPayload.userId);

  if (!user) throw new UnauthorizedRequest("Invalid token");

  req.currentUser = user;
  next();
};

export default verifyTokenMiddleware;
