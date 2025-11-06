import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { connectSocket, getSocket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ChatWindow = ({ room = "global" }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!token) return;

    // Connect socket
    const socket = connectSocket(token);

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${room}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    // Receive new messages
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Typing indicator
    socket.on("user-typing", ({ user: username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping && !prev.includes(username)) return [...prev, username];
        if (!isTyping) return prev.filter((u) => u !== username);
        return prev;
      });
    });

    // Reactions
    socket.on("message-reaction", ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, reactions } : msg))
      );
    });

    return () => socket.disconnect();
  }, [room, token]);

  const handleReact = (messageId, reaction) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("react", { messageId, reaction });
  };

  return (
    <div className="flex flex-col h-full border rounded">
      <MessageList
        messages={messages}
        currentUserId={user.id}
        onReact={handleReact}
        typingUsers={typingUsers}
      />
      <MessageInput room={room} />
    </div>
  );
};

export default ChatWindow;
