// 📁 AdminChat.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/slices/adminSlice";
import Chating from "../../components/chat/Chating";

const AdminChat = () => {
  const adminId = "admin";
  const [selectedUser, setSelectedUser] = useState("admin");
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-[90%] border rounded-lg shadow-md bg-white p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Chat Board</h2>
        <div className="flex gap-4">
          
          {/* Sidebar - User List */}
          <div className="w-[300px] max-h-[500px] overflow-y-auto bg-gray-100 border border-gray-300 rounded-lg p-2">
            {users.map((u) => (
              <button
                key={u._id}
                className={`w-full px-4 py-2 text-left mb-1 rounded-md transition-all duration-200
                  ${selectedUser === u._id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black border"
                  }`}
                onClick={() => setSelectedUser(u._id)}
              >
                {u.firstName + " " + u.lastName}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 w-[400px] h-[600px]">
            {selectedUser && (
              <Chating
                userId={adminId}
                targetId={selectedUser}
                isAdmin={true}
                classes="w-full h-[500px]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
