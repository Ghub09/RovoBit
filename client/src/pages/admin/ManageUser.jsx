  import React, { useEffect, useState } from "react";
  import { fetchUsers } from "../../store/slices/adminSlice";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { deleteUser, profitUser } from "./DeleteUser";
  import { RiDeleteBin5Line } from "react-icons/ri";
  import CustomModel from "../../components/mini/Model";
  import BooleanToggle from "../../components/toggle/Toggle";
import axios from "axios";

  const ManageUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users } = useSelector((state) => state.admin);
    const [update, setUpdate] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
 
    // Fetch users on mount
    useEffect(() => {
      dispatch(fetchUsers());
    }, [dispatch]);

    // Update local state when users in redux change
    useEffect(() => {
      setUpdate(users);
    }, [users]);

    // Delete user and update local list without page reload
    const handleDelete = async (user) => {
      try {
        await deleteUser(user._id);
        const updatedUsers = update.filter((item) => item._id !== user._id);
        setUpdate(updatedUsers);
        console.log(`Deleted user: ${user._id}`);
      } catch (err) {
        console.log(err.message || "Failed to delete user");
      }
    };
  const handleToggle = async (user) => {
  try {
    const updatedUsers = update.map((item) =>
      item._id === user._id ? { ...item, isActive: !item.isActive } : item
    );
    setUpdate(updatedUsers);
    console.log( `Toggled user status: ${user._id} to ${!user.isActive}`);
     await axios.put(`http://localhost:5000/api/account/${user._id}/toggle`,{
  withCredentials: true
});
     
  } catch (err) {
    console.log(err.message || "Failed to update user status");
  }
};

    // Utility to truncate long strings (like user IDs)
    const truncateString = (str, num) => {
      if (str.length > num) {
        return str.slice(0, num) + "...";
      }
      return str;
    };

    return (
      <div>
        <div className="p-6 min-h-screen rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>

          <table className="w-full text-left border-collapse border">
            <thead>
              <tr className="border">
                <th className="  p-2 text-center">User ID</th>
                <th className="  p-2 text-center">Email</th>
                <th className="  p-2 text-center border">Actions</th>
                <th className="  p-2 text-center">Profit/Loss</th>
                <th className="  p-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {update.length > 0 ? (
                update.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-500 border-b transition-colors duration-300">
                    <td className="  p-2 text-center" title={user._id}>
                      {truncateString(user._id, 10)}
                    </td>
                    <td className="  p-2 text-center" title={user.email}>
                      {truncateString(user.email, 15)}
                    </td>
                    <td className="">
                      <button
                        onClick={() =>
                          navigate(`/admin/users/add-tokens/${user._id}`)
                        }
                        className="bg-green-400 hover:bg-green-600  text-white p-2 rounded-full">
                        Add Tokens
                      </button>
                    </td>
                    <td className="  py-5 flex justify-center items-center">
                      <BooleanToggle
                        value={user.isActive}
                        onChange={() => handleToggle(user)}
                      />
                    </td>
                    <td className="  p-2 text-center">
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
          </table>
        </div>
      </div>
    );
  };

  export default ManageUser;
