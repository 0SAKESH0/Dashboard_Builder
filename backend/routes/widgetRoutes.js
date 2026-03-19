// routes/widgetRoutes.js
// Express routes for Widget data APIs

const express = require('express');
const router = express.Router();
const {
  getKPIData,
  getChartData,
  getPieData,
  getTableData,
  getWidgetData,
} = require('../controllers/widgetController');

// GET general widget data
router.get('/', getWidgetData);

// GET KPI widget data with aggregation
router.get('/kpi', getKPIData);

// GET chart data (bar, line, area, scatter)
router.get('/chart', getChartData);

// GET pie chart data
router.get('/pie', getPieData);

// GET table widget data
router.get('/table', getTableData);

module.exports = router;
