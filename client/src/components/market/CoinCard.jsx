import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function CoinCard({ coin }) {
  const priceChangeColor = coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <div className="flex items-center gap-4 mb-4">
        <img src={coin.image} alt={coin.name} className="w-10 h-10" />
        <div>
          <h3 className="font-bold">{coin.name}</h3>
          <span className="text-light/60 uppercase">{coin.symbol}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-light/60">Price</span>
          <span className="font-medium">${coin.current_price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-light/60">24h Change</span>
          <span className={`font-medium ${priceChangeColor}`}>
            {coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-light/60">Volume</span>
          <span className="font-medium">${coin.total_volume.toLocaleString()}</span>
        </div>
      </div>

      <Link
        to={`/trade/${coin.symbol.toLowerCase()}`}
        className="btn btn-primary w-full text-center mt-6 block"
      >
        Trade Now
      </Link>
    </motion.div>
  );
}

export default CoinCard;