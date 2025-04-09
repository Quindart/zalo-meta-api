import { HTTP_STATUS } from '../../constants/index.js';
import Message from '../../infrastructure/mongo/model/Message.js';
import mongoose from 'mongoose';

class MessageController {
    async getMessages(req, res) {
        try {
            const receiverId = req.params.receiverId;
            const senderId = req.params.senderId;
            if (!receiverId || !senderId) {
                return res.status(400).json({ message: 'Receiver ID and Sender ID are required' });
            }

            if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(senderId)) {
                return res.status(200).json([]);
            }

            const messages = await Message.find({
                $or: [
                    { senderId: new mongoose.Types.ObjectId(senderId), receiverId: new mongoose.Types.ObjectId(receiverId) },
                    { senderId: new mongoose.Types.ObjectId(receiverId), receiverId: new mongoose.Types.ObjectId(senderId) }
                ]
            }).populate('senderId receiverId');
            if (!messages) {
                return res.status(200).json([]);
            }
            return res.status(200).json({
                status: HTTP_STATUS.OK,
                success: true,
                messages: messages
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
            return res.status(200).json([]);
        }
    }
    async getMessageById(req, res) {
        try {
            const messageId = req.params.id;
            if (!messageId) {
                return res.status(400).json({ message: 'Message ID is required' });
            }
            const message = await Message.findById(messageId).populate('senderId').lean();
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
            return res.status(200).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: message
            });
        } catch (error) {
            console.error('Error fetching message by ID:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new MessageController();