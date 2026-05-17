const express = require('express');
const { fetchUsers, updateUser, resetGoals } = require('../controllers/userController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const router = express.Router();

router.use(auth);
router.get('/', requireRole('admin', 'manager'), fetchUsers);
router.put('/:id', requireRole('admin', 'manager'), updateUser);
router.post('/reset-goals', requireRole('admin'), resetGoals);

module.exports = router;
