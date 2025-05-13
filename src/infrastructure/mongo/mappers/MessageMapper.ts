import { plainToInstance } from "class-transformer";
import { Types } from "mongoose";
import { MessageDocument } from "../model/Message";
import { MessageEntity } from "../../../domain/entities/message/Message.entity";
import { IMessageType } from "../../../domain/entities/message/Message.type";

export class MessageMapper {
    static MessageMapper(doc: MessageDocument): MessageDocument | PromiseLike<MessageDocument> {
        throw new Error('Method not implemented.');
    }
    toDomain(doc: MessageDocument): MessageEntity {
        if (!doc) return null;

        const docConvert: Partial<IMessageType> = {
            _id: doc._id.toString(),
            emojis: doc.emojis.map(emoji => emoji.toString()),
            channelId: doc.channelId.toString(),
            fileId: doc.fileId.toString(),
            systemMessageId: doc.systemMessageId.toString(),
            isDeletedById: doc.isDeletedById.map(id => id.toString()),
            senderId: doc.senderId.toString(),
            imagesGroup: doc.imagesGroup.map(img => img.toString())

        }
        const message = { ...doc.toObject() as Record<string, any>, ...docConvert };
        return plainToInstance(MessageEntity, message, { excludeExtraneousValues: true })
    }

    toPersistence(message: MessageEntity): any {
        return {
            ...message,
            _id: new Types.ObjectId(message._id) ?? undefined,
            emojis: message.emojis.map(emoji => new Types.ObjectId(emoji) ?? undefined),
            channelId: new Types.ObjectId(message.channelId) ?? undefined,
            fileId: new Types.ObjectId(message.fileId) ?? undefined,
            systemMessageId: new Types.ObjectId(message.systemMessageId) ?? undefined,
            isDeletedById: message.isDeletedById.map(id => new Types.ObjectId(id) ?? undefined),
            senderId: new Types.ObjectId(message.senderId) ?? undefined,
            imagesGroup: message.imagesGroup.map(img => new Types.ObjectId(img) ?? undefined)
        }
    }
}