import { FriendEntity } from "./Friend.entity";
export declare class FriendBuilder {
    private friendData;
    withUser(user: string): FriendBuilder;
    withFriend(friend: string): FriendBuilder;
    withStatus(status: 'PENDING' | 'ACCEPTED' | 'BLOCKED'): FriendBuilder;
    withCreatedAt(createdAt: Date): FriendBuilder;
    withUpdatedAt(updatedAt: Date): FriendBuilder;
    withDeletedAt(deletedAt: Date): FriendBuilder;
    build(): FriendEntity;
}
