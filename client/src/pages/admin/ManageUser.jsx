import axios from "axios";
import { Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../store/slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
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
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="border-b p-2" title={user._id}>
                    {truncateString(user._id, 10)}
                  </td>
                  <td className="border-b p-2" title={user.email}>
                    {truncateString(user.email, 15)}
                  </td>
                  <td className="border-b p-2">
                    <Button
                      onClick={() => {
                        navigate(`/admin/users/add-tokens/${user._id}`);
                      }}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Add Tokens
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