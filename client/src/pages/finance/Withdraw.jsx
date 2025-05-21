import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { fundsRequest } from "../../store/slices/assetsSlice";
import Wallet from "../../../../server/models/Wallet";

function Withdraw() {
  const dispatch = useDispatch();
  const { withdrawalHistory } = useSelector((state) => state.assets);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("Tron (TRC20)");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || !walletAddress) {
      toast.error("Please fill in all fields with valid information");
      return;
    }

    dispatch(
      fundsRequest({
        amount,
        currency,
        network,
        walletAddress,
        type: "withdraw",
      })
    );
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient ">
      <div className="w-full flex flex-col sm:flex-row justify-evenly gap-4">
        <form onSubmit={handleSubmit} className="space-y-6 sm:w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">Withdraw</h2>
            </AnimatedHeading>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
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
              <option className="text-black hover:bg-tertiary3" value="Solana">
                Solana
              </option>
              <option className="text-black hover:bg-tertiary3" value="TRX">
                TRX
              </option>
              <option className="text-black hover:bg-tertiary3" value="POL">
                POL
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              {currency === "USDT" && (
                <>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Tron (TRC20)"
                  >
                    Tron (TRC20)
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Arbitrum One"
                  >
                    Arbitrum One
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Aptos"
                  >
                    Aptos
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Polygon POS"
                  >
                    Polygon POS
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Ethereum (ERC20)"
                  >
                    Ethereum (ERC20)
                  </option>
                </>
              )}
              {currency === "USDC" && (
                <>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Ethereum (ERC20)"
                  >
                    Ethereum (ERC20)
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Polygon POS"
                  >
                    Polygon POS
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Solana"
                  >
                    Solana
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Arbitrum One"
                  >
                    Arbitrum One
                  </option>
                </>
              )}
              {currency === "ETH" && (
                <>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Ethereum (ERC20)"
                  >
                    Ethereum (ERC20)
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Arbitrum One"
                  >
                    Arbitrum One
                  </option>
                </>
              )}
              {currency === "Solana" && (
                <>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Solana"
                  >
                    Solana
                  </option>
                </>
              )}
              {currency === "POL" && (
                <>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Polygon POS"
                  >
                    Polygon POS
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Ethereum (ERC20)"
                  >
                    Ethereum (ERC20)
                  </option>
                </>
              )}
              {currency === "TRX" && (
                <>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Tron (TRC20)"
                  >
                    Tron (TRC20)
                  </option>
                  <option
                    className="text-black hover:bg-tertiary3"
                    value="Ethereum (ERC20)"
                  >
                    Ethereum (ERC20)
                  </option>
                </>
              )}
              {currency === "BTC" && (
                <option
                  className="text-black hover:bg-tertiary3"
                  value="Bitcoin"
                >
                  Bitcoin
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Reciever Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
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
              entire network node to ensure it can be credited.
            </li>
            <li>
              4. Please select the above-mentioned token system and currency
              type and transfer the corresponding amount for deposit. Please do
              not transfer any other irrelevant assets, otherwise they will not
              be retrieved.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
