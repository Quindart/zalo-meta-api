import { Expose } from 'class-transformer';
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

export class EmojiEntity extends BaseEntity<IEmojiType & IBaseEntityType> {
    @Expose() emoji: string;
    @Expose() quantity: number;
    @Expose() messageId: string;
    @Expose() userId: string;
    @Expose() deleteAt?: Date | string;
    @Expose() createAt?: Date | string;
    @Expose() updateAt?: Date | string;


    constructor(data: Partial<IEmojiType> = {}) {
        super(data);
        this.emoji = data.emoji || '';
        this.quantity = data.quantity || 0;
        this.messageId = data.messageId || '';
        this.userId = data.userId || '';
        this.deleteAt = data.deleteAt;
        this.createAt = data.createAt
        this.updateAt = data.updateAt
    }
}
