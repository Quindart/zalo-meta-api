"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPMapper = void 0;
const class_transformer_1 = require("class-transformer");
const OTP_entity_1 = require("../../../domain/entities/otp/OTP.entity");
const mongoose_1 = require("mongoose");
class OTPMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString()
        };
        const otp = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(OTP_entity_1.OTPEntity, otp, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(otp) {
        var _a;
        return Object.assign(Object.assign({}, otp), { _id: (_a = new mongoose_1.Types.ObjectId(otp._id)) !== null && _a !== void 0 ? _a : undefined });
    }
}
exports.OTPMapper = OTPMapper;
