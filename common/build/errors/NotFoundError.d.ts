import { CustomError } from "./CustomError";
export declare class NotFoundError extends CustomError {
    statusCode: number;
    message: string;
    constructor(message?: string);
    serializeErrors(): {
        message: string;
    }[];
}
