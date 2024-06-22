const express = require("express");
const router = express.Router();
const taskController = require("../Controllers/task");
const verifyToken = require("../Middlewares/verifyToken");

router.post("/addTask", verifyToken, taskController.addTask);

module.exports = router;
