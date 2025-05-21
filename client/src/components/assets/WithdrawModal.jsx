import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { depositFunds, setDepositModalOpen } from '../../store/slices/assetsSlice';

Modal.setAppElement('#root');

function DepositModal() {
  const dispatch = useDispatch();
  const { isDepositModalOpen, status } = useSelector((state) => state.assets);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [currency, setCurrency] = useState('USDT');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const result = await dispatch(depositFunds({
        amount: parseFloat(amount),
        currency,
        method
      })).unwrap();

      toast.success('Deposit initiated successfully');
      dispatch(setDepositModalOpen(false));
      setAmount('');
      setMethod('bank');
    } catch (error) {
      toast.error(error?.message || 'Failed to process deposit');
    }
  };

  return (
    <Modal
      isOpen={isDepositModalOpen}
      onRequestClose={() => dispatch(setDepositModalOpen(false))}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="w-full max-w-lg p-6 bg-dark rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Deposit Funds</h2>
          <button
            onClick={() => dispatch(setDepositModalOpen(false))}
            className="text-light/60 hover:text-light"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input w-full"
            >
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deposit Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input w-full"
            >
              <option value="bank">Bank Transfer</option>
              <option value="card">Credit/Debit Card</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn btn-primary"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Deposit'
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default DepositModal;