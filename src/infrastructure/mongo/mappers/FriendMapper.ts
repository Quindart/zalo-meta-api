import { plainToInstance } from "class-transformer";
import { FriendEntity } from "../../../domain/entities/friend/Friend.entity";
import { FriendDocument } from "../model/Friend";
import { Types } from "mongoose";

export class FriendMapper {
    toDomain(doc: FriendDocument): FriendEntity {
        if (!doc) return null;
        const docConvert = {
            _id: doc._id.toString(),
            user: doc.user.toString(),
            friend: doc.friend.toString()
        }
        const friend = { ...doc.toObject() as Record<string, any>, ...docConvert }
        return plainToInstance(FriendEntity, friend, {
            excludeExtraneousValues: true
        })
    }

    toPersistence(friend: FriendEntity) {
        return {
            ...friend,
            _id: new Types.ObjectId(friend._id) ?? undefined,
            user: new Types.ObjectId(friend.user) ?? undefined,
            friend: new Types.ObjectId(friend.friend) ?? undefined
        }
    }
}