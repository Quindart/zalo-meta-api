import { plainToInstance } from "class-transformer";
import { EmojiDocument } from "../model/Emoji";
import { Types } from "mongoose";
import { EmojiEntity } from "../../../domain/entities/emoji/Emoji.entity";

export class EmojiMapper {
    toDomain(doc: EmojiDocument): EmojiEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString(),
            messageId: doc.messageId.toString(),
            userId: doc.userId.toString()
        }
        const emoji = { ...doc.toObject() as Record<string, any>, ...docConvert }
        return plainToInstance(EmojiEntity, emoji, {
            excludeExtraneousValues: true
        })
    }

    toPersistence(emoji: EmojiEntity) {
        return {
            ...emoji,
            _id: new Types.ObjectId(emoji._id) ?? undefined,
            messageId: new Types.ObjectId(emoji.messageId) ?? undefined,
            userId: new Types.ObjectId(emoji.userId) ?? undefined
        }
    }
}