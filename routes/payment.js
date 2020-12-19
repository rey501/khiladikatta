const express = require("express");
const { protect } = require("../middleware/auth");
const {
  addPayment,
  successPayment,
  paymentView,
  winAmount,
  addReward,
} = require("../controllers/payment");
const router = express.Router();
router.get("/", addPayment);
router.post("/success", successPayment);
router.get("/view", protect, paymentView);
router.put("/winamount", protect, winAmount);
router.put("/addreward", protect, addReward);
module.exports = router;
