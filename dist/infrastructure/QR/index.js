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
const qrcode_1 = __importDefault(require("qrcode"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class QRService {
    constructor() {
        this.QRCode = qrcode_1.default;
    }
    generateQR(inputString_1) {
        return __awaiter(this, arguments, void 0, function* (inputString, options = {}) {
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
            const opts = Object.assign(Object.assign({}, defaultOpts), options);
            try {
                const qrBuffer = yield this.QRCode.toBuffer(inputString, opts);
                const logoFullPath = path_1.default.join(__dirname, "../../../public", "QR_IMG.jpg");
                const qrImage = (0, sharp_1.default)(qrBuffer);
                const qrMetadata = yield qrImage.metadata();
                const logoSize = Math.round(qrMetadata.width * 0.3);
                const logoBuffer = yield (0, sharp_1.default)(logoFullPath)
                    .resize(logoSize, logoSize, { fit: "cover", background: "white" })
                    .toBuffer();
                const left = Math.round((qrMetadata.width - logoSize) / 2);
                const top = Math.round((qrMetadata.height - logoSize) / 2);
                const finalImage = yield qrImage
                    .composite([{ input: logoBuffer, left, top }])
                    .toBuffer();
                return `data:image/jpeg;base64,${finalImage.toString("base64")}`;
            }
            catch (err) {
                throw new Error(`Lỗi khi tạo mã QR: ${err.message}`);
            }
        });
    }
    renderQRToDOM(inputString_1, elementId_1) {
        return __awaiter(this, arguments, void 0, function* (inputString, elementId, options = {}) {
            if (typeof document === "undefined") {
                throw new Error("Phương thức này chỉ hoạt động trong trình duyệt.");
            }
            const url = yield this.generateQR(inputString, options);
            const img = document.getElementById(elementId);
            if (!img) {
                throw new Error(`Không tìm thấy phần tử với ID: ${elementId}`);
            }
            img.src = url;
        });
    }
}
exports.default = new QRService();
