import { HTTP_STATUS } from '../../constants/index.js';
import { generateQRToken, verifyToken } from '../../infrastructure/JWT/index.js';
import QRService from '../../infrastructure/QR/index.js'
import Error from '../../utils/errors.js';
class QRController {
    async generateQR(req, res) {
        try {
            const token = generateQRToken({ ...req.deviceInfo, expiryTimes: '180s' })
            const qrDataUrl = await QRService.generateQR(JSON.stringify(token));
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: 'Generate QR success',
                success: true,
                token: token,
                url: qrDataUrl,
            })
        } catch (err) {
            res.status(500).send(`Lỗi: ${err.message}`);
        }
    }

    async getInfoQR(req, res) {
        try {
            const tokenQR = req.query.tokenQR
            if (!tokenQR) {
                return Error.sendNotFound(res, "No token qr provider")
            }
            const decode = verifyToken("access", tokenQR)

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: 'Get info QR success!',
                success: true,
                data: {
                    ...decode.payload
                }
            })
        } catch (error) {
            console.log("💲💲💲 ~ QRController ~ getInfoQR ~ error:", error)
        }
    }
}

export default new QRController()