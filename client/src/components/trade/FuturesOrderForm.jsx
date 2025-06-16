import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpenPositions, openFuturesTrade } from "../../store/slices/futuresTradeSlice";
import { toast } from "react-toastify";
import { getWallet } from "../../store/slices/assetsSlice";
import { Card } from "@material-tailwind/react";
import io from "socket.io-client";
import { Button, Modal, Dropdown } from "flowbite-react";
import AnimatedHeading from "../animation/AnimateHeading";

const socket = io(import.meta.env.VITE_API_URL);

const FuturesOrderForm = ({ marketPrice, selectedPair }) => {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("long");
  const [leverage, setLeverage] = useState(10);
  const [quantity, setQuantity] = useState("");
  const [assetsAmount, setAssetsAmount] = useState(100);
  const { wallet } = useSelector((state) => state.assets);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const extractBase = (pair) => {
    if (pair.length <= 3) return pair; // Handle edge cases
    const base = pair.slice(0, 3);
    return `${base}`;
  };

  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const localTime = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(localTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (quantity <= 0 || leverage < 1) {
      return toast.error("Invalid trade details");
    }
   dispatch(
      openFuturesTrade({
        pair: selectedPair,
        type: orderType,
        assetsAmount,
        leverage,
        amountInUSDT: quantity,
        entryPrice: marketPrice,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
         socket.emit("newPosition", result.payload);
         
       }
      // toast.dismiss();
      toast.success("Trade is open successfully");
    }).catch((err)=>{
      console.log(err,"something went wrong")
      toast.error("Some thing is wrong");

    })
     
  };
 
  useEffect(() => {
      socket.on("liquidationUpdate", () => dispatch(fetchOpenPositions()));
      socket.on("newPosition", () => dispatch(fetchOpenPositions()));
  
      return () => {
        socket.off("liquidationUpdate");
        socket.off("newPosition");
      };
    }, [dispatch]);
  const handleAssetsClick = (value) => {
    setAssetsAmount(value);
  };

  const assetsOptions = [25, 50, 75, 100];

  return (
    <Card className="p-4 bg-transparent text-lg text-white w-full md:max-w-md  ">
      <AnimatedHeading>
        <div className="flex justify-center">
        <h2 className="mb-4">Open Position</h2>
        </div>
      </AnimatedHeading>

      <div className=" p-1 rounded-md flex gap-2">
        <button
          onClick={() => setOrderType("long")}
          className={`w-1/2 text-center rounded-full ${
            orderType === "long"
              ? "bg-[#26bb8c] text-white"
              : "text-gray-400  bg-[#232323]"
          }`}
        >
          Long
        </button>
        <button
          onClick={() => setOrderType("short")}
          className={`w-1/2 text-center rounded-full ${
            orderType === "short"
              ? "bg-[#ff5e5a] text-white"
              : "text-gray-400  bg-[#232323]"
          }`}
        >
          Short
        </button>
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Time:</span>
        <span className="text-white">{currentTime}</span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Available Amount:</span>
        <span className="text-white">
          {wallet?.futuresWallet.toFixed(2) || "0.00"}
        </span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Trading Asset:</span>
        <span className="text-white">USDT</span>
      </div>

      <div className="mb-2">
        <input
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full  text-center"
          value={marketPrice?.toFixed(0)}
          readOnly
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm text-gray-300 mb-1">Cycle</label>
        <select
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full text-center"
          placeholder="0"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
        >
          <option value="10" className="bg-[#1a1a1a] ">
            30s - 10%
          </option>
          <option value="20" className="bg-[#1a1a1a] ">
            60s - 20%
          </option>
          <option value="30" className="bg-[#1a1a1a] ">
            120s - 30%
          </option>
          <option value="40" className="bg-[#1a1a1a] ">
            150s - 40%
          </option>
          <option value="50" className="bg-[#1a1a1a] ">
            180s - 50%
          </option>
          <option value="60" className="bg-[#1a1a1a] ">
            24h - 60%
          </option>
          <option value="70" className="bg-[#1a1a1a] ">
            48h - 70%
          </option>
          <option value="80" className="bg-[#1a1a1a] ">
            72h - 80%
          </option>
          <option value="90" className="bg-[#1a1a1a] ">
            7d - 90%
          </option>
          <option value="100" className="bg-[#1a1a1a] ">
            15d - 100%
          </option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm text-gray-300 mb-1">Amount</label>
        <input
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full text-center"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className=" max-w-full text-sm mb-2">
        <div className="flex justify-evenly">
          {assetsOptions.map((option, index) => (
            <p
              key={index}
              className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 mx-1 cursor-pointer text-[9px] hover:scale-[1.2] ${
                assetsAmount === option
                  ? "bg-[#2c2c2c] text-white"
                  : "bg-transparent text-gray-500"
              } `}
              onClick={() => handleAssetsClick(option)}
            >
              {option}%
            </p>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Latest Price:</span>
        <span className="text-white">{marketPrice?.toFixed(5)}</span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Handling Fee:</span>
        <span className="text-white">0.00</span>
      </div>

      <button
        onClick={handleSubmit}
        className={` w-full py-2 rounded-full text-sm ${
          orderType === "long"
            ? "bg-[#26bb8c] hover:bg-green-500"
            : "bg-[#ff5e5a] hover:bg-red-500"
        }`}
      >
        Open Position
      </button>
    </Card>
  );
};

export default FuturesOrderForm;
