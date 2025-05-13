"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendBuilder = void 0;
const Friend_entity_1 = require("./Friend.entity");
class FriendBuilder {
    constructor() {
        this.friendData = {};
    }
    withUser(user) {
        this.friendData.user = user;
        return this;
    }
    withFriend(friend) {
        this.friendData.friend = friend;
        return this;
    }
    withStatus(status) {
        this.friendData.status = status;
        return this;
    }
    withCreatedAt(createdAt) {
        this.friendData.createdAt = createdAt;
        return this;
    }
    withUpdatedAt(updatedAt) {
        this.friendData.updatedAt = updatedAt;
        return this;
    }
    withDeletedAt(deletedAt) {
        this.friendData.deletedAt = deletedAt;
        return this;
    }
    build() {
        return new Friend_entity_1.FriendEntity(this.friendData);
    }
}
exports.FriendBuilder = FriendBuilder;
