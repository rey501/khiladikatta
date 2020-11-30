const express = require("express");
const { getMinMax } = require("../controllers/minMax");
const router = express.Router();

router.get("/", getMinMax);
module.exports = router;
