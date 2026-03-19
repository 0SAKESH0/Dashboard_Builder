// src/components/Orders/OrderForm.jsx
// Create/Edit order modal with full validation

import React, { useState, useEffect } from 'react';

const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const CREATED_BY = [
  'Mr. Michael Harris',
  'Mr. Ryan Cooper',
  'Ms. Olivia Carter',
  'Mr. Lucas Martin',
];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  streetAddress: '', city: '', state: '', postalCode: '',
  country: 'United States', product: 'Fiber Internet 300 Mbps',
  quantity: 1, unitPrice: '', status: 'Pending',
  createdBy: 'Mr. Michael Harris',
};

const REQUIRED = [
  'firstName','lastName','email','phone',
  'streetAddress','city','state','postalCode',
  'country','product','unitPrice','createdBy',
];

const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <label className="form-label">{label}</label>
    {children}
    {error && <div className="form-error">{error}</div>}
  </div>
);

const OrderForm = ({ order, onSubmit, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!order;

  useEffect(() => {
    if (order) {
      setForm({
        firstName: order.firstName || '',
        lastName: order.lastName || '',
        email: order.email || '',
        phone: order.phone || '',
        streetAddress: order.streetAddress || '',
        city: order.city || '',
        state: order.state || '',
        postalCode: order.postalCode || '',
        country: order.country || 'United States',
        product: order.product || 'Fiber Internet 300 Mbps',
        quantity: order.quantity || 1,
        unitPrice: order.unitPrice || '',
        status: order.status || 'Pending',
        createdBy: order.createdBy || 'Mr. Michael Harris',
      });
    }
  }, [order]);

  const set = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        next.totalAmount = (Number(next.quantity) || 0) * (Number(next.unitPrice) || 0);
      }
      return next;
    });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    REQUIRED.forEach((f) => {
      if (!form[f] || form[f] === '') newErrors[f] = 'Please fill the field';
    });
    if (form.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    return newErrors;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        totalAmount: Number(form.quantity) * Number(form.unitPrice),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save order';
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = (Number(form.quantity) || 0) * (Number(form.unitPrice) || 0);

  const inputStyle = (field) => ({
    ...{},
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
                fontSize: '18px',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {isEdit ? 'Edit Order' : 'Create New Order'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              {isEdit ? 'Update order details below' : 'Fill in the details to create a new order'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '22px',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Section: Customer Info */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              color: '#00e5a0',
              textTransform: 'uppercase',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>👤</span> Customer Information
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="First Name *" error={errors.firstName}>
              <input className={`form-input${errors.firstName ? ' error' : ''}`}
                value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
                placeholder="John" />
            </Field>
            <Field label="Last Name *" error={errors.lastName}>
              <input className={`form-input${errors.lastName ? ' error' : ''}`}
                value={form.lastName} onChange={(e) => set('lastName', e.target.value)}
                placeholder="Doe" />
            </Field>
            <Field label="Email Address *" error={errors.email}>
              <input className={`form-input${errors.email ? ' error' : ''}`}
                value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder="john@example.com" type="email" />
            </Field>
            <Field label="Phone Number *" error={errors.phone}>
              <input className={`form-input${errors.phone ? ' error' : ''}`}
                value={form.phone} onChange={(e) => set('phone', e.target.value)}
                placeholder="+1 (555) 000-0000" />
            </Field>
          </div>

          <Field label="Street Address *" error={errors.streetAddress}>
            <input className={`form-input${errors.streetAddress ? ' error' : ''}`}
              value={form.streetAddress} onChange={(e) => set('streetAddress', e.target.value)}
              placeholder="123 Main Street" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
            <Field label="City *" error={errors.city}>
              <input className={`form-input${errors.city ? ' error' : ''}`}
                value={form.city} onChange={(e) => set('city', e.target.value)}
                placeholder="New York" />
            </Field>
            <Field label="State / Province *" error={errors.state}>
              <input className={`form-input${errors.state ? ' error' : ''}`}
                value={form.state} onChange={(e) => set('state', e.target.value)}
                placeholder="NY" />
            </Field>
            <Field label="Postal Code *" error={errors.postalCode}>
              <input className={`form-input${errors.postalCode ? ' error' : ''}`}
                value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)}
                placeholder="10001" />
            </Field>
          </div>

          <Field label="Country *" error={errors.country}>
            <select className="form-input" value={form.country} onChange={(e) => set('country', e.target.value)}>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* Section: Order Info */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              color: '#00e5a0',
              textTransform: 'uppercase',
              margin: '8px 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📦</span> Order Information
          </div>

          <Field label="Product *" error={errors.product}>
            <select className="form-input" value={form.product} onChange={(e) => set('product', e.target.value)}>
              {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
            <Field label="Quantity *" error={errors.quantity}>
              <input className="form-input" type="number" min="1"
                value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} />
            </Field>
            <Field label="Unit Price *" error={errors.unitPrice}>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute', left: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)', fontSize: '14px',
                  }}
                >$</span>
                <input className={`form-input${errors.unitPrice ? ' error' : ''}`}
                  type="number" min="0" step="0.01"
                  style={{ paddingLeft: '24px' }}
                  value={form.unitPrice} onChange={(e) => set('unitPrice', e.target.value)}
                  placeholder="0.00" />
              </div>
            </Field>
            <Field label="Total Amount">
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#00e5a0',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                ${totalAmount.toFixed(2)}
              </div>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="Status">
              <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Created By *" error={errors.createdBy}>
              <select className="form-input" value={form.createdBy} onChange={(e) => set('createdBy', e.target.value)}>
                {CREATED_BY.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
          </div>

          {errors.submit && (
            <div
              style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#f43f5e',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 28px 24px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '⏳ Saving...' : isEdit ? '✓ Update Order' : '+ Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
