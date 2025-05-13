
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/index";
import blacklistConfig from "./blacklist";
import whitelistConfig from "./whitelist";

const blacklistMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const clientIP: string = req.ip;
    const route: string = req.path;

    if (blacklistConfig.isIPBlocked(clientIP)) {
        res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'IP address is blocked' });
        return;
    }

    if (blacklistConfig.isRouteBlocked(route)) {
        res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Route is blocked' });
        return;
    }

    next();
};

const whitelistMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const clientIP: string = req.ip;
    const route: string = req.path;

    if (!whitelistConfig.isIPAllowed(clientIP)) {
        res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'IP address is not allowed' });
        return;
    }

    if (!whitelistConfig.isRouteAllowed(route)) {
        res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Route is not allowed' });
        return;
    }

    next();
};

export { blacklistMiddleware, whitelistMiddleware };
