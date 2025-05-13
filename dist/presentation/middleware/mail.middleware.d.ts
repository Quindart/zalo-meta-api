import { Request, Response } from 'express';
export declare const sendMail: (req: Request, res: Response) => Promise<Response>;
export declare const verifyOTP: (req: Request, res: Response) => Promise<Response>;
