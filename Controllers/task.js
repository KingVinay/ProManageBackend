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

const updateTaskSection = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { taskSection } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ errorMessage: "Task not found" });
    }

    task.taskSection = taskSection;
    const updatedTask = await task.save();

    res.json({ message: "Task section updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getTaskAnalytics = async (req, res, next) => {
  try {
    // Fetch all tasks created by the user
    const tasks = await Task.find({ createdBy: userId });

    // Initialize counters
    const taskSections = {
      todo: 0,
      inProgress: 0,
      backlog: 0,
      completed: 0,
    };

    const priorities = {
      low: 0,
      moderate: 0,
      high: 0,
    };

    const dueDate = 0;

    // Traverse through tasks and count based on properties
    tasks.forEach((task) => {
      // Count task sections
      switch (task.taskSection) {
        case "todo":
          taskSections.todo += 1;
          break;
        case "in progress":
          taskSections.inProgress += 1;
          break;
        case "backlog":
          taskSections.backlog += 1;
          break;
        case "completed":
          taskSections.completed += 1;
          break;
        default:
          break;
      }

      // Count priorities
      switch (task.priority) {
        case "low":
          priorities.low += 1;
          break;
        case "moderate":
          priorities.moderate += 1;
          break;
        case "high":
          priorities.high += 1;
          break;
        default:
          break;
      }

      // Check for due date
      if (task.dueDate) {
        dueDateTasks += 1;
      }
    });

    const analytics = {
      taskSections,
      priorities,
      dueDateTasks,
    };

    res.json({ message: "Task Analysis Completed", analytics });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ errorMessage: "Task Id is required!" });
    }

    const task = await task.findById(taskId);

    if (!task) {
      return res.status(404).json({ errorMessage: "Task not found!" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTask,
  editTask,
  deleteTask,
  shareTask,
  updateTaskSection,
  getTaskAnalytics,
  getTaskById,
};
