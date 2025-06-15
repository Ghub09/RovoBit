import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { fetchUserWallet, updateUserWallets } from "../../pages/admin/DeleteUser";

const RemoveToken = ({ openModal, handleCloseModal, user }) => {
  const types = ["Spot", "trading", "Perpetual"];
  const [section, setSection] = useState("Spot");
  const [wallets, setWallets] = useState(null);
  const [updatedWallet, setUpdatedWallet] = useState({
    spotWallet: "",
    futuresWallet: "",
    perpetualsWallet: "",
    holdings: [],
  });
  console.log(user)
  // Fetch wallet info
  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?._id) return;
      try {
        const res = await fetchUserWallet(user._id);
        setWallets({
          spotWallet: res.spotWallet,
          futuresWallet: res.futuresWallet,
          perpetualsWallet: res.perpetualsWallet,
          holdings: res.holdings,
        });

        // Initialize updatedWallet state with placeholders
        setUpdatedWallet({
          spotWallet: "",
          futuresWallet: "",
          perpetualsWallet: "",
          holdings: res.holdings?.map((h) => ({
            asset: h.asset,
            quantity: "",
          })),
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchWallet();
  }, [user]);

  const handleUpdate = async( ) => {
    const finalUpdate = {
      spotWallet:
        updatedWallet.spotWallet !== ""
          ? Number(updatedWallet.spotWallet)
          : wallets?.spotWallet,
      futuresWallet:
        updatedWallet.futuresWallet !== ""
          ? Number(updatedWallet.futuresWallet)
          : wallets?.futuresWallet,
      perpetualsWallet:
        updatedWallet.perpetualsWallet !== ""
          ? Number(updatedWallet.perpetualsWallet)
          : wallets?.perpetualsWallet,
      holdings: updatedWallet.holdings.map((h, index) => ({
        asset: h.asset,
        quantity:
          h.quantity !== ""
            ? Number(h.quantity)
            : wallets?.holdings[index]?.quantity,
      })),
    };

    try {
      const res=await updateUserWallets(finalUpdate,user?._id)
      console.log("🚀 Updated Wallet Object:", finalUpdate);
      console.log(res?.message)
      toast.success("Token Updated Successfully");
      handleCloseModal();
      
    } catch (error) {
       console.log("Some thing went wrong",error)
    }
  };

  const handleHoldingChange = (index, value) => {
    const newHoldings = [...updatedWallet.holdings];
    newHoldings[index].quantity = value;
    setUpdatedWallet({ ...updatedWallet, holdings: newHoldings });
  };

  return (
    <Dialog open={openModal} handler={handleCloseModal} size="lg">
      <DialogHeader className="text-black">Token Management</DialogHeader>
      <DialogBody className="text-black">
        <div className="h-[300px] overflow-y-auto">
          {/* Section Switch */}
          <div className="flex flex-wrap gap-4 mb-4">
            {types.map((t, i) => (
              <button
                key={i}
                onClick={() => setSection(t)}
                className={`cursor-pointer px-3 py-1 rounded-full font-semibold ${
                  section === t
                    ? "bg-yellow-200 text-black"
                    : "bg-gray-400 text-green-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Main Wallet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Current Wallet */}
            <div className="border p-3 rounded">
              <h2 className="font-medium mb-2">Current</h2>
              {section === "Spot" ? (
                <div>
                  <span className="block mb-1">
                    USDT: {wallets?.spotWallet}
                  </span>
                  {wallets?.holdings?.map((coin, i) => (
                    <span key={i} className="block">
                      {coin.asset}: {coin.quantity}
                    </span>
                  ))}
                </div>
              ) : section === "trading" ? (
                <span>USDT: {wallets?.futuresWallet}</span>
              ) : (
                <span>USDT: {wallets?.perpetualsWallet}</span>
              )}
            </div>

            {/* Update Wallet */}
            <div className="border p-3 rounded">
              <h2 className="font-medium mb-2">Update</h2>
              {section === "Spot" ? (
                <div className="space-y-2">
                  <Input
                    label="Update USDT"
                    placeholder={wallets?.spotWallet?.toString()}
                    value={updatedWallet.spotWallet}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setUpdatedWallet({
                          ...updatedWallet,
                          spotWallet: value,
                        });
                      }
                    }}
                  />
                  {updatedWallet.holdings.map((coin, i) => (
                    <Input
                      key={i}
                      label={`Update ${coin.asset}`}
                      placeholder={
                        wallets?.holdings[i]?.quantity?.toString() || "0"
                      }
                      value={coin.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleHoldingChange(i, value);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : section === "trading" ? (
                <Input
                  label="Update Trading USDT"
                  placeholder={wallets?.futuresWallet?.toString()}
                  value={updatedWallet.futuresWallet}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setUpdatedWallet({
                        ...updatedWallet,
                        futuresWallet: value,
                      });
                    }
                  }}
                />
              ) : (
                <Input
                  label="Update Perpetual USDT"
                  placeholder={wallets?.perpetualsWallet?.toString()}
                  value={updatedWallet.perpetualsWallet}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setUpdatedWallet({
                        ...updatedWallet,
                        perpetualsWallet: value,
                      });
                    }
                  }}
                />
              )}
            </div>

            {/* Changed Fields */}
            <div className="border p-3 rounded">
              <h2 className="font-medium mb-2">Changed</h2>
              <div className="space-y-1 text-sm">
                {section === "Spot" && (
                  <>
                    {updatedWallet.spotWallet !== "" &&
                    Number(updatedWallet.spotWallet) !== wallets?.spotWallet ? (
                      <p>USDT: {updatedWallet.spotWallet}</p>
                    ) : null}

                    {updatedWallet.holdings.map((coin, i) =>
                      coin.quantity !== "" &&
                      Number(coin.quantity) !==
                        Number(wallets?.holdings[i]?.quantity) ? (
                        <p key={i}>
                          {coin.asset}: {coin.quantity}
                        </p>
                      ) : null
                    )}
                  </>
                )}

                {section === "trading" &&
                  updatedWallet.futuresWallet !== "" &&
                  Number(updatedWallet.futuresWallet) !==
                    wallets?.futuresWallet && (
                    <p>USDT: {updatedWallet.futuresWallet}</p>
                  )}

                {section === "Perpetual" &&
                  updatedWallet.perpetualsWallet !== "" &&
                  Number(updatedWallet.perpetualsWallet) !==
                    wallets?.perpetualsWallet && (
                    <p>USDT: {updatedWallet.perpetualsWallet}</p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button
          variant="text"
          color="blue"
          onClick={handleCloseModal}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button variant="gradient" color="red" onClick={handleUpdate}>
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RemoveToken;
