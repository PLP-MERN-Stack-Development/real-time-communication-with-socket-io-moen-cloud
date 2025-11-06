import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: String,
  room: { type: String, default: "global" },
  senderId: String,
  senderName: String,
  toUserId: { type: String, default: null },
  attachmentUrl: String,
  reactions: { type: Object, default: {} },
  readBy: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
