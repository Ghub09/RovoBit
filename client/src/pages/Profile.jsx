import { useState, useEffect } from "react";
import { FaHistory, FaCoins, FaIdCard, FaSignOutAlt } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Assets from "../components/wallet/Assets";
import { MdOutlineSupportAgent } from "react-icons/md";
import UserAvatar from "../assets/user-avatar.png";
import API from "../utils/api";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import { logout } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import ConnectionDiagnostic from "../components/mini/ConnectionDiagnostic";
import { FaBug } from "react-icons/fa";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAssets, setShowAssets] = useState(false);
  const [showAppearanceSettings, setShowAppearanceSettings] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const response = await API.get("/kyc/status");
      if (response.data.success) {
        setKycStatus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const renderVerificationStatus = () => {
    if (
      !kycStatus ||
      !kycStatus.kycDocuments ||
      !kycStatus.kycDocuments.verificationStatus
    ) {
      return (
        <span className="bg-gray-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("not_verified")}
        </span>
      );
    }

    const { verificationStatus } = kycStatus.kycDocuments;

    if (verificationStatus === "pending") {
      return (
        <span className="bg-yellow-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("pending")}
        </span>
      );
    } else if (verificationStatus === "verified") {
      return (
        <span className="bg-green-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("verified")}
        </span>
      );
    } else if (verificationStatus === "rejected") {
      return (
        <span className="bg-red-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("rejected")}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-6 max-w-7xl mx-auto ">
      {/* Header */}
      {showAssets ? (
        <Assets type={"spot"} />
      ) : showAppearanceSettings ? (
        <AppearanceSettings onClose={() => setShowAppearanceSettings(false)} />
      ) : showDiagnostic ? (
        <div>
          <button 
            onClick={() => setShowDiagnostic(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
          >
            ← Back to Profile
          </button>
          <ConnectionDiagnostic />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t("profile")}</h1>
          </div>

          {/* User Information */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg mb-6 shadow-md border border-gray-800">
            <div className="flex items-center">
              <div className="pr-4">
                <img
                  src={UserAvatar}
                  alt="User"
                  className="w-16 h-16 rounded-full border-2 border-[#00FF7F]"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#00FF7F]">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400 text-sm">
                  <span className="font-medium text-gray-300">{t("id")}: </span>
                  {user._id?.substring(0, 10)}...
                </p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className="text-gray-300 text-sm font-medium">
                    {t("verification_status")}:{" "}
                  </span>
                  {renderVerificationStatus()}
                </div>
              </div>
            </div>
          </div>

          {/* Clickable Containers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Wallet */}
            <div
              onClick={() => navigate("/wallet")}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <IoWalletOutline className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("my_wallet")}</h3>
                <p className="text-gray-400 text-sm">
                  {t("view_manage_wallet")}
                </p>
              </div>
            </div>

            {/* History */}
            <div
              onClick={() => navigate("/wallet/histories")}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <FaHistory className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("history")}</h3>
                <p className="text-gray-400 text-sm">{t("history_desc")}</p>
              </div>
            </div>

            {/* About */}
            <div
              onClick={() => navigate("/about")}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <FaCircleExclamation className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("about")}</h3>
                <p className="text-gray-400 text-sm">{t("about_desc")}</p>
              </div>
            </div>

            {/* Assets */}
            <div
              onClick={() => setShowAssets(true)}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <FaCoins className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("assets")}</h3>
                <p className="text-gray-400 text-sm">{t("assets_desc")}</p>
              </div>
            </div>

            {/* KYC Verification */}
            <div
              onClick={() => navigate("/kyc-verification")}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <FaIdCard className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("id_verification")}</h3>
                <p className="text-gray-400 text-sm">{t("kyc_desc")}</p>
              </div>
            </div>

            {/* Appearance */}
            <div
              onClick={() => setShowAppearanceSettings(true)}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <MdLanguage className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("appearance")}</h3>
                <p className="text-gray-400 text-sm">
                  {t("appearance_settings")}
                </p>
              </div>
            </div>

            {/* Help */}
            <Link
              to={"/chat"}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#1e2a20] p-3 rounded-full mr-3">
                <MdOutlineSupportAgent className="text-[#00FF7F] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("help")}</h3>
                <p className="text-gray-400 text-sm">{t("help_desc")}</p>
              </div>
            </Link>

            {/* Connection Diagnostic - For developers/admins */}
            {(user.role === "admin" || import.meta.env.DEV) && (
              <div
                onClick={() => setShowDiagnostic(true)}
                className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
              >
                <div className="bg-[#202a1e] p-3 rounded-full mr-3">
                  <FaBug className="text-[#ff9900] text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold">Connection Diagnostic</h3>
                  <p className="text-gray-400 text-sm">
                    Test API and Socket connections
                  </p>
                </div>
              </div>
            )}

            {/* Logout - New Card */}
            <div
              onClick={handleLogout}
              className="bg-[#1a1a1a] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-all duration-200 border border-gray-800 shadow-sm flex items-center"
            >
              <div className="bg-[#2a1e1e] p-3 rounded-full mr-3">
                <FaSignOutAlt className="text-[#ff5e5a] text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{t("logout")}</h3>
                <p className="text-gray-400 text-sm">
                  {t("sign_out_of_your_account")}
                </p>
              </div>
            </div>
          </div>
          
          {/* Developer Mode Indicator */}
          {import.meta.env.DEV && (
            <div className="mt-8 text-center bg-yellow-800 py-2 rounded-lg">
              <p className="text-yellow-300 text-sm">
                Development Mode Active - Environment: {import.meta.env.MODE}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;