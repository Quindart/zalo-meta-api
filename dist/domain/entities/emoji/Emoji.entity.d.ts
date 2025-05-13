import { BaseEntity, IBaseEntityType } from '../BaseEntity';
export interface IEmojiType extends IBaseEntityType {
    emoji: string;
    quantity: number;
    messageId: string;
    userId: string;
    deleteAt?: Date | string;
    createAt?: Date | string;
    updateAt?: Date | string;
}
export declare class EmojiEntity extends BaseEntity<IEmojiType & IBaseEntityType> {
    emoji: string;
    quantity: number;
    messageId: string;
    userId: string;
    deleteAt?: Date | string;
    createAt?: Date | string;
    updateAt?: Date | string;
    constructor(data?: Partial<IEmojiType>);
}
