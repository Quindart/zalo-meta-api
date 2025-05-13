"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenBuilder = void 0;
const RefreshToken_entity_1 = require("./RefreshToken.entity");
class RefreshTokenBuilder {
    constructor() {
        this.data = {};
    }
    setToken(token) {
        this.data.token = token;
        return this;
    }
    setUserId(userId) {
        this.data.userId = userId;
        return this;
    }
    setExpiresAt(date) {
        this.data.expiresAt = date;
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
        return new RefreshToken_entity_1.RefreshTokenEntity(this.data);
    }
}
exports.RefreshTokenBuilder = RefreshTokenBuilder;
