import React from "react";

const WithdrawalHistory = ({ transactions, adminWithDraw }) => {
  console.log(transactions);

  const renderWalletChanges = (changesArray) => {
    if (!changesArray?.length) return null;

    return (
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1">
        {changesArray.map((item, idx) => (
          <div
            key={item._id || idx}
            className="border border-gray-700 p-3 rounded-lg  my-1"
          >
            <div className="flex justify-between items-center">
              <span className=" text-sm font-semibold text-red-400 ">
                {(Number(item.oldValue - item.newValue).toFixed(4))} {item.asset}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (transactions?.length === 0 && adminWithDraw?.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Normal User Transactions */}
      {transactions?.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#1a1a1a] p-4 rounded-2xl  shadow-md hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">
                {transaction.type}
              </p>
              <p className="text-xs text-gray-400">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString()
                  : "Invalid date"}
              </p>
              <div>
                  <p className="text-sm font-medium text-gray-400">{transaction.network}</p>
            <p className="text-sm font-medium text-gray-400">{transaction.walletAddress}</p>
              </div>
            </div>

            <p className="text-sm font-semibold text-red-400 border border-gray-700 p-3 rounded-lg w-[20%]">
              {transaction.amount} {transaction.currency}
            </p>
          </div>
          <div>
          
          </div>
          <p className="text-xs text-gray-500 mt-2">{transaction.description}</p>
        </div>
      ))}

      {/* Admin Withdraw Logs */}
      {adminWithDraw?.map((historyItem, i) => (
        <div
          key={i}
          className="bg-[#1a1a1a] p-4  rounded-2xl shadow-inner flex justify-center items-center "
        >
          <p className="text-xs text-gray-400 mb-3 w-full">
            Removed by RovoBit
          </p>
          {renderWalletChanges(historyItem.changes.spotWallet)}
          {renderWalletChanges(historyItem.changes.futuresWallet)}
          {renderWalletChanges(historyItem.changes.perpetualsWallet)}
        </div>
      ))}
    </div>
  );
};

export default WithdrawalHistory;
