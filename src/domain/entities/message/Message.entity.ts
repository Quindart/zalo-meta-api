import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IMessageType } from "./Message.type";

export class MessageEntity extends BaseEntity<IMessageType & IBaseEntityType> {
    @Expose() senderId: string;
    @Expose() content: string;
    @Expose() status: string;
    @Expose() messageType: 'text' | 'image' | 'imageGroup' | 'video' | 'file' | 'audio' | 'emoji' | 'system' | 'other';
    @Expose() channelId?: string;
    @Expose() emojis?: string[];
    @Expose() imagesGroup?: string[];
    @Expose() fileId?: string;
    @Expose() systemMessageId?: string;
    @Expose() createdAt?: Date;
    @Expose() timestamp?: Date;
    @Expose() isDeletedById?: string[];

    constructor(data: Partial<IMessageType> = {}) {
        super(data);
        this.senderId = data.senderId || '';
        this.content = data.content || '';
        this.status = data.status || '';
        this.messageType = data.messageType || 'text';
        this.channelId = data.channelId;
        this.emojis = data.emojis || [];
        this.imagesGroup = data.imagesGroup || [];
        this.fileId = data.fileId;
        this.systemMessageId = data.systemMessageId;
        this.createdAt = data.createdAt || new Date();
        this.timestamp = data.timestamp || new Date();
        this.isDeletedById = data.isDeletedById || [];
    }

}
