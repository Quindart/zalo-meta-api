import mongoose from 'mongoose';
import Message from '../../infrastructure/mongo/model/Message.js';
import Channel from '../../infrastructure/mongo/model/Channel.js';


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
        mess.isDeletedById.push(senderId);
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
    async getMessages(channelId, currentUserId, offset) {
        channelId = new mongoose.Types.ObjectId(channelId);
        const messages = await Message.find({ channelId: channelId })
            .populate('senderId', 'firstName lastName avatar')
            .populate('fileId', 'filename path size extension')
            .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo createdAt (mới nhất trước)
            .skip(offset)
            .limit(10) // Giới hạn 10 tin nhắn
            .lean();

        const messagesFilter = messages.filter((message) => {
            if (message.isDeletedById && message.isDeletedById.length > 0) {
                const isDeletedById = message.isDeletedById.find((deletedId) => deletedId.toString() === currentUserId.toString());
                if (isDeletedById) {
                    return false; // Nếu tin nhắn bị xóa bởi người gửi, không hiển thị
                }
            }
            return true; // Nếu không bị xóa, hiển thị tin nhắn
        });

        const messagesFormat = messagesFilter.map((message) => {

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
            };
        });

        messagesFormat.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        console.log("check message from repo: ", messagesFormat);

        return messagesFormat;
    }

    //TODO: xoa lich su trò chuyện
    async deleteHistoryMessage(senderId, channelId) {
        console.log("check delete history message: ", channelId, senderId);
        const mess = await Message.find({ channelId: new mongoose.Types.ObjectId(channelId) });
        mess.forEach((message) => {
            message.isDeletedById.push(senderId);
            message.save();
        });
        const channel = await Channel.findById(channelId);
        channel.deletedForUsers.push({ user: senderId });
        channel.save();
    }

    _checkIsNotYourMessage(senderId, senderStoredId) {
        return senderStoredId.toString() !== senderId
    }
}

export default new MessageRepository();