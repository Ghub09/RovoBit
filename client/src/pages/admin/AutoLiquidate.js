  import { useDispatch, useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { liquidateTrade } from "../../store/slices/adminSlice";

  const AutoLiquidate = ({ trade, marketPrice }) => {
    const dispatch = useDispatch();
    const [hasLiquidated, setHasLiquidated] = useState(false);
    const { user } = useSelector((state) => state.user);
    
    // Get trade duration in seconds
    const getTradeDuration = () => {
      if (!trade?.openTime || !trade?.expiryTime) return 0;
      const openTime = new Date(trade.openTime).getTime();
      const expiryTime = new Date(trade.expiryTime).getTime();
      return (expiryTime - openTime) / 1000;
    };

    // Get profit percentage based on duration
    const getProfitPercentage = (duration) => {
      if (duration >= 1296000) return 100;       // 15 days
      if (duration >= 604800) return 90;         // 7 days
      if (duration >= 259200) return 80;         // 72 hours
      if (duration >= 172800) return 70;         // 48 hours
      if (duration >= 86400) return 60;          // 24 hours
      if (duration >= 180) return 50;            // 3 minutes
      if (duration >= 150) return 40;            // 2.5 minutes
      if (duration >= 120) return 30;            // 2 minutes
      if (duration >= 60) return 20;             // 1 minute
      if (duration >= 30) return 10;             // 30 seconds
      return 0;
    };

    useEffect(() => {
      if (hasLiquidated || !trade || !marketPrice || !user) return;

      const duration = getTradeDuration();
      const profitPercentage = getProfitPercentage(duration);
      
      // Calculate base profit based on duration percentage
      const baseProfit = (profitPercentage / 100) * trade.marginUsed;
      
      // Calculate actual market PNL
      let marketPnl;
      if (trade.type === "long") {
        marketPnl = (marketPrice - trade.entryPrice) * trade.quantity;
      } else if (trade.type === "short") {
        marketPnl = (trade.entryPrice - marketPrice) * trade.quantity;
      } else {
        marketPnl = 0;
      }
      
      // Apply leverage
      const leveragedPnl = marketPnl * trade.leverage;
      
      // Calculate final PNL (base profit + market PNL)
      const finalPnl = baseProfit + leveragedPnl;
      
      // Apply 1% trading fee
      const tradeValue = trade.quantity * trade.entryPrice;
      const fee = 0.01 * tradeValue;
      const netPnl = finalPnl - fee;
      
      // Determine liquidation type
      const type = netPnl > 0 ? 
                  (user.isActive ? "profit" : "loss") :
                  (user.isActive ? "loss" : "profit");

      const payload = {
        tradeId: trade._id,
        marketPrice,
        amount: Math.abs(netPnl),
        type
      };

      dispatch(liquidateTrade(payload));
      setHasLiquidated(true);
    }, [trade, marketPrice, user, dispatch, hasLiquidated]);

    return null;
  };

  export default AutoLiquidate;