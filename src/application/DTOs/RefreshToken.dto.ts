import { Expose } from "class-transformer";

export class RefreshTokenDTO {
    @Expose() token: string;
    @Expose() userId: string;
    @Expose() expiresAt: Date;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;
}