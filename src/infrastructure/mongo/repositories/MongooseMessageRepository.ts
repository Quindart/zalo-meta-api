import mongoose, { Types } from 'mongoose';
import { IMessageRepository } from '../../../domain/repositories/IMessage.repository';
import Message from '../model/Message';
import Channel from '../model/Channel';

export class MongooseMessageRepository implements IMessageRepository {
    async createMessage({ channelId, userId, content }) {
        try {
            const message = await Message.create({
                channel: channelId,
                user: userId,
                content,
            });
            return message;
        } catch (error) {
            console.error("Error in createMessage:", error);
            throw new Error(error.message || "Failed to create message.");
        }
    }

    async recallMessage(senderId: string, messageId: string) {
        try {

            const message = await Message.findById(messageId);
            if (!message) {
                throw new Error("Message not found.");
            }
            // if (this._checkIsNotYourMessage(senderId, message.user.toString())) {
            //     throw new Error("You are not authorized to recall this message.");
            // }
            message.isDeletedById = message.isDeletedById || [];


            const senderObjId = new Types.ObjectId(senderId)
            message.isDeletedById.push(senderObjId);
            await message.save();
        } catch (error) {
            console.error("Error in recallMessage:", error);
            throw new Error(error.message || "Failed to recall message.");
        }
    }

    async deleteMessage(senderId: string, messageId: string) {
        try {
            
            const message = await Message.findById(messageId);
            if (!message) {
                throw new Error("Message not found.");
            }
            // if (this._checkIsNotYourMessage(senderId, message.us.toString())) {
            //     throw new Error("You are not authorized to delete this message.");
            // }
            message.content = "Tin nhắn đã thu hồi";
            message.messageType = "text";
            await message.save();
        } catch (error) {
            console.error("Error in deleteMessage:", error);
            throw new Error(error.message || "Failed to delete message.");
        }
    }

    async getMessages(channelId: string, currentUserId: string, offset: number = 0) {
        try {
            const messages = await Message.find({ channel: new mongoose.Types.ObjectId(channelId) })
                .populate('user', 'firstName lastName avatar')
                .populate('emojis')
                .populate('fileId', 'filename path size extension')
                .populate('imagesGroup', 'filename path size extension')
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(10)
                .lean();

            const messagesFilter = messages.filter((message: any) => {
                if (message.isDeletedById?.length > 0) {
                    return !message.isDeletedById.some((deletedId: string) => deletedId === currentUserId);
                }
                return true;
            });

            const messagesFormat = messagesFilter.map((message: any) => {
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
                        id: message.user._id,
                        name: `${message.user.lastName} ${message.user.firstName}`,
                        avatar: message.user.avatar,
                    },
                    emojis: message.emojis || [],
                    file,
                    imagesGroup: message.imagesGroup || [],
                    channelId: message.channel,
                    status: "send",
                    timestamp: message.createdAt,
                    isMe: message.user._id.toString() === currentUserId,
                    messageType: message.messageType,
                    content: message.content,
                };
            });

            messagesFormat.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            return messagesFormat;
        } catch (error) {
            console.error("Error in getMessages:", error);
            throw new Error(error.message || "Failed to retrieve messages.");
        }
    }

    async getMessagesByMessageId(messageId: string) {
        try {
            const message: any = await Message.findById(new mongoose.Types.ObjectId(messageId))
                .populate('user', 'firstName lastName avatar')
                .populate('fileId', 'filename path size extension')
                .lean();

            if (!message) {
                return null;
            }

            let file = null;
            if (message.messageType === "file" && message.fileId) {
                file = {
                    id: message.fileId._id,
                    filename: message.fileId.filename,
                    path: message.fileId.path,
                    size: message.fileId.size,
                    extension: message.fileId.extension,
                };
            }

            const formattedMessage = {
                id: message._id,
                sender: {
                    id: message.user._id,
                    name: `${message.user.lastName} ${message.user.firstName}`,
                    avatar: message.user.avatar,
                },
                file,
                channelId: message.channel,
                status: "send",
                timestamp: message.createdAt,
                isMe: true, // Có thể cần kiểm tra currentUserId
                messageType: message.messageType,
                content: message.content,
                isDeletedById: message.isDeletedById || [],
            };

            return formattedMessage;
        } catch (error) {
            console.error("Error in getMessagesByMessageId:", error);
            throw new Error(error.message || "Failed to retrieve message.");
        }
    }

    async deleteHistoryMessage(senderId: string, channelId: string) {
        try {
            const senderObjId = new Types.ObjectId(senderId)
            const messages = await Message.find({ channel: new Types.ObjectId(channelId) });
            for (const message of messages) {
                message.isDeletedById = message.isDeletedById || [];
                if (!message.isDeletedById.includes(senderObjId)) {
                    message.isDeletedById.push(senderObjId);
                    await message.save();
                }
            }

            const channel = await Channel.findById(channelId);
            if (!channel) {
                throw new Error("Channel not found.");
            }
            if (!channel.deletedForUsers.some((u: any) => u.user.toString() === senderObjId)) {
                channel.deletedForUsers.push({ user: senderObjId });
                await channel.save();
            }
        } catch (error) {
            console.error("Error in deleteHistoryMessage:", error);
            throw new Error(error.message || "Failed to delete message history.");
        }
    }

    private _checkIsNotYourMessage(senderId: string, senderStoredId: string) {
        return senderStoredId !== senderId;
    }
}