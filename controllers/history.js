const History = require("../models/History");
const asyncHandler = require("../middleware/async");

// ///@desc    Get All history
// //@route    GET /api/history
// //@access   private

// exports.getHistory = asyncHandler(async (req, res, next) => {
//   const history = await History.find();
//   res.status(200).json({ success: true, history });
// });

///@desc    Get users history
//@route    GET /api/history/user
//@access   private

exports.getHistoryByUser = asyncHandler(async (req, res, next) => {

  const history = await History.find({ user: req.user.id }).sort({
    created_at: -1,
  });
  res.status(200).json({ success: true, userHistory: history });
});
