import multer from 'multer'
import { storage } from '../../config/cloudinary';
import { NextFunction, Request, Response } from 'express';
const upload = multer({
    storage: storage
});

export const imageUpload = (req: any, res: Response, next: NextFunction) => {

    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
        return next();
    }


    const multerAny = upload.any();
    multerAny(req, res, (err: any) => {
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
                } else {
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
