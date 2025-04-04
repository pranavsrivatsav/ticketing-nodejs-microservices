export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];
  constructor(message: string) {
    super(message); //calls the Error constructor with the message string

    Object.setPrototypeOf(this, CustomError.prototype); //Fix prototype chain
    // - if this is not done any class extending from this abstract class will not identify itself as an instance of this class
    // - basically instanceOf CustomError would return false
  }
}
