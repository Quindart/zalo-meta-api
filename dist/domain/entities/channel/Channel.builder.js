"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelBuilder = void 0;
const channel_enum_1 = require("../../../types/enum/channel.enum");
const Channel_entity_1 = require("./Channel.entity");
class ChannelBuilder {
    constructor() {
        this.channelData = {};
    }
    withType(type) {
        this.channelData.type = type;
        return this;
    }
    withName(name) {
        this.channelData.name = name;
        return this;
    }
    withAvatar(avatar) {
        this.channelData.avatar = avatar;
        return this;
    }
    withDescription(description) {
        this.channelData.description = description;
        return this;
    }
    withLastMessage(lastMessage) {
        this.channelData.lastMessage = lastMessage;
        return this;
    }
    withDeletedForUsers(deletedForUsers) {
        this.channelData.deletedForUsers = deletedForUsers;
        return this;
    }
    withMembers(members) {
        this.channelData.members = members;
        return this;
    }
    withMember(userId, role = channel_enum_1.ROLE_TYPES.MEMBER) {
        this.channelData.members = this.channelData.members || [];
        this.channelData.members.push({ user: userId, role });
        return this;
    }
    withCreatedAt(createdAt) {
        this.channelData.createdAt = createdAt;
        return this;
    }
    withUpdatedAt(updatedAt) {
        this.channelData.updatedAt = updatedAt;
        return this;
    }
    withDeletedAt(deletedAt) {
        this.channelData.deletedAt = deletedAt;
        return this;
    }
    withIsDeleted(isDeleted) {
        this.channelData.isDeleted = isDeleted;
        return this;
    }
    withId(id) {
        this.channelData._id = id;
        return this;
    }
    build() {
        return Channel_entity_1.ChannelEntity.create(this.channelData);
    }
}
exports.ChannelBuilder = ChannelBuilder;
