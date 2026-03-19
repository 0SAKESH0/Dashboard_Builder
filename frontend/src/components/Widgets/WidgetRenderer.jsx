// src/components/Widgets/WidgetRenderer.jsx
// Renders the correct widget component based on type

import React from 'react';
import KPIWidget from './KPI/KPIWidget';
import BarChartWidget from './Charts/BarChartWidget';
import LineChartWidget from './Charts/LineChartWidget';
import AreaChartWidget from './Charts/AreaChartWidget';
import PieChartWidget from './Charts/PieChartWidget';
import ScatterWidget from './Charts/ScatterWidget';
import TableWidget from './Table/TableWidget';

const WidgetRenderer = ({ widget, dateFilter }) => {
  const { type, config } = widget;

  const props = { config, dateFilter };

  switch (type) {
    case 'kpi':          return <KPIWidget {...props} />;
    case 'bar-chart':    return <BarChartWidget {...props} />;
    case 'line-chart':   return <LineChartWidget {...props} />;
    case 'area-chart':   return <AreaChartWidget {...props} />;
    case 'pie-chart':    return <PieChartWidget {...props} />;
    case 'scatter-plot': return <ScatterWidget {...props} />;
    case 'table':        return <TableWidget {...props} />;
    default:
      return (
        <div style={{
          height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'var(--text-muted)',
          fontSize: '13px', background: 'var(--bg-card)',
          borderRadius: '12px', border: '1px solid var(--border-color)',
        }}>
          Unknown widget type: {type}
        </div>
      );
  }
};

export default WidgetRenderer;
