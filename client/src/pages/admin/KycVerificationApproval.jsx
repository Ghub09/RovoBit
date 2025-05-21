import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaIdCard,
} from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const KycVerificationApproval = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const response = await API.get("/kyc/pending");
      if (response.data.success) {
        setPendingVerifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pending KYC verifications:", error);
      toast.error("Failed to fetch pending verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      setLoading(true);
      const response = await API.post("/kyc/verify", {
        userId,
        status: "verified",
      });

      if (response.data.success) {
        toast.success("User ID verified successfully");
        // Remove verified user from the list
        setPendingVerifications((prev) =>
          prev.filter((user) => user._id !== userId)
        );
      }
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error(error.response?.data?.message || "Failed to verify user");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/kyc/verify", {
        userId: selectedUser._id,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });

      if (response.data.success) {
        toast.success("User ID rejected");
        // Remove rejected user from the list
        setPendingVerifications((prev) =>
          prev.filter((user) => user._id !== selectedUser._id)
        );
        // Close modal and reset fields
        setShowRejectionModal(false);
        setSelectedUser(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error(
        error.response?.data?.message || "Failed to reject user verification"
      );
    } finally {
      setLoading(false);
    }
  };

  const openRejectionModal = (user) => {
    setSelectedUser(user);
    setShowRejectionModal(true);
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setSelectedUser(null);
    setRejectionReason("");
  };

  const filteredVerifications = searchTerm
    ? pendingVerifications.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pendingVerifications;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-8 py-4 text-white">
      <h1 className="text-4xl font-bold mb-6">KYC Verification Management</h1>

      <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaIdCard className="text-2xl mr-2" />
            <h2 className="text-xl font-semibold">Pending ID Verifications</h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email"
              className="bg-[#2a2a2a] text-gray-300 px-4 py-2 pl-10 rounded-md w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading verifications...</p>
          </div>
        ) : filteredVerifications.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>
              {searchTerm
                ? "No users match your search"
                : "No pending verifications"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2a2a2a] text-left">
                  <th className="px-4 py-3 border-b border-gray-700">User</th>
                  <th className="px-4 py-3 border-b border-gray-700">Email</th>
                  <th className="px-4 py-3 border-b border-gray-700">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 border-b border-gray-700">
                    Documents
                  </th>
                  <th className="px-4 py-3 border-b border-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    <td className="px-4 py-4">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      {new Date(user.kycDocuments.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <a
                          href={user.kycDocuments.idFront}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                        >
                          Front ID
                        </a>
                        <a
                          href={user.kycDocuments.idBack}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                        >
                          Back ID
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm"
                          disabled={loading}
                        >
                          <FaCheckCircle className="mr-1" /> Verify
                        </button>
                        <button
                          onClick={() => openRejectionModal(user)}
                          className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm"
                          disabled={loading}
                        >
                          <FaTimesCircle className="mr-1" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Reject ID Verification</h3>
            <p className="mb-4">
              Please provide a reason for rejecting the ID verification for{" "}
              <span className="font-semibold">
                {selectedUser.firstName} {selectedUser.lastName}
              </span>
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection"
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-md mb-4 text-white"
              rows={4}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejectionModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
                disabled={loading || !rejectionReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycVerificationApproval;
