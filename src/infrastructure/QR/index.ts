import QRCode from "qrcode";
import sharp from "sharp";
import path from "path";
import { config } from "dotenv";



config();

class QRService {
    public QRCode: any;
    constructor() {
        this.QRCode = QRCode;
    }

    async generateQR(inputString: string, options = {}) {
        if (!inputString || typeof inputString !== "string") {
            throw new Error("Chuỗi đầu vào không hợp lệ.");
        }
        const defaultOpts = {
            errorCorrectionLevel: "H",
            type: "image/png",
            quality: 1,
            margin: 1,
            width: 300,
            scale: 8,
            color: {
                dark: "#333",
                light: "#fff",
            },
        };
        const opts = { ...defaultOpts, ...options };

        try {
            const qrBuffer = await this.QRCode.toBuffer(inputString, opts);
            const logoFullPath = path.join(__dirname, "../../../public", "QR_IMG.jpg");
            const qrImage = sharp(qrBuffer);
            const qrMetadata = await qrImage.metadata();
            const logoSize = Math.round(qrMetadata.width * 0.3);
            const logoBuffer = await sharp(logoFullPath)
                .resize(logoSize, logoSize, { fit: "cover", background: "white" })
                .toBuffer();
            const left = Math.round((qrMetadata.width - logoSize) / 2);
            const top = Math.round((qrMetadata.height - logoSize) / 2);
            const finalImage = await qrImage
                .composite([{ input: logoBuffer, left, top }])
                .toBuffer();
            return `data:image/jpeg;base64,${finalImage.toString("base64")}`;
        } catch (err) {
            throw new Error(`Lỗi khi tạo mã QR: ${err.message}`);
        }
    }

    async renderQRToDOM(inputString: string, elementId: string, options = {}) {
        if (typeof document === "undefined") {
            throw new Error("Phương thức này chỉ hoạt động trong trình duyệt.");
        }
        const url = await this.generateQR(inputString, options);
        const img: any = document.getElementById(elementId);
        if (!img) {
            throw new Error(`Không tìm thấy phần tử với ID: ${elementId}`);
        }
        img.src = url;
    }
}

export default new QRService();