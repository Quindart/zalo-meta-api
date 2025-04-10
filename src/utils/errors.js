import { HTTP_STATUS } from "../constants/index.js";

class ErrorHandler {
  sendError(res, error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }

  sendWarning(res, msg) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: msg,
    });
  }

  sendUnauthenticated(res) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Unauthenticated",
    });
  }

  sendNotFound(res, msg) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: msg,
    });
  }

  sendConflict(res, msg) {
    res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      status: HTTP_STATUS.CONFLICT,
      message: msg,
    });
  }
}

export default new ErrorHandler();
