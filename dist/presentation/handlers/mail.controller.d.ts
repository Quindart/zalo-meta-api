import { Request, Response } from "express";
declare class MailController {
    sendMail(req: Request, res: Response): Promise<void>;
    verifyOTP(req: Request, res: Response): Promise<void>;
}
declare const _default: MailController;
export default _default;
