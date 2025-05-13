import { Response } from "express";
import { HTTP_STATUS } from "../constants/index";

class ErrorHandler {
  sendError(res: Response, error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }

  sendWarning(res: Response, msg: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: msg,
    });
  }

  sendUnauthenticated(res: Response) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Unauthenticated",
    });
  }

  sendNotFound(res: Response, msg: string) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: msg,
    });
  }

  sendConflict(res: Response, msg: string) {
    res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      status: HTTP_STATUS.CONFLICT,
      message: msg,
    });
  }
}

export default new ErrorHandler();
