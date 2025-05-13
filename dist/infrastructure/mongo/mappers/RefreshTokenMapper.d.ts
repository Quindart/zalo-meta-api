import { RefreshTokenEntity } from "../../../domain/entities/refreshToken/RefreshToken.entity";
import { RefreshTokenDocument } from "../model/RefreshToken";
import { Types } from "mongoose";
export declare class RefreshTokenMapper {
    toDomain(doc: RefreshTokenDocument): RefreshTokenEntity;
    toPersistence(token: RefreshTokenEntity): {
        _id: Types.ObjectId;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt?: Date;
        updatedAt?: Date;
    };
}
