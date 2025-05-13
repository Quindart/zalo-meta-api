import { IEmojiService } from "../../interfaces/services/IEmojiService";
import { IEmojiRepository } from "../../../domain/repositories/IEmoji.repository";
type EmojiRepositoryType = IEmojiRepository;
export declare class EmojiService implements IEmojiService {
    private readonly repository;
    constructor(repository: EmojiRepositoryType);
    addEmoji(messageId: string, emoji: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    deleteMyEmoji(messageId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    getAllEmojiOfMessage(messageId: string): Promise<{
        success: boolean;
        message: string;
        data?: any[];
    }>;
}
export {};
