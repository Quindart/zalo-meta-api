import { FileEntity } from "./File.entity.ts";
import { IFileEntity } from "./File.type.ts";

export class FileBuilder {
    private fileData: Partial<IFileEntity> = {};

    public withFilename(filename: string): FileBuilder {
        this.fileData.filename = filename;
        return this;
    }

    public withPath(path: string): FileBuilder {
        this.fileData.path = path;
        return this;
    }

    public withSize(size: string): FileBuilder {
        this.fileData.size = size;
        return this;
    }

    public withExtension(extension: string): FileBuilder {
        this.fileData.extension = extension;
        return this;
    }

    public withThread(thread: string): FileBuilder {
        this.fileData.thread = thread;
        return this;
    }

    public withDeletedAt(deleteAt: Date): FileBuilder {
        this.fileData.deleteAt = deleteAt;
        return this;
    }

    public build(): FileEntity {
        return new FileEntity(this.fileData);
    }
}
