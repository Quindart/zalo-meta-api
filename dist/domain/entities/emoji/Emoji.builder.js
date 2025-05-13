"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiBuilder = void 0;
const Emoji_entity_1 = require("./Emoji.entity");
class EmojiBuilder {
    constructor() {
        this.emojiData = {};
    }
    withEmoji(emoji) {
        this.emojiData.emoji = emoji;
        return this;
    }
    withMessageId(messageId) {
        this.emojiData.messageId = messageId;
        return this;
    }
    withUserId(userId) {
        this.emojiData.userId = userId;
        return this;
    }
    withQuantity(quantity) {
        this.emojiData.quantity = quantity;
        return this;
    }
    withCreatedAt(createdAt) {
        this.emojiData.createdAt = createdAt;
        return this;
    }
    withUpdatedAt(updatedAt) {
        this.emojiData.updatedAt = updatedAt;
        return this;
    }
    withDeletedAt(deleteAt) {
        this.emojiData.deleteAt = deleteAt;
        return this;
    }
    withId(id) {
        this.emojiData.id = id;
        return this;
    }
    build() {
        return Emoji_entity_1.EmojiEntity.create(this.emojiData);
    }
}
exports.EmojiBuilder = EmojiBuilder;
