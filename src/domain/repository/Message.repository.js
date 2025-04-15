import mongoose from 'mongoose';
import Message from '../../infrastructure/mongo/model/Message.js';


class MessageRepository {
    async createMessage({ channelId, userId, content }) {
        const message = await Message.create({
            channel: channelId,
            user: userId,
            content,
        });

        return message;
    }

    async getMessages(channelId) {
        const messages = await Message.find({ channelId: new mongoose.Types.ObjectId(channelId) })
        .populate('senderId', 'firstName lastName avatar')
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo createdAt (mới nhất trước)
        .limit(10) // Giới hạn 10 tin nhắn
        .lean();

        const messagesFormat = messages.map((message) => {
            return {
                ...message,
                id: message._id,
                sender: {
                    id: message.senderId._id,
                    name: message.senderId.lastName + " " + message.senderId.firstName,
                    avatar: message.senderId.avatar,
                },
                channelId: message.channelId,
                status: "send",
                timestamp: message.createdAt,
                isMe: true,
                messageType: message.messageType,
            };
        });

        messagesFormat.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return messagesFormat;
    }
}

export default new MessageRepository();