import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotTradesHistory } from "../../store/slices/tradeSlice";
import SpotTradesHistory from "../history/SpotTradesHistory";
import { fetchFuturesTradesHistory } from "../../store/slices/futuresTradeSlice";
import { fetchPerpetualTradesHistory } from "../../store/slices/perpetualSlice";
import FuturesOpenPosition from "./FuturesOpenPositions";
import OpenPerpetualPositions from "./OpenPerpetualPositions";
import FuturesTradeHistory from "../history/FuturesTradeHistory";
import PerpetualsTradeHistory from "../history/PerpetualsTradeHistory";
import { fetchUsersOpenOrders } from "../../store/slices/tradeSlice";

const OrdersRecord = ({ type, marketData }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("pending");

  const { openOrders, spotHistoryTrades, loading } = useSelector(
    (state) => state.trade
  );
  const { futuresHistoryTrades } = useSelector((state) => state.futures);
  const { perpetualsHistoryTrades } = useSelector((state) => state.perpetual);

  useEffect(() => {
    if (type === "spot") {
      dispatch(fetchSpotTradesHistory());
      dispatch(fetchUsersOpenOrders());
    } else if (type === "futures") {
      dispatch(fetchFuturesTradesHistory());
    } else if (type === "perpetual") {
      dispatch(fetchPerpetualTradesHistory());
    }
  }, [dispatch, type]);

  return (
    <div className="p-4 text-white shadow-lg w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "pending"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          {type === "spot" ? "Orders" : "Position Orders"}
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "history"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("history")}
        >
          {type === "spot" ? "Orders Record" : "Historical Orders"}
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : activeTab === "pending" ? (
              type === "spot" ? (
                <SpotTradesHistory trades={openOrders} />
              ) : type === "futures" ? (
                <FuturesOpenPosition marketData={marketData} />
              ) : (
                type === "perpetual" && (
                  <OpenPerpetualPositions
                    marketData={marketData}
                    showBtn={true}
                  />
                )
              )
            ) : type === "spot" ? (
              <SpotTradesHistory trades={spotHistoryTrades} />
            ) : type === "futures" ? (
              <FuturesTradeHistory trades={futuresHistoryTrades} />
            ) : (
              type === "perpetual" && (
                <PerpetualsTradeHistory trades={perpetualsHistoryTrades} />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersRecord;
