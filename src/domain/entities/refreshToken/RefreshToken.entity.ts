import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IRefreshTokenType } from "./RefreshToken.type";

export class RefreshTokenEntity extends BaseEntity<IRefreshTokenType & IBaseEntityType> {
    @Expose() token: string;
    @Expose() userId: string;
    @Expose() expiresAt: Date;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;

    constructor(data: Partial<IRefreshTokenType> = {}) {
        super(data);
        this.token = data.token || "";
        this.userId = data.userId || "";
        this.expiresAt = data.expiresAt || new Date();
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
