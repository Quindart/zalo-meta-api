"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenMapper = void 0;
const class_transformer_1 = require("class-transformer");
const RefreshToken_entity_1 = require("../../../domain/entities/refreshToken/RefreshToken.entity");
const mongoose_1 = require("mongoose");
class RefreshTokenMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString(),
        };
        const token = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(RefreshToken_entity_1.RefreshTokenEntity, token, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(token) {
        var _a;
        return Object.assign(Object.assign({}, token), { _id: (_a = new mongoose_1.Types.ObjectId(token._id)) !== null && _a !== void 0 ? _a : undefined });
    }
}
exports.RefreshTokenMapper = RefreshTokenMapper;
