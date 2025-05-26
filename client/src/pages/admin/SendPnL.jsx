import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { useDispatch } from "react-redux";
import { liquidateTrade } from "../../store/slices/adminSlice";

const SendPnL = () => {
  const navigate = useNavigate();
  const { marketPrice, type, tradeId } = useParams();

  const [pnlData, setPnlData] = useState({
    type,
    marketPrice,
    tradeId,
    amount: 0,
  });

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(liquidateTrade(pnlData));
    setPnlData({
      amount: 0,
    });
    navigate(-1);
  };
  return (
    <div className="w-full min-h-screen p-6 bg-gradient">
      <div className="flex flex-col sm:flex-row gap-4 justify-evenly border border-[#ffff]">
        <form onSubmit={handleSubmit} className="space-y-6 sm:w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">
                Send {type} In Users Wallet
              </h2>
            </AnimatedHeading>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Profit or Loss
            </label>
            <select
              value={pnlData.type}
              onChange={(e) => setPnlData({ ...pnlData, type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option className="text-black hover:bg-tertiary3" value="profit">
                Profit
              </option>
              <option className="text-black hover:bg-tertiary3" value="loss">
                Loss
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={pnlData.amount}
              onChange={(e) =>
                setPnlData({ ...pnlData, amount: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full bg-primary py-1 rounded-sm cursor-pointer"
          >
            {type === "profit" ? "Send Profit" : "Send Loss"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendPnL;
