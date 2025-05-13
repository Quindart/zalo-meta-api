import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';


import OTP from '../../infrastructure/mongo/model/OTP';
import { HTTP_STATUS } from '../../constants/index';
import mailConfig from '../../config/mail';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailConfig.EMAIL_USERNAME,
    pass: mailConfig.EMAIL_PASSWORD
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
} as any);

const generateOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

const generateMailHTML = (otp: number): string => `
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

export const sendMail = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    await OTP.findOneAndUpdate({ email }, { $set: { otp, isVerified: false } }, { upsert: true });

    const mailOptions = {
      from: mailConfig.EMAIL_USERNAME,
      to: email,
      subject: 'Reset password',
      html: generateMailHTML(otp)
    };

    await transporter.sendMail(mailOptions);
    return res.status(HTTP_STATUS.OK).json({ message: 'Email sent' });
  } catch (error) {
    console.error('SendMail Error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send email' });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp } = req.body;

  try {
    const otpData = await OTP.findOne({ email });

    if (!otpData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'OTP not found' });
    }

    if (otpData.isVerified) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'OTP has already been verified' });
    }

    if (otpData.otp !== otp) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid OTP' });
    }

    await OTP.updateOne({ email }, { $set: { isVerified: true } });
    return res.status(HTTP_STATUS.OK).json({ message: 'OTP verified' });
  } catch (error) {
    console.error('VerifyOTP Error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to verify OTP' });
  }
};
