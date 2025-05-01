export interface IEmojiType {
    id: string;
    createdAt: Date | string;
    deleteAt?: Date | string;
    emoji: string;
    quantity: number;
    updatedAt: Date | string;
    messageId: string;
    userId: string;
}