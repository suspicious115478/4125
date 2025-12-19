import { useEffect, useState } from 'react';

function TopBar({ adminId, onLogout }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: '68px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px'
      }}
    >
      {/* LEFT: Page context */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '12px',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Dashboard
        </span>
        <span
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#111827'
          }}
        >
          Admin ID: {adminId}
        </span>
      </div>

      {/* CENTER: Clock */}
      <div
        style={{
          fontSize: '14px',
          color: '#4b5563',
          fontWeight: 500
        }}
      >
        {time.toLocaleTimeString()}
      </div>

      {/* RIGHT: User + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* User Chip */}
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '999px',
            background: '#f3f4f6',
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151'
          }}
        >
          Admin
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) =>
            (e.target.style.background = '#1f2937')
          }
          onMouseOut={(e) =>
            (e.target.style.background = '#111827')
          }
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopBar;
