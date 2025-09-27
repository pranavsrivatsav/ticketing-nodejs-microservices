import { CustomError } from "./CustomError";
export declare class UnauthorizedRequest extends CustomError {
    message: string;
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
