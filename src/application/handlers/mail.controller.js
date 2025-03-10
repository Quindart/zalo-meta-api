import { sendMail } from "../middleware/mail.middleware.js";

class MailController {

    async sendMail(req, res) {
        try {
            await sendMail(req, res);
        } catch (error) {
            console.log(error);
        }
    }
}

export default new MailController();