import { EMOJI } from "../../constants/index.js";
import Emoji from "../../infrastructure/mongo/model/Emoji.js";
import Error from "../../utils/errors.js";

class EmojiRepository {
    // Thêm hoặc tăng số lượng emoji của một người dùng cho tin nhắn
    async addEmoji(messageId, emoji, userId) {
        try {
            // Kiểm tra đầu vào
            if (!messageId || !emoji || !userId) {
                return {
                    success: false,
                    message: "messageId, emoji, and userId are required.",
                };
            }

            // Tìm emoji của userId cho messageId
            let emojiRecord = await Emoji.findOne({ messageId, emoji, userId });

            if (emojiRecord) {
                // Nếu đã tồn tại, tăng quantity
                emojiRecord.quantity += 1;
                emojiRecord.updateAt = Date.now();
                await emojiRecord.save();
            } else {
                // Nếu chưa có, tạo mới
                emojiRecord = new Emoji({
                    messageId,
                    emoji,
                    userId,
                    quantity: 1,
                });
                await emojiRecord.save();
            }

            return {
                success: true,
                message: "Emoji added successfully.",
                data: emojiRecord,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    // Xóa tất cả emoji của một người dùng cho một tin nhắn
    async deleteMyEmoji(messageId, userId) {
        try {
            // Kiểm tra đầu vào
            if (!messageId || !userId) {
                return {
                    success: false,
                    message: "messageId and userId are required.",
                };
            }

            // Xóa tất cả emoji của userId cho messageId
            const result = await Emoji.deleteMany({ messageId, userId });

            if (result.deletedCount === 0) {
                return {
                    success: false,
                    message: "No emojis found for this user and message.",
                };
            }

            return {
                success: true,
                message: `Successfully deleted ${result.deletedCount} emojis.`,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    // Lấy tất cả emoji của một tin nhắn
    async getAllEmojiOfMessage(messageId) {
        try {
            // Kiểm tra đầu vào
            if (!messageId) {
                return {
                    success: false,
                    message: "messageId is required.",
                };
            }

            // Lấy tất cả emoji của messageId
            const emojis = await Emoji.find({ messageId }); // Populate userId để lấy thông tin user (tùy chọn)

            return {
                success: true,
                message: "Emojis retrieved successfully.",
                data: emojis,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}

export default new EmojiRepository();