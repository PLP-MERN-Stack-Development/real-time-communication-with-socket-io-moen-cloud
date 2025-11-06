import React from "react";

const Message = ({ msg, isOwn, onReact }) => {
  return (
    <div className={`p-2 my-1 rounded ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
      <div className="flex justify-between items-center">
        <strong>{msg.senderName}</strong>
        <span className="text-xs">{new Date(msg.createdAt).toLocaleTimeString()}</span>
      </div>
      <div>{msg.text}</div>
      {msg.attachmentUrl && (
        <img src={msg.attachmentUrl} alt="attachment" className="mt-1 max-w-xs rounded" />
      )}
      <div className="flex gap-1 mt-1">
        {["👍", "❤️", "😂"].map((r) => (
          <button key={r} onClick={() => onReact(msg._id, r)}>{r} {msg.reactions?.[r] || 0}</button>
        ))}
      </div>
    </div>
  );
};

export default Message;
