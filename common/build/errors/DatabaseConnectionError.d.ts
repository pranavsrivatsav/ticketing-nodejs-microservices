import { CustomError } from "./CustomError";
export declare class DatabaseConnectionError extends CustomError {
    reason: string;
    statusCode: number;
    constructor(reason?: string);
    serializeErrors(): {
        message: string;
    }[];
}
