import { useEffect, useState } from "react";
import { Card, Button } from "@material-tailwind/react";
import axios from "axios";
import io from "socket.io-client";
import {
  approveOrder,
  fetchPendingOrders,
  rejectOrder,
} from "../../store/slices/tradeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);


const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const { pendingOrders, status, error } = useSelector((state) => state.trade);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPendingOrders());

    socket.on("newOrderPending", (order) => {
      setOrders((prevOrders) => [order, ...prevOrders]);
    });

    return () => {
      socket.off("newOrderPending");
    };
  }, []);
  const handleApprove = (orderId) => {
    dispatch(approveOrder(orderId));
  };

  const handleReject = (orderId) => {
    dispatch(rejectOrder(orderId));
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center h-20">
        <Link
          to={"/admin/dashboard"}
          className="opacity-60 hover:text-lg transition-all duration-300"
        >
          Go To Home
        </Link>
      </div>
      <Card className="p-6 border-t border-gray-500 bg-transparent mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Pending Orders
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr >
              <th className="border-b p-2 w-1/6 text-gray-400">Order ID</th>
              <th className="border-b p-2 w-1/6 text-gray-400">Type</th>
              <th className="border-b p-2 w-1/6 text-gray-400">Asset</th>
              <th className="border-b p-2 w-1/6 text-gray-400">Quantity</th>
              <th className="border-b p-2 w-1/6 text-gray-400">Price</th>
              <th className="border-b p-2 w-1/6 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pendingOrders) &&
              pendingOrders.map((order) => (
                <tr key={order._id}  >
                  <td className="border-b p-2 w-1/6">{order._id}</td>
                  <td className="border-b p-2 w-1/6">{order.type}</td>
                  <td className="border-b p-2 w-1/6">{order.asset}</td>
                  <td className="border-b p-2 w-1/6">{order.quantity}</td>
                  <td className="border-b p-2 w-1/6">${order.price}</td>
                  <td className="border-b p-2 w-1/6">
                    <Button
                      onClick={() => handleApprove(order._id)}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(order._id)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ManageOrders;
