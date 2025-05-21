import React from "react";

const WithdrawalHistory = ({ transactions }) => {
  if (transactions?.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions?.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#1a1a1a] p-4 rounded-2xl shadow-md hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {transaction.type}
              </p>
              <p className="text-xs text-gray-400">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString()
                  : "Invalid date"}
              </p>
            </div>
            <p className={"text-sm font-semibold text-red-400"}>
              {transaction.amount} {transaction.currency}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {transaction.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default WithdrawalHistory;
