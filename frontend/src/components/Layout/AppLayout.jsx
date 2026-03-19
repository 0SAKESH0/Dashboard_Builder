// src/components/Layout/AppLayout.jsx
// Main layout: fixed sidebar + content area

import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon, label, exact }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: isActive ? 'rgba(0,229,160,0.1)' : 'transparent',
          border: isActive ? '1px solid rgba(0,229,160,0.2)' : '1px solid transparent',
          color: isActive ? '#00e5a0' : '#94a3b8',
          marginBottom: '4px',
        }}
      >
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '400' }}>
          {label}
        </span>
        {isActive && (
          <span
            style={{
              marginLeft: 'auto',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00e5a0',
            }}
          />
        )}
      </div>
    </NavLink>
  );
};

const AppLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ====== Sidebar ====== */}
      <aside
        style={{
          width: '220px',
          minHeight: '100vh',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00e5a0, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              ◈
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                DashCraft
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Dashboard Builder
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              padding: '0 4px',
              marginBottom: '8px',
            }}
          >
            Main Menu
          </div>

          <NavItem to="/orders" icon="📋" label="Customer Orders" />
          <NavItem to="/dashboard" icon="📊" label="Dashboard" />

          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              padding: '0 4px',
              margin: '16px 0 8px',
            }}
          >
            Configuration
          </div>

          <NavItem to="/dashboard/configure" icon="⚙️" label="Configure Dashboard" />
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              background: 'rgba(0,229,160,0.06)',
              border: '1px solid rgba(0,229,160,0.15)',
              borderRadius: '8px',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Version
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: '#00e5a0',
              }}
            >
              v1.0.0
            </div>
          </div>
        </div>
      </aside>

      {/* ====== Main Content ====== */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
