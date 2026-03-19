// src/hooks/useOrders.js
// Custom hook for managing Customer Orders state and API calls

import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../services/api';

const useOrders = (dateFilter = 'all') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getAll({ dateFilter });
      setOrders(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Create order
  const createOrder = async (data) => {
    const res = await orderAPI.create(data);
    await fetchOrders();
    return res.data;
  };

  // Update order
  const updateOrder = async (id, data) => {
    const res = await orderAPI.update(id, data);
    await fetchOrders();
    return res.data;
  };

  // Delete order
  const deleteOrder = async (id) => {
    await orderAPI.delete(id);
    await fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};

export default useOrders;
