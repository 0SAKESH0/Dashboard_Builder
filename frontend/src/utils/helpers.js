// src/utils/helpers.js
// Shared utility functions

/**
 * Format a number as currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number with specified decimal places
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Truncate long strings
 */
export const truncate = (str, maxLength = 30) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
};

/**
 * Generate a short unique ID
 */
export const generateId = () =>
  `w_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;

/**
 * Status badge class helper
 */
export const getStatusClass = (status) => {
  switch (status) {
    case 'Completed': return 'badge badge-completed';
    case 'In Progress': return 'badge badge-progress';
    default: return 'badge badge-pending';
  }
};

/**
 * Chart colors palette
 */
export const CHART_COLORS = [
  '#00e5a0',
  '#3b82f6',
  '#f59e0b',
  '#f43f5e',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f97316',
];

/**
 * Widget type labels
 */
export const WIDGET_TYPE_LABELS = {
  'bar-chart': 'Bar Chart',
  'line-chart': 'Line Chart',
  'pie-chart': 'Pie Chart',
  'area-chart': 'Area Chart',
  'scatter-plot': 'Scatter Plot',
  table: 'Table',
  kpi: 'KPI Value',
};

/**
 * All available metric fields
 */
export const METRIC_FIELDS = [
  'Customer ID',
  'Customer name',
  'Email id',
  'Address',
  'Order date',
  'Product',
  'Created by',
  'Status',
  'Total amount',
  'Unit price',
  'Quantity',
];

/**
 * Numeric fields (support Sum/Average)
 */
export const NUMERIC_FIELDS = ['Total amount', 'Unit price', 'Quantity'];

/**
 * Axis fields for charts
 */
export const AXIS_FIELDS = [
  'Product',
  'Quantity',
  'Unit price',
  'Total amount',
  'Status',
  'Created by',
  'Duration',
];

/**
 * Table column options
 */
export const TABLE_COLUMNS = [
  'Customer ID',
  'Customer name',
  'Email id',
  'Phone number',
  'Address',
  'Order ID',
  'Order date',
  'Product',
  'Quantity',
  'Unit price',
  'Total amount',
  'Status',
  'Created by',
];
