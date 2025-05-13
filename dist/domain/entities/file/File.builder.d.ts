import { FileEntity } from "./File.entity";
export declare class FileBuilder {
    private fileData;
    withFilename(filename: string): FileBuilder;
    withPath(path: string): FileBuilder;
    withSize(size: string): FileBuilder;
    withExtension(extension: string): FileBuilder;
    withThread(thread: string): FileBuilder;
    withDeletedAt(deleteAt: Date): FileBuilder;
    build(): FileEntity;
}
