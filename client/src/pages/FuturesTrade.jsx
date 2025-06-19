// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import TradingChart from "../components/trade/TradingChart";
// import OrderBook from "../components/trade/OrderBook";
// import FuturesOrderForm from "../components/trade/FuturesOrderForm";
// import { fetchOpenPositions } from "../store/slices/futuresTradeSlice";
// import io from "socket.io-client";
// import AnimatedHeading from "../components/animation/AnimateHeading";
// import OrdersRecord from "../components/trade/OrdersRecord";

// const socket = io(import.meta.env.VITE_API_URL);

// function FuturesTrade() {
//   const [marketData, setMarketData] = useState([]);
//   const [marketPrice, setMarketPrice] = useState(null);
//   const [selectedPair, setSelectedPair] = useState("BTCUSDT");
//   const [selectedInterval, setSelectedInterval] = useState("1h");
//   console.log(marketPrice)
//   const showChart = useSelector((state) => state.global.showChart);
//   const dispatch = useDispatch();

//   const tradingPairs = [
//     "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
//     "ADAUSDT", "DOGEUSDT", "MATICUSDT", "DOTUSDT", "LTCUSDT",
//   ];

//   const formatTradingPair = (pair) => {
//     const index = pair.length - 4;
//     return `${pair.slice(0, index)}/${pair.slice(index)}`;
//   };

//   // Fetch initial open positions
//   useEffect(() => {
//     dispatch(fetchOpenPositions());
//   }, [dispatch]);

//   // Listen for socket updates
//   useEffect(() => {
//     socket.on("liquidationUpdate", () => dispatch(fetchOpenPositions()));
//     socket.on("newPosition", () => dispatch(fetchOpenPositions()));

//     return () => {
//       socket.off("liquidationUpdate");
//       socket.off("newPosition");
//     };
//   }, [dispatch]);

//   // Fetch REST market data on mount and interval
//   useEffect(() => {
//     const fetchMarketData = async () => {
//       try {
//         const response = await fetch(
//           `https://api.binance.us/api/v3/klines?symbol=${selectedPair}&interval=${selectedInterval}`
//         );
//         const data = await response.json();

//         const formatted = data.map((candle) => ({
//           time: Math.floor(candle[0] / 1000),
//           open: parseFloat(candle[1]),
//           high: parseFloat(candle[2]),
//           low: parseFloat(candle[3]),
//           close: parseFloat(candle[4]),
//           volume: parseFloat(candle[5]),
//         }));

//         setMarketData(formatted);

//         // ✅ Also set the latest close price as marketPrice
//         if (formatted.length > 0) {
//           const last = formatted[formatted.length - 1];
//           setMarketPrice(last.close);
//           console.log("Initial market price:", last.close);
//         }
//       } catch (error) {
//         console.error("Failed to fetch market data:", error);
//       }
//     };

//     fetchMarketData();
//     const interval = setInterval(fetchMarketData, 60000);
//     return () => clearInterval(interval);
//   }, [selectedPair, selectedInterval]);

//   // Listen to real-time WebSocket stream
//   useEffect(() => {
//     const ws = new WebSocket(
//       `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@kline_${selectedInterval}`
//     );

//     ws.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (!msg.k) return;

//       const kline = msg.k;

//       const newCandle = {
//         time: Math.floor(kline.t / 1000),
//         open: parseFloat(kline.o),
//         high: parseFloat(kline.h),
//         low: parseFloat(kline.l),
//         close: parseFloat(kline.c),
//         volume: parseFloat(kline.v),
//       };

//       setMarketData((prev) => {
//         const last = prev[prev.length - 1];
//         if (last && last.time === newCandle.time) {
//           const updated = [...prev];
//           updated[updated.length - 1] = newCandle;
//           return updated;
//         } else {
//           return [...prev, newCandle];
//         }
//       });

//       setMarketPrice(newCandle.close); // ✅ Always update marketPrice
//       console.log("Live market price from WebSocket:", newCandle.close);
//     };

//     return () => ws.close();
//   }, [selectedPair, selectedInterval]);

//   return (
//     <div className="min-h-screen max-w-7xl mx-auto md:px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="space-y-6"
//       >
//         <div className="flex justify-between px-4 md:px-0">
//           <AnimatedHeading>
//             <h3 className="text-2xl font-semibold text-white">Trading</h3>
//           </AnimatedHeading>
//           <div className="md:hidden">
//             <select
//               value={selectedPair}
//               onChange={(e) => setSelectedPair(e.target.value)}
//               className="bg-black text-tertiary3 p-2 focus:outline-none"
//             >
//               {tradingPairs.map((pair, index) => (
//                 <option key={index} value={pair}>
//                   {formatTradingPair(pair)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Main Layout */}
//         <div className="flex flex-col lg:flex-row">
//           <div
//             className={`w-full lg:w-3/5 border-y border-[#2f2f2f] lg:border-r md:p-4 ${
//               !showChart ? "hidden md:block" : ""
//             }`}
//           >
//             <TradingChart
//               marketData={marketData}
//               onPairChange={setSelectedPair}
//               indicators={["volume", "macd", "rsi"]}
//               selectedInterval={selectedInterval}
//               setSelectedInterval={setSelectedInterval}
//               setSelectedPair={setSelectedPair}
//               selectedPair={selectedPair}
//               tradingPairs={tradingPairs}
//             />
//           </div>

