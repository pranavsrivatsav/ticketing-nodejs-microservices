import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  static defaultReason = "API Not found";
  constructor() {
    super(NotFoundError.defaultReason);
    Object.setPrototypeOf(this, NotFoundError);
  }

  serializeErrors() {
    return [{ message: NotFoundError.defaultReason }];
  }
}
