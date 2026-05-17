const User = require('../models/User');
const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');

exports.fetchUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can change roles' });
    }

    Object.assign(user, req.body);
    if (req.body.password) user.password = req.body.password;
    await user.save();
    await AuditLog.create({ user: req.user._id, action: 'User updated', resource: 'User', details: user.email });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, team: user.team, department: user.department });
  } catch (error) {
    next(error);
  }
};

exports.resetGoals = async (req, res, next) => {
  try {
    await Goal.updateMany({}, { approved: false, locked: false, progress: 0, status: 'Not Started' });
    await AuditLog.create({ user: req.user._id, action: 'Reset goals', resource: 'Goal' });
    res.json({ message: 'All goals reset for the quarter' });
  } catch (error) {
    next(error);
  }
};
