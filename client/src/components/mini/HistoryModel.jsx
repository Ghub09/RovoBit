import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import isEqual from "lodash.isequal";
import { toast } from "react-toastify";
import { fetchUserWallet, updateUserWallets } from "../../pages/admin/DeleteUser.jsx";

const RemoveToken = ({ openModal, handleCloseModal, user }) => {
  const types = ["Spot", "trading", "Perpetual"];
  const [section, setSection] = useState("Spot");
  const [wallets, setWallets] = useState(null);

  const initialValues = {
    spotWallet: "",
    futuresWallet: "",
    perpetualsWallet: "",
    holdings: [],
  };

  const [updatedWallet, setUpdatedWallet] = useState(initialValues);
  const triggerRef = useRef(null); // for accessibility focus reset

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

  const handleHoldingChange = (index, value) => {
    const newHoldings = [...updatedWallet.holdings];
    newHoldings[index].quantity = value;
    setUpdatedWallet({ ...updatedWallet, holdings: newHoldings });
  };

  const handleCloseAndReset = () => {
    triggerRef.current?.focus();
    setWallets(null);
    setUpdatedWallet(initialValues);
    handleCloseModal();
  };

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
      holdings: updatedWallet.holdings.map((h, index) => ({
        asset: h.asset,
        quantity:
          h.quantity !== ""
            ? Number(h.quantity)
            : wallets?.holdings[index]?.quantity,
      })),
    };

    const currentData = {
      spotWallet: wallets?.spotWallet,
      futuresWallet: wallets?.futuresWallet,
      perpetualsWallet: wallets?.perpetualsWallet,
      holdings: wallets?.holdings,
    };

    const hasChanged = !isEqual(finalUpdate, currentData);

    if (!hasChanged) {
      toast.info("You have not made any changes.");
      return;
    }

    try {
      const res = await updateUserWallets(finalUpdate, user?._id);
      toast.success("Wallet updated successfully!");
      handleCloseAndReset();
    } catch (error) {
      console.log("Something went wrong", error);
      toast.error("Failed to update wallet.");
    }
  };

  return (
    <>
      {/* Trigger Button Example */}
      <button ref={triggerRef} onClick={() => openModal(true)} className="hidden" />

      <Modal show={openModal} onClose={handleCloseAndReset} size="xl">
        <Modal.Header>Token Management</Modal.Header>
        <Modal.Body>
          {!wallets ? (
            <div className="text-center text-gray-500">Loading wallet data...</div>
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
                {/* Current */}
                <div className="border p-3 rounded">
                  <h2 className="font-medium mb-2">Current</h2>
                  {section === "Spot" ? (
                    <>
                      <div className="block mb-1 flex">
                        <p className="w-[10%]">USDT</p>: {wallets.spotWallet}
                      </div>
                      {wallets?.holdings?.map((coin, i) => (
                        <div key={i} className="block">
                          <div className="flex">
                            <p className="w-[10%]">{coin.asset}</p>: {coin.quantity}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : section === "trading" ? (
                    <div>USDT: {wallets.futuresWallet}</div>
                  ) : (
                    <div>USDT: {wallets.perpetualsWallet}</div>
                  )}
                </div>

                {/* Update */}
                <div className="border p-3 rounded space-y-2">
                  <h2 className="font-medium mb-2">Update</h2>
                  {section === "Spot" ? (
                    <>
                      <TextInput
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
                        <TextInput
                          key={i}
                          placeholder={wallets?.holdings[i]?.quantity?.toString() || "0"}
                          value={coin.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              handleHoldingChange(i, value);
                            }
                          }}
                        />
                      ))}
                    </>
                  ) : section === "trading" ? (
                    <TextInput
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
                    <TextInput
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

                {/* Changed */}
                <div className="border p-3 rounded text-sm">
                  <h2 className="font-medium mb-2">Changed</h2>
                  {section === "Spot" && (
                    <>
                      {updatedWallet.spotWallet !== "" &&
                        Number(updatedWallet.spotWallet) !== wallets?.spotWallet && (
                          <p>USDT: {updatedWallet.spotWallet}</p>
                        )}
                      {updatedWallet.holdings.map((coin, i) =>
                        coin.quantity !== "" &&
                        Number(coin.quantity) !== Number(wallets?.holdings[i]?.quantity) ? (
                          <p key={i}>
                            {coin.asset}: {coin.quantity}
                          </p>
                        ) : null
                      )}
                    </>
                  )}
                  {section === "trading" &&
                    updatedWallet.futuresWallet !== "" &&
                    Number(updatedWallet.futuresWallet) !== wallets?.futuresWallet && (
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
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={handleCloseAndReset}>
            Cancel
          </Button>
          <Button color="failure" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemoveToken;
