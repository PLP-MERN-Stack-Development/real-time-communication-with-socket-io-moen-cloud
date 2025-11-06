import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Sidebar({ onlineUsers, onSelectUser, selectedUser }) {
  return (
    <div className="w-64 border-r border-gray-200 p-2 flex flex-col bg-gray-50">
      <h3 className="font-bold mb-2 text-lg">Online Users</h3>
      <div className="flex flex-col gap-1">
        {onlineUsers.map((user) => (
          <div
            key={user.userId}
            onClick={() => onSelectUser(user.userId)}
            className={`flex items-center cursor-pointer p-2 rounded ${
              selectedUser === user.userId ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <Avatar className="mr-2">{user.username?.[0] || "U"}</Avatar>
            <span className="flex-1">{user.username || `User ${user.userId}`}</span>
            <Badge variant="outline">{user.count}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
