// src/components/Widgets/Charts/PieChartWidget.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { widgetAPI } from '../../../services/api';
import { CHART_COLORS } from '../../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '11px' }}>{item.name}</div>
      <div style={{ color: item.payload.fill, fontFamily: 'JetBrains Mono, monospace', fontWeight: '600' }}>{item.value?.toLocaleString()}</div>
    </div>
  );
};

const PieChartWidget = ({ config, dateFilter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { title = 'Pie Chart', description = '', field = 'Status', showLegend = true } = config || {};

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await widgetAPI.getPie({ field, dateFilter });
        setData(res.data.data || []);
      } catch { setData([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [field, dateFilter]);

  return (
    <div style={{ height: '100%', background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{title}</div>
        {description && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No data available</div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy={showLegend ? '45%' : '50%'}
                innerRadius="35%"
                outerRadius="60%"
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PieChartWidget;