//           <div className="flex flex-row-reverse lg:flex-row w-full lg:w-2/5 bg-[#0f0f0f] md:bg-transparent">
//             <div className="w-1/2 border border-[#2f2f2f] md:p-4">
//               <OrderBook selectedPair={selectedPair} hideTotalUSDT={true} />
//             </div>
//             <div className="w-1/2 border border-[#2f2f2f] md:p-4">
//               <FuturesOrderForm
//                 selectedPair={selectedPair}
//                 marketPrice={marketPrice}
//               />
//             </div>
//           </div>
//         </div>

//         <OrdersRecord type="futures" marketData={marketData} />
//       </motion.div>
//     </div>
//   );
// }

// export default FuturesTrade;



import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import TradingChart from "../components/trade/TradingChart";
import OrderBook from "../components/trade/OrderBook";
import FuturesOrderForm from "../components/trade/FuturesOrderForm";
import { fetchOpenPositions } from "../store/slices/futuresTradeSlice";
import io from "socket.io-client";
import AnimatedHeading from "../components/animation/AnimateHeading";
// import { useNavigate } from "react-router-dom";
// import { MdCandlestickChart } from "react-icons/md";
// import FuturesOpenPosition from "../components/trade/FuturesOpenPositions";
import OrdersRecord from "../components/trade/OrdersRecord";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_URL);

function FuturesTrade() {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  // const { openPositions } = useSelector((state) => state.futures);
  const candleSeriesRef = useRef(null);
   const showChart = useSelector((state) => state.global.showChart);
  const dispatch = useDispatch();

  // const navigate = useNavigate();
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
  const formatTradingPair = (pair) => {
    if (pair.length <= 4) return pair; // Handle edge cases (e.g., "USDT")

    const index = pair.length - 4; // Find the index where "/" should be inserted

    return `${pair.slice(0, index)}/${pair.slice(index)}`; // Insert "/" before "USDT"
  };

  useEffect(() => {
    dispatch(fetchOpenPositions());
  }, [dispatch]);

  useEffect(() => {
    socket.on("liquidationUpdate", () => dispatch(fetchOpenPositions()));
    socket.on("newPosition", () => dispatch(fetchOpenPositions()));

    return () => {
      socket.off("liquidationUpdate");
      socket.off("newPosition");
    };
  }, [dispatch]);

  // useEffect(() => {
  //   const fetchMarketData = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.binance.us/api/v3/klines?symbol=${selectedPair}&interval=${selectedInterval}`
  //       );
  //       const data = await response.json();

  //       const formattedData = data.map((candle) => ({
  //         time: Math.floor(candle[0] / 1000),
  //         open: parseFloat(candle[1]),
  //         high: parseFloat(candle[2]),
  //         low: parseFloat(candle[3]),
  //         close: parseFloat(candle[4]),
  //         volume: parseFloat(candle[5]),
  //       }));

  //       setMarketData(formattedData);
  //     } catch (error) {
  //       console.error("Error fetching market data:", error);
  //     }
  //   };
  //   fetchMarketData();
  //   const interval = setInterval(fetchMarketData, 60000);
  //   return () => clearInterval(interval);
  // }, [selectedPair, selectedInterval]);
  // // WebSocket for real-time updates
  // useEffect(() => {
  //   const ws = new WebSocket(
  //     `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@kline_${selectedInterval}`
  //   );

  //   ws.onmessage = (event) => {
  //     const response = JSON.parse(event.data);
  //     const kline = response.k;
  //     const newCandle = {
  //       time: Math.floor(kline.t / 1000),
  //       open: parseFloat(kline.o),
  //       high: parseFloat(kline.h),
  //       low: parseFloat(kline.l),
  //       close: parseFloat(kline.c),
  //       volume: parseFloat(kline.v),
  //     };

  //     setMarketData((prevData) => [...prevData, newCandle]);
  //   };

  //   return () => ws.close();
  // }, [selectedPair, selectedInterval]);

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
       const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@kline_${selectedInterval}`);
   
   
       ws.onmessage = (event) => {
         const response = JSON.parse(event.data);
         const kline = response.k;
         const newCandle = {
           time: Math.floor(kline.t / 1000),
           open: parseFloat(kline.o),
           high: parseFloat(kline.h),
           low: parseFloat(kline.l),
           close: parseFloat(kline.c),
           volume: parseFloat(kline.v),
         };
   
         setMarketData((prevData) => [...prevData, newCandle]);
       };
   
       return () => ws.close();
     }, [selectedPair, selectedInterval]);
  const currentMarketPrice =
    marketData.length > 0 ? marketData[marketData.length - 1].close : 0;
  return (
    <div className="min-h-screen max-w-7xl mx-auto md:px-4 border">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between px-4 md:px-0">
          <AnimatedHeading>
            <h3 className="text-2xl font-semibold text-white">Trading</h3>
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

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row">
          <div
            className={`w-full lg:w-3/5 bg-transparent border-y border-[#2f2f2f] lg:border-r md:p-4 ${
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

          {/* Order Form & Order Book in a Row */}
          <div className="flex flex-row-reverse  lg:flex-row w-full lg:w-2/5 bg-[#0f0f0f] md:bg-transparent">
            <div className="w-1/2 bg-transparent md:border border-[#2f2f2f] md:p-4">
              <OrderBook selectedPair={selectedPair} hideTotalUSDT={true} />
            </div>
            <div className="w-1/2 bg-transparent md:order border-[#2f2f2f] md:p-4">
              <FuturesOrderForm
                selectedPair={selectedPair}
                marketPrice={currentMarketPrice}
              />
            </div>
          </div>
        </div>
        <div className="">
        <OrdersRecord type={"futures"} marketData={marketData} />
        </div>
      </motion.div>
    </div>
  );
}

export default FuturesTrade;
