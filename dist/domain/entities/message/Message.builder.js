"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = void 0;
const Message_entity_1 = require("./Message.entity");
class MessageBuilder {
    constructor() {
        this.messageData = {};
    }
    withSenderId(senderId) {
        this.messageData.senderId = senderId;
        return this;
    }
    withContent(content) {
        this.messageData.content = content;
        return this;
    }
    withStatus(status) {
        this.messageData.status = status;
        return this;
    }
    withMessageType(messageType) {
        this.messageData.messageType = messageType;
        return this;
    }
    withChannelId(channelId) {
        this.messageData.channelId = channelId;
        return this;
    }
    withEmojis(emojis) {
        this.messageData.emojis = emojis;
        return this;
    }
    withImagesGroup(imagesGroup) {
        this.messageData.imagesGroup = imagesGroup;
        return this;
    }
    withFileId(fileId) {
        this.messageData.fileId = fileId;
        return this;
    }
    withSystemMessageId(systemMessageId) {
        this.messageData.systemMessageId = systemMessageId;
        return this;
    }
    withCreatedAt(createdAt) {
        this.messageData.createdAt = createdAt;
        return this;
    }
    withTimestamp(timestamp) {
        this.messageData.timestamp = timestamp;
        return this;
    }
    withIsDeletedById(isDeletedById) {
        this.messageData.isDeletedById = isDeletedById;
        return this;
    }
    build() {
        return new Message_entity_1.MessageEntity(this.messageData);
    }
}
exports.MessageBuilder = MessageBuilder;
