import { FriendDocument } from "../../../infrastructure/mongo/model/Friend";
import { IFriendType } from "../../../domain/entities/friend/Friend.type";

export interface IFriendService {
    getFriendByUserId(userId: string): Promise<any[]>;

    createFriend(userId: string, userFriendId: string): Promise<FriendDocument>;

    removeFriend(userId: string, userFriendId: string): Promise<boolean>;

    isExistFriendRelationship(userId: string, userFriendId: string): Promise<boolean>;

    getFriendByUserIdByType(userId: string | any, type: string): Promise<any[]>;

    getInviteOfUser(userId: string | any): Promise<any[]>;

    getInviteOfUserSending(userId: string | any): Promise<any[]>;

    getById(userId: string): Promise<FriendDocument | null>;

    updateFriendStatus(userId: string, userFriendId: string, type: string): Promise<FriendDocument>;
}