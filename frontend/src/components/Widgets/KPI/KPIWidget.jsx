// src/components/Widgets/KPI/KPIWidget.jsx
// KPI card widget displaying aggregated metric value

import React, { useEffect, useState } from 'react';
import { widgetAPI } from '../../../services/api';
import { formatCurrency, formatNumber } from '../../../utils/helpers';

const KPIWidget = ({ config, dateFilter }) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    title = 'KPI Value',
    description = '',
    metric = 'Total amount',
    aggregation = 'Sum',
    dataFormat = 'Number',
    decimalPrecision = 0,
  } = config || {};

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await widgetAPI.getKPI({ metric, aggregation, dateFilter });
        setValue(res.data.data?.value ?? 0);
      } catch {
        setValue(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [metric, aggregation, dateFilter]);

  const displayValue = () => {
    if (value === null) return '—';
    if (dataFormat === 'Currency') return formatCurrency(value, decimalPrecision);
    return formatNumber(value, decimalPrecision);
  };

  const getAccentColor = () => {
    if (aggregation === 'Sum') return '#00e5a0';
    if (aggregation === 'Average') return '#3b82f6';
    return '#f59e0b';
  };

  const accent = getAccentColor();

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px', right: '-20px',
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: `${accent}15`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
            }}
          >
            {title}
          </div>
          <div
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}33`,
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '10px',
              color: accent,
              fontWeight: '600',
            }}
          >
            {aggregation}
          </div>
        </div>
        {description && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {description}
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div
            style={{
              height: '40px',
              background: 'var(--bg-secondary)',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease infinite',
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: '700',
              fontSize: 'clamp(22px, 4vw, 32px)',
              color: accent,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {displayValue()}
          </div>
        )}
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '6px',
          }}
        >
          {metric}
        </div>
      </div>
    </div>
  );
};

export default KPIWidget;
