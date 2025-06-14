import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openPerpetualTrade,
  closePerpetualTrade,
  fetchOpenPerpetualTrades,
} from "../../store/slices/perpetualSlice";
import { Card } from "@material-tailwind/react";
import { Button, Modal, Dropdown } from "flowbite-react";

import { toast } from "react-toastify";
import AnimatedHeading from "../animation/AnimateHeading";

const PerpetualOrderForm = ({ selectedPair, marketPrice }) => {
  const dispatch = useDispatch();
  const { loading, openTrades } = useSelector((state) => state.perpetual);

  const [type, setType] = useState("long");
  const [leverage, setLeverage] = useState(50);
  const [quantity, setQuantity] = useState("");
  const [closeTradeId, setCloseTradeId] = useState("");
  const [tradeType, setTradeType] = useState("market");
  const [limitPrice, setLimitPrice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [assetsAmount, setAssetsAmount] = useState(100);
  const { wallet } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(fetchOpenPerpetualTrades());
  }, [dispatch]);
  const handleOpenTrade = () => {
    if (!quantity) {
      toast.error("Please enter all fields!");
      return;
    }
     dispatch(
      openPerpetualTrade({
        pair: selectedPair,
        type,
        tradeType,
        assetsAmount:Number(quantity),
        limitPrice,
        leverage,
        amountInUSDT:quantity,
        entryPrice: marketPrice,
      })
    );
  };

  const handleCloseTrade = () => {
    if (!closeTradeId) {
      toast.error("Please select a trade and enter close price!");
      return;
    }
    dispatch(
      closePerpetualTrade({ tradeId: closeTradeId, closePrice: marketPrice })
    );
    dispatch(fetchOpenPerpetualTrades());
  };
  const handleLeverageClick = (value) => {
    setLeverage(value);
  };
  const handleAssetsClick = (value) => {
    setAssetsAmount(value);
  };

  const leverageOptions = [1, 25, 50, 75, 100, 125, 150, 175, 200];
  const assetsOptions = [25, 50, 75, 100];

  return (
    <Card className="p-4 bg-transparent text-white w-full md:max-w-md border">
      <AnimatedHeading>
        <h2>Perpetual</h2>
      </AnimatedHeading>

      <div className=" p-1 rounded-md flex gap-2">
        <button
          onClick={() => setType("long")}
          className={`w-1/2 text-center py-2 rounded-md ${
            type === "long"
              ? "bg-[#26bb8c] text-white"
              : "text-gray-400  bg-[#232323]"
          }`}
        >
          Long
        </button>
        <button
          onClick={() => setType("short")}
          className={`w-1/2 text-center py-2 rounded-md ${
            type === "short"
              ? "bg-[#ff5e5a] text-white"
              : "text-gray-400  bg-[#232323]"
          }`}
        >
          Short
        </button>
      </div>

      <div className="mb-2 flex gap-2">
        <div className="border-[.2px] border-[#2d2d2d] rounded-md w-full p-1">
          <Dropdown
            label={tradeType}
            size="sm"
            dismissOnClick={false}
            inline
            className="bg-transparent text-sm w-[100%]"
          >
            <Dropdown.Item
              onClick={() => {
                setTradeType("market");
              }}
            >
              Market
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setTradeType("limit");
              }}
            >
              Limit
            </Dropdown.Item>
          </Dropdown>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-gray-700 bg-transparent cursor-pointer focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-fit text-center"
        >
          {leverage}X
        </button>
      </div>

      {tradeType === "limit" ? (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Select Limit Price
          </label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="max-w-full bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-2 text-center text-white border border-gray-800"
          />
        </div>
      ) : (
        <div className="mb-2">
          <input
            type="number"
            className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full  text-center"
            value={marketPrice?.toFixed(0)}
            readOnly
          />
        </div>
      )}

     
      <div className="mb-4">
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
              className={` rounded-sm border-[.2px] text-[9px] border-gray-700 w-fit px-1 mx-1 cursor-pointer hover:scale-[1.2] ${
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
        <span>Available USDT:</span>
        <span className="text-white">
          {wallet?.perpetualsWallet.toFixed(2) || "0.00"}
        </span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Latest Price:</span>
        <span className="text-white">{marketPrice?.toFixed(5)}</span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Maximum Positions:</span>
        <span className="text-white">0</span>
      </div>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="md"
        className="backdrop-blur-[2px] bg-black/50"
      >
        <div className="bg-[#1A1A1A] text-white rounded-lg p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-base font-medium">
              {selectedPair}{" "}
              <span
                className={`px-1 py-1 rounded-md ${
                  type === "long"
                    ? "text-[#10D77A] bg-[#163E34]"
                    : "text-[#E13A29] bg-[#462929]"
                }`}
              >
                Buy {type} • {leverage}x
              </span>
            </span>
            <button
              onClick={() => setOpenModal(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="text-gray-400 text-sm mb-2">
            Maximum Positions <span className="text-[#00ffcc]">0 Pieces</span>
          </div>

          <div className="text-white text-sm mb-3">Please select leverage</div>

          <div className="grid grid-cols-4 gap-2">
            {leverageOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleLeverageClick(option)}
                className={`w-full py-2 text-sm rounded-md text-white ${
                  leverage === option ? "bg-[#313131]" : "bg-[#222] "
                } hover:bg-[#313131] transition`}
              >
                {option}x
              </button>
            ))}
          </div>

          <div className="mt-5">
            <button
              className="w-full py-2 text-white bg-[#03F0FF] rounded-md text-sm font-medium hover:bg-[#00ffcc] transition"
              onClick={() => setOpenModal(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <button
        onClick={handleOpenTrade}
        className={` w-full py-2 rounded-md text-sm ${
          type === "long"
            ? "bg-[#26bb8c] hover:bg-green-500"
            : "bg-[#ff5e5a] hover:bg-red-500"
        }`}
      >
        Open Position
      </button>
    </Card>
  );
};

export default PerpetualOrderForm;
