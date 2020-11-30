const mongoose = require("mongoose");

const TransSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    roomId: String,
    gameAmount: Number,
    winAmount: {
      type: Number,
      default: 0,
    },
    mobile: {
      type: String,
    },
    status: {
      type: String,
      default: "Loss",
    },

    gameId: {
      type: mongoose.Schema.ObjectId,
      ref: "Game",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trans", TransSchema);
