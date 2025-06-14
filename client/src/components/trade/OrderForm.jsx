import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { fetchPendingOrders, placeOrder } from "../../store/slices/tradeSlice";
import AnimatedHeading from "../animation/AnimateHeading";
import { getWallet } from "../../store/slices/assetsSlice";
import SmallLoader from "../layout/smallLoader";

const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

const OrderForm = ({ marketPrice, selectedPair }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState(marketPrice);
  const [usdtAmount, setUsdtAmount] = useState("");
  const [assetsAmount, setAssetsAmount] = useState(0);
  const { loading } = useSelector((state) => state.global);

  const [availableAssetAmount, setAvailableAssetAmount] = useState(0);
  const { wallet } = useSelector((state) => state.assets);

  const assetsOptions = [25, 50, 75, 100];

  const extractBase = (pair) => {
    if (pair === "MATICUSDT") {
      return "MATIC";
    } else if (pair === "DOGEUSDT") {
      return "DOGE";
    }
    if (pair.length <= 3) return pair; // Handle edge cases
    const base = pair.slice(0, 3);
    return `${base}`;
  };

  useEffect(() => {
    if (orderType === "market") {
      setPrice(marketPrice);
    }
  }, [orderType, marketPrice]);

  useEffect(() => {
    // Listen for real-time trade updates
    socket.on("tradeUpdate", () => {
      // Handle trade updates
    });

    return () => {
      socket.off("tradeUpdate");
    };
  }, []);

  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);

  useEffect(() => {
    if (!wallet?.holdings) return; // Prevents running if wallet is not loaded

    const asset = wallet.holdings.find(
      (holding) => holding.asset === extractBase(selectedPair)
    );

    if (asset) {
      setAvailableAssetAmount(asset.quantity);
    } else {
      setAvailableAssetAmount(0);
    }
  }, [selectedPair, wallet?.holdings]); // Only runs when `selectedPair` or `wallet.holdings` changes

  const handleSubmit = async () => {
    
    // Check if neither assetsAmount nor usdtAmount is set
    if (assetsAmount <= 0 && usdtAmount <= 0) {
      return toast.error(t("enter_amount"));
    }

    // Check if usdtAmount is set but invalid
    if (usdtAmount > 0 && usdtAmount <= 0) {
      return toast.error(t("enter_valid_usdt"));
    }

    // Check if assetsAmount is set but invalid
    if (assetsAmount > 0 && assetsAmount <= 0) {
      return toast.error(t("enter_valid_assets"));
    }

    // Check if orderType is limit and price is invalid
    if (orderType === "limit" && (!price || price <= 0)) {
      return toast.error(t("enter_valid_price"));
    }

    const orderData = {
      type: side,
      orderType,
      price: orderType === "market" ? marketPrice : price,
      usdtAmount: usdtAmount > 0 ? usdtAmount : 0,
      assetsAmount: assetsAmount > 0 ? assetsAmount : 0,
      coin: extractBase(selectedPair),
    };
    dispatch(fetchPendingOrders());
    dispatch(placeOrder(orderData))
      .unwrap()
      .then((response) => {
        socket.emit("placeOrder", response.trade);
        toast.success(t("order_placed_success"));
      })
      .catch((error) => {
        // console.log(error.message);
        toast.error(error.message);
      });
  };

  const handleAssetsClick = (value) => {
    setAssetsAmount(value);
    setUsdtAmount((wallet.spotWallet / 100) * value);
  };

  return (
    <Card className="  ml-2 bg-transparent  text-white w-full text-lg ">
                        {loading && <SmallLoader />}

      <AnimatedHeading>
        <p className="hidden md:block m-4 text-center">{t("spot")}</p>
      </AnimatedHeading>
      <div className="mb-2 ">
        <div className=" p-1 rounded-md flex gap-2">
          <button
            onClick={() => setSide("buy")}
            className={`w-1/2 text-center py-2 rounded-md ${
              side === "buy"
                ? "bg-[#26bb8c] text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            {t("buy")}
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`w-1/2 text-center py-2 rounded-md ${
              side === "sell"
                ? "bg-[#ff5e5a] text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            {t("sell")}
          </button>
        </div>
      </div>

      <div className="mb-4 ">
        <div className="p-1 rounded-md flex gap-2">
          <button
            onClick={() => setOrderType("market")}
            className={`w-1/2 text-center py-2 rounded-md ${
              orderType === "market"
                ? "bg-primary text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            {t("market_order")}
          </button>
          <button
            onClick={() => setOrderType("limit")}
            className={`w-1/2 text-center py-2 rounded-md ${
              orderType === "limit"
                ? "bg-primary text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            {t("limit")}
          </button>
        </div>
      </div>

      {orderType === "limit" ? (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            {t("select_limit_price")}
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="max-w-full bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-2 text-center text-white border border-gray-800"
          />
        </div>
      ) : (
        <div className="mb-4 ">
          <input
            type="number"
            className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-2 text-white border border-gray-800 w-full  text-center"
            value={marketPrice?.toFixed(0)}
            readOnly
          />
        </div>
      )}

     <div className="relative mb-2 w-full max-w-xs  bg-gray-500 rounded-2xl ">
  <input
    type="number"
    value={usdtAmount}
    onChange={(e) => {
      setUsdtAmount(e.target.value);
      setAssetsAmount(0);
    }}
    className="w-full  focus:outline-none rounded-md px-3 py-2 text-white  pr-16 text-sm"
    placeholder={t("enter_quantity")}
  />
  <span className="absolute right-3 top-1/2 -translate-y-1/2  text-xs">
    {side === "buy" ? "USDT" : extractBase(selectedPair)}
  </span>
</div>

      <div className=" max-w-full text-sm mb-2">
        <div className="flex justify-evenly">
          {assetsOptions.map((option, index) => (
            <p
              key={index}
              className={` rounded-sm border-[.2px]  border-gray-700 w-fit px-1 mx-1 cursor-pointer hover:scale-[1.2] text-[10px] ${
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

      <Button
        onClick={handleSubmit}
        className={`w-full py-2 my-2 rounded-md ${
          side === "buy" ? "bg-[#26bb8c]" : "bg-[#ff5e5a]"
        }`}
      >
        {side === "buy" ? t("buy") : t("sell")}
      </Button>
      <div className="flex gap-1 text-gray-400 text-sm mb-2">
        <span>{t("market_price")}</span>
        <span>:</span>
        <span>{marketPrice?.toFixed(2)}</span>
      </div>
      <div className="flex gap-1 text-gray-400 text-sm">
        <span>{t("available_balance")}</span>
        <span>:</span>
        <span className="truncate">
          {side === "buy" ? wallet?.spotWallet : availableAssetAmount}
          {side === "buy" ? " USDT" : ` ${extractBase(selectedPair)}`}
        </span>
      </div>
    </Card>
  );
};

OrderForm.propTypes = {
  marketPrice: PropTypes.number,
  selectedPair: PropTypes.string.isRequired,
};

export default OrderForm;
