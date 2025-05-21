import { createSlice } from '@reduxjs/toolkit';

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    portfolio: {
      totalBalance: 25000.00,
      dailyProfitLoss: 1250.50,
      dailyProfitLossPercentage: 5.25,
      holdings: [
        {
          id: 1,
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 0.5,
          value: 15000.00,
          profitLoss: 750.25,
          profitLossPercentage: 5.27,
        },
        {
          id: 2,
          symbol: 'ETH',
          name: 'Ethereum',
          amount: 4.2,
          value: 8000.00,
          profitLoss: 400.25,
          profitLossPercentage: 5.27,
        },
      ],
    },
    transactions: [
      {
        id: 1,
        type: 'deposit',
        amount: 10000.00,
        currency: 'USDT',
        status: 'completed',
        timestamp: '2024-03-15T10:30:00Z',
        hash: '0x1234...5678',
      },
      {
        id: 2,
        type: 'withdrawal',
        amount: 5000.00,
        currency: 'USDT',
        status: 'pending',
        timestamp: '2024-03-14T15:45:00Z',
        hash: '0x8765...4321',
      },
    ],
  },
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    updatePortfolio: (state, action) => {
      state.portfolio = { ...state.portfolio, ...action.payload };
    },
  },
});

export const { addTransaction, updatePortfolio } = financeSlice.actions;
export default financeSlice.reducer;