import mongoose, { Schema, Types } from "mongoose";
import { IFriendType } from "../../../domain/entities/friend/Friend.type";

export interface FriendDocument extends Omit<IFriendType, 'user' | '_id' | 'friend'>, Document {
    toObject(): unknown;
    _id: Types.ObjectId;
    user: Types.ObjectId;
    friend: Types.ObjectId;
}
const FriendSchema: Schema<FriendDocument> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    friend: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "BLOCKED"],
        default: "PENDING"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);

export default mongoose.model("Friend", FriendSchema);
