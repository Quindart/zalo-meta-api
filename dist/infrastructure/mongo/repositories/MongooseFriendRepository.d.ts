import { IFriendRepository } from "../../../domain/repositories/IFriend.repository";
export declare class MongooseFriendRepository implements IFriendRepository {
    getFriendByUserId(userId: string): Promise<{
        id: any;
        name: string;
        avatar: any;
        email: any;
    }[]>;
    createFriend(userId: string, userFriendId: string): Promise<import("mongoose").Document<unknown, {}, import("../model/Friend").FriendDocument, {}> & import("../model/Friend").FriendDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeFriend(userId: string, userFriendId: string): Promise<boolean>;
    isExistFriendRelationship(userId: string, userFriendId: string): Promise<boolean>;
    getFriendByUserIdByType(userId: string, type: string): Promise<{
        id: any;
        name: string;
        avatar: any;
        email: any;
        phone: any;
    }[]>;
    getInviteOfUser(userId: string): Promise<{
        id: any;
        name: string;
        avatar: any;
        phone: any;
    }[]>;
    getInviteOfUserSending(userId: string): Promise<{
        id: any;
        name: string;
        avatar: any;
        phone: any;
    }[]>;
    getById(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../model/Friend").FriendDocument, {}> & import("../model/Friend").FriendDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateFriendStatus(userId: string, userFriendId: string, type: string): Promise<any>;
}
