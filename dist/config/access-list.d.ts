import { Request, Response, NextFunction } from "express";
declare const blacklistMiddleware: (req: Request, res: Response, next: NextFunction) => void;
declare const whitelistMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export { blacklistMiddleware, whitelistMiddleware };
