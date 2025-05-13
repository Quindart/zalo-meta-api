import { EmojiDocument } from "../model/Emoji";
import { Types } from "mongoose";
import { EmojiEntity } from "../../../domain/entities/emoji/Emoji.entity";
export declare class EmojiMapper {
    toDomain(doc: EmojiDocument): EmojiEntity;
    toPersistence(emoji: EmojiEntity): {
        _id: Types.ObjectId;
        messageId: Types.ObjectId;
        userId: Types.ObjectId;
        emoji: string;
        quantity: number;
        deleteAt?: Date | string;
        createAt?: Date | string;
        updateAt?: Date | string;
    };
}
