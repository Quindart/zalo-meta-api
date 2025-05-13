"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMessageBuilder = void 0;
const SystemMessage_entity_1 = require("./SystemMessage.entity");
class SystemMessageBuilder {
    constructor() {
        this.data = {};
    }
    setActionType(type) {
        this.data.actionType = type;
        return this;
    }
    setMessageId(id) {
        this.data.messageId = id;
        return this;
    }
    setCreatedAt(date) {
        this.data.createdAt = date;
        return this;
    }
    setUpdatedAt(date) {
        this.data.updatedAt = date;
        return this;
    }
    build() {
        return new SystemMessage_entity_1.SystemMessageEntity(this.data);
    }
}
exports.SystemMessageBuilder = SystemMessageBuilder;
