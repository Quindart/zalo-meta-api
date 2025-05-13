"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendMail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const OTP_1 = __importDefault(require("../../infrastructure/mongo/model/OTP"));
const index_1 = require("../../constants/index");
const mail_1 = __importDefault(require("../../config/mail"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: mail_1.default.EMAIL_USERNAME,
        pass: mail_1.default.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    headers: {
        'X-Laziness-level': 1000,
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
    }
});
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
const generateMailHTML = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://yourdomain.com/logo.png" alt="Logo" style="max-width: 150px;">
    </div>
    <h2 style="color: #333;">Xin chào,</h2>
    <p>Để hoàn tất quá trình, vui lòng sử dụng mã xác thực sau:</p>
    <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
      ${otp}
    </div>
    <p>Mã này sẽ hết hạn sau 5 phút.</p>
    <p>Nếu bạn không tạo yêu cầu này, vui lòng bỏ qua email.</p>
    <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
      <p>Email này được gửi tự động, vui lòng không trả lời. Nếu cần hỗ trợ, hãy liên hệ <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
      <p>Địa chỉ công ty: Số 123, Đường ABC, Thành phố XYZ</p>
    </div>
  </div>
`;
const sendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const otp = generateOTP();
    try {
        yield OTP_1.default.findOneAndUpdate({ email }, { $set: { otp, isVerified: false } }, { upsert: true });
        const mailOptions = {
            from: mail_1.default.EMAIL_USERNAME,
            to: email,
            subject: 'Reset password',
            html: generateMailHTML(otp)
        };
        yield transporter.sendMail(mailOptions);
        return res.status(index_1.HTTP_STATUS.OK).json({ message: 'Email sent' });
    }
    catch (error) {
        console.error('SendMail Error:', error);
        return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send email' });
    }
});
exports.sendMail = sendMail;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const otpData = yield OTP_1.default.findOne({ email });
        if (!otpData) {
            return res.status(index_1.HTTP_STATUS.NOT_FOUND).json({ message: 'OTP not found' });
        }
        if (otpData.isVerified) {
            return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({ message: 'OTP has already been verified' });
        }
        if (otpData.otp !== otp) {
            return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid OTP' });
        }
        yield OTP_1.default.updateOne({ email }, { $set: { isVerified: true } });
        return res.status(index_1.HTTP_STATUS.OK).json({ message: 'OTP verified' });
    }
    catch (error) {
        console.error('VerifyOTP Error:', error);
        return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to verify OTP' });
    }
});
exports.verifyOTP = verifyOTP;
