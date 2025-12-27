import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function TopBar({ adminId, onLogout }) {
  const [time, setTime] = useState(new Date());
  const [loggingOut, setLoggingOut] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentState, setCurrentState] = useState(null); // 'active' | 'inactive'

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔁 Fetch current state on load
  useEffect(() => {
    if (adminId) fetchCurrentState();
  }, [adminId]);

  async function fetchCurrentState() {
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('admin_details')
      .select('state')
      .eq('admin_id', adminId)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.state) {
      setCurrentState(data.state);
    }
  }

  // ✅ UPDATE ACTIVE / INACTIVE
  async function updateState(newState) {
    if (statusLoading) return;
    setStatusLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      // 1️⃣ Get latest row
      const { data: row } = await supabase
        .from('admin_details')
        .select('id')
        .eq('admin_id', adminId)
        .eq('date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!row) {
        console.warn('No row found to update state');
        return;
      }

      // 2️⃣ Update state
      const { error } = await supabase
        .from('admin_details')
        .update({ state: newState })
        .eq('id', row.id);

      if (!error) {
        setCurrentState(newState);
      } else {
        console.error('State update failed:', error);
      }
    } finally {
      setStatusLoading(false);
    }
  }

  // 🚪 LOGOUT
 async function handleLogoutClick() {
  if (loggingOut) return;
  setLoggingOut(true);

  try {
    const now = new Date();
    const logoutTime = now.toTimeString().split(' ')[0]; // HH:mm:ss

    // 1️⃣ Fetch latest active session
    const { data: row, error } = await supabase
      .from('admin_details')
      .select('id')
      .eq('admin_id', adminId)
      .is('logout_time', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Fetch session failed:', error);
    }

    if (row) {
      // 2️⃣ Force inactive on logout
      const { error: updateError } = await supabase
        .from('admin_details')
        .update({
          logout_time: logoutTime,
          state: 'inactive'   // ✅ ALWAYS SET
        })
        .eq('id', row.id);

      if (updateError) {
        console.error('Logout update failed:', updateError);
      }
    }

    // 3️⃣ Logout user
    await supabase.auth.signOut();
    onLogout();
  } catch (err) {
    console.error('Unexpected logout error:', err);
    onLogout();
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
        padding: '0 28px'
      }}
    >
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.1em' }}>
          Dashboard
        </span>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#e5e7eb' }}>
          Admin ID: {adminId}
        </span>
      </div>

      {/* CENTER */}
      <div
        style={{
          fontSize: '14px',
          color: '#cbd5f5',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {time.toLocaleTimeString()}
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* ACTIVE / INACTIVE TOGGLE */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <StatusButton
            label="Active"
            active={currentState === 'active'}
            color="#22c55e"
            onClick={() => updateState('active')}
          />
          <StatusButton
            label="Inactive"
            active={currentState === 'inactive'}
            color="#ef4444"
            onClick={() => updateState('inactive')}
          />
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogoutClick}
          disabled={loggingOut}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#e5e7eb',
            padding: '8px 18px',
            borderRadius: '10px',
            cursor: 'pointer',
            opacity: loggingOut ? 0.6 : 1
          }}
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

/* =====================
   STATUS BUTTON
===================== */

function StatusButton({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        border: active ? `1px solid ${color}` : '1px solid #334155',
        background: active ? `${color}22` : 'transparent',
        color: active ? color : '#94a3b8',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
}

export default TopBar;

