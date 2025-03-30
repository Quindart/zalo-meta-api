import Chat from '../../infrastructure/mongo/model/Chat.js';
import { HTTP_STATUS } from '../../constants/index.js';
import Error from "../../utils/errors.js";
class ChatController {
    async getMyChat(req, res) {
        try {
            const currentUserId = req.user.id;
            const chat = await Chat.findOne({
                participants: { $in: [currentUserId] }
            })
                .populate({
                    path: 'participants',
                })
                .lean();

            if (!chat) {
                Error.sendNotFound(res, [])
            }
            const secondUser = chat.participants.find(
                user => user._id.toString() !== currentUserId.toString()
            );

            const responseChat = {
                _id: chat._id,
                secondUser: secondUser,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            };

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Get chats success",
                chats: [responseChat]
            });
        } catch (error) {
            console.error("Error in getChat:", error);
            Error.sendError(error);
        }
    };

    async getChatById(req, res) {
        try {
            const chatId = req.params.id;
            const chat = await Chat.findById(chatId).lean();
            if (!chat) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    status: HTTP_STATUS.NOT_FOUND,
                    success: false,
                    message: "Get chat failed",
                })
            }
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Get chat success",
                chat
            })
        } catch (error) {
            console.error("Error in getChat:", error);
            Error.sendError(error);
        }
    };
}

export default new ChatController();