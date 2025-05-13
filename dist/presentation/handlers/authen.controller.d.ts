import { Request, Response } from 'express';
declare class AuthenController {
    protected ACCESS_TOKEN_SECRET: string;
    protected REFRESH_TOKEN_SECRET: string;
    protected ACCESS_TOKEN_EXPIRY: string;
    protected REFRESH_TOKEN_EXPIRY: string;
    constructor();
    registerFcmToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response>;
    register(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyForgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthenController;
export default _default;
