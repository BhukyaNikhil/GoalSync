const Goal = require('../models/Goal');
const User = require('../models/User');

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalGoals = await Goal.countDocuments();
    const completedGoals = await Goal.countDocuments({ status: 'Completed' });
    const approvedGoals = await Goal.countDocuments({ approved: true });
    const teamBreakdown = await User.aggregate([
      { $group: { _id: '$team', count: { $sum: 1 } } },
    ]);
    const timeline = await Goal.aggregate([
      { $group: { _id: '$quarter', averageProgress: { $avg: '$progress' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const completionRate = totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const approvalRate = totalGoals ? Math.round((approvedGoals / totalGoals) * 100) : 0;

    res.json({ totalGoals, completedGoals, approvedGoals, completionRate, approvalRate, teamBreakdown, timeline });
  } catch (error) {
    next(error);
  }
};
