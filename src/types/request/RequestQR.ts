import { Request } from 'express';
export interface RequestQR extends Request {
    deviceInfo?: any;
    
}