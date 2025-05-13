import { FileEntity } from "../../../domain/entities/file/File.entity";
import { FileDocument } from "../model/File";
import { Types } from "mongoose";
export declare class FileMapper {
    toDomain(doc: FileDocument): FileEntity;
    toPersistence(file: FileEntity): {
        _id: Types.ObjectId;
        deleteAt?: Date;
        filename: string;
        path: string;
        size?: string;
        thread?: string;
        extension?: string;
    };
}
