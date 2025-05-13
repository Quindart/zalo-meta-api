import { MessageEntity } from "./Message.entity";
export declare class MessageBuilder {
    private messageData;
    withSenderId(senderId: string): MessageBuilder;
    withContent(content: string): MessageBuilder;
    withStatus(status: string): MessageBuilder;
    withMessageType(messageType: 'text' | 'image' | 'imageGroup' | 'video' | 'file' | 'audio' | 'emoji' | 'system' | 'other'): MessageBuilder;
    withChannelId(channelId: string): MessageBuilder;
    withEmojis(emojis: string[]): MessageBuilder;
    withImagesGroup(imagesGroup: string[]): MessageBuilder;
    withFileId(fileId: string): MessageBuilder;
    withSystemMessageId(systemMessageId: string): MessageBuilder;
    withCreatedAt(createdAt: Date): MessageBuilder;
    withTimestamp(timestamp: Date): MessageBuilder;
    withIsDeletedById(isDeletedById: string[]): MessageBuilder;
    build(): MessageEntity;
}
