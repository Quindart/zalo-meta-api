import { EmojiEntity } from "./Emoji.entity";
import { IEmojiType } from "./Emoji.type";

export class EmojiBuilder {
    private emojiData: Partial<IEmojiType> = {};

    public withEmoji(emoji: string): EmojiBuilder {
        this.emojiData.emoji = emoji;
        return this;
    }

    public withMessageId(messageId: string): EmojiBuilder {
        this.emojiData.messageId = messageId;
        return this;
    }

    public withUserId(userId: string): EmojiBuilder {
        this.emojiData.userId = userId;
        return this;
    }

    public withQuantity(quantity: number): EmojiBuilder {
        this.emojiData.quantity = quantity;
        return this;
    }

    public withCreatedAt(createdAt: Date): EmojiBuilder {
        this.emojiData.createdAt = createdAt;
        return this;
    }

    public withUpdatedAt(updatedAt: Date): EmojiBuilder {
        this.emojiData.updatedAt = updatedAt;
        return this;
    }

    public withDeletedAt(deleteAt: Date): EmojiBuilder {
        this.emojiData.deleteAt = deleteAt;
        return this;
    }

    public withId(id: string): EmojiBuilder {
        this.emojiData.id = id;
        return this;
    }

    public build(): EmojiEntity {
        return EmojiEntity.create(this.emojiData);
    }
}