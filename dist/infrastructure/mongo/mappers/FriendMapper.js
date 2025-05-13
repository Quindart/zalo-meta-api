"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendMapper = void 0;
const class_transformer_1 = require("class-transformer");
const Friend_entity_1 = require("../../../domain/entities/friend/Friend.entity");
const mongoose_1 = require("mongoose");
class FriendMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString(),
            user: doc.user.toString(),
            friend: doc.friend.toString()
        };
        const friend = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(Friend_entity_1.FriendEntity, friend, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(friend) {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, friend), { _id: (_a = new mongoose_1.Types.ObjectId(friend._id)) !== null && _a !== void 0 ? _a : undefined, user: (_b = new mongoose_1.Types.ObjectId(friend.user)) !== null && _b !== void 0 ? _b : undefined, friend: (_c = new mongoose_1.Types.ObjectId(friend.friend)) !== null && _c !== void 0 ? _c : undefined });
    }
}
exports.FriendMapper = FriendMapper;
