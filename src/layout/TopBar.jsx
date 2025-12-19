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
        background: '#020617',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.02)'
      }}
    >
      {/* LEFT: Context */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          Dashboard
        </span>
        <span
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#e5e7eb'
          }}
        >
          Admin ID: {adminId}
        </span>
      </div>

      {/* CENTER: Time */}
      <div
        style={{
          fontSize: '14px',
          color: '#cbd5f5',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {time.toLocaleTimeString()}
      </div>

      {/* RIGHT: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Admin Badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(56,189,248,0.12)',
            color: '#38bdf8',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          ADMIN
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#e5e7eb',
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#334155';
            e.target.style.borderColor = '#38bdf8';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#1e293b';
            e.target.style.borderColor = '#334155';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopBar;
