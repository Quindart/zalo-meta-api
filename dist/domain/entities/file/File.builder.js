"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBuilder = void 0;
const File_entity_1 = require("./File.entity");
class FileBuilder {
    constructor() {
        this.fileData = {};
    }
    withFilename(filename) {
        this.fileData.filename = filename;
        return this;
    }
    withPath(path) {
        this.fileData.path = path;
        return this;
    }
    withSize(size) {
        this.fileData.size = size;
        return this;
    }
    withExtension(extension) {
        this.fileData.extension = extension;
        return this;
    }
    withThread(thread) {
        this.fileData.thread = thread;
        return this;
    }
    withDeletedAt(deleteAt) {
        this.fileData.deleteAt = deleteAt;
        return this;
    }
    build() {
        return new File_entity_1.FileEntity(this.fileData);
    }
}
exports.FileBuilder = FileBuilder;
