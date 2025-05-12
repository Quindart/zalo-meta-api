import { injectable, inject } from "inversify";
import TYPES from "../../../infrastructure/inversify/type.ts";
import { IEmojiService } from "../../interfaces/services/IEmojiService";
import { IEmojiRepository } from "../../../domain/repositories/IEmoji.repository";
import { EmojiMapper } from "../../../infrastructure/mongo/mappers/EmojiMapper";

type EmojiRepositoryType = IEmojiRepository
type MapperType = EmojiMapper
@injectable()
export class EmojiService implements IEmojiService {
    constructor(
        @inject(TYPES.EmojiRepository) private readonly repository: EmojiRepositoryType,
        @inject(TYPES.EmojiMapper) private readonly mapper: MapperType
    ) { }
    async addEmoji(messageId: string, emoji: any, userId: string): Promise<{ success: boolean; message: string; data?: any; }> {
        return await this.addEmoji(messageId, emoji, userId)
    }
    async deleteMyEmoji(messageId: string, userId: string): Promise<{ success: boolean; message: string; data?: any; }> {
        return await this.deleteMyEmoji(messageId, userId)
    }
    async getAllEmojiOfMessage(messageId: string): Promise<{ success: boolean; message: string; data?: any[]; }> {
        return await this.getAllEmojiOfMessage(messageId)
    }
}