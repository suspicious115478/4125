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
        height: '64px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          Logged in as
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>
          Admin ID: {adminId}
        </span>
      </div>

      {/* Center */}
      <div
        style={{
          fontSize: '14px',
          color: '#374151',
          fontWeight: 500
        }}
      >
        {time.toLocaleTimeString()}
      </div>

      {/* Right */}
      <button
        onClick={onLogout}
        style={{
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          padding: '6px 14px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}
        onMouseOver={(e) => (e.target.style.background = '#e5e7eb')}
        onMouseOut={(e) => (e.target.style.background = '#f3f4f6')}
      >
        Logout
      </button>
    </div>
  );
}

export default TopBar;
