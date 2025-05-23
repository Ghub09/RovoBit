import axios from "axios";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../store/slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "./DeleteUser";

const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.admin);
  const [update, setUpdate] = useState([]);

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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">User ID</th>
              <th className="border-b p-2">Email</th>
              <th className="border-b p-2">Actions</th>
              <th className="border-b p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {update.length > 0 ? (
              update.map((user) => (
                <tr key={user._id}>
                  <td className="border-b p-2" title={user._id}>
                    {truncateString(user._id, 10)}
                  </td>
                  <td className="border-b p-2" title={user.email}>
                    {truncateString(user.email, 15)}
                  </td>
                  <td className="border-b p-2">
                    <Button
                      onClick={() => navigate(`/admin/users/add-tokens/${user._id}`)}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Add Tokens
                    </Button>
                  </td>
                  <td className="border-b p-2">
                    <Button
                      onClick={() => handleDelete(user)}
                      className="bg-red-500 text-white px-2 py-1 mr-2"
                    >
                      Delete User
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border-b p-2 text-center">
                  No users record found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
