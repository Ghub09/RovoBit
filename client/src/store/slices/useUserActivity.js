// hooks/useUserActivity.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserOnlineStatus } from "./adminSlice";
 
const useUserActivity = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let timeout;
    const markActive = () => {
      clearTimeout(timeout);
      dispatch(setUserOnlineStatus({ userId, isOnline: true }));

      timeout = setTimeout(() => {
        dispatch(setUserOnlineStatus({ userId, isOnline: false }));
      }, 5 * 60 * 1000); // 5 min of inactivity = offline
    };

    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);

    markActive(); // Mark online on mount

    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      clearTimeout(timeout);
    };
  }, [dispatch, userId]);
};

export default useUserActivity;
