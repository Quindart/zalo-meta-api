// const config = require('../../config');
// import { NextFunction, Request, Response } from "express";
// import { HTTP_STATUS } from '../../constants/index.js';
// import blacklistConfig from "../../config/blacklist.ts";

// const ipFilter = (req: Request, res: Response, next: NextFunction) => {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     if (blacklistConfig.includes(ip)) {
//         return res.status(HTTP_STATUS.FORBIDDEN).send('Forbidden');
//     }
//     if (!whitelist.includes(ip)) {
//         return res.status(HTTP_STATUS.UNAUTHORIZED).send('Unauthorized');
//     }
//     next();
// };

// module.exports = ipFilter;