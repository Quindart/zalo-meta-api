import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any,
            deviceInfo?: any
            uploadedImages?: any
            files?: any
            isMyMessage?: any
        }
    }
}
