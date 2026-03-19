// src/components/Orders/DeleteConfirm.jsx
// Confirmation dialog for deleting an order

import React, { useState } from 'react';

const DeleteConfirm = ({ order, onConfirm, onClose }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          padding: '28px',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          style={{
            width: '52px', height: '52px',
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.25)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px', marginBottom: '18px',
          }}
        >
          🗑️
        </div>

        <h3
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: '700',
            fontSize: '17px', color: 'var(--text-primary)', margin: '0 0 8px',
          }}
        >
          Delete Order
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: '1.6' }}>
          Are you sure you want to delete the order for{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {order?.firstName} {order?.lastName}
          </strong>?
          This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-danger"
            style={{ flex: 1 }}
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
