// 📁 AdminChat.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/slices/adminSlice";
import Chating from "../../components/chat/Chating";
import useChat from "../../store/slices/useChat";

const AdminChat = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    messages,
    sendMessage,
    isConnected,
    fetchConversation
  } = useChat("admin");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      const firstUserId = users[0]._id;
      setSelectedUser(firstUserId);
      fetchConversation(firstUserId);
    }
  }, [users, selectedUser, fetchConversation]);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    fetchConversation(userId);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-[90%] border border-gray-500 rounded-lg shadow-md bg-[#1a1a1a] p-4">
        <h2 className="text-2xl   font-semibold md:mb-4 text-center text-blue-400">Admin Chat Board</h2>
        <div className="flex  gap-4 ">
          {/* User List Sidebar */}
          <div className="w-[300px] max-h-[500px]  overflow-y-auto bg-gray-400 border border-gray-700  p-2">
            
            {users.map((u) => (
              <button
                key={u._id}
                className={`w-full px-4 py-2 text-left mb-1 rounded-md transition-all duration-200 ${
                  selectedUser === u._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
                onClick={() => handleUserSelect(u._id)}
              >
                {u.firstName + " " + u.lastName}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 w-[400px] ">
            {selectedUser && (
              <Chating
                userId="admin"
                targetId={selectedUser}
                messages={messages}
                sendMessage={sendMessage}
                isAdmin={true}
                classes="w-full h-[500px]  m-0 bg-gray-400"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
