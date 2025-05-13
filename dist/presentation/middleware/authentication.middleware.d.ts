import { NextFunction, Response } from 'express';
import { RequestUser } from '../../types/request/RequestUser';
export declare const authenticateToken: (req: RequestUser, res: Response, next: NextFunction) => void;
export declare const authorizeAdmin: (req: RequestUser, res: Response, next: NextFunction) => void;
