import { FriendEntity } from "../../../domain/entities/friend/Friend.entity";
import { FriendDocument } from "../model/Friend";
import { Types } from "mongoose";
export declare class FriendMapper {
    toDomain(doc: FriendDocument): FriendEntity;
    toPersistence(friend: FriendEntity): {
        _id: Types.ObjectId;
        user: Types.ObjectId;
        friend: Types.ObjectId;
        status: "PENDING" | "ACCEPTED" | "BLOCKED";
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
    };
}
