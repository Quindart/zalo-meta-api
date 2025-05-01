import { Expose, Type } from "class-transformer";

export class FileDTO {
    @Expose() deleteAt?: Date;
    @Expose() filename: string;
    @Expose() path: string;
    @Expose() size?: string;
    @Expose() extension?: string;
}