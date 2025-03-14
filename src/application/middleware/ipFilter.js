const config = require('../../config');
import { HTTP_STATUS } from '../../constants/index.js';

const ipFilter = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (config.blacklist.includes(ip)) {
        return res.status(HTTP_STATUS.FORBIDDEN).send('Forbidden');
    }
    if (!config.whitelist.includes(ip)) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send('Unauthorized');
    }
    next();
};

module.exports = ipFilter;