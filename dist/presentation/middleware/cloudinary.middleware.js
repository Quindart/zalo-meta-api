"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../../config/cloudinary");
const upload = (0, multer_1.default)({
    storage: cloudinary_1.storage
});
const imageUpload = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
        return next();
    }
    const multerAny = upload.any();
    multerAny(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Có lỗi xảy ra khi upload ảnh'
            });
        }
        req.uploadedImages = {};
        if (Array.isArray(req.files) && req.files.length > 0) {
            req.files.forEach(file => {
                const fieldName = file.fieldname;
                const imageInfo = {
                    url: file.path,
                    publicId: file.filename,
                    originalName: file.originalname,
                    format: file.mimetype.replace('image/', '')
                };
                if (!req.uploadedImages[fieldName]) {
                    req.uploadedImages[fieldName] = imageInfo;
                }
                else {
                    if (!Array.isArray(req.uploadedImages[fieldName])) {
                        req.uploadedImages[fieldName] = [req.uploadedImages[fieldName]];
                    }
                    req.uploadedImages[fieldName].push(imageInfo);
                }
            });
            next();
        }
        else
            next();
    });
};
exports.imageUpload = imageUpload;
