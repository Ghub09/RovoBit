 import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOpenPositions,
  closeFuturesTrade,
} from "../../store/slices/futuresTradeSlice";
import io from "socket.io-client";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AutoLiquidate from "../../pages/admin/AutoLiquidate";

const socket = io(import.meta.env.VITE_API_URL);
const getProfitPercentage = (trade) => {
  if (!trade?.openTime || !trade?.expiryTime) return 0;
  
  const openTime = new Date(trade.openTime).getTime();
  const expiryTime = new Date(trade.expiryTime).getTime();
  const duration = (expiryTime - openTime) / 1000; // in seconds

  if (duration >= 1296000) return 100;       // 15 days
  if (duration >= 604800) return 90;         // 7 days
  if (duration >= 259200) return 80;         // 72 hours
  if (duration >= 172800) return 70;         // 48 hours
  if (duration >= 86400) return 60;          // 24 hours
  if (duration >= 180) return 50;            // 3 minutes
  if (duration >= 150) return 40;            // 2.5 minutes
  if (duration >= 120) return 30;            // 2 minutes
  if (duration >= 60) return 20;             // 1 minute
  if (duration >= 30) return 10;             // 30 seconds
  return 0;
};

function FuturesOpenPosition({ showBtn = false }) {
  const [pnlData, setPnlData] = useState({});
  const [marketPrice, setMarketPrice] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const { openPositions, status } = useSelector((state) => state.futures);
  const { user } = useSelector((state) => state.user);
  // console.log(user.isActive)//check it and apply PNL according to this as true and false if true then profit always exist if use goes to loss else false then then user is in profit then should be in loss
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOpenPositions());
  }, [dispatch]);

  useEffect(() => {
    socket.on("liquidationUpdate", () => dispatch(fetchOpenPositions()));
    socket.on("tradeExpired", () => dispatch(fetchOpenPositions()));
    socket.on("newPosition", () => {
      dispatch(fetchOpenPositions());
    });

    return () => {
      socket.off("liquidationUpdate");
      socket.off("tradeExpired");
      socket.off("newPosition");
    };
  }, [dispatch]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketPrice(parseFloat(data.p));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);
  useEffect(() => {
  if (!marketPrice || openPositions.length === 0) return;

  const newPnlData = {};

  openPositions.forEach((trade) => {
    const { entryPrice, quantity, leverage, marginUsed } = trade;

    const profitPercentage = getProfitPercentage(trade);
    const baseProfit = (profitPercentage / 100) * marginUsed;

    let marketPnl;
    if (trade.type === "long") {
      marketPnl = (marketPrice - entryPrice) * quantity;
    } else {
      marketPnl = (entryPrice - marketPrice) * quantity;
    }

    const leveragedPnl = marketPnl * leverage;

    const tradeValue = quantity * entryPrice;
    const fee = 0.01 * tradeValue;

    let finalPnl = baseProfit + leveragedPnl - fee;

    // ✅ Custom logic based on user.isActive
    if (user?.isActive === true) {
      if (finalPnl < 0) finalPnl = Math.abs(finalPnl) + baseProfit;
    } else {
      if (finalPnl > 0) finalPnl = -Math.abs(finalPnl) + baseProfit;
    }

    newPnlData[trade._id] = finalPnl;
  });

  setPnlData(newPnlData);
}, [marketPrice, openPositions, user?.isActive]);

  useEffect(() => {
    if (openPositions.length === 0) return;

    const initialCountdowns = {};
    openPositions.forEach((trade) => {
      if (trade.expiryTime) {
        initialCountdowns[trade._id] = getTimeRemaining(
          new Date(trade.expiryTime)
        );
      }
    });
    setCountdowns(initialCountdowns);

    const interval = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const newCountdowns = { ...prevCountdowns };

        openPositions.forEach((trade) => {
          if (trade.expiryTime) {
            newCountdowns[trade._id] = getTimeRemaining(
              new Date(trade.expiryTime)
            );
          }
        });

        return newCountdowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [openPositions]);

  const getTimeRemaining = (expiryTime) => {
    const total = expiryTime - new Date();

    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds };
  };

  const formatCountdown = (countdown, trade) => {
  if (trade.isExpired || !countdown || countdown.total <= 0) {
    return "0s";
  }

  const pad = (n) => String(n).padStart(2, '0'); // pads single digits with 0

  const totalHours = countdown.days * 24 + countdown.hours;
  const hours = pad(totalHours);
  const minutes = pad(countdown.minutes);
  const seconds = pad(countdown.seconds);

  return `${hours}:${minutes}:${seconds}`;
};


  const handleCloseTrade = (tradeId) => {
    if (!tradeId) {
      toast.error("Please select a trade to close!");
      return;
    }

    if (!marketPrice) {
      toast.error("Market price not available. Try again.");
      return;
    }

    dispatch(closeFuturesTrade({ tradeId, closePrice: marketPrice }));
    dispatch(fetchOpenPositions());
  };

  return (
    <div className="mt-6 border">
      <div className="hidden md:block bg-transparent mb-4">
        {openPositions.length > 0 ? (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2">Pair</th>
                <th className="py-2">Type</th>
                <th className="py-2">Leverage</th>
                <th className="py-2">Entry Price</th>
                <th className="py-2 hidden md:table-cell">Liquidation Price</th>
                <th className="py-2">Base Profit %</th>
                <th className="py-2">PNL (USDT)</th>
                <th className="py-2">Time Remaining</th>
                {showBtn && <th className="py-2">Action</th>}
              </tr>
            </thead>
<tbody>
  {openPositions
    .filter((trade) => {
      const countdown = countdowns[trade._id];
      return countdown && countdown.total > 0 && countdown.seconds > 0;
    })
    .map((trade) => {
      const profitPercentage = getProfitPercentage(trade);
      const countdown = countdowns[trade._id];

      return (
        <tr
          key={trade._id}
          className="border-b border-gray-700 text-center"
        >
          <td className="py-2">{trade.pair}</td>
          <td className="py-2 capitalize">{trade.type}</td>
          <td className="py-2">{trade.leverage}%</td>
          <td className="py-2">${trade?.entryPrice?.toFixed(2)}</td>
          <td className="py-2 text-red-400 hidden md:table-cell">
            ${trade?.liquidationPrice?.toFixed(2)}
          </td>
          <td className="py-2 text-green-400">
            {profitPercentage}%
          </td>
          <td
            className={`py-2 font-semibold ${
              pnlData[trade._id] > 0 ? "text-green-500" : "text-red-400"
            }`}
          >
            {pnlData[trade._id] ? pnlData[trade._id]?.toFixed(2) : "--"}
          </td>
          <td className="py-2 text-yellow-400">
            {formatCountdown(countdown, trade)}
          </td>
          {showBtn && (
            <td className="py-2">
              <Button
                onClick={() => handleCloseTrade(trade._id)}
                className="px-4 py-2 rounded-md bg-[#ff5e5a]"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Closing..." : "Close Trade"}
              </Button>
            </td>
          )}
        </tr>
      );
    })}
</tbody>

          </table>
        ) : (
          <p className="text-gray-400">No open positions</p>
        )}
      </div>

      <div className="md:hidden">
        {status === "loading" && <span className="ml-2 animate-spin">⏳</span>}
        {openPositions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openPositions.map((trade) => {
              const profitPercentage = getProfitPercentage(trade);
              return (
                <div
                  key={trade._id}
                  className=" border-b border-[.1px]-[#2f2f2f] p-4 shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-semibold">
                      {trade.pair} Futures
                    </span>
                    <span className="text-[#e9b43b] bg-[#37321e] text-sm p-1 rounded-md">
                      {trade.leverage}x
                    </span>
                  </div>

                  <div className="mt-2 text-white text-sm">
                    <div className="flex justify-between">
                      <span>Base Profit %</span>
                      <span className="text-green-400">
                        {profitPercentage}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>PNL (USDT)</span>
                      <span
                        className={`font-semibold ${
                          pnlData[trade._id] > 0
                            ? "text-green-400"
                            : "text-[#ff5e5a]"
                        }`}
                      >
                        {pnlData[trade._id]
                          ? pnlData[trade._id].toFixed(2)
                          : "--"}
                      </span>
                    </div>

                    <div className="flex justify-between mt-1">
                      <span>Size ({trade?.pair?.split("/")[0]})</span>
                      <span>{trade?.quantity?.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mt-1">
                      <span>Entry Price</span>
                      <span>{trade.entryPrice?.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mt-1">
                      <span className="text-red-400">Liquidation Price</span>
                      <span className="border border-red-400 px-2 py-1 rounded-md">
                        {trade.liquidationPrice?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between mt-1">
                      <span className="text-yellow-400">Time Remaining</span>
                      <span className="border border-yellow-400 px-2 py-1 rounded-md">
                        {formatCountdown(countdowns[trade._id], trade) === "0s" ? (
                          "Liquidating..."
                        ) : (
                          formatCountdown(countdowns[trade._id], trade)
                        )}
                      </span>
                    </div>
                    
                    {/* AutoLiquidate for mobile */}
                    {formatCountdown(countdowns[trade._id], trade) === "0s" && (
                      <AutoLiquidate trade={trade} marketPrice={marketPrice} />
                    )}

                    {showBtn && (
                      <div className="w-full flex justify-center mt-3">
                        <Button
                          onClick={() => handleCloseTrade(trade._id)}
                          className="px-4 py-2 rounded-md bg-[#ff5e5a]"
                          disabled={status === "loading"}
                        >
                          {status === "loading" ? "Closing..." : "Close Trade"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No open positions</p>
        )}
      </div>
    </div>
  );
}

FuturesOpenPosition.propTypes = {
  showBtn: PropTypes.bool,
};

export default FuturesOpenPosition;
