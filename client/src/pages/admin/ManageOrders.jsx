import { useEffect, useState } from "react";
import { Card } from "@material-tailwind/react";
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
  const [processedOrders, setProcessedOrders] = useState([]);
  const { pendingOrders } = useSelector((state) => state.trade);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPendingOrders());
  }, [dispatch]);

  // Auto-approve or reject pending orders
  useEffect(() => {
    const autoProcess = async () => {
      if (pendingOrders && pendingOrders.length > 0) {
        for (let order of pendingOrders) {
          if (order.price > 0) {
            await dispatch(approveOrder(order._id));
          } else {
            await dispatch(rejectOrder(order._id));
            setProcessedOrders((prev) => [order, ...prev]);
          }
        }
      }
    };
    autoProcess();
  }, [pendingOrders, dispatch]);

  // Listen to new orders from socket
  useEffect(() => {
    socket.on("newOrderPending", async (order) => {
      if (order.price > 0) {
        await dispatch(approveOrder(order._id));
      } else {
        await dispatch(rejectOrder(order._id));
        setProcessedOrders((prev) => [order, ...prev]);
      }
    });

    return () => socket.off("newOrderPending");
  }, [dispatch]);

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
          Rejected Orders (price = 0)
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-gray-400">Order ID</th>
              <th className="border-b p-2 text-gray-400">Type</th>
              <th className="border-b p-2 text-gray-400">Asset</th>
              <th className="border-b p-2 text-gray-400">Quantity</th>
              <th className="border-b p-2 text-gray-400">Price</th>
            </tr>
          </thead>
          <tbody>
            {processedOrders.map((order) => (
              <tr key={order._id}>
                <td className="border-b p-2">{order._id}</td>
                <td className="border-b p-2">{order.type}</td>
                <td className="border-b p-2">{order.asset}</td>
                <td className="border-b p-2">{order.quantity}</td>
                <td className="border-b p-2">${order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ManageOrders;
