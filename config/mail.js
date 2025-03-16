import dotenv from "dotenv";
dotenv.config();

class ConfigureMail {
    constructor() {
        this.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
        this.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    }
}

export default new ConfigureMail();