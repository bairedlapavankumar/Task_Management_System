const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/projects
// @desc    Create a project (Admin)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, description, uniqueId } = req.body;

  try {
    const project = new Project({
      name,
      description,
      uniqueId: uniqueId || require('crypto').randomBytes(4).toString('hex'),
      admin: req.user._id,
      members: [req.user._id], // Admin is implicitly a member
    });

    const createdProject = await project.save();

    res.status(201).json(createdProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/projects
// @desc    Get all projects user is a part of
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      // Admin sees projects they created
      projects = await Project.find({ admin: req.user._id }).populate('admin', 'name email').populate('members', 'name email');
    } else {
      // Member sees projects they are a member of
      projects = await Project.find({ members: req.user._id }).populate('admin', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is part of project
    if (project.admin.toString() !== req.user._id.toString() && !project.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/projects/:projectId/members
// @desc    Add a member to a project
// @access  Private/Admin
router.post('/:projectId/members', protect, admin, async (req, res) => {
  const { email } = req.body;

  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized as admin of this project' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found with this email' });

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/projects/:projectId/members/:memberId
// @desc    Remove a member from a project
// @access  Private/Admin
router.delete('/:projectId/members/:memberId', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized as admin of this project' });
    }

    const memberId = req.params.memberId;
    if (project.admin.toString() === memberId) {
      return res.status(400).json({ message: 'Cannot remove the project admin' });
    }

    project.members = project.members.filter(m => m.toString() !== memberId);
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    // Optionally delete all tasks associated with this project here
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
