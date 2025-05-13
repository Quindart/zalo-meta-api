"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ConfigureMail {
    constructor() {
        this.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
        this.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    }
}
exports.default = new ConfigureMail();
