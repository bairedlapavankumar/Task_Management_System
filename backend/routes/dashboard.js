const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard
// @desc    Get dashboard metrics
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // If member, only show stats for their assigned tasks
    if (req.user.role === 'Member') {
      query.assignedTo = req.user._id;
    } else {
      // If Admin, show stats for tasks in projects they admin
      const projects = await Project.find({ admin: req.user._id });
      const projectIds = projects.map(p => p._id);
      query.project = { $in: projectIds };
    }

    const totalTasks = await Task.countDocuments(query);
    const todoTasks = await Task.countDocuments({ ...query, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...query, status: 'In Progress' });
    const doneTasks = await Task.countDocuments({ ...query, status: 'Done' });

    // Overdue tasks: dueDate is less than current date and status is not 'Done'
    const currentDate = new Date();
    const overdueTasks = await Task.countDocuments({
      ...query,
      dueDate: { $lt: currentDate },
      status: { $ne: 'Done' }
    });

    // Tasks per user (Only really makes sense for Admin, but we can return it)
    let tasksPerUser = [];
    if (req.user.role === 'Admin') {
        tasksPerUser = await Task.aggregate([
            { $match: query },
            { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $project: { name: { $ifNull: ['$user.name', 'Unassigned'] }, count: 1, _id: 0 } }
        ]);
    }

    res.json({
      totalTasks,
      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      },
      overdueTasks,
      tasksPerUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
