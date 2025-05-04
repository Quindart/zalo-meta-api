export interface IFriendRepository {
    getFriendByUserId(userId: string): Promise<{
        id: string;
        name: string;
        avatar: string;
        email: string;
    }[]>;

    createFriend(userId: string, userFriendId: string): Promise<any>;

    removeFriend(userId: string, userFriendId: string): Promise<boolean>;

    isExistFriendRelationship(userId: string, userFriendId: string): Promise<boolean>;

    getFriendByUserIdByType(userId: string, type: string): Promise<{
        id: string;
        name: string;
        avatar: string;
        email: string;
        phone: string;
    }[]>;

    getInviteOfUser(userId: string): Promise<{
        id: string;
        name: string;
        avatar: string;
        phone: string;
    }[]>;

    getInviteOfUserSending(userId: string): Promise<{
        id: string;
        name: string;
        avatar: string;
        phone: string;
    }[]>;

    getById(userId: string): Promise<any>;

    updateFriendStatus(userId: string, userFriendId: string, type: string): Promise<any>;
}