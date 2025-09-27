import { NextFunction, Request, Response } from "express";
import { isValidMongoObjectId } from "../utils/HelperFunctions";
import { BadRequestError } from "@psctickets/common/errors";

export function validateOrderIdParam(req: Request, res: Response, next: NextFunction) {
  const orderId = req.params.orderId;

  if (!isValidMongoObjectId(orderId)) throw new BadRequestError("Invalid Request");

  next();
}
