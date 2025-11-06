import React, { useState, useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const MessageInput = ({ room = "global" }) => {
  const { user, token } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    let typingTimeout;
    if (isTyping) {
      socket.emit("typing", { room, isTyping: true });
      typingTimeout = setTimeout(() => {
        socket.emit("typing", { room, isTyping: false });
        setIsTyping(false);
      }, 2000);
    }

    return () => clearTimeout(typingTimeout);
  }, [isTyping, room]);

  const handleSend = async () => {
    if (!text && !file) return;

    let attachmentUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/messages/upload`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        attachmentUrl = res.data.url;
      } catch (err) {
        console.error("File upload failed", err);
      }
    }

    const socket = getSocket();
    socket.emit("send-message", { text, room, attachmentUrl });
    setText("");
    setFile(null);
  };

  return (
    <div className="p-2 border-t flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setIsTyping(true);
          }}
          className="flex-1 border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
      {isTyping && (
        <span className="text-gray-500 text-sm">You are typing...</span>
      )}
    </div>
  );
};

export default MessageInput;
