const express = require("express");
const {
  signUp,
  login,
  logOut,
  changePassword,
} = require("../controllers/authController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", identifier, logOut);
router.patch("/change-password", identifier, changePassword);
module.exports = router;
