"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../constants/index");
const Message_1 = __importDefault(require("../../infrastructure/mongo/model/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
class MessageController {
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receiverId = req.params.receiverId;
                const senderId = req.params.senderId;
                if (!receiverId || !senderId) {
                    res.status(400).json({ message: 'Receiver ID and Sender ID are required' });
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(receiverId) || !mongoose_1.default.Types.ObjectId.isValid(senderId)) {
                    res.status(200).json([]);
                }
                const messages = yield Message_1.default.find({
                    $or: [
                        { senderId: new mongoose_1.default.Types.ObjectId(senderId), receiverId: new mongoose_1.default.Types.ObjectId(receiverId) },
                        { senderId: new mongoose_1.default.Types.ObjectId(receiverId), receiverId: new mongoose_1.default.Types.ObjectId(senderId) }
                    ]
                }).populate('senderId receiverId');
                if (!messages) {
                    res.status(200).json([]);
                }
                res.status(200).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    messages: messages
                });
            }
            catch (error) {
                console.error('Error fetching messages:', error);
                res.status(200).json([]);
            }
        });
    }
    getMessageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageId = req.params.id;
                if (!messageId) {
                    res.status(400).json({ message: 'Message ID is required' });
                }
                const message = yield Message_1.default.findById(messageId).populate('senderId').lean();
                if (!message) {
                    res.status(404).json({ message: 'Message not found' });
                }
                res.status(200).json({
                    status: index_1.HTTP_STATUS.OK,
                    success: true,
                    message: message
                });
            }
            catch (error) {
                console.error('Error fetching message by ID:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new MessageController();
