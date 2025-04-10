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
            .lean();
        console.log("messages", messages)
        return messages;
    }
}

export default new MessageRepository();