import { CustomError } from "./CustomError";

export class UnauthorizedRequest extends CustomError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedRequest.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [
      {
        message: "Unauthorized Request",
      },
    ];
  }
}
