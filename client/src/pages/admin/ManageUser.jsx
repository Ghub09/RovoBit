import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../store/slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, profitUser, userHistory } from "./DeleteUser";
import { RiDeleteBin5Line } from "react-icons/ri";
import CustomModel from "../../components/mini/Model";
import BooleanToggle from "../../components/toggle/Toggle";
import HistoryModel from "../../components/mini/HistoryModel";
import { toast } from "react-toastify";
import RemoveToken from "../../components/RemoveToken/ReomoveToken.jsx";

const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.admin);
  const [openModal, setOpenModal] = useState(false);

  // const { wallet } = useSelector((state) => state.assets);
  // console.log(wallet)
  const [update, setUpdate] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [history, setHistory] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDialog = () => setIsModalOpen(!isModalOpen);

  const handleAction = () => {
    handleDialog(); // close modal
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  useEffect(() => {
    setUpdate(users);
  }, [users]);

  // Delete user and update local list without page reload
  const handleDelete = async (user) => {
    try {
      const res = await deleteUser(user._id);
      const updatedUsers = update.filter((item) => item._id !== user._id);
      setUpdate(updatedUsers);
      console.log(`Deleted user: ${user._id}`);
      toast.success(res.message || "User deleted successfully");
      
    } catch (err) {
      console.log(err.message || "Failed to delete user");
    }
  };
  const handleToggle = async (user) => {
    try {
      await profitUser(user._id);
      const updatedUsers = update.map((item) =>
        item._id === user._id ? { ...item, isActive: !item.isActive } : item
      );
      setUpdate(updatedUsers);
      console.log(`Toggled user status: ${user._id} to ${!user.isActive}`);
    } catch (err) {
      console.log(err.message || "Failed to update user status");
    }
  };

  const handleHistory = async (userId, user) => {
    try {
      const response = await userHistory(userId);
      setSelectedUser(user);
      setIsModalOpen(true);
      // console.log("User history fetched:", response.data);
      setHistory(response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error(
        "Fetch history error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Server error" };
    }
  };

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };
const handleRemoveToken=(user)=>{
  console.log(user)
  setOpenModal(true)
  setSelectedUser(user)
}
  return (
    <div>
      <div className="p-6 min-h-screen  mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>

        <table className="w-full text-left bg-gray-700  ">
          <thead>
            <tr className=" border-b">
              <th className="p-2 text-center">User</th>
              <th className="p-2 text-center">Email</th>
              <th className="p-2  ">Token</th>
              <th className="p-2  text-center">Remove Token</th>
              <th className="p-2 ">Profit</th>
              <th className="p-2 text-center">Delete</th>
              <th className="p-2 text-center">History</th>
            </tr>
          </thead>
          <tbody>
            {update.length > 0 ? (
              update.map((user) => (
              
                
                
                <tr
                  key={user._id}
                  className="hover:bg-gray-500 h-[30px]     transition-colors duration-300"
                >
                
                  <td
                    className="  p-2 text-center flex flex-col"
                    title={user.firstName}
                  >
                    <span>{user.firstName + " " + user.lastName}</span>
                    <span>{truncateString(user._id, 15)}</span>
                  </td>
                  <td className="    p-2 text-center" title={user.email}>
                    {truncateString(user.email, 15)}
                  </td>
                  <td className="   ">
                    <button
                      onClick={() =>
                        navigate(`/admin/users/add-tokens/${user._id}`)
                      }
                      className="bg-green-400 w-[60px]   hover:bg-green-600  text-white rounded-full"
                    >
                      Add
                    </button>
                  </td>
                  <td className="  ">
                    <button
                      onClick={() =>handleRemoveToken(user)}
                      className="bg-red-400 px-3  flex justify-self-center  hover:bg-red-600 text-center  text-white rounded-full"
                    >
                      Remove
                    </button>
                  </td>
                  <td>
                    <BooleanToggle
                      value={user.isActive}
                      onChange={() => handleToggle(user)}
                    />
                  </td>
                  <td className="    p-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDialog(true);
                      }}
                      className="bg-red-400 hover:bg-red-600 p-2 rounded-full text-white transition-colors duration-300"
                    >
                      <RiDeleteBin5Line className="text-white" />
                    </button>
                  </td>
                  <td className="    p-2 text-center">
                    <button
                      onClick={() => handleHistory(user._id, user)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      History
                    </button>
                  </td>
                </tr>
                
              ))
            ) : (
              <tr>
                <td colSpan="4" className="  p-2 text-center">
                  No users record found
                </td>
              </tr>
            )}
          </tbody>
          <HistoryModel
            openDialog={isModalOpen}
            handleDialog={handleDialog}
            labels={history}
            handleAction={handleAction}
            action="Delete"
            cancel="Cancel"
            user={selectedUser}
          />
          <CustomModel
            openDialog={openDialog}
            handleDialog={() => setOpenDialog(false)}
            label="Are you sure you want to delete this user?"
            action="Delete"
            cancel="Cancel"
            handleAction={() => {
              handleDelete(selectedUser); // confirm deletion
              setOpenDialog(false); // close modal
            }}
          />
            <RemoveToken
                    openModal={openModal}
                    handleCloseModal={() => setOpenModal(false)}
                    user={selectedUser}
                  />
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
