// src/components/Widgets/Charts/ScatterWidget.jsx
import React, { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ZAxis,
} from 'recharts';
import { widgetAPI } from '../../../services/api';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: '600' }}>
          {p.name}: {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

const ScatterWidget = ({ config, dateFilter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { title = 'Scatter Plot', description = '', xAxis = 'Quantity', yAxis = 'Total amount', chartColor = '#f59e0b' } = config || {};

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await widgetAPI.getChart({ xAxis, yAxis, dateFilter });
        // Transform data for scatter: use index as x, value as y
        const transformed = (res.data.data || []).map((d, i) => ({ x: i + 1, y: d.value, name: d.name }));
        setData(transformed);
      } catch { setData([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [xAxis, yAxis, dateFilter]);

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
            <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="x" type="number" name={xAxis} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="y" type="number" name={yAxis} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <ZAxis range={[40, 40]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={data} fill={chartColor} opacity={0.85} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ScatterWidget;
