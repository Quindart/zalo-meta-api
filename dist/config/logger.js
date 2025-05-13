"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonInstance = void 0;
const winston_1 = require("winston");
exports.winstonInstance = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)),
    transports: [new winston_1.transports.Console()],
});
