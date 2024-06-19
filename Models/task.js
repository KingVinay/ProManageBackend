const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
  checked: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
    },
    assignPerson: {
      type: String,
      unique: true,
    },
    taskSection: {
      type: String,
      enum: ["todo", "in progress", "backlog", "completed"],
      default: "todo",
    },
    dueDate: {
      type: Date,
    },
    checklist: [checklistItemSchema],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Task", taskSchema);
