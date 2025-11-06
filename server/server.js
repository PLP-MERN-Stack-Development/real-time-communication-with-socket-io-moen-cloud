import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import Message from "./models/Message.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(path.resolve(UPLOAD_DIR)));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*" },
  pingTimeout: 60000,
});

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
  } catch (err) {
    console.log("⚠️ Invalid Socket Token");
  }
  next();
});

function emitOnlineUsers() {
  const users = Array.from(onlineUsers.keys());
  io.emit("users-online", users);
}

io.on("connection", (socket) => {
  const user = socket.user;
  console.log("🟢 Connected:", socket.id, user?.username);

  if (user) {
    const set = onlineUsers.get(user.id) || new Set();
    set.add(socket.id);
    onlineUsers.set(user.id, set);
    emitOnlineUsers();
  }

  socket.join("global");

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.to(room).emit("notification", { type: "join", user: user?.username, room });
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    socket.to(room).emit("notification", { type: "leave", user: user?.username, room });
  });

  socket.on("send-message", async (data) => {
    const msg = new Message({
      text: data.text,
      room: data.room || "global",
      senderId: user.id,
      senderName: user.username,
      toUserId: data.toUserId || null,
      attachmentUrl: data.attachmentUrl || null,
      reactions: {},
      readBy: [],
    });
    await msg.save();

    if (msg.toUserId) {
      const recSockets = onlineUsers.get(msg.toUserId) || [];
      recSockets.forEach(id => io.to(id).emit("receive-message", msg));
      const sndSockets = onlineUsers.get(user.id) || [];
      sndSockets.forEach(id => io.to(id).emit("receive-message", msg));
    } else {
      io.to(msg.room).emit("receive-message", msg);
    }
  });

  socket.on("typing", ({ room, isTyping }) => {
    socket.to(room).emit("user-typing", { user: user.username, isTyping });
  });

  socket.on("message-read", async ({ messageId }) => {
    const msg = await Message.findById(messageId);
    if (!msg.readBy.includes(user.id)) {
      msg.readBy.push(user.id);
      await msg.save();
      io.emit("message-read", { messageId, userId: user.id });
    }
  });

  socket.on("react", async ({ messageId, reaction }) => {
    const msg = await Message.findById(messageId);
    msg.reactions[reaction] = (msg.reactions[reaction] || 0) + 1;
    await msg.save();
    io.emit("message-reaction", { messageId, reactions: msg.reactions });
  });

  socket.on("disconnect", () => {
    if (user) {
      const set = onlineUsers.get(user.id);
      set.delete(socket.id);
      if (!set.size) onlineUsers.delete(user.id);
      emitOnlineUsers();
    }
    console.log("🔴 Disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on ${process.env.PORT || 5000}`)
);
