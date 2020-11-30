const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    amount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);
