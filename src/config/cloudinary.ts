import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

interface ExtendedParams {
    folder: string;
    allowed_formats: string[];
    transformation: object[];
}

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_IMAGE_NAME,
    api_key: process.env.CLOUD_IMAGE_API_KEY,
    api_secret: process.env.CLOUD_IMAGE_API_SECRET
});


export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'zalo-meta-storage',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
    } as ExtendedParams,
});
