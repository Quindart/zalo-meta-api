import { injectable, inject } from "inversify";
import TYPES from "../../../infrastructure/inversify/type";
import { IEmojiService } from "../../interfaces/services/IEmojiService";
import { IEmojiRepository } from "../../../domain/repositories/IEmoji.repository";

type EmojiRepositoryType = IEmojiRepository
@injectable()
export class EmojiService implements IEmojiService {
    constructor(
        @inject(TYPES.EmojiRepository) private readonly repository: EmojiRepositoryType,
    ) { }
    async addEmoji(messageId: string, emoji: any, userId: string): Promise<{ success: boolean; message: string; data?: any; }> {
        return await this.repository.addEmoji(messageId, emoji, userId)
    }
    async deleteMyEmoji(messageId: string, userId: string): Promise<{ success: boolean; message: string; data?: any; }> {
        return await this.repository.deleteMyEmoji(messageId, userId)
    }
    async getAllEmojiOfMessage(messageId: string): Promise<{ success: boolean; message: string; data?: any[]; }> {
        return await this.repository.getAllEmojiOfMessage(messageId)
    }
}