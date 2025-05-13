"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMMapper = void 0;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const FCM_entity_1 = require("../../../domain/entities/fcm/FCM.entity");
class FCMMapper {
    toDomain(doc) {
        var _a;
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString(),
            user: (_a = doc.user) === null || _a === void 0 ? void 0 : _a.map(us => us.toString()),
        };
        const fcm = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(FCM_entity_1.FCMEntity, fcm, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(fcm) {
        var _a;
        return Object.assign(Object.assign({}, fcm), { _id: (_a = new mongoose_1.Types.ObjectId(fcm._id.toString())) !== null && _a !== void 0 ? _a : undefined, user: fcm.user.map((u) => { var _a; return (_a = new mongoose_1.Types.ObjectId(u.toString())) !== null && _a !== void 0 ? _a : undefined; }) });
    }
}
exports.FCMMapper = FCMMapper;
