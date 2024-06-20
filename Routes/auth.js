const express = require("express");
const router = express.Router();
const authController = require("../Controllers/user");

router.post("/register", authController.registerUser);

module.exports = router;
