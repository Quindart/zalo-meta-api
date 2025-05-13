import { BaseEntity, IBaseEntityType } from '../BaseEntity';
import { IFriendType } from './Friend.type';
export declare class FriendEntity extends BaseEntity<IFriendType & IBaseEntityType> {
    user: string;
    friend: string;
    status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    constructor(data?: Partial<IFriendType>);
}
