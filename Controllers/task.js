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

    res.status(201).json({ message: "Task added successfully", task });
  } catch (error) {
    next(error);
  }
};

module.exports = { addTask };
