import dotenv from "dotenv";
dotenv.config();

class ConfigureMail {
    public EMAIL_USERNAME: string;
    public EMAIL_PASSWORD: string;
    constructor() {
        this.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
        this.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    }
}

export default new ConfigureMail();