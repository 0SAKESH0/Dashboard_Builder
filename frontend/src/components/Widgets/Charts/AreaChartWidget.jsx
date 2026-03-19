// src/components/Widgets/Charts/AreaChartWidget.jsx
import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';
import { widgetAPI } from '../../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '11px' }}>{label}</div>
      <div style={{ color: payload[0]?.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: '600' }}>{payload[0]?.value?.toLocaleString()}</div>
    </div>
  );
};

const AreaChartWidget = ({ config, dateFilter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { title = 'Area Chart', description = '', xAxis = 'Product', yAxis = 'Total amount', chartColor = '#8b5cf6', showDataLabel = false } = config || {};

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await widgetAPI.getChart({ xAxis, yAxis, dateFilter });
        setData(res.data.data || []);
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
            <AreaChart data={data} margin={{ top: showDataLabel ? 20 : 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id={`grad-${chartColor.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill={`url(#grad-${chartColor.replace('#','')})`}>
                {showDataLabel && <LabelList dataKey="value" position="top" style={{ fill: chartColor, fontSize: 11 }} />}
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AreaChartWidget;
