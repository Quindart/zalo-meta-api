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
const index_1 = require("../../constants/index");
const index_2 = require("../../infrastructure/JWT/index");
const RefreshToken_1 = __importDefault(require("../../infrastructure/mongo/model/RefreshToken"));
const User_1 = __importDefault(require("../../infrastructure/mongo/model/User"));
const index_3 = __importDefault(require("../../infrastructure/QR/index"));
const errors_1 = __importDefault(require("../../utils/errors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class QRController {
    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;
        this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
        this.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '1d';
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    }
    generateQR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, index_2.generateQRToken)(Object.assign(Object.assign({}, req.deviceInfo), { expiryTimes: '180s' }));
                const qrDataUrl = yield index_3.default.generateQR(JSON.stringify(token));
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    message: 'Generate QR success',
                    success: true,
                    token: token,
                    url: qrDataUrl,
                });
            }
            catch (err) {
                errors_1.default.sendError(res, err);
            }
        });
    }
    getInfoQR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenQR = req.query.tokenQR;
                if (!tokenQR) {
                    errors_1.default.sendNotFound(res, "No token qr provider");
                }
                const decode = (0, index_2.verifyToken)("access", tokenQR);
                res.status(index_1.HTTP_STATUS.OK).json({
                    status: index_1.HTTP_STATUS.OK,
                    message: 'Get info QR success!',
                    success: true,
                    data: Object.assign({}, decode.payload)
                });
            }
            catch (error) {
                return errors_1.default.sendError(res, error);
            }
        });
    }
    loginQR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, isActive } = req.body;
                if (isActive === false) {
                    return errors_1.default.sendUnauthenticated(res);
                }
                const decode = (0, index_2.verifyToken)('access', accessToken).payload;
                const user = yield User_1.default.findById(decode.id);
                const payload = {
                    id: user._id,
                    phone: user.phone,
                    email: user.email,
                    expiry_accesstoken: this.ACCESS_TOKEN_EXPIRY,
                    expiry_refreshtoken: this.REFRESH_TOKEN_EXPIRY,
                };
                const newAccessToken = (0, index_2.generateAccessToken)(payload);
                const refreshToken = (0, index_2.generateRefreshToken)(payload);
                yield RefreshToken_1.default.create({
                    token: refreshToken,
                    userId: user._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                return res.status(index_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: 'Đăng nhập QR thành công',
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
                            accessToken: newAccessToken,
                            refreshToken,
                            expiresIn: this.ACCESS_TOKEN_EXPIRY
                        }
                    }
                });
            }
            catch (error) {
                errors_1.default.sendError(res, error);
            }
        });
    }
}
exports.default = new QRController();
