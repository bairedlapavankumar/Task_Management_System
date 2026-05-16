const express = require('express');
const router = express.Router({ mergeParams: true }); // To access project ID from parent route if needed, though we might use direct paths
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a task in a project (Admin only)
// @access  Private/Admin
router.post('/projects/:projectId/tasks', protect, admin, async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project admin can create tasks' });
    }

    // Verify assigned user is part of the project
    if (assignedTo && !project.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assigned user is not a member of this project' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      project: projectId,
      assignedTo,
      status: 'To Do',
    });

    const createdTask = await task.save();

    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks for a project
// @access  Private
router.get('/projects/:projectId/tasks', protect, async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is part of project
    if (project.admin.toString() !== req.user._id.toString() && !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task status (Admin or Assigned Member)
// @access  Private
router.put('/tasks/:id', protect, async (req, res) => {
  const { status, title, description, dueDate, priority, assignedTo } = req.body;

  try {
    let task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isProjectAdmin = task.project.admin.toString() === req.user._id.toString();
    const isAssignedUser = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isProjectAdmin && !isAssignedUser) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Members can only update status. Admins can update everything.
    if (isProjectAdmin) {
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      task.priority = priority || task.priority;
      task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    }

    if (status) {
      task.status = status;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private/Admin
router.delete('/tasks/:id', protect, admin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
