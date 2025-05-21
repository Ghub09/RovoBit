import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiHome, FiBarChart2, FiTrendingUp, FiBriefcase } from "react-icons/fi";

const BottomNavbar = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-[#1C1C1C] text-white flex justify-around py-3 md:hidden border-t border-gray-700">
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-400" : "text-gray-400"
          }`
        }
      >
        <FiHome className="text-xl" />
        <span className="text-sm">{t("home")}</span>
      </NavLink>

      {/* Markets */}
      <NavLink
        to="/market"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-400" : "text-gray-400"
          }`
        }
      >
        <FiBarChart2 className="text-xl" />
        <span className="text-sm">{t("market")}</span>
      </NavLink>

      {/* Trade */}
      <NavLink
        to="/trade"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-400" : "text-gray-400"
          }`
        }
      >
        <FiTrendingUp className="text-xl" />
        <span className="text-sm">{t("trade")}</span>
      </NavLink>

      {/* Wallet / Assets */}
      <NavLink
        to="/wallet"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-400" : "text-gray-400"
          }`
        }
      >
        <FiBriefcase className="text-xl" />
        <span className="text-sm">{t("assets")}</span>
      </NavLink>
    </div>
  );
};

export default BottomNavbar;
