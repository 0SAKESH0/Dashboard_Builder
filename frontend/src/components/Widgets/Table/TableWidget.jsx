// src/components/Widgets/Table/TableWidget.jsx
// Data table widget with pagination, sort, and filters

import React, { useEffect, useState, useCallback } from 'react';
import { widgetAPI } from '../../../services/api';
import { getStatusClass, formatCurrency } from '../../../utils/helpers';

const TableWidget = ({ config, dateFilter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const {
    title = 'Table',
    description = '',
    columns = ['Customer name', 'Product', 'Total amount', 'Status'],
    sortField = 'Order date',
    sortOrder = 'Descending',
    pagination = 10,
    fontSize = 13,
    headerBg = '#54bd95',
    filters = [],
  } = config || {};

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await widgetAPI.getTable({
        columns: columns.join(','),
        sortField,
        sortOrder,
        page,
        limit: pagination,
        dateFilter,
        filters: filters?.length ? JSON.stringify(filters) : undefined,
      });
      setData(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [columns, sortField, sortOrder, page, pagination, dateFilter, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page on config change
  useEffect(() => { setPage(1); }, [sortField, sortOrder, pagination, dateFilter]);

  const renderCell = (col, row) => {
    const val = row[col];
    if (col === 'Status') return <span className={getStatusClass(val)}>{val}</span>;
    if (col === 'Total amount' || col === 'Unit price') return formatCurrency(val);
    if (val === undefined || val === null) return '—';
    return String(val);
  };

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{title}</div>
        {description && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No data available
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${fontSize}px` }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      background: headerBg,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      style={{
                        padding: '8px 12px',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '8px 14px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {total} rows
          </span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                borderRadius: '6px', padding: '3px 8px', cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
              }}
            >
              ‹
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '0 6px' }}>
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                borderRadius: '6px', padding: '3px 8px', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '12px',
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWidget;
