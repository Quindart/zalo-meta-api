import { IEmojiRepository } from "../../../domain/repositories/IEmoji.repository";
export declare class MongooseEmojiRepository implements IEmojiRepository {
    addEmoji(messageId: string, emoji: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../model/Message").MessageDocument, {}> & import("../model/Message").MessageDocument & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    deleteMyEmoji(messageId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../model/Message").MessageDocument, {}> & import("../model/Message").MessageDocument & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAllEmojiOfMessage(messageId: string): Promise<{
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../model/Emoji").EmojiDocument, {}> & import("../model/Emoji").EmojiDocument & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
