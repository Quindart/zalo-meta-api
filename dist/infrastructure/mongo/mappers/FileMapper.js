"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMapper = void 0;
const class_transformer_1 = require("class-transformer");
const File_entity_1 = require("../../../domain/entities/file/File.entity");
const mongoose_1 = require("mongoose");
class FileMapper {
    toDomain(doc) {
        if (!doc)
            return null;
        const docConvert = {
            _id: doc._id.toString()
        };
        const file = Object.assign(Object.assign({}, doc.toObject()), docConvert);
        return (0, class_transformer_1.plainToInstance)(File_entity_1.FileEntity, file, {
            excludeExtraneousValues: true
        });
    }
    toPersistence(file) {
        var _a;
        return Object.assign(Object.assign({}, file), { _id: (_a = new mongoose_1.Types.ObjectId(file._id)) !== null && _a !== void 0 ? _a : undefined });
    }
}
exports.FileMapper = FileMapper;
