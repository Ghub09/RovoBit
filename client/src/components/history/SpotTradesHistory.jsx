import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketData } from "../../store/slices/marketSlice"; // Adjust the import path
import AutoApproveSingleTrade from "../../pages/admin/AutoApproveUserSpot";
import { fetchPendingOrders, fetchUsersOpenOrders } from "../../store/slices/tradeSlice";

const SpotTradesHistory = ({ trades }) => {
  const dispatch = useDispatch();
  const { coins, status } = useSelector((state) => state.market);
  const pendingOrders = useSelector((state) => state.trade.pendingOrders);
 
  if (pendingOrders.length > 0) {
    trades = [...trades, ...pendingOrders]; 
  }
  useEffect(() => {
     dispatch(fetchPendingOrders());
  }, [dispatch]);
 useEffect(() => {
  if (trades.length > 0) {
    const timeoutId = setTimeout(() => {
      dispatch(fetchUsersOpenOrders());
    }, 10000); // 10 seconds

    return () => clearTimeout(timeoutId); // Cleanup on unmount or dependency change
  }
}, [trades, dispatch]);
  

  const getCoinImage = (symbol) => {
    let foundCoin = coins.find(
      (coin) => coin.symbol.toUpperCase() === symbol.toUpperCase()
    );
    return foundCoin?.image;
  };
  const extractBase = (asset) => {
    if (asset?.length <= 3) return asset;
    const base = asset.slice(0, 3);
    return `${base}`;
  };
  return (
    <div className="rounded-lg shadow-lg ">
      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Asset
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Time
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Quantity
              </th>

              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                TotalCost ($)
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Fee USDT (0.1%)
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 ">
            {[...trades]
          .sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt))?.map((trade, index) => (
              <>
                <AutoApproveSingleTrade key={trade._id} trade={trade} />
                <tr key={index} className="hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-2 text-sm text-gray-200 flex items-center gap-3">
                    <img
                      src={getCoinImage(extractBase(trade.asset))}
                      alt={extractBase(trade.asset)}
                      className="w-8 h-8"
                    />
                    <div>
                      <h2 className="text-lg font-bold ">
                        {extractBase(trade.asset).toUpperCase()}
                      </h2>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200 ">
                    {new Date(trade.executedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trade.type === "buy"
                          ? "bg-green-500 text-green-100"
                          : "bg-red-500 text-red-100"
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    {trade.quantity}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    {trade.totalCost}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    {((trade.totalCost * 0.1) / 100).toFixed(4)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    {trade.price}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {[...trades]
          .sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt))
          .map((trade, index) => (
            <div
              key={trade._id || index}
              className="border-b border-[#2f2f2f] p-4 shadow-md text-sm text-white"
            >
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-3">
                  <img
                    src={getCoinImage(extractBase(trade.asset))}
                    alt={extractBase(trade.asset)}
                    className="w-8 h-8"
                  />
                  <h2 className="text-lg font-bold">
                    {extractBase(trade.asset).toUpperCase()}
                  </h2>
                </span>
                <span className="text-stone-400 text-xs">
                  {new Date(trade.executedAt).toLocaleString()}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Order Type</span>
                  <span
                    className={`font-medium border px-2 py-0.5 rounded ${
                      trade.type === "buy"
                        ? "border-green-500 text-green-400"
                        : "border-red-500 text-red-400"
                    }`}
                  >
                    {trade.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{trade.quantity?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Cost ($)</span>
                  <span>{trade.totalCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span> Fee USDT (0.1%)</span>
                  <span> {((trade.totalCost * 0.1) / 100).toFixed(4)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Price</span>
                  <span>{trade.price?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpotTradesHistory;
