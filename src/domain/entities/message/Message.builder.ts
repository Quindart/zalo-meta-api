import { MessageEntity } from "./Message.entity";
import { IMessageType } from "./Message.type";
export class MessageBuilder {
    private messageData: Partial<IMessageType> = {};

    public withSenderId(senderId: string): MessageBuilder {
        this.messageData.senderId = senderId;
        return this;
    }

    public withContent(content: string): MessageBuilder {
        this.messageData.content = content;
        return this;
    }

    public withStatus(status: string): MessageBuilder {
        this.messageData.status = status;
        return this;
    }

    public withMessageType(messageType: 'text' | 'image' | 'imageGroup' | 'video' | 'file' | 'audio' | 'emoji' | 'system' | 'other'): MessageBuilder {
        this.messageData.messageType = messageType;
        return this;
    }

    public withChannelId(channelId: string): MessageBuilder {
        this.messageData.channelId = channelId;
        return this;
    }

    public withEmojis(emojis: string[]): MessageBuilder {
        this.messageData.emojis = emojis;
        return this;
    }

    public withImagesGroup(imagesGroup: string[]): MessageBuilder {
        this.messageData.imagesGroup = imagesGroup;
        return this;
    }

    public withFileId(fileId: string): MessageBuilder {
        this.messageData.fileId = fileId;
        return this;
    }

    public withSystemMessageId(systemMessageId: string): MessageBuilder {
        this.messageData.systemMessageId = systemMessageId;
        return this;
    }

    public withCreatedAt(createdAt: Date): MessageBuilder {
        this.messageData.createdAt = createdAt;
        return this;
    }

    public withTimestamp(timestamp: Date): MessageBuilder {
        this.messageData.timestamp = timestamp;
        return this;
    }

    public withIsDeletedById(isDeletedById: string[]): MessageBuilder {
        this.messageData.isDeletedById = isDeletedById;
        return this;
    }

    public build(): MessageEntity {
        return new MessageEntity(this.messageData);
    }
}
