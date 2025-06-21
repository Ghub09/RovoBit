import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import isEqual from "lodash.isequal";
import { toast } from "react-toastify";
import {
  fetchUserWallet,
  updateUserWallets,
} from "../../pages/admin/DeleteUser";
import SmallLoader from "../layout/smallLoader.jsx";

const RemoveToken = ({ openModal, handleCloseModal, user }) => {
  const types = ["Spot", "trading", "Perpetual"];
  const [section, setSection] = useState("Spot");
  const [wallets, setWallets] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    spotWallet: "",
    futuresWallet: "",
    perpetualsWallet: "",
    holdings: [],
  };
  const [updatedWallet, setUpdatedWallet] = useState(initialValues);

  useEffect(() => {
    setLoading(true);
    const fetchWallet = async () => {
      if (!user?._id) return;
      try {
        const res = await fetchUserWallet(user._id);
        setWallets(res);
        setUpdatedWallet({
          spotWallet: "",
          futuresWallet: "",
          perpetualsWallet: "",
          holdings:
            res.holdings?.map((h) => ({
              asset: h.asset,
              quantity: "",
            })) || [],
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWallet();
  }, [user]);

  const handleUpdate = async () => {
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
      holdings: updatedWallet.holdings.map((h, i) => ({
        asset: h.asset,
        quantity:
          h.quantity !== ""
            ? Number(h.quantity)
            : wallets?.holdings?.[i]?.quantity || 0,
      })),
    };

    const hasChanged = !isEqual(finalUpdate, wallets);
    if (!hasChanged) {
      toast.info("You have not made any changes.");
      return;
    }

    try {
      await updateUserWallets(finalUpdate, user?._id);
      toast.success("Wallet updated successfully!");
      handleCloseModal();
      setWallets("");
      setUpdatedWallet(initialValues);
    } catch (error) {
      toast.error("Failed to update wallet.");
    }
  };

  const handleNumericChange = (value, setter) => {
    if (/^\d*\.?\d*$/.test(value)) setter(value);
  };

  const handleHoldingChange = (index, value) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    const newHoldings = [...updatedWallet.holdings];
    newHoldings[index].quantity = value;
    setUpdatedWallet({ ...updatedWallet, holdings: newHoldings });
  };

  return (
    <Dialog open={openModal} size="lg">
      <div onClick={(e) => e.stopPropagation()}>
        <DialogHeader className="text-black">Token Management</DialogHeader>
        <DialogBody className="text-black">
          <div className="h-[300px] overflow-y-auto">
            {/* Section Switch */}
            {loading ? (
              <SmallLoader />
            ) : (
              <>
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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Current Wallet */}
                  <div className="border p-3 rounded">
                    <h2 className="font-medium mb-2">Current</h2>
                    {section === "Spot" ? (
                      <>
                        <p className="mb-1">USDT: {wallets?.spotWallet}</p>
                        {wallets?.holdings?.map((coin, i) => (
                          <p key={i}>
                            {coin.asset}: {coin.quantity}
                          </p>
                        ))}
                      </>
                    ) : section === "trading" ? (
                      <p>USDT: {wallets?.futuresWallet}</p>
                    ) : (
                      <p>USDT: {wallets?.perpetualsWallet}</p>
                    )}
                  </div>

                  {/* Update Wallet */}
                  <div className="border p-3 rounded space-y-2">
                    <h2 className="font-medium mb-2">Update</h2>
                    {section === "Spot" ? (
                      <>
                        <Input
                          label="Update USDT"
                          placeholder={wallets?.spotWallet?.toString()}
                          value={updatedWallet.spotWallet}
                          onChange={(e) =>
                            handleNumericChange(e.target.value, (val) =>
                              setUpdatedWallet((prev) => ({
                                ...prev,
                                spotWallet: val,
                              }))
                            )
                          }
                        />
                        {updatedWallet.holdings.map((coin, i) => (
                          <Input
                            key={i}
                            label={`Update ${coin.asset}`}
                            placeholder={
                              wallets?.holdings[i]?.quantity?.toString() || "0"
                            }
                            value={coin.quantity}
                            onChange={(e) =>
                              handleHoldingChange(i, e.target.value)
                            }
                          />
                        ))}
                      </>
                    ) : section === "trading" ? (
                      <Input
                        label="Update Trading USDT"
                        placeholder={wallets?.futuresWallet?.toString()}
                        value={updatedWallet.futuresWallet}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, (val) =>
                            setUpdatedWallet((prev) => ({
                              ...prev,
                              futuresWallet: val,
                            }))
                          )
                        }
                      />
                    ) : (
                      <Input
                        label="Update Perpetual USDT"
                        placeholder={wallets?.perpetualsWallet?.toString()}
                        value={updatedWallet.perpetualsWallet}
                        onChange={(e) =>
                          handleNumericChange(e.target.value, (val) =>
                            setUpdatedWallet((prev) => ({
                              ...prev,
                              perpetualsWallet: val,
                            }))
                          )
                        }
                      />
                    )}
                  </div>

                  {/* Changed Wallet */}
                  <div className="border p-3 rounded text-sm space-y-1">
                    <h2 className="font-medium mb-2">Changed</h2>
                    {section === "Spot" && (
                      <>
                        {updatedWallet.spotWallet !== "" &&
                          Number(updatedWallet.spotWallet) !==
                            wallets?.spotWallet && (
                            <p>USDT: {updatedWallet.spotWallet}</p>
                          )}
                        {updatedWallet.holdings.map((coin, i) => {
                          const oldQty = Number(
                            wallets?.holdings[i]?.quantity || 0
                          );
                          const newQty = Number(coin.quantity);
                          return coin.quantity !== "" && newQty !== oldQty ? (
                            <p key={i}>
                              {coin.asset}: {coin.quantity}
                            </p>
                          ) : null;
                        })}
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
              </>
            )}
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
      </div>
    </Dialog>
  );
};

export default RemoveToken;
