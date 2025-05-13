import mongoose, { Types } from "mongoose";
import { IFileType } from "../../../domain/entities/file/File.type";

export interface FileDocument extends Omit<IFileType,'_id'>, Document { 
  toObject(): unknown;
  _id: Types.ObjectId
}
const FileSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: String },
  updateAt: { type: Date, default: Date.now },
  extension: { type: String },
});

export default mongoose.model("File", FileSchema);
