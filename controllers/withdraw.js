const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Withdraw = require("../models/Withdraw");
const User = require("../models/User");
//@desc    Register a User
//@route   Post /api/withdrow
//@access  Private
exports.withdrawAmount = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const {
    mobile,
    amount,
    withdrawType,
    accountNo,
    ifsc,
    name,
    accType,
  } = req.body;
  await User.findByIdAndUpdate(user, {
    $inc: { amount: -amount },
  });
  const withdraw = await Withdraw.create({
    user,
    mobile,
    amount,
    withdrawType,
    accountNo,
    ifsc,
    name,
    accType,
  });
  res.status(200).json({ success: true, data: withdraw });
});

//@desc    Withdraw History
//@route   get /api/withdraw
//@access  Private
exports.withdrawAmountHistory = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const withdraw = await Withdraw.find({ user }).sort({ created_at: -1 });
  res.status(200).json({ success: true, data: withdraw });
});
