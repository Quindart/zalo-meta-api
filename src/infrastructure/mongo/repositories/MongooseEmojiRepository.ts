
import { injectable } from "inversify";
import { IEmojiRepository } from "../../../domain/repositories/IEmoji.repository";
import Emoji from "../model/Emoji";
import Message from "../model/Message";
@injectable()
export class MongooseEmojiRepository implements IEmojiRepository {
    async addEmoji(messageId: string, emoji: any, userId: string) {
        try {
            if (!messageId || !emoji || !userId) {
                return {
                    success: false,
                    message: "messageId, emoji, and userId are required.",
                };
            }
            let emojiRecord = await Emoji.findOne({ messageId, emoji, userId, deleteAt: { $exists: false } });
            if (emojiRecord) {
                emojiRecord.quantity += 1;
                emojiRecord.updateAt = new Date();
                await emojiRecord.save();
            } else {
                emojiRecord = new Emoji({
                    messageId,
                    emoji,
                    userId,
                    quantity: 1,
                    createAt: new Date(),
                    updateAt: new Date(),
                });
                await emojiRecord.save();
            }
            const updatedMessage: any = await Message.findById(messageId);
            if (!updatedMessage) {
                return {
                    success: false,
                    message: "Message not found.",
                };
            }
            const emojiDocs = await Emoji.find({ _id: { $in: updatedMessage.emojis }, userId, deleteAt: { $exists: false } });
            const index = emojiDocs.findIndex(e => e.emoji === emoji);
            if (index !== -1) {
                updatedMessage.emojis[updatedMessage.emojis.findIndex(eId => eId.equals(emojiDocs[index]._id))] = emojiRecord._id;
            } else {
                updatedMessage.emojis.push(emojiRecord._id);
            }
            updatedMessage.updateAt = new Date();
            await updatedMessage.save();
            const populatedMessage = await Message.findById(messageId).populate('emojis');
            return {
                success: true,
                message: "Emoji added successfully.",
                data: populatedMessage,
            };
        } catch (error) {
            console.error("Error in addEmoji:", error);
            return {
                success: false,
                message: error.message || "Failed to add emoji.",
            };
        }
    }
    async deleteMyEmoji(messageId: string, userId: string) {
        try {
            if (!messageId || !userId) {
                return {
                    success: false,
                    message: "messageId and userId are required.",
                };
            }
            const message = await Message.findById(messageId);
            if (!message) {
                return {
                    success: false,
                    message: "Message not found.",
                };
            }
            const emojiDocs = await Emoji.find({ _id: { $in: message.emojis }, userId, deleteAt: { $exists: false } });
            message.emojis = message.emojis.filter((emojiId: any) => !emojiDocs.some(e => e._id.toString() === emojiId));
            await message.save();
            const result = await Emoji.updateMany(
                { messageId, userId, deleteAt: { $exists: false } },
                { $set: { deleteAt: new Date() } }
            );
            if (result.modifiedCount === 0) {
                return {
                    success: false,
                    message: "No emojis found for this user and message.",
                };
            }
            return {
                success: true,
                message: `Successfully deleted ${result.modifiedCount} emojis.`,
                data: message,
            };
        } catch (error) {
            console.error("Error in deleteMyEmoji:", error);
            return {
                success: false,
                message: error.message || "Failed to delete emojis.",
            };
        }
    }
    async getAllEmojiOfMessage(messageId: string) {
        try {
            if (!messageId) {
                return {
                    success: false,
                    message: "messageId is required.",
                };
            }
            const emojis = await Emoji.find({ messageId, deleteAt: { $exists: false } });
            return {
                success: true,
                message: "Emojis retrieved successfully.",
                data: emojis,
            };
        } catch (error) {
            console.error("Error in getAllEmojiOfMessage:", error);
            return {
                success: false,
                message: error.message || "Failed to retrieve emojis.",
            };
        }
    }
}