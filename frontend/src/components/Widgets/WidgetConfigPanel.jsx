// src/components/Widgets/WidgetConfigPanel.jsx
// Side panel for configuring widget settings

import React, { useState, useEffect } from 'react';
import { METRIC_FIELDS, NUMERIC_FIELDS, AXIS_FIELDS, TABLE_COLUMNS } from '../../utils/helpers';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
      color: '#00e5a0', textTransform: 'uppercase', marginBottom: '12px',
    }}>
      {title}
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '12px' }}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const PIE_FIELDS = ['Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by'];

const WidgetConfigPanel = ({ widget, onUpdate, onClose }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (widget) {
      setConfig({
        title: widget.title || 'Untitled',
        description: widget.description || '',
        ...widget.config,
      });
    }
  }, [widget]);

  if (!widget) return null;

  const set = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const { title, description, ...rest } = config;
    onUpdate(widget.widgetId, { title, description, config: rest });
    onClose();
  };

  const type = widget.type;
  const isChart = ['bar-chart', 'line-chart', 'area-chart', 'scatter-plot'].includes(type);
  const isPie = type === 'pie-chart';
  const isKPI = type === 'kpi';
  const isTable = type === 'table';

  const selectedColumns = config.columns || ['Customer name', 'Product', 'Total amount', 'Status'];

  const toggleColumn = (col) => {
    const current = config.columns || ['Customer name', 'Product', 'Total amount', 'Status'];
    const next = current.includes(col)
      ? current.filter((c) => c !== col)
      : [...current, col];
    set('columns', next);
  };

  const addFilter = () => {
    const current = config.filters || [];
    set('filters', [...current, { field: 'Status', value: '' }]);
  };

  const removeFilter = (idx) => {
    const current = [...(config.filters || [])];
    current.splice(idx, 1);
    set('filters', current);
  };

  const updateFilter = (idx, key, value) => {
    const current = [...(config.filters || [])];
    current[idx] = { ...current[idx], [key]: value };
    set('filters', current);
  };

  const aggregationOptions =
    NUMERIC_FIELDS.includes(config.metric)
      ? ['Sum', 'Average', 'Count']
      : ['Count'];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '340px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.25s ease',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Panel Header */}
      <div style={{
        padding: '20px', borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
            Widget Settings
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', textTransform: 'capitalize' }}>
            {widget.type.replace('-', ' ')}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>

      {/* Panel Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* General Settings */}
        <Section title="General">
          <Field label="Widget Title">
            <input className="form-input" value={config.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="Untitled" />
          </Field>
          <Field label="Description">
            <input className="form-input" value={config.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Optional description" />
          </Field>
        </Section>

        {/* KPI Settings */}
        {isKPI && (
          <Section title="Data Settings">
            <Field label="Select Metric">
              <select className="form-input" value={config.metric || 'Total amount'} onChange={(e) => { set('metric', e.target.value); set('aggregation', 'Count'); }}>
                {METRIC_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Aggregation">
              <select className="form-input" value={config.aggregation || 'Sum'} onChange={(e) => set('aggregation', e.target.value)}>
                {aggregationOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Data Format">
              <select className="form-input" value={config.dataFormat || 'Number'} onChange={(e) => set('dataFormat', e.target.value)}>
                <option>Number</option>
                <option>Currency</option>
              </select>
            </Field>
            <Field label="Decimal Precision">
              <input className="form-input" type="number" min="0" max="6" value={config.decimalPrecision ?? 0} onChange={(e) => set('decimalPrecision', Number(e.target.value))} />
            </Field>
          </Section>
        )}

        {/* Chart Settings */}
        {isChart && (
          <Section title="Data Settings">
            <Field label="X Axis">
              <select className="form-input" value={config.xAxis || 'Product'} onChange={(e) => set('xAxis', e.target.value)}>
                {AXIS_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Y Axis">
              <select className="form-input" value={config.yAxis || 'Total amount'} onChange={(e) => set('yAxis', e.target.value)}>
                {AXIS_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
          </Section>
        )}

        {/* Pie Settings */}
        {isPie && (
          <Section title="Data Settings">
            <Field label="Chart Data Field">
              <select className="form-input" value={config.field || 'Status'} onChange={(e) => set('field', e.target.value)}>
                {PIE_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input type="checkbox" id="legend" checked={config.showLegend !== false} onChange={(e) => set('showLegend', e.target.checked)} style={{ accentColor: '#00e5a0' }} />
              <label htmlFor="legend" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Show Legend</label>
            </div>
          </Section>
        )}

        {/* Chart Styling */}
        {(isChart || isPie) && (
          <Section title="Styling">
            {isChart && (
              <>
                <Field label="Chart Color">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="color" value={config.chartColor || '#00e5a0'} onChange={(e) => set('chartColor', e.target.value)}
                      style={{ width: '40px', height: '36px', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer', background: 'none' }} />
                    <input className="form-input" value={config.chartColor || '#00e5a0'} onChange={(e) => set('chartColor', e.target.value)} placeholder="#00e5a0" />
                  </div>
                </Field>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="dataLabel" checked={config.showDataLabel || false} onChange={(e) => set('showDataLabel', e.target.checked)} style={{ accentColor: '#00e5a0' }} />
                  <label htmlFor="dataLabel" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Show Data Labels</label>
                </div>
              </>
            )}
          </Section>
        )}

        {/* Table Settings */}
        {isTable && (
          <>
            <Section title="Columns">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TABLE_COLUMNS.map((col) => (
                  <button
                    key={col}
                    onClick={() => toggleColumn(col)}
                    style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                      cursor: 'pointer', border: '1px solid',
                      background: selectedColumns.includes(col) ? 'rgba(0,229,160,0.12)' : 'transparent',
                      borderColor: selectedColumns.includes(col) ? 'rgba(0,229,160,0.4)' : 'var(--border-color)',
                      color: selectedColumns.includes(col) ? '#00e5a0' : 'var(--text-muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Sort Options">
              <Field label="Sort Field">
                <select className="form-input" value={config.sortField || 'Order date'} onChange={(e) => set('sortField', e.target.value)}>
                  <option>Order date</option>
                  <option>Total amount</option>
                  <option>Customer name</option>
                  <option>Status</option>
                </select>
              </Field>
              <Field label="Sort Order">
                <select className="form-input" value={config.sortOrder || 'Descending'} onChange={(e) => set('sortOrder', e.target.value)}>
                  <option>Ascending</option>
                  <option>Descending</option>
                </select>
              </Field>
              <Field label="Rows per Page">
                <select className="form-input" value={config.pagination || 10} onChange={(e) => set('pagination', Number(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </Field>
            </Section>

            <Section title="Filters">
              {(config.filters || []).map((f, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                  <select className="form-input" style={{ flex: 1 }} value={f.field} onChange={(e) => updateFilter(idx, 'field', e.target.value)}>
                    {TABLE_COLUMNS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input className="form-input" style={{ flex: 1 }} value={f.value} onChange={(e) => updateFilter(idx, 'value', e.target.value)} placeholder="Filter value" />
                  <button onClick={() => removeFilter(idx)} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <button
                onClick={addFilter}
                style={{ background: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', borderRadius: '6px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', width: '100%' }}
              >
                + Add Filter
              </button>
            </Section>

            <Section title="Styling">
              <Field label="Font Size (px)">
                <input className="form-input" type="range" min="12" max="18" value={config.fontSize || 13}
                  onChange={(e) => set('fontSize', Number(e.target.value))}
                  style={{ accentColor: '#00e5a0' }} />
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{config.fontSize || 13}px</div>
              </Field>
              <Field label="Header Background">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={config.headerBg || '#54bd95'} onChange={(e) => set('headerBg', e.target.value)}
                    style={{ width: '40px', height: '36px', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer' }} />
                  <input className="form-input" value={config.headerBg || '#54bd95'} onChange={(e) => set('headerBg', e.target.value)} placeholder="#54bd95" />
                </div>
              </Field>
            </Section>
          </>
        )}
      </div>

      {/* Panel Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>Apply Changes</button>
      </div>
    </div>
  );
};

export default WidgetConfigPanel;
