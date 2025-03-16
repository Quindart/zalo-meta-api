import { sendMail, verifyOTP } from "../middleware/mail.middleware.js";

class MailController {

    async sendMail(req, res) {
        try {
            await sendMail(req, res);
        } catch (error) {
            console.log(error);
        }
    }

    async verifyOTP(req, res) {
        try {
            await verifyOTP(req, res);
        } catch (error) {
            console.log(error);
        }
    }
}

export default new MailController();