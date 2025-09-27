import { NextFunction, Request, Response } from "express";
declare const verifyTokenMiddleware: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export default verifyTokenMiddleware;
