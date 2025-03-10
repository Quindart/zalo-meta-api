import mailConfig from '../../../config/mail.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailConfig.EMAIL_USERNAME,
        pass: mailConfig.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    from: `App Zalo <${mailConfig.EMAIL_USERNAME}>`,
    headers: {
        'X-Laziness-level': 1000,
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
    }
});

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const sendMail = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();

    const mailOptions = {
        from: mailConfig.EMAIL_USERNAME,
        to: email,
        subject: 'Reset password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://yourdomain.com/logo.png" alt="Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #333;">Xin chào,</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực sau:</p>
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
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to send email' });
        }

        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Email sent' });
    });
};