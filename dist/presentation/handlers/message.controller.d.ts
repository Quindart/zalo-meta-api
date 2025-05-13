import { Request, Response } from 'express';
declare class MessageController {
    getMessages(req: Request, res: Response): Promise<void>;
    getMessageById(req: Request, res: Response): Promise<void>;
}
declare const _default: MessageController;
export default _default;
