import { FriendEntity } from "./Friend.entity";
import { IFriendType } from "./Friend.type";

export class FriendBuilder {
    private friendData: Partial<IFriendType> = {};

    public withUser(user: string): FriendBuilder {
        this.friendData.user = user;
        return this;
    }

    public withFriend(friend: string): FriendBuilder {
        this.friendData.friend = friend;
        return this;
    }

    public withStatus(status: 'PENDING' | 'ACCEPTED' | 'BLOCKED'): FriendBuilder {
        this.friendData.status = status;
        return this;
    }

    public withCreatedAt(createdAt: Date): FriendBuilder {
        this.friendData.createdAt = createdAt;
        return this;
    }

    public withUpdatedAt(updatedAt: Date): FriendBuilder {
        this.friendData.updatedAt = updatedAt;
        return this;
    }

    public withDeletedAt(deletedAt: Date): FriendBuilder {
        this.friendData.deletedAt = deletedAt;
        return this;
    }

    public build(): FriendEntity {
        return new FriendEntity(this.friendData);
    }
}
