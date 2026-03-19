// controllers/dashboardController.js
// Handles dashboard save/load operations

const Dashboard = require('../models/Dashboard');

/**
 * Save or update dashboard configuration
 * POST /api/dashboard
 */
const saveDashboard = async (req, res) => {
  try {
    const { widgets, dateFilter, name } = req.body;

    // Find existing dashboard or create new one (single dashboard per app)
    let dashboard = await Dashboard.findOne();

    if (dashboard) {
      // Update existing
      dashboard.widgets = widgets || [];
      dashboard.dateFilter = dateFilter || 'all';
      dashboard.name = name || dashboard.name;
      await dashboard.save();
    } else {
      // Create new
      dashboard = await Dashboard.create({
        name: name || 'My Dashboard',
        widgets: widgets || [],
        dateFilter: dateFilter || 'all',
      });
    }

    res.json({
      success: true,
      message: 'Dashboard saved successfully',
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save dashboard',
      error: error.message,
    });
  }
};

/**
 * Load dashboard configuration
 * GET /api/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne();

    if (!dashboard) {
      // Return empty dashboard if none exists
      return res.json({
        success: true,
        data: {
          name: 'My Dashboard',
          widgets: [],
          dateFilter: 'all',
        },
      });
    }

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      error: error.message,
    });
  }
};

module.exports = { saveDashboard, getDashboard };
