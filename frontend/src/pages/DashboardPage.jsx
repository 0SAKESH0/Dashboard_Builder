// src/pages/DashboardPage.jsx
// Main dashboard view — read-only grid with date filter and save/configure actions

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../hooks/useDashboard';
import GridCanvas from '../components/Dashboard/GridCanvas';

const DATE_FILTER_OPTIONS = [
  { value: 'all',    label: 'All Time' },
  { value: 'today',  label: 'Today' },
  { value: 'last7',  label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    widgets, layouts, dateFilter, setDateFilter,
    loading, saving,
    updateWidget, updateLayouts, removeWidget,
    saveDashboard,
  } = useDashboard();

  const [saved, setSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSave = async () => {
    const ok = await saveDashboard();
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh', color: 'var(--text-muted)',
          flexDirection: 'column', gap: '12px',
        }}
      >
        <div style={{ fontSize: '32px' }}>⏳</div>
        <div style={{ fontSize: '14px' }}>Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── Top Bar ── */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 28px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '16px',
        }}
      >
        {/* Left: title */}
        <div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: '800', fontSize: '18px',
              color: 'var(--text-primary)', margin: 0,
            }}
          >
            Dashboard
          </h1>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {widgets.length} widget{widgets.length !== 1 ? 's' : ''} • {DATE_FILTER_OPTIONS.find(o => o.value === dateFilter)?.label}
          </div>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Date filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Show data for
            </span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {DATE_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          {/* Edit toggle */}
          <button
            onClick={() => setIsEditMode((v) => !v)}
            style={{
              background: isEditMode ? 'rgba(245,158,11,0.12)' : 'transparent',
              border: `1px solid ${isEditMode ? 'rgba(245,158,11,0.35)' : 'var(--border-color)'}`,
              color: isEditMode ? '#f59e0b' : 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '7px 14px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            {isEditMode ? '🔒 Lock Layout' : '✏️ Edit Layout'}
          </button>

          {/* Save feedback */}
          {saved && (
            <div
              style={{
                background: 'rgba(0,229,160,0.12)',
                border: '1px solid rgba(0,229,160,0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#00e5a0',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              ✓ Saved
            </div>
          )}

          {/* Save config */}
          <button
            className="btn-secondary"
            onClick={handleSave}
            disabled={saving}
            style={{ fontSize: '13px', padding: '7px 16px' }}
          >
            {saving ? '⏳ Saving…' : '💾 Save Configuration'}
          </button>

          {/* Configure */}
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard/configure')}
            style={{ fontSize: '13px', padding: '7px 18px' }}
          >
            ⚙️ Configure Dashboard
          </button>
        </div>
      </div>

      {/* ── Dashboard Grid ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {widgets.length === 0 ? (
          // Empty state
          <div
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px', color: 'var(--text-muted)',
            }}
          >
            <div
              style={{
                width: '100px', height: '100px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(0,229,160,0.08), rgba(59,130,246,0.08))',
                border: '1px dashed rgba(0,229,160,0.2)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '44px',
                marginBottom: '24px',
              }}
            >
              📊
            </div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700', fontSize: '20px',
                color: 'var(--text-primary)', marginBottom: '10px',
              }}
            >
              Your dashboard is empty
            </div>
            <div
              style={{
                fontSize: '14px', color: 'var(--text-secondary)',
                textAlign: 'center', maxWidth: '360px', lineHeight: '1.7',
                marginBottom: '28px',
              }}
            >
              Start building your custom dashboard by adding charts, tables, and KPI widgets.
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate('/dashboard/configure')}
              style={{ fontSize: '14px', padding: '10px 24px' }}
            >
              ⚙️ Configure Dashboard
            </button>
          </div>
        ) : (
          <GridCanvas
            widgets={widgets}
            layouts={layouts}
            dateFilter={dateFilter}
            onLayoutChange={updateLayouts}
            onRemoveWidget={removeWidget}
            onUpdateWidget={updateWidget}
            isEditing={isEditMode}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
