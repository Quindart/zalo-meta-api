import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../infrastructure/mongo/model/User.js';
import RefreshToken from '../../infrastructure/mongo/model/RefreshToken.js';
import { generateAccessToken } from '../middleware/authentication.middleware.js';
import { generateRefreshToken } from '../middleware/authentication.middleware.js';

dotenv.config();


class AuthenController {
    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
        this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
        this.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '1m';
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    }

    async login(req, res) {
        try {
            const { phone, password } = req.body;

            if (!phone || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'phone và password là bắt buộc'
                });
            }

            const user = await User.findOne({ phone });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Thông tin đăng nhập không chính xác'
                });
            }

            const isPasswordValids = await bcrypt.compare(password, user.password);

            if (!isPasswordValids) {
                return res.status(401).json({
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

            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: {
                        id: user._id,
                        phone: user.phone,
                        email: user.email,
                    },
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: this.ACCESS_TOKEN_EXPIRY
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token là bắt buộc'
                });
            }

            const existingToken = await RefreshToken.findOne({
                token: refreshToken
            });

            if (!existingToken) {
                return res.status(403).json({
                    success: false,
                    refreshToken: existingToken,
                    message: 'Refresh token không hợp lệ hoặc đã hết hạn'
                });
            }

            // Kiểm tra xem token đã hết hạn chưa
            if (existingToken.expiresAt < new Date()) {
                return res.status(403).json({
                    success: false,
                    message: 'Refresh token đã hết hạn'
                });
            }

            // Xác thực refresh token
            try {
                const decoded = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET);

                // Lấy thông tin user từ decoded token
                const user = await User.findById(decoded.id);

                if (!user) {
                    // Xóa token nếu không tìm thấy user
                    await RefreshToken.deleteOne({ _id: existingToken._id });

                    return res.status(403).json({
                        success: false,
                        message: 'Người dùng không tồn tại'
                    });
                }

                // Tạo payload mới cho access token
                const payload = {
                    id: user._id,
                    phone: user.phone,
                    email: user.email,
                    expiry_accesstoken: this.ACCESS_TOKEN_EXPIRY,
                    expiry_refreshtoken: this.REFRESH_TOKEN_EXPIRY,
                };

                // Tạo access token mới
                const newAccessToken = generateAccessToken(payload);

                // Trả về access token mới
                return res.status(200).json({
                    success: true,
                    message: 'Tạo access token mới thành công',
                    data: {
                        accessToken: newAccessToken,
                        expiresIn: this.ACCESS_TOKEN_EXPIRY
                    }
                });
            } catch (error) {
                // Token không hợp lệ
                return res.status(403).json({
                    success: false,
                    message: 'Refresh token không hợp lệ'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token là bắt buộc'
                });
            }

            // Xóa refresh token khỏi database
            await RefreshToken.deleteOne({ token: refreshToken });

            return res.status(200).json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new AuthenController();




























