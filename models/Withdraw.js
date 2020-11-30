const mongoose = require("mongoose");

const WithdrawSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    mobile: String,
    amount: Number,
    withdrawType: String,
    accountNo: String,
    ifsc: String,
    name: String,
    accType: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdraw", WithdrawSchema);
