"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../constants/index");
class ErrorHandler {
    sendError(res, error) {
        res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
    sendWarning(res, msg) {
        res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            status: index_1.HTTP_STATUS.BAD_REQUEST,
            message: msg,
        });
    }
    sendUnauthenticated(res) {
        res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            status: index_1.HTTP_STATUS.UNAUTHORIZED,
            message: "Unauthenticated",
        });
    }
    sendNotFound(res, msg) {
        res.status(index_1.HTTP_STATUS.NOT_FOUND).json({
            success: false,
            status: index_1.HTTP_STATUS.NOT_FOUND,
            message: msg,
        });
    }
    sendConflict(res, msg) {
        res.status(index_1.HTTP_STATUS.CONFLICT).json({
            success: false,
            status: index_1.HTTP_STATUS.CONFLICT,
            message: msg,
        });
    }
}
exports.default = new ErrorHandler();
