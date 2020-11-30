const express = require("express");
const { protect } = require("../middleware/auth");
const {
  withdrawAmount,
  withdrawAmountHistory,
} = require("../controllers/withdraw");
const router = express.Router();

router.post("/", protect, withdrawAmount);
router.get("/", protect, withdrawAmountHistory);

module.exports = router;
