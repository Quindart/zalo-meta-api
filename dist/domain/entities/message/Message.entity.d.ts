import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IMessageType } from "./Message.type";
export declare class MessageEntity extends BaseEntity<IMessageType & IBaseEntityType> {
    senderId: string;
    content: string;
    status: string;
    messageType: 'text' | 'image' | 'imageGroup' | 'video' | 'file' | 'audio' | 'emoji' | 'system' | 'other';
    channelId?: string;
    emojis?: string[];
    imagesGroup?: string[];
    fileId?: string;
    systemMessageId?: string;
    createdAt?: Date;
    timestamp?: Date;
    isDeletedById?: string[];
    constructor(data?: Partial<IMessageType>);
}
