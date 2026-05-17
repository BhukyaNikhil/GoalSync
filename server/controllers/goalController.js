const Goal = require('../models/Goal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

exports.fetchGoals = async (req, res, next) => {
  try {
    const filters = {};
    if (req.user.role === 'employee') filters.user = req.user._id;
    if (req.user.role === 'manager') filters.manager = req.user._id;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.quarter) filters.quarter = req.query.quarter;

    const goals = await Goal.find(filters)
      .populate('user', 'name email role team department')
      .populate('manager', 'name email')
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    next(error);
  }
};

exports.createGoal = async (req, res, next) => {
  try {
    console.log('[Goals] Create payload:', req.body, 'user:', req.user?.id);
    const { thrustArea, title, description, uomType, target, weightage, quarter } = req.body;

    if (!thrustArea || !title || !target || weightage === undefined || weightage === null) {
      return res.status(400).json({ message: 'Thrust area, title, target and weightage are required.' });
    }

    const numericWeight = Number(weightage);
    if (Number.isNaN(numericWeight) || numericWeight < 10 || numericWeight > 100) {
      return res.status(400).json({ message: 'Weightage must be a number between 10 and 100.' });
    }

    const activeGoals = await Goal.find({ user: req.user._id });
    if (activeGoals.length >= 8) {
      return res.status(400).json({ message: 'You can only create up to 8 active goals' });
    }

    const totalWeight = activeGoals.reduce((sum, goal) => sum + (Number(goal.weightage) || 0), 0) + numericWeight;
    if (totalWeight > 100) {
      return res.status(400).json({ message: 'Total weightage must not exceed 100%' });
    }

    const manager = await User.findOne({ role: 'manager' });
    const goal = await Goal.create({
      user: req.user._id,
      employeeId: req.user._id,
      manager: manager?._id,
      thrustArea: thrustArea.trim(),
      title: title.trim(),
      description: description?.trim() || '',
      uomType: uomType?.trim() || 'Completion',
      target: target.trim(),
      weightage: numericWeight,
      quarter: quarter || 'Q2',
    });

    console.log('[Goals] Saved goal:', goal._id);

    await Notification.create({ user: manager?._id || req.user._id, message: `${req.user.name} submitted a goal for approval`, type: 'info' });
    await AuditLog.create({ user: req.user._id, action: 'Goal created', resource: 'Goal', details: title });

    res.status(201).json(goal);
  } catch (error) {
    console.error('[Goals] Create error:', error.message, error.stack);
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.locked && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Locked goals cannot be modified' });
    }
    if (req.user.role === 'employee' && goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own goals' });
    }

    Object.assign(goal, req.body);
    await goal.save();
    await AuditLog.create({ user: req.user._id, action: 'Goal updated', resource: 'Goal', details: goal.title });
    res.json(goal);
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (req.user.role === 'employee' && goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own goals' });
    }
    await goal.remove();
    await AuditLog.create({ user: req.user._id, action: 'Goal deleted', resource: 'Goal', details: goal.title });
    res.json({ message: 'Goal removed' });
  } catch (error) {
    next(error);
  }
};

exports.approveGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id).populate('user');
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.approved && req.body.action !== 'unlock') {
      return res.status(400).json({ message: 'Goal is already approved' });
    }

    if (req.body.action === 'approve') {
      goal.approved = true;
      goal.locked = true;
      goal.approvalFeedback = req.body.feedback || 'Approved by manager';
      await Notification.create({ user: goal.user._id, message: `Your goal '${goal.title}' was approved`, type: 'success' });
    } else if (req.body.action === 'reject') {
      goal.approved = false;
      goal.locked = false;
      goal.approvalFeedback = req.body.feedback || 'Requires revision';
      await Notification.create({ user: goal.user._id, message: `Your goal '${goal.title}' was rejected`, type: 'warning' });
    } else if (req.body.action === 'unlock' && req.user.role === 'admin') {
      goal.locked = false;
      goal.approved = false;
      await Notification.create({ user: goal.user._id, message: `An admin unlocked your goal for edits`, type: 'info' });
    }

    await goal.save();
    await AuditLog.create({ user: req.user._id, action: `Goal ${req.body.action}`, resource: 'Goal', details: goal.title });
    res.json(goal);
  } catch (error) {
    next(error);
  }
};
