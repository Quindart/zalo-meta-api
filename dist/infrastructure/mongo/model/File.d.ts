import mongoose, { Types } from "mongoose";
import { IFileType } from "../../../domain/entities/file/File.type";
export interface FileDocument extends Omit<IFileType, '_id'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
}
declare const _default: mongoose.Model<{
    path: string;
    createAt: NativeDate;
    updateAt: NativeDate;
    filename: string;
    deleteAt?: NativeDate;
    size?: string;
    extension?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    path: string;
    createAt: NativeDate;
    updateAt: NativeDate;
    filename: string;
    deleteAt?: NativeDate;
    size?: string;
    extension?: string;
}, {}> & {
    path: string;
    createAt: NativeDate;
    updateAt: NativeDate;
    filename: string;
    deleteAt?: NativeDate;
    size?: string;
    extension?: string;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    path: string;
    createAt: NativeDate;
    updateAt: NativeDate;
    filename: string;
    deleteAt?: NativeDate;
    size?: string;
    extension?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    path: string;
    createAt: NativeDate;
    updateAt: NativeDate;
    filename: string;
    deleteAt?: NativeDate;
    size?: string;
    extension?: string;
}>, {}> & mongoose.FlatRecord<{
    path: string;
    createAt: NativeDate;
    updateAt: NativeDate;
    filename: string;
    deleteAt?: NativeDate;
    size?: string;
    extension?: string;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
