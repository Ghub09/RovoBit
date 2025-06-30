import mongoose from "mongoose";

export const dbConnection = () => {
  return mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    dbName: "BitEx-Crypto-Trading",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
