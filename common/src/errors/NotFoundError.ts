import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  message: string;

  constructor(message: string = "API Not found") {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
