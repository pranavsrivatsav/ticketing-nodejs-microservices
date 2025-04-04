import { CustomError } from "./CustomError";

const defaultReason = "Error connecting to database";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor(public reason: string = "") {
    reason = reason || defaultReason;
    super(reason);
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
