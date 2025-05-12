import mongoose, { Schema, Types } from "mongoose";
import { IFCMType } from "../../../domain/entities/fcm/FCM.type";

export interface FCMDocument extends Omit<IFCMType, '_id' | 'user'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    user: Types.ObjectId[];
}

const FCMSchema: Schema<FCMDocument> = new Schema({
    createAt: { type: Date, default: Date.now },
    deleteAt: { type: Date },
    updateAt: { type: Date, default: Date.now },
    fcmToken: { type: String, required: true },
    user: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ]
})

export default mongoose.model("FCM", FCMSchema);