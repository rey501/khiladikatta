const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatecoins,
  updatePassword,
  registerFacebook,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.post("/", register);
router.post("/facebook", registerFacebook);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatecoins", protect, updatecoins);
router.put("/updatepassword", protect, updatePassword);
router.put("/updatename", protect, updatename)
module.exports = router;
