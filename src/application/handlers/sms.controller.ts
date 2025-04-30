import { Request, Response } from "express";

class SmsController {
    protected smsService: any
    constructor(smsService: any) {
        this.smsService = smsService;
    }

    async sendSms(req: Request, res: Response) {
        const { to, message } = req.body;
        const response = await this.smsService.sendSms(to, message);
        res.json(response);
    }
}