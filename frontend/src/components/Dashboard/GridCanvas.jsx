// src/components/Dashboard/GridCanvas.jsx
// React Grid Layout canvas — drag, resize, hover actions (settings + delete)

import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetRenderer from '../Widgets/WidgetRenderer';
import WidgetConfigPanel from '../Widgets/WidgetConfigPanel';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Breakpoints and column counts
const BREAKPOINTS = { lg: 1200, md: 900, sm: 480 };
const COLS = { lg: 12, md: 8, sm: 4 };
const ROW_HEIGHT = 80;

/** Floating action buttons shown on widget hover */
const WidgetOverlay = ({ onSettings, onDelete }) => (
  <div
    style={{
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      gap: '6px',
      zIndex: 1000,
      pointerEvents: 'auto',
    }}
  >
    <button
      onClick={(e) => { e.stopPropagation(); onSettings(); }}
      title="Widget settings"
      style={{
        width: '28px', height: '28px',
        background: 'rgba(30,45,68,0.95)',
        border: '1px solid rgba(59,130,246,0.4)',
        borderRadius: '7px',
        color: '#3b82f6',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.15s',
        pointerEvents: 'auto',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30,45,68,0.95)'; }}
    >
      ⚙
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      title="Remove widget"
      style={{
        width: '28px', height: '28px',
        background: 'rgba(30,45,68,0.95)',
        border: '1px solid rgba(244,63,94,0.4)',
        borderRadius: '7px',
        color: '#f43f5e',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.15s',
        pointerEvents: 'auto',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30,45,68,0.95)'; }}
    >
      ✕
    </button>
  </div>
);

/** Individual grid item wrapper with hover state */
const GridItem = ({ widget, dateFilter, onSettings, onDelete, isConfiguring, isEditing }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ height: '100%', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover border highlight */}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: '12px',
          border: `1px solid ${hovered && isEditing ? 'rgba(0,229,160,0.35)' : 'transparent'}`,
          pointerEvents: 'none', zIndex: 5,
          transition: 'border-color 0.2s',
          boxShadow: hovered && isEditing ? '0 0 0 1px rgba(0,229,160,0.1)' : 'none',
        }}
      />

      {/* Drag handle (top-left, subtle) */}
      <div
        className={isEditing ? 'drag-handle' : ''}
        style={{
          position: 'absolute', top: '8px', left: '10px',
          fontSize: '10px', color: hovered && isEditing ? 'rgba(0,229,160,0.5)' : 'transparent',
          zIndex: 10,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.05em',
          cursor: isEditing ? 'move' : 'default',
          padding: '4px',
          transition: 'color 0.2s',
          pointerEvents: isEditing ? 'auto' : 'none',
        }}
      >
        ⠿ drag
      </div>

      {/* Action buttons on hover */}
      {hovered && isEditing && (
        <WidgetOverlay
          onSettings={onSettings}
          onDelete={onDelete}
        />
      )}

      {/* Widget content */}
      <WidgetRenderer widget={widget} dateFilter={dateFilter} />
    </div>
  );
};

const GridCanvas = ({
  widgets,
  layouts,
  dateFilter,
  onLayoutChange,
  onRemoveWidget,
  onUpdateWidget,
  isEditing = false,
}) => {
  const [activeConfig, setActiveConfig] = useState(null); // widget being configured

  const handleLayoutChange = useCallback(
    (currentLayout, allLayouts) => {
      onLayoutChange(allLayouts);
    },
    [onLayoutChange]
  );

  const handleSettingsOpen = (widget) => {
    setActiveConfig(widget);
  };

  const handleSettingsClose = () => {
    setActiveConfig(null);
  };

  const handleUpdate = (widgetId, updates) => {
    onUpdateWidget(widgetId, updates);
  };

  // Empty state
  if (widgets.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          color: 'var(--text-muted)',
        }}
      >
        <div
          style={{
            width: '80px', height: '80px',
            borderRadius: '20px',
            background: 'rgba(0,229,160,0.05)',
            border: '1px dashed rgba(0,229,160,0.2)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '32px',
            marginBottom: '20px',
          }}
        >
          📊
        </div>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: '600', fontSize: '16px',
            color: 'var(--text-secondary)', marginBottom: '8px',
          }}
        >
          {isEditing ? 'Click a widget from the sidebar to add it' : 'No widgets configured'}
        </div>
        <div style={{ fontSize: '13px', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6 }}>
          {isEditing
            ? 'Choose from Charts, Tables, or KPI widgets on the left'
            : 'Go to Configure Dashboard to build your layout'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <ResponsiveGridLayout
          className="react-grid-layout"
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={ROW_HEIGHT}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={handleLayoutChange}
          margin={[14, 14]}
          containerPadding={[0, 0]}
          useCSSTransforms
          draggableHandle=".drag-handle"
        >
          {widgets.map((widget) => (
            <div key={widget.widgetId}>
              <GridItem
                widget={widget}
                dateFilter={dateFilter}
                isConfiguring={activeConfig?.widgetId === widget.widgetId}
                onSettings={() => handleSettingsOpen(widget)}
                onDelete={() => onRemoveWidget(widget.widgetId)}
                isEditing={isEditing}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Config side panel */}
      {activeConfig && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleSettingsClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 39,
            }}
          />
          <WidgetConfigPanel
            widget={activeConfig}
            onUpdate={handleUpdate}
            onClose={handleSettingsClose}
          />
        </>
      )}
    </>
  );
};

export default GridCanvas;
