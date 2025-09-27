import { SignInTokenPayload } from "../types/SignInTokenPayload";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Ticket from "../models/Ticket";

function createTestHelpers() {
  global.validUserData = {
    email: "test@test.com",
    password: "12345true",
  };

  global.getLoginCookie = (userId?: string) => {
    const randomId = userId ?? new mongoose.Types.ObjectId().toHexString();

    //random sign in token payload
    const payload: SignInTokenPayload = {
      userId: randomId,
      email: "abcd@test.com",
    };

    //create sign in token
    const signInToken = jwt.sign(payload, process.env.JWT_KEY!);

    //create session object
    const sessionObj = {
      jwt: signInToken,
    };

    const sessionObjString = JSON.stringify(sessionObj);

    //encode session object to base 64
    const base64 = Buffer.from(sessionObjString).toString("base64");

    //return the cookie with the encoded session object
    return [`session=${base64}`];
  };

  global.createTicket = async (userId?: string) => {
    const randomString = () => crypto.randomBytes(4).toString("hex");
    const randomNumber = () => crypto.randomInt(1000);
    const newTicket = Ticket.buildTicket({
      title: randomString(),
      price: randomNumber(),
      userId: userId ?? randomString(),
    });

    await newTicket.save();

    return newTicket;
  };
}

export { createTestHelpers };
