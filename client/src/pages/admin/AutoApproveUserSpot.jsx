import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { approveOrder, rejectOrder } from "../../store/slices/tradeSlice";
import { setLoading } from "../../store/slices/globalSlice";
// import {
//   approveSpotTrade,
//   rejectSpotTrade,
// } from "../../store/slices/tradeSlice"; // Update the import path

const AutoApproveSingleTrade = ({ trade }) => {
  const dispatch = useDispatch();
  const [processed, setProcessed] = useState(false);
  useEffect(() => {
    setLoading(false)
    const autoProcess = async () => {
      if (!trade || processed || trade?.status !== "pending") return;

      // eslint-disable-next-line react/prop-types
      if (trade?.totalCost > 0) {
        await dispatch(approveOrder(trade._id));
      } else {
        await dispatch(rejectOrder(trade._id));
      }

      setProcessed(true);
    };

    autoProcess();
  }, [trade, dispatch, processed]);

  return null; // Logical component, no UI
};

export default AutoApproveSingleTrade;
