import { useState } from "react";
import { useDispatch } from "react-redux";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { fundsRequest } from "../../store/slices/assetsSlice";
import { useNavigate } from "react-router-dom";
function RequestRelease() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [requestData, setRequestData] = useState({
    amount: "",
    currency: "USDT",
    type: "deposit",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(fundsRequest(requestData));

    setRequestData({
      amount: "",
      currency: "USDT",
      walletAddress: "",
      type: "deposit",
    });
    navigate("/wallet");
    
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient flex justify-center items-center">
      <div className="flex flex-col sm:flex-row gap-4 justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-6 sm:w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">Request Release of Funds</h2>
            </AnimatedHeading>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={requestData.amount}
              onChange={(e) =>
                setRequestData({ ...requestData, amount: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={requestData.currency}
              onChange={(e) =>
                setRequestData({ ...requestData, currency: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              <option className="text-black hover:bg-tertiary3" value="USDT">
                USDT
              </option>
              <option className="text-black hover:bg-tertiary3" value="USDC">
                USDC
              </option>
              <option className="text-black hover:bg-tertiary3" value="ETH">
                ETH
              </option>
              <option className="text-black hover:bg-tertiary3" value="BTC">
                BTC
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 ">
              Sender wallet Address
            </label>
            <input
              type="text"
              value={requestData.walletAddress}
              onChange={(e) =>
                setRequestData({
                  ...requestData,
                  walletAddress: e.target.value,
                })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full bg-primary py-1 rounded-sm cursor-pointer"
          >
            Send Request
          </button>
        </form>
        <div className="warning rounded-md px-8 py-8 bg-[#242424] sm:w-[40vw] max-h-fit text-start">
          <h3 className="text-yellow-200">⚠️Important Notice</h3>
          <ol className="text-gray-500 ">
            <li>
              1. The above deposit address is the official payment address of
              the platform. Please ensure you use the official deposit address
              of the platform. Any loss of funds caused by incorrect charging
              shall be borne by yourself.
            </li>
            <li>
              2. Please make sure that your computer and browser are safe to
              prevent information from being tampered with or leaked.
            </li>
            <li>
              3. After you recharge the above address, you need to confirm the
              entire network node for it to be credited.
            </li>
            <li>
              4. Please select the above-mentioned currency type and network and
              transfer the corresponding amount for deposit. Please do not
              transfer any other irrelevant assets, otherwise, they will not be
              retrieved.
            </li>
            <li>
              5. Your request will be reviewed, and if it is authentic, your
              wallet will be updated within 24 hours.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RequestRelease;
