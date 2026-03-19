// controllers/orderController.js
// Handles all CRUD operations for Customer Orders

const Order = require('../models/Order');

/**
 * Create a new order
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Calculate total amount
    orderData.totalAmount = (orderData.quantity || 1) * (orderData.unitPrice || 0);

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Get all orders with optional date filtering
 * GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const { dateFilter, page = 1, limit = 100 } = req.query;

    // Build date filter query
    let query = {};
    const now = new Date();

    if (dateFilter && dateFilter !== 'all') {
      let startDate;
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
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
      }
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * Get a single order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

/**
 * Update an existing order
 * PUT /api/orders/:id
 */
const updateOrder = async (req, res) => {
  try {
    const updateData = req.body;

    // Recalculate total amount if quantity or unit price changes
    if (updateData.quantity || updateData.unitPrice) {
      const existing = await Order.findById(req.params.id);
      const quantity = updateData.quantity ?? existing.quantity;
      const unitPrice = updateData.unitPrice ?? existing.unitPrice;
      updateData.totalAmount = quantity * unitPrice;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message,
    });
  }
};

/**
 * Delete an order
 * DELETE /api/orders/:id
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
