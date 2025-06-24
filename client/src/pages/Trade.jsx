import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import TradingChart from "../components/trade/TradingChart";
import OrderForm from "../components/trade/OrderForm";
import RecentTrades from "../components/trade/RecentTrades";
import OrderBook from "../components/trade/OrderBook";
import io, { WebSocket } from "socket.io-client";
import AnimatedHeading from "../components/animation/AnimateHeading";
import { MdCandlestickChart } from "react-icons/md";
import OrdersRecord from "../components/trade/OrdersRecord";
import Loader from "../components/layout/Loader";
import axios from "axios";

function Trade() {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const [recentTrades, setRecentTrades] = useState([]);
  const showChart = useSelector((state) => state.global.showChart);
    const candleSeriesRef = useRef(null);
  
  const tradingPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "MATICUSDT",
    "DOTUSDT",
    "LTCUSDT",
  ];

  console.log(recentTrades)
  const formatTradingPair = (pair) => {
    if (pair.length <= 4) return pair; // Handle edge cases (e.g., "USDT")

    const index = pair.length - 4; // Find the index where "/" should be inserted

    return `${pair.slice(0, index)}/${pair.slice(index)}`; // Insert "/" before "USDT"
  };

  const { symbol } = useParams();
  // const dispatch = useDispatch();
  const { coins } = useSelector((state) => state.market);

  const selectedCoin = coins.find(
    (coin) => coin.symbol.toLowerCase() === symbol
  );
  useEffect(() => {
    const fetchMarketData = async () => {
   
         try {
           const response = await axios.get(
             `https://api.binance.com/api/v3/klines`, // ✅ Global Binance
             {
               params: {
                 symbol: selectedPair,
                 interval: selectedInterval,
               },
             }
           );
       
           const formattedData = response.data.map((candle) => ({
             time: Math.floor(candle[0] / 1000),
             open: parseFloat(candle[1]),
             high: parseFloat(candle[2]),
             low: parseFloat(candle[3]),
             close: parseFloat(candle[4]),
             volume: parseFloat(candle[5]),
           }));
       
           // console.log("Fetched candles:", response.data);
           setMarketData(formattedData);
       
           // If using a chart ref (like Lightweight Charts):
           if (candleSeriesRef?.current) {
             candleSeriesRef.current.setData(formattedData);
           }
         } catch (error) {
           console.error("Error fetching market data:", error?.message);
         }
       };
       
       fetchMarketData();
       const interval = setInterval(fetchMarketData, 60000);
   
       return () => clearInterval(interval);
     }, [selectedPair, selectedInterval]);
   
     // WebSocket for real-time updates
    useEffect(() => {
  const fetchMarketData = async () => {
    try {
      // Map your selected pair (like BTCUSDT) to Kraken's format
      // const krakenPairs = {
      //   BTCUSDT: "XXBTZUSD",
      //   ETHUSDT: "XETHZUSD",
      //   DOGEUSDT: "XXDGZUSD",
      //   MATICUSDT: "MATICUSD",
      //   BNBUSDT: "BNBUSD",
      // };

      const krakenPair = tradingPairs[selectedPair] || "XXBTZUSD";

      // Interval mapping: Kraken accepts minutes (e.g., 60 = hourly, 1440 = daily)
      const interval = selectedInterval === "1d" ? 1440 : 60;

      const response = await axios.get("https://api.kraken.com/0/public/OHLC", {
        params: {
          pair: krakenPair,
          interval,
        },
      });

      const ohlcData = response.data.result[krakenPair];

      if (!Array.isArray(ohlcData)) {
        throw new Error("Invalid OHLC data format from Kraken");
      }

      const formattedData = ohlcData.map((entry) => ({
        time: Number(entry[0]), // UNIX timestamp in seconds
        open: parseFloat(entry[1]),
        high: parseFloat(entry[2]),
        low: parseFloat(entry[3]),
        close: parseFloat(entry[4]),
        volume: parseFloat(entry[6]), // Volume from Kraken data
      }));

      setMarketData(formattedData);

      if (candleSeriesRef?.current) {
        candleSeriesRef.current.setData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching market data from Kraken:", error.message);
    }
  };

  fetchMarketData();
  const intervalId = setInterval(fetchMarketData, 60000); // Refresh every 60s

  return () => clearInterval(intervalId);
}, [selectedPair, selectedInterval]);
   

  // WebSocket for real-time trade updates
  // useEffect(() => {
  //   const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);
 
  //   socket.on("tradeUpdate", (trade) => {
  //     setRecentTrades((prevTrades) => [trade, ...prevTrades.slice(0, 9)]);
  //   });

  //   return () => {
  //     socket.off("tradeUpdate");
  //     socket.disconnect();
  //   };
  // }, []);
  
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "https://server-1-nsr1.onrender.com", {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error in trade:", err.message);
    });

    socket.on("tradeUpdate", (trade) => {
      if (trade && typeof trade === 'object') {
        setRecentTrades((prevTrades) => [trade, ...prevTrades.filter(Boolean).slice(0, 9)]);
      }
    });

    return () => {
      socket.off("tradeUpdate");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);


  const currentMarketPrice =
    marketData.length > 0 ? marketData[marketData.length - 1].close : 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto md:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        
        <div className="flex justify-between px-4  md:px-0">
          <AnimatedHeading>
            <h3 className="text-2xl font-semibold text-white ">Spot</h3>
          </AnimatedHeading>
          <div className="md:hidden">
            <select
              id="tradingPair"
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-black text-tertiary3 p-2 focus:outline-none"
            >
              {tradingPairs.map((pair, index) => (
                <option key={index} value={pair}>
                  {formatTradingPair(pair)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div
            className={`w-full lg:w-3/5 bg-transparent  border-y border-[#959494] lg:border-r md:p-4 ${
              !showChart ? "hidden md:block" : ""
            }`}
          >
            <div>
              <TradingChart
                marketData={marketData}
                onPairChange={setSelectedPair}
                indicators={["volume", "macd", "rsi"]}
                selectedInterval={selectedInterval}
                setSelectedInterval={setSelectedInterval}
                setSelectedPair={setSelectedPair}
                selectedPair={selectedPair}
                tradingPairs={tradingPairs}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse  lg:flex-row w-full lg:w-2/5 bg-[#0f0f0f] md:bg-transparent">
            <div className="w-1/2 h-full bg-transparent md:border border-[#2f2f2f] pr-2 md:pr-0 md:p-4">
              <OrderBook selectedPair={selectedPair} />
            </div>
            <div className="w-1/2 bg-transparent   md:border-y border-[#2f2f2f] flex justify-center pl-2 md:pl-0 md:p-4">
              <OrderForm
                marketPrice={currentMarketPrice}
                selectedPair={selectedPair}
               />
            </div>
          </div>
        </div>
        <div className="  ">
         
          <OrdersRecord type={"spot"} marketData={recentTrades}   />
        </div>
      </motion.div>
    </div>
  );
}

export default Trade;
