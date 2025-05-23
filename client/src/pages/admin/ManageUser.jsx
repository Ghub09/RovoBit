import axios from "axios";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../store/slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "./DeleteUser";
import { RiDeleteBin5Line } from "react-icons/ri";
import CustomModel from "../../components/mini/Model";
import API from "../../utils/api";

const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.admin);
  const [update, setUpdate] = useState([]);
  const [inActive,setInactive]=useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [active, setActive] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Update local state when users in redux change
  useEffect(() => {
    setUpdate(users);   
  }, [users]);


  
    
 const handleActive=async()=>{
      try {
      const res = await API.get(`/account/users/archived`);
      setInactive(res.data)
      console.log(inActive)
      return res.data;
  } catch (err) {
      throw err.response?.data || { message: "Server error" };
  } 

   }
  // Delete user and update local list without page reload
  const handleDelete = async (user) => {
    try {
      await deleteUser(user._id);
      const updatedUsers = update.filter((item) => item._id !== user._id);
      setUpdate(updatedUsers);
      handleActive()
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
        <div className="border flex justify-end gap-4 items-center">
          <button
            onClick={() => setActive(!active)}
            className={`px-4 py-2 m-2 border-0 rounded-full text-white font-semibold shadow-md transition-all duration-300 cursor-pointer 
    ${
      active ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
    }
  `}
          >
            {active ? "Active" : "Inactive"}
          </button>{" "}
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">User ID</th>
              <th className="border-b p-2">Email</th>
              <th className="border-b p-2">Actions</th>
              <th className="border-b p-2">{active ? 'RoleBack':'Delete'}</th>
            </tr>
          </thead>
          {active ? (
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
                        onClick={() =>
                          navigate(`/admin/users/add-tokens/${user._id}`)
                        }
                        className="bg-green-500 text-white px-2 py-1 mr-2"
                      >
                        Add Tokens
                      </Button>
                    </td>
                    <td className="border-b p-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user); 
                          setOpenDialog(true); 
                        }}
                       className="bg-red-400 hover:bg-red-500 p-2 rounded-full text-white transition-colors duration-300"

                      >
                        <RiDeleteBin5Line className="text-white" />
                      </button>
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
          ) : (
            <tbody>
              {
              inActive.map((user)=>{
             return <tr key={user._id}>
                <td className="border-b p-2">{user._id}</td>
                <td className="border-b p-2">{user.email}</td>
                <td className="border-b p-2">
                  <Button
                        onClick={() =>
                          navigate(`/admin/users/add-tokens/${user._id}`)
                        }
                        className="bg-green-500 text-white px-2 py-1 mr-2"
                      >
                        Add Tokens
                  </Button>
                </td>
                <td className="border-b p-2">Delete</td>
              </tr>

                })
              }
            </tbody>
          )}
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
