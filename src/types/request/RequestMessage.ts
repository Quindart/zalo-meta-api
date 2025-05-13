import { Request } from 'express';
export interface RequestMessage extends Request {
    user?: any,
    isMyMessage?: any | boolean
}