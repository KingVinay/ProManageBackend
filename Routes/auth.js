const express = require("express");
const router = express.Router();
const authController = require("../Controllers/user");
const verifyToken = require("../Middlewares/verifyToken");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/addEmail", verifyToken, authController.addEmail);

module.exports = router;
