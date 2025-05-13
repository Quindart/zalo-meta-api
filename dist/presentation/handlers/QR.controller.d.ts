import { Response } from 'express';
import { RequestQR } from '../../types/request/RequestQR';
declare class QRController {
    protected ACCESS_TOKEN_SECRET: string;
    protected REFRESH_TOKEN_SECRET: string;
    protected ACCESS_TOKEN_EXPIRY: string;
    protected REFRESH_TOKEN_EXPIRY: string;
    constructor();
    generateQR(req: RequestQR, res: Response): Promise<void>;
    getInfoQR(req: RequestQR, res: Response): Promise<void>;
    loginQR(req: RequestQR, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
declare const _default: QRController;
export default _default;
