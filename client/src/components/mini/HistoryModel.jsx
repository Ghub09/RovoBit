import { useState, useEffect } from 'react';
import { Modal, Button } from 'flowbite-react';
import { allPerpetualHistory, allSportHistory, alltradingHistory } from '../../pages/admin/DeleteUser';
// import { useSelector } from 'react-redux';

const HistoryModel = ({
  openDialog,
  handleDialog,
  labels,
  handleAction,
  action,
  cancel,
  user, // Assuming userId is passed as a prop
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [show,setShow]= useState({DW:true,TP:false,TR:false, TS:false});
  const [tradingHistory, setTradingHistory] = useState([]);
  const [sportHistory, setSportHistory] = useState([]);
  const [perpetualHistory, setPerpetualHistory] = useState([]);
  // eslint-disable-next-line react/prop-types
  const userId=user?._id;
     const fetchData = async () => {
      try {
        const tradingRes = await alltradingHistory(userId);
        const sportRes = await allSportHistory(userId);
        const perpetualRes = await allPerpetualHistory(userId);
        setTradingHistory(tradingRes);
        setSportHistory(sportRes);
        setPerpetualHistory(perpetualRes);
        console.log("Trading:", tradingHistory);
        console.log("Sport:", sportHistory);
        console.log("Perpetual:", perpetualHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

   console.log("tradingHistory, sportHistory, perpetualHistory",tradingHistory.trades
, sportHistory.trades
, perpetualHistory.trades);

  useEffect(() => {
    if (!openDialog)
         { setShow({DW:true,TP:false,TR:false, TS:false})
          setSelectedIds([]);}
    else
    fetchData()
   }, [openDialog]);

  const handleCheckboxChange = (id) => {
  setSelectedIds((prevSelected) => {
    let updatedSelected;
    if (prevSelected.includes(id)) {
      updatedSelected = prevSelected.filter((item) => item !== id);
    } else {
      updatedSelected = [...prevSelected, id];
    }

    console.log("Updated Selected IDs:", updatedSelected); // Real-time log
    return updatedSelected;
  });
};
const handleShow =(type) => {
      fetchData();

  console.log(type)
  if(type === "DW"){
    setShow({DW:true,TP:false,TR:false, TS:false})
    setSportHistory([])
    setTradingHistory([])
    setPerpetualHistory([])
  }else if(type === "TR"){
    setShow({DW:false,TP:false,TR:true, TS:false})
    setSportHistory([])
    setPerpetualHistory([])
    labels=null

  }else if(type === "TS"){
    setShow({DW:false,TP:false,TR:false, TS:true})
    setTradingHistory([])
    setPerpetualHistory([])
    labels=null


  }else{
    setShow({DW:false,TP:true,TR:false, TS:false})
    setSportHistory([])
    setTradingHistory([])
    labels=null

  }
}

  const handleDelete = () => {
    console.log("Selected IDs to delete:", selectedIds);
    // Now you can pass this array to your DB deletion function
    handleAction(selectedIds);
  };

  return (
  

    <Modal
      show={openDialog}
      onClose={handleDialog}
      popup
      className="backdrop-blur-[2px] bg-black/50 text-white rounded-lg"
    >
      <div className="rounded-lg bg-[#1A1A1A] p-5 text-white shadow-lg">
        <div className='flex justify-between items-center mb-4'>
         <button className={`${show.DW ? 'bg-green-600' : ''} bg-green-300 p-2 rounded`} onClick={() => handleShow("DW")}>Deposit/Withdraw</button>
         <button className={`${show.TS ? 'bg-yellow-600' : ''} bg-yellow-300 p-2 rounded`} onClick={() => handleShow("TS")}>Sport</button>
         <button className={`${show.TP ? 'bg-purple-600' : ''} bg-purple-300 p-2 rounded`} onClick={() => handleShow("TP")}>Perpetual</button>
         <button className={`${show.TR ? 'bg-pink-600' : ''} bg-pink-300 p-2 rounded`} onClick={() => handleShow("TR")}>Trading</button>

        </div>
        <div className="mb-4 text-center overflow-x-auto">
          {
            show.DW && (

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
                <tr key={label._id} className="hover:bg-gray-700 border-b transition-colors duration-300">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(label._id)}
                      onChange={() => handleCheckboxChange(label._id)}
                    />
                  </td>
                  <td className="p-2 text-center">{label.amount}</td>
                  <td className="p-2 text-center capitalize">{label.type}</td>
                  <td className="p-2 text-center">{label.walletAddress}</td>
                  <td className="p-2 text-center">{label.currency}</td>
                  <td className="p-2 text-center">
                    {label.adminNote === 'Request rejected by admin' ? (
                      <span className="text-red-500">Rejected</span>
                    ) : (
                      <span>Approved</span>
                    )}
                  </td>
                  <td className="p-2 text-center w-[100px]">
                    {new Date(label.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            )
          }
           {/* SPOT TABLE */}
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
        <tr key={item._id} className="hover:bg-gray-700 border-b">
          <td className="p-2 text-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={() => handleCheckboxChange(item._id)}
            />
          </td>
          <td className="p-2 text-center">{item.asset}</td>
          <td className="p-2 text-center">{item.type}</td>
          <td className="p-2 text-center">{item.price}</td>
          <td className="p-2 text-center">{item.quantity}</td>
          <td className="p-2 text-center">{item.totalCost}</td>
          <td className="p-2 text-center capitalize">{item.status}</td>
          <td className="p-2 text-center">{new Date(item.executedAt).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

{/* PERPETUAL TABLE */}
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
        <tr key={item._id} className="hover:bg-gray-700 border-b">
          <td className="p-2 text-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={() => handleCheckboxChange(item._id)}
            />
          </td>
          <td className="p-2 text-center">{item.pair}</td>
          <td className="p-2 text-center">{item.type}</td>
          <td className="p-2 text-center">{item.entryPrice}-{item.closePrice}</td>
          <td className="p-2 text-center">{item.leverage}x</td>
          <td className="p-2 text-center">{item.liquidationPrice}</td>
          <td className="p-2 text-center">{item.profitLoss}</td>
          <td className="p-2 text-center">{item.quantity}</td>
          <td className="p-2 text-center">{item.marginUsed}</td>
          <td className="p-2 text-center capitalize">{item.status}</td>
          <td className="p-2 text-center">{new Date(item.createdAt).toLocaleString()}</td>
          <td className="p-2 text-center">{new Date(item.closedAt).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

{/* TRADING TABLE */}
{show.TR && (
  <table className="w-full text-left border-collapse border">
    <thead>
      <tr className="border">
        <th className="p-2 text-center">Select</th>
        <th className="p-2 text-center">Pair</th>
        {/* <th className="p-2 text-center">Type</th> */}
        {/* <th className="p-2 text-center">Trade Type</th> */}
        {/* <th className="p-2 text-center">Entry Price</th> */}
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
        <tr key={item._id || item.tradeId} className="hover:bg-gray-700 border-b">
          <td className="p-2 text-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(item._id || item.tradeId)}
              onChange={() => handleCheckboxChange(item._id || item.tradeId)}
            />
          </td>
          <td className="p-2 text-center">{item.asset}</td>
          {/* <td className="p-2 text-center">{item.type}</td> */}
          {/* <td className="p-2 text-center">{item.tradeType}</td> */}
          {/* <td className="p-2 text-center">{item.price}</td> */}
          <td className="p-2 text-center">{item.quantity}</td>
          <td className="p-2 text-center">{item.leverage}x</td>
          <td className="p-2 text-center">{item.liquidationPrice}</td>
          <td className="p-2 text-center">{item.pnl}</td>
          <td className="p-2 text-center capitalize">{item.status}</td>
          <td className="p-2 text-center">{new Date(item.timestamp).toLocaleString()}</td>
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
          <Button color="success" onClick={handleDelete} disabled={selectedIds.length === 0}>
            {action}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryModel;
