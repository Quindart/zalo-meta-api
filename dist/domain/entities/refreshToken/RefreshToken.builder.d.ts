import { RefreshTokenEntity } from "./RefreshToken.entity";
export declare class RefreshTokenBuilder {
    private readonly data;
    setToken(token: string): this;
    setUserId(userId: string): this;
    setExpiresAt(date: Date): this;
    setCreatedAt(date: Date): this;
    setUpdatedAt(date: Date): this;
    build(): RefreshTokenEntity;
}
