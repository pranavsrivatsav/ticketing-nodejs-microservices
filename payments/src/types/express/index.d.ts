import SignInTokenPayload from "../SignInTokenPayload";

/**
 * There is a difference in how properties are added to global as opposed to the express' Request interface.
 * This is because ts knows exactly the properties available in the interface, because it is something already declared
 * using @types/express.
 */
declare module "express" {
  interface Request {
    currentUser?: SignInTokenPayload;
  }
}
