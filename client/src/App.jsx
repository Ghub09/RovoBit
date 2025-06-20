import { useEffect} from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import { useDispatch, useSelector } from "react-redux";
import Wallet from "./pages/finance/Wallet.jsx";
import Deposit from "./pages/finance/Deposit.jsx";
import RequestRelease from "./pages/finance/RequestRelease.jsx";
import Withdraw from "./pages/finance/Withdraw.jsx";
import ProtectedRoute from "./components/middleware/ProtectedRoute.jsx";
import { logout, setUser } from "./store/slices/userSlice";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUser from "./pages/admin/ManageUser.jsx";
import ManageTransactions from "./pages/admin/ManageTransactions.jsx";
import AdminProtectedRoute from "./components/middleware/AdminProtectedRoute.jsx";
import AddTokens from "./pages/admin/AddTokens.jsx";
import FuturesTrade from "./pages/FuturesTrade.jsx";
import PerpetualTrade from "./pages/PerpetualTrade.jsx";
import BottomNavbar from "./components/layout/BottomNavbar.jsx";
import LiquidateOpenTrades from "./pages/admin/LiquidateOpenTrades.jsx";
import HistoryPage from "./pages/finance/HistoryPage.jsx";
import SendPnL from "./pages/admin/SendPnL.jsx";
import Profile from "./pages/Profile.jsx";
import KycVerification from "./pages/KycVerification.jsx";
import KycVerificationApproval from "./pages/admin/KycVerificationApproval.jsx";
import ManageNews from "./pages/admin/ManageNews.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";
import Loader from "./components/layout/Loader.jsx";
import { io } from "socket.io-client";
import ChatBox from "./pages/ChatBox.jsx";
import AdminChat from "./pages/admin/AdminChat.jsx";
const App = () => {
  const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.global);
    const socket = io("http://localhost:5000");
    
    useEffect(() => {
      // socket.on("connect", () => {
      //   console.log("Connected",socket.id);
      // });

      // socket.on("WelCome", (message) => {
      //   console.log(message);
      // });
      socket.on("user_connected", (message) => {
        console.log("user_connected",message);
      });
      return () => {
        socket.disconnect();
      };
    }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(setUser(user));
      logout()
    }
  }, [dispatch]);
 return (
      <div className="bg-gradient text-white overflow-hidden">
        <Router>
          <Navbar />
          <main className="pt-[82px]">
                         {loading && <Loader />}
              
             <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/market" element={<Market />} />
              <Route path="/chat" element={<ChatBox/>} />
               <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users/manage" element={<ManageUser />} />
                <Route path="/admin/orders/manage" element={<ManageOrders />} />
                <Route
                  path="/admin/transaction/manage"
                  element={<ManageTransactions />}
                />
                <Route
                  path="/admin/messages"
                  element={<AdminChat />}
                />
                  <Route
                  path="/admin/users/add-tokens/:userId"
                  element={<AddTokens />}
                />
                <Route
                  path="/admin/liquidate/open-trades"
                  element={<LiquidateOpenTrades />}
                />
                <Route
                  path="/admin/send-pnl/:tradeId/:marketPrice/:type"
                  element={<SendPnL />}
                />
                <Route
                  path="/admin/kyc/verification"
                  element={<KycVerificationApproval />}
                />
                <Route path="/admin/news/manage" element={<ManageNews />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wallet/deposit" element={<Deposit />} />
                <Route path="/wallet/withdraw" element={<Withdraw />} />
                <Route
                  path="/wallet/request-release-funds"
                  element={<RequestRelease />}
                />
                <Route path="/wallet/withdraw" element={<Withdraw />} />
                <Route path="/wallet/histories" element={<HistoryPage />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/futures" element={<FuturesTrade />} />
                <Route path="/perpetual" element={<PerpetualTrade />} />
                <Route path="/kyc-verification" element={<KycVerification />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <BottomNavbar />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Router>
      </div>
   );
};

export default App;
