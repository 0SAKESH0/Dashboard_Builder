// src/hooks/useDashboard.js
// Custom hook for dashboard configuration state, save and load

import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../services/api';

const useDashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [], md: [], sm: [] });
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load dashboard config from backend on mount
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.load();
      const data = res.data.data;
      if (data) {
        setDateFilter(data.dateFilter || 'all');
        if (data.widgets && data.widgets.length > 0) {
          setWidgets(data.widgets);
          // Rebuild layouts from saved widget layout data
          const lgLayouts = data.widgets.map((w) => ({
            i: w.widgetId,
            x: w.layout?.x ?? 0,
            y: w.layout?.y ?? 0,
            w: w.layout?.w ?? 4,
            h: w.layout?.h ?? 4,
            minW: w.layout?.minW ?? 2,
            minH: w.layout?.minH ?? 2,
          }));
          setLayouts({ lg: lgLayouts, md: lgLayouts, sm: lgLayouts });
        }
      }
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Save dashboard config to backend
  const saveDashboard = async () => {
    setSaving(true);
    try {
      // Merge layout positions into widgets before saving
      const widgetsWithLayout = widgets.map((w) => {
        const layoutItem = layouts.lg?.find((l) => l.i === w.widgetId);
        return {
          ...w,
          layout: layoutItem
            ? {
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h,
                minW: layoutItem.minW ?? 2,
                minH: layoutItem.minH ?? 2,
              }
            : w.layout,
        };
      });

      await dashboardAPI.save({ widgets: widgetsWithLayout, dateFilter });
      return true;
    } catch (err) {
      setError('Failed to save dashboard');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Add a new widget to the dashboard
  const addWidget = (widget) => {
    setWidgets((prev) => [...prev, widget]);
    const layoutItem = {
      i: widget.widgetId,
      x: (prev) => {
        // Find next available position
        return 0;
      },
      y: Infinity, // puts it at the bottom
      w: widget.layout?.w ?? 4,
      h: widget.layout?.h ?? 4,
      minW: widget.layout?.minW ?? 2,
      minH: widget.layout?.minH ?? 2,
    };

    setLayouts((prev) => ({
      lg: [
        ...(prev.lg || []),
        {
          i: widget.widgetId,
          x: 0,
          y: Infinity,
          w: widget.layout?.w ?? 4,
          h: widget.layout?.h ?? 4,
          minW: widget.layout?.minW ?? 2,
          minH: widget.layout?.minH ?? 2,
        },
      ],
      md: [
        ...(prev.md || []),
        {
          i: widget.widgetId,
          x: 0,
          y: Infinity,
          w: Math.min(widget.layout?.w ?? 4, 8),
          h: widget.layout?.h ?? 4,
          minW: 2,
          minH: 2,
        },
      ],
      sm: [
        ...(prev.sm || []),
        {
          i: widget.widgetId,
          x: 0,
          y: Infinity,
          w: 4,
          h: widget.layout?.h ?? 4,
          minW: 2,
          minH: 2,
        },
      ],
    }));
  };

  // Remove a widget from the dashboard
  const removeWidget = (widgetId) => {
    setWidgets((prev) => prev.filter((w) => w.widgetId !== widgetId));
    setLayouts((prev) => ({
      lg: (prev.lg || []).filter((l) => l.i !== widgetId),
      md: (prev.md || []).filter((l) => l.i !== widgetId),
      sm: (prev.sm || []).filter((l) => l.i !== widgetId),
    }));
  };

  // Update a widget's configuration
  const updateWidget = (widgetId, config) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.widgetId === widgetId ? { ...w, ...config } : w
      )
    );
  };

  // Update layout positions from React Grid Layout's onChange
  const updateLayouts = (newLayouts) => {
    setLayouts(newLayouts);
  };

  return {
    widgets,
    layouts,
    dateFilter,
    setDateFilter,
    loading,
    saving,
    error,
    loadDashboard,
    saveDashboard,
    addWidget,
    removeWidget,
    updateWidget,
    updateLayouts,
  };
};

export default useDashboard;
