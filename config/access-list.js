// access-list.js
import blacklistConfig from "./blacklist.js";
import whitelistConfig from "./whitelist.js";
import { HTTP_STATUS } from "../src/constants/index.js";

const blacklistMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    const route = req.path;

    if (blacklistConfig.isIPBlocked(clientIP)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'IP address is blocked' });
    }

    if (blacklistConfig.isRouteBlocked(route)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Route is blocked' });
    }

    next();
};

const whitelistMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    const route = req.path;

    if (!whitelistConfig.isIPAllowed(clientIP)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'IP address is not allowed' });
    }

    if (!whitelistConfig.isRouteAllowed(route)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Route is not allowed' });
    }

    next();
};

export { blacklistMiddleware, whitelistMiddleware };