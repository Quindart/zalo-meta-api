import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { Expose } from "class-transformer";
import { IFileType } from "./File.type";


export class FileEntity extends BaseEntity<IFileType & IBaseEntityType> {
    @Expose() deleteAt?: Date;
    @Expose() filename: string;
    @Expose() path: string;
    @Expose() size?: string;
    @Expose() thread?: string;
    @Expose() extension?: string;

    constructor(data: Partial<IFileType> = {}) {
        super(data)
        this.deleteAt = data.deleteAt;
        this.filename = data.filename || '';
        this.path = data.path || '';
        this.size = data.size;
        this.thread = data.thread;
        this.extension = data.extension;
    }
}
