import mongoose from "mongoose";

const FCMSchema = new mongoose.Schema({
    createAt: { type: Date, default: Date.now },
    deleteAt: { type: Date },
    updateAt: { type: Date, default: Date.now },
    fcmToken: { type: String, required: true },
    user: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ]
})

export default mongoose.model("FCM", FCMSchema);