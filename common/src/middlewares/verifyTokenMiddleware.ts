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
    // Check if this is an internal service-to-service call
    const internalApiKey = req.headers["x-internal-api-key"] as string;

    if (internalApiKey) {
      console.log(
        "[verifyTokenMiddleware] Internal API key present:",
        internalApiKey
      );
      // Verify internal API key
      const expectedApiKey = process.env.INTERNAL_API_KEY;
      console.log("[verifyTokenMiddleware] Expected API key:", expectedApiKey);

      if (!expectedApiKey || internalApiKey !== expectedApiKey) {
        console.log("[verifyTokenMiddleware] Invalid internal API key.");
        throw new UnauthorizedRequest("Invalid internal API key");
      }

      // Get JWT token from header (Authorization header or x-jwt-token)
      const authHeader = req.headers.authorization;
      const signInToken =
        (authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.substring(7)
          : authHeader) || (req.headers["x-jwt-token"] as string);

      console.log(
        "[verifyTokenMiddleware] JWT in headers, Authorization header:",
        authHeader
      );
      console.log(
        "[verifyTokenMiddleware] JWT in headers, x-jwt-token:",
        req.headers["x-jwt-token"]
      );
      console.log("[verifyTokenMiddleware] Chosen signInToken:", signInToken);

      if (!signInToken) {
        console.log(
          "[verifyTokenMiddleware] JWT token not provided in header."
        );
        throw new UnauthorizedRequest("JWT token not provided in header");
      }

      user = jwt.verify(
        signInToken,
        process.env.JWT_KEY!
      ) as SignInTokenPayload;
      console.log(
        "[verifyTokenMiddleware] Successfully verified internal API key flow JWT for userId:",
        user.userId
      );
    } else {
      // Normal cookie-based authentication
      const signInToken = req.session?.jwt;
      if (!signInToken) {
        throw new UnauthorizedRequest("JWT token not found in session");
      }
      user = jwt.verify(
        signInToken,
        process.env.JWT_KEY!
      ) as SignInTokenPayload;
    }
  } catch (error) {
    if (error instanceof UnauthorizedRequest) {
      throw error;
    }
    console.log(
      "[verifyTokenMiddleware] General error in JWT verification:",
      error
    );
    throw new UnauthorizedRequest("Invalid token");
  }

  req.currentUser = user;
  next();
};

export default verifyTokenMiddleware;
