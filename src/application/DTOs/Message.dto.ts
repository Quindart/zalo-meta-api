import { Expose, Type } from "class-transformer";

export class MessageDTO {
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
}