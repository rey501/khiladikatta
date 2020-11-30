const mongoose = require("mongoose");

const MinMaxSchema = new mongoose.Schema(
  {
    minValue: {
      type: Number,
      default: 1,
    },
    maxValue: {
      type: Number,
      default: 2000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MinMax", MinMaxSchema);
