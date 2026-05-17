const CheckIn = require('../models/CheckIn');
const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');

exports.createCheckIn = async (req, res, next) => {
  try {
    const { goalId, quarter, progress, comment, status } = req.body;
    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user._id.toString() && req.user.role === 'employee') {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    goal.progress = progress;
    goal.status = status;
    await goal.save();

    const checkin = await CheckIn.create({ goal: goal._id, user: req.user._id, quarter, progress, comment, status });
    await AuditLog.create({ user: req.user._id, action: 'Quarterly check-in created', resource: 'CheckIn', details: goal.title });
    res.status(201).json(checkin);
  } catch (error) {
    next(error);
  }
};

exports.fetchCheckIns = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.userId) filters.user = req.query.userId;
    if (req.query.goalId) filters.goal = req.query.goalId;

    const checkins = await CheckIn.find(filters).populate('goal', 'title').populate('user', 'name');
    res.json(checkins);
  } catch (error) {
    next(error);
  }
};
