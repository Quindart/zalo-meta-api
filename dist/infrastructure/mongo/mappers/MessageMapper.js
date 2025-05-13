"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMapper = void 0;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const Message_entity_1 = require("../../../domain/entities/message/Message.entity");
class MessageMapper {
    static MessageMapper(doc) {
        throw new Error('Method not implemented.');
    }
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString(),
            emojis: doc.emojis.map(emoji => emoji.toString()),
            channelId: doc.channelId.toString(),
            fileId: doc.fileId.toString(),
            systemMessageId: doc.systemMessageId.toString(),
            isDeletedById: doc.isDeletedById.map(id => id.toString()),
            senderId: doc.senderId.toString(),
            imagesGroup: doc.imagesGroup.map(img => img.toString())
        };
        const message = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(Message_entity_1.MessageEntity, message, { excludeExtraneousValues: true });
    }
    toPersistence(message) {
        var _a, _b, _c, _d, _e;
        return Object.assign(Object.assign({}, message), { _id: (_a = new mongoose_1.Types.ObjectId(message._id)) !== null && _a !== void 0 ? _a : undefined, emojis: message.emojis.map(emoji => { var _a; return (_a = new mongoose_1.Types.ObjectId(emoji)) !== null && _a !== void 0 ? _a : undefined; }), channelId: (_b = new mongoose_1.Types.ObjectId(message.channelId)) !== null && _b !== void 0 ? _b : undefined, fileId: (_c = new mongoose_1.Types.ObjectId(message.fileId)) !== null && _c !== void 0 ? _c : undefined, systemMessageId: (_d = new mongoose_1.Types.ObjectId(message.systemMessageId)) !== null && _d !== void 0 ? _d : undefined, isDeletedById: message.isDeletedById.map(id => { var _a; return (_a = new mongoose_1.Types.ObjectId(id)) !== null && _a !== void 0 ? _a : undefined; }), senderId: (_e = new mongoose_1.Types.ObjectId(message.senderId)) !== null && _e !== void 0 ? _e : undefined, imagesGroup: message.imagesGroup.map(img => { var _a; return (_a = new mongoose_1.Types.ObjectId(img)) !== null && _a !== void 0 ? _a : undefined; }) });
    }
}
exports.MessageMapper = MessageMapper;
