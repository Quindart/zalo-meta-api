import { EMOJI } from "../../constants/index.js";
import Emoji from "../../infrastructure/mongo/model/Emoji.js";
import Message from "../../infrastructure/mongo/model/Message.js";
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

            // Tìm emoji của userId cho messageId, bỏ qua các bản ghi đã soft delete
            let emojiRecord = await Emoji.findOne({ messageId, emoji, userId, deleteAt: { $exists: false } });

            if (emojiRecord) {
                // Nếu đã tồn tại, tăng quantity
                emojiRecord.quantity += 1;
                emojiRecord.updateAt = new Date();
                await emojiRecord.save();
            } else {
                // Nếu chưa có, tạo mới
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

            // Cập nhật mảng emojis trong Message
            const updatedMessage = await Message.findById(messageId);
            if (!updatedMessage) {
                return {
                    success: false,
                    message: "Message not found.",
                };
            }

            // Tìm xem user đã thả emoji nào trong mảng emojis chưa
            const emojiDocs = await Emoji.find({ _id: { $in: updatedMessage.emojis }, userId, deleteAt: { $exists: false } });
            const index = emojiDocs.findIndex(e => e.emoji === emoji);

            if (index !== -1) {
                // Nếu user đã thả emoji này, cập nhật tại vị trí đó
                updatedMessage.emojis[updatedMessage.emojis.findIndex(eId => eId.equals(emojiDocs[index]._id))] = emojiRecord._id;
            } else {
                // Nếu chưa có, thêm mới
                updatedMessage.emojis.push(emojiRecord._id);
            }

            updatedMessage.updateAt = new Date(); // Cập nhật thời gian
            await updatedMessage.save();

            // Populate emojis để trả về dữ liệu đầy đủ
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
            //Xóa emoji của userId trong Message
            const message = await Message.findById(messageId);
            if (!message) {
                return {
                    success: false,
                    message: "Message not found.",
                };
            }
            else {
                message.emojis = message.emojis.filter(emoji => emoji.userId !== userId);
                await message.save();
            }
            // Xóa tất cả emoji của userId cho messageId
            const result = await Emoji.deleteMany({ userId });
            if (result.deletedCount === 0) {
                return {
                    success: false,
                    message: "No emojis found for this user and message.",
                };
            }
            return {
                success: true,
                message: `Successfully deleted ${result.deletedCount} emojis.`,
                data: message
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