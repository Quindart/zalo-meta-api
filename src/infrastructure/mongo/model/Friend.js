import mongoose from "mongoose";


const FriendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "BLOCKED"],
        default: "PENDING"
    }
},
    { timestamps: true }
);

export default mongoose.model("Friend", FriendSchema);
