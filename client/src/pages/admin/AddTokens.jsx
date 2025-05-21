import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { useDispatch } from "react-redux";
import { addTokens } from "../../store/slices/adminSlice";

const AddTokens = () => {
  const {userId} = useParams();
  
  const [tokenData, setTokenData] = useState({
    userId ,
    currency: "USDT",
    amount: 0,
  });
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addTokens(tokenData));
  }
  return (
    <div className="w-full min-h-screen p-6 bg-gradient">
      <div className="flex flex-col sm:flex-row gap-4 justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-6 sm:w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">
                Add Tokens In User's Wallet
              </h2>
            </AnimatedHeading>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={tokenData.currency}
              onChange={(e) => setTokenData({...tokenData, currency: e.target.value})}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              <option className="text-black hover:bg-tertiary3" value="USDT">
                USDT
              </option>
              <option className="text-black hover:bg-tertiary3" value="USDC">
                USDC
              </option>
              <option className="text-black hover:bg-tertiary3" value="BTC">
                BTC
              </option>
              <option className="text-black hover:bg-tertiary3" value="ETH">
                ETH
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={tokenData.amount}
              onChange={(e) =>
                setTokenData({ ...tokenData, amount: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full bg-primary py-1 rounded-sm cursor-pointer"
          >
            Add Tokens
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTokens;
