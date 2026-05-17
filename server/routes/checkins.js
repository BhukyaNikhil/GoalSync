const express = require('express');
const { createCheckIn, fetchCheckIns } = require('../controllers/checkinController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.post('/', createCheckIn);
router.get('/', fetchCheckIns);

module.exports = router;
