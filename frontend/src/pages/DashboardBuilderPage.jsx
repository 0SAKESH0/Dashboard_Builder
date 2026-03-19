// src/pages/DashboardBuilderPage.jsx
// Dashboard configuration page: widget sidebar + editable grid canvas

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../hooks/useDashboard';
import WidgetSidebar from '../components/Dashboard/WidgetSidebar';
import GridCanvas from '../components/Dashboard/GridCanvas';

const DATE_FILTER_OPTIONS = [
  { value: 'all',    label: 'All Time' },
  { value: 'today',  label: 'Today' },
  { value: 'last7',  label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
];

const DashboardBuilderPage = () => {
  const navigate = useNavigate();
  const {
    widgets, layouts, dateFilter, setDateFilter,
    loading, saving,
    addWidget, removeWidget, updateWidget, updateLayouts,
    saveDashboard,
  } = useDashboard();

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const ok = await saveDashboard();
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleDone = async () => {
    await saveDashboard();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div>Loading dashboard...</div>
        </div>
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
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '16px',
        }}
      >
        {/* Left: title + breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px',
              display: 'flex', alignItems: 'center', padding: '4px',
            }}
          >
            ←
          </button>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
              Configure Dashboard
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {widgets.length} widget{widgets.length !== 1 ? 's' : ''} on canvas
            </div>
          </div>

          {/* Edit mode badge */}
          <div
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '11px',
              color: '#f59e0b',
              fontWeight: '600',
            }}
          >
            ✏️ Edit Mode
          </div>
        </div>

        {/* Right: date filter + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Date filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Show data for</span>
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

          <button
            className="btn-secondary"
            onClick={handleSave}
            disabled={saving}
            style={{ fontSize: '13px', padding: '7px 16px' }}
          >
            {saving ? '⏳ Saving…' : '💾 Save Configuration'}
          </button>

          <button
            className="btn-primary"
            onClick={handleDone}
            style={{ fontSize: '13px', padding: '7px 18px' }}
          >
            ✓ Done
          </button>
        </div>
      </div>

      {/* ── Body: Sidebar + Canvas ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Widget Palette */}
        <WidgetSidebar onAddWidget={addWidget} />

        {/* Grid Canvas */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          {/* Canvas toolbar hint */}
          <div
            style={{
              padding: '8px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              background: 'rgba(255,255,255,0.01)',
            }}
          >
            {[
              { icon: '🖱️', text: 'Drag widgets to reposition' },
              { icon: '↔️', text: 'Drag edges to resize' },
              { icon: '⚙️', text: 'Hover → Settings to configure' },
              { icon: '✕',  text: 'Hover → Remove to delete' },
            ].map((hint) => (
              <div key={hint.text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{hint.icon}</span> {hint.text}
              </div>
            ))}
          </div>

          <GridCanvas
            widgets={widgets}
            layouts={layouts}
            dateFilter={dateFilter}
            onLayoutChange={updateLayouts}
            onRemoveWidget={removeWidget}
            onUpdateWidget={updateWidget}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilderPage;
