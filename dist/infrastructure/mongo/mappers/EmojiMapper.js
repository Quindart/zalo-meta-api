"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiMapper = void 0;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const Emoji_entity_1 = require("../../../domain/entities/emoji/Emoji.entity");
class EmojiMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString(),
            messageId: doc.messageId.toString(),
            userId: doc.userId.toString()
        };
        const emoji = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(Emoji_entity_1.EmojiEntity, emoji, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(emoji) {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, emoji), { _id: (_a = new mongoose_1.Types.ObjectId(emoji._id)) !== null && _a !== void 0 ? _a : undefined, messageId: (_b = new mongoose_1.Types.ObjectId(emoji.messageId)) !== null && _b !== void 0 ? _b : undefined, userId: (_c = new mongoose_1.Types.ObjectId(emoji.userId)) !== null && _c !== void 0 ? _c : undefined });
    }
}
exports.EmojiMapper = EmojiMapper;
