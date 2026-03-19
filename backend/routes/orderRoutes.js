// routes/orderRoutes.js
// Express routes for Customer Order CRUD operations

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

// GET all orders
router.get('/', getOrders);

// GET single order by ID
router.get('/:id', getOrderById);

// POST create new order
router.post('/', createOrder);

// PUT update existing order
router.put('/:id', updateOrder);

// DELETE remove order
router.delete('/:id', deleteOrder);

module.exports = router;
