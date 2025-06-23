import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logoSrc from "../../assets/logo.png";
import { motion } from "framer-motion";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Modal } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { VscChevronDown } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin, logoutUser } from "../../store/slices/userSlice";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import {
  MdCandlestickChart,
  // MdOutlinePersonOutline,
  MdPerson,
} from "react-icons/md";
import { setShowChart } from "../../store/slices/globalSlice";
// import { LuMessageCircleQuestion } from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [openMenu, setOpenMenu] = useState(false);
  const [tradeMenu, setTradeMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  // const { theme, toggleTheme, getModeColor } = useTheme();
  const { theme, getModeColor } = useTheme();

  const dispatch = useDispatch((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const showChart = useSelector((state) => state.global.showChart);

  const showSelectOption = ["/trade", "/futures", "/perpetual"].includes(
    location.pathname
  );

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY && currentY > 50) {
        setScrollDirection("down");
      } else if (currentY < lastY) {
        setScrollDirection("up");
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
        setMobileMenuOpen(false);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    const userRole = user.role;
    localStorage.removeItem("user");
    window.location.href = "/";
    userRole === "admin" ? dispatch(logoutAdmin()) : dispatch(logoutUser());
  };
  const handleLogoutDialog = () => {
    setOpenDialog(!openDialog);
  };
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
return (
    <header
      className={`fixed w-full top-0 z-10  smooth-transition ${
        isScrolled ? "bg-opacity-50 backdrop-blur-lg" : "bg-transparent"
      } ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"} ${
        window.scrollY > 0 ? "bg-opacity-50 backdrop-blur-lg" : "bg-transparent"
      } ${getModeColor("b")}`}
    >
      <nav className="container mx-auto flex justify-between items-center  p-4 ">
        <div className="logo-container flex items-center ">
          <Link to={"/"} className=" h-[70px] flex items-center w-[100px]">
                <img src={logoSrc} className="md:w-[8vw] w-[70px]" alt="Logo" />           </Link>
          {showSelectOption && (
            <div className="flex md:hidden items-center ml-auto">
              <select
                id="tradingPair"
                value={location.pathname.slice(1)}
                onChange={(e) => navigate(`/${e.target.value}`)}
                className={` text-tertiary3 focus:outline-none mr-1
                   ${getModeColor("b")} `}
              >
                <option className="bg-[#1a1a1a] " value="trade">
                  {t("spot")}
                </option>
                <option className="bg-[#1a1a1a]" value="perpetual">
                  {t("perpetual")}
                </option>
                <option className="bg-[#1a1a1a]" value="futures">
                  {t("trading")}
                </option>
              </select>
              <div
                className="text-2xl text-gray-400 cursor-pointer"
                onClick={() => dispatch(setShowChart(!showChart))}
              >
                <MdCandlestickChart className="text-green-400" />
              </div>
            </div>
          )}
        </div>
        <div className=" hidden sm:flex justify-center w-[60%]  ">
          <div className="flex w-[350px] justify-center items-center ">
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className={`${getModeColor(
                  "t"
                )} hover:text-[#0077ff] text-center  `}
              >
                {t("admin")}
              </Link>
            )}

            <Link
              to={"/"}
              className={`  hover:text-[#0077ff] 
             text-center    ${getModeColor("t")} m-2 `}
            >
              {t("home")}
            </Link>
            <Link
              to={"/market"}
              className={`  hover:text-[#0077ff] m-2 ${getModeColor(
                "t"
              )} text-center  `}
            >
              {t("market")}
            </Link>
             <Link
              to={"/chat"}
              className={`  hover:text-[#0077ff] m-2 ${getModeColor(
                "t"
              )} text-center  `}
            >
              Contact
            </Link>
             
            <Menu
              open={tradeMenu}
              handler={setTradeMenu}
              allowHover
              className="relative "
            >
              <MenuHandler>
                <Link
                  variant="text"
                  className={`flex items-center justify-center gap-1    hover:text-secondary font-normal capitalize m-0 p-0 border-0 outline-none  pr-1 ${
                    user?.role !== "admin" ? "min-w-[60px] max-w-[70px]" : ""
                  } `}
                >
                  <span className={`text-[16px]  ${getModeColor("t")} `}>
                    {t("trade")}{" "}
                  </span>

                  <VscChevronDown
                    strokeWidth={1.5}
                    className={`h-3.5 w-3.5 p-0 m-0 transform transition-transform duration-400 ease-in-out ${
                      tradeMenu ? "rotate-180" : ""
                    }  ${getModeColor("t")} `}
                  />
                </Link>
              </MenuHandler>
              <MenuList className="absolute w-15 rounded-md shadow-lg border-0 outline-none bg-white ring-opacity-5 p-0">
                <MenuItem>
                  <Link
                    to={"/trade"}
                    className="flex justify-between m-0 p-2 text-sm w-full text-tertiary hover:bg-gray-300 hover:text-[#0077ff]"
                  >
                    <span>{t("spot")}</span> <span>🎯</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to={"/futures"}
                    className="flex justify-between m-0 p-2 text-sm w-full text-tertiary hover:bg-gray-300 hover:text-[#0077ff]"
                  >
                    <span>{t("trading")}</span>
                    <span>📈</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to={"/perpetual"}
                    className="flex justify-between m-0 p-2 text-sm w-full text-tertiary hover:bg-gray-300 hover:text-[#0077ff]"
                  >
                    <span>{t("perpetual")}</span> <span>♾️</span>
                  </Link>
                </MenuItem>
              </MenuList>
            </Menu>
            <Link
              to={"/wallet"}
              className={` ${getModeColor(
                "t"
              )}  hover:text-[#0077ff] text-center m-2  `}
            >
              {t("wallet")}
            </Link>
            <Link
              to={"/about"}
              className={` ${getModeColor(
                "t"
              )}  hover:text-[#0077ff] text-center m-2  `}
            >
              {t("about")}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="w-fit flex items-center space-x-4  ">
              <Link to={"/login"}>
                <div className="min-w-[10vw] sm:w-[7vw] px-3 py-1 flex justify-center cursor-pointer rounded-full bg-transparent border-[#1E90FF]">
                  <button className={` ${getModeColor("t")} `}>
                    {t("login")}
                  </button>
                </div>
              </Link>
              <Link to={"/register"}>
                <div className="min-w-[10vw] sm:w-[7vw] px-2 py-1 flex justify-center cursor-pointer rounded-full bg-[#1E90FF]  ">
                  <button className={` ${getModeColor("t")} `}>
                    {t("register")}
                  </button>
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Menu
                open={openMenu}
                handler={setOpenMenu}
                allowHover
                className="relative"
              >
                <MenuHandler>
                  <Link
                    variant="text"
                    className="flex items-center gap-1   hover:text-secondary font-normal capitalize m-0 p-0 justify-center bg-none border-none outline-none focus:outline-none shadow-none"
                  >
                    <span className={`text-[16px] ${getModeColor("t")}`}>
                      {t("profile")}
                    </span>
                    <VscChevronDown
                      strokeWidth={1.5}
                      className={`h-3.5 w-3.5 p-0 m-0 transform transition-transform duration-400 ease-in-out ${getModeColor(
                        "t"
                      )} ${openMenu ? "rotate-180" : ""}`}
                    />
                  </Link>
                </MenuHandler>
                <MenuList
                  className="absolute rounded-md shadow-lg bg-white border-0 outline-none
                ring-opacity-5 p-0"
                >
                  <MenuItem>
                    <p className="block m-0  rounded  p-2  text-sm max-w-[100%] overflow-hidden line-wrap  text-bolder">
                      {user.email}
                    </p>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={"/wallet"}
                      className="flex justify-between m-0 rounded  p-2 text-sm w-full text-tertiary hover:bg-gray-300 hover:text-[#0077ff]"
                    >
                      <span>{t("assets_wallet")}</span>
                      <span>💼</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <p
                      onClick={handleLogoutDialog}
                      className="flex justify-between m-0 rounded  p-2 text-sm w-full text-tertiary hover:bg-gray-300 hover:text-[#0077ff]"
                    >
                      <span>{t("logout")}</span>
                      <span>🚶‍♀️</span>
                    </p>
                  </MenuItem>
                </MenuList>
              </Menu>
              <div className="flex items-center justify-center ">
                <Link to={"/chat"}>👨‍💼</Link>
              </div>
              
            </>
          )}
          {!user && (
            <div className="sm:hidden">
              <button
                onClick={toggleMenu}
                className={`  text-2xl ${getModeColor("t")}`}
              >
                {mobileMenuOpen ? (
                  <AiOutlineClose className={`${getModeColor("t")}`} />
                ) : (
                  <AiOutlineMenu className={`${getModeColor("t")}`} />
                )}
              </button>
            </div>
          )}
          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center ${
                  isActive ? "text-blue-400" : "text-gray-400"
                }  ${getModeColor("t")}`
              }
            >
              <MdPerson color={theme === "dark" ? "#fff" : "#000"} size={24} />
            </NavLink>
          )}
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 right-0 h-full w-3/4 bg-[#1C1C1C] shadow-lg z-30 flex flex-col p-6  border "
          >
            <button onClick={toggleMenu} className="self-end text-2xl  ">
              <AiOutlineClose />
            </button>

            {user?.role === "admin" && (
              <Link
                to={"/admin/dashboard"}
                className="py-3"
                onClick={toggleMenu}
              >
                {t("admin_panel")}
              </Link>
            )}
            <Link to={"/"} className="py-3" onClick={toggleMenu}>
              {t("home")}
            </Link>
            <Link to={"/market"} className="py-3" onClick={toggleMenu}>
              {t("market")}
            </Link>
            <Link to={"/trade"} className="py-3 border border-amber-300" onClick={toggleMenu}>
              {t("spot")}
            </Link>
            <Link to={"/futures"} className="py-3" onClick={toggleMenu}>
              {t("trading")}
            </Link>
            <Link to={"/perpetual"} className="py-3" onClick={toggleMenu}>
              {t("perpetual")}
            </Link>
            <Link to={"/wallet"} className="py-3" onClick={toggleMenu}>
              {t("wallet")}
            </Link>
            <Link to={"/about"} className="py-3" onClick={toggleMenu}>
              {t("about")}
            </Link>

            {!user ? (
              <>
                <Link to={"/login"} className="py-3" onClick={toggleMenu}>
                  {t("login")}
                </Link>
                <Link to={"/register"} className="py-3" onClick={toggleMenu}>
                  {t("register")}
                </Link>
              </>
            ) : (
              <>
                <p onClick={handleLogoutDialog} className="py-3 cursor-pointer">
                  {t("logout")}
                </p>
              </>
            )}
          </motion.div>
        )}
        <Modal
          show={openDialog}
          size="md"
          className="backdrop-blur-[2px] bg-black/50   rounded-lg "
        >
          <div className="bg-[#1A1A1A] rounded-lg p-5">
            <div>
              <p>{t("logout_confirmation")}</p>
            </div>
            <div className="mt-2 w-full flex justify-end">
              <Button
                variant="text"
                color="red"
                onClick={handleLogoutDialog}
                className="mr-1"
              >
                <span>{t("cancel")}</span>
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-green-500 hover:bg-green-400 rounded-md px-3 py-1"
              >
                <span>{t("confirm")}</span>
              </Button>
            </div>
          </div>
        </Modal>
      </nav>
    </header>
  );
};

export default Navbar;
