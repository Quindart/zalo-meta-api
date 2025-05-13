import { EmojiEntity } from "./Emoji.entity";
export declare class EmojiBuilder {
    private emojiData;
    withEmoji(emoji: string): EmojiBuilder;
    withMessageId(messageId: string): EmojiBuilder;
    withUserId(userId: string): EmojiBuilder;
    withQuantity(quantity: number): EmojiBuilder;
    withCreatedAt(createdAt: Date): EmojiBuilder;
    withUpdatedAt(updatedAt: Date): EmojiBuilder;
    withDeletedAt(deleteAt: Date): EmojiBuilder;
    withId(id: string): EmojiBuilder;
    build(): EmojiEntity;
}
