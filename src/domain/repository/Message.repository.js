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
    //TODO: xoa tin nhan
    async recallMessage(senderId, messageId) {
        const mess = await Message.findById(messageId);
        if (this._checkIsNotYourMessage(senderId, mess.senderId)) {
            return
        }
        mess.isDeletedById = senderId;
        await mess.save();
    }
    //TODO: thu hoi tin nhan
    async deleteMessage(senderId, messageId) {
        const mess = await Message.findById(messageId);
        if (this._checkIsNotYourMessage(senderId, mess.senderId)) {
            return
        } 
        mess.content = "Tin nhắn đã thu hồi";
        mess.messageType = "text";
        await mess.save();
    }
    async getMessages(channelId, offset) {
        channelId = new mongoose.Types.ObjectId(channelId);
        const messages = await Message.find({ channelId: channelId })
            .populate('senderId', 'firstName lastName avatar')
            .populate('fileId', 'filename path size extension')
            .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo createdAt (mới nhất trước)
            .skip(offset)
            .limit(10) // Giới hạn 10 tin nhắn
            .lean();
        const messagesFormat = messages.map((message) => {

            let file = null;
            if (message.fileId) {
                file = {
                    id: message.fileId._id,
                    filename: message.fileId.filename,
                    path: message.fileId.path,
                    size: message.fileId.size,
                    extension: message.fileId.extension,
                };
            }
            return {
                id: message._id,
                sender: {
                    id: message.senderId._id,
                    name: message.senderId.lastName + " " + message.senderId.firstName,
                    avatar: message.senderId.avatar,
                },
                file: file,
                channelId: message.channelId,
                status: "send",
                timestamp: message.createdAt,
                isMe: true,
                messageType: message.messageType,
                content: message.content,
                isDeletedById: message.isDeletedById,
            };
        });

        messagesFormat.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        console.log("check message from repo: ", messagesFormat);

        return messagesFormat;
    }

    _checkIsNotYourMessage(senderId, senderStoredId) {
        return senderStoredId.toString() !== senderId
    }
}

export default new MessageRepository();