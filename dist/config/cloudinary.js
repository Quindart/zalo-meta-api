"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_IMAGE_NAME,
    api_key: process.env.CLOUD_IMAGE_API_KEY,
    api_secret: process.env.CLOUD_IMAGE_API_SECRET
});
exports.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'zalo-meta-storage',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
    },
});
