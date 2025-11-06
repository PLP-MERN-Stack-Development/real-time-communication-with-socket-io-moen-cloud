// index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("users-online", Object.values(onlineUsers));
  });

  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  socket.on("typing", (user) => {
    socket.broadcast.emit("user-typing", user);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("users-online", Object.values(onlineUsers));
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
