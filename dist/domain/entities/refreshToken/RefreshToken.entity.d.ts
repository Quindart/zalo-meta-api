import { BaseEntity, IBaseEntityType } from "../BaseEntity";
import { IRefreshTokenType } from "./RefreshToken.type";
export declare class RefreshTokenEntity extends BaseEntity<IRefreshTokenType & IBaseEntityType> {
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<IRefreshTokenType>);
}
