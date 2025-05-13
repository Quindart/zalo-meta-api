import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IFileType } from "./File.type";
export declare class FileEntity extends BaseEntity<IFileType & IBaseEntityType> {
    deleteAt?: Date;
    filename: string;
    path: string;
    size?: string;
    thread?: string;
    extension?: string;
    constructor(data?: Partial<IFileType>);
}
