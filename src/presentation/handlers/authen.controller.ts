import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


import User from '../../infrastructure/mongo/model/User.ts';
import RefreshToken from '../../infrastructure/mongo/model/RefreshToken.ts';
import { HTTP_STATUS } from '../../constants/index.ts';
import { sendMail } from '../middleware/mail.middleware.ts';
import OTP from '../../infrastructure/mongo/model/OTP.ts';
import Error from '../../utils/errors.ts'
import { generateAccessToken, generateRefreshToken } from '../../infrastructure/JWT/index.ts';
import FCM from '../../infrastructure/mongo/model/FCM.ts';

class AuthenController {

    protected ACCESS_TOKEN_SECRET: string;
    protected REFRESH_TOKEN_SECRET: string;
    protected ACCESS_TOKEN_EXPIRY: string;
    protected REFRESH_TOKEN_EXPIRY: string;

    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
        this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
        this.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '1d';
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    }
    
    async registerFcmToken(req: Request, res: Response) {
        try {
            const { fcmToken, userId } = req.body;

            if (!fcmToken) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'FCM token là bắt buộc'
                });
            }
            const existingFcm = await FCM.findOne({ fcmToken: fcmToken }).select({ _id: 1, user: 1 });
            console.log("check existingFcm: ", existingFcm);
            if (!existingFcm) {
                const fcm = await FCM.create({
                    user: userId,
                    fcmToken: fcmToken
                })
                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: 'FCM token đã được cập nhật thành công',
                    data: fcm.fcmToken
                });
            }
            else {
                const existUser = existingFcm.user.find((user) => user.toString() === userId);
                if (!existUser) {
                    existingFcm.user.push(userId);
                    await existingFcm.save();
                }
            }

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'FCM token đã được cập nhật thành công',
                data: existingFcm.fcmToken
            });
        } catch (error) {
            console.error('Error in registerFcmToken:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });

        }
    }
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { phone, password } = req.body;
            if (!phone || !password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'phone và password là bắt buộc'
                });
            }
            const user = await User.findOne({ phone });

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Thông tin đăng nhập không chính xác'
                });
            }

            const isPasswordValids = await bcrypt.compare(password, user.password);

            if (!isPasswordValids) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    status: HTTP_STATUS.UNAUTHORIZED,
                    success: false,
                    message: 'Invalid login credentials'
                });
            }

            const payload = {
                id: user._id,
                phone: user.phone,
                email: user.email,
                expiry_accesstoken: this.ACCESS_TOKEN_EXPIRY,
                expiry_refreshtoken: this.REFRESH_TOKEN_EXPIRY,
            };

            // Tạo tokens
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            // Lưu refresh token vào database
            await RefreshToken.create({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
            });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: {
                        id: user._id,
                        phone: user.phone,
                        avatar: user.avatar,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        gender: user.gender
                    },
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: this.ACCESS_TOKEN_EXPIRY
                    }
                }
            });
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    async register(req: Request, res: Response) {
        try {
            const {
                email,
                password,
                phone,
                firstName,
                lastName,
                dateOfBirth,
            } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const oldUser = await User.findOne({ phone: phone }).select({ _id: 1 }).lean()
            if (oldUser) {
                return Error.sendConflict(res, "Phone number already exist!")
            }
            const user = await User.create({
                email,
                password: hashedPassword,
                phone,
                firstName,
                lastName,
                dateOfBirth,
                isTwoFactorAuthenticationEnabled: true,
            });

            if (!user) {
                return Error.sendConflict(res, "Email or Phone number already exist")
            }

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Register successfully !!",
                user,
            });

        } catch (error) {
            Error.sendError(res, error);
        }
    }
    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Refresh token là bắt buộc'
                });
            }

            const existingToken = await RefreshToken.findOne({
                token: refreshToken
            });

            if (!existingToken) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    refreshToken: existingToken,
                    message: 'Refresh token không hợp lệ hoặc đã hết hạn'
                });
            }

            // Kiểm tra xem token đã hết hạn chưa
            if (existingToken.expiresAt < new Date()) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: 'Refresh token đã hết hạn'
                });
            }

            // Xác thực refresh token
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
                let user: any;
                if (typeof decoded !== 'string' && 'id' in decoded)
                    user = await User.findById(decoded.id)

                if (!user) {
                    await RefreshToken.deleteOne({ _id: existingToken._id });
                    return res.status(HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: 'Người dùng không tồn tại'
                    });
                }

                const payload = {
                    id: user._id,
                    phone: user.phone,
                    email: user.email,
                    expiry_accesstoken: this.ACCESS_TOKEN_EXPIRY,
                    expiry_refreshtoken: this.REFRESH_TOKEN_EXPIRY,
                };

                const newAccessToken = generateAccessToken(payload);

                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Tạo access token mới thành công',
                    data: {
                        accessToken: newAccessToken,
                        expiresIn: this.ACCESS_TOKEN_EXPIRY
                    }
                });
            } catch (error) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: 'Refresh token không hợp lệ'
                });
            }
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Refresh token là bắt buộc'
                });
            }

            // Xóa refresh token khỏi database
            await RefreshToken.deleteOne({ token: refreshToken });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { phone, password, newPassword } = req.body;

            if (!phone || !password || !newPassword) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'phone, password và newPassword là bắt buộc'
                });
            }

            const user = await User.findOne({ phone });

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            const isPasswordValids = await bcrypt.compare(password, user.password);

            if (!isPasswordValids) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Mật khẩu cũ không chính xác'
                });
            }

            // Hash mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Cập nhật mật khẩu mới
            await User.updateOne({ phone }, { password: hashedPassword });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            console.error('Reset password error:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'phone là bắt buộc'
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            // Gửi mã OTP
            try {
                await sendMail(req, res);
                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Mã OTP đã được gửi',
                });
            } catch (error) {
                console.log(error);
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to send email'
                });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async verifyForgotPassword(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'email và otp là bắt buộc'
                });
            }

            const otpData = await OTP.findOne({ email });

            if (!otpData) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'OTP not found'
                });
            }

            if (otpData.otp !== otp) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Invalid OTP'
                });
            }

            if (otpData.isVerified) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'OTP has already been verified'
                });
            }

            // Tạo payload mới cho access token
            const payload = {
                email: email,
                expiry_accesstoken: this.ACCESS_TOKEN_EXPIRY,
                expiry_refreshtoken: this.REFRESH_TOKEN_EXPIRY,
            };

            // Tạo reset token
            const resetToken = generateRefreshToken(payload);

            // Lưu refresh token vào database
            await RefreshToken.create({
                token: resetToken,
                userId: email,
                expiresAt: Date.now() + 30 * 60 * 1000 // 30 phút
            });

            await OTP
                .findOneAndUpdate({ email }, { $set: { isVerified: true } })
                .then(() => {
                    return res.status(HTTP_STATUS.OK).json({
                        success: true,
                        message: 'OTP verified',
                        reset_token: resetToken,
                    });
                })
                .catch(error => {
                    console.log(error);
                    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to verify OTP'
                    });
                });
        } catch (error) {
            console.error('Verify forgot password error:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email, password, resetToken } = req.body;

            if (!email || !password || !resetToken) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'email, password và resetToken là bắt buộc'
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            const existingToken = await RefreshToken.findOne({
                token: resetToken
            });

            if (!existingToken) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: 'Reset token không hợp lệ hoặc đã hết hạn'
                });
            }

            // Kiểm tra xem token đã hết hạn chưa
            if (existingToken.expiresAt < new Date()) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: 'Reset token đã hết hạn'
                });
            }

            // Hash mật khẩu mới
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cập nhật mật khẩu mới
            await User.updateOne({ email }, { password: hashedPassword });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            console.error('Reset password error:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

}

export default new AuthenController();




























