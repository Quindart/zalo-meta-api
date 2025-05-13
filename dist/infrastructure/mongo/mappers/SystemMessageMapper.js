"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMessageMapper = void 0;
const class_transformer_1 = require("class-transformer");
const SystemMessage_entity_1 = require("../../../domain/entities/systemMessage/SystemMessage.entity");
const mongoose_1 = require("mongoose");
class SystemMessageMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString(),
            messageId: doc.messageId.toString()
        };
        const message = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(SystemMessage_entity_1.SystemMessageEntity, message, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(message) {
        var _a, _b;
        return Object.assign(Object.assign({}, message), { _id: (_a = new mongoose_1.Types.ObjectId(message._id)) !== null && _a !== void 0 ? _a : undefined, messageId: (_b = new mongoose_1.Types.ObjectId(message.messageId)) !== null && _b !== void 0 ? _b : undefined });
    }
}
exports.SystemMessageMapper = SystemMessageMapper;
