import { useEffect, useState } from "react";
import { getWallet } from "../../store/slices/assetsSlice";
import Loader from "../../components/layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchFuturesTradesHistory } from "../../store/slices/futuresTradeSlice";
import { fetchPerpetualTradesHistory } from "../../store/slices/perpetualSlice";
import { fetchSpotTradesHistory } from "../../store/slices/tradeSlice";
import DepositHistory from "../../components/history/DepositHistory";
import WithdrawalHistory from "../../components/history/WithdrawalHistory";
import FuturesTradeHistory from "../../components/history/FuturesTradeHistory";
import PerpetualsTradeHistory from "../../components/history/PerpetualsTradeHistory";
import SpotTradesHistory from "../../components/history/SpotTradesHistory";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { wallet, status, error } = useSelector((state) => state.assets);
  const { futuresHistoryTrades } = useSelector((state) => state.futures);
  const { perpetualsHistoryTrades } = useSelector((state) => state.perpetual);
  const { spotHistoryTrades } = useSelector((state) => state.trade);
  console.log("spotHistoryTrades, futuresHistoryTrades, perpetualsHistoryTrades",spotHistoryTrades, futuresHistoryTrades, perpetualsHistoryTrades);
   const [mainTab, setMainTab] = useState("transactionHistory");
   const [transactionTab, setTransactionTab] = useState("deposits");
   const [tradeTab, setTradeTab] = useState("spot");

  useEffect(() => {
    dispatch(getWallet());
    dispatch(fetchFuturesTradesHistory());
    dispatch(fetchPerpetualTradesHistory());
    dispatch(fetchSpotTradesHistory());
  }, [dispatch]);

  if (status === "loading") {
    return <Loader />;
  }
  // console.log(wallet?.depositHistory)

  if (!wallet) {
    return (
      <div className="text-gray-400 border text-center p-4">
        No wallet data available.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen  text-white border">
      {/* Main Navigation */}
      <div className="flex justify-around border-b-2 border-gray-700 mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            mainTab === "transactionHistory"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setMainTab("transactionHistory")}
        >
          Transaction History
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            mainTab === "tradeHistory"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setMainTab("tradeHistory")}
        >
          Trade History
        </button>
      </div>

      {/* Sub-navigation and Content */}
      <div className="space-y-4">
        {mainTab === "transactionHistory" ? (
          <>
            {/* Transaction History Sub-navigation */}
            <div className="flex justify-around border-b-2 border-gray-700 mb-4">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  transactionTab === "deposits"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setTransactionTab("deposits")}
              >
                Deposit History
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  transactionTab === "withdrawals"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setTransactionTab("withdrawals")}
              >
                Withdrawal History
              </button>
            </div>

            {/* Transaction History Content */}
            {transactionTab === "deposits" ? (
              <DepositHistory transactions={wallet?.depositHistory} />
            ) : (
              <WithdrawalHistory transactions={wallet?.withdrawalHistory} />
            )}
          </>
        ) : (
          <>
            {/* Trade History Sub-navigation */}
            <div className="flex justify-around border-b-2 border-gray-700 mb-4">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  tradeTab === "spot"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setTradeTab("spot")}
              >
                Spot History
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  tradeTab === "futures"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setTradeTab("futures")}
              >
                Trading History
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  tradeTab === "perpetuals"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setTradeTab("perpetuals")}
              >
                Perpetuals History
              </button>
            </div>

            {/* Trade History Content */}
            {tradeTab === "spot" ? (
              <SpotTradesHistory trades={spotHistoryTrades} />
            ) : tradeTab === "futures" ? (
              <FuturesTradeHistory trades={futuresHistoryTrades} />
            ) : (
              <PerpetualsTradeHistory trades={perpetualsHistoryTrades} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
