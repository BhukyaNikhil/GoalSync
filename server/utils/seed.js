const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Goal = require('../models/Goal');
const CheckIn = require('../models/CheckIn');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Goal.deleteMany(), CheckIn.deleteMany(), Notification.deleteMany(), AuditLog.deleteMany()]);

  const admin = await User.create({ name: 'Ava Stark', email: 'admin@goalsync.com', password: 'SecurePass123', role: 'admin', team: 'Leadership', department: 'Executive' });
  const manager = await User.create({ name: 'Maya Chen', email: 'manager@goalsync.com', password: 'SecurePass123', role: 'manager', team: 'Performance', department: 'Operations' });
  const employee = await User.create({ name: 'Liam Brooks', email: 'employee@goalsync.com', password: 'SecurePass123', role: 'employee', team: 'Growth', department: 'Strategy' });

  const firstGoal = await Goal.create({ user: employee._id, manager: manager._id, thrustArea: 'Customer Growth', title: 'Launch enterprise campaign', description: 'Drive high-value pipeline with targeted go-to-market initiatives.', uomType: 'Revenue', target: '$1.2M', weightage: 35, quarter: 'Q2', status: 'On Track', progress: 48 });
  await Goal.create({ user: employee._id, manager: manager._id, thrustArea: 'Product Velocity', title: 'Reduce delivery cycle', description: 'Streamline workflows across the product launch stack.', uomType: 'Efficiency', target: '20% faster', weightage: 25, quarter: 'Q2', status: 'Not Started', progress: 12 });
  await Goal.create({ user: employee._id, manager: manager._id, thrustArea: 'Retention', title: 'Elevate retention metrics', description: 'Improve customer retention through targeted coaching and review cadence.', uomType: 'Retention', target: '90% renewal', weightage: 40, quarter: 'Q2', status: 'On Track', progress: 62 });

  await CheckIn.create({ goal: firstGoal._id, user: employee._id, quarter: 'Q2', progress: 48, status: 'On Track', comment: 'Alignment sessions completed with cross-functional teams.' });
  await Notification.create({ user: manager._id, message: 'New goal ready for approval from Liam Brooks', type: 'info' });
  await AuditLog.create({ user: admin._id, action: 'Seed database', resource: 'System', details: 'Initial enterprise demo data loaded' });

  console.log('Seed complete. Users: admin@goalsync.com, manager@goalsync.com, employee@goalsync.com');
  process.exit();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
