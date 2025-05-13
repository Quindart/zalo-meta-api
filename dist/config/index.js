"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ConfigureApp {
    constructor() {
        this.port = process.env.PORT || 5000;
        this.clientURL = process.env.CLIENT_URL || "http://localhost:3000";
        const userName = process.env.CLOUD_DB_USERNAME;
        const password = process.env.CLOUD_DB_PASSWORD;
        this.mongo = {
            userName,
            password,
            url: `mongodb+srv://${userName}:${password}@cluster0.shu3wma.mongodb.net/?retryWrites=true&w=majority`,
        };
        this.cloudinary = {
            cloud_name: process.env.CLOUD_IMAGE_NAME,
            api_key: process.env.CLOUD_IMAGE_API_KEY,
            api_secret: process.env.CLOUD_IMAGE_API_SECRET,
        };
        this.services = {
            zalo: {
                version: process.env.ZALO_APP_VERSION,
                name: process.env.ZALO_APP_NAME,
            },
        };
    }
}
exports.default = new ConfigureApp();
