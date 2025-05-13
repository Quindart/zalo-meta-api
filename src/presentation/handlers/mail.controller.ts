import { Request, Response } from "express";
import { sendMail, verifyOTP } from "../middleware/mail.middleware";

class MailController {
    async sendMail(req: Request, res: Response): Promise<void> {
        try {
            await sendMail(req, res);
        } catch (error) {
            console.log(error);
        }
    }

    async verifyOTP(req: Request, res: Response): Promise<void> {
        try {
            await verifyOTP(req, res);
        } catch (error) {
            console.log(error);
        }
    }
}

export default new MailController();