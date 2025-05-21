import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { Link } from "react-router-dom";
import ethQr from "../../assets/etherium-qr.jpeg";
import btcQr from "../../assets/btc-qr.jpeg";
import solanaQr from "../../assets/salona-qr.jpeg";
import tronQr from "../../assets/tron-qr.jpeg";

function Deposit() {
  const dispatch = useDispatch();
  const [network, setNetwork] = useState("Tron (TRC20)");
  const { status, depositHistory } = useSelector((state) => state.assets);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");

  // Reset network when currency changes
  useEffect(() => {
    switch (currency) {
      case "USDT":
        setNetwork("Tron (TRC20)");
        break;
      case "USDC":
        setNetwork("Ethereum (ERC20)");
        break;
      case "ETH":
        setNetwork("Ethereum (ERC20)");
        break;
      case "BTC":
        setNetwork("Bitcoin");
        break;
      case "POL":
        setNetwork("Polygon POS");
        break;
      case "TRX":
        setNetwork("Tron (TRC20)");
        break;
      case "Solana":
        setNetwork("Solana");
        break;
      default:
        setNetwork("Tron (TRC20)");
    }
  }, [currency]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Add your form submission logic here
  };

  const handleCopyToClipboard = (e) => {
    e.preventDefault();
    const walletAddress = getWalletAddress();
    navigator.clipboard.writeText(walletAddress).then(() => {
      toast.success("Wallet address copied to clipboard");
    });
  };

  const getWalletAddress = () => {
    if (currency === "USDT") {
      switch (network) {
        case "Tron (TRC20)":
          return "TQeJdv3B7sgBgBPgagNRqYmvBAMv5PrPVi";
        case "Arbitrum One":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        case "Polygon POS":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        case "Ethereum (ERC20)":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        default:
          return "";
      }
    } else if (currency === "USDC") {
      switch (network) {
        case "Ethereum (ERC20)":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        case "Polygon POS":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        case "Solana":
          return "GvpTvu7Gh5Uf92kjatksmVoy6q8sVbhtnWzHNn6AkBax";
        case "Arbitrum One":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        default:
          return "";
      }
    } else if (currency === "ETH") {
      switch (network) {
        case "Ethereum (ERC20)":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        case "Arbitrum One":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        default:
          return "";
      }
    } else if (currency === "Solana") {
      switch (network) {
        case "Solana":
          return "GvpTvu7Gh5Uf92kjatksmVoy6q8sVbhtnWzHNn6AkBax";
        default:
          return "";
      }
    } else if (currency === "TRX") {
      switch (network) {
        case "Tron (TRC20)":
          return "TQeJdv3B7sgBgBPgagNRqYmvBAMv5PrPVi";
        case "Ethereum (ERC20)":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        default:
          return "";
      }
    } else if (currency === "POL") {
      switch (network) {
        case "Ethereum (ERC20)":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        case "Polygon POS":
          return "0x78f2F7AD3761c4f9d444B643A0AfC52302BCf87a";
        default:
          return "";
      }
    } else if (currency === "BTC") {
      return "bc1qq3asuwkt49w4gwwpvjh6le5427e3cpq4uhz425";
    }
    return "";
  };

  const getQrCode = () => {
    if (network === "Bitcoin") {
      return btcQr;
    } else if (
      network === "Ethereum (ERC20)" ||
      network === "Arbitrum One" ||
      network === "Polygon POS"
    ) {
      return ethQr;
    } else if (network === "Solana") {
      return solanaQr;
    } else if (network === "Tron (TRC20)") {
      return tronQr;
    }
    // Default to tron QR for other networks
    return tronQr;
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient">
      <div className="flex flex-col sm:flex-row gap-4 justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-6 sm:w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">Deposit Funds</h2>
            </AnimatedHeading>
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
          {/* QR Code Display */}
          <div className="mt-4 flex flex-col items-start">
            <div className="bg-white p-1 rounded-md">
              <img
                src={getQrCode()}
                alt={`${currency} QR Code`}
                className="max-w-[100px] max-h-[100px]"
              />
            </div>
          </div>
          <div className="w-full ">
            <div className="relative">
              <label htmlFor="wallet-address" className="sr-only">
                Wallet Address
              </label>
              <input
                id="wallet-address"
                type="text"
                className="col-span-6 bg-transparent border border-primary text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={getWalletAddress()}
                disabled
                readOnly
              />
              <button
                onClick={handleCopyToClipboard}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
              >
                <span id="default-icon">
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
                <span id="success-icon" className="hidden">
                  <svg
                    className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
              </button>
              <div
                id="tooltip-copy-npm-install-copy-button"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
              >
                <span id="default-tooltip-message">Copy to clipboard</span>
                <span id="success-tooltip-message" className="hidden">
                  Copied!
                </span>
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          </div>

          <Link to={"/wallet/request-release-funds"} className="text-blue-400">
            Already made a transaction? Send a request to release funds.
          </Link>
        </form>
        <div className="warning rounded-md px-8 py-8 bg-[#242424] sm:w-[40vw] max-h-fit text-start">
          <h3 className="text-yellow-200">⚠️Important Notice</h3>
          <ol className="text-gray-500 ">
            <li>
              1. If you have already deposited the selected amount in the given
              wallet address but your wallet is not updated yet, then kindly
              click on the given link at the end of the page for request and
              your wallet will be updated within 24 hours.
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
              5. The above deposit address is the official payment address of
              the platform. Please ensure you use the official deposit address
              of the platform. Any loss of funds caused by incorrect charging
              shall be borne by yourself.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
