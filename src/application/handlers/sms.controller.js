class SmsController {
    constructor(smsService) {
        this.smsService = smsService;
    }

    async sendSms(req, res) {
        const { to, message } = req.body;
        const response = await this.smsService.sendSms(to, message);
        res.json(response);
    }
}