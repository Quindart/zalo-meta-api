import { plainToInstance } from "class-transformer";
import { RefreshTokenEntity } from "../../../domain/entities/refreshToken/RefreshToken.entity";
import { RefreshTokenDocument } from "../model/RefreshToken";
import { Types } from "mongoose";

export class RefreshTokenMapper {
    toDomain(doc: RefreshTokenDocument): RefreshTokenEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString(),
        };
        const token = { ...doc.toObject() as Record<string, any>, ...docConvert };
        return plainToInstance(RefreshTokenEntity, token, {
            excludeExtraneousValues: true
        });
    }

    toPersistence(token: RefreshTokenEntity) {
        return {
            ...token,
            _id: new Types.ObjectId(token._id) ?? undefined
        };
    }
}
