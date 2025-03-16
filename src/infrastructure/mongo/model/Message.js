import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date },
  message: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  type: { type: String },
  updateAt: { type: Date, default: Date.now },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
},
 { timestamps: true }

);

export default mongoose.model("Message", MessageSchema);
