import { NextFunction, Response } from "express";
import { RequestQR } from "../../types/request/RequestQR";
export declare const detectDevice: (req: RequestQR, res: Response, next: NextFunction) => Promise<void>;
