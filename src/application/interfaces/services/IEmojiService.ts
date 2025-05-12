import { IEmojiType } from "../../../domain/entities/emoji/Emoji.entity";
import { EmojiDocument } from "../../../infrastructure/mongo/model/Emoji";

export interface IEmojiService {
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