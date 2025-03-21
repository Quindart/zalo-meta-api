import mongoose from 'mongoose';
import Chat from '../../infrastructure/mongo/model/Chat.js';


class ChatController{
    async findOrCreateChat (userIds){
        try {

            console.log("userIds", userIds);
            const objectIdUserIds = userIds.map(id => new mongoose.Types.ObjectId(id));
    
            let chat = await Chat.findOne({ participants: { $all: objectIdUserIds, $size: objectIdUserIds.length } });
            if (!chat) {
                chat = new Chat({
                    participants: objectIdUserIds,
                });
                await chat.save();
                console.log("Chat created:", chat);
            }
            console.log("Chat find:", chat);
            return chat;
        } catch (error) {
            console.error("Error in findOrCreateChat:", error);
        }
    };

    async getChat (chatId){
        try {
            const chat = await Chat.findById(chatId).populate('participants');
            if (!chat) {
                throw new Error("Chat not found");
            }
            return chat;
        } catch (error) {
            console.error("Error in getChat:", error);
        }
    };
}

export default new ChatController();