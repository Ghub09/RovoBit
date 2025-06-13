import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getWallet } from "../../store/slices/assetsSlice";
import OpenPerpetualPositions from "../trade/OpenPerpetualPositions";
import { fetchOpenPositions } from "../../store/slices/futuresTradeSlice";
import { fetchMarketData } from "../../store/slices/marketSlice";
import SmallLoader from "../layout/smallLoader";

const Assets = ({ type }) => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.assets);
  const { openPositions } = useSelector((state) => state.futures);
  const { coins } = useSelector((state) => state.market);
  const [usdtData, setUsdtData] = useState(null);
  const [walletValue, setWalletValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplePlatform, setIsApplePlatform] = useState(false);

  // Detect if user is on iOS/macOS
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /(mac|iphone|ipad|ipod)/i.test(userAgent);
    setIsApplePlatform(isApple);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchMarketData());
        if (type === "spot") {
          await dispatch(getWallet());
        } else if (type === "futures") {
          await dispatch(fetchOpenPositions());
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up refresh interval
    const interval = setInterval(
      () => {
        fetchData();
      },
      isApplePlatform ? 20000 : 10000
    ); // Longer interval for Apple devices

    return () => clearInterval(interval);
  }, [dispatch, type, isApplePlatform]);

  useEffect(() => {
    if (coins && coins.length > 0) {
      setUsdtData(getCoinData("USDT"));
    }
  }, [coins]);

  useEffect(() => {
    calculateWalletValue();
  }, [type, wallet, coins, openPositions]);

  const calculateWalletValue = () => {
    if (!wallet || !coins || !coins.length) return;

    let value = 0;

    switch (type) {
      case "exchange":
        // Add base USDT value
        value = wallet.exchangeWallet || 0;

        // Add value of all exchange holdings
        if (wallet.holdings && wallet.holdings.length > 0) {
          const holdingsValue = wallet.holdings.reduce(
            (total, holding) => {
              const coin = coins.find(
                (c) => c.symbol === holding.asset.toLowerCase()
              );
              if (!coin) return total;
              return (
                total + (coin.current_price || 0) * (holding.quantity || 0)
              );
            },
            0
          );
          value += holdingsValue;
        }
        break;

      case "spot":
        // Calculate spot value: wallet balance plus holdings
        value = wallet.spotWallet || 0;
        if (wallet.holdings && wallet.holdings.length > 0) {
          const holdingsValue = wallet.holdings.reduce((total, holding) => {
            const coin = coins.find(
              (c) => c.symbol === holding.asset.toLowerCase()
            );
            if (!coin) return total;
            return total + (coin.current_price || 0) * (holding.quantity || 0);
          }, 0);
          value += holdingsValue;
        }
        break;

      case "futures":
        // Base USDT value
        value = wallet.futuresWallet || 0;
        break;

      case "perpetuals":
        // Base USDT value
        value = wallet.perpetualsWallet || 0;
        break;

      default:
        value = 0;
    }

    setWalletValue(value);
  };

  const getCoinData = (symbol) => {
    if (!symbol || !coins || !coins.length) return null;
    return coins.find(
      (coin) =>
        coin &&
        coin.symbol &&
        symbol &&
        coin.symbol.toUpperCase() === symbol.toUpperCase()
    );
  };

  const calculateValue = (price, quantity) => {
    if (!price || !quantity) return 0;
    return price * quantity;
  };

  // Display a loading state if data is being fetched
  if (isLoading) {
    return (
      <div className="bg-[#242424] p-6 rounded-lg mb-6 h-[50vh] flex justify-center items-center">
        {/* <h2 className="text-lg font-semibold text-white mb-4"> */}
          <SmallLoader/>
        {/* </h2> */}
      </div>
    );
  }

  // Function to safely extract the base coin from a trading pair
  const extractBaseCoin = (pair) => {
    if (!pair) return ""; // Return empty string if pair is undefined
    // If the pair contains USDT, extract the base (e.g., BTCUSDT -> BTC)
    if (pair.includes("USDT")) {
      return pair.split("USDT")[0];
    }
    // For other formats, return the pair as is or handle appropriately
    return pair;
  };
  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      {/* Display wallet-specific total valuation at the top */}
      <div className="bg-[#1a1a1a] p-4 rounded-2xl shadow-md mb-4">
        <p className="text-lg text-gray-400">Total</p>
        <p className="text-3xl font-bold text-white">
          ${walletValue.toFixed(2) || "0.00"}{" "}
          <span className="text-gray-400 text-sm">USDT</span>
        </p>
      </div>

      <div className="block md:hidden">
        {type === "spot" ? (
          wallet?.holdings?.length > 0 ||
          (wallet?.spotWallet && wallet.spotWallet > 0) ? (
            <>
              <div className=" border-b text-gray-500">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                  <img
                    src={usdtData?.image}
                    alt={usdtData?.name}
                    className="w-8 h-8"
                  />
                  <div>
                    <h2 className="text-white font-bold ">USDT</h2>
                  </div>
                </div>
                <div className="flex justify-between my-2">
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Available Balance</span>

                    <p className="font-semibold text-gray-300">
                      {wallet?.spotWallet?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Frozen Amount</span>

                    <p className="font-semibold text-gray-300">
                      <p className="font-semibold text-gray-300">
                        {wallet.frozenAssets
                          .find((element) => element.asset === "USDT")
                          ?.quantity?.toFixed(2) || "0"}
                      </p>
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Valuation</span>
                    <p className=" font-semibold text-gray-300">
                      ≈ ${wallet.spotWallet || "0"}
                    </p>
                  </div>
                </div>
              </div>
              {wallet?.holdings?.map((holding, index) => {
                const coinData = getCoinData(holding.asset);
                return (
                  <div key={index} className=" p-3 border-b text-gray-400">
                    <div className="flex items-center gap-3">
                      <img
                        src={coinData?.image}
                        alt={coinData?.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <h2 className="text-white font-bold ">
                          {holding?.asset?.toUpperCase()}
                        </h2>
                      </div>
                    </div>
                    <div className="flex justify-between my-2">
                      <div className="text-sm text-center flex flex-col gap-2">
                        <span>Available Balance</span>

                        <p className="font-semibold text-gray-300">
                          {holding.quantity?.toFixed(5)}
                        </p>
                      </div>
                      <div className="text-sm text-center flex flex-col gap-2">
                        <span>Frozen Amount</span>

                        <p className="font-semibold text-gray-300">
                          <p className="font-semibold text-gray-300">
                            {wallet.frozenAssets
                              .find(
                                (element) => element.asset === holding.asset
                              )
                              ?.quantity?.toFixed(2) || "0"}
                          </p>
                        </p>
                      </div>
                      <div className=" text-sm text-center flex flex-col gap-2">
                        <span>Valuation</span>
                        <p className=" font-semibold text-gray-300">
                          ≈ $
                          {calculateValue(
                            coinData?.current_price,
                            holding.quantity
                          ).toFixed(5) || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className={`px-3 py-1 rounded-md bg-red-500`}>
              <p>You Have No Assets Yet</p>
            </div>
          )
        ) : type === "exchange" ? (
          wallet?.holdings?.length > 0 ||
          (wallet?.exchangeWallet && wallet.exchangeWallet > 0) ? (
            <div className="mt-6 overflow-x-auto">
              <div className="border-b text-gray-500">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                  <img
                    src={usdtData?.image}
                    alt={usdtData?.name}
                    className="w-8 h-8"
                  />
                  <div>
                    <h2 className="text-white font-bold">USDT</h2>
                  </div>
                </div>
                <div className="flex justify-between my-2">
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Available Balance</span>
                    <p className="font-semibold text-gray-300">
                      {wallet?.exchangeWallet?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Frozen Amount</span>
                    <p className="font-semibold text-gray-300">
                      <p className="font-semibold text-gray-300">
                        {wallet.frozenAssets
                          .find((element) => element.asset === "USDT")
                          ?.quantity?.toFixed(2) || "0"}
                      </p>
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Valuation</span>
                    <p className="font-semibold text-gray-300">
                      ≈ ${wallet?.exchangeWallet?.toFixed(2) || "0"}
                    </p>
                  </div>
                </div>
              </div>
              {wallet?.holdings?.map((holding, index) => {
                const coinData = getCoinData(holding.asset);
                return (
                  <div key={index} className=" p-3 border-b text-gray-400">
                    <div className="flex items-center gap-3">
                      <img
                        src={coinData?.image}
                        alt={coinData?.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <h2 className="text-white font-bold ">
                          {holding?.asset?.toUpperCase()}
                        </h2>
                      </div>
                    </div>
                    <div className="flex justify-between my-2">
                      <div className="text-sm text-center flex flex-col gap-2">
                        <span>Available Balance</span>

                        <p className="font-semibold text-gray-300">
                          {holding.quantity?.toFixed(5)}
                        </p>
                      </div>
                      <div className="text-sm text-center flex flex-col gap-2">
                        <span>Frozen Amount</span>

                        <p className="font-semibold text-gray-300">
                          <p className="font-semibold text-gray-300">
                            {wallet.frozenAssets
                              .find(
                                (element) => element.asset === holding.asset
                              )
                              ?.quantity?.toFixed(2) || "0"}
                          </p>
                        </p>
                      </div>
                      <div className=" text-sm text-center flex flex-col gap-2">
                        <span>Valuation</span>
                        <p className=" font-semibold text-gray-300">
                          ≈ $
                          {calculateValue(
                            coinData?.current_price,
                            holding.quantity
                          ).toFixed(5) || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`px-3 py-1 rounded-md bg-red-500`}>
              <p>You Have No Assets Yet</p>
            </div>
          )
        ) : type === "futures" ? (
          <div className="mt-6 overflow-x-auto">
            <div className=" border-b text-gray-500">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <img
                  src={usdtData?.image}
                  alt={usdtData?.name}
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-white font-bold ">USDT</h2>
                </div>
              </div>
              <div className="flex justify-between my-2">
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Available Balance</span>

                  <p className="font-semibold text-gray-300">
                    {wallet?.futuresWallet?.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Frozen Amount</span>

                  <p className="font-semibold text-gray-300">
                    <p className="font-semibold text-gray-300">
                      {wallet.frozenAssets
                        .find((element) => element.asset === "USDT")
                        ?.quantity?.toFixed(2) || "0"}
                    </p>
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Valuation</span>
                  <p className="font-semibold text-gray-300">
                    ≈ ${wallet?.futuresWallet?.toFixed(2) || "0"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-transparent p-2  mb-4">
              {openPositions?.length > 0 ? (
                <table className="w-full text-white">
                  <tbody>
                    {openPositions.map((trade) => {
                      const baseCoin = extractBaseCoin(trade.pair);
                      const coinData = getCoinData(baseCoin);
                      return (
                        <tr
                          key={trade._id}
                          className="border-b border-gray-700"
                        >
                          <td className="py-2 flex items-center gap-3">
                            <img
                              src={coinData?.image}
                              alt={coinData?.name || baseCoin}
                              className="w-6 h-6"
                            />
                            <span>{coinData?.name || baseCoin}</span>
                          </td>
                          <td className="py-2 capitalize">{trade.type}</td>
                          <td className="py-2">{trade.leverage}x</td>
                          <td className="py-2">
                            ${trade?.entryPrice?.toFixed(2)}
                          </td>
                          <td className="py-2 text-red-500 hidden md:table-cell">
                            ${trade?.liquidationPrice?.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No open positions</p>
              )}
            </div>
          </div>
        ) : type === "perpetuals" ? (
          <div className="mt-6 overflow-x-auto">
            <div className=" border-b text-gray-500">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <img
                  src={usdtData?.image}
                  alt={usdtData?.name}
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-white font-bold ">USDT</h2>
                </div>
              </div>
              <div className="flex justify-between my-2">
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Available Balance</span>

                  <p className="font-semibold text-gray-300">
                    {wallet?.perpetualsWallet?.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Frozen Amount</span>

                  <p className="font-semibold text-gray-300">
                    <p className="font-semibold text-gray-300">
                      {wallet.frozenAssets
                        .find((element) => element.asset === "USDT")
                        ?.quantity?.toFixed(2) || "0"}
                    </p>
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Valuation</span>
                  <p className="font-semibold text-gray-300">
                    ≈ ${wallet?.perpetualsWallet?.toFixed(2) || "0"}
                  </p>
                </div>
              </div>
            </div>
            <OpenPerpetualPositions />
          </div>
        ) : null}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="bg-[#242424] p-6 rounded-lg mb-6">
          <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
            Total
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-white">
                ${walletValue.toFixed(2) || "0.00"}{" "}
                <span className="text-gray-400 text-sm">USDT</span>
              </p>
            </div>
          </div>
        </div>

        {type === "spot" &&
          (wallet?.holdings?.length > 0 ||
            (wallet?.spotWallet && wallet.spotWallet > 0)) && (
            <div className="bg-[#242424] p-6 rounded-lg mb-6">
              <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                Your Holdings
              </h2>
              <div className="mt-4">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="py-2">Asset</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Valuation (USDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Always show USDT if it has a balance */}
                    {wallet?.spotWallet > 0 && (
                      <tr className="border-b border-gray-700 font-semibold">
                        <td className="py-2 flex items-center gap-2">
                          <img
                            src={usdtData?.image}
                            alt="USDT"
                            className="w-6 h-6"
                          />
                          USDT
                        </td>
                        <td className="py-2">
                          {wallet.spotWallet?.toFixed(2)}
                        </td>
                        <td className="py-2">
                          ${wallet.spotWallet?.toFixed(2)}
                        </td>
                      </tr>
                    )}

                    {/* Show other crypto holdings */}
                    {wallet?.holdings?.map((holding, index) => {
                      const coinData = getCoinData(holding.asset);
                      const assetValue = calculateValue(
                        coinData?.current_price,
                        holding.quantity
                      );

                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                        >
                          <td className="py-2 flex items-center gap-2">
                            <img
                              src={coinData?.image}
                              alt={coinData?.name}
                              className="w-6 h-6"
                            />
                            {holding.asset}
                          </td>
                          <td className="py-2">
                            {holding.quantity.toFixed(5)}
                          </td>
                          <td className="py-2">${assetValue.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {type === "spot" &&
          !(
            wallet?.holdings?.length > 0 ||
            (wallet?.spotWallet && wallet.spotWallet > 0)
          ) && (
            <div className="bg-[#242424] p-6 rounded-lg mb-6">
              <h2 className="bg-transparent text-lg font-semibold text-red-500">
                You Have No Assets Yet
              </h2>
            </div>
          )}

        {type === "futures" && openPositions?.length > 0 && (
          <div className="bg-[#242424] p-6 rounded-lg mb-6">
            <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
              Open Positions
            </h2>
            <div className="mt-4">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 text-left">Pair</th>
                    <th className="py-2 text-left">Type</th>
                    <th className="py-2 text-left">Leverage</th>
                    <th className="py-2 text-left">Entry Price</th>
                    <th className="py-2 text-left">Liquidation Price</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((trade) => {
                    const baseCoin = extractBaseCoin(trade.pair);
                    const coinData = getCoinData(baseCoin);
                    return (
                      <tr key={trade._id} className="border-b border-gray-700">
                        <td className="py-2 flex items-center gap-3">
                          <img
                            src={coinData?.image}
                            alt={coinData?.name || baseCoin}
                            className="w-6 h-6"
                          />
                          <span>{trade.pair}</span>
                        </td>
                        <td className="py-2 capitalize">{trade.type}</td>
                        <td className="py-2">{trade.leverage}x</td>
                        <td className="py-2">
                          ${trade?.entryPrice?.toFixed(2)}
                        </td>
                        <td className="py-2 text-red-500">
                          ${trade?.liquidationPrice?.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {type === "perpetuals" && (
          <div className="bg-[#242424] p-6 rounded-lg mb-6">
            <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
              Perpetual Positions
            </h2>
            <div className="mt-4">
              <OpenPerpetualPositions />
            </div>
          </div>
        )}

        {type === "exchange" &&
          (wallet?.holdings?.length > 0 ||
            (wallet?.exchangeWallet && wallet.exchangeWallet > 0)) && (
            <div className="bg-[#242424] p-6 rounded-lg mb-6">
              <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
                Exchange Holdings
              </h2>
              <div className="mt-4">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="py-2">Asset</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Valuation (USDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Always show USDT if it has a balance */}
                    {wallet?.exchangeWallet > 0 && (
                      <tr className="border-b border-gray-700 font-semibold">
                        <td className="py-2 flex items-center gap-2">
                          <img
                            src={usdtData?.image}
                            alt="USDT"
                            className="w-6 h-6"
                          />
                          USDT
                        </td>
                        <td className="py-2">
                          {wallet.exchangeWallet?.toFixed(2)}
                        </td>
                        <td className="py-2">
                          ${wallet.exchangeWallet?.toFixed(2)}
                        </td>
                      </tr>
                    )}

                    {/* Show other exchange holdings */}
                    {wallet?.holdings?.map((holding, index) => {
                      const coinData = getCoinData(holding.asset);
                      const assetValue = calculateValue(
                        coinData?.current_price,
                        holding.quantity
                      );

                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                        >
                          <td className="py-2 flex items-center gap-2">
                            <img
                              src={coinData?.image}
                              alt={coinData?.name}
                              className="w-6 h-6"
                            />
                            {holding.asset}
                          </td>
                          <td className="py-2">
                            {holding.quantity.toFixed(5)}
                          </td>
                          <td className="py-2">${assetValue.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {type === "exchange" &&
          !(
            wallet?.holdings?.length > 0 ||
            (wallet?.exchangeWallet && wallet.exchangeWallet > 0)
          ) && (
            <div className="bg-[#242424] p-6 rounded-lg mb-6">
              <h2 className="bg-transparent text-lg font-semibold text-red-500">
                You Have No Assets Yet
              </h2>
            </div>
          )}
      </div>
    </div>
  );
};

Assets.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Assets;
