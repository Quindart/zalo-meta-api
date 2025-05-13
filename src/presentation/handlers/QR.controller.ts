import { Response } from 'express';
import { HTTP_STATUS } from '../../constants/index';
import { generateAccessToken, generateQRToken, generateRefreshToken, verifyToken } from '../../infrastructure/JWT/index';
import RefreshToken from '../../infrastructure/mongo/model/RefreshToken';
import User from '../../infrastructure/mongo/model/User';
import QRService from '../../infrastructure/QR/index'
import Error from '../../utils/errors';
import dotenv from "dotenv"
import { RequestQR } from '../../types/request/RequestQR';

interface DecodedToken {
    payload?: Record<string, any>;
    id?: string
}


dotenv.config()
class QRController {
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
    async generateQR(req: RequestQR, res: Response): Promise<void> {
        try {
            const token = generateQRToken({ ...req.deviceInfo, expiryTimes: '180s' })
            const qrDataUrl = await QRService.generateQR(JSON.stringify(token));
            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: 'Generate QR success',
                success: true,
                token: token,
                url: qrDataUrl,
            })
        } catch (err) {
            Error.sendError(res, err)
        }
    }
    async getInfoQR(req: RequestQR, res: Response): Promise<void> {
        try {
            const tokenQR = req.query.tokenQR as string
            if (!tokenQR) {
                Error.sendNotFound(res, "No token qr provider")
            }

            const decode = verifyToken("access", tokenQR) as DecodedToken;

            res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: 'Get info QR success!',
                success: true,
                data: {
                    ...decode.payload
                }
            })
        } catch (error) {
            return Error.sendError(res, error)

        }
    }

    async loginQR(req: RequestQR, res: Response) {
        try {
            const { accessToken, isActive } = req.body
            if (isActive === false) {
                return Error.sendUnauthenticated(res)
            }
            const decode = verifyToken('access', accessToken).payload as DecodedToken
            const user = await User.findById(decode.id)
            const payload = {
                id: user._id,
                phone: user.phone,
                email: user.email,
                expiry_accesstoken: this.ACCESS_TOKEN_EXPIRY,
                expiry_refreshtoken: this.REFRESH_TOKEN_EXPIRY,
            };
            const newAccessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            await RefreshToken.create({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
            return res.status(HTTP_STATUS.CREATED).json({
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
        } catch (error) {
            Error.sendError(res, error)
        }
    }

}

export default new QRController()