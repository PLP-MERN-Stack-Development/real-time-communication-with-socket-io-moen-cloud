import React, { useRef, useEffect } from "react";

const MessageList = ({ messages, currentUserId, onReact, typingUsers }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 rounded ${
            msg.senderId === currentUserId ? "bg-blue-200 self-end" : "bg-gray-200 self-start"
          }`}
        >
          <div className="text-xs text-gray-600">
            {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString()}
          </div>
          {msg.text && <div>{msg.text}</div>}
          {msg.attachmentUrl && (
            <div>
              {msg.attachmentUrl.endsWith(".png") ||
              msg.attachmentUrl.endsWith(".jpg") ? (
                <img src={msg.attachmentUrl} alt="attachment" className="max-w-xs rounded" />
              ) : (
                <a href={msg.attachmentUrl} target="_blank">
                  Download
                </a>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-1">
            {["👍", "❤️", "😂"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact(msg._id, emoji)}
                className="text-sm"
              >
                {emoji} {msg.reactions?.[emoji] || ""}
              </button>
            ))}
          </div>
        </div>
      ))}
      {typingUsers.length > 0 && (
        <div className="text-gray-500 text-sm italic">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
