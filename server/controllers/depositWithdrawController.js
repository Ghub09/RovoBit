import { request } from "express";
import DepositWithdrawRequest from "../models/RequestMessage.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

// Create a new deposit or withdrawal request
export const createDepositWithdrawRequest = async (req, res) => {
  try {
    const { type, amount, currency, network, walletAddress } = req.body;

    // Validate transaction type
    if (!["deposit", "withdraw"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Validate currency (example: "USDT", "BTC", etc.)
    const validCurrencies = ["USDT", "BTC", "ETH"]; // Add more currencies as needed
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({ message: "Invalid currency" });
    }

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Handle withdrawals
    if (type === "withdraw") {
      if (currency === "USDT") {
        // Check if the user has enough USDT in the exchange wallet
        if (wallet.exchangeWallet < amount) {
          return res.status(400).json({ message: "Insufficient USDT balance" });
        }
        // Deduct from the exchange wallet
        wallet.exchangeWallet -= amount;
      } else {
        // Check if the user has enough of the specified cryptocurrency
        const holding = wallet.exchangeHoldings.find((h) => h.asset === currency);
        if (!holding || holding.quantity < amount) {
          return res
            .status(400)
            .json({ message: `Insufficient ${currency} balance` });
        }
        // Deduct from the holdings
        holding.quantity -= amount;
      }

      // Freeze the withdrawn amount
      const frozenAssetIndex = wallet.frozenAssets.findIndex(
        (asset) => asset.asset === currency
      );
      if (frozenAssetIndex !== -1) {
        // If the asset already exists in frozenAssets, update the quantity
        wallet.frozenAssets[frozenAssetIndex].quantity += Number(amount);
      } else {
        // If the asset does not exist in frozenAssets, add it
        wallet.frozenAssets.push({ asset: currency, quantity: amount });
      }
    }

    // Save the updated wallet
    await wallet.save();

    // Create the deposit/withdrawal request
    const request = await DepositWithdrawRequest.create({
      userId: req.user._id,
      type,
      amount,
      currency,
      network,
      walletAddress,
      status: "pending",
    });

    res.status(201).json({ message: `${type} request submitted`, request });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

// Fetch user's deposit/withdrawal requests
export const getUserRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Fetch all deposit/withdrawal requests for admin
export const getAllRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({ status: "pending" })
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

export const addTokens = async (req, res) => {
  try {
    const { currency, amount, userId } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const numericAmount = Number(amount);

    console.log("the currecy is " + currency);

    if (currency === "USDT") {
      wallet.exchangeWallet += numericAmount;
    } else {
      const holding = wallet.exchangeHoldings.find(
        (holding) => holding.asset === currency
      );
      if (!holding) {
        wallet.exchangeHoldings.push({
          asset: currency,
          quantity: numericAmount,
        });
      } else {
        holding.quantity += numericAmount;
      }
    }

    wallet.depositHistory.push({ currency, amount, createdAt: new Date() });

    await wallet.save();

    res.status(200).json({ message: `Tokens added successfully`, wallet });
  } catch (error) {
    // console.log(error.message);

    res.status(500).json({ message: "Error adding tokens", error });
  }
};

export const approveWithDrawRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await DepositWithdrawRequest.findById(requestId);
    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    const user = await User.findOne({ _id: request.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const wallet = await Wallet.findOne({ userId: request.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const index = wallet.frozenAssets.findIndex(
      (asset) => asset.asset === request.currency
    );

    if (index === -1) {
      
      return res.status(404).json({ message: "Insufficient balance" });
    }
    wallet.frozenAssets[index].quantity -= request.amount;

    wallet.withdrawalHistory.push({
      amount: request.amount,
      currency: request.currency,
      createdAt: new Date(),
    });

    request.status = "approved";
    await request.save();
    await wallet.save();

    res
      .status(200)
      .json({ message: `${request.type} request approved`, request });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error approving withdraw request", error });
  }
};

export const changeWithdrawRequeststatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await DepositWithdrawRequest.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "approved";
    await request.save();
    res
      .status(200)
      .json({ message: "Request status changed to approved", request });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Reject deposit/withdrawal request
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNote } = req.body;

    const request = await DepositWithdrawRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const wallet = await Wallet.findOne({ userId: request.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    request.status = "rejected";
    request.adminNote = adminNote || "Request rejected by admin";

    const index = wallet.frozenAssets.findIndex(
      (asset) => asset.asset === request.currency
    );

    if (index === -1) {
      return res.status(404).json({ message: "Insufficient balance" });
    }

    // Restore frozen assets since the request was rejected
    wallet.frozenAssets[index].quantity -= request.amount;

    if (request.currency === "USDT") {
      wallet.exchangeWallet += request.amount;
    } else {
      const holdingIndex = wallet.exchangeHoldings.findIndex(
        (holding) => holding.asset === request.currency
      );
      if (holdingIndex === -1) {
        wallet.exchangeHoldings.push({ asset: request.currency, quantity: request.amount });
      } else {
        wallet.exchangeHoldings[holdingIndex].quantity += request.amount;
      }
    }

    await request.save();
    await wallet.save(); // Ensure wallet changes are saved

    res.status(200).json({ message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "All users", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
