// import Chat from '../../infrastructure/mongo/model/Chat.js';
// import Message from '../../infrastructure/mongo/model/Message.js';
// import { HTTP_STATUS } from '../../constants/index.js';
// import Error from "../../utils/errors.js";
// class ChatController {
//     async getMyChat(req, res) {
//         try {
//             const currentUserId = req.user.id;
//             const chats = await Chat.find({
//                 participants: { $in: [currentUserId] }
//             })
//                 .populate({
//                     path: 'participants',
//                     select: "avatar lastName firstName"
//                 })
//                 .lean();
//             if (!chats || chats.length === 0) {
//                 return Error.sendNotFound(res, []);
//             }
//             const chatPromises = chats.map(async (chat) => {
//                 const secondUser = chat.participants.find(
//                     user => user._id.toString() !== currentUserId.toString()
//                 );
//                 const lastMessage = await Message.findOne({ chatId: chat._id })
//                     .sort({ createdAt: -1 })
//                     .lean();
//                 return {
//                     _id: chat._id,
//                     secondUser: secondUser,
//                     createdAt: chat.createdAt,
//                     updatedAt: chat.updatedAt,
//                     lastMessage: lastMessage ? lastMessage.content : null,
//                     lastMessageTime: lastMessage ? lastMessage.createdAt : null,
//                     lastMessageSenderId: lastMessage ? lastMessage.senderId : null,
//                     lastMessageStatus: lastMessage ? lastMessage.status : null
//                 };
//             });
//             const responseChats = await Promise.all(chatPromises);
//             responseChats.sort((a, b) => {
//                 if (!a.lastMessageTime) return 1;
//                 if (!b.lastMessageTime) return -1;
//                 return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
//             });

//             return res.status(200).json({
//                 status: 200,
//                 success: true,
//                 message: "Get chats success",
//                 chats: responseChats
//             });
//         } catch (error) {
//             console.error("Error in getChat:", error);
//             Error.sendError(error);
//         }
//     };

//     async getChatById(req, res) {
//         try {
//             const chatId = req.params.id;
//             const chat = await Chat.findById(chatId).lean();
//             if (!chat) {
//                 return res.status(HTTP_STATUS.NOT_FOUND).json({
//                     status: HTTP_STATUS.NOT_FOUND,
//                     success: false,
//                     message: "Get chat failed",
//                 })
//             }
//             return res.status(HTTP_STATUS.OK).json({
//                 status: HTTP_STATUS.OK,
//                 success: true,
//                 message: "Get chat success",
//                 chat
//             })
//         } catch (error) {
//             console.error("Error in getChat:", error);
//             Error.sendError(error);
//         }
//     };
// }

// export default new ChatController();