import { Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaIdCard, FaNewspaper } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-8 py-4 text-white">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-lg bg-[#2A2A2A] text-gray-500 p-6 hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-2 text-white">
            User Management
          </h2>
          <p>View, Analyze, Block any user seamlesy and effectively</p>
          <Link to={"/admin/users/manage"}>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Manage User Here
            </p>
          </Link>
        </Card>
        <Card className="rounded-lg bg-[#2A2A2A] text-gray-500 p-6 hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Transaction Approval
          </h2>
          <p>
            Approve or Deny any Deposit or Withdraw Transaction seamlesy and
            effectively
          </p>
          <Link to={"/admin/transaction/manage"}>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Transaction Management
            </p>
          </Link>
        </Card>
        <Card className="rounded-lg bg-[#2A2A2A] text-gray-500 p-6 hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Order Managements
          </h2>
          <p>View, Analyze, Block and Approve only Valid Orders</p>
          <Link to={"/admin/orders/manage"}>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Manage Orders Here
            </p>
          </Link>
        </Card>
        <Card className="rounded-lg bg-[#2A2A2A] text-gray-500 p-6 hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Futures & Perpetual Trades Management
          </h2>
          <p>View, Analyze, Block and Approve only Valid Orders</p>
          <Link to={"/admin/liquidate/open-trades"}>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Liquidate Open Trades Here
            </p>
          </Link>
        </Card>
        <Card className="rounded-lg bg-[#2A2A2A] text-gray-500 p-6 hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-2 text-white flex items-center">
            <FaIdCard className="mr-2" /> KYC Verification
          </h2>
          <p>Verify user identity documents for KYC compliance</p>
          <Link to={"/admin/kyc/verification"}>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Manage KYC Verifications
            </p>
          </Link>
        </Card>
        <Card className="rounded-lg bg-[#2A2A2A] text-gray-500 p-6 hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-2 text-white flex items-center">
            <FaNewspaper className="mr-2" /> News Management
          </h2>
          <p>Create, update, and manage news items shown on the homepage</p>
          <Link to={"/admin/news/manage"}>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Manage News Items
            </p>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
