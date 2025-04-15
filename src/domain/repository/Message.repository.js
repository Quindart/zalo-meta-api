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
        channelId = new mongoose.Types.ObjectId(channelId);
        const messages = await Message.find({ channelId: channelId })
            .populate('senderId', 'firstName lastName avatar')
            .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo createdAt (mới nhất trước)
            .limit(10) // Giới hạn 10 tin nhắn
            .lean();

        const messagesFormat = messages.map((message) => {
            return {
                ...message,
                sender: {
                    id: message.senderId._id,
                    name: message.senderId.lastName + " " + message.senderId.firstName,
                    avatar: message.senderId.avatar,
                },
                channelId: message.channelId,
                status: "send",
                timestamp: message.createdAt,
                isMe: true,
            };
        });

        messagesFormat.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        console.log("check message from repo: ", messagesFormat);

        return messagesFormat;
    }
}

export default new MessageRepository();