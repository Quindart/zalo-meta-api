export interface IRefreshTokenType {
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
