import { NextFunction, Response } from "express";
import { RequestMessage } from "../../types/request/RequestMessage";
export declare const verifyMessage: (req: RequestMessage, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
