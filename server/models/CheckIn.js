const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], default: 'Q1' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  comment: { type: String, trim: true },
  status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CheckIn', checkInSchema);
