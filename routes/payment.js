const express = require("express");
const { protect } = require("../middleware/auth");
const {
  addPayment,
  successPayment,
  paymentView,
} = require("../controllers/payment");
const router = express.Router();
router.get("/", addPayment);
router.post("/success", successPayment);
router.get("/view", protect, paymentView);

module.exports = router;
