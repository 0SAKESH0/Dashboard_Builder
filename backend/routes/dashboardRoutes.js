// routes/dashboardRoutes.js
// Express routes for Dashboard save/load

const express = require('express');
const router = express.Router();
const { saveDashboard, getDashboard } = require('../controllers/dashboardController');

// GET load dashboard config
router.get('/', getDashboard);

// POST save/update dashboard config
router.post('/', saveDashboard);

module.exports = router;
