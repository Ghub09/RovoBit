import { motion } from "framer-motion";
import AnimatedHeading from "../animation/AnimateHeading";

function TransactionHistory({ transactions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mt-6"
    >
      <AnimatedHeading>
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      </AnimatedHeading>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-secondary ">
              <th className="pb-4">Type</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-light/10">
                <td className="py-4 capitalize">{tx.type}</td>
                <td className="py-4">
                  ${tx.amount.toLocaleString()} {tx.currency}
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tx.status === "completed"
                        ? "bg-success/20 text-success"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-4">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="py-4">
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default TransactionHistory;
