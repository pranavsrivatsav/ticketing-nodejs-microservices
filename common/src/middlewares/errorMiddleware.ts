import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send(err.serializeErrors());
    return;
  }

  res.status(500).send({
    status: "Failure",
    message: [{ message: err.message }],
  });
};

export default errorMiddleware;
