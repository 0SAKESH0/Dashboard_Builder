// controllers/widgetController.js
// Handles data aggregation and processing for dashboard widgets

const Order = require('../models/Order');

/**
 * Build date filter query based on filter type
 */
const buildDateQuery = (dateFilter) => {
  if (!dateFilter || dateFilter === 'all') return {};

  let startDate;
  const now = new Date();

  switch (dateFilter) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'last7':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last30':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last90':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      return {};
  }

  return { createdAt: { $gte: startDate } };
};

/**
 * Map frontend field names to MongoDB field names
 */
const fieldMap = {
  'Customer ID': '_id',
  'Customer name': 'firstName',
  'Email id': 'email',
  Address: 'streetAddress',
  'Order date': 'createdAt',
  Product: 'product',
  'Created by': 'createdBy',
  Status: 'status',
  'Total amount': 'totalAmount',
  'Unit price': 'unitPrice',
  Quantity: 'quantity',
  Duration: 'createdAt',
};

const numericFields = ['totalAmount', 'unitPrice', 'quantity'];

/**
 * Get KPI widget data
 * GET /api/widgets/kpi
 */
const getKPIData = async (req, res) => {
  try {
    const { metric, aggregation, dateFilter } = req.query;
    const dateQuery = buildDateQuery(dateFilter);
    const dbField = fieldMap[metric] || metric;

    let result = 0;

    if (aggregation === 'Count') {
      result = await Order.countDocuments(dateQuery);
    } else if (aggregation === 'Sum' && numericFields.includes(dbField)) {
      const agg = await Order.aggregate([
        { $match: dateQuery },
        { $group: { _id: null, total: { $sum: `$${dbField}` } } },
      ]);
      result = agg[0]?.total || 0;
    } else if (aggregation === 'Average' && numericFields.includes(dbField)) {
      const agg = await Order.aggregate([
        { $match: dateQuery },
        { $group: { _id: null, avg: { $avg: `$${dbField}` } } },
      ]);
      result = agg[0]?.avg || 0;
    } else {
      // For non-numeric, return count
      result = await Order.countDocuments(dateQuery);
    }

    res.json({ success: true, data: { value: result, metric, aggregation } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KPI data',
      error: error.message,
    });
  }
};

/**
 * Get chart widget data (bar, line, area, scatter)
 * GET /api/widgets/chart
 */
const getChartData = async (req, res) => {
  try {
    const { xAxis, yAxis, dateFilter } = req.query;
    const dateQuery = buildDateQuery(dateFilter);

    const xField = fieldMap[xAxis] || xAxis;
    const yField = fieldMap[yAxis] || yAxis;

    let data = [];

    // Aggregate by X axis, sum/count Y axis
    if (numericFields.includes(yField)) {
      const agg = await Order.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: `$${xField}`,
            value: { $sum: `$${yField}` },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      data = agg.map((item) => ({
        name: item._id?.toString() || 'Unknown',
        value: item.value,
        count: item.count,
      }));
    } else {
      // Group by x, count
      const agg = await Order.aggregate([
        { $match: dateQuery },
        { $group: { _id: `$${xField}`, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      data = agg.map((item) => ({
        name: item._id?.toString() || 'Unknown',
        value: item.count,
      }));
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message,
    });
  }
};

/**
 * Get pie chart data
 * GET /api/widgets/pie
 */
const getPieData = async (req, res) => {
  try {
    const { field, dateFilter } = req.query;
    const dateQuery = buildDateQuery(dateFilter);
    const dbField = fieldMap[field] || field;

    let data = [];

    if (numericFields.includes(dbField)) {
      // Sum by grouping another categorical field
      const agg = await Order.aggregate([
        { $match: dateQuery },
        { $group: { _id: '$product', value: { $sum: `$${dbField}` } } },
        { $sort: { value: -1 } },
      ]);
      data = agg.map((item) => ({
        name: item._id || 'Unknown',
        value: Math.round(item.value * 100) / 100,
      }));
    } else {
      const agg = await Order.aggregate([
        { $match: dateQuery },
        { $group: { _id: `$${dbField}`, value: { $sum: 1 } } },
        { $sort: { value: -1 } },
      ]);
      data = agg.map((item) => ({
        name: item._id || 'Unknown',
        value: item.value,
      }));
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pie data',
      error: error.message,
    });
  }
};

/**
 * Get table widget data with filtering and pagination
 * GET /api/widgets/table
 */
const getTableData = async (req, res) => {
  try {
    const {
      columns,
      sortField = 'createdAt',
      sortOrder = 'Descending',
      page = 1,
      limit = 10,
      dateFilter,
      filters,
    } = req.query;

    const dateQuery = buildDateQuery(dateFilter);

    // Parse additional filters
    let filterQuery = { ...dateQuery };
    if (filters) {
      try {
        const parsedFilters = JSON.parse(filters);
        parsedFilters.forEach((f) => {
          if (f.field && f.value) {
            const dbField = fieldMap[f.field] || f.field;
            filterQuery[dbField] = { $regex: f.value, $options: 'i' };
          }
        });
      } catch (e) {
        // Invalid filters, ignore
      }
    }

    const sortDirection = sortOrder === 'Ascending' ? 1 : -1;
    const sortDbField = fieldMap[sortField] || sortField;

    const orders = await Order.find(filterQuery)
      .sort({ [sortDbField]: sortDirection })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(filterQuery);

    // Map to readable format
    const formattedOrders = orders.map((order) => ({
      'Customer ID': order._id.toString().slice(-6).toUpperCase(),
      'Customer name': `${order.firstName} ${order.lastName}`,
      'Email id': order.email,
      'Phone number': order.phone,
      Address: `${order.streetAddress}, ${order.city}`,
      'Order ID': order._id.toString().slice(-8).toUpperCase(),
      'Order date': new Date(order.createdAt).toLocaleDateString(),
      Product: order.product,
      Quantity: order.quantity,
      'Unit price': order.unitPrice,
      'Total amount': order.totalAmount,
      Status: order.status,
      'Created by': order.createdBy,
      _id: order._id,
    }));

    res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table data',
      error: error.message,
    });
  }
};

/**
 * Get all widget data
 * GET /api/widgets
 */
const getWidgetData = async (req, res) => {
  try {
    const { dateFilter } = req.query;
    const dateQuery = buildDateQuery(dateFilter);

    const orders = await Order.find(dateQuery).sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch widget data',
      error: error.message,
    });
  }
};

module.exports = {
  getKPIData,
  getChartData,
  getPieData,
  getTableData,
  getWidgetData,
};
