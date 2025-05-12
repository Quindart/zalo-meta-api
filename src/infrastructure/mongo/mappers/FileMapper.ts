import { plainToInstance } from "class-transformer";
import { FileEntity } from "../../../domain/entities/file/File.entity";
import { FileDocument } from "../model/File";
import { Types } from "mongoose";

export class FileMapper {
    toDomain(doc: FileDocument): FileEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString()
        }
        const file = { ...doc.toObject() as Record<string, any>, ...docConvert }
        return plainToInstance(FileEntity, file, {
            excludeExtraneousValues: true
        })
    }

    toPersistence(file: FileEntity) {
        return {
            ...file,
            _id: new Types.ObjectId(file._id) ?? undefined
        }
    }
}