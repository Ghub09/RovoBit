import React, { useState, useEffect } from "react";
import { FaIdCard, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../utils/api";

const KycVerification = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
  });
  const [preview, setPreview] = useState({
    idFront: null,
    idBack: null,
  });

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      setLoading(true);
      const response = await API.get("/kyc/status");
      if (response.data.success) {
        setKycStatus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [type]: file,
      }));

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.idFront || !files.idBack) {
      return toast.error("Please upload both front and back sides of your ID");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("idFront", files.idFront);
      formData.append("idBack", files.idBack);

      const response = await API.post("/kyc/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("KYC documents uploaded successfully");
        fetchKycStatus();
      }
    } catch (error) {
      console.error("Error uploading KYC documents:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload KYC documents"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderKycStatus = () => {
    if (
      !kycStatus ||
      !kycStatus.kycDocuments ||
      !kycStatus.kycDocuments.verificationStatus
    ) {
      return (
        <div className="text-center mb-6">
          <p className="text-lg">
            You haven't submitted your KYC documents yet.
          </p>
        </div>
      );
    }

    const { verificationStatus, rejectionReason } = kycStatus.kycDocuments;

    if (verificationStatus === "pending") {
      return (
        <div className="bg-[#332b00] p-4 rounded-lg text-center mb-6">
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">
            Verification Pending
          </h3>
          <p>
            Your ID verification is being reviewed by our team. This usually
            takes 1-3 business days.
          </p>
        </div>
      );
    } else if (verificationStatus === "verified") {
      return (
        <div className="bg-[#0e2b00] p-4 rounded-lg text-center mb-6">
          <h3 className="text-xl font-semibold text-green-400 mb-2">
            Verification Approved
          </h3>
          <p>
            Your ID has been verified successfully. You now have full access to
            all features.
          </p>
        </div>
      );
    } else if (verificationStatus === "rejected") {
      return (
        <div className="bg-[#2b0000] p-4 rounded-lg text-center mb-6">
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Verification Rejected
          </h3>
          <p>Your ID verification was rejected for the following reason:</p>
          <p className="font-medium mt-2">
            {rejectionReason || "Unspecified reason"}
          </p>
          <p className="mt-4">
            Please submit new documents addressing the issue mentioned above.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ID Verification (KYC)</h1>
        </div>

        {renderKycStatus()}

        {(!kycStatus?.kycDocuments?.verificationStatus ||
          kycStatus?.kycDocuments?.verificationStatus === "rejected") && (
          <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaIdCard className="mr-2" /> Upload ID Documents
            </h2>
            <p className="text-gray-400 mb-6">
              Please upload clear photos of the front and back sides of your
              government-issued ID. Supported formats: JPG, PNG, PDF (max size:
              5MB)
            </p>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Front Side of ID
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                    {preview.idFront ? (
                      <div className="mb-2">
                        <img
                          src={preview.idFront}
                          alt="ID Front Preview"
                          className="max-h-40 mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="py-8">
                        <FaIdCard className="text-4xl mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-500">No file selected</p>
                      </div>
                    )}
                    <label className="block mt-4">
                      <span className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer transition duration-300">
                        <FaUpload className="mr-2" />{" "}
                        {preview.idFront ? "Change File" : "Select File"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, "idFront")}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Back Side of ID
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                    {preview.idBack ? (
                      <div className="mb-2">
                        <img
                          src={preview.idBack}
                          alt="ID Back Preview"
                          className="max-h-40 mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="py-8">
                        <FaIdCard className="text-4xl mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-500">No file selected</p>
                      </div>
                    )}
                    <label className="block mt-4">
                      <span className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer transition duration-300">
                        <FaUpload className="mr-2" />{" "}
                        {preview.idBack ? "Change File" : "Select File"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, "idBack")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  disabled={loading || !files.idFront || !files.idBack}
                >
                  {loading ? "Uploading..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Why do we need your ID?
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>To comply with KYC (Know Your Customer) regulations</li>
            <li>To prevent fraud and unauthorized account access</li>
            <li>To enable withdrawal of funds and trading of larger amounts</li>
            <li>To maintain a secure trading environment for all users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KycVerification;
