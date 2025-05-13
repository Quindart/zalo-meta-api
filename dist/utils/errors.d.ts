import { Response } from "express";
declare class ErrorHandler {
    sendError(res: Response, error: any): void;
    sendWarning(res: Response, msg: any): void;
    sendUnauthenticated(res: Response): void;
    sendNotFound(res: Response, msg: string): void;
    sendConflict(res: Response, msg: string): void;
}
declare const _default: ErrorHandler;
export default _default;
