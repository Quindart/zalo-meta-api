
export interface IMessageType {
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
}
