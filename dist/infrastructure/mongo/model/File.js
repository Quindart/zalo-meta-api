"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FileSchema = new mongoose_1.default.Schema({
    createAt: { type: Date, default: Date.now },
    deleteAt: { type: Date },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: String },
    updateAt: { type: Date, default: Date.now },
    extension: { type: String },
});
exports.default = mongoose_1.default.model("File", FileSchema);
