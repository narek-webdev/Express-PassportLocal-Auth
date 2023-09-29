const express = require("express");
const router = express.Router();
const { isAuth } = require("../../middleware/auth.middleware");

router.get("/", isAuth, (_, res) => {
  res.send("protected route");
});

module.exports = router;
