const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thrustArea: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  uomType: { type: String, default: 'Completion' },
  target: { type: String, required: true },
  weightage: { type: Number, required: true, min: 10, max: 100 },
  status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], default: 'Q1' },
  approved: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  approvalFeedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

goalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
