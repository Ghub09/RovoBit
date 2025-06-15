import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketData } from "../store/slices/marketSlice";
import { useNavigate } from "react-router-dom";
// import Loader from "../components/layout/Loader";

function Market() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coins, status } = useSelector((state) => state.market);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketData());
    }
  }, [dispatch, status]);

  const handleBuy = () => {
    navigate("/trade");
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4">
      {/* Desktop Table Layout */}

      <div className="hidden md:block">
        <table className="min-w-full bg-transparent rounded-lg shadow-md backdrop-blur-xl">
          <thead>
            <tr className="border-y flex justify-evenly">
              <th className="px-4 py-2 w-1/5">Name</th>
              <th className="px-4 py-2 w-1/5">Symbol</th>
              <th className="px-4 py-2 w-1/5">Price</th>
              <th className="px-4 py-2 w-1/5">Market Cap</th>
              <th className="px-4 py-2 w-1/5">24h Change</th>
              <th className="px-4 py-2 w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id} className="border-b flex justify-evenly">
                <td className="px-4 py-2 w-1/5">{coin.name}</td>
                <td className="px-4 py-2 w-1/5">{coin.symbol.toUpperCase()}</td>
                <td className="px-4 py-2 w-1/5">
                  ${coin.current_price.toFixed(2)}
                </td>
                <td className="px-4 py-2 w-1/5">
                  ${coin.market_cap.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-2 w-1/5 ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td onClick={handleBuy} className="hidden cursor-pointer md:inline px-4 py-2 w-1/5 text-primary">
                  Trade
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (List Style) */}
      <div className="block md:hidden">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-3 border-b bg-[#1C1C1C] text-white"
          >
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.name} className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-bold">
                  {coin.symbol.toUpperCase()}/USDT
                </h2>
                <p className="text-gray-400 text-sm">
                  Vol: {coin.market_cap.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Middle Section */}
            <div className="text-right">
              <p className="text-lg font-semibold">
                ${coin.current_price.toFixed(2)}
              </p>
            </div>

            {/* Change Percentage */}
            <div
              className={`px-3 py-1 rounded-md ${
                coin.price_change_percentage_24h > 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;
