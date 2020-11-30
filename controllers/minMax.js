const MinMax = require("../models/MinMax");
const asyncHandler = require("../middleware/async");

///@desc    Get All MinMax
//@route    GET /api/minmax
//@access   private

exports.getMinMax = asyncHandler(async (req, res, next) => {
  const minMax = await MinMax.find();
  res
    .status(200)
    .json({ minValue: minMax[0].minValue, maxValue: minMax[0].maxValue });
});
