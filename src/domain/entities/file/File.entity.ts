import { BaseEntity, IBaseEntityType } from "../BaseEntity.ts";
import { Expose } from "class-transformer";
import { IFileEntity } from "./File.type.ts";


export class FileEntity extends BaseEntity<IFileEntity & IBaseEntityType> {
    @Expose() deleteAt?: Date;
    @Expose() filename: string;
    @Expose() path: string;
    @Expose() size?: string;
    @Expose() thread?: string;
    @Expose() extension?: string;

    constructor(data: Partial<IFileEntity> = {}) {
        super(data)
        this.deleteAt = data.deleteAt;
        this.filename = data.filename || '';
        this.path = data.path || '';
        this.size = data.size;
        this.thread = data.thread;
        this.extension = data.extension;
    }
}
