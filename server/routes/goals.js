const express = require('express');
const { fetchGoals, createGoal, updateGoal, deleteGoal, approveGoal } = require('../controllers/goalController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const router = express.Router();

router.use(auth);
router.get('/', fetchGoals);
router.post('/', requireRole('employee', 'manager', 'admin'), createGoal);
router.put('/:id', requireRole('employee', 'manager', 'admin'), updateGoal);
router.delete('/:id', requireRole('employee', 'manager', 'admin'), deleteGoal);
router.post('/:id/approve', requireRole('manager', 'admin'), approveGoal);

module.exports = router;
