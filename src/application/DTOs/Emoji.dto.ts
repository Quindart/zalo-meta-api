import { Expose } from "class-transformer";

export class EmojiDTO {
    @Expose() emoji: string;
    @Expose() quantity: number;
    @Expose() messageId: string;
    @Expose() userId: string;
    // @Expose() deleteAt?: Date | string;
}