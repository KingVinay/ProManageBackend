const Task = require("../Models/task");

const addTask = async (req, res, next) => {
  try {
    const { title, priority, assignPerson, dueDate, checklists } = req.body;

    if (!title || !priority || !checklists || checklists.length === 0) {
      return res.status(400).json({ errorMessage: "All fields are required" });
    }

    for (const checklist of checklists) {
      if (!checklist.description) {
        return res
          .status(400)
          .json({ errorMessage: "Description is required" });
      }
    }

    const createdBy = req.userId;

    const task = new Task({
      title,
      priority,
      assignPerson,
      dueDate,
      checklists,
      createdBy,
      shareableLink: "",
    });

    const savedTask = await task.save();

    // Generate shareable link
    const shareableLink = `${process.env.FRONTEND_HOST}/tasks/${savedTask._id}`;
    savedTask.shareableLink = shareableLink;
    await savedTask.save();

    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    next(error);
  }
};

const editTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, priority, assignPerson, dueDate, checklists } = req.body;

    if (!taskId) {
      return res.status(400).json({ errorMessage: "Task ID is required!" });
    }

    if (!title || !priority || !checklists || checklists.length === 0) {
      return res.status(400).json({ errorMessage: "All fields are required" });
    }

    for (const checklist of checklists) {
      if (!checklist.description) {
        return res
          .status(400)
          .json({ errorMessage: "Description is required" });
      }
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ errorMessage: "Task not found" });
    }

    task.title = title;
    task.priority = priority;
    task.assignPerson = assignPerson || task.assignPerson;
    task.dueDate = dueDate || task.dueDate;
    task.checklists = checklists;

    const updatedTask = await task.save();

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ errorMessage: "Task ID is required!" });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ errorMessage: "Task not found!" });
    }

    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

const shareTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, createdBy: req.userId });
    if (!task) {
      return res.status(404).json({ errorMessage: "Task not found!" });
    }

    res.json({ shareableLink: task.shareableLink });
  } catch (error) {
    next(error);
  }
};

module.exports = { addTask, editTask, deleteTask, shareTask };
