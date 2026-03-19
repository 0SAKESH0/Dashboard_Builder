// src/components/Dashboard/WidgetSidebar.jsx
// Sidebar showing available widgets to add to dashboard

import React from 'react';
import { generateId } from '../../utils/helpers';

const WIDGET_CATEGORIES = [
  {
    label: 'Charts',
    icon: '📈',
    items: [
      { type: 'bar-chart',    label: 'Bar Chart',    icon: '📊', defaultW: 5, defaultH: 5 },
      { type: 'line-chart',   label: 'Line Chart',   icon: '📉', defaultW: 5, defaultH: 5 },
      { type: 'pie-chart',    label: 'Pie Chart',    icon: '🥧', defaultW: 4, defaultH: 4 },
      { type: 'area-chart',   label: 'Area Chart',   icon: '🏔️', defaultW: 5, defaultH: 5 },
      { type: 'scatter-plot', label: 'Scatter Plot', icon: '⬡',  defaultW: 5, defaultH: 5 },
    ],
  },
  {
    label: 'Tables',
    icon: '📋',
    items: [
      { type: 'table', label: 'Table', icon: '🗃️', defaultW: 6, defaultH: 5 },
    ],
  },
  {
    label: 'KPIs',
    icon: '🎯',
    items: [
      { type: 'kpi', label: 'KPI Value', icon: '🔢', defaultW: 3, defaultH: 3 },
    ],
  },
];

const WidgetSidebar = ({ onAddWidget }) => {
  const handleAdd = (item) => {
    const widget = {
      widgetId: generateId(),
      type: item.type,
      title: item.label,
      description: '',
      layout: {
        x: 0, y: Infinity,
        w: item.defaultW, h: item.defaultH,
        minW: 2, minH: 2,
      },
      config: getDefaultConfig(item.type),
    };
    onAddWidget(widget);
  };

  return (
    <div
      style={{
        width: '220px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>
          Widget Library
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
          Click to add to dashboard
        </div>
      </div>

      <div style={{ padding: '12px 12px' }}>
        {WIDGET_CATEGORIES.map((cat) => (
          <div key={cat.label} style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em',
                color: 'var(--text-muted)', textTransform: 'uppercase',
                marginBottom: '8px', padding: '0 4px',
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </div>
            {cat.items.map((item) => (
              <button
                key={item.type}
                onClick={() => handleAdd(item)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '9px', padding: '10px 12px', cursor: 'pointer',
                  marginBottom: '6px', color: 'var(--text-primary)',
                  transition: 'all 0.15s', textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)';
                  e.currentTarget.style.background = 'rgba(0,229,160,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Returns sensible default config values per widget type
 */
function getDefaultConfig(type) {
  switch (type) {
    case 'kpi':
      return { metric: 'Total amount', aggregation: 'Sum', dataFormat: 'Currency', decimalPrecision: 2 };
    case 'bar-chart':
    case 'line-chart':
    case 'area-chart':
    case 'scatter-plot':
      return { xAxis: 'Product', yAxis: 'Total amount', chartColor: '#00e5a0', showDataLabel: false };
    case 'pie-chart':
      return { field: 'Status', showLegend: true };
    case 'table':
      return {
        columns: ['Customer name', 'Product', 'Total amount', 'Status'],
        sortField: 'Order date', sortOrder: 'Descending',
        pagination: 10, fontSize: 13, headerBg: '#54bd95', filters: [],
      };
    default:
      return {};
  }
}

export default WidgetSidebar;
