import { RefreshTokenEntity } from "./RefreshToken.entity";
import { IRefreshTokenType } from "./RefreshToken.type";

export class RefreshTokenBuilder {
    private readonly data: Partial<IRefreshTokenType> = {};

    setToken(token: string) {
        this.data.token = token;
        return this;
    }

    setUserId(userId: string) {
        this.data.userId = userId;
        return this;
    }

    setExpiresAt(date: Date) {
        this.data.expiresAt = date;
        return this;
    }

    setCreatedAt(date: Date) {
        this.data.createdAt = date;
        return this;
    }

    setUpdatedAt(date: Date) {
        this.data.updatedAt = date;
        return this;
    }

    build(): RefreshTokenEntity {
        return new RefreshTokenEntity(this.data);
    }
}
