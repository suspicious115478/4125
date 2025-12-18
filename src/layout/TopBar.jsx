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
        height: '60px',
        background: '#0f172a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}
    >
      <div>
        <b>Admin ID:</b> {adminId}
      </div>

      <div>
        {time.toLocaleTimeString()}
      </div>

      <button
        onClick={onLogout}
        style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default TopBar;
