"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const mail_controller_1 = __importDefault(require("../handlers/mail.controller"));
const router = express_1.default.Router();
router.post(Routes_1.default.MAIL_SEND, (req, res) => mail_controller_1.default.sendMail(req, res));
router.post(Routes_1.default.MAIL_VERIFY, (req, res) => mail_controller_1.default.verifyOTP(req, res));
exports.default = router;
