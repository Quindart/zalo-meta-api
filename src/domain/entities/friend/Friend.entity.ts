
import { Expose } from 'class-transformer';
import { BaseEntity, IBaseEntityType } from '../BaseEntity';   
import { IFriendType } from './Friend.type';
export class FriendEntity extends BaseEntity<IFriendType & IBaseEntityType> {
    @Expose()  user: string;
    @Expose() friend: string;
    @Expose()  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    @Expose() createdAt: Date;
    @Expose() updatedAt: Date;
    @Expose() deletedAt?: Date;

    constructor(data: Partial<IFriendType> = {}) {
        super(data);
        this.user = data.user || '';
        this.friend = data.friend || '';
        this.status = data.status || 'PENDING';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.deletedAt = data.deletedAt;
    }
}
