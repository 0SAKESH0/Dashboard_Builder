// src/pages/OrderFormPage.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useOrders from '../hooks/useOrders';
import OrderForm from '../components/Orders/OrderForm';

const OrderFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, createOrder, updateOrder } = useOrders();
  const isEdit = !!id;
  const order = isEdit ? orders.find(o => o._id === id) : null;

  const handleSubmit = async (data) => {
    if (isEdit) {
      await updateOrder(id, data);
    } else {
      await createOrder(data);
    }
    navigate('/orders');
  };

  const handleClose = () => {
    navigate('/orders');
  };

  return (
    <div style={{ padding: '32px' }}>
      <OrderForm order={order} onSubmit={handleSubmit} onClose={handleClose} />
    </div>
  );
};

export default OrderFormPage;
