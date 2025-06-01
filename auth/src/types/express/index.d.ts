import { UserDoc } from "../../models/User";

declare module "express" {
  interface Request {
    currentUser?: UserDoc;
  }
}
