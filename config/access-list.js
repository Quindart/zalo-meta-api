import blacklistConfig from "./blacklist";
import whitelistConfig from "./whitelist";

const blacklistMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    const route = req.path;

    if (blacklistConfig.isIPBlocked(clientIP)) {
        return res.status(403).json({ error: 'IP address is blocked' });
    }

    if (blacklistConfig.isRouteBlocked(route)) {
        return res.status(403).json({ error: 'Route is blocked' });
    }

    next();
};

const whitelistMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    const route = req.path;

    if (!whitelistConfig.isIPAllowed(clientIP)) {
        return res.status(403).json({ error: 'IP address is not allowed' });
    }


    if (!whitelistConfig.isRouteAllowed(route)) {
        return res.status(403).json({ error: 'Route is not allowed' });
    }

    next();
};

module.exports = {
    blacklistMiddleware,
    whitelistMiddleware
};