import { useEffect } from "react";
import axios from "axios";
import { Button, Card } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpenTrades } from "../../store/slices/adminSlice";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "https://server-1-nsr1.onrender.com", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  autoConnect: false
});

const LiquidateOpenTrades = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openTrades } = useSelector((state) => state.admin);

  useEffect(() => {
    // Fetch open trades when the component mounts
    fetchTrades();

    // Listener for new futures trades
    const handleFuturesTrade = () => {
      dispatch(fetchOpenTrades()); // Refetch open trades
    };

    // Listener for new perpetuals trades
    const handlePerpetualsTrade = () => {
      dispatch(fetchOpenTrades()); // Refetch open trades
    };

    // Listener for expired trades
    const handleTradeExpired = () => {
      dispatch(fetchOpenTrades()); // Refetch open trades when a trade expires
    };

    // Subscribe to socket events
    socket.on("newFuturesTrade", handleFuturesTrade);
    socket.on("newPerpetualsTrade", handlePerpetualsTrade);
    socket.on("tradeExpired", handleTradeExpired);

    // Clean up the socket listeners when the component unmounts
    return () => {
      socket.off("newFuturesTrade", handleFuturesTrade);
      socket.off("newPerpetualsTrade", handlePerpetualsTrade);
      socket.off("tradeExpired", handleTradeExpired);
    };
  }, [dispatch]);

  const fetchTrades = async () => {
    dispatch(fetchOpenTrades());
  };

  const fetchMarketPrice = async (pair) => {
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
      );
      return parseFloat(response.data.price);
    } catch (error) {
      console.error("Error fetching market price:", error);
      return null;
    }
  };

  const handleSendPnl = async (trade, type) => {
    const marketPrice = await fetchMarketPrice(trade.pair);
    if (marketPrice === null) {
      toast.error("Failed to fetch market price. Please try again.");
      return;
    }
    navigate(`/admin/send-pnl/${trade._id}/${marketPrice}/${type}`);
  };

  // Format date to a readable string
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Check if a trade has passed its expiry time
  const isTradeExpired = (trade) => {
    return (
      trade.isExpired ||
      (trade.expiryTime && new Date(trade.expiryTime) < new Date())
    );
  };
  console.log(openTrades)

  return (
    <Card className="min-h-screen p-4 bg-transparent text-white w-full">
      <h2 className="text-xl font-bold mb-4">
        Open Perpetual & Futures Trades
      </h2>

      {openTrades.length === 0 ? (
        <p className="text-gray-400">No open trades</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">User Name</th>
              <th className="p-2">Pair</th>
              <th className="p-2">Order Type</th>
              <th className="p-2">Trade Type</th>
              <th className="p-2">Leverage</th>
              <th className="p-2">Entry Price</th>
              <th className="p-2">Expiry Time</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {openTrades.map((trade) => (
              <tr
                key={trade._id}
                className={`border-b border-gray-800 ${
                  isTradeExpired(trade) ? "bg-red-900/20" : ""
                }`}
              >
                <td className="p-2">{trade.userId?.firstName || "N/A"}</td>
                <td className="p-2">{trade?.pair}</td>
                <td className="p-2">{trade?.type}</td>
                <td className="p-2">{trade?.category}</td>
                <td className="p-2">{trade?.leverage}x</td>
                <td className="p-2">${trade?.entryPrice}</td>
                <td className="p-2 text-yellow-400">
                  {formatDateTime(trade?.expiryTime)}
                </td>
                <td className="p-2">
                  {isTradeExpired(trade) ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                      Expired
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                      Active
                    </span>
                  )}
                </td>
                <td className="p-2">
                  <Button
                    onClick={() => handleSendPnl(trade, "profit")}
                    className="bg-green-400 hover:bg-green-500 text-white px-2 py-1 mr-2"
                  >
                    Send Profit
                  </Button>
                  <Button
                    onClick={() => handleSendPnl(trade, "loss")}
                    className="bg-red-400 hover:bg-red-500 text-white px-2 py-1"
                  >
                    Send Loss
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};

export default LiquidateOpenTrades;
