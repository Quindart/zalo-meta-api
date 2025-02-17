const config = require('../../config');

const ipFilter = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (config.blacklist.includes(ip)) {
        return res.status(403).send('Forbidden');
    }
    if (!config.whitelist.includes(ip)) {
        return res.status(401).send('Unauthorized');
    }
    next();
};

module.exports = ipFilter;