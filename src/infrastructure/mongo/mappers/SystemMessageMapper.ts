import { plainToInstance } from "class-transformer";
import { SystemMessageEntity } from "../../../domain/entities/systemMessage/SystemMessage.entity";
import { SystemMessageDocument } from "../model/SystemMessage";
import { Types } from "mongoose";

export class SystemMessageMapper {
    toDomain(doc: SystemMessageDocument): SystemMessageEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString(),
            messageId: doc.messageId.toString()
        }
        const message = { ...doc.toObject() as Record<string, any>, ...docConvert }
        return plainToInstance(SystemMessageEntity, message, {
            excludeExtraneousValues
                : true
        })
    }
    toPersistence(message: SystemMessageEntity) {
        return {
            ...message,
            _id: new Types.ObjectId(message._id) ?? undefined,
            messageId: new Types.ObjectId(message.messageId) ?? undefined
        }
    }
}