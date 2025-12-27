import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function TopBar({ adminId, onLogout }) {
  const [time, setTime] = useState(new Date());
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleLogoutClick() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const now = new Date();

      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const logoutTime = now.toTimeString().split(' ')[0]; // HH:mm:ss

      // 1️⃣ Update logout_time for today's latest login
      await supabase
        .from('admin_details')
        .update({ logout_time: logoutTime })
        .eq('admin_id', adminId)
        .eq('date', today)
        .is('logout_time', null);

      // 2️⃣ Logout user
      await supabase.auth.signOut();

      // 3️⃣ Continue app flow
      onLogout();
    } catch (err) {
      console.error('Logout update failed:', err);
      onLogout(); // still logout to avoid locking user
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div
      style={{
        height: '68px',
        background:
          'linear-gradient(180deg, #020617 0%, #020617 70%, #03091f 100%)',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)'
      }}
    >
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            letterSpacing: '0.1em',
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

      {/* CENTER TIME */}
      <div
        style={{
          fontSize: '14px',
          color: '#cbd5f5',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {time.toLocaleTimeString()}
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(56,189,248,0.12)',
            color: '#38bdf8',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}
        >
          ADMIN
        </div>

        <button
          onClick={handleLogoutClick}
          disabled={loggingOut}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#e5e7eb',
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: loggingOut ? 'not-allowed' : 'pointer',
            opacity: loggingOut ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (!loggingOut) {
              e.target.style.background = '#334155';
              e.target.style.borderColor = '#38bdf8';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#1e293b';
            e.target.style.borderColor = '#334155';
          }}
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
