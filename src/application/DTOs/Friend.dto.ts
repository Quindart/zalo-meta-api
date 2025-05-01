import { Expose } from "class-transformer";

export class FriendDTO {
    @Expose() user: string;
    @Expose() friend: string;
    @Expose() status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    @Expose() createdAt: Date;
    @Expose() updatedAt: Date;
    @Expose() deletedAt?: Date;
}