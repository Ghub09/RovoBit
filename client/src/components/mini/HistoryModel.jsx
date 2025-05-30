import { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import {
  allPerpetualHistory,
  allSportHistory,
  alltradingHistory,
} from "../../pages/admin/DeleteUser";

const HistoryModel = ({
  openDialog,
  handleDialog,
  labels,
  handleAction,
  action,
  cancel,
  user, // user._id required
}) => {
  const [selectedIds, setSelectedIds] = useState([
    { table: "DW", ids: [] },
    { table: "TS", ids: [] },
    { table: "TP", ids: [] },
    { table: "TR", ids: [] },
  ]);

  const [show, setShow] = useState({
    DW: true,
    TP: false,
    TR: false,
    TS: false,
  });
  const [tradingHistory, setTradingHistory] = useState([]);
  const [sportHistory, setSportHistory] = useState([]);
  const [perpetualHistory, setPerpetualHistory] = useState([]);
  const userId = user?._id;

  useEffect(() => {
    if (!openDialog) {
      setShow({ DW: true, TP: false, TR: false, TS: false });
      setSelectedIds([
        { table: "DW", ids: [] },
        { table: "TS", ids: [] },
        { table: "TP", ids: [] },
        { table: "TR", ids: [] },
      ]);
    } else {
      fetchData();
    }
  }, [openDialog]);

  const fetchData = async () => {
    try {
      const tradingRes = await alltradingHistory(userId);
      const sportRes = await allSportHistory(userId);
      const perpetualRes = await allPerpetualHistory(userId);
      setTradingHistory(tradingRes);
      setSportHistory(sportRes);
      setPerpetualHistory(perpetualRes);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const getTableSelected = (table) =>
    selectedIds.find((entry) => entry.table === table)?.ids || [];
  console.log(selectedIds);
  const updateTableSelected = (table, id) => {
    setSelectedIds((prev) =>
      prev.map((entry) =>
        entry.table === table
          ? {
              ...entry,
              ids: entry.ids.includes(id)
                ? entry.ids.filter((i) => i !== id)
                : [...entry.ids, id],
            }
          : entry
      )
    );
  };

  const handleShow = (type) => {
    setShow({
      DW: type === "DW",
      TP: type === "TP",
      TR: type === "TR",
      TS: type === "TS",
    });
  };

  const handleDelete = () => {
    const allSelected = selectedIds.flatMap((entry) =>
      entry.ids.map((id) => ({ table: entry.table, id }))
    );
    handleAction(allSelected);
  };

  return (
    <Modal
      show={openDialog}
      onClose={handleDialog}
      popup
      className="backdrop-blur-[2px] bg-black/50 text-white rounded-lg"
    >
      <div className="rounded-lg bg-[#1A1A1A] p-5 text-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            className={`${
              show.DW ? "bg-green-600" : ""
            } bg-green-300 p-2 rounded`}
            onClick={() => handleShow("DW")}
          >
            Deposit/Withdraw
          </button>
          <button
            className={`${
              show.TS ? "bg-yellow-600" : ""
            } bg-yellow-300 p-2 rounded`}
            onClick={() => handleShow("TS")}
          >
            Spot
          </button>
          <button
            className={`${
              show.TP ? "bg-purple-600" : ""
            } bg-purple-300 p-2 rounded`}
            onClick={() => handleShow("TP")}
          >
            Perpetual
          </button>
          <button
            className={`${
              show.TR ? "bg-pink-600" : ""
            } bg-pink-300 p-2 rounded`}
            onClick={() => handleShow("TR")}
          >
            Trading
          </button>
        </div>

        <div className="mb-4 text-center overflow-x-auto">
          {/* Deposit/Withdraw Table */}
          {show.DW && (
            <table className="w-full text-left border-collapse border">
              <thead>
                <tr className="border">
                  <th className="p-2 text-center">Select</th>
                  <th className="p-2 text-center">Amount (USDT)</th>
                  <th className="p-2 text-center">Type</th>
                  <th className="p-2 text-center">Address</th>
                  <th className="p-2 text-center">Currency</th>
                  <th className="p-2 text-center">Admin</th>
                  <th className="p-2 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {labels.map((label) => (
                  <tr key={label._id} className="hover:bg-gray-700 border-b text-[13px]">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={getTableSelected("DW").includes(label._id)}
                        onChange={() => updateTableSelected("DW", label._id)}
                      />
                    </td>
                    <td className="p-2 text-center">{label.amount}</td>
                    <td className="p-2 text-center capitalize">{label.type}</td>
                    <td className="p-2 text-center">{label.walletAddress}</td>
                    <td className="p-2 text-center">{label.currency}</td>
                    <td className="p-2 text-center">
                      {label.adminNote === "Request rejected by admin" ? (
                        <span className="text-red-500">Rejected</span>
                      ) : (
                        <span>Approved</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {new Date(label.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Spot Table */}
          {show.TS && (
            <table className="w-full text-left border-collapse border">
              <thead>
                <tr className="border">
                  <th className="p-2 text-center">Select</th>
                  <th className="p-2 text-center">Asset</th>
                  <th className="p-2 text-center">Type</th>
                  <th className="p-2 text-center">Price</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Total Cost</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Executed At</th>
                </tr>
              </thead>
              <tbody>
                {sportHistory?.trades?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-700 border-b text-[13px]">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={getTableSelected("TS").includes(item._id)}
                        onChange={() => updateTableSelected("TS", item._id)}
                      />
                    </td>
                    <td className="p-2 text-center">{item.asset}</td>
                    <td className="p-2 text-center">{item.type}</td>
                    <td className="p-2 text-center">{item.price}</td>
                    <td className="p-2 text-center">
                      {(() => {
                        const num = Number(item.quantity);
                        const [mantissa, exponent] = num
                          .toExponential(2)
                          .split("e");
                        const expNumber = Number(exponent);
                        return (
                          <>
                            {mantissa} × 10<sup>{expNumber}</sup>
                          </>
                        );
                      })()}
                    </td>
                    <td className="p-2 text-center">{item.totalCost}</td>
                    <td className="p-2 text-center">{item.status}</td>
                    <td className="p-2 text-center">
                      {new Date(item.executedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Perpetual Table */}
          {show.TP && (
            <table className="w-full text-left border-collapse border">
              <thead>
                <tr className="border">
                  <th className="p-2 text-center">Select</th>
                  <th className="p-2 text-center">Pair</th>
                  <th className="p-2 text-center">Type</th>
                  <th className="p-2 text-center">Entry-Close</th>
                  <th className="p-2 text-center">Leverage</th>
                  <th className="p-2 text-center">Liquidation</th>
                  <th className="p-2 text-center">Profit/Loss</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Margin</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Start</th>
                  <th className="p-2 text-center">End</th>
                </tr>
              </thead>
              <tbody>
                {perpetualHistory?.trades?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-700 border-b text-[13px]">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={getTableSelected("TP").includes(item._id)}
                        onChange={() => updateTableSelected("TP", item._id)}
                      />
                    </td>
                    <td className="p-2 text-center">{item.pair}</td>
                    <td className="p-2 text-center">{item.type}</td>
                    <td className="p-2 text-center">
                      {item.entryPrice} - {item.closePrice}
                    </td>
                    <td className="p-2 text-center">{item.leverage}x</td>
                    <td className="p-2 text-center">{item.liquidationPrice}</td>
                    <td className="p-2 text-center">{item.profitLoss}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">{item.marginUsed}</td>
                    <td className="p-2 text-center">{item.status}</td>
                    <td className="p-2 text-center">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      {new Date(item.closedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Trading Table */}
          {show.TR && (
            <table className="w-full text-left border-collapse border">
              <thead>
                <tr className="border">
                  <th className="p-2 text-center">Select</th>
                  <th className="p-2 text-center">Pair</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Leverage</th>
                  <th className="p-2 text-center">Price(L)</th>
                  <th className="p-2 text-center">PnL</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {tradingHistory?.trades?.map((item) => (
                  <tr
                    key={item._id || item.tradeId}
                    className="hover:bg-gray-700 border-b text-[13px]"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={getTableSelected("TR").includes(
                          item._id || item.tradeId
                        )}
                        onChange={() =>
                          updateTableSelected("TR", item._id || item.tradeId)
                        }
                      />
                    </td>
                    <td className="p-2 text-center ">{item.asset}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">{item.leverage}x</td>
                    <td className="p-2 text-center">{item.liquidationPrice}</td>
                    <td className="p-2 text-center">{item.pnl}</td>
                    <td className="p-2 text-center">{item.status==="completed"?"Done":item.status}</td>
                    <td className="p-2 text-center ">
<>
  {new Date(item.timestamp).toLocaleDateString()} <br />
  {new Date(item.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
</>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button color="failure" onClick={handleDialog}>
            {cancel}
          </Button>
          <Button
            color="success"
            onClick={handleDelete}
            disabled={selectedIds.every((entry) => entry.ids.length === 0)}
          >
            {action}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryModel;
