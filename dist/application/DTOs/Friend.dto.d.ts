export declare class FriendDTO {
    user: string;
    friend: string;
    status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
