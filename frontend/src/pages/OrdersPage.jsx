// src/pages/OrdersPage.jsx
// Customer Orders listing page with create, edit, delete

import React, { useState } from 'react';
import useOrders from '../hooks/useOrders';
import OrderForm from '../components/Orders/OrderForm';
import DeleteConfirm from '../components/Orders/DeleteConfirm';
import { getStatusClass, formatCurrency, truncate } from '../utils/helpers';

const OrdersPage = () => {
  const { orders, loading, error, createOrder, updateOrder, deleteOrder } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const handleCreate = async (data) => {
    await createOrder(data);
  };

  const handleEdit = async (data) => {
    await updateOrder(editOrder._id, data);
  };

  const handleDelete = async () => {
    await deleteOrder(deleteTarget._id);
  };

  // Filter orders by search
  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    return (
      !term ||
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(term) ||
      o.email?.toLowerCase().includes(term) ||
      o.product?.toLowerCase().includes(term) ||
      o.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: '800',
              fontSize: '26px',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Customer Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: '14px' }}>
            Manage and track all customer orders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)', fontSize: '14px', pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              className="form-input"
              style={{ paddingLeft: '36px', width: '240px' }}
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            onClick={() => { setEditOrder(null); setShowForm(true); }}
          >
            + Create Order
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Orders', value: orders.length, color: '#3b82f6', icon: '📋' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#f59e0b', icon: '⏳' },
          { label: 'In Progress', value: orders.filter(o => o.status === 'In Progress').length, color: '#8b5cf6', icon: '🔄' },
          { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: '#00e5a0', icon: '✓' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              minWidth: '150px',
            }}
          >
            <div
              style={{
                width: '38px', height: '38px',
                borderRadius: '10px',
                background: `${stat.color}18`,
                border: `1px solid ${stat.color}33`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '18px',
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: '600', fontSize: '20px',
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '60px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            Loading orders...
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>
            ❌ {error}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '80px 40px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📭</div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '8px',
                color: 'var(--text-primary)',
              }}
            >
              {search ? 'No matching orders' : 'No orders yet'}
            </div>
            <div style={{ fontSize: '13px' }}>
              {search ? 'Try a different search term' : 'Click "Create Order" to add your first order'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '1000px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, idx) => (
                  <tr key={order._id} className="animate-fade-in">
                    <td>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {String(idx + 1).padStart(3, '0')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>
                        {order.firstName} {order.lastName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {order.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{truncate(order.product, 28)}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '13px',
                        }}
                      >
                        {order.quantity}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                        {formatCurrency(order.unitPrice)}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '13px',
                          color: '#00e5a0',
                          fontWeight: '600',
                        }}
                      >
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusClass(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {order.createdBy}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => { setEditOrder(order); setShowForm(true); }}
                          style={{
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.25)',
                            color: '#3b82f6',
                            borderRadius: '7px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(order)}
                          style={{
                            background: 'rgba(244,63,94,0.1)',
                            border: '1px solid rgba(244,63,94,0.25)',
                            color: '#f43f5e',
                            borderRadius: '7px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {filtered.length} of {orders.length} orders
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              Total Revenue:{' '}
              <span style={{ color: '#00e5a0', fontWeight: '600' }}>
                {formatCurrency(orders.reduce((s, o) => s + (o.totalAmount || 0), 0))}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <OrderForm
          order={editOrder}
          onSubmit={editOrder ? handleEdit : handleCreate}
          onClose={() => { setShowForm(false); setEditOrder(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          order={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
