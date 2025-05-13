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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User_1 = __importDefault(require("../../infrastructure/mongo/model/User"));
const RefreshToken_1 = __importDefault(require("../../infrastructure/mongo/model/RefreshToken"));
const index_1 = require("../../constants/index");
const mail_middleware_1 = require("../middleware/mail.middleware");
const OTP_1 = __importDefault(require("../../infrastructure/mongo/model/OTP"));
const errors_1 = __importDefault(require("../../utils/errors"));
const index_2 = require("../../infrastructure/JWT/index");
const FCM_1 = __importDefault(require("../../infrastructure/mongo/model/FCM"));
class AuthenController {
    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
        this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
        this.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '1d';
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    }
    registerFcmToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fcmToken, userId } = req.body;
                if (!fcmToken) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'FCM token là bắt buộc'
                    });
                }
                const existingFcm = yield FCM_1.default.findOne({ fcmToken: fcmToken }).select({ _id: 1, user: 1 }).populate('user');
                console.log("check existingFcm: ", existingFcm);
                if (!existingFcm) {
                    const fcm = yield FCM_1.default.create({
                        user: userId,
                        fcmToken: fcmToken
                    });
                    return res.status(index_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: 'FCM token đã được cập nhật thành công',
                        data: fcm.fcmToken
                    });
                }
                else {
                    const existUser = Array.isArray(existingFcm.user) && existingFcm.user.find((user) => user.toString() === userId);
                    if (!existUser) {
                        existingFcm.user.push(userId);
                        yield existingFcm.save();
                    }
                }
                return res.status(index_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'FCM token đã được cập nhật thành công',
                    data: existingFcm.fcmToken
                });
            }
            catch (error) {
                console.error('Error in registerFcmToken:', error);
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, password } = req.body;
                if (!phone || !password) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'phone và password là bắt buộc'
                    });
                }
                const user = yield User_1.default.findOne({ phone });
                if (!user) {
                    return res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: 'Thông tin đăng nhập không chính xác'
                    });
                }
                const isPasswordValids = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValids) {
                    return res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                        status: index_1.HTTP_STATUS.UNAUTHORIZED,
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
                const accessToken = (0, index_2.generateAccessToken)(payload);
                const refreshToken = (0, index_2.generateRefreshToken)(payload);
                // Lưu refresh token vào database
                yield RefreshToken_1.default.create({
                    token: refreshToken,
                    userId: user._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
                });
                return res.status(index_1.HTTP_STATUS.OK).json({
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
            }
            catch (error) {
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, phone, firstName, lastName, dateOfBirth, } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const oldUser = yield User_1.default.findOne({ phone: phone }).select({ _id: 1 }).lean();
                if (oldUser) {
                    return errors_1.default.sendConflict(res, "Phone number already exist!");
                }
                const user = yield User_1.default.create({
                    email,
                    password: hashedPassword,
                    phone,
                    firstName,
                    lastName,
                    dateOfBirth,
                    isTwoFactorAuthenticationEnabled: true,
                });
                if (!user) {
                    return errors_1.default.sendConflict(res, "Email or Phone number already exist");
                }
                return res.status(index_1.HTTP_STATUS.CREATED).json({
                    status: index_1.HTTP_STATUS.CREATED,
                    success: true,
                    message: "Register successfully !!",
                    user,
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                console.log("💲💲💲 ~ AuthenController ~ refreshToken ~ refreshToken:", refreshToken);
                if (!refreshToken) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'Refresh token là bắt buộc'
                    });
                }
                const existingToken = yield RefreshToken_1.default.findOne({
                    token: refreshToken
                });
                console.log("💲💲💲 ~ AuthenController ~ refreshToken ~ existingToken:", existingToken);
                // if (!existingToken) {
                //     return res.status(HTTP_STATUS.FORBIDDEN).json({
                //         success: false,
                //         refreshToken: existingToken,
                //         message: 'Refresh token không hợp lệ hoặc đã hết hạn'
                //     });
                // }
                console.log("💲💲💲 ~ AuthenController ~ refreshToken ~ existingToken.expiresAt < new Date():", existingToken.expiresAt < new Date());
                // Kiểm tra xem token đã hết hạn chưa
                if (existingToken.expiresAt < new Date()) {
                    return res.status(index_1.HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: 'Refresh token đã hết hạn'
                    });
                }
                // Xác thực refresh token
                try {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
                    let user;
                    if (typeof decoded !== 'string' && 'id' in decoded)
                        user = yield User_1.default.findById(decoded.id);
                    if (!user) {
                        yield RefreshToken_1.default.deleteOne({ _id: existingToken._id });
                        return res.status(index_1.HTTP_STATUS.FORBIDDEN).json({
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
                    const newAccessToken = (0, index_2.generateAccessToken)(payload);
                    return res.status(index_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: 'Tạo access token mới thành công',
                        data: {
                            accessToken: newAccessToken,
                            expiresIn: this.ACCESS_TOKEN_EXPIRY
                        }
                    });
                }
                catch (error) {
                    console.log("💲💲💲 ~ AuthenController ~ refreshToken ~ error:", error);
                    return res.status(index_1.HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: 'Refresh token không hợp lệ'
                    });
                }
            }
            catch (error) {
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'Refresh token là bắt buộc'
                    });
                }
                // Xóa refresh token khỏi database
                yield RefreshToken_1.default.deleteOne({ token: refreshToken });
                return res.status(index_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Đăng xuất thành công'
                });
            }
            catch (error) {
                console.error('Logout error:', error);
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, password, newPassword } = req.body;
                if (!phone || !password || !newPassword) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'phone, password và newPassword là bắt buộc'
                    });
                }
                const user = yield User_1.default.findOne({ phone });
                if (!user) {
                    return res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: 'Người dùng không tồn tại'
                    });
                }
                const isPasswordValids = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValids) {
                    return res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: 'Mật khẩu cũ không chính xác'
                    });
                }
                // Hash mật khẩu mới
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                // Cập nhật mật khẩu mới
                yield User_1.default.updateOne({ phone }, { password: hashedPassword });
                return res.status(index_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Đổi mật khẩu thành công'
                });
            }
            catch (error) {
                console.error('Reset password error:', error);
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'phone là bắt buộc'
                    });
                }
                const user = yield User_1.default.findOne({ email });
                if (!user) {
                    return res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: 'Người dùng không tồn tại'
                    });
                }
                // Gửi mã OTP
                try {
                    yield (0, mail_middleware_1.sendMail)(req, res);
                    return res.status(index_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: 'Mã OTP đã được gửi',
                    });
                }
                catch (error) {
                    console.log(error);
                    return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to send email'
                    });
                }
            }
            catch (error) {
                console.error('Forgot password error:', error);
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    verifyForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'email và otp là bắt buộc'
                    });
                }
                const otpData = yield OTP_1.default.findOne({ email });
                if (!otpData) {
                    return res.status(index_1.HTTP_STATUS.NOT_FOUND).json({
                        success: false,
                        message: 'OTP not found'
                    });
                }
                if (otpData.otp !== otp) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'Invalid OTP'
                    });
                }
                if (otpData.isVerified) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
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
                const resetToken = (0, index_2.generateRefreshToken)(payload);
                // Lưu refresh token vào database
                yield RefreshToken_1.default.create({
                    token: resetToken,
                    userId: email,
                    expiresAt: Date.now() + 30 * 60 * 1000 // 30 phút
                });
                yield OTP_1.default
                    .findOneAndUpdate({ email }, { $set: { isVerified: true } })
                    .then(() => {
                    return res.status(index_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: 'OTP verified',
                        reset_token: resetToken,
                    });
                })
                    .catch(error => {
                    console.log(error);
                    return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to verify OTP'
                    });
                });
            }
            catch (error) {
                console.error('Verify forgot password error:', error);
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, resetToken } = req.body;
                if (!email || !password || !resetToken) {
                    return res.status(index_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'email, password và resetToken là bắt buộc'
                    });
                }
                const user = yield User_1.default.findOne({ email });
                if (!user) {
                    return res.status(index_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: 'Người dùng không tồn tại'
                    });
                }
                const existingToken = yield RefreshToken_1.default.findOne({
                    token: resetToken
                });
                if (!existingToken) {
                    return res.status(index_1.HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: 'Reset token không hợp lệ hoặc đã hết hạn'
                    });
                }
                // Kiểm tra xem token đã hết hạn chưa
                if (existingToken.expiresAt < new Date()) {
                    return res.status(index_1.HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: 'Reset token đã hết hạn'
                    });
                }
                // Hash mật khẩu mới
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Cập nhật mật khẩu mới
                yield User_1.default.updateOne({ email }, { password: hashedPassword });
                return res.status(index_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Đổi mật khẩu thành công'
                });
            }
            catch (error) {
                console.error('Reset password error:', error);
                return res.status(index_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Lỗi server',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    }
}
exports.default = new AuthenController();
