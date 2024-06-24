const express = require("express");
const router = express.Router();
const taskController = require("../Controllers/task");
const verifyToken = require("../Middlewares/verifyToken");

router.post("/addTask", verifyToken, taskController.addTask);

router.patch("/editTask/:taskId", verifyToken, taskController.editTask);

router.delete("/deleteTask/:taskId", verifyToken, taskController.deleteTask);

router.get("/shareTask/:taskId", verifyToken, taskController.shareTask);

router.patch(
  "/updateTaskSection/:taskId",
  verifyToken,
  taskController.updateTaskSection
);

router.get("/taskAnalytics", verifyToken, taskController.getTaskAnalytics);

router.get("/taskById/:taskId", verifyToken, taskController.getTaskById);

module.exports = router;
