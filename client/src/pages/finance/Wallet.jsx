import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaExchangeAlt,
  FaArrowDown,
  FaArrowUp,
  FaSyncAlt,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import {
  fetchExchangeRate,
  getWallet,
  swapAssets,
  transferFunds,
} from "../../store/slices/assetsSlice";
import {
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import Assets from "../../components/wallet/Assets";
import { fetchMarketData } from "../../store/slices/marketSlice";

const validPairs = {
  USDT: ["ETH", "BTC", "BNB", "ADA", "SOL", "XRP", "DOT"],
  ETH: ["USDT", "BTC", "BNB", "ADA", "SOL", "XRP", "DOT"],
  BTC: ["USDT", "ETH", "BNB", "ADA", "SOL", "XRP", "DOT"],
  BNB: ["USDT", "ETH", "BTC", "ADA", "SOL", "XRP", "DOT"],
  ADA: ["USDT", "ETH", "BTC", "BNB", "SOL", "XRP", "DOT"],
  SOL: ["USDT", "ETH", "BTC", "BNB", "ADA", "XRP", "DOT"],
  XRP: ["USDT", "ETH", "BTC", "BNB", "ADA", "SOL", "DOT"],
  DOT: ["USDT", "ETH", "BTC", "BNB", "ADA", "SOL", "XRP"],
};
const transferablePairs = [
  "USDT",
  "USDC",
  "ETH",
  "BTC",
  "BNB",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "MATIC",
  "DOTUS",
  "LTC",
];
const Wallet = () => {
  const [open, setOpen] = useState(false);
  const [fromAsset, setFromAsset] = useState("");
  const [toAsset, setToAsset] = useState("ETH");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1);
  const { wallet, exchangeRate } = useSelector((state) => state.assets);
  const { coins } = useSelector((state) => state.market);
  // Handle Fund Transfer
  const [transferOpen, setTransferOpen] = useState(false);
  const [fromWallet, setFromWallet] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [showAssets, setShowAssets] = useState(false);
  const [assetsType, setAssetsType] = useState("");
  const [transferAsset, setTransferAsset] = useState("USDT");
  const [totalValue, setTotalValue] = useState(0);

  // const [walletValueExchange, setWalletValueExchange] = useState(0);
  const [walletValueSpot, setWalletValueSpot] = useState(0);
  const [walletValueFutures, setWalletValueFutures] = useState(0);
  const [walletValuePerpetuals, setWalletValuePerpetuals] = useState(0);

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchMarketData());
    dispatch(getWallet());

    // Set up only one interval for all data refreshes to reduce API calls
    const interval = setInterval(() => {
      dispatch(getWallet());

      // Only fetch market data every 30 seconds to avoid rate limiting
      // We're using a timestamp comparison to throttle the API calls
      const lastFetchTime = localStorage.getItem("lastMarketDataFetch");
      const currentTime = Date.now();

      if (!lastFetchTime || currentTime - lastFetchTime > 30000) {
        dispatch(fetchMarketData());
        localStorage.setItem("lastMarketDataFetch", currentTime);
      }
    }, 10000);

    return () => clearInterval(interval); // Cleanup
  }, [dispatch]);

  useEffect(() => {
    calculateTotalValue();
    calculateWalletValues();
  }, [coins, wallet]);

  const calculateWalletValues = () => {
    if (!wallet || !coins.length) return;

    // Calculate Exchange Wallet Value
    // let exchangeValue = wallet.exchangeWallet || 0;
    // if (wallet.exchangeHoldings && wallet.exchangeHoldings.length > 0) {
    //   const holdingsValue = wallet.exchangeHoldings.reduce((total, holding) => {
    //     const coin = coins.find(
    //       (c) => c.symbol === holding.asset.toLowerCase()
    //     );
    //     if (!coin) return total;
    //     return total + coin.current_price * holding.quantity;
    //   }, 0);
    //   exchangeValue += holdingsValue;
    // }
    // setWalletValueExchange(exchangeValue);

    // Calculate Spot Wallet Value
    let spotValue = wallet.spotWallet || 0;
    if (wallet.holdings && wallet.holdings.length > 0) {
      const holdingsValue = wallet.holdings.reduce((total, holding) => {
        const coin = coins.find(
          (c) => c.symbol === holding.asset.toLowerCase()
        );
        if (!coin) return total;
        return total + coin.current_price * holding.quantity;
      }, 0);
      spotValue += holdingsValue;
    }
    setWalletValueSpot(spotValue);

    // Futures and Perpetuals are just their USDT balance for now
    setWalletValueFutures(wallet.futuresWallet || 0);
    setWalletValuePerpetuals(wallet.perpetualsWallet || 0);
  };

  const calculateTotalValue = () => {
    // Calculate value of spot holdings
    const holdingsValue =
      wallet?.holdings?.reduce((total, holding) => {
        const coin = coins?.find(
          (c) => c.symbol === holding.asset.toLowerCase()
        );
        if (!coin) {
          console.warn(`Coin data not found for asset: ${holding.asset}`);
          return total;
        }
        return total + coin.current_price * holding.quantity;
      }, 0) || 0;

    // Calculate value of exchange holdings
    const exchangeHoldingsValue =
      wallet?.exchangeHoldings?.reduce((total, holding) => {
        const coin = coins?.find(
          (c) => c.symbol === holding.asset.toLowerCase()
        );
        if (!coin) {
          return total;
        }
        return total + coin.current_price * holding.quantity;
      }, 0) || 0;

    // Sum all wallet balances
    const totalWalletValue =
      (wallet?.spotWallet || 0) +
      // (wallet?.exchangeWallet || 0) +
      (wallet?.futuresWallet || 0) +
      (wallet?.perpetualsWallet || 0);

    setTotalValue(holdingsValue + exchangeHoldingsValue + totalWalletValue);
  };

  useEffect(() => {
    if (fromAsset && validPairs[fromAsset]) {
      // Reset 'toAsset' to the first valid option if the current 'toAsset' is invalid
      if (!validPairs[fromAsset].includes(toAsset)) {
        setToAsset(validPairs[fromAsset][0]);
      }
    }
  }, [fromAsset, toAsset]);

  useEffect(() => {
    dispatch(fetchExchangeRate({ fromAsset, toAsset }));
  }, [dispatch, fromAsset, toAsset]);

  const handleSwap = async () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    dispatch(fetchExchangeRate({ fromAsset, toAsset }));
    try {
      dispatch(
        swapAssets({ fromAsset, toAsset, amount, exchangeRate })
      ).unwrap();
      setOpen(false);
    } catch {
      setOpen(false);
    }
  };

  // Fund Transfer Handler
  const handleTransfer = async () => {
    if (!transferAmount || !fromWallet || !toWallet) {
      toast.error("Please fill in all fields");
      return;
    }
    if (fromWallet === toWallet) {
      toast.error("From and To wallets cannot be the same");
      return;
    }

    try {
      await dispatch(
        transferFunds({
          fromWallet,
          toWallet,
          amount: transferAmount,
          transferAsset,
        })
      ).unwrap();
      setTransferOpen(false);

      // Reset fields after successful transfer
      setFromWallet("");
      setToWallet("");
      setTransferAsset("USDT");
      setTransferAmount("");
    } catch {
      setTransferOpen(false);
    }
  };

  const handleAssetsRendering = (type) => {
    setAssetsType(type);
    setShowAssets(true);

    // Optional: We could also store this in localStorage to persist the state
    // even if the page refreshes
    localStorage.setItem("selectedWalletType", type);
    localStorage.setItem("showAssets", "true");
  };

  // Add this effect to restore wallet view state on component mount
  useEffect(() => {
    // Check if we have saved state in localStorage
    const savedWalletType = localStorage.getItem("selectedWalletType");
    const savedShowAssets = localStorage.getItem("showAssets");

    if (savedShowAssets === "true" && savedWalletType) {
      setAssetsType(savedWalletType);
      setShowAssets(true);
    }
  }, []);

  // Add a handler function for the back button
  const handleBackToWallet = () => {
    setShowAssets(false);
    localStorage.removeItem("selectedWalletType");
    localStorage.removeItem("showAssets");
  };
  // console.log(wallet)
  // console.log(showAssets)
  return (
    <div className="min-h-[100vh] mx-auto md:px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold text-white mb-6">My Wallet</h1>

          {!showAssets ? (
            <>
              {/* Total Assets Section */}
              <div className="bg-[#242424] p-6 rounded-lg mb-6">
                <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                  Total Assets
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      ${totalValue?.toFixed(2) || "0.00"}{" "}
                      <span className="text-gray-400 text-sm">USDT</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* My Account Section */}
              <div className="mb-6 ">
                <h2 className="text-3xl text-center font-semibold text-white mb-4">
                  My Account
                </h2>
                {/* <div className="grid   grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   <div
                    className="bg-[#242424] border  p-6 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => handleAssetsRendering("spot")}
                  >
                    <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                      Spot Asset
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-white">
                          ${walletValueSpot?.toFixed(2) || "0.00"}{" "}
                          <span className="text-gray-400 text-sm">USDT</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-[#242424] p-6 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => handleAssetsRendering("futures")}
                  >
                    <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                      Trading Asset
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-white">
                          ${walletValueFutures?.toFixed(2) || "0.00"}{" "}
                          <span className="text-gray-400 text-sm">USDT</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-[#242424] p-6 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => handleAssetsRendering("perpetuals")}
                  >
                    <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                      Perpetual Asset
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-white">
                          ${walletValuePerpetuals?.toFixed(2) || "0.00"}{" "}
                          <span className="text-gray-400 text-sm">USDT</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
               </div> */}
                <div className="   flex items-center justify-center px-4">
                  <div className="   flex justify-around w-[100%] items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-around">
                    <div
                      className="bg-[#242424]   w-[25%] p-6 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                      onClick={() => handleAssetsRendering("spot")}
                    >
                      <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                        Spot Asset
                      </h2>
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <p className="text-3xl font-bold text-white">
                            ${walletValueSpot?.toFixed(2) || "0.00"}{" "}
                            <span className="text-gray-400 text-sm">USDT</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="bg-[#242424] w-[25%] p-6 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                      onClick={() => handleAssetsRendering("futures")}
                    >
                      <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                        Trading Asset
                      </h2>
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <p className="text-3xl font-bold text-white">
                            ${walletValueFutures?.toFixed(2) || "0.00"}{" "}
                            <span className="text-gray-400 text-sm">USDT</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="bg-[#242424] w-[25%] p-6 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                      onClick={() => handleAssetsRendering("perpetuals")}
                    >
                      <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                        Perpetual Asset
                      </h2>
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <p className="text-3xl font-bold text-white">
                            ${walletValuePerpetuals?.toFixed(2) || "0.00"}{" "}
                            <span className="text-gray-400 text-sm">USDT</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-4 sm:gap-2">
                <button
                  onClick={() => navigate("/wallet/deposit")}
                  className="flex px-4 cursor-pointer
 py-2 text-sm sm:text-base text-white font-medium rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow"
                >
                  Deposit
                </button>

                <button
                  onClick={() => navigate("/wallet/withdraw")}
                  className="flex px-4 cursor-pointer
 py-2 text-sm sm:text-base text-white font-medium rounded-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300 shadow"
                >
                  Withdraw
                </button>

                <button
                  onClick={() => setOpen(true)}
                  className="flex px-4 cursor-pointer
 py-2 text-sm sm:text-base text-white font-medium rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition duration-300 shadow"
                >
                  Swap
                </button>

                <button
                  onClick={() => setTransferOpen(true)}
                  className="flex px-4 cursor-pointer
 py-2 text-sm sm:text-base text-white font-medium rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 transition duration-300 shadow"
                >
                  Transfer
                </button>
              </div>

              {/* Holdings Section */}
              <Card className="bg-[#242424] p-6 rounded-lg mb-6">
                <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                  Your Holdings
                </h2>
                <CardBody>
                  {wallet?.holdings?.length > 0 ? (
                    <table className="w-full text-left text-white">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                          <th className="py-2">Asset</th>
                          <th className="py-2">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wallet.holdings.map((holding, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                          >
                            <td className="py-2">{holding.asset}</td>
                            <td className="py-2">{holding.quantity}</td>
                            {/* <td className="py-2">${holding.value.toFixed(2)}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400">
                      No assets found in your wallet.
                    </p>
                  )}
                </CardBody>
              </Card>

              {/* Deposit & Withdrawal History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deposit History */}
                <Card className="bg-[#242424] p-6 rounded-lg border border-gray-100">
                  <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                    Deposit History
                  </h2>
                  <CardBody>
                    {wallet?.depositHistory?.length > 0 ? (
                      <ul className="text-white">
                        {wallet.depositHistory.map((tx, index) => (
                          <li
                            key={index}
                            className="flex justify-between py-2 border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                          >
                            <span>
                              {new Date(tx.createdAt).toLocaleString()}
                            </span>
                            <span>{tx.currency}</span>
                            <span className="text-green-500">
                              <AiOutlineArrowDown className="inline-block" /> $
                              {tx.amount?.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No deposits yet.</p>
                    )}
                  </CardBody>
                </Card>

                {/* Withdrawal History */}
                <Card className="bg-[#242424] p-6 rounded-lg">
                  <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                    Withdrawal History
                  </h2>
                  <CardBody>
                    {wallet?.withdrawalHistory?.length > 0 ? (
                      <ul className="text-white">
                        {wallet.withdrawalHistory.map((tx, index) => (
                          <li
                            key={index}
                            className="flex justify-between py-2 border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                          >
                            <span>
                              {new Date(tx.createdAt).toLocaleString()}
                            </span>
                            <span className="text-red-500">
                              <AiOutlineArrowUp className="inline-block" /> $
                              {tx.amount?.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No withdrawals yet.</p>
                    )}
                  </CardBody>
                </Card>
              </div>
            </>
          ) : (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <button
                  onClick={handleBackToWallet}
                  className="mr-3 text-gray-400 hover:text-white flex items-center"
                >
                  <span>←</span> <span className="ml-1">Back to Wallet</span>
                </button>
                <h2 className="text-2xl font-semibold text-white">
                  {assetsType === "spot"
                    ? "Spot Assets"
                    : assetsType === "futures"
                    ? "Trading Assets"
                    : assetsType === "perpetuals"
                    ? "Perpetual Assets"
                    : "Exchange Wallet"}
                </h2>
              </div>
              <Assets type={assetsType} />
            </div>
          )}
        </div>
        {/* for mobile screens */}
        <div className="md:hidden bg-darkGray min-h-screen p-4 text-lightGray">
          {/* My Assets */}
          <div className="max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold mb-2">
                {showAssets ? (
                  <div className="flex items-center">
                    <button
                      onClick={handleBackToWallet}
                      className="mr-2 text-gray-400 hover:text-white"
                    >
                      ← Back
                    </button>
                    <span>
                      {assetsType === "spot"
                        ? "Spot Assets"
                        : assetsType === "futures"
                        ? "Trading Assets"
                        : assetsType === "perpetuals"
                        ? "Perpetual Assets"
                        : "Exchange Wallet"}
                    </span>
                  </div>
                ) : (
                  "My assets"
                )}
              </h2>
              <div
                className="flex gap-1 items-center text-gray-600 cursor-pointer"
                onClick={() => {
                  navigate("/wallet/histories");
                }}
              >
                History
                <MdHistory />
              </div>
            </div>
            {!showAssets && (
              <div className="bg-[#1a1a1a] p-4 rounded-2xl shadow-md">
                <p className="text-lg">Total Assets</p>
                <p className="text-3xl font-bold text-white">
                  ${totalValue?.toFixed(2) || "0.00"}{" "}
                  <span className="text-gray-400 text-sm">USDT</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!showAssets && (
              <div className="flex justify-between my-4">
                <button
                  className="flex flex-col items-center p-2 hover:text-electricBlue transition"
                  onClick={() => navigate("/wallet/withdraw")}
                >
                  <FaArrowUp size={20} />
                  Withdraw
                </button>
                <button
                  className="flex flex-col items-center p-2 hover:text-electricBlue transition"
                  onClick={() => navigate("/wallet/deposit")}
                >
                  <FaArrowDown size={20} />
                  Deposit
                </button>

                <button
                  className="flex flex-col items-center p-2 hover:text-electricBlue transition"
                  onClick={() => setOpen(true)}
                >
                  <FaSyncAlt size={20} />
                  Swap
                </button>
                <button
                  className="flex flex-col items-center p-2 hover:text-electricBlue transition"
                  onClick={() => setTransferOpen(true)}
                >
                  <FaExchangeAlt size={20} />
                  Transfer
                </button>
              </div>
            )}
          </div>

          {/* My wallets Section */}
          {showAssets ? (
            <Assets type={assetsType} />
          ) : (
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-2">My account</h2>
              <div className="space-y-2">
                {/* <div
                  className="bg-transparent border-[.1px] border-[#393939] p-4 rounded-2xl shadow-md hover:bg-gray-700 transition cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleAssetsRendering("exchange");
                  }}
                >
                  <div>
                    <p className="text-lg">Exchange Wallet</p>
                    <p className="text-2xl font-bold">
                      ${walletValueExchange?.toFixed(2) || "0.00"}{" "}
                      <span className="text-sm">USDT</span>
                    </p>
                  </div>
                  <div className="text-3xl">
                    <IoIosArrowForward />
                  </div>
                </div> */}
                <div
                  className="bg-transparent border-[.1px] border-[#393939] p-4 rounded-2xl shadow-md hover:bg-gray-700 transition cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleAssetsRendering("spot");
                  }}
                >
                  <div>
                    <p className="text-lg">Spot Asset</p>
                    <p className="text-2xl font-bold">
                      ${walletValueSpot?.toFixed(2) || "0.00"}{" "}
                      <span className="text-sm">USDT</span>
                    </p>
                  </div>
                  <div className="text-3xl">
                    <IoIosArrowForward />
                  </div>
                </div>
                <div
                  className="bg-transparent border-[.1px] border-[#393939] p-4 rounded-2xl shadow-md hover:bg-gray-700 transition cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleAssetsRendering("futures");
                  }}
                >
                  <div>
                    <p className="text-lg">Trading Asset</p>
                    <p className="text-2xl font-bold">
                      ${walletValueFutures?.toFixed(2) || "0.00"}{" "}
                      <span className="text-sm">USDT</span>
                    </p>
                  </div>
                  <div className="text-3xl">
                    <IoIosArrowForward />
                  </div>
                </div>
                <div
                  className="bg-transparent border-[.1px] border-[#393939] p-4 rounded-2xl shadow-md hover:bg-gray-700 transition cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleAssetsRendering("perpetuals");
                  }}
                >
                  <div>
                    <p className="text-lg">Perpetual Asset</p>
                    <p className="text-2xl font-bold">
                      ${walletValuePerpetuals?.toFixed(2) || "0.00"}{" "}
                      <span className="text-sm">USDT</span>
                    </p>
                  </div>
                  <div className="text-3xl">
                    <IoIosArrowForward />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Swap Funds */}
        <Dialog open={open} handler={() => setOpen(false)} size="sm">
          <DialogHeader className="text-white bg-[#1a1a1a] flex justify-between">
            <span>Swap</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </DialogHeader>
          <DialogBody className="bg-[#1a1a1a] text-white p-6">
            {/* From Currency */}
            <div className="mb-4">
              <label className="block mb-1">From</label>
              <select
                className="w-full border-[.2px] border-gray-400 p-2 rounded"
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
              >
                <option value="" disabled>
                  Select a Currency
                </option>
                {Object.keys(validPairs).map((asset) => (
                  <option key={asset} value={asset} className="bg-[#1a1a1a]">
                    {asset}
                  </option>
                ))}
              </select>
            </div>

            {/* To Currency */}
            <div className="mb-4">
              <label className="block mb-1">To</label>
              <select
                className="w-full border-[.2px] border-gray-400 p-2 rounded"
                value={toAsset}
                onChange={(e) => setToAsset(e.target.value)}
                disabled={!fromAsset} // Disable if 'fromAsset' is not selected
              >
                <option value="" disabled>
                  Select a Currency
                </option>
                {validPairs[fromAsset]?.map((asset) => (
                  <option key={asset} value={asset} className="bg-[#1a1a1a]">
                    {asset}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block mb-1">Exchange Amount</label>
              <input
                type="number"
                className="w-full border-[.2px] border-gray-400 p-2 rounded"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Exchange Rate Display */}
            <p className="text-sm mb-4">
              Current Exchange Rate: {amount} {fromAsset} ={" "}
              {amount * exchangeRate} {toAsset}
            </p>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="bg-blue-500 w-full py-2 rounded"
            >
              Exchange
            </button>
          </DialogBody>
        </Dialog>
        {/* Transfer Funds */}
        <Dialog
          open={transferOpen}
          handler={() => setTransferOpen(false)}
          size="sm"
        >
          <DialogHeader className="text-white bg-[#1a1a1a] flex justify-between">
            <span>Transfer Funds</span>
            <button onClick={() => setTransferOpen(false)}>✖</button>
          </DialogHeader>
          <DialogBody className="bg-[#1a1a1a] text-white p-6">
            {/* From Wallet (Dropdown) */}
            <div className="mb-4">
              <label className="block mb-1">From Wallet</label>
              <select
                className="w-full border-[.2px] border-gray-400 p-2 rounded"
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
              >
                <option value="" disabled>
                  Select Wallet
                </option>
                {/* Default empty option */}
                {/* <option className="bg-[#1a1a1a]" value="exchangeWallet">
                  Exchange Wallet
                </option> */}
                <option className="bg-[#1a1a1a]" value="spotWallet">
                  Spot Wallet
                </option>
                <option className="bg-[#1a1a1a]" value="futuresWallet">
                  Trading Wallet
                </option>
                <option className="bg-[#1a1a1a]" value="perpetualsWallet">
                  Perpetual Wallet
                </option>
              </select>
            </div>

            {/* To Wallet (Dropdown) */}
            <div className="mb-4">
              <label className="block mb-1">To Wallet</label>
              <select
                className="w-full border-[.2px] border-gray-400 p-2 rounded"
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
              >
                <option value="" disabled>
                  Select Wallet
                </option>{" "}
                {/* Default empty option */}
                {/* <option className="bg-[#1a1a1a]" value="exchangeWallet">
                  Exchange Wallet
                </option> */}
                <option className="bg-[#1a1a1a]" value="spotWallet">
                  Spot Wallet
                </option>
                <option className="bg-[#1a1a1a]" value="futuresWallet">
                  Trading Wallet
                </option>
                <option className="bg-[#1a1a1a]" value="perpetualsWallet">
                  Perpetual Wallet
                </option>
              </select>
            </div>

            {(fromWallet === "exchangeWallet" && toWallet === "spotWallet") ||
            (fromWallet === "spotWallet" && toWallet === "exchangeWallet") ? (
              <div className="mb-4">
                <label className="block mb-1">Select Currency</label>
                <select
                  className="w-full border-[.2px] border-gray-400 p-2 rounded"
                  value={transferAsset}
                  onChange={(e) => setTransferAsset(e.target.value)}
                >
                  <option className="bg-[#1a1a1a]" value="" disabled>
                    Select Currency
                  </option>
                  {transferablePairs.map((asset) => (
                    <option key={asset} value={asset} className="bg-[#1a1a1a]">
                      {asset}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block  mb-1">Amount</label>
              <input
                type="number"
                className="w-full border-[.2px] border-gray-400 p-2 rounded"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>

            {/* Transfer Button */}
            <button
              onClick={handleTransfer}
              className="bg-blue-500 w-full py-2 rounded"
            >
              Transfer Funds
            </button>
          </DialogBody>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Wallet;
