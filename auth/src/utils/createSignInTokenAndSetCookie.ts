import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserDoc } from "../models/User";
import SignInTokenPayload from "../types/SignInTokenPayload";

export default function createSignInTokenAndSetCookie(user: UserDoc, req: Request) {
  const payload: SignInTokenPayload = {
    userId: user.id,
    email: user.email,
  };
  //create sign in token
  const signInToken = jwt.sign(payload, process.env.JWT_KEY!);

  req.session = {
    jwt: signInToken,
  };
}
