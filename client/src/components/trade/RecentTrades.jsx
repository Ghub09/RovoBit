import { motion } from "framer-motion";

function RecentTrades({ trades }) {
  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-light/60">
            <th className="pb-4">Pair</th>
            <th className="pb-4">Type</th>
            <th className="pb-4">Side</th>
            <th className="pb-4">Price</th>
            <th className="pb-4">Amount</th>
            <th className="pb-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {trades.length > 0 ? (
            trades
              .filter((trade) => trade?.side)
              .map((trade) => (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-light/10"
                >
                  <td className="py-4">{trade.pair || "N/A"}</td>
                  <td className="py-4 capitalize">{trade.type || "N/A"}</td>
                  <td
                    className={`py-4 ${
                      trade?.side === "buy" ? "text-success" : "text-danger"
                    }`}
                  >
                    {trade?.side ? trade.side.toUpperCase() : "UNKNOWN"}
                  </td>
                  <td className="py-4">
                    ${trade.price ? trade.price.toLocaleString() : "0"}
                  </td>
                  <td className="py-4">{trade.amount || "0"}</td>
                  <td className="py-4">
                    ${trade.total ? trade.total.toLocaleString() : "0"}
                  </td>
                </motion.tr>
              ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No trades available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentTrades;
