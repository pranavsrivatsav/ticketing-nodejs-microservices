import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("errorMiddleware hit");

  if (err instanceof CustomError) {
    res.status(err.statusCode).send(err.serializeErrors());
  }

  res.status(500).send({
    status: "Failure",
    message: [{ message: err.message }],
  });
};
