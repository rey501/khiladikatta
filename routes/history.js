const express = require("express");
const { protect } = require("../middleware/auth");
const { getHistoryByUser } = require("../controllers/history");
const router = express.Router();
// router.get("/", getHistory);
router.get("/", protect, getHistoryByUser);
module.exports = router;
