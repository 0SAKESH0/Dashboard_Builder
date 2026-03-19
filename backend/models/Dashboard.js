// models/Dashboard.js
// Mongoose schema for Dashboard Configuration

const mongoose = require('mongoose');

/**
 * Widget Configuration Schema
 * Stores individual widget settings
 */
const widgetConfigSchema = new mongoose.Schema({
  // Unique widget identifier
  widgetId: { type: String, required: true },

  // Widget type: bar-chart, line-chart, pie-chart, area-chart, scatter-plot, table, kpi
  type: { type: String, required: true },

  // Display title
  title: { type: String, default: 'Untitled' },

  // Optional description
  description: { type: String, default: '' },

  // Grid layout position
  layout: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    w: { type: Number, default: 4 },
    h: { type: Number, default: 4 },
    minW: { type: Number, default: 2 },
    minH: { type: Number, default: 2 },
  },

  // Widget-specific configuration (stored as flexible object)
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
});

/**
 * Dashboard Schema
 * Stores entire dashboard layout and widget configurations
 */
const dashboardSchema = new mongoose.Schema(
  {
    // Dashboard name (single dashboard per user for now)
    name: { type: String, default: 'My Dashboard' },

    // List of widgets in the dashboard
    widgets: [widgetConfigSchema],

    // Date filter setting
    dateFilter: {
      type: String,
      enum: ['all', 'today', 'last7', 'last30', 'last90'],
      default: 'all',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
