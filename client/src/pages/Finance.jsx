import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import PortfolioSummary from "../components/finance/PortfolioSummary";
import AssetsList from "../components/finance/AssetsList";
import TransactionHistory from "../components/finance/TransactionHistory";
import AnimatedHeading from "../components/animation/AnimateHeading";

function Finance() {
  const { portfolio, transactions } = useSelector((state) => state.finance);

  return (
    <div className="max-w-7xl mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AnimatedHeading>
          <h1 className="text-4xl font-bold mb-6">Finance Overview</h1>
        </AnimatedHeading>
        <PortfolioSummary portfolio={portfolio} />
        <AssetsList holdings={portfolio.holdings} />
        <TransactionHistory transactions={transactions} />
      </motion.div>
    </div>
  );
}

export default Finance;
